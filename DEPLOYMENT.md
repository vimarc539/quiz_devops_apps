# Deployment Guide

This document describes the deployment process for the Quiz DevOps App to Kubernetes.

## Overview

The application is deployed to Kubernetes using:
- **Rolling Updates** (default) - Zero-downtime deployments
- **Blue-Green Deployment** (optional) - For testing new versions before switching traffic

## Resource Requirements

### Calculated Resource Requirements

Based on the application characteristics:

| Resource | Request (Guaranteed) | Limit (Maximum) | Justification |
|----------|---------------------|-----------------|----------------|
| **CPU** | 100m (0.1 cores) | 500m (0.5 cores) | Node.js Express app is lightweight. 100m handles ~50-100 req/s, 500m for traffic spikes |
| **Memory** | 128 MiB | 512 MiB | Base Node.js runtime ~50MB, app code ~20MB, buffer for JSON processing and caching |

### Resource Calculation Details

**CPU Requirements:**
- Base Node.js runtime: ~20-30m CPU
- Express.js overhead: ~10-20m CPU
- Request processing: ~1-2m per request
- **Total baseline: ~50m CPU**
- **With headroom for spikes: 100m request, 500m limit**

**Memory Requirements:**
- Node.js runtime: ~50 MB
- Application code: ~20 MB
- Dependencies (express, cors): ~30 MB
- Request buffers and JSON parsing: ~20 MB
- **Total baseline: ~120 MB**
- **With headroom: 128 MiB request, 512 MiB limit**

### Scaling Configuration

- **Minimum Replicas:** 3 (for high availability)
- **Maximum Replicas:** 10 (via HPA)
- **CPU Scaling Threshold:** 70% utilization
- **Memory Scaling Threshold:** 80% utilization

## Prerequisites

1. **Kubernetes Cluster** (v1.20+)
   - Minikube (local development)
   - GKE, EKS, AKS (cloud)
   - Kind, K3s (local/edge)

2. **kubectl** configured and connected to your cluster

3. **GitHub Secrets** configured:
   - `DOCKER_USERNAME` - Docker Hub username
   - `DOCKER_PASSWORD` - Docker Hub password/token
   - `KUBECONFIG` - Base64-encoded kubeconfig file (for CD pipeline)

4. **Docker Image** published to Docker Hub

## Deployment Methods

### Method 1: Automated CD Pipeline (Recommended)

The CD pipeline automatically deploys when:
- Code is pushed to `main` branch → Deploys to **production**
- Git tag is pushed (e.g., `v1.0.0`) → Deploys tagged version
- Manual workflow dispatch → Choose environment and version

#### Setup CD Pipeline:

1. **Configure GitHub Secrets:**
   ```bash
   # Encode your kubeconfig file
   cat ~/.kube/config | base64 -w 0
   ```
   Add to GitHub Secrets as `KUBECONFIG`

2. **Trigger Deployment:**
   - **Automatic:** Push to `main` branch
   - **Manual:** Actions → CD Pipeline → Run workflow
   - **Tag-based:** `git tag v1.0.0 && git push origin v1.0.0`

### Method 2: Manual Deployment with kubectl

#### Step 1: Update Image Reference

Edit `k8s/deployment.yaml`:
```yaml
image: YOUR_DOCKER_USERNAME/quiz-app:1.0.0
```

#### Step 2: Deploy Manifests

```bash
# Apply ConfigMap
kubectl apply -f k8s/configmap.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Create service
kubectl apply -f k8s/service.yaml

# Optional: Apply HPA for auto-scaling
kubectl apply -f k8s/hpa.yaml

# Optional: Apply Ingress (if using)
kubectl apply -f k8s/ingress.yaml
```

#### Step 3: Verify Deployment

```bash
# Check deployment status
kubectl get deployments
kubectl get pods -l app=quiz-app
kubectl get services

# Check pod logs
kubectl logs -l app=quiz-app --tail=50

# Describe deployment
kubectl describe deployment quiz-app
```

### Method 3: Using Kustomize

```bash
# Update image in kustomization.yaml
cd k8s
kubectl apply -k .
```

## Deployment Strategies

### Rolling Update (Default)

**Configuration:** Already configured in `deployment.yaml`

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1          # Allow 1 extra pod during update
    maxUnavailable: 0    # Zero downtime - always have pods available
```

**How it works:**
1. New pods are created with new version
2. Old pods remain running until new pods are ready
3. Traffic gradually shifts to new pods
4. Old pods are terminated after new pods are healthy

**Advantages:**
- Zero downtime
- Automatic rollback on failure
- Resource efficient

**Deploy:**
```bash
kubectl set image deployment/quiz-app quiz-app=YOUR_DOCKER_USERNAME/quiz-app:1.1.0
kubectl rollout status deployment/quiz-app
```

### Blue-Green Deployment

**Configuration:** See `k8s/blue-green-deployment.yaml`

**How it works:**
1. **Blue** = Current stable version (production traffic)
2. **Green** = New version (testing)
3. Switch traffic by updating service selector

**Deploy Green Version:**
```bash
# Deploy green version
kubectl apply -f k8s/blue-green-deployment.yaml

