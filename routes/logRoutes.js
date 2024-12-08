const express = require('express');
const Log = require('../models/Log');
const Item = require('../models/Item');
const router = express.Router();

// Log an action (add, remove, etc.)
router.post('/log', async (req, res) => {
  try {
    const { action, items, message } = req.body;

    // Ensure items are valid
    const itemsToLog = [];
    for (let item of items) {
      const foundItem = await Item.findById(item.itemId);
      if (foundItem) {
        itemsToLog.push({
          name: foundItem.name,
          quantity: item.quantity,
          action: item.action
        });
      }
    }

    // Create a new log
    const newLog = new Log({
      action,
      items: itemsToLog,
      message,
    });

    await newLog.save();
    res.status(201).json({ message: 'Log added successfully!', log: newLog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log action' });
  }
});



// Get all logs
router.get('/all', async (req, res) => {
    try {
      const logs = await Log.find().sort({ timestamp: -1 }); // Sort logs by latest first
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });
  

module.exports = router;
