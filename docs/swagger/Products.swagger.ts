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
 *                   currencyId: 1
 *                 - id: 11
 *                   name: "Samsung S25"
 *                   description: "Premium Android phone"
 *                   price: 1499
 *                   stockCount: 0
 *                   brandId: 2
 *                   categoryId: 4
 *                   currencyId: 1
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
 *               currencyId: 1
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
 *               - currencyId
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
 *               currencyId:
 *                 type: number
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
 *         description: Brand, Category or Currency not found
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
 * /api/products/update:
 *   put:
 *     summary: Update an existing product (SELLER role required)
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
 *               - price
 *               - stockCount
 *               - brandId
 *               - categoryId
 *               - currencyId
 *             properties:
 *               id:
 *                 type: number
 *                 example: 10
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stockCount:
 *                 type: number
 *               brandId:
 *                 type: number
 *               categoryId:
 *                 type: number
 *               currencyId:
 *                 type: number
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
 *       404:
 *         description: Product not found
 */
