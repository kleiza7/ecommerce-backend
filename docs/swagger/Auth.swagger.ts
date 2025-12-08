/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints (User & Seller)
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
 *         description: Validation failed or email already exists
 *         content:
 *           application/json:
 *             example:
 *               error: "Email already exists"
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
 *         description: Validation failed or duplicate email
 *         content:
 *           application/json:
 *             example:
 *               error: "Email already exists"
 */

///////////////////////////////////////////////////////////////
// LOGIN
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user or seller and receive a JWT token
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
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid credentials"
 */
