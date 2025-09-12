const mongoose = require("mongoose");

const connectDB = mongoose.connect(process.env.DB_CONNECTION_STRING);

module.exports = {connectDB};