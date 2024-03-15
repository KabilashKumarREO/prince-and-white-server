import Product from "../models/Product.js";

// optimizely sdk import
import optimizelySDK from "@optimizely/optimizely-sdk";

const optimizelyClientInstance = optimizelySDK.createInstance({
  sdkKey: process.env.sdkKey,
});

/*
optimizelyClientInstance.onReady().then(() => {
  //optimizelyClientInstance downloaded your Optimizely configuration
  // console.log("Optimizely client ready");

  function makeid() {
    var userId = "";
    userId = String(Math.random());
    return userId;
  }
  // make a random user ID
  const userId = makeid();
  const enabled = optimizelyClientInstance.isFeatureEnabled(
    "discount_fashion",
    userId
  );
  const discountPercentage = optimizelyClientInstance.getFeatureVariable(
    "discount_fashion",
    "percentage",
    userId
  );
  console.log("ENABLED: ", enabled, discountPercentage);
});
*/

// get all products
export const allProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get one product
export const getProduct = async (req, res) => {
  try {
    const slug = req.query.productId;
    const product = await Product.findOne({ slug: slug });

    if (!product) {
      return res.status(400).json({ error: "Product not found." });
    }

    return res.json({ data: product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get products by category
export const getCategoryProducts = async (req, res) => {
  try {
    const slug = req.query.categoryId;
    const products = await Product.find({ category: slug }).sort({
      updatedAt: -1,
    });

    if (products.length === 0) {
      return res.status(400).json({ message: "Category not found" });
    }
    let result = [];
    let userId;

    await optimizelyClientInstance.onReady().then(() => {
      function makeid() {
        var userId = "";
        userId = String(Math.random());
        return userId;
      }
      // make a random user ID
      userId = makeid();
      const enabled = optimizelyClientInstance.isFeatureEnabled(
        "discount_fashion",
        userId
      );
      const discountPercentage = optimizelyClientInstance.getFeatureVariable(
        "discount_fashion",
        "percentage",
        userId
      );
      if (enabled && slug === "Fashion") {
        result = products.map((product) => {
          return {
            _id: product._id,
            slug: product.slug,
            title: product.title,
            description: product.description,
            image: product.image,
            category: product.category,
            usualPrice: product.price,
            price: product.price * (1 - discountPercentage / 100),
          };
        });
      } else {
        result = products;
      }
    });
    var user = optimizelyClientInstance.createUserContext(userId);
    user.trackEvent("pageview_fashion_category");

    return res.json({ products: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// add product
export const addProduct = async (req, res) => {
  try {
    const { slug, title, price, description, image, category1, category2 } =
      req.body;
    const product = await Product.create({
      slug,
      title,
      price,
      description,
      image,
    });
    if (category1) {
      product.category.push(category1);
    }
    if (category2) {
      product.category.push(category2);
    }
    await product.save();

    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
