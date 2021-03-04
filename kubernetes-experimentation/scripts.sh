#!bash

# Use traefik v2 instead.
k3d cluster create --api-port 6550 -p "8081:80@loadbalancer" -p "8082:443@loadbalancer" --agents 2 --volume "$(pwd)/registries.yaml:/etc/rancher/k3s/registries.yaml"

# kubectl apply -f ./test.yaml