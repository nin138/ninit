const path = require('path');
const express = require('express');
const app = express();

app.use('/dist', express.static('dist'));
app.get('/api/count', (req, res) => {
  res.contentType('application/json');
  const obj = {"amount": 100};
  setTimeout(() => res.json(obj), 500);
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(3000, (err) => {
  if(err) console.log(err);
  else console.log("server listen at 127.0.0.1:3000")
});