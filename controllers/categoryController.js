// Get All Categories Controller

import Category from "../models/Category.js";

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
    }).populate("subcategories");
    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};
// get single category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category Not Found" });
    }
    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};
// create a category
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        error: "Parent category ID, subcategory name, and slug are required.",
      });
    }

    const newCategory = new Category({
      name,
      slug,
    });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get Recent Categories Controller
const getRecentCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ _id: -1 });

    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update Category Controller
const updateCategory = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "parentCategory", "subcategories"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      category[update] = req.body[update];
      if (update === "name") {
        // Generate a new slug whenever the name is updated
        category["slug"] = req.body[update]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");
      }
    });

    await category.save();
    res.send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete Category Controller
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send();
    }

    // Remove the category from its parent category's subcategories list
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { subcategories: category._id },
      });
    }

    // Delete all subcategories
    if (category.subcategories) {
      await Category.deleteMany({ _id: { $in: category.subcategories } });
    }

    await category.remove();

    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get Subcategories Controller
const getSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send();
    }
    const subcategories = await Category.find({ parentCategory: category._id });
    res.send(subcategories);
  } catch (error) {
    res.status(500).send(error);
  }
};

// create a subcategory
const createSubcategory = async (req, res) => {
  try {
    const { parentId, name, slug } = req.body;

    if (!parentId || !name || !slug) {
      return res.status(400).json({
        error: "Parent category ID, subcategory name, and slug are required.",
      });
    }

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({ error: "Parent category not found." });
    }

    const newSubcategory = new Category({
      name,
      slug,
      parentCategory: parentId,
    });
    const savedSubcategory = await newSubcategory.save();

    parentCategory.subcategories.push(savedSubcategory._id);
    await parentCategory.save();

    res.status(201).json(savedSubcategory);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// delete a subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const parentCategory = await Category.findById(req.params.parentId);
    if (!parentCategory) {
      return res.status(404).send();
    }
    const subcategoryId = req.params.subcategoryId;
    const subcategoryIndex =
      parentCategory.subcategories.indexOf(subcategoryId);
    if (subcategoryIndex === -1) {
      return res.status(404).send();
    }
    parentCategory.subcategories.splice(subcategoryIndex, 1);
    await Category.findByIdAndDelete(subcategoryId);
    await parentCategory.save();
    res.send(parentCategory);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getCategoriesWithSubcategories = async (req, res) => {
  try {
    const topLevelCategories = await Category.find({
      parentCategory: null,
    }).populate("subcategories");
    const categoriesWithSubcategories = await Promise.all(
      topLevelCategories.map(async (topLevelCategory) => {
        const subcategories = await Promise.all(
          topLevelCategory.subcategories.map(async (subcategoryId) => {
            const subcategory = await Category.findById(subcategoryId).populate(
              "subcategories"
            );
            return subcategory;
          })
        );
        return { ...topLevelCategory._doc, subcategories };
      })
    );
    res.status(200).json(categoriesWithSubcategories);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteAllAds = async () => {
  try {
    // Delete all ads
    const result = await Category.deleteMany({});

    console.log(`${result.deletedCount} ads deleted successfully.`);
  } catch (error) {
    console.error('An error occurred while deleting ads:', error);
  }
};

// Call the function to delete all ads
// deleteAllAds();
export default {
  getCategories,
  getCategory,
  createCategory,
  getRecentCategories,
  updateCategory,
  deleteCategory,
  getSubcategory,
  createSubcategory,
  deleteSubcategory,
  getCategoriesWithSubcategories,
};
