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
var customers=operators=0;
const br = "\n---------------------------------------------------------------------------";
database.child('customers').on('child_added', snap => {
   ++customers;
//   sendLog();
});
database.child('operators').on('child_added', snap => {
   database.child('operators').child(snap.key).child('online').on('value', snapp => {
      if(snapp.val()) {
         ++operators;
         sendLog(snap,' signed in');
      } else {
         if(operators!=0) --operators;
         sendLog(snap,' signed out');
      }
   });
});

function sendLog(snap, state) {
   let logs="";
   logs+="Online customers: "+customers;
   logs+="\nOnline operators: "+operators;
   logs+='\nLast log: '+snap.child('fName').val()+' '+snap.child('lName').val()+state;
   logs+=br;
   console.log(logs);
}

app.use('/static', express.static(`${__dirname}/public`));
app.get('/',(req,res)=>{res.sendFile(`${__dirname}/login.html`)})
app.get('/operator',(req,res)=>{res.sendFile(`${__dirname}/operator.html`)})
app.get('/admin',(req,res)=>{res.sendFile(`${__dirname}/admin.html`)})
app.listen(6969,()=>{console.log("Server is live on port 6969*"+br)})
