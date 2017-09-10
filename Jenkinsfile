pipeline {
  agent any
  stages {
    stage('Prepare docker images') {
      steps {
        sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml pull'
        sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml build --pull'
      }
    }
    stage('Ensure database is up & running') {
      steps {
        sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml run --rm agent'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Integration tests": {
            sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml run --no-deps --name app-integration-tests app yarn test:integration -- --testResultsProcessor jest-junit'
            sh 'docker cp app-integration-tests:/app/junit.xml ./integration-tests.junit.xml'
          },
          "Unit tests": {
            sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml run --no-deps --name app-unit-tests app yarn test:unit -- --testResultsProcessor jest-junit'
            sh 'docker cp app-unit-tests:/app/junit.xml ./unit-tests.junit.xml'
          }
        )
      }
    }
    stage('Publish test') {
      steps {
        junit './*.xml'
      }
    }
  }
  post {
      always { 
          sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml kill'
          sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml rm -f -v'
          sh 'docker images -q -f dangling=true -f label=application=ci-nodejs-docker | xargs -I ARGS docker rmi -f ARGS'
      }
  }
}