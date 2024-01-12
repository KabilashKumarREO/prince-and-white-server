import User from "@/models/User";
import { JwtPayload, verify } from "jsonwebtoken";

export const mustAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const clientToken = authorization?.split("Bearer ")[1];
  if (!clientToken)
    return res.status(403).json({ error: "unauthorized request" });

  const payload = verify(clientToken, process.env.JWT_SECRET);
  // console.log(payload);

  const id = payload.userId;
  const user = await User.findOne({ _id: id, tokens: clientToken });
  if (!user) return res.status(403).json({ error: "unauthorized request" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  req.token = clientToken;

  next();
};
