const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/ebad-front'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/ebad-front/index.html'));
});

app.listen(process.env.PORT || 3000);
