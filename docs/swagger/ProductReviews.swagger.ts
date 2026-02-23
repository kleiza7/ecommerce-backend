/**
 * @swagger
 * tags:
 *   name: ProductReviews
 *   description: Product review management endpoints
 */

///////////////////////////////////////////////////////////////
// GET REVIEWS BY PRODUCT ID (PUBLIC)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/product-reviews/get-reviews-by-product-id/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product (public)
 *     tags: [ProductReviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [id, rating, createdAt, user]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 5
 *                   rating:
 *                     type: integer
 *                     example: 4
 *                   comment:
 *                     type: string
 *                     nullable: true
 *                     example: "Great product!"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-02-22T10:15:30.000Z"
 *                   user:
 *                     type: object
 *                     required: [id, name]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// CREATE REVIEW (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/product-reviews/create:
 *   post:
 *     summary: Create a review for a product (USER only)
 *     tags: [ProductReviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, rating]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 12
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: "Amazing quality!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review created successfully"
 *       400:
 *         description: Invalid rating, duplicate review, or deleted product
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// UPDATE REVIEW (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/product-reviews/update:
 *   put:
 *     summary: Update user's review for a product (USER only)
 *     tags: [ProductReviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, rating]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 12
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated review text"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review updated successfully"
 *       400:
 *         description: Invalid rating or deleted product
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Review or product not found
 */

///////////////////////////////////////////////////////////////
// DELETE REVIEW (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/product-reviews/delete/{productId}:
 *   delete:
 *     summary: Delete user's review for a product (USER only)
 *     tags: [ProductReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *             example:
 *               message: "Review deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       404:
 *         description: Review not found
 */
