import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    // featuredAds: {
    //     type: Boolean,
    //     required: true,
    // },

    // Add other necessary attributes here
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
