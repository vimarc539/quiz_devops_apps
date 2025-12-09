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

## Project Structure

```
quiz_devops_apps/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline
│       └── release.yml      # Release pipeline
├── src/
│   ├── app.js              # Express app entry point
│   ├── routes/
│   │   └── quiz.js         # Quiz routes
│   └── data/
│       └── questions.json  # Quiz questions
├── tests/                  # Test files
├── Dockerfile              # Docker image definition
├── package.json            # Dependencies and scripts
└── RELEASE.md             # Release documentation
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
- GitHub Actions (for CI/CD)
- Docker Hub account (for image publishing)

## GitHub Secrets

Configure the following secrets in your GitHub repository:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token or password

## License

ISC

## Author

See [package.json](./package.json) for author information.
