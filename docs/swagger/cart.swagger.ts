/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User cart management endpoints
 */

///////////////////////////////////////////////////////////////
// GET CART (USER ONLY)
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
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               items:
 *                 - id: 1
 *                   cartId: 2
 *                   productId: 5
 *                   currencyId: 1
 *                   quantity: 2
 *                   priceSnapshot: 1999
 *                   product:
 *                     id: 5
 *                     name: "iPhone 16"
 *                     description: "Flagship phone"
 *                     stockCount: 25
 *                     price: 1999
 *                     status: "APPROVED"
 *                     brand:
 *                       id: 1
 *                       name: "Apple"
 *                     category:
 *                       id: 4
 *                       name: "Smartphones"
 *                     currency:
 *                       id: 1
 *                       code: "USD"
 *                       symbol: "$"
 *                     seller:
 *                       id: 3
 *                       name: "Sapphire Store"
 *                     images:
 *                       - thumbUrl: "http://localhost:5000/uploads/products/thumb/iphone.jpg"
 *                         isPrimary: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */

///////////////////////////////////////////////////////////////
// ADD ITEM TO CART (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 cartId: 2
 *                 productId: 5
 *                 currencyId: 1
 *                 quantity: 2
 *                 priceSnapshot: 1999
 *                 product:
 *                   id: 5
 *                   name: "iPhone 16"
 *                   description: "Flagship phone"
 *                   stockCount: 25
 *                   price: 1999
 *                   status: "APPROVED"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       409:
 *         description: Stock conflict or mixed currency cart
 */

///////////////////////////////////////////////////////////////
// UPDATE CART ITEM QUANTITY (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - quantity
 *             properties:
 *               itemId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 cartId: 2
 *                 productId: 5
 *                 currencyId: 1
 *                 quantity: 3
 *                 priceSnapshot: 1999
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Cart or cart item not found
 *       409:
 *         description: Stock conflict
 */

///////////////////////////////////////////////////////////////
// MERGE GUEST CART (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/merge:
 *   post:
 *     summary: Merge guest cart items into user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 5
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       200:
 *         description: Guest cart merged successfully
 *         content:
 *           application/json:
 *             example:
 *               items:
 *                 - id: 1
 *                   cartId: 2
 *                   productId: 5
 *                   currencyId: 1
 *                   quantity: 2
 *                   priceSnapshot: 1999
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       409:
 *         description: Stock conflict or mixed currency cart
 */

///////////////////////////////////////////////////////////////
// REMOVE ITEM FROM CART (USER ONLY)
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Item removed from cart"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Cart or cart item not found
 */

///////////////////////////////////////////////////////////////
// CLEAR CART (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Cart cleared"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */
