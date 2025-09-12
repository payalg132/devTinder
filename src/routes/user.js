const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// api to get all connection requests recieved by logged in user
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
    const loggedInUSer = req.user;
    try{
        const user = await connectionRequest.find({
            toUserId: loggedInUSer._id, status: "interested"
        }).populate(
            "fromUserId", "firstName lastName photoUrl about skills age gender"
        );

        if(!user) {
            return res.status(404).json( {error: "No connection request found"} );
        }

        res.json(user);
    } catch(err) {
        res.status(400).json( {"ERROR ": + err.message} );
    }  
});

// api to get all connections of logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUSer = req.user;
        const connections = await connectionRequest.find( {
            $or: [
                {fromUserId: loggedInUSer._id, status: "accepted"},
                {toUserId: loggedInUSer._id, status: "accepted"}
            ]
        }).populate( "fromUserId", "firstName lastName photoUrl about skills age gender" ).populate( "toUserId", "firstName lastName photoUrl about skills age gender" );

        const data = connections.map( (connection) => {
            if(connection.fromUserId._id.toString() === loggedInUSer._id.toString()) {
                return connection.toUserId;
            } else {
                return connection.fromUserId;
            }
        });
        res.json(data);
    } catch(err) {
        res.status(400).json( {"ERROR ": + err.message} );
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const loggedInUSer = req.user;
        const connections = await connectionRequest.find({
            $or: [
                {fromUserId: loggedInUSer._id},
                {toUserId: loggedInUSer._id}
            ]
        }). select("fromUserId toUserId");

        const hideConnectedUserIds = new Set();
        connections.forEach( (connection) => {
            hideConnectedUserIds.add(connection.fromUserId.toString());
            hideConnectedUserIds.add(connection.toUserId.toString());
        });

        const user = await User.find({
           $and: [
            {_id: { $ne: loggedInUSer._id } },
            {_id: { $nin: Array.from(hideConnectedUserIds) } }
           ]
        }).select("firstName lastName photoUrl about skills age gender").skip(skip).limit(limit);

        if(!user) {
            return res.status(404).json( {error: "No user found"} );
        }

        res.status(200).json(user);

    } catch(err) {
        res.status(400).json( {"ERROR ": + err.message} );
    }
});

module.exports = userRouter;