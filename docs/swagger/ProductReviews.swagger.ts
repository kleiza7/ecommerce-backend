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
 *           minimum: 1
 *         example: 12
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductReviewPublic'
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
 *                 minimum: 1
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
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
 * /api/product-reviews/delete/{id}:
 *   delete:
 *     summary: Delete user's review (USER only)
 *     tags: [ProductReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 5
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only delete your own review
 *       404:
 *         description: Review not found
 */

///////////////////////////////////////////////////////////////
// COMPONENT SCHEMAS
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductReviewPublic:
 *       type: object
 *       required: [id, rating, createdAt, user]
 *       properties:
 *         id:
 *           type: integer
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           required: [id, name]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *
 *     ProductReview:
 *       type: object
 *       required:
 *         - id
 *         - productId
 *         - userId
 *         - rating
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *         productId:
 *           type: integer
 *         userId:
 *           type: integer
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
