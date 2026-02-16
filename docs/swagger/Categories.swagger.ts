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
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [id, name, slug, displayOrder]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Electronics"
 *                   slug:
 *                     type: string
 *                     example: "electronics"
 *                   description:
 *                     type: string
 *                     nullable: true
 *                     example: "All electronic products"
 *                   displayOrder:
 *                     type: integer
 *                     example: 0
 *                   parentId:
 *                     type: integer
 *                     nullable: true
 *                     example: null
 */

///////////////////////////////////////////////////////////////
// GET CATEGORY BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/categories/get-by-id/{id}:
 *   get:
 *     summary: Get category by ID (public)
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
 *         description: Category retrieved successfully
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
 *             required: [name, displayOrder]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphones"
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Phone category"
 *               displayOrder:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Parent category not found
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
 *             required: [id, name, parentId, description, displayOrder]
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 2
 *               name:
 *                 type: string
 *                 example: "Smartphones Updated"
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated description"
 *               displayOrder:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Parent category validation error
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
 *         example: 2
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *             example:
 *               message: "Category deleted successfully"
 *       400:
 *         description: Category has child categories and cannot be deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Category not found
 */
