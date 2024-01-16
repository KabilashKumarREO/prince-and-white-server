import Order from "../models/Order.js";

// add order
export const addNewOrder = async (req, res) => {
  try {
    const {
      orderId,
      accountEmail,
      cart,
      totalPrice,
      firstName,
      lastName,
      country,
      streetAddress,
      city,
      province,
      zipcode,
    } = req.body;

    const order = await Order.create({
      orderId,
      accountEmail,
      cart,
      totalPrice,
      firstName,
      lastName,
      country,
      streetAddress,
      city,
      province,
      zipcode,
    });

    await order.save();

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get an order
export const getOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const order = await Order.findOne({ orderId }).populate(
      "cart",
      "slug image title price"
    );

    if (!order) {
      return res.status(400).json({ error: "Order not found." });
    }

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get my orders
export const getMyOrders = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const orders = await Order.find({ email }).populate(
      "cart",
      "slug image title price"
    );

    if (!orders) {
      return res.status(400).json({ error: "Order not found." });
    }

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
