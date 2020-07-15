const {v4: uuid} = require('uuid');

module.exports = {
  async up(db, client) {
    const users = await db.collection('users').find({}).toArray();
    await Promise.all(users.map(user => {
      return db.collection('authManagement').insertOne({_id: uuid(), email: user.email, createdAt: new Date(Date.now()).toISOString()});
    }));
  },

  async down(db, client) {
    await db.collection('authManagement').drop()
  }
};
