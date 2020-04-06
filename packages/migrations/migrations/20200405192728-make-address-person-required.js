module.exports = {
  async up(db, client) {
    await db.collection('addresses').updateMany({"person": undefined}, [{$set: { person: '$name'}}]);
  },

  async down(db, client) {
    // This one is not easy to rollback, and at this point it's not worth worrying about it too much.
  }
};
