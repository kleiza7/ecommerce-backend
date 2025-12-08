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
 *                   brandId: 1
 *                   categoryId: 4
 *                 - id: 11
 *                   name: "Samsung S25"
 *                   description: "Premium Android phone"
 *                   price: 1499
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
// CREATE PRODUCT (SELLER ONLY)
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - brandId
 *               - categoryId
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
 *               brandId:
 *                 type: number
 *                 example: 3
 *               categoryId:
 *                 type: number
 *                 example: 8
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
 *               brandId: 3
 *               categoryId: 8
 *       400:
 *         description: Brand or Category not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid brandId"
 *       401:
 *         description: Unauthorized (token missing)
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       403:
 *         description: Forbidden (SELLER role required)
 *         content:
 *           application/json:
 *             example:
 *               error: "Seller role required"
 */

///////////////////////////////////////////////////////////////
// UPDATE PRODUCT (SELLER ONLY)
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated name"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               price:
 *                 type: number
 *                 example: 1200
 *               brandId:
 *                 type: number
 *                 example: 2
 *               categoryId:
 *                 type: number
 *                 example: 5
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
 *               brandId: 2
 *               categoryId: 5
 *       400:
 *         description: Brand/category validation error
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid categoryId"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Product not found"
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
 *         content:
 *           application/json:
 *             example:
 *               error: "Product not found"
 */
