pipeline {
    agent any
    
    environment {
        // Define tus variables
        DOCKER_IMAGE = 'web-personal'
        DOCKER_TAG = 'latest'
        GITHUB_REPO = 'https://github.com/kobogithub/web-personal.git'
        GITHUB_BRANCH = 'jenkins'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Limpia el workspace y hace checkout del repo
                cleanWs()
                git branch: "${GITHUB_BRANCH}",
                    url: "${GITHUB_REPO}"
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Construye la imagen Docker
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
    }
}
