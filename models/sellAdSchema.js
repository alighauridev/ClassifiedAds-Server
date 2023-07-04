import mongoose from "mongoose";

const selladSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 500,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    bulkPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: true,

    },
    type: {
      type: String,
      required: true,

    },
    condition: {
      type: String,
      required: true,

    },
    warranty: {
      type: String,
      required: true,

    },
    category: {
      type: [String],
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    },
    subCategory: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: String,
      enum: ["buy", "sell"],

    },
    telephone: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    views: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
    },


    currency: {
      type: String,
      default: "USD"
    },
    plan: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
    },
  },
  { timestamps: true }
);

selladSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
selladSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});
selladSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});

const Ad = mongoose.model("Ad", selladSchema);

export default Ad;
