pipeline {
  agent {
    docker {
      image 'node:12'
    }
  }
  stages {
    stage('checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install Deps') {
      steps {
        sh "cd ${WORKSPACE}/Backend"
        sh "npm install"
        sh "cd ${WORKSPACE}/Frontend"
        sh "npm install"
        sh "cd ${WORKSPACE}/SharedUtils"
        sh "npm install"
      }
    }
    stage('Test Backend') {
      steps {
        sh "cd ${WORKSPACE}/Backend"
        sh "npm run test:ci"
      }
    }
    stage('Lint Frontend') {
      steps {
        sh "cd ${WORKSPACE}/Frontend"
        sh "npm run lint"
      }
    }
    stage('Build Frontend') {
      steps {
        sh "cd ${WORKSPACE}/Frontend"
        sh "npm run dist"
      }
    }
    stage('Push Backend') {
      steps {
        if (env.TAG) {
          sh "echo '$DOCKER_PAT' | docker login --username $DOCKER_USER --password-stdin"
          sh "./scripts/deploy/push_api_docker.sh $TAG"
        }
      }
    }
    stage('Push Frontend') {
      steps {
        if (env.TAG) {
          sh "echo '$DOCKER_PAT' | docker login --username $DOCKER_USER --password-stdin"
          sh "./scripts/deploy/push_static_docker.sh $TAG"
          sh "./scripts/deploy/push_static_s3.sh $TAG"
        }
      }
    }
  }
  environment {
    example = 'value'
  }
}
