const mongoose = require("mongoose");

const connectDB = mongoose.connect("mongodb+srv://payalg132:root@namastenode.ywvbfar.mongodb.net/devTinder");

module.exports = {connectDB};