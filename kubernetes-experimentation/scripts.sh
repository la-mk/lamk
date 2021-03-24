#!bash

# Use traefik v2 instead.
# k3d cluster create --api-port 6550 -p "8081:80@loadbalancer" -p "8082:443@loadbalancer" --image rancher/k3s:v1.20.5-rc1-k3s1 --agents 2 --volume "$(pwd)/registries.yaml:/etc/rancher/k3s/registries.yaml"

k3d cluster create --api-port 6550 -p "80:80@loadbalancer" -p "443:443@loadbalancer" --image rancher/k3s:v1.20.5-rc1-k3s1 --agents 2 && kubectl create secret docker-registry do-registry-credentials --docker-server=registry.digitalocean.com --docker-username=013e83f508d520deeab26aabdf4c7482553b2c20106b6f67bd985463eb8796db --docker-password=013e83f508d520deeab26aabdf4c7482553b2c20106b6f67bd985463eb8796db --docker-email=sradevski@live.com

# kubectl apply -f ./test.yaml