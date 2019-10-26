var express = require('express');
var app = express();

app.use('/static', express.static(`${__dirname}/public`));

app.get('/', function(req, res){
   res.sendFile(`${__dirname}/login.html`);
});

app.get('/operator', function(req, res){
   res.sendFile(`${__dirname}/operator.html`);
});

app.listen(6969);