# Deploying to production

1. In order to create a new version of libraries or services, all you need to do is run `npm version patch|minor|major` inside the library/service, and the CI will take care of building and releasing the library/service to the appropriate registries.

# Setup

Describe the DevEnv setup, tools, and the entire deployment pipeline.

## Environment Variables

In order to be able to run the development environment locally, you need to set the following variables:
- `GPR_TOKEN` - Github access token with `read:packages` permissions only. 
  Don't add any other permissions to the token, as its leakage might become a significant security risk. You can generate a github access token [here](https://github.com/settings/tokens).


## DNS setup

- You need to alias `10.254.254.254` to localhost by running `sudo ifconfig lo0 alias 10.254.254.254`. This is required on every restart of the computer. The reason this is used is so that you can use a TLD to refer to your local environment.

## Docker Cheatsheet

- To recreate the containers, you can run `docker-compose up --force-recreate --build -d`
- Run all the containers `docker-compose up -d`

## Deploying to DO

You need several environment variables set locally, namely:
- SYSTEM_TLD
- GPR_TOKEN
- DOCKERHUB_TOKEN
- DIGITALOCEAN_TOKEN
- SPACES_ACCESS_KEY_ID
- SPACES_SECRET_ACCESS_KEY

You also need to add a `secrets.tfvars` file that is gitignored in both staging and production. This holds any secrets that are environment-specific.

If there is an existing deployment already, first you need to taint the services server using
`terraform taint digitalocean_droplet.services-1`, update the `docker-compose.yaml` to the appropriate services versions, and then run the command below.

Next, you need to set the workspace for terraform. You can do that using `terraform workspace select default/prod`, where default is the staging environment. This makes sure that the two environments have separate state.

Once those are set, cd to `infra` and run `terraform apply --var-file=./stg/vars.tfvars --var-file=./stg/secrets.tfvars` (change to prod folder for production deployment). The rest is handled automatically. 

## DB Backups

Backups will be automatically handled by MongoDB Atlas once we have a need for a larger cluster (paid one). For now, we can use the free one, and do manual backups using:
`mongodump --uri="<connectionstring>"`
`mongorestore --uri="<connectionstring>"`

