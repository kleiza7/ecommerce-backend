/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

///////////////////////////////////////////////////////////////
// LIST PRODUCTS (pagination + filtering)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/list:
 *   post:
 *     summary: List products with pagination and optional brand/category filters
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: number
 *                 example: 1
 *               limit:
 *                 type: number
 *                 example: 10
 *               brandId:
 *                 type: number
 *                 example: 2
 *               categoryId:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Product list
 *         content:
 *           application/json:
 *             example:
 *               items:
 *                 - id: 12
 *                   name: "IPhone 16"
 *                   description: "Flagship phone"
 *                   price: 1999
 *                   stockCount: 25
 *                   brandId: 1
 *                   categoryId: 4
 *                 - id: 11
 *                   name: "Samsung S25"
 *                   description: "Premium Android phone"
 *                   price: 1499
 *                   stockCount: 0
 *                   brandId: 2
 *                   categoryId: 4
 *               pagination:
 *                 total: 27
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 3
 */

///////////////////////////////////////////////////////////////
// GET PRODUCT BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/get-by-id/{id}:
 *   get:
 *     summary: Get a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 3
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "MacBook Pro 14"
 *               description: "M4 Pro model"
 *               price: 2999
 *               stockCount: 12
 *               brandId: 1
 *               categoryId: 2
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Product not found"
 */

///////////////////////////////////////////////////////////////
// CREATE PRODUCT (SELLER ONLY + IMAGES)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product (SELLER role required)
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
 *               - price
 *               - stockCount
 *               - brandId
 *               - categoryId
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 example: "PlayStation 6"
 *               description:
 *                 type: string
 *                 example: "Next-gen gaming console"
 *               price:
 *                 type: number
 *                 example: 899
 *               stockCount:
 *                 type: number
 *                 example: 50
 *               brandId:
 *                 type: number
 *                 example: 3
 *               categoryId:
 *                 type: number
 *                 example: 8
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Product images (min 1, max 10)"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 23
 *               name: "PlayStation 6"
 *               description: "Next-gen gaming console"
 *               price: 899
 *               stockCount: 50
 *               brandId: 3
 *               categoryId: 8
 *               images:
 *                 - id: 101
 *                   originalUrl: "/uploads/products/original/abc.jpg"
 *                   thumbUrl: "/uploads/products/thumbs/abc.jpg"
 *                   mediumUrl: "/uploads/products/medium/abc.jpg"
 *                   largeUrl: "/uploads/products/large/abc.jpg"
 *                   isPrimary: true
 *       400:
 *         description: Brand or Category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Seller role required
 */

///////////////////////////////////////////////////////////////
// UPDATE PRODUCT (SELLER ONLY + IMAGE ADD/DELETE SUPPORT)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/update/{id}:
 *   put:
 *     summary: Update an existing product (SELLER role required)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 10
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stockCount:
 *                 type: number
 *                 example: 30
 *               brandId:
 *                 type: number
 *               categoryId:
 *                 type: number
 *               newAddedImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               deletedImageIds:
 *                 type: string
 *                 example: "[3,5]"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 10
 *               name: "Updated name"
 *               description: "Updated description"
 *               price: 1200
 *               stockCount: 30
 *               brandId: 2
 *               categoryId: 5
 */

///////////////////////////////////////////////////////////////
// DELETE PRODUCT (SELLER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Delete a product (SELLER role required)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 7
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Product deleted successfully"
 *       404:
 *         description: Product not found
 */
