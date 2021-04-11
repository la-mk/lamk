module.exports = {
  async up(db) {
    await db
      .collection("orders")
      .updateMany(
        {},
        { $set: { deliveryStatus: "unknown", deliveryEvents: [] } }
      );
  },
};
