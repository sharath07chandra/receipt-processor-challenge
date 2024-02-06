const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
import calculatePoints from './helpers/calculatePoints';

// In-memory storage for receipts
const receipts = {};

// Process Receipts Endpoint
router.post('/process', (req, res) => {
    const receipt = req.body;
    const id = uuidv4();
    const points = calculatePoints(receipt);

    // Store receipt data in memory
    receipts[id] = { receipt, points };

    res.status(201).json({ id });
});

// Get Points Endpoint
router.get('/:id/points', (req, res) => {
    const id = req.params.id;
    const receiptData = receipts[id];

    if (!receiptData) {
        return res.status(404).json({ error: 'Receipt not found' });
    }

    const { points } = receiptData;
    res.status(200).json({ points });
});

module.exports = router;
