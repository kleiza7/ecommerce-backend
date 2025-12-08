/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations for authenticated users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CartItemProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         name:
 *           type: string
 *           example: "iPhone 14"
 *         description:
 *           type: string
 *           example: "Apple smartphone 2023"
 *         price:
 *           type: number
 *           example: 24999.90
 *         brandId:
 *           type: integer
 *           example: 2
 *         categoryId:
 *           type: integer
 *           example: 5
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         productId:
 *           type: integer
 *           example: 10
 *         quantity:
 *           type: integer
 *           example: 2
 *         priceSnapshot:
 *           type: number
 *           example: 24999.90
 *         product:
 *           $ref: "#/components/schemas/CartItemProduct"
 *
 *     AddToCartInput:
 *       type: object
 *       required: [productId, quantity]
 *       properties:
 *         productId:
 *           type: integer
 *           example: 10
 *         quantity:
 *           type: integer
 *           example: 1
 *
 *     UpdateCartQuantityInput:
 *       type: object
 *       required: [quantity]
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 3
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/CartItem"
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add a product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AddToCartInput"
 *     responses:
 *       201:
 *         description: Item added or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CartItem"
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/cart/update/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateCartQuantityInput"
 *     responses:
 *       200:
 *         description: Item updated or removed
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: "#/components/schemas/CartItem"
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Item removed"
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /api/cart/remove/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item removed from cart"
 *       404:
 *         description: Cart item not found
 */

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear user's entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart cleared"
 */
