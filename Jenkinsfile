pipeline {
    agent any
    
    environment {
        // Define tus variables
        DOCKER_IMAGE = 'web-personal'
        DOCKER_TAG = 'latest'
        GITHUB_REPO = 'https://github.com/kobogithub/web-personal.git'
        GITHUB_BRANCH = 'jenkins'
        GITHUB_CREDENTIALS = 'kobogithub'
    }
    
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                // Sintaxis corregida para el paso git
                checkout([$class: 'GitSCM',
                    branches: [[name: "${GITHUB_BRANCH}"]],
                    userRemoteConfigs: [[
                        url: "${GITHUB_REPO}",
                        credentialsId: "${GITHUB_CREDENTIALS}"
                    ]]
                ])
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
