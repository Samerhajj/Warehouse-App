require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For JSON body parsing

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Warehouse Application!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



const Test = require('./models/Test');

// Test Route
app.get('/test', async (req, res) => {
  const testDoc = new Test({ name: 'Sample Item' });
  await testDoc.save();
  res.send('Test item saved!');
});
