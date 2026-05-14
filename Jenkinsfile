pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonage du code source...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Construction des images Docker...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} --profile prod build'
            }
        }

        stage('Test') {
            steps {
                echo 'Lancement des services...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} --profile dev up -d'
                sh 'sleep 20'
                echo 'Test du service Books...'
                sh 'curl -f http://localhost:3001/health || exit 1'
                echo 'Test du service Users...'
                sh 'curl -f http://localhost:3002/health || exit 1'
                echo 'Test du service Loans...'
                sh 'curl -f http://localhost:3003/health || exit 1'
                echo 'Test du service Recommendation...'
                sh 'curl -f http://localhost:8000/health || exit 1'
            }
        }

        stage('DVC Pipeline') {
            steps {
                echo 'Reproduction du pipeline DVC...'
                sh 'pip install dvc dvc-gdrive'
                sh 'dvc repro'
                sh 'dvc metrics show'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploiement en production...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} --profile prod up -d'
            }
        }
    }

    post {
        always {
            echo 'Nettoyage...'
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down'
        }
        success {
            echo 'Pipeline termine avec succes !'
        }
        failure {
            echo 'Pipeline echoue !'
        }
    }
}