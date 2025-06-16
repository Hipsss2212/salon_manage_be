import express from "express";
import productController from "../controllers/product.controller.js";
import { authenticateMiddleware, isAdmin } from "../middlewares/auth.js";

const productRouter = express.Router();

// Route thêm sản phẩm (Admin)
productRouter.post("/admin", authenticateMiddleware, isAdmin, productController.createProduct);

export default productRouter; 