import express from "express";
import "dotenv/config";
import "express-async-errors";
import cors from "cors";
import mongoose from "mongoose";
// import "./db/index.js";

import authRouter from "./routers/auth.router.js";
import productRouter from "./routers/product.router.js";
import { errorhandler } from "./middleware/error.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB conn error: ", err);
  });
console.log(process.env.CLIENT_URL);

const app = express();
app.use(express.json());
app.use(cors({}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

// routes
app.use("/auth", authRouter);
app.use("/product", productRouter);

app.use(errorhandler);

app.listen(process.env.PORT, () => {
  console.log("listening on ", process.env.PORT);
});
