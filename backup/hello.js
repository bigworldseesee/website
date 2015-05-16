var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('Hello world! see see\n');
});

var port = 80;
app.listen(port);
