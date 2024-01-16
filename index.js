import express from "express";
import "dotenv/config";
import "express-async-errors";
import cors from "cors";
import "./db/index.js";

import authRouter from "./routers/auth.router.js";
import productRouter from "./routers/product.router.js";
import orderRouter from "./routers/order.router.js";
import { errorhandler } from "./middleware/error.js";

const app = express();
app.use(express.json());

const allowedOrigins = process.env.CLIENT_URL;
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

// routes
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

app.use(errorhandler);

app.listen(process.env.PORT, () => {
  console.log("listening on ", process.env.PORT);
});
