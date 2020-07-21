const Bluebird = require('bluebird');

module.exports = {
  async up(db, client) {
    const carts = await db.collection('carts').find({}).toArray();

    await Bluebird.map(carts, cart => {
      const newItems = cart.items.map(item => ({...item, product: {id: item.product}}));
      return db.collection('carts').updateMany({_id: cart._id}, [{$set: {items: newItems}}]);
    }, { concurrency: 30 });
  },

  async down(db, client) {
  }
};
