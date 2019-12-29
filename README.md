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

## DigitalOcean basic infra setup
