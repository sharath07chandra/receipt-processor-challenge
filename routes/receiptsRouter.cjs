const express = require('express');
const { logError, logInfo } = require('../logger/logger.cjs');
const router = express.Router();
const { v4: uuid4 } = require('uuid');
const calculatePoints = require('./helpers/calculatePoints.cjs');
const { body, param, validationResult } = require('express-validator');


// In-memory storage for receipts
const receipts = {};

// Validation middleware for /receipts/process endpoint
const validateReceipt = [
    body('retailer').isString().matches(/^[\w\s\S\-]+$/),
    body('purchaseDate').isString().isISO8601(),
    body('purchaseTime').isString().matches(/^\d{2}:\d{2}$/),
    body('items').isArray({ min: 1 }),
    body('total').isString().matches(/^\d+\.\d{2}$/),
];

// Process Receipts Endpoint
router.post('/process', validateReceipt, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logError('Validation error in POST /receipts/process', JSON.stringify(errors.array()));
        return res.status(400).json({ errors: errors.array() });
    }

    const receipt = req.body;
    const id = uuid4();
    const points = calculatePoints(receipt);

    // Store receipt data in memory
    receipts[id] = { receipt, points };

    logInfo(`Receipt processed successfully. ID: ${id}`);
    res.status(200).json({ id });
});

// Validation middleware for /receipts/{id}/points endpoint
const validateIdParam = [
    param('id').isString().matches(/^\S+$/),
];

// Get Points Endpoint
router.get('/:id/points', validateIdParam, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logError('Validation error in GET /:id/points', JSON.stringify(errors.array()));
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const receiptData = receipts[id];

    if (!receiptData) {
        logError(`Receipt not found, ID: ${id}`, "");
        return res.status(404).json({ error: 'Receipt not found' });
    }

    const { points } = receiptData;
    logInfo(`Points returned successfully. ID: ${id}, POINTS: ${points}`);
    res.status(200).json({ points });
});

module.exports = router;
