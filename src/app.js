require('dotenv').config();
const express = require("express");
const {connectDB} = require("./config/database");
const app = express();  
const cookie = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("./utils/crons");

app.use(cors( {
    origin: "http://localhost:5173",
    credentials: true,
} ));
app.use(express.json());
app.use(cookie());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB.then(() => {
    console.log("Database connection established");
    server.listen(process.env.PORT, () => {
        console.log("Listening to the port 3000");
    });
})
.catch((err) => {
    console.log("Error : ", err.message);
});

