import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const mustAuth = async (req, res, next) => {
  const clientToken = req.headers.authorization;
  if (!clientToken)
    return res.status(403).json({ error: "unauthorized request" });

  const payload = jwt.verify(clientToken, process.env.JWT_SECRET);
  const email = payload.email;
  console.log("EMAIL: ", email);
  const user = await User.findOne({ email: email, tokens: clientToken });
  if (!user) return res.status(403).json({ error: "unauthorized request" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  req.token = clientToken;

  next();
};
