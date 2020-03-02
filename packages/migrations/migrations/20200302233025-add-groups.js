module.exports = {
  async up(db, client) {
    await db.collection('products').updateMany({}, {$set: {groups: []}});
  },

  async down(db, client) {
    await db.collection('products').updateMany({}, {$unset: {groups: ""}});
  }
};
