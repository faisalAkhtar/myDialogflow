var express = require('express');
var app = express();

app.use('/static', express.static(`${__dirname}/public`));

app.get('/', function(req, res){
   res.sendFile(`${__dirname}/index.html`);
});

app.get('/operator', function(req, res){
   res.sendFile(`${__dirname}/app.html`);
});

app.listen(3000);