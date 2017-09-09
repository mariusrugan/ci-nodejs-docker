pipeline {
  agent any
  stages {
    stage('Prepare docker images') {
      steps {
        sh 'docker-compose -f docker/dev/docker-compose.yml pull'
        sh 'docker-compose -f docker/dev/docker-compose.yml build --pull'
      }
    }
    stage('Ensure database is up & running') {
      steps {
        sh 'docker-compose -f docker/dev/docker-compose.yml run --rm agent'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Test Unit": {
            sh 'docker-compose -f docker/dev/docker-compose.yml run --rm app yarn test:unit'
            
          },
          "Test Integration": {
            sh 'docker-compose -f docker/dev/docker-compose.yml run --rm app yarn test:integration'
            
          }
        )
      }
    }
  }
}