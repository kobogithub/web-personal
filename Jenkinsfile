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
    
    stage('Checkout') {
        steps {
            dir('workspace') {  // Creamos un directorio específico
                deleteDir()     // Limpiamos el directorio
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${GITHUB_BRANCH}"]],  // Asterisco añadido
                    extensions: [[$class: 'CleanBeforeCheckout']],  // Limpieza antes del checkout
                    userRemoteConfigs: [[
                        url: "${GITHUB_REPO}",
                        credentialsId: "${GITHUB_CREDENTIALS}"
                    ]]
                ])
            }
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
