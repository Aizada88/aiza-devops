pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Show Repository') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Show Project Structure') {
            steps {
                sh 'tree -L 2 || find . -maxdepth 2'
            }
        }

        stage('Check Git') {
            steps {
                sh 'git --version'
            }
        }

        stage('Finished') {
            steps {
                echo 'Pipeline completed successfully!'
            }
        }

    }
}
