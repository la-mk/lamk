## Resources

https://kubernetes.io/docs/home/
https://github.com/eon01/kubernetes-workshop
https://www.digitalocean.com/community/curriculums/kubernetes-for-full-stack-developers
https://www.youtube.com/watch?v=X48VuDVv0do&ab_channel=TechWorldwithNana
https://k3s.io/

Using DO Kubernetes:
- https://www.kabisa.nl/tech/real-world-phoenix-lets-d4y-using-k8s/
- 


## Commands

- `kubectl get nodes` - Get existing nodes
- `kubectl get pods` - Get existing pods
- `kubectl get services` - Get services
- `kubectl get replicaset` - Get the replicas state
- `kubectl get namespaces` - Get the existing namespaces

- `kubectl logs <podname>` - Get logs from the specified pod's services (not the pod itself)
- `kubectl describe pod <podname>` - Gives you the state changes/logs of the pod itself
- `kubectl exec -it <podname> -- bin/bash` - SSH and run the passed command as an interactive terminal (same with `docker exec -it ...`)

## Miscelaneous

Deployment -> ReplicaSet -> Pod -> Containers

## Configuration file

There are three parts of the config file, `metadata`, `spec` and `status`. The `spec` section is the desired state, and `status` is the actual state and is automatically managed by k8s. The `status` information is stored in the key-value store (`etcd` by default) as part of the master nodes.

As part of the `spec` object, you can have a `template` sub-object, which has the same structure as the parent (`metadata`, `spec`, and `status`). The `template` sub-object applies to the Pod of the Deployment, if you are defining a Deployment config.

In `metadata` you have `labels` of any key-value pair for a component, and in `spec` you have a `selector` that specifies which labels the kind applies. Labels on a Pod are used in the selector for a Deployment, and labels on the Deployment are used by the selector on a Service.

## Deployments, Services, Namespaces, and Ingress

Internally containers can talk to each other by referencing the service name, same as in `docker-compose`

Service `port` specifies the port at which you can access the service, `targetPort` specifies the port of the container in the pod, and `containerPort` inside a Deployment specifies the port on which the container will listen to.

To make a Service externally accessible, you need to set the `type` of the Service (as part of the `spec` object) to `LoadBalancer` and `nodePort` to some port through which you'll access the service. The internal service would also act as a load balancer, in this case it just means that it will accept external requests (just poorly named type). Another way to achieve the same is using an Ingress, which is a more powerful way to expose services externally.

Ingress can take a set of rules for redirection, and is the entrypoint to the cluster. You can use a third-party implementation (called an IngressController) that you need to choose. There are many types of rules you can define, so you can use single host and multiple paths, multiple hosts based on a subdomain, etc.

By default kubernetes gives you 4 namespaces by default, which are used internally. You can use namespaces to isolate services and treat them as different clusters. One way to group services in namespaces is by purpose, such as DB, Monitoring, Elastic Stack, etc. You can also have namespacing based on environment, like Staging and Production, and have a single namespace for monitoring for both environments. You can specify resources, access, and quotas per namespace.

Each namespace has to define its own ConfigMap and Secret. You can, however, access services in other namespaces by adding the namespace at the end (`eg. service-name.namespace`). Volumes and Nodes cannot be bound to a namespace, as they are global in a cluster.

There is a tool called `kubens` through which you can change the namespace in which you want to operate.

## Helm - package manager

It's used to package a set of yml files in a reusable package. For example, if you want the Elastic stack, you'll need to write a lot of configuration, and if you use Helm you can just install it as a package. It also allows you to create templates for common configuration, and be able to pass dynamic values to it to replace the placeholders (denoted by `{{ .Values.<values.yml entry selector> }}`). This is how you can handle different environments as well by creating all your configs as a chart.

## Persistent storage

There are three types of storage, `PersistentVolume`, `PersistentVolumeClaim`, and `StorageClass`.

In Kubernetes, you are only given interfaces to storage, but you are the one that should manage, backup, that storage. The storage can be local disk, block storage, or an nfs server. The `spec` attributes will differ based on the storage type, which will also depend on the provider (google cloud, aws, etc). In order to use a PersistentVolume, applications have to claim that persistent storage using PersistentVolumeClaim, and add that to the pod configuration as a volume. Claims are namespaced, unlike persistent volumes.

StorageClass allows you to dynamically provision persistent volumes whenever PersistentVolumeClaim claims it. You need to specify a provisioner parameter for a specific cloud provider to create a volume dynamically.

## StatefulSet

Stateless applications are deployed using Deployment, whereas stateful ones are deployed using a StatefulSet component. StatefulSet keeps a sticky identity for each pod that stays the same even after rescheduling it. Each pod will have its own persistent storage, where both the data and the pod state are stored. The IDs are then used to figure out which persistent storage to attach to it so it can pick up its state. The names of the pods will also be predictable, unlike stateless pods. Stateful pods also get a fixed individual DNS name, so you can target specific pods.

## Services

Services give a stable IP address to one or more pods of the same service and provide load balancing functionality. There are several types of services, and the default is `ClusterIP` service, and it just serves as a simple load balancer for the pods. Services know which pods to forward the request to by using selectors. The `Headless` service allows you to access a specific pod (eg. in the case of a database you want to target the read replica) by setting `clusterIP: None` in the spec, so it is a special version of the ClusterIP service. You can also create a `type: NodePort` service, which allows for external traffic to access each worker node on the specified node port and the node's IP address. This is not really secure and practical, so they are rarely used. The last type is `LoadBalancer` which is similar to NodePort, but it is only accessible through the Cloud provider's load balancer, and not directly.
