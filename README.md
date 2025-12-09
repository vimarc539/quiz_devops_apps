# Quiz DevOps App

A simple quiz system with a complete DevOps pipeline including CI/CD, Docker containerization, and automated releases.

## Features

- 🎯 Quiz API with Express.js
- 🐳 Docker containerization
- 🔄 CI/CD Pipeline with GitHub Actions
- 📦 Automated releases and versioning
- 🏷️ Git tagging and Docker image publishing
- ✅ Automated testing and linting
- 🔒 Security scanning

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Docker

```bash
# Build Docker image
docker build -t quiz-app:latest .

# Run container
docker run -d -p 3000:3000 --name quiz-app quiz-app:latest

# Test health endpoint
curl http://localhost:3000/api/quiz/health
```

### Using Published Docker Image

```bash
# Pull from Docker Hub
docker pull {DOCKER_USERNAME}/quiz-app:latest

# Run container
docker run -d -p 3000:3000 --name quiz-app {DOCKER_USERNAME}/quiz-app:latest
```

## API Endpoints

- `GET /` - API information and endpoints
- `GET /api/quiz/questions` - Get all questions
- `GET /api/quiz/questions/:id` - Get specific question
- `POST /api/quiz/submit` - Submit single answer
- `POST /api/quiz/submit-all` - Submit all answers
- `GET /api/quiz/health` - Health check

## CI/CD Pipeline

The project includes automated CI/CD pipelines:

### CI Pipeline (`ci.yml`)
- Runs on pushes and pull requests to `main` and `develop` branches
- Linting and code quality checks
- Automated testing with coverage
- Security scanning
- Docker image building
- **Pushes Docker images to Docker Hub on `main` branch**

### Release Pipeline (`release.yml`)
- Triggered by Git tags (e.g., `v1.0.0`) or manual workflow dispatch
- Version management and Git tagging
- Docker image building and publishing
- GitHub Release creation with release notes

### CD Pipeline (`deploy.yml`)
- Automated deployment to Kubernetes
- Rolling updates with zero downtime
- Supports staging and production environments
- Health checks and verification
- Horizontal Pod Autoscaling (HPA)

## Release Process

See [RELEASE.md](./RELEASE.md) for detailed release documentation.

### Quick Release

1. **Via GitHub Actions UI:**
   - Go to Actions → Release Pipeline
   - Click "Run workflow"
   - Enter version (e.g., `1.0.0`)
   - Click "Run workflow"

2. **Via Git Tag:**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

## Deployment

The application can be deployed to Kubernetes using automated CD pipeline or manual deployment.

### Automated Deployment (CD Pipeline)

The CD pipeline (`deploy.yml`) automatically deploys when:
- Code is pushed to `main` branch → Production deployment
- Git tag is pushed → Deploys tagged version
- Manual workflow dispatch → Choose environment and version

**Prerequisites:**
- Kubernetes cluster configured
- GitHub Secret: `KUBECONFIG` (base64-encoded kubeconfig)

**Deploy:**
```bash
# Automatic: Push to main branch
git push origin main

# Manual: Actions → CD Pipeline → Run workflow
```

### Manual Deployment

```bash
# Update image in k8s/deployment.yaml
sed -i 's/DOCKER_USERNAME/YOUR_DOCKER_USERNAME/g' k8s/deployment.yaml

# Deploy to Kubernetes
kubectl apply -f k8s/

# Verify deployment
kubectl get pods -l app=quiz-app
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.

## Project Structure

```
quiz_devops_apps/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline
│       ├── release.yml     # Release pipeline
│       └── deploy.yml      # CD pipeline
├── k8s/                    # Kubernetes manifests
│   ├── deployment.yaml     # Deployment with resource requirements
│   ├── service.yaml        # Service for load balancing
│   ├── configmap.yaml      # Configuration
│   ├── hpa.yaml            # Horizontal Pod Autoscaler
│   ├── ingress.yaml        # Ingress (optional)
│   └── blue-green-deployment.yaml  # Blue-green deployment
├── src/
│   ├── app.js              # Express app entry point
│   ├── routes/
│   │   └── quiz.js         # Quiz routes
│   └── data/
│       └── questions.json  # Quiz questions
├── tests/                  # Test files
├── Dockerfile              # Docker image definition
├── package.json            # Dependencies and scripts
├── RELEASE.md             # Release documentation
└── DEPLOYMENT.md          # Deployment documentation
```

## Versioning

The project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Version is managed in `package.json` and automatically used for:
- Docker image tags
- Git tags
- GitHub Releases

## Docker Images

Docker images are published to Docker Hub with multiple tags:
- `{version}` - Specific version (e.g., `1.0.0`)
- `v{version}` - Version with 'v' prefix (e.g., `v1.0.0`)
- `latest` - Latest stable release
- `{branch}-{sha}` - Branch-specific tags for CI builds

## Requirements

- Node.js 18+
- Docker (for containerization)
- Kubernetes cluster (v1.20+) for deployment
- GitHub Actions (for CI/CD)
- Docker Hub account (for image publishing)
- kubectl configured and connected to cluster

## GitHub Secrets

Configure the following secrets in your GitHub repository:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token or password
- `KUBECONFIG` - Base64-encoded kubeconfig file (for CD pipeline)
- `SLACK_WEBHOOK_URL` - Slack webhook URL for CI notifications (optional)

### Setting up Slack Notifications

1. **Create a Slack Incoming Webhook:**
   - Go to https://api.slack.com/apps
   - Create a new app or select existing app
   - Go to "Incoming Webhooks" and activate it
   - Click "Add New Webhook to Workspace"
   - Select the channel where you want notifications
   - Copy the webhook URL

2. **Add to GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SLACK_WEBHOOK_URL`
   - Value: Paste your Slack webhook URL
   - Click "Add secret"

3. **Notifications will be sent:**
   - On CI pipeline completion (success or failure)
   - Includes job status, commit info, and workflow link

## Resource Requirements

**Per Pod:**
- CPU: 100m request / 500m limit
- Memory: 128 MiB request / 512 MiB limit
- Replicas: 3 minimum, up to 10 (auto-scaled)

**Deployment Strategy:**
- Rolling Updates (default) - Zero downtime
- Blue-Green Deployment (optional) - For testing

## License

ISC

## Author

See [package.json](./package.json) for author information.
