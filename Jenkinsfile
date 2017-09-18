pipeline {
  agent any
  environment {
    PROJECT_NAME = "ci_nodejs_${BUILD_ID}"
    COMPOSE_FILE = "docker/dev/docker-compose.yml"
  }
  stages {
    stage('Pull & Build Images') {
      steps {
        sh 'docker-compose -f ${COMPOSE_FILE} build --pull'
      }
    }
    stage('Test') {
      environment {
        INTEGRATION_APP = "app-integration-tests-${BUILD_ID}"
        UNIT_APP = "app-unit-tests-${BUILD_ID}"
      }
      steps {
        parallel(
          "Integration tests": {
            sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run -u root --name ${INTEGRATION_APP} app yarn test:integration --testResultsProcessor jest-junit'
          },
          "Unit tests": {
            sh '''
               docker run --entrypoint yarn --name ${UNIT_APP} chicocode/ci-nodejs-docker test:unit --testResultsProcessor jest-junit
               docker cp ${UNIT_APP}:/app/coverage/lcov-report ./coverage
            '''
            publishHTML (target: [
              allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: 'coverage',
              reportFiles: 'index.html',
              reportName: "Istanbul Coverage Report"
            ])
          }
        )
     }
     post {
        always {
          sh '''
             docker cp ${INTEGRATION_APP}:/app/junit.xml ./integration-tests.junit.xml
             docker cp ${UNIT_APP}:/app/junit.xml ./unit-tests.junit.xml
          '''
          junit '*.junit.xml'
          sh 'docker rm ${UNIT_APP}'
        }
      }
    }
    stage('Deploy') {
      agent none
      environment {
        APP = "app-${BUILD_ID}"
      }
      when {
        branch 'release'
      }
      steps {
        script {
          version = sh(returnStdout: true, script: 'cat app/package.json | grep version | head -1 | awk -F: \'{ print $2 }\' | sed \'s/[",]//g\' | tr -d \'[[:space:]]\'')
          timeout(time: 15, unit: 'SECONDS') {
            env.new_version = input message: 'Bump version (current version: ' + version + ')',
              parameters: [text(name: 'New version', defaultValue: version, description: 'app\'s new version')]
          }
          sh '''
              docker run --entrypoint sh --name ${APP} chicocode/ci-nodejs-docker -c "yarn version --new-version ${new_version} && yarn compile"
              docker cp ${APP}:app/build/ ./package
              docker cp ${APP}:app/package.json ./package/package.json
              docker cp ${APP}:app/yarn.lock ./package/yarn.lock
              docker build -t chicocode/nodejs-release -f docker/release/Dockerfile .
          '''
        }
      }
      post {
          always {
              sh 'docker rm ${APP}'
          }
      }
    }
  }
  post {
      always {
          sh '''
             docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} stop
             docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} rm -f -v
             docker network ls --filter name=${BUILD_ID}_default -q | xargs -I ARGS docker network rm ARGS
          '''
      }
  }
}
