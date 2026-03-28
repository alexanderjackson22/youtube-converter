const express = require('express');
const path = require('path');
const downloadRoutes = require('./routes/downloadRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/download', downloadRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
