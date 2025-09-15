const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    paymentId:{
        type:String
    },
    orderId:{
        type:String,
        required:true
    },
    amount: { type: Number, required: true },
    notes: {
        firstName: { type: String },
        lastName: { type: String },
        membershipType: { type: String }
    },
    receipt: { type: String },
    status: { type: String, required:true }
},{
    timestamps: true
});

module.exports = mongoose.model("payment", paymentSchema);