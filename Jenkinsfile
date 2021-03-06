pipeline {
  agent any

  environment {
    COMPOSE_FILE = "docker/build/docker-compose.yml"

    REL_IMAGE = "mariusrugan/articles_app"
    BUILD_IMAGE = "${REL_IMAGE}:build"

    DOCKER_DISTRIBUTION = "https://registry.hub.docker.com"
    REPO = "github.com/mariusrugan/ci-nodejs-docker.git"
    GIT_EMAIL = "mariusrugan@gmail.com"
  }

  stages {
    stage('Pull & Build Images') {
      steps { 
        script {
          env.TAG = sh(returnStdout: true, script: "echo ${BUILD_TAG} | tr -dc '[:alnum:].-_\n\r'").trim()
          env.APP = "app-${env.TAG}"
          env.INTEGRATION_APP = "app-integration-tests-${env.TAG}"
          env.ACCEPTANCE_APP = "app-acceptance-tests-${env.TAG}"
          env.UNIT_APP = "app-unit-tests-${env.TAG}"
          env.PROJECT_NAME = "article_app_${env.TAG}"
        }
        sh 'docker-compose -f ${COMPOSE_FILE} build --pull'
      }
    }

    stage('Test') {
      steps {
        parallel(
          "Integration tests": {
            sh 'docker-compose -p ${PROJECT_NAME}-integration -f ${COMPOSE_FILE} run --name ${INTEGRATION_APP} app yarn test:integration --testResultsProcessor jest-junit'
          },
          "Acceptance tests": {
            sh 'docker-compose -p ${PROJECT_NAME}-acceptance -f ${COMPOSE_FILE} run --name ${ACCEPTANCE_APP} app yarn test:acceptance --testResultsProcessor jest-junit'
          },
          "Unit tests": {
            sh '''
               docker run --entrypoint yarn --name ${UNIT_APP} ${BUILD_IMAGE} test:unit --testResultsProcessor jest-junit
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
             docker cp ${ACCEPTANCE_APP}:/app/junit.xml ./acceptance-tests.junit.xml
             docker cp ${UNIT_APP}:/app/junit.xml ./unit-tests.junit.xml
             docker-compose -p ${PROJECT_NAME}-acceptance -f ${COMPOSE_FILE} down -v
             docker-compose -p ${PROJECT_NAME}-integration -f ${COMPOSE_FILE} down -v
          '''
          junit '*.junit.xml'
          sh 'docker rm ${UNIT_APP}'
        }
      }
    }

    stage('Bump & build') {
      when { branch 'release' }

      steps {
        script {
          version = sh(returnStdout: true, script: 'jq -r .version app/package.json').trim()
          patch = sh(returnStdout: true, script: "semver bump patch ${version}").trim()
          minor = sh(returnStdout: true, script: "semver bump minor ${version}").trim()
          major = sh(returnStdout: true, script: "semver bump major ${version}").trim()
          milestone()
          timeout(time: 2, unit: 'DAYS') {
            env.RELEASE_SCOPE = input message: '🦄 Please answer the unicorn', ok: 'Release!',
              parameters: [choice(name: 'RELEASE_SCOPE', choices: "👽 unchanged ${version}\n🔥 patch ${patch}\n👹 minor ${minor}\n🎉 major ${major}", description: '🌈 What is the release scope? 🌈')]
          }
          milestone()
          version_number = sh(returnStdout: true, script: "echo ${env.RELEASE_SCOPE} | sed -e 's/👽 unchanged //' | sed -e 's/🔥 patch //' | sed -e 's/👹 minor //' | sed -e 's/🎉 major //' ").trim()
          echo "scope: ${env.RELEASE_SCOPE}"
          sh """
              docker run --entrypoint sh --name ${APP} ${BUILD_IMAGE} -c 'yarn compile && yarn version --new-version ${version_number}'
              docker cp ${APP}:app/dist/ ./package
              docker cp ${APP}:app/package.json ./package/package.json
              docker cp ${APP}:app/yarn.lock ./package/yarn.lock
              cp package/package.json app/package.json
          """
        }
      }
    }

    stage('Deploy') {
      agent none
      when { branch 'release' }

      steps {
        parallel(
          "Generate Artfacts": {
            sh "tar -cvzf package-${TAG}.tar.gz package"
            archiveArtifacts artifacts: '*.tar.gz', fingerprint: true
          },
          "Push Distribution Image": {
            script {
              rel = docker.build("${REL_IMAGE}", "-f docker/release/Dockerfile .")
              docker.withRegistry("${DOCKER_DISTRIBUTION}", "dockerhub-credentials") {
                rel.push("latest")
                rel.push(version_number)
              }
            }
          },
          "Update git": {
            withCredentials([usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
              sh """
                git config --global user.name '${GIT_USERNAME}'
                git config --global user.email '${GIT_EMAIL}'
                git add app/package.json
                git commit --allow-empty -m 'Unicorn says new release! scope: ${env.RELEASE_SCOPE}'
                git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/mariusrugan/ci-nodejs-docker.git HEAD:release
              """
            }
          }
        )
      }

      post { always { sh 'docker rm ${APP}' } }
    }

    stage("Update cluster") {

      when { branch 'release' }

      steps {
        echo "To deploy just update running containers to version ${version_number}. (don't forget to run migrations!)"
      }
    }
  }
  post { always { deleteDir() } }
}
