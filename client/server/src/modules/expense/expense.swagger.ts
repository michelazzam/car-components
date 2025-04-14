/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: expenseType management
 */

/**
 * @swagger
 * /api/v1/expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageIndex
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: expenseTypeId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   expenses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         expenseType:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             title:
 *                               type: string
 *                         amount:
 *                           type: number
 *                         date:
 *                           type: string
 *                         note:
 *                           type: string
 *                   pageIndex:
 *                     type: number
 *                   pageSize:
 *                     type: number
 *                   totalCount:
 *                     type: number
 *                   totalPages:
 *                     type: number
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
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expenseTypeId
 *               - amount
 *               - date
 *             properties:
 *               expenseTypeId:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: expense created successfully
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
 * /api/v1/expenses/{expenseId}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: expenseId
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
 *               expenseTypeId:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: expense updated successfully
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
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: expense deleted successfully
 *       404:
 *         description: expense not found
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
