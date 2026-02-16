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
 *                     type: object
 *                     required: [id, cartId, productId, currencyId, quantity, priceSnapshot, product]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       cartId:
 *                         type: integer
 *                         example: 3
 *                       productId:
 *                         type: integer
 *                         example: 5
 *                       currencyId:
 *                         type: integer
 *                         example: 1
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       priceSnapshot:
 *                         type: number
 *                         example: 1999
 *                       product:
 *                         type: object
 *                         required: [id, name, description, stockCount, price, status, brand, category, currency, seller, images]
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "iPhone 16"
 *                           description:
 *                             type: string
 *                             example: "Flagship phone"
 *                           stockCount:
 *                             type: integer
 *                             example: 25
 *                           price:
 *                             type: number
 *                             example: 1999
 *                           status:
 *                             type: string
 *                             enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *                             example: "APPROVED"
 *                           brand:
 *                             type: object
 *                             required: [id, name]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Apple"
 *                           category:
 *                             type: object
 *                             required: [id, name]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 4
 *                               name:
 *                                 type: string
 *                                 example: "Smartphones"
 *                           currency:
 *                             type: object
 *                             required: [id, code, symbol]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               code:
 *                                 type: string
 *                                 example: "USD"
 *                               symbol:
 *                                 type: string
 *                                 example: "$"
 *                           seller:
 *                             type: object
 *                             required: [id, name]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 3
 *                               name:
 *                                 type: string
 *                                 example: "Sapphire Store"
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               required: [thumbUrl, isPrimary]
 *                               properties:
 *                                 thumbUrl:
 *                                   type: string
 *                                   example: "http://localhost:5000/uploads/products/thumb/iphone.jpg"
 *                                 isPrimary:
 *                                   type: boolean
 *                                   example: true
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
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Validation error or mixed currency carts are not allowed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
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
 *                 example: 12
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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
 *                       example: 5
 *                     quantity:
 *                       type: integer
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
 *                     type: object
 *       400:
 *         description: Mixed currency carts are not allowed or quantity validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
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
 *             example:
 *               message: "Item removed from cart"
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
 *             example:
 *               message: "Cart cleared"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */
