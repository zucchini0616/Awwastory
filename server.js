const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the root directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  // Point to the new location of your index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running on http://13.229.232.201:${port}`);
});
