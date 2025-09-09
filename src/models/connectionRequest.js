const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['interested', 'ignored', 'accepted', 'rejected']
    }
}, {
    timestamps: true
}
);

connectionRequestSchema.pre("save", async function(next) {
    const user = this;
    const fromUserId = user.fromUserId;
    const toUserId = user.toUserId;
    if(fromUserId === toUserId) {
            return res.status(400).json( {error: "You cannot send request to yourself"} );
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);