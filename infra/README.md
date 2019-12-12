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