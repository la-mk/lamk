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


## Handling private packages locally

You can add a `.npmrc` file that contains:
```
//npm.pkg.github.com/:_authToken=${GPR_TOKEN}
@sradevski:registry=https://npm.pkg.github.com
```

And you can use the typical npm commands. This, however, can break the CI, and it is not required to manually handle packages anyway. 
Also, you can run `npm login`, and once you successfully log in, you can read and publish packages as usual. This might be required when publishing a package for the first time.

## DigitalOcean basic infra setup
