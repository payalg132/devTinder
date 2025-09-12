const cron = require("node-cron");

cron.schedule("5 0 * * *", () => {
    console.log("Hello World !!");
});