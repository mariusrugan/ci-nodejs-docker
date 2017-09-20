pipeline {
  agent any
  environment {
    PROJECT_NAME = "article_app_${BUILD_TAG}"
    COMPOSE_FILE = "docker/dev/docker-compose.yml"
    REL_IMAGE = "chicocode/articles_app"
    DEV_IMAGE = "${REL_IMAGE}:dev"
    DOCKER_DISTRIBUTION = "https://registry.hub.docker.com"
    REPO = "github.com/chicocode/ci-nodejs-docker.git"
    GIT_EMAIL = "eu@chicocode.io"
  }
  stages {
    stage('Pull & Build Images') {
      steps {
        sh 'docker-compose -f ${COMPOSE_FILE} build --pull'
        input message: 'Which environment?', ok: 'Continuar', parameters: [[$class: 'ChoiceParameterDefinition', choices: 'Red\nBlue\nGreen', description: 'Descrição', name: 'ambiente']]
      }
    }
    stage('Test') {
      environment {
        INTEGRATION_APP = "app-integration-tests-${BUILD_TAG}"
        UNIT_APP = "app-unit-tests-${BUILD_TAG}"
      }
      steps {
        parallel(
          "Integration tests": {
            sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run -u root --name ${INTEGRATION_APP} app yarn test:integration --testResultsProcessor jest-junit'
          },
          "Unit tests": {
            sh '''
               docker run --entrypoint yarn --name ${UNIT_APP} ${DEV_IMAGE} test:unit --testResultsProcessor jest-junit
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
        APP = "app-${BUILD_TAG}"
      }
      when {
        branch 'release'
      }
      steps {
        script {
          version = sh(returnStdout: true, script: 'cat app/package.json | jq .version')
          timeout(time: 15, unit: 'SECONDS') {
            patch = sh(returnStdout: true, script: "semver bump patch ${version}")
            minor = sh(returnStdout: true, script: "semver bump patch ${version}")
            major = sh(returnStdout: true, script: "semver bump patch ${version}")
            env.new_version = input message: "Bump version (current version: ${version})",
              parameters: [text(name: 'New version', defaultValue: new_version, description: 'app\'s new version')]
          }
          sh """
              docker run --entrypoint sh --name ${APP} ${DEV_IMAGE} -c 'yarn compile && yarn version --new-version ${new_version}'
              docker cp ${APP}:app/build/ ./package
              docker cp ${APP}:app/package.json ./package/package.json
              docker cp ${APP}:app/yarn.lock ./package/yarn.lock
              cp package/package.json app/package.json
          """
          rel = docker.build("${REL_IMAGE}", "-f docker/release/Dockerfile .")
          docker.withRegistry("${DOCKER_DISTRIBUTION}", "docker-hub-credentials") {
            rel.push("latest")
            rel.push("0.0.4")
          }
          withCredentials([usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
            sh """
              git add app/package.json
              git config --global user.name '${GIT_USERNAME}'
              git config --global user.email '${GIT_EMAIL}'
              git commit -m 'Jenkins bumped to version ${new_version}'
              git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/chicocode/ci-nodejs-docker.git HEAD:release
            """
          }
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
             docker network ls --filter name=$(${BUILD_TAG} | sed 's/\\(\\-\\|\\_\\)//g')_default -q | xargs -I ARGS docker network rm ARGS
          '''
      }
  }
}
