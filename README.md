# Setup

Describe the DevEnv setup, tools, and the entire deployment pipeline.

- You need to alias `10.254.254.254` to localhost by running `sudo ifconfig lo0 alias 10.254.254.254`. This is required on every restart
- Run the local registry using `docker-compose -f docker-compose.registry.yaml up -d`
- Run all the containers `docker-compose -f docker-compose.dev.yaml up -d`