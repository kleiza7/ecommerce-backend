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
 *                 $ref: '#/components/schemas/Favorite'
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
 *                 minimum: 1
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
 *                 $ref: '#/components/schemas/Favorite'
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
 *     Favorite:
 *       type: object
 *       required: [id, productId, product]
 *       properties:
 *         id:
 *           type: integer
 *         productId:
 *           type: integer
 *         product:
 *           $ref: '#/components/schemas/FavoriteProduct'
 *
 *     FavoriteProduct:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - stockCount
 *         - price
 *         - status
 *         - brand
 *         - category
 *         - currency
 *         - seller
 *         - images
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         stockCount:
 *           type: integer
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *         brand:
 *           type: object
 *           required: [id, name]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         category:
 *           type: object
 *           required: [id, name]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         currency:
 *           type: object
 *           required: [id, code, symbol]
 *           properties:
 *             id:
 *               type: integer
 *             code:
 *               type: string
 *             symbol:
 *               type: string
 *         seller:
 *           type: object
 *           required: [id, name]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             required: [id, mediumUrl, isPrimary]
 *             properties:
 *               id:
 *                 type: integer
 *               mediumUrl:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 */
