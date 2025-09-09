const express = require("express");
const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");

// Send a connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    try {
        // status can be 'interested' or 'ignored'
        if(!( ['interested', 'ignored'].includes(status) )) {
            return res.status(400).json( {error: "Status value is not valid"} );
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).json( {error: "The user you are trying to connect is not found"} );
        }

        // check if a request already exists from fromUserId to toUserId or vice versa
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
        });

        if(existingRequest) {
            return res.status(400).json( {error: "Request is already exists !!"} );
        }

        const newRequest = new ConnectionRequest( {fromUserId, toUserId, status} );
        await newRequest.save();
        res.status(200).send( {message: "Connection request sent successfully", request: newRequest} );
    }
    catch(err) {
        res.status(500).json( {"ERROR ": + err.message} );
    }
});

module.exports = requestRouter;