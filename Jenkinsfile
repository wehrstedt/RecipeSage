pipeline {
  agent any
  environment {
    HOME = '.'
  }
  stages {
    stage('Start Postgres') {
      steps {
        script {
          docker.image('postgres:9.6.9').withRun('-e "POSTGRES_USER=chefbook" -e "POSTGRES_PASSWORD=admin" -e "POSTGRES_DB=chefbook_test" -p 5432:5432') { c ->
            /* Wait until postgres service is up */
            /*sh 'while ! psql -h 0.0.0.0 -U chefbook -d chefbook_test -c "select 1" > /dev/null 2>&1; do sleep 1; done'*/
          }
        }
      }
    }
    stage('Application') {
      agent {
        docker {
          image 'node:12'
        }
      }
      stages {
        stage('Checkout') {
          steps {
            checkout scm
          }
        }
        stage('Install Deps') {
          steps {
            sh "cd Backend && npm install"
            sh "cd Frontend && npm install"
            sh "cd SharedUtils && npm install"
          }
        }
        stage('Test Backend') {
          agent {
            docker {
              image 'docker'
            }
          }
          environment {
            NODE_ENV = test
            VERBOSE = true
            POSTGRES_DB = chefbook_test
            POSTGRES_USER = chefbook
            POSTGRES_PASSWORD = admin
            POSTGRES_PORT = 5432
            POSTGRES_HOST = db
            POSTGRES_SSL = false
            POSTGRES_LOGGING = false
            GRIP_URL = 'http://localhost:5561/'
            GRIP_KEY = changeme
          }
          steps {
            script {
              docker.image('postgres:9.6.9').withRun('-e "POSTGRES_USER=chefbook" -e "POSTGRES_PASSWORD=admin" -e "POSTGRES_DB=chefbook_test" -p 5432:5432') { c ->
                /* Wait until postgres service is up */
                /*sh 'while ! psql -h 0.0.0.0 -U chefbook -d chefbook_test -c "select 1" > /dev/null 2>&1; do sleep 1; done'*/

                docker.image('node:12').inside("--link ${c.id}:db") {
                  sh 'env'
                  sh "cd Backend && npm run test:ci"
                }
              }
            }
          }
        }
        stage('Lint Frontend') {
          steps {
            sh "cd Frontend && npm run lint"
          }
        }
        stage('Build Frontend') {
          steps {
            sh "cd Frontend && npm run dist"
          }
        }
        stage('Push Backend') {
          when {
            branch 'master'
            tag '*'
          }
          steps {
            sh "echo '$DOCKER_PAT' | docker login --username $DOCKER_USER --password-stdin"
            sh "./scripts/deploy/push_api_docker.sh $TAG_NAME"
          }
        }
        stage('Push Frontend') {
          when {
            branch 'master'
            tag '*'
          }
          steps {
            sh script:'''
              sed -i "s/window.version = 'development';/window.version = '${CIRCLE_TAG}';/" www/index.html
            '''
            sh "echo '$DOCKER_PAT' | docker login --username $DOCKER_USER --password-stdin"
            sh "./scripts/deploy/push_static_docker.sh $TAG_NAME"
            sh "./scripts/deploy/push_static_s3.sh $TAG_NAME"
          }
        }
      }
    }
  }
}
