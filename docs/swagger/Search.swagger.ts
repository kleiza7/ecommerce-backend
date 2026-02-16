/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search and suggestions endpoint
 */

///////////////////////////////////////////////////////////////
// SEARCH
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search brands, categories and product name suggestions
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: "iph"
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [brands, categories, suggestions]
 *               properties:
 *                 brands:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, name, slug]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Apple"
 *                       slug:
 *                         type: string
 *                         example: "apple"
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, name, slug]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 4
 *                       name:
 *                         type: string
 *                         example: "Smartphones"
 *                       slug:
 *                         type: string
 *                         example: "smartphones"
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["iPhone 15", "iPhone 16", "iPhone 16 Pro"]
 *             example:
 *               brands:
 *                 - id: 1
 *                   name: "Apple"
 *                   slug: "apple"
 *               categories:
 *                 - id: 4
 *                   name: "Smartphones"
 *                   slug: "smartphones"
 *               suggestions:
 *                 - "iPhone 15"
 *                 - "iPhone 16"
 *                 - "iPhone 16 Pro"
 *       400:
 *         description: Search query is required
 */
