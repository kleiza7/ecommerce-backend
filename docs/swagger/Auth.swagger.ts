/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints (User & Seller)
 */

///////////////////////////////////////////////////////////////
// GET ALL SELLERS
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/get-all-sellers:
 *   get:
 *     summary: Get all seller accounts (public)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of all sellers
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Sapphire Store"
 *               - id: 2
 *                 name: "Tech World"
 */

///////////////////////////////////////////////////////////////
// REGISTER USER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/register-user:
 *   post:
 *     summary: Register a new REGULAR user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Registered successfully"
 *       400:
 *         description: Validation error or email already exists
 */

///////////////////////////////////////////////////////////////
// REGISTER SELLER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/register-seller:
 *   post:
 *     summary: Register a new SELLER account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sapphire Store
 *               email:
 *                 type: string
 *                 example: seller@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Seller registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Registered successfully"
 *       400:
 *         description: Validation error or duplicate email
 */

///////////////////////////////////////////////////////////////
// LOGIN
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user or seller and receive JWT access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful, access token and user returned
 *         content:
 *           application/json:
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 role: "USER"
 *       400:
 *         description: Invalid email or password
 */
