module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany({}, {$set: {isEmailVerified: false}});
  },

  async down(db, client) {
    await db.collection('users').updateMany({}, {$unset: {isEmailVerified: ""}});
  }
};
