module.exports = {
  async up(db, client) {
    await db.collection('products').updateMany({}, [{$set: { calculatedPrice: {$sum: ['$price']}}}]);
  },

  async down(db, client) {
    await db.collection('products').updateMany({}, {$unset: {calculatedPrice: ""}});
  }
};
