import jwt from "jsonwebtoken";
import User from "../models/User.js";

// signup
export const create = async (req, res) => {
  const { email, password, name } = req.body;

  const isExist = await User.findOne({ email: email });
  if (isExist)
    return res.status(403).json({ error: "User email already exists" });

  try {
    const user = await User.create({ email, password, name });
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    user.tokens = token;
    await user.save();

    return res.status(201).json({
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
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

  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  user.tokens = token;
  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token: token,
  });
};

// auth check
export const isAuth = async (req, res) => {
  const clientToken = req.headers.authorization;
  if (!clientToken)
    return res.status(403).json({ error: "unauthorized request" });

  const payload = jwt.verify(clientToken, process.env.JWT_SECRET);
  // console.log(payload);

  const email = payload.email;
  const user = await User.findOne({ email: email, tokens: clientToken });
  if (!user) return res.status(403).json({ error: "unauthorized request" });

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token: user.tokens,
  });
};

// logout
export const logout = async (req, res) => {
  const { email, token } = req.body;

  const user = await User.findOne({ email: email, tokens: token });
  if (!user) return res.status(403).json({ error: "User not found" });

  user.tokens = "";
  await user.save();
  res.json({ success: true });
};
