/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and moderation endpoints
 */

///////////////////////////////////////////////////////////////
// LIST PRODUCTS (PUBLIC + FILTER + PAGINATION)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/list:
 *   post:
 *     summary: List approved products with pagination, filtering and sorting
 *     tags: [Products]
 *     requestBody:
 *       required: false
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
 */

///////////////////////////////////////////////////////////////
// GET PRODUCTS BY SELLER (SELLER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/get-products-by-seller:
 *   get:
 *     summary: Get all products belonging to the authenticated seller
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller products retrieved successfully
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
 *     summary: Get products waiting for admin approval
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Waiting approval products retrieved successfully
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
 *     summary: Get product detail by ID
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
 *     summary: Create a new product with images (SELLER only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - stockCount
 *               - price
 *               - brandId
 *               - categoryId
 *               - currencyId
 *               - images
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
 *         description: Invalid brandId, categoryId, currencyId or missing images
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
 *     summary: Update an existing product and manage images (SELLER only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - description
 *               - stockCount
 *               - price
 *               - brandId
 *               - categoryId
 *               - currencyId
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 10
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               stockCount:
 *                 type: integer
 *               price:
 *                 type: number
 *               brandId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               currencyId:
 *                 type: integer
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
 *         description: Invalid brandId, categoryId, currencyId or deleted product cannot be updated
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
 *     summary: Soft delete a product (SELLER only)
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
 *             example:
 *               message: "Product deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires SELLER role or ownership)
 *       404:
 *         description: Product not found
 */
