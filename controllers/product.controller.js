import Product from "../models/Product.js";

// get all products
export const allProducts = async (req, res) => {
  try {
    const products = await Product.find();
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
    console.log(slug);
    const products = await Product.find({ category: { $in: [slug] } });

    if (products.length === 0)
      return res.status(400).json({ message: "Category not found" });

    return res.json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
