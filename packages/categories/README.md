# Categories

The source-of-truth for categories

# Running the categories importer

Until we get admin users, just remove the `disallow` hook from categories locally, and target the local data api. We can change the DB URL to staging and prod to add to both.

You need to set several environment variables before you can import products, namely:
- API_ENDPOINT

You can create a `.env` file and run: `source .env && node import dist/index.js ./categories.csv`

Other actions that are supported, aside from `import` are:
- `flatlist` - List down all categories from all levels, used for generating translations.