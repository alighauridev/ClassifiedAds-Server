import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    avatar: {
      type: String,
      minlength: 5,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    phoneNo: {
      type: String,

    },
    currency: {
      type: String,
      default: "USD"
    },
    authType: {
      type: String,
      required: true,
      enum: ["Local", "google"],
    },
    preferrence: {
      type: [String],
      enum: ["Buyer", "Seller"],
    },
    mode: {
      type: String,
      enum: ["Buyer", "Seller"],
    },
    admin: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,

      minlength: 3,
      maxlength: 500,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: "649abd9c57cf77e0c2a76a1d",
    },
    adsCreated: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    Field: {
      type: [String],
    },
    activityDescription: {
      type: String,
      minlength: 3,
      maxlength: 500,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

userSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

userSchema.pre("findOneAndUpdate", function () {
  this.where({ isDeleted: false });
});

const User = mongoose.model("User", userSchema);

export default User;
