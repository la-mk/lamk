# Importers

These are used to import data from other ecommerce services.

It currently supports:
- shopify


# Running the importer

You need to set several environment variables before you can import products, namely:
- API_ENDPOINT
- ARTIFACTS_ENDPOINT
- STORE_ID
- STORE_EMAIL
- STORE_PASSWORD

You can create a `.env` file and run:
`source .env && node dist/index.js shopify ./test-agnesa-shopify-products-2019-12-19.csv`