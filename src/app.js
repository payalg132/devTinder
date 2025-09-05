const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
    res.send("Welcome to the namaste hello file");
});

app.use((req, res) => {
    res.send("Welcome to the namaste Node.js");
});

app.listen(3000, () => {
    console.log("Listening to the port 3000");
});