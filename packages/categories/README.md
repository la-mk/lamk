# Categories

The source-of-truth for categories

### Steps for adding a new category

1. Add the category set to `categories.csv`
2. Add images for the level2 category to the "images" folder (use `imgcompare` command)
3. Upload the images to S3 in all environments
4. Add all slugs of the category to the translations and release new version
5. Add the translations to backstore and store and release new version (use `flatlist` command)
6. Run the importer to add the categories (use `import` command)

# Running the categories importer

Until we get admin users, just remove the `disallow` hook from categories locally, and target the local data api. We can change the DB URL to staging and prod to add to both.

You need to set several environment variables before you can import products, namely:

- API_ENDPOINT
- NODE_TLS_REJECT_UNAUTHORIZED=0

You can create a `.env` file and run: `source .env && node dist/index.js import ./categories.csv`

Other actions that are supported, aside from `import` are:

- `flatlist` - List down all categories from all levels, used for generating translations.
- `imgcompare` - Print all (level2) categories for which we don't have images, and vice versa

# Uploading categories images and illustrations

For illustrations, I get those done on Fiverr. You can then remove whitespace using https://svgcrop.com, and optimize the svg using svgo (`npm run optimize-svg`). After that, we need to replace the used colors with variables. You can find all hash colors by using `#[0-9A-F]{6}` in your code editor, and replace those with the appropriate colors.

In the first illustrations batch, these are the colors that were used:

#2db5ff - light blue - darkish accents - DARKISH - var(--chakra-colors-primary-400)
#caf5fe - very light blue - item shadows - SHADOWS - var(--chakra-colors-primary-50)
#abe7ff - another very light blue, background - BACKGROUND - var(--chakra-colors-primary-50)
#0e4e91 - dark blue - main outlines - OUTLINES - var(--chakra-colors-primary-800)

There were few custom colors, `#fafafa` in `women-watch` which should have been the shadows color, `#e1dec4` in `women-shoes` which should have been outlines, `#12dbb4` inn `ladder`, but that whole path can be removed, and a bunch of `#2f3a5a` which should be outlines.

The other thing that needs to be done is replace the classes in each svg with a unique name (use the category name), otherwise there will be clashes.

For now we'll can upload category images manually to S3 in a bucket called "categories". https://unsplash.com/, https://www.pexels.com/, is the place to look for category images.

The categories images should be 4x3 ratio and 1200/900px widths. The extension should be jpg. https://www.befunky.com/ is a pretty nice tool for resizing.
