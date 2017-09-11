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
      steps {
        parallel(
          "Integration tests": {
            sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run --no-deps --name app-integration-tests-${BUILD_ID} app yarn test:integration -- --testResultsProcessor jest-junit'
          },
          "Unit tests": {
            sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} run --no-deps --name app-unit-tests--${BUILD_ID} app yarn test:unit -- --testResultsProcessor jest-junit'
            sh 'docker cp app-unit-tests:/app/coverage/lcov-report ./coverage'
            publishHTML (target: [
              allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: 'coverage',
              reportFiles: 'index.html',
              reportName: "Istanbul coverage report"
            ])
          }
        )
     }
     post {
        always {
          sh 'docker cp app-integration-tests-${BUILD_ID}:/app/junit.xml ./integration-tests.junit.xml'
          sh 'docker cp app-unit-tests-${BUILD_ID}:/app/junit.xml ./unit-tests.junit.xml'
          junit '*.junit.xml'
        }
      }
    }
  }
  post {
      always { 
          sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} stop'
          sh 'docker-compose -p ${PROJECT_NAME} -f ${COMPOSE_FILE} rm -f -v'
          sh 'docker images -q -f dangling=true -f label=application=ci-nodejs-docker | xargs -I ARGS docker rmi -f ARGS'
          sh 'docker network ls --filter name=cinodejs${BUILD_ID}_default -q | xargs docker network rm'
      }
  }
}