import express from "express";
import cartController from "../controllers/cart.controller.js";
import { authenticateMiddleware } from "../middlewares/auth.js";

const cartRouter = express.Router();

// Lấy giỏ hàng của user
cartRouter.get("/", authenticateMiddleware, cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
cartRouter.post("/", authenticateMiddleware, cartController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
cartRouter.put("/:productId", authenticateMiddleware, cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete("/:productId", authenticateMiddleware, cartController.removeFromCart);

export default cartRouter; 