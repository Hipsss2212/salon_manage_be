import db from "../database/index.js";

const cartController = {
  // Lấy giỏ hàng của user
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;
      let cart = await db.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
      if (!cart) {
        cart = await db.cart.create({
          data: { userId },
          include: {
            items: {
              include: { product: true },
            },
          },
        });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;
      let cart = await db.cart.findFirst({ where: { userId } });
      if (!cart) {
        cart = await db.cart.create({ data: { userId } });
      }
      const existingItem = await db.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });
      if (existingItem) {
        await db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await db.cartItem.create({
          data: { cartId: cart.id, productId, quantity },
        });
      }
      const updatedCart = await db.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const userId = req.user.id;
      const cart = await db.cart.findFirst({ where: { userId } });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      const cartItem = await db.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });
      if (!cartItem) {
        return res.status(404).json({ error: "Item not found in cart" });
      }
      if (quantity <= 0) {
        await db.cartItem.delete({ where: { id: cartItem.id } });
      } else {
        await db.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity },
        });
      }
      const updatedCart = await db.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
      const cart = await db.cart.findFirst({ where: { userId } });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      const cartItem = await db.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });
      if (!cartItem) {
        return res.status(404).json({ error: "Item not found in cart" });
      }
      await db.cartItem.delete({ where: { id: cartItem.id } });
      const updatedCart = await db.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default cartController; 