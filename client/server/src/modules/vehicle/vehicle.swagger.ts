/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicles management
 */

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     summary: Get all Vehicles
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
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
 *         name: gasTypeId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all Vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       vehicleNb:
 *                         type: string
 *                       model:
 *                         type: string
 *                       gasType:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                       lastServiceDate:
 *                         type: string
 *                       customer:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 pageIndex:
 *                   type: number
 *                 pageSize:
 *                   type: number
 *                 totalCount:
 *                   type: number
 *                 totalPages:
 *                   type: number
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
 *     summary: Create a new Vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - model
 *               - gasType
 *               - vehicleNb
 *               - customerId
 *             properties:
 *               customerId:
 *                 type: string
 *               model:
 *                 type: string
 *               gasTypeId:
 *                 type: string
 *               vehicleNb:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created successfully
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
 * /api/v1/vehicles/{vehicleId}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
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
 *               customerId:
 *                 type: string
 *               model:
 *                 type: string
 *               gasTypeId:
 *                 type: string
 *               vehicleNb:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
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
 *     summary: Delete a Vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
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
