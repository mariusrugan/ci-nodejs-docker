pipeline {
    agent any
    stages { 
        stage('Test') {
            steps {
                sh 'docker-compose -f docker/dev/docker-compose.yml pull'
            }
        }
    }
}