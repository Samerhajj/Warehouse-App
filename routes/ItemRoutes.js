const express = require('express');
const Item = require('../models/Item'); // Import Item model
const Log = require('../models/Log');
const router = express.Router();

// Add Item
router.post('/add', async (req, res) => {
    try {
      const { name, quantity, category } = req.body;
      const newItem = new Item({ name, quantity, category });
      await newItem.save();
  
      // Log the addition
      const log = new Log({
        action: 'add',
        items: [{ name, quantity, action: 'added' }],
        message: `Added ${quantity} of ${name} to inventory.`,
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
      const { name, quantity, category } = req.body;
  
      const updatedItem = await Item.findByIdAndUpdate(
        id,
        { name, quantity, category },
        { new: true }
      );
  
      // Log the update
      const log = new Log({
        action: 'update',
        items: [{ name: updatedItem.name, quantity, action: 'updated' }],
        message: `Updated ${updatedItem.name} with new quantity: ${quantity}.`,
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
  
      // Check if the item was found and deleted
      if (!item) {
        return res.status(404).json({ error: `Item with name '${name}' not found` });
      }
  
  // Log the deletion
  const log = new Log({
    action: 'remove',
    items: [{ name: item.name, quantity: item.quantity, action: 'removed' }],
    message: `Removed ${item.quantity} of ${item.name} from inventory.`,
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




module.exports = router;
