/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

///////////////////////////////////////////////////////////////
// GET ALL CATEGORIES
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/categories/get-all:
 *   get:
 *     summary: Get all categories (public)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Electronics"
 *                 slug: "electronics"
 *                 description: "All electronic products"
 *                 displayOrder: 0
 *                 parentId: null
 *               - id: 2
 *                 name: "Smartphones"
 *                 slug: "smartphones"
 *                 description: null
 *                 displayOrder: 1
 *                 parentId: 1
 */

///////////////////////////////////////////////////////////////
// GET CATEGORY BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/categories/get-by-id/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             example:
 *               id: 2
 *               name: "Smartphones"
 *               slug: "smartphones"
 *               description: null
 *               displayOrder: 1
 *               parentId: 1
 *       404:
 *         description: Category not found
 */

///////////////////////////////////////////////////////////////
// CREATE CATEGORY (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Create a new category (ADMIN only)
 *     tags: [Categories]
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
 *               - displayOrder
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptops"
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Portable computers"
 *               displayOrder:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 5
 *               name: "Laptops"
 *               slug: "laptops"
 *               parentId: 1
 *               description: "Portable computers"
 *               displayOrder: 2
 *       400:
 *         description: Validation error or parent category invalid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 */

///////////////////////////////////////////////////////////////
// UPDATE CATEGORY (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/categories/update:
 *   put:
 *     summary: Update a category (ADMIN only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - parentId
 *               - description
 *               - displayOrder
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *               name:
 *                 type: string
 *                 example: "Gaming Laptops"
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "High performance laptops"
 *               displayOrder:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 5
 *               name: "Gaming Laptops"
 *               slug: "gaming-laptops"
 *               parentId: 1
 *               description: "High performance laptops"
 *               displayOrder: 3
 *       400:
 *         description: Validation error or invalid parent category
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Category not found
 */

///////////////////////////////////////////////////////////////
// DELETE CATEGORY (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/categories/delete/{id}:
 *   delete:
 *     summary: Delete a category (ADMIN only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Category deleted successfully"
 *       400:
 *         description: Category has child categories or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Category not found
 */
