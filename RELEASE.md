# Release Process

This document describes the release process for the Quiz DevOps App.

## Overview

The release process is automated using GitHub Actions workflows. Releases can be triggered in two ways:

1. **Manual Release** - Using GitHub Actions workflow dispatch
2. **Tag-based Release** - By pushing a Git tag with semantic versioning

## Prerequisites

Before creating a release, ensure you have:

1. **Docker Hub Credentials** configured as GitHub Secrets:
   - `DOCKER_USERNAME` - Your Docker Hub username
   - `DOCKER_PASSWORD` - Your Docker Hub access token or password

2. **GitHub Token** - Automatically provided by GitHub Actions (`GITHUB_TOKEN`)

## Release Methods

### Method 1: Manual Release via GitHub Actions

1. Go to the **Actions** tab in your GitHub repository
2. Select **Release Pipeline** workflow
3. Click **Run workflow**
4. Fill in the form:
   - **Version**: Enter semantic version (e.g., `1.0.0`, `1.1.0`, `2.0.0`)
   - **Tag version**: Check to create Git tag automatically
5. Click **Run workflow**

The workflow will:
- Update `package.json` version
- Create a Git tag (e.g., `v1.0.0`)
- Build and push Docker image to Docker Hub
- Create a GitHub Release with release notes

### Method 2: Tag-based Release

1. Update version in `package.json`:
   ```bash
   npm version 1.0.0 --no-git-tag-version
   ```

2. Commit the changes:
   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.0.0"
   ```

3. Create and push a Git tag:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

The workflow will automatically:
- Extract version from the tag
- Build and push Docker image to Docker Hub
- Create a GitHub Release with release notes

## Semantic Versioning

Follow [Semantic Versioning](https://semver.org/) format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Examples:
- `1.0.0` - Initial release
- `1.0.1` - Patch release (bug fixes)
- `1.1.0` - Minor release (new features)
- `2.0.0` - Major release (breaking changes)

## Docker Images

Each release creates Docker images with the following tags:

- `{DOCKER_USERNAME}/quiz-app:{version}` - Version-specific tag (e.g., `1.0.0`)
- `{DOCKER_USERNAME}/quiz-app:v{version}` - Version tag with 'v' prefix (e.g., `v1.0.0`)
- `{DOCKER_USERNAME}/quiz-app:latest` - Latest stable release
- `{DOCKER_USERNAME}/quiz-app:{branch}-{sha}` - Branch-specific tags for CI builds

### Pulling Docker Images

```bash
# Pull specific version
docker pull {DOCKER_USERNAME}/quiz-app:1.0.0

# Pull latest release
docker pull {DOCKER_USERNAME}/quiz-app:latest

# Pull by tag
docker pull {DOCKER_USERNAME}/quiz-app:v1.0.0
```

### Running Docker Container

```bash
# Run specific version
docker run -d -p 3000:3000 --name quiz-app {DOCKER_USERNAME}/quiz-app:1.0.0

# Run latest
docker run -d -p 3000:3000 --name quiz-app {DOCKER_USERNAME}/quiz-app:latest
```

## Continuous Deployment

### Main Branch

When code is pushed to the `main` branch:
- Docker images are automatically built and pushed to Docker Hub
- Images are tagged with:
  - Version from `package.json`
  - `latest` tag
  - Branch and commit SHA tags

### Other Branches

For other branches (e.g., `develop`):
- Docker images are built but **not pushed** to Docker Hub
- Images are only available in the build cache for testing

## Release Artifacts

Each release generates:

1. **Docker Image** - Published to Docker Hub
2. **Git Tag** - Version tag in Git repository
3. **GitHub Release** - Release notes and changelog

## Release Notes

Release notes are automatically generated from Git commits since the last release. They include:

- Version number
- Docker image pull commands
- List of changes (Git commits)
- Usage instructions

## Troubleshooting

### Release Workflow Fails

1. Check GitHub Actions logs for specific errors
2. Verify Docker Hub credentials are correct
3. Ensure version format follows semantic versioning
4. Check that `package.json` exists and has a valid version

### Docker Image Not Pushed

1. Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are set
2. Check Docker Hub account permissions
3. Ensure you're pushing to `main` branch or using release workflow

### Git Tag Not Created

1. Ensure you have write permissions to the repository
2. Check that the tag doesn't already exist
3. Verify Git configuration in the workflow

## Best Practices

1. **Always test before releasing** - Run CI pipeline on feature branches first
2. **Use semantic versioning** - Follow MAJOR.MINOR.PATCH format
3. **Write meaningful commit messages** - They appear in release notes
4. **Update CHANGELOG.md** - Document significant changes
5. **Tag releases immediately** - Don't delay after merging to main

## Version Management

The version is managed in `package.json`. To update:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

Note: These commands also create Git tags. If you want to update version without tagging, use:
```bash
npm version 1.0.0 --no-git-tag-version
```

