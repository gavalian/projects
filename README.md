# Various Projects

## Kubernets

Running with Uvicorn

```
uvicorn main:app --reload
```

#Running With Docker

```
docker build -t k8p-track .
docker run -p 8000:80 k8p-track
```

## Minicube deployement

```
kubectl create deployment hello-app --image=k8p-track:0.0.1
kubectl create deployment hello-track2 --image=gavalian/k8p-track:0.0.1
```

## interact with hello-minicube

```
kubectl expose deployment hello-minikube --type=NodePort --port=8080
LoadBalancer

```