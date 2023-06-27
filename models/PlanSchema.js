import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["Basic", "Bronze", "Silver", "Gold"],
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
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