# Test green version
kubectl port-forward service/quiz-app-green-service 3001:80
curl http://localhost:3001/api/quiz/health

# Switch traffic to green (update service selector)
kubectl patch service quiz-app-service -p '{"spec":{"selector":{"version":"green"}}}'

# Verify green is handling traffic
kubectl get pods -l version=green

# If issues, rollback to blue
kubectl patch service quiz-app-service -p '{"spec":{"selector":{"version":"blue"}}}'
```

**Advantages:**
- Instant rollback
- Test new version before switching
- No gradual traffic shift

**Disadvantages:**
- Requires double resources during switch
- Manual traffic switching

## Monitoring and Health Checks

### Health Check Endpoints

- **Liveness Probe:** `/api/quiz/health` - Checks if pod is alive
- **Readiness Probe:** `/api/quiz/health` - Checks if pod can serve traffic
- **Startup Probe:** `/api/quiz/health` - Allows up to 60s for startup

### Monitoring Commands

```bash
# Watch pods
kubectl get pods -l app=quiz-app -w

# Check pod status
kubectl get pods -l app=quiz-app -o wide

# View logs
kubectl logs -l app=quiz-app -f

# Check resource usage
kubectl top pods -l app=quiz-app

# Check HPA status
kubectl get hpa quiz-app-hpa
kubectl describe hpa quiz-app-hpa
```

## Scaling

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment quiz-app --replicas=5

# Check scaling status
kubectl get deployment quiz-app
```

### Automatic Scaling (HPA)

HPA automatically scales based on:
- **CPU usage > 70%** → Scale up
- **Memory usage > 80%** → Scale up
- **CPU/Memory usage < thresholds** → Scale down (after 5 min)

```bash
# Check HPA
kubectl get hpa quiz-app-hpa

# View HPA events
kubectl describe hpa quiz-app-hpa
```

## Rollback

### Rolling Update Rollback

```bash
# View rollout history
kubectl rollout history deployment/quiz-app

# Rollback to previous version
kubectl rollout undo deployment/quiz-app

# Rollback to specific revision
kubectl rollout undo deployment/quiz-app --to-revision=2

# Watch rollback status
kubectl rollout status deployment/quiz-app
```

### Blue-Green Rollback

```bash
# Simply switch service selector back to blue
kubectl patch service quiz-app-service -p '{"spec":{"selector":{"version":"blue"}}}'
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -l app=quiz-app

# Describe pod for events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Common issues:
# - Image pull errors → Check Docker Hub credentials
# - Resource limits → Check if cluster has resources
# - Health check failures → Check application logs
```

### Service Not Accessible

```bash
# Check service
kubectl get service quiz-app-service

# Check endpoints
kubectl get endpoints quiz-app-service

# Port forward for testing
kubectl port-forward service/quiz-app-service 3000:80

# Test locally
curl http://localhost:3000/api/quiz/health
```

### Deployment Stuck

```bash
# Check rollout status
kubectl rollout status deployment/quiz-app

# Check deployment events
kubectl describe deployment quiz-app

# Common causes:
# - Health checks failing → Check application
# - Resource constraints → Check cluster resources
# - Image pull issues → Check Docker Hub access
```

### High Resource Usage

```bash
# Check resource usage
kubectl top pods -l app=quiz-app

# Check HPA
kubectl get hpa quiz-app-hpa

# Adjust resources in deployment.yaml if needed
kubectl edit deployment quiz-app
```

## Environment-Specific Configurations

### Staging Environment

```bash
# Use staging namespace
kubectl create namespace staging
kubectl apply -f k8s/ -n staging

# Update deployment for staging
kubectl set env deployment/quiz-app NODE_ENV=staging -n staging
```

### Production Environment

```bash
# Use production namespace
kubectl create namespace production
kubectl apply -f k8s/ -n production

# Enable resource limits
# (Already configured in deployment.yaml)
```

## Security Best Practices

1. **Use Secrets** for sensitive data (not ConfigMaps)
2. **Network Policies** to restrict pod communication
3. **RBAC** for Kubernetes API access
4. **Image Security** scanning
5. **Resource Limits** to prevent resource exhaustion
6. **Pod Security Policies** (if available)

## Cost Optimization

- **Right-size resources** based on actual usage
- **Use HPA** to scale down during low traffic
- **Consider spot instances** for non-critical workloads
- **Monitor and adjust** resource requests/limits regularly

## Next Steps

1. Set up monitoring (Prometheus, Grafana)
2. Configure logging (ELK, Loki)
3. Set up alerting
4. Implement CI/CD pipeline
5. Add service mesh (Istio, Linkerd) if needed

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy)

