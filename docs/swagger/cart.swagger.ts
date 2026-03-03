/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart endpoints (USER only)
 */

///////////////////////////////////////////////////////////////
// GET CART
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/get-cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [items]
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItemDetailed'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */

///////////////////////////////////////////////////////////////
// ADD ITEM
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart (returns updated cart items array)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItemDetailed'
 *       400:
 *         description: Validation error or mixed currency carts are not allowed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Product not found
 *       409:
 *         description: Only X items left in stock
 */

///////////////////////////////////////////////////////////////
// UPDATE QUANTITY
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update cart item quantity (returns updated cart items array)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId, quantity]
 *             properties:
 *               itemId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 12
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItemDetailed'
 *       400:
 *         description: Quantity must be at least 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Cart not found or cart item not found
 *       409:
 *         description: Only X items left in stock
 */

///////////////////////////////////////////////////////////////
// MERGE GUEST CART
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/merge:
 *   post:
 *     summary: Merge guest cart into user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       minimum: 1
 *                       example: 5
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       200:
 *         description: Cart merged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [items]
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItemDetailed'
 *       400:
 *         description: Mixed currency carts are not allowed or quantity validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Product not found
 *       409:
 *         description: Only X items left in stock
 */

///////////////////////////////////////////////////////////////
// REMOVE ITEM
///////////////////////////////////////////////////////////////
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
 *           minimum: 1
 *         example: 12
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item removed from cart"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Cart not found or cart item not found
 */

///////////////////////////////////////////////////////////////
// CLEAR CART
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart cleared"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */

///////////////////////////////////////////////////////////////
// COMPONENT SCHEMAS
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItemDetailed:
 *       type: object
 *       required: [id, cartId, productId, currencyId, quantity, priceSnapshot, product]
 *       properties:
 *         id:
 *           type: integer
 *         cartId:
 *           type: integer
 *         productId:
 *           type: integer
 *         currencyId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         priceSnapshot:
 *           type: number
 *         product:
 *           type: object
 *           required: [id, name, description, stockCount, price, status, brand, category, currency, seller, images]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             stockCount:
 *               type: integer
 *             price:
 *               type: number
 *             status:
 *               type: string
 *               enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *             brand:
 *               type: object
 *               required: [id, name]
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *             category:
 *               type: object
 *               required: [id, name]
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *             currency:
 *               type: object
 *               required: [id, code, symbol]
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 symbol:
 *                   type: string
 *             seller:
 *               type: object
 *               required: [id, name]
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *             images:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [thumbUrl, isPrimary]
 *                 properties:
 *                   thumbUrl:
 *                     type: string
 *                   isPrimary:
 *                     type: boolean
 */
