pipeline {
    permagent

    environment {
        AWS_REGION     = 'us-east-2'
        AWS_ACCOUNT_ID = '288673275952'

        ECR_REPOSITORY = 'aiza-devops'
        IMAGE_NAME     = 'aiza-devops'
        IMAGE_TAG      = "${BUILD_NUMBER}"

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_IMAGE    = "${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"

        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:${env.PATH}"
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Verify Project Files') {
            steps {
                sh '''
                    pwd
                    ls -la

                    test -f index.html
                    test -f Dockerfile
                '''
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                    docker --version
                    aws --version
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=aiza-devops \
                            -Dsonar.projectName=aiza-devops \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=.git/*,node_modules/,kubernetes/* \
                            -Dsonar.sourceEncoding=UTF-8
                        """
                    }
                }
            }
        }

        stage('Check AWS Credentials') {
            steps {
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ]) {
                    sh '''
                        aws sts get-caller-identity
                    '''
                }
            }
        }

        stage('Check ECR Repository') {
            steps {
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ]) {
                    sh '''
                        aws ecr describe-repositories \
                            --repository-names "$ECR_REPOSITORY" \
                            --region "$AWS_REGION"
                    '''
                }
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ]) {
                    sh '''
                        aws ecr get-login-password \
                            --region "$AWS_REGION" |
                        docker login \
                            --username AWS \
                            --password-stdin "$ECR_REGISTRY"
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                        -t "$IMAGE_NAME:$IMAGE_TAG" \
                        .
                '''
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                    docker tag \
                        "$IMAGE_NAME:$IMAGE_TAG" \
                        "$ECR_IMAGE"

                    docker tag \
                        "$IMAGE_NAME:$IMAGE_TAG" \
                        "$ECR_REGISTRY/$ECR_REPOSITORY:latest"
                '''
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                sh '''
                    docker push "$ECR_IMAGE"
                    docker push "$ECR_REGISTRY/$ECR_REPOSITORY:latest"
                '''
            }
        }

        stage('Verify Image in ECR') {
            steps {
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ]) {
                    sh '''
                        aws ecr describe-images \
                            --repository-name "$ECR_REPOSITORY" \
                            --region "$AWS_REGION"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully."
            echo "Image pushed to ${ECR_IMAGE}"
        }

        failure {
            echo "Pipeline failed. Check the first error in Console Output."
        }

        always {
            sh '''
                docker logout "$ECR_REGISTRY" || true
            '''
        }
    }
}
