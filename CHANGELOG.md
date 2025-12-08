# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Horizontal Pod Autoscaler configuration
- Prometheus monitoring integration
- User authentication

## [1.0.0] - 2025-12-08

### Added
- Initial release of Quiz DevOps App
- REST API with 5 endpoints:
  - GET / - API information
  - GET /api/quiz/questions - Get all questions
  - GET /api/quiz/questions/:id - Get specific question
  - POST /api/quiz/submit - Submit single answer
  - POST /api/quiz/submit-all - Submit all answers
- 5 DevOps-themed quiz questions
- Docker containerization with multi-stage build
- Optimized Docker image (~120-150 MB)
- GitHub Actions CI pipeline
- Comprehensive test suite (17 tests)
- >70% code coverage
- Automated Docker builds
- Health check endpoint
- Git workflow with feature branches
- Documentation for all phases

### Security
- Non-root Docker user
- No sensitive data in responses
- Input validation on all endpoints

### Performance
- Container size optimized by 84%
- Alpine Linux base image
- Production-only dependencies