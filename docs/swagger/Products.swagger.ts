/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and moderation endpoints
 */

///////////////////////////////////////////////////////////////
// LIST PRODUCTS (APPROVED ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/list:
 *   post:
 *     summary: List approved products with pagination, filtering and sorting
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 example: 20
 *               filter:
 *                 type: object
 *                 properties:
 *                   brandIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [1, 2]
 *                   categoryIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [4]
 *                   sellerIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [3]
 *                   query:
 *                     type: string
 *                     example: "iphone"
 *               sort:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                     enum: [id, createdAt, price]
 *                     example: "price"
 *                   order:
 *                     type: string
 *                     enum: [asc, desc]
 *                     example: "desc"
 *     responses:
 *       200:
 *         description: Product list with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [items, pagination]
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, name, description, stockCount, price, status, brand, category, currency, seller, images]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
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
 *                 pagination:
 *                   type: object
 *                   required: [total, page, limit, totalPages]
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 27
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 */

///////////////////////////////////////////////////////////////
// GET PRODUCTS BY SELLER (SELLER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/get-products-by-seller:
 *   get:
 *     summary: Get seller's products (APPROVED + WAITING_FOR_APPROVE + NOT_APPROVED)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires SELLER role)
 */

///////////////////////////////////////////////////////////////
// GET WAITING APPROVAL PRODUCTS (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/get-waiting-approval-products:
 *   get:
 *     summary: Get products waiting for approval (ADMIN only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 */

///////////////////////////////////////////////////////////////
// APPROVE PRODUCT (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/approve/{id}:
 *   put:
 *     summary: Approve a product (ADMIN only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Product approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product approved successfully"
 *             example:
 *               message: "Product approved successfully"
 *       400:
 *         description: Deleted product status cannot be changed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// REJECT PRODUCT (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/reject/{id}:
 *   put:
 *     summary: Reject a product (ADMIN only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Product rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product rejected successfully"
 *             example:
 *               message: "Product rejected successfully"
 *       400:
 *         description: Deleted product status cannot be changed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// GET PRODUCT BY ID (PUBLIC)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/get-by-id/{id}:
 *   get:
 *     summary: Get product detail by ID (public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, name, description, stockCount, price, status, brand, category, currency, seller, images]
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: "iPhone 16"
 *                 description:
 *                   type: string
 *                   example: "Flagship phone"
 *                 stockCount:
 *                   type: integer
 *                   example: 25
 *                 price:
 *                   type: number
 *                   example: 1999
 *                 status:
 *                   type: string
 *                   enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *                   example: "APPROVED"
 *                 brand:
 *                   type: object
 *                   required: [id, name]
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Apple"
 *                 category:
 *                   type: object
 *                   required: [id, name]
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     name:
 *                       type: string
 *                       example: "Smartphones"
 *                 currency:
 *                   type: object
 *                   required: [id, code, symbol]
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     code:
 *                       type: string
 *                       example: "USD"
 *                     symbol:
 *                       type: string
 *                       example: "$"
 *                 seller:
 *                   type: object
 *                   required: [id, name]
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Sapphire Store"
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, productId, originalUrl, thumbUrl, mediumUrl, largeUrl, isPrimary, createdAt, updatedAt]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       productId:
 *                         type: integer
 *                         example: 5
 *                       originalUrl:
 *                         type: string
 *                         example: "http://localhost:5000/uploads/products/original/iphone.jpg"
 *                       thumbUrl:
 *                         type: string
 *                         example: "http://localhost:5000/uploads/products/thumb/iphone.jpg"
 *                       mediumUrl:
 *                         type: string
 *                         example: "http://localhost:5000/uploads/products/medium/iphone.jpg"
 *                       largeUrl:
 *                         type: string
 *                         example: "http://localhost:5000/uploads/products/large/iphone.jpg"
 *                       publicId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       isPrimary:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-17T12:34:56.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-17T12:34:56.000Z"
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// CREATE PRODUCT (SELLER ONLY + IMAGES)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product (SELLER only) and set status WAITING_FOR_APPROVE
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, stockCount, price, brandId, categoryId, currencyId, images]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "PlayStation 6"
 *               description:
 *                 type: string
 *                 example: "Next-gen gaming console"
 *               stockCount:
 *                 type: integer
 *                 example: 50
 *               price:
 *                 type: number
 *                 example: 899
 *               brandId:
 *                 type: integer
 *                 example: 3
 *               categoryId:
 *                 type: integer
 *                 example: 8
 *               currencyId:
 *                 type: integer
 *                 example: 1
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid brandId/categoryId/currencyId or at least 1 image is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires SELLER role)
 */

///////////////////////////////////////////////////////////////
// UPDATE PRODUCT (SELLER ONLY + IMAGE MANAGEMENT)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/update:
 *   put:
 *     summary: Update product (SELLER only) and set status WAITING_FOR_APPROVE
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [id, name, description, stockCount, price, brandId, categoryId, currencyId, deletedImageIds]
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 10
 *               name:
 *                 type: string
 *                 example: "PlayStation 6 Updated"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               stockCount:
 *                 type: integer
 *                 example: 60
 *               price:
 *                 type: number
 *                 example: 999
 *               brandId:
 *                 type: integer
 *                 example: 3
 *               categoryId:
 *                 type: integer
 *                 example: 8
 *               currencyId:
 *                 type: integer
 *                 example: 1
 *               deletedImageIds:
 *                 type: string
 *                 example: "[3,5]"
 *               newAddedImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Deleted product cannot be updated or invalid brandId/categoryId/currencyId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires SELLER role or ownership)
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// DELETE PRODUCT (SELLER ONLY - SOFT DELETE)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Soft delete product (SELLER only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *             example:
 *               message: "Product deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires SELLER role or ownership)
 *       404:
 *         description: Product not found
 */
