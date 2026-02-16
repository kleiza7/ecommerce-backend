/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorites endpoints (USER only)
 */

///////////////////////////////////////////////////////////////
// GET FAVORITES LIST BY USER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/get-favorites-list-by-user:
 *   get:
 *     summary: Get favorites list of current user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [id, productId, product]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 15
 *                   productId:
 *                     type: integer
 *                     example: 5
 *                   product:
 *                     type: object
 *                     required: [id, name, description, stockCount, price, status, brand, category, currency, seller, images]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       name:
 *                         type: string
 *                         example: "iPhone 16"
 *                       description:
 *                         type: string
 *                         example: "Flagship phone"
 *                       stockCount:
 *                         type: integer
 *                         example: 25
 *                       price:
 *                         type: number
 *                         example: 1999
 *                       status:
 *                         type: string
 *                         enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *                         example: "APPROVED"
 *                       brand:
 *                         type: object
 *                         required: [id, name]
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Apple"
 *                       category:
 *                         type: object
 *                         required: [id, name]
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 4
 *                           name:
 *                             type: string
 *                             example: "Smartphones"
 *                       currency:
 *                         type: object
 *                         required: [id, code, symbol]
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           code:
 *                             type: string
 *                             example: "USD"
 *                           symbol:
 *                             type: string
 *                             example: "$"
 *                       seller:
 *                         type: object
 *                         required: [id, name]
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "Sapphire Store"
 *                       images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           required: [id, mediumUrl, isPrimary]
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             mediumUrl:
 *                               type: string
 *                               example: "http://localhost:5000/uploads/products/medium/iphone.jpg"
 *                             isPrimary:
 *                               type: boolean
 *                               example: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */

///////////////////////////////////////////////////////////////
// TOGGLE FAVORITE
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/toggle-favorite:
 *   post:
 *     summary: Toggle favorite for a product
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Favorite toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [isFavorited]
 *               properties:
 *                 isFavorited:
 *                   type: boolean
 *                   example: true
 *             example:
 *               isFavorited: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// MERGE GUEST FAVORITES
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/merge:
 *   post:
 *     summary: Merge guest favorites into user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productIds]
 *             properties:
 *               productIds:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: integer
 *                 example: [5, 7, 9]
 *     responses:
 *       200:
 *         description: Favorites merged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */
