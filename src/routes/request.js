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

        if(fromUserId.toString() === toUserId) {
            return res.status(400).json( {error: "You cannot send request to yourself"} );
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

// accept or reject the connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    const userId = req.user._id;
    const {status, requestId} = req.params;

    try {
        const allowedStatus = ['accepted', 'rejected'];
        if( !(allowedStatus.includes(status)) ) {
            return res.status(400).json( {error: "Status value is not valid"} );
        }

        const connectionRequest = await ConnectionRequest.findOne( {_id: requestId, toUserId: userId, status: "interested"} );
        if(!connectionRequest) {
            return res.status(404).json( {error: "Connection request not found"} );
        }

        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json( {message: `Connection request ${status} successfully`, request: connectionRequest} );

    } catch(err) {
        res.status(500).json( {"ERROR ": + err.message} );
    }
});

module.exports = requestRouter;