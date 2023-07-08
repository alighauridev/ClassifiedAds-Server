import Ad from "../models/sellAdSchema.js";
import notFound from "../errors/notFound.js";
import { paginationAndFilter } from "../utils/reuseable.js";
import User from "../models/user.js";
import { convertCurrency } from "../utils/currenyConverter.js";
import Category from "../models/Category.js";
//fetch all ads
const ads = async (req, res, next) => {
  try {
    const { limit, page, filter = {}, currency } = req.body;

    // const baseCurrency = req.user.currency;

    let fp = paginationAndFilter(page, limit, filter);

    let ads = await Ad.find({
      ...filter,
      status: { $eq: "accepted" },
    })
      .select("-__v")
      .sort({ priority: -1 })
      .skip(fp.pagination.limit * (fp.pagination.page - 1))
      .limit(fp.pagination.limit)
      .populate("author", "-__v");

    // Convert prices to target currency
    for (let ad of ads) {
      const convertedPrice = await convertCurrency(ad.price, "USD", currency);
      ad.price = convertedPrice;
      ad.currency = currency;
    }

    let count = await Ad.countDocuments({});

    return res
      .status(200)
      .json({ status: "OK", data: ads, count: count, currency });
  } catch (err) {
    console.log(err);
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


const createAd = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user).populate("plan");
    const cat = await Category.findById(req.body.category);
    if (user) {
      if (user?.adsCreated >= user?.plan?.totalAds) {
        return res.status(400).json({ message: "You have reached your ads limit" });
      }

      let priority = "normal";

      if (user.plan.name === "Bronze") {
        priority = "low";
      } else if (user.plan.name === "Silver") {
        priority = "medium";
      } else if (user.plan.name === "Gold") {
        priority = "high";
      }
    }

    const {
      title,
      description,
      price,
      brand,
      category,
      images,
      type,
      name,
      telephone,
      condition,
      location,
      warranty,
      bulkPrice,
      squareMeter,
      propertyType,
      furnishing,
      parkingSpace,
      minimumRentTime,
      agencyFee,
      legalAndAgreement,
      cautionFee
    } = req.body;

    // Modified code for creating ad based on category
    let adData = {
      title,
      description,
      price,
      category,
      images,
      name,
      telephone,
      location
    };

    if (cat.name === "Property") {
      adData.property = {
        squareMeter,
        propertyType,
        furnishing,
        condition,
        parkingSpace,
        minimumRentTime,
        agencyFee,
        legalAndAgreement,
        cautionFee
      };
    } else if (cat.name === "Vehicle") {
      adData.vehicle = {
        brand,
        type,
        condition,
        warranty,
        bulkPrice
      };
    }
    else {
      res.status(400).json({ msg: "error", car: cat.name })
    }

    const ad = await Ad.create(adData);

    if (user) {
      user.adsCreated++;
      await user.save();
    }

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
