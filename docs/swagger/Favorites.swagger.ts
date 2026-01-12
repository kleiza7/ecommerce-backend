/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: User favorites management endpoints
 */

///////////////////////////////////////////////////////////////
// GET FAVORITES LIST BY USER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/get-favorites-list-by-user:
 *   get:
 *     summary: Get favorite products of the logged-in user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite products list
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 productId: 12
 *                 createdAt: "2026-01-10T12:30:00.000Z"
 *                 product:
 *                   id: 12
 *                   name: "iPhone 16"
 *                   description: "Flagship phone"
 *                   price: 1999
 *                   stockCount: 25
 *                   brandId: 1
 *                   categoryId: 4
 *                   currencyId: 1
 *                   images:
 *                     - id: 5
 *                       mediumUrl: "/uploads/products/iphone16.jpg"
 *                       isPrimary: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User role required
 */

///////////////////////////////////////////////////////////////
// TOGGLE FAVORITE
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/toggle-favorite:
 *   post:
 *     summary: Add or remove a product from favorites
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
 *                 type: number
 *                 example: 12
 *     responses:
 *       200:
 *         description: Toggle result
 *         content:
 *           application/json:
 *             example:
 *               isFavorited: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User role required
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// MERGE GUEST FAVORITES (LOGIN SONRASI)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/favorites/merge:
 *   post:
 *     summary: Merge guest favorites into user favorites after login
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
 *                   type: number
 *                 example: [3, 7, 12]
 *     responses:
 *       200:
 *         description: Merged favorites list
 *         content:
 *           application/json:
 *             example:
 *               - id: 4
 *                 productId: 12
 *                 createdAt: "2026-01-10T12:45:00.000Z"
 *                 product:
 *                   id: 12
 *                   name: "iPhone 16"
 *                   description: "Flagship phone"
 *                   price: 1999
 *                   stockCount: 25
 *                   brandId: 1
 *                   categoryId: 4
 *                   currencyId: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User role required
 */
