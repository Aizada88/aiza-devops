pipeline {
    agent any

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
                    echo "Current directory:"
                    pwd

                    echo "Repository files:"
                    ls -la

                    echo "Application directory:"
                    ls -la aiza-devops

                    test -f aiza-devops/package.json
                    test -f aiza-devops/Dockerfile
                '''
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                    echo "========== Node Version =========="
                    node --version

                    echo "========== NPM Version =========="
                    npm --version

                    echo "========== Docker Version =========="
                    docker --version

                    echo "========== AWS CLI Version =========="
                    aws --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('aiza-devops') {
                    sh '''
                        if [ -f package-lock.json ]; then
                            npm ci
                        else
                            npm install
                        fi
                    '''
                }
            }
        }

        stage('Build Application') {
            steps {
                dir('aiza-devops') {
                    sh '''
                        npm run build
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('aiza-devops') {
                    script {
                        def scannerHome = tool 'SonarScanner'

                        withSonarQubeEnv('SonarQube') {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=aiza-devops \
                                -Dsonar.projectName=aiza-devops \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=node_modules/*,build/,dist/,coverage/* \
                                -Dsonar.sourceEncoding=UTF-8
                            """
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
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
                dir('aiza-devops') {
                    sh '''
                        docker build \
                            -t "$IMAGE_NAME:$IMAGE_TAG" \
                            .
                    '''
                }
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

                    docker push \
                        "$ECR_REGISTRY/$ECR_REPOSITORY:latest"
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
                            --region "$AWS_REGION" \
                            --image-ids imageTag="$IMAGE_TAG"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
            echo "Image pushed to ${ECR_IMAGE}"
        }

        failure {
            echo 'Pipeline failed. Check the first error in Console Output.'
        }

        always {
            sh '''
                docker logout "$ECR_REGISTRY" || true
            '''
        }
    }
}
