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
      def workspace = pwd()
      sh "cd ${workspace}/Backend"
      sh "npm install"
      sh "cd ${workspace}/Frontend"
      sh "npm install"
      sh "cd ${workspace}/SharedUtils"
      sh "npm install"
    }
    stage('Test Backend') {
      def workspace = pwd()
      sh "cd ${workspace}/Backend"
      sh "npm run test:ci"
    }
    stage('Lint Frontend') {
      def workspace = pwd()
      sh "cd ${workspace}/Frontend"
      sh "npm run lint"
    }
    stage('Build Frontend') {
      def workspace = pwd()
      sh "cd ${workspace}/Frontend"
      sh "npm run dist"
    }
    stage('Push Backend') {
      if (env.TAG) {
        sh "echo '$DOCKER_PAT' | docker login --username $DOCKER_USER --password-stdin"
        sh "./scripts/deploy/push_api_docker.sh $TAG"
      }
    }
    stage('Push Frontend') {
      if (env.TAG) {
        sh "echo '$DOCKER_PAT' | docker login --username $DOCKER_USER --password-stdin"
        sh "./scripts/deploy/push_static_docker.sh $TAG"
        sh "./scripts/deploy/push_static_s3.sh $TAG"
      }
    }
  }
  environment {
    example = 'value'
  }
}
