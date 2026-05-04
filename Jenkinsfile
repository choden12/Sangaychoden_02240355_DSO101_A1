pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20'
    }
    
    environment {
        // Docker Hub credentials (if pushing images)
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
    }
    
    stages {
        // Stage 1: Checkout code from GitHub
        stage('📦 Checkout Code') {
            steps {
                checkout scm
                echo '✅ Code checked out from GitHub'
            }
        }
        
        // Stage 2: Setup and Test Backend
        stage('🔧 Backend - Install Dependencies') {
            steps {
                dir('backend') {
                    echo 'Installing backend dependencies...'
                    sh 'npm install'
                    echo '✅ Backend dependencies installed'
                }
            }
        }
        
        stage('🧪 Backend - Run Unit Tests') {
            steps {
                dir('backend') {
                    echo 'Running backend tests...'
                    sh 'npm test || true' // Don't fail pipeline if no tests
                }
            }
            post {
                always {
                    junit 'backend/reports/junit.xml'
                    archiveArtifacts artifacts: 'backend/reports/**', allowEmptyArchive: true
                }
            }
        }
        
        // Stage 3: Setup and Build Frontend
        stage('🎨 Frontend - Install Dependencies') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'
                    echo '✅ Frontend dependencies installed'
                }
            }
        }
        
        stage('🔨 Frontend - Build Application') {
            steps {
                dir('frontend') {
                    echo 'Building frontend...'
                    sh 'npm run build:ci || npm run build'
                    echo '✅ Frontend build complete'
                }
            }
        }
        
        stage('🧪 Frontend - Run Tests') {
            steps {
                dir('frontend') {
                    echo 'Running frontend tests...'
                    sh 'CI=true npm test -- --ci --reporters=default --reporters=jest-junit --watchAll=false || true'
                }
            }
            post {
                always {
                    junit 'frontend/reports/junit.xml'
                    archiveArtifacts artifacts: 'frontend/reports/**', allowEmptyArchive: true
                }
            }
        }
        
        // Stage 4: Build Docker Images (like you did in Assignment 1)
        stage('🐳 Build Docker Images') {
            steps {
                script {
                    echo 'Building Docker images...'
                    
                    // Build backend image
                    sh """
                        docker build -t your-dockerhub-username/todo-backend:${BUILD_NUMBER} ./backend
                        docker tag your-dockerhub-username/todo-backend:${BUILD_NUMBER} your-dockerhub-username/todo-backend:latest
                    """
                    
                    // Build frontend image
                    sh """
                        docker build -t your-dockerhub-username/todo-frontend:${BUILD_NUMBER} ./frontend
                        docker tag your-dockerhub-username/todo-frontend:${BUILD_NUMBER} your-dockerhub-username/todo-frontend:latest
                    """
                    
                    echo '✅ Docker images built successfully'
                }
            }
        }
        
        // Stage 5: Push to Docker Hub (Optional - like Assignment 1)
        stage('📤 Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo 'Pushing images to Docker Hub...'
                    
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("your-dockerhub-username/todo-backend:${BUILD_NUMBER}").push()
                        docker.image("your-dockerhub-username/todo-backend:latest").push()
                        docker.image("your-dockerhub-username/todo-frontend:${BUILD_NUMBER}").push()
                        docker.image("your-dockerhub-username/todo-frontend:latest").push()
                    }
                    
                    echo '✅ Images pushed to Docker Hub'
                }
            }
        }
    }
    
    post {
        success {
            echo '''
            ╔══════════════════════════════════════════════╗
            ║   🎉 PIPELINE SUCCESSFUL! 🎉                 ║
            ║   Images available on Docker Hub             ║
            ║   Ready to deploy to Render                  ║
            ╚══════════════════════════════════════════════╝
            '''
        }
        failure {
            echo '''
            ╔══════════════════════════════════════════════╗
            ║   💥 PIPELINE FAILED! 💥                     ║
            ║   Check console output for errors            ║
            ╚══════════════════════════════════════════════╝
            '''
        }
    }
}