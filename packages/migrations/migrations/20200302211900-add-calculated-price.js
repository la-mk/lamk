module.exports = {
  async up(db, client) {
    await db.collection('products').updateMany({}, {$set: {calculatedPrice: '$price'}});
  },

  async down(db, client) {
    await db.collection('products').updateMany({}, {$unset: 'calculatedPrice'});
  }
};
