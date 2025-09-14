const cron = require("node-cron");
const sendExpiryReminders = require("../utils/sendExpiryReminders");

cron.schedule("*/5 * * * *", async () => {
  await sendExpiryReminders();
});

