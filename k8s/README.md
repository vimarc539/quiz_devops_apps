# Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the Quiz DevOps App.

## Files Overview

| File | Description |
|------|-------------|
| `deployment.yaml` | Main deployment with rolling update strategy and resource requirements |
| `service.yaml` | Kubernetes Service for load balancing |
| `configmap.yaml` | Configuration data (non-sensitive) |
| `ingress.yaml` | Ingress controller configuration (optional) |
| `hpa.yaml` | Horizontal Pod Autoscaler for automatic scaling |
| `blue-green-deployment.yaml` | Blue-green deployment configuration (optional) |
| `kustomization.yaml` | Kustomize configuration for managing deployments |

## Quick Start

### Prerequisites

1. Kubernetes cluster (v1.20+)
2. kubectl configured
3. Docker image published to Docker Hub

### Deploy

```bash
# Update image reference in deployment.yaml
sed -i 's/DOCKER_USERNAME/YOUR_DOCKER_USERNAME/g' deployment.yaml

# Deploy all resources
kubectl apply -f .

# Check status
kubectl get all -l app=quiz-app
```

## Resource Requirements

- **CPU Request:** 100m (0.1 cores)
- **CPU Limit:** 500m (0.5 cores)
- **Memory Request:** 128 MiB
- **Memory Limit:** 512 MiB
- **Replicas:** 3 (minimum), up to 10 (via HPA)

## Deployment Strategies

### Rolling Update (Default)

Configured in `deployment.yaml`:
- Zero downtime
- Automatic rollback on failure
- Gradual traffic shift

### Blue-Green Deployment

Use `blue-green-deployment.yaml` for:
- Testing new versions
- Instant rollback
- Manual traffic switching

## Customization

### Update Image

```bash
kubectl set image deployment/quiz-app quiz-app=YOUR_DOCKER_USERNAME/quiz-app:VERSION
```

### Scale Manually

```bash
kubectl scale deployment quiz-app --replicas=5
```

### Update Resources

Edit `deployment.yaml` and apply:
```bash
kubectl apply -f deployment.yaml
```

## Monitoring

```bash
# Check pods
kubectl get pods -l app=quiz-app

# View logs
kubectl logs -l app=quiz-app -f

# Check resource usage
kubectl top pods -l app=quiz-app

# Check HPA
kubectl get hpa quiz-app-hpa
```

## Troubleshooting

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed troubleshooting guide.

