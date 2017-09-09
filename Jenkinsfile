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
        sh 'docker-compose -f docker/dev/docker-compose.yml run app yarn test:integration'
      }
    }
  }
}