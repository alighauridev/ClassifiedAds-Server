import Ad from "../models/sellAdSchema.js";
import notFound from "../errors/notFound.js";
import { paginationAndFilter } from "../utils/reuseable.js";
import User from "../models/user.js";
//fetch all ads
const ads = async (req, res, next) => {
  try {
    let { limit, page, filter = {} } = req.body;

    let fp = paginationAndFilter(page, limit, filter);

    let ads = await Ad.find({
      ...filter,
      status: { $eq: "accepted" },
    })
      .select("-__v")
      .sort({ priority: -1 }) // Sort by priority, with high priority ads appearing first
      .skip(fp.pagination.limit * (fp.pagination.page - 1))
      .limit(fp.pagination.limit)
      .populate("author", "-__v");

    let count = await Ad.countDocuments({
      status: { $eq: "accepted" },
    });

    return res.status(200).json({ status: "OK", data: ads, count: count });
  } catch (err) {
    next(err);
  }
};

//fetch ad by id
const ad = async (req, res, next) => {
  try {
    let { id } = req.body;
    let ad = await Ad.findById(id).select("-__v").populate("author", "-__v");
    if (!ad) {
      let err = new notFound("Ad Does not exsists");
      return next(err);
    }
    return res.status(200).json({ status: "OK", data: ad });
  } catch (err) {
    next(err);
  }
};

//create ad
const createAd = async (req, res, next) => {
  try {
    const author = req.user._id;

    // Check if the user has a subscribed plan
    const user = await User.findById(author).populate("plan");


    // Check if the user has reached the ads limit
    if (user.adsCreated >= user.plan.adsLimit) {
      return res
        .status(400)
        .json({ message: "You have reached your ads limit" });
    }
    let priority = "normal"; // Default priority

    // Assign priority based on the subscribed plan
    if (user.plan.name === "Bronze") {
      priority = "low";
    } else if (user.plan.name === "Silver") {
      priority = "medium";
    } else if (user.plan.name === "Gold") {
      priority = "high";
    }
    // Create the ad
    const {
      title,
      description,
      price,
      category,
      subCategory,
      images,
      transaction,
      telephone,
      Location,
      status,
      League,
    } = req.body;
    const ad = await Ad.create({
      title,
      description,
      author,
      price,
      category,
      subCategory,
      images,
      transaction,
      telephone,
      Location,
      status,
      League,
      priority, // Set priority based on plan
    });

    // Increment the adsCreated count for the user
    user.adsCreated++;
    await user.save();

    return res.status(201).json({ status: "OK", ad });
  } catch (err) {
    next(err);
  }
};

//update ad
const updateAd = async (req, res, next) => {
  let { id, view = 0, ...data } = req.body;
  // console.log(JSON.stringify(req.body));
  try {
    let inc = {};
    if (view == 1) {
      inc = { $inc: { views: 1 } };
    }
    let ad = await Ad.findByIdAndUpdate(id, { ...data, ...inc }, { new: true });
    if (!ad) {
      let err = new notFound("Ad Does not exsists");
      return next(err);
    }
    return res.status(200).json({ status: "OK", ad });
  } catch (err) {
    next(err);
  }
};

//delete ad
const deleteAd = async (req, res, next) => {
  let { id } = req.body;
  try {
    let ad = await Ad.findByIdAndDelete(id);
    if (!ad) {
      let err = new notFound("Ad Does not exsists");
      return next(err);
    }
    return res.status(200).json({ status: "OK", ad });
  } catch (err) {
    next(err);
  }
};
//admin all
//fetch all ads
const adsAdmin = async (req, res, next) => {
  try {
    let ads = await Ad.find()
      .select("-__v")

      .populate("author", "-__v");

    return res.status(200).json({ status: "OK", data: ads });
  } catch (err) {
    next(err);
  }
};

export default { ads, ad, createAd, updateAd, deleteAd, adsAdmin };
