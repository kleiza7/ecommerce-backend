/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search & autocomplete endpoints
 */

///////////////////////////////////////////////////////////////
// SEARCH (TEXT SUGGESTION)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search categories, brands and product name suggestions by text
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: "laptop"
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             example:
 *               categories:
 *                 - id: 4
 *                   name: "Gaming Laptops"
 *                   slug: "electronics-laptops-gaming-laptops"
 *                   parentId: 2
 *               brands:
 *                 - id: 3
 *                   name: "Asus"
 *                   slug: "asus"
 *               suggestions:
 *                 - "Asus ROG Strix G16"
 *                 - "MSI Gaming Laptop"
 *                 - "HP Omen 16"
 *       400:
 *         description: Invalid search query
 */
