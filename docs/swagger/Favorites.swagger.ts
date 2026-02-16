/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: User favorites management endpoints
 */

///////////////////////////////////////////////////////////////
// GET FAVORITES LIST BY USER (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/get-favorites-list-by-user:
 *   get:
 *     summary: Get current user's favorite products
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites list retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 productId: 5
 *                 product:
 *                   id: 5
 *                   name: "iPhone 16"
 *                   description: "Flagship phone"
 *                   stockCount: 25
 *                   price: 1999
 *                   status: "APPROVED"
 *                   brand:
 *                     id: 1
 *                     name: "Apple"
 *                   category:
 *                     id: 4
 *                     name: "Smartphones"
 *                   currency:
 *                     id: 1
 *                     code: "USD"
 *                     symbol: "$"
 *                   seller:
 *                     id: 3
 *                     name: "Sapphire Store"
 *                   images:
 *                     - id: 10
 *                       mediumUrl: "http://localhost:5000/uploads/products/medium/iphone.jpg"
 *                       isPrimary: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */

///////////////////////////////////////////////////////////////
// TOGGLE FAVORITE (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/toggle-favorite:
 *   post:
 *     summary: Toggle favorite status for a product
 *     tags: [Favorites]
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
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Favorite status toggled successfully
 *         content:
 *           application/json:
 *             example:
 *               isFavorited: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// MERGE GUEST FAVORITES (USER ONLY)
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
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [3, 5, 8]
 *     responses:
 *       200:
 *         description: Guest favorites merged successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 productId: 5
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
 */
