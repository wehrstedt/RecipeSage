pipeline {
  agent {
    docker {
      image 'node:12'
    }
  }
  environment {
    HOME = '.'
  }
  stages {
    stage('checkout') {
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
      steps {
        sh "cd Backend && npm run test:ci"
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
  environment {
    example = 'value'
  }
}
