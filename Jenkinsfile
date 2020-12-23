pipeline {
  agent {
    docker {
      image 'node:12'
    }

  }
  stages {
    stage('Test') {
      steps {
        sh 'echo "test"'
      }
    }

  }
  environment {
    example = 'value'
  }
}