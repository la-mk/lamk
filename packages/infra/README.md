## Quick Terraform guide:

- `terraform plan` - Shows the execution plan without executing it. See what will change in the infra.
- `terraform apply` - Apply the plan to the infrastructure, provisioning whatever is defined in the config files.
- `terraform destroy` - Destroy all resources that are in your plan/config files.
- `terraform refresh` - If you add output variables after a resource is provisioned, you need to run refresh to fetch the output of it.
- `terraform show` - Shows you the current state of what is provisioned.
- `terraform state` - Advanced state manipulation
- `terraform output ip` - Prints the specified output variable to STDOUT, useful in scripts
- `terraform fmt` - Format your terraform files
- `terraform taint resource.id` - Mark a resource as tainted, so the next time you run `apply` the resource will be removed and created again, even if nothing changed.

Note that the `.tfstate` file is very important, and it should be shared with anyone who might use terraform. This is where all the IDs of the
resources are tracked, and is how terraform knows what needs to be updated or performed.

## Kubernetes guide

### Quick DO Hosted Kubernetes Guide

- Install `kubectl` and `doctl`
- Run `doctl kubernetes cluster kubeconfig save <cluster name>` to generate secrets for connecting to DO
- Use `kubectl` as usual

### Basics

Master services: 
- `etcd` - distributed configuration store
- `kube-apiserver` - main management point of entire cluster. Makes sure `etcd` and deployed containers are in agreement.
- `kube-controller-manager` - multiple responsibilities, such as scaling up and down, changing endpoint, etc. based on the changes in other places
- `kube-scheduler` - The process that assigns schedules, and keeps track of available resources.
- `cloud-controller-manager` - glue between kubernetes and cloud providers

Workers: 
- `nodes` - The servers that perform work, each required to have a container runtime (such as Docker)
- `kubelet` - service on each node that communicates with the master components. It controls the container's lifecycle
- `service` - in kubernetes, a service is a component that acts as a basic internal load balancer and ambassador for pods. It groups logical collections of pods to appear as one. By deploying a service, you easily gain discoverability and can simplify your container designs, as the IP address is always fixed.
- `pods` - The most basic unit in kubernetes. One or more tightly coupled containers are encapsulated in a pod. The containers in a single pod should be the ones that have the same lifecycle, share the same environment variables and other configuration. A logger sidecar, together with a main container is one example.
- `labels` - An important part of kubernetes, used by controllers and services to know which groups they manage and should redirect requests to. `Annotations` are more of a free-form information that is not used semantically.

There are multiple pod controllers, such as `replication controller`, `replication sets`, `deployments`, `stateful sets`, `daemon sets`, and so on. 

Kubernetes also has `jobs`, which are task-based workflows, such as `cron` jobs, useful for one-off tasks.

Kubernetes supports `volumes` and `persistent volumes` where the first one's lifecycle is tied to a pod, and the second one can be independent of a pod's lifecycle. This can also give pods access to distributed storage.

### Helm - Kubernetes package manager

Helm simplifies the management of pods, services, deployments, etc. and acts as a package manager. It requires a server component called `tiller` to run on the kubernetes cluster, which handles the configuration and deployment of software releases.

You can find officially supported `charts` for Helm [here](https://github.com/helm/charts).

See https://www.digitalocean.com/community/tutorials/an-introduction-to-helm-the-package-manager-for-kubernetes and https://www.digitalocean.com/community/tutorials/how-to-install-software-on-kubernetes-clusters-with-the-helm-package-manager tutorial

