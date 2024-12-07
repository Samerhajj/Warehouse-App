const express = require('express');
const Item = require('../models/Item'); // Import Item model
const router = express.Router();

// Add a new item
router.post('/add', async (req, res) => {
  try {
    const { name, quantity, category } = req.body;
    const newItem = new Item({ name, quantity, category });
    await newItem.save();
    res.status(201).json({ message: 'Item added!', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Update an item
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, category } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, quantity, category },
      { new: true }
    );
    res.status(200).json({ message: 'Item updated!', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete an item
router.delete('/remove/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item removed!' });
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
