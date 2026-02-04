# Starting the minicube

```
minikube start
kubectl get nodes
```

# Building the docker

```
eval $(minikube docker-env)
docker build -t Gavalian/k8p-tracks:0.0.1 .
docker images | grep k8p-tracks
```

# Create Deployement Test

```
kubectl create deployment app-track --image=gavalian/k8p-tracks:0.0.1
kubectl rollout status deploy/app-track
kubectl delete deployment app-track
```

# Create a Deployement with YAML

```
kubectl apply -f deployment.yaml
kubectl rollout status deployment/k8p-tracks
kubectl get pods -l app=k8p-tracks
```

# Create Services

```
kubectl apply -f service.yaml
kubectl get svc k8p-tracks-svc
```

# connect to the service

