# Migrations


## Main DB (MongoDB)

This module uses [`migrate-mongo`](https://github.com/seppevs/migrate-mongo) to create data migrations between releases. In order to avoid data inconsistencies, kill the running services, run the migration, and run the updated services afterwards. This causes a bit of downtime, but it is a simple and good-enough approach for now.

## Search (Typesense)

In order to import items (only products for now) to the search engine, we need to add the correct mongodb string (staging or production) to `migrate-mongo-config`, remove the `disallow` hook in `search/create`, change the mongodb string in the local docker-compose (staging or production) and run `node search/import.js`. We use the local instance to do the remote migration (similar to how we handle categories).

