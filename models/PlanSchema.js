import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["Bronze", "Silver", "Old"],
    },
    totalAds: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    validity: {
        type: Number,
        required: true,
    },
    adsLimit: {
        type: Number,
        required: true,
    },
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
