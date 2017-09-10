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
  }
  post {
      always { 
          sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml kill'
          sh 'docker-compose -p ci-nodejs-${BUILD_ID} -f docker/dev/docker-compose.yml rm -f -v'
          sh 'docker images -q -f dangling=true -f label=application=ci-nodejs-docker | xargs -I ARGS docker rmi -f ARGS'
      }
  }
}