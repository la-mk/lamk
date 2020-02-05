# Migrations

This module uses [`migrate-mongo`](https://github.com/seppevs/migrate-mongo) to create data migrations between releases. In order to avoid data inconsistencies, kill the running services, run the migration, and run the updated services afterwards. This causes a bit of downtime, but it is a simple and good-enough approach for now.