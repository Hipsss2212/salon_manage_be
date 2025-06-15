import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productController = {
  // Create a new product (Admin only)
  createProduct: async (req, res) => {
    try {
      // Check admin role
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin only.",
        });
      }

      const {
        name,
        slug,
        description,
        shortDescription,
        brand,
        brandSlug,
        category,
        categorySlug,
        subcategory,
        subcategorySlug,
        price,
        listedPrice,
        cost,
        discountPercent,
        isDiscount,
        quantity,
        minimumStock,
        imageUrl,
        sku,
        tags,
        ingredients,
        manual,
        images,
        variants,
      } = req.body;

      // Create the product using a transaction
      const product = await prisma.$transaction(async (prisma) => {
        // Create the main product
        const newProduct = await prisma.product.create({
          data: {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            description,
            shortDescription,
            brand,
            brandSlug,
            category,
            categorySlug,
            subcategory,
            subcategorySlug,
            price: parseFloat(price),
            listedPrice: parseFloat(listedPrice || price),
            cost: cost ? parseFloat(cost) : null,
            discountPercent: discountPercent || 0,
            isDiscount: isDiscount || false,
            quantity: quantity || 0,
            minimumStock: minimumStock || 5,
            isOutOfStock: (quantity || 0) <= 0,
            imageUrl,
            sku,
            tags,
            ingredients,
            manual,
            isActive: true, // Default to active
          },
        });

        // Create product images if provided
        if (images && images.length > 0) {
          await prisma.productImage.createMany({
            data: images.map((image) => ({
              productId: newProduct.id,
              name: image.name,
              url: image.url,
              alt: image.alt,
            })),
          });
        }

        // Create product variants if provided
        if (variants && variants.length > 0) {
          await prisma.productVariant.createMany({
            data: variants.map((variant) => ({
              productId: newProduct.id,
              name: variant.name,
              price: parseFloat(variant.price),
              listedPrice: parseFloat(variant.listedPrice || variant.price),
              sku: variant.sku,
              imageUrl: variant.imageUrl,
              isDiscount: variant.isDiscount || false,
              discountPercent: variant.discountPercent || 0,
              isOutOfStock: variant.isOutOfStock || false,
            })),
          });
        }

        // Record initial inventory transaction
        if (quantity && quantity > 0) {
          await prisma.inventoryTransaction.create({
            data: {
              productId: newProduct.id,
              quantity: parseInt(quantity),
              unitPrice: parseFloat(cost || price),
              totalPrice: parseFloat(cost || price) * parseInt(quantity),
              employeeId: req.user.id,
              notes: "Initial stock",
            },
          });
        }

        return newProduct;
      });

      // Get the complete product with relations
      const completeProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
          images: true,
          variants: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: completeProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default productController; 