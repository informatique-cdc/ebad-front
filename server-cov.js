const express = require('express');
const path = require('path');
const app = express();
require('@cypress/code-coverage/middleware/express')(app)

app.use(express.static(__dirname + '/src'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.listen(process.env.PORT || 4200);
