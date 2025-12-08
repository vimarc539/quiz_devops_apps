# Release Process

## Version Numbering

We follow **Semantic Versioning** (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR:** New features, backwards compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH:** Bug fixes, backwards compatible (e.g., 1.0.0 → 1.0.1)

## Release Workflow

### 1. Prepare Release
```bash
# Make sure you're on develop and up to date
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v1.0.0
```

### 2. Update Version

Update `package.json`:
```json
{
  "version": "1.0.0"
}
```

Update `VERSION` file: