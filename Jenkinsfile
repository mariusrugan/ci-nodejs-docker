pipeline {
  agent any
  environment {
    PROJECT_NAME = "ci_nodejs_${BUILD_ID}"
    COMPOSE_FILE = "docker/dev/docker-compose.yml"
  }
  stages {
    stage('Prepare docker images') {
      steps {
        sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} pull'
        sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} build --pull'
      }
    }
    stage('Ensure database is up & running') {
      steps {
        sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run --rm agent'
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
            sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run --no-deps --rm app migrate'
            sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run --no-deps --name ${INTEGRATION_APP} app yarn test:integration -- --testResultsProcessor 
            jest-junit'
          },
          "Unit tests": {
            sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run --no-deps --name ${UNIT_APP} app yarn test:unit -- --testResultsProcessor jest-junit'
            sh 'docker cp ${UNIT_APP}:/app/coverage/lcov-report ./coverage'
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
          sh 'docker cp ${INTEGRATION_APP}:/app/junit.xml ./integration-tests.junit.xml'
          sh 'docker cp ${UNIT_APP}:/app/junit.xml ./unit-tests.junit.xml'
          junit '*.junit.xml'
        }
      }
    }
    stage('Generate artifacts') {
      environment {
        APP = "app-${BUILD_ID}"
      }
      steps {
        sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run --no-deps --name ${APP} app yarn compile'
        sh 'docker cp ${APP}:/app/build ./build'
        sh 'cp app/package.json app/yarn.lock build'
        sh 'tar -cvzf build.tar.gz build'
        archiveArtifacts artifacts: '*.tar.gz', fingerprint: true
      }
    }
  }
  post {
      always {
          sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} stop'
          sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} rm -f -v'
          sh 'docker images -q -f dangling=true -f label=application=ci-nodejs-docker | xargs -I ARGS docker rmi -f ARGS'
          sh 'docker network ls --filter name=${BUILD_ID}_default -q | xargs docker network rm'
      }
  }
}
