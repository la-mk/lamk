const Bluebird = require("bluebird");

module.exports = {
  async up(db) {
    const storeContents = await db
      .collection("storeContents")
      .find({})
      .toArray();
    await Bluebird.map(
      storeContents,
      (storeContent) => {
        let newLanding = {};
        if (!storeContent.landing) {
          storeContent.landing = { sets: [] };
        }

        newLanding = {
          ...storeContent.landing,
          sets: [
            ...(storeContent.landing.sets || []),
            { type: "latest", isPromoted: true },
            { type: "discounted", isPromoted: true },
          ],
        };

        console.log(
          `Updating store contents for store: ${storeContent.forStore}`
        );
        return db
          .collection("storeContents")
          .updateMany(
            { _id: storeContent._id },
            { $set: { landing: newLanding } }
          );
      },
      { concurrency: 30 }
    );
  },

  async down(db, client) {
    // If the up part fails, just revert from db dump
  },
};
