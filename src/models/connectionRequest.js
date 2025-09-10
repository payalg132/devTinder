const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['interested', 'ignored', 'accepted', 'rejected']
    }
}, {
    timestamps: true
}
);

// compound index to ensure uniqueness of requests between two users
connectionRequestSchema.index( {fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", async function(next) {
    const connectionRequest = this;
    const fromUserId = connectionRequest.fromUserId;
    const toUserId = connectionRequest.toUserId;
    if(fromUserId === toUserId) {
            return res.status(400).json( {error: "You cannot send request to yourself"} );
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);