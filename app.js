var firebase = require('firebase');
var express = require('express');
var app = express();
var firebaseApp = firebase.initializeApp({
   apiKey: "AIzaSyDtS9Js6uGELqIN5ZaI4C8-FN45NQP3eXc",
   authDomain: "operatorhandler.firebaseapp.com",
   databaseURL: "https://operatorhandler.firebaseio.com",
//   projectId: "operatorhandler",
   storageBucket: "operatorhandler.appspot.com"
});

var database = firebase.database().ref();
var i = 0;
database.child('customers').on('child_added', snap => {
   updateCustomers(++i);
});

function updateCustomers(arg) {
   let logs="";
   logs+="Customers: "+arg;
   logs+="\n---------------------------------------------------------------------------";
   console.log(logs);
}

app.use('/static', express.static(`${__dirname}/public`));

app.get('/', function(req, res){
   res.sendFile(`${__dirname}/login.html`);
});

app.get('/operator', function(req, res){
   res.sendFile(`${__dirname}/operator.html`);
});

app.get('/admin', function(req, res){
   res.sendFile(`${__dirname}/admin.html`);
});

app.listen(6969,()=>{console.log("Server is live on port 6969*\n---------------------------------------------------------------------------")});