module.exports = {
  async up(db, client) {
    await db.renameCollection('categoriesPerStore', 'storeCategories');
  },

  async down(db, client) {
    await db.renameCollection('storeCategories', 'categoriesPerStore');
  }
};
