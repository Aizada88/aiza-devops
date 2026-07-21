pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-2'
        AWS_ACCOUNT_ID = '2886-7327-5952'
        ECR_REPOSITORY = 'aiza-devops'
        IMAGE_NAME = 'aiza-devops'
        IMAGE_TAG = 'latest'

        PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:${env.PATH}"
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                echo "Node Version"
                node -v

                echo "NPM Version"
                npm -v

                echo "Docker Version"
                docker --version

                echo "AWS CLI Version"
                aws --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                npm install
                '''
            }
        }

        stage('Build Application') {
            steps {
                sh '''
                npm run build
                '''
            }
        }


