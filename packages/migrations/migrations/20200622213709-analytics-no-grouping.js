module.exports = {
  async up(db, client) {
    // IMPORTANT: Use `$set` next time as update replaces the whole object.
    const orderCount = await db.collection('storeAnalytics').find({type: "orderCount"}).toArray();
    await Promise.all(orderCount.map(async entry => {
      const newVal = (entry.value.cancelled || 0) + (entry.value.pendingPayment || 0) + (entry.value.pendingShipment || 0) + (entry.value.shipped || 0) + (entry.value.completed || 0)
      return await db.collection('storeAnalytics').update({_id: entry._id}, {...entry, value: newVal})
    }));

    const revenue = await db.collection('storeAnalytics').find({type: "revenue"}).toArray();
    await Promise.all(revenue.map(async entry => {
      const newVal = (entry.value.cancelled || 0) + (entry.value.pendingPayment || 0) + (entry.value.pendingShipment || 0) + (entry.value.shipped || 0) + (entry.value.completed || 0)
      return await db.collection('storeAnalytics').update({_id: entry._id}, {...entry, value: newVal})
    }));


    const visits = await db.collection('storeAnalytics').find({type: "visitCount"}).toArray();
    await Promise.all(visits.map(async entry => {
      const newVal = entry.value.total || 0;
      return await db.collection('storeAnalytics').update({_id: entry._id}, {...entry, value: newVal})
    }));
  },

  async down(db, client) {
    // Rollback is diffuclt and not worth it since we can recreate the data.
  }
};
