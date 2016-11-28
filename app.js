var path = require('path');
var express = require('express');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.listen(1219);
console.log('server is started');