require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON body parsing
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Default route
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Warehouse Application</h1>
    <p>Use the links below to navigate:</p>
    <ul>
      <li><a href="/items.html">Manage Items</a></li>
      <li><a href="/logs.html">View Logs</a></li>
    </ul>
  `);
});

// Routes
const itemRoutes = require('./routes/ItemRoutes');
const logRoutes = require('./routes/logRoutes');
app.use('/api/items', itemRoutes);
app.use('/api/logs', logRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
