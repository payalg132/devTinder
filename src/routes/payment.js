const express = require("express");
const paymentRouter = express.Router();
const { instance } = require("../utils/razorpay");
const { userAuth } = require("../middleware/auth");
const payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const user = require("../models/user");

const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");


paymentRouter.post("/createOrder", userAuth, async (req, res) => {
    try {
        const {firstName, lastName, emailId} = req.user;
        const {membershipType} = req.body;
        const order = await instance.orders.create({
            amount: membershipAmount[membershipType] * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
                firstName: firstName,
                lastName: lastName,
                emailId: emailId,
                membershipType: membershipType
            }
        });

            const Payment = new payment({
                userId: req.user._id,
                orderId: order.id,
                amount: order.amount,
                notes: order.notes,
                receipt: order.receipt,
                status: order.status
            });

            const savedPAyment = await Payment.save();

             res.send(savedPAyment.toJSON());
       //  });

       

        // save the order in DB
        
    } catch (error) {
        console.log(error);
    }
});

paymentRouter.post("/payment/webhook", async (req,res) => {
    try {
        console.log("in function");
        const webhookSignature = req.header("X-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHHOK_SECRET
        );

        if(!isWebhookValid) {
            return res.status(400).send({message :"WEbhook signature invalid"});
        }

        const paymentDetails = req.body.payload.payment.entity;
        console.log(paymentDetails);

        //update payment status
        const Payment = await payment.findOne({orderId: paymentDetails.order_id});
        Payment.status = paymentDetails.status;
        await Payment.save();

        //update user
        const User = await user.findById({_id: Payment.userId});
        User.isPremium = true;
        User.membershipType = Payment.notes.membershipType;
        await User.save();

        return res.status(200).send("Webhook recieved successfully");
    } catch (error) {
        console.log("error" + error.message);
    }
});

paymentRouter.get("/payment/status", userAuth, (req, res) => {
    const isPremium = req.user.isPremium;
    if(isPremium){
        return res.json({isPremium: true});
    } else {
        return res.json({isPremium: false});
    }
});

module.exports = paymentRouter;