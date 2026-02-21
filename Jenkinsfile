pipeline {
    agent { label 'PC_Lycee' }

    environment {
        // --- CONFIGURATION ---
        DOCKER_USER  = 'kiki344r'
        IMAGE_NAME   = 'glyria-cloud-backend'
        REGISTRY_ID  = 'docker-hub-creds'
        // On récupère le Tag Git s'il existe, sinon on utilise le Build Number
        APP_VERSION  = sh(script: "git describe --tags --exact-match HEAD || echo ${env.BUILD_NUMBER}", returnStdout: true).trim()
    }

    stages {
        stage('Initialisation') {
            steps {
                echo "🚀 Démarrage du build version: ${env.APP_VERSION}"
                deleteDir()
                checkout scm
            }
        }

        stage('Docker Build & Tag') {
            steps {
                script {
                    // Build de l'image avec la version dynamique
                    appImage = docker.build("${DOCKER_USER}/${IMAGE_NAME}:${env.APP_VERSION}")
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', REGISTRY_ID) {
                        // On pousse la version précise (Tag Git ou Build Number)
                        appImage.push()

                        // On met aussi à jour 'latest' pour Portainer
                        appImage.push('latest')
                    }
                }
            }
        }

        stage('Notification Portainer') {
            // Optionnel : décommente si tu as configuré ton Webhook Portainer
            /*
            steps {
                withCredentials([string(credentialsId: 'PORTAINER_WEBHOOK_URL', variable: 'WEBHOOK')]) {
                    sh "curl -X POST ${WEBHOOK}"
                }
            }
            */
            steps {
                echo "🔔 Notifier Portainer que la version ${env.APP_VERSION} est prête."
            }
        }
    }

    post {
        success {
            echo "✅ Terminé ! Image disponible : ${DOCKER_USER}/${IMAGE_NAME}:${env.APP_VERSION}"
        }
        failure {
            echo "❌ Échec du build. Vérifie les logs de ton i9."
        }
        always {
            // Nettoyage des images locales pour économiser l'espace disque du PC_Lycee
            sh "docker rmi ${DOCKER_USER}/${IMAGE_NAME}:${env.APP_VERSION} || true"
        }
    }
}