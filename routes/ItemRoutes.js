const express = require('express');
const Item = require('../models/Item'); // Import Item model
const Log = require('../models/Log');
const router = express.Router();

// Add Item
router.post('/add', async (req, res) => {
  try {
    const { name, quantity, category, size } = req.body; // Include size
    const newItem = new Item({ name, quantity, category, size }); // Pass size
    await newItem.save();

    // Log the addition
    const log = new Log({
      action: 'add',
      items: [{ name, quantity, size, action: 'added' }], // Include size
      message: `Added ${quantity} of ${name} (Size: ${size}) to inventory.`,
    });
    await log.save();

    res.status(201).json({ message: 'Item added!', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});


// Update Item Quantity
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body; // `change` is the amount to add or remove

    if (!change || typeof change !== 'number') {
      return res.status(400).json({ error: 'Change must be a numeric value' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Adjust quantity
    const newQuantity = item.quantity + change;
    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Insufficient stock for the requested withdrawal' });
    }

    item.quantity = newQuantity;
    await item.save();

    // Log the quantity adjustment
    const log = new Log({
      action: 'update',
      items: [{ name: item.name, size: item.size, action: 'quantity adjusted', change }],
      message: `Updated ${item.name} (Size: ${item.size}). Change: ${change}. New quantity: ${newQuantity}.`,
    });
    await log.save();

    res.status(200).json({ message: 'Quantity updated successfully', item });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ error: 'Failed to update item quantity' });
  }
});

  
 // Delete Item by Name
 router.delete('/remove/:name', async (req, res) => {
  try {
    const { name } = req.params;

    // Find and delete the item by name
    const item = await Item.findOneAndDelete({ name });

    if (!item) {
      return res.status(404).json({ error: `Item with name '${name}' not found` });
    }

    // Log the deletion
    const log = new Log({
      action: 'remove',
      items: [{ name: item.name, quantity: item.quantity, size: item.size, action: 'removed' }], // Include size
      message: `Removed ${item.quantity} of ${item.name} (Size: ${item.size}) from inventory.`,
      timestamp: new Date().toISOString(),
    });
    await log.save();

    res.status(200).json({ message: 'Item removed!', item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});


// Get all items
router.get('/all', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});


// Search Items by Name
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // Extract the search query from request
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Perform a case-insensitive search for item names
    const items = await Item.find({ name: { $regex: query, $options: 'i' } });

    res.status(200).json(items); // Return matched items
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Failed to search items' });
  }
});


// Bulk Update Item Quantities
router.put('/bulk-update', async (req, res) => {
  try {
    const updates = req.body; // Expecting an array of { id, change } objects
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates must be a non-empty array' });
    }

    const results = [];
    const logs = [];

    for (const update of updates) {
      const { id, change } = update;
      if (!id || typeof change !== 'number') {
        continue; // Skip invalid entries
      }

      const item = await Item.findById(id);
      if (!item) {
        continue; // Skip non-existent items
      }

      const newQuantity = item.quantity + change;
      if (newQuantity < 0) {
        continue; // Skip items with insufficient stock
      }

      item.quantity = newQuantity;
      await item.save();

      results.push(item);
      logs.push({ name: item.name, size: item.size, action: 'quantity adjusted', change });
    }

    // Log the bulk quantity adjustments
    const log = new Log({
      action: 'bulk-update',
      items: logs,
      message: `Bulk update performed. ${logs.length} items adjusted.`,
    });
    await log.save();

    res.status(200).json({ message: 'Bulk update successful', results });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ error: 'Bulk update failed' });
  }
});


module.exports = router;
