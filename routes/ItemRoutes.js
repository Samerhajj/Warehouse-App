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


// Update Item
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, category, size } = req.body; // Include size

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, quantity, category, size }, // Pass size
      { new: true }
    );

    // Log the update
    const log = new Log({
      action: 'update',
      items: [{ name: updatedItem.name, quantity, size, action: 'updated' }], // Include size
      message: `Updated ${updatedItem.name} (Size: ${size}) with new quantity: ${quantity}.`,
    });
    await log.save();

    res.status(200).json({ message: 'Item updated!', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
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


module.exports = router;
