/**
 * @swagger
 * tags:
 *   name: ExpenseType
 *   description: expenseType management
 */

/**
 * @swagger
 * /api/v1/expenseType:
 *   get:
 *     summary: Get all expenseTypes
 *     tags: [ExpenseType]
 *     responses:
 *       200:
 *         description: List of all expenseTypes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *   post:
 *     summary: Create a new expenseType
 *     tags: [ExpenseType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: expenseType created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /api/v1/expenseType/{expenseTypeId}:
 *   put:
 *     summary: Update a expenseType
 *     tags: [ExpenseType]
 *     parameters:
 *       - in: path
 *         name: expenseTypeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: expenseType updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *   delete:
 *     summary: Delete a expenseType
 *     tags: [ExpenseType]
 *     parameters:
 *       - in: path
 *         name: expenseTypeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: expenseType deleted successfully
 *       404:
 *         description: expenseType not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
