import jwt from "jsonwebtoken";
import User from "../models/User.js";

// signup
export const create = async (req, res) => {
  const { email, password, name } = req.body;

  // check if user already exists
  const isExist = await User.findOne({ email: email });
  if (isExist)
    return res.status(403).json({ error: "user email already exists" });

  try {
    const user = await User.create({ email, password, name });

    return res.status(201).json({ user: { id: user._id, name, email } });
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
};

// sign in
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) return res.status(403).json({ error: "email not registered" });

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched)
    return res.status(403).json({ error: "email & password mismatch" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  user.tokens.push(token); // store token to DB.
  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
  });
};

// logout
export const logout = async (req, res) => {
  const { fromAll } = req.query;
  const token = req.token;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(403).json({ error: "user not found" });

  user.tokens = [];
  await user.save();
  res.json({ success: true });
};
