import express from "express";
import authRouter from "./auth.route.js";
import productRouter from "./product.route.js";
import paymentRouter from "./payment.routes.js";
import cartRouter from "./cart.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/payments", paymentRouter);
router.use("/cart", cartRouter);

export default router;
