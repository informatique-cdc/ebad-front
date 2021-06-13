const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(express.static(__dirname + '/dist/ebad-front'));
app.use(cors(
  {
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true)
    }
  }
  )
);
var apiProxy = createProxyMiddleware('/ebad', {target: 'https://ebad.herokuapp.com', changeOrigin: true,  headers: {
    Origin: 'http://localhost:4200'
  }});
app.use('/ebad', apiProxy);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/ebad-front/index.html'));
});

app.listen(process.env.PORT || 3000);
