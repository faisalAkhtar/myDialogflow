// FRAMEWORKS AND MODULES USED
var firebase = require('firebase');
var express = require('express');
var app = express();
var pQueue = require('./pQueue.js');

// INITIALISING FIREBASE APP
var firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyDtS9Js6uGELqIN5ZaI4C8-FN45NQP3eXc",
	authDomain: "operatorhandler.firebaseapp.com",
	databaseURL: "https://operatorhandler.firebaseio.com",
	storageBucket: "operatorhandler.appspot.com"
});

// CONSTANTS
const br = "\n---------------------------------------------------------------------------";
const customersList=[];
const operatorsList = new pQueue();

// GETTING DATABASE REFERENCE
var database = firebase.database().ref();

// GETTING AVAILABLE CUSTOMERS
database.child('customers').on('child_added',snap=>{
	customersList.push(snap.key);
	sendLog(snap,'escalated',1)
});

// REMOVING UNAVAILABLE CUSTOMERS
database.child('customers').on('child_removed',snap=>{
	for (var i=0;i<customersList.length;i++) {
		if(customersList[i]==snap.key) {
			customersList.splice(i,1);
			break;
		}
	}
	sendLog(snap,'disconnected',1)
});

// GETTING AVAILABLE OPERATORS
database.child('operators').on('child_added',snap=>{
	database.child('operators').child(snap.key).child('online').on('value', snapp => {
		if(snapp.val()) {
			operatorsList.enqueue(snap.key,0);
			sendLog(snap,'online',0);
		} else {
			operatorsList.deleteOperator(snap.key);
			sendLog(snap,'offline',0);
		}
	});
});

database.child('operators').on('child_removed',snap=>{
	database.child('operators').child(snap.key).child('online').on('value', snapp => {
	});
});

// LOG OF CURRENT SITUATION
function appLogs() {
	let logs="";
	logs+="Online customers: "+customersList.length+'\n';
	logs+="Online operators: "+operatorsList.size()+'\nCustomer array: [ ';
	for (var i=0;i<customersList.length;i++) {
		logs+='#'+customersList[i];
		if((i+1)!=customersList.length)
		logs+=', ';
	}
	logs+=' ]\nOperator queue: '+operatorsList.printPQueue();
	logs+=br;
	console.log(logs);
}

// CONNECTION LOGS
function sendLog(snap,state,op) {
	let logs="";
	if(op==0)
		logs+='Operator '+snap.child('fName').val()+' '+snap.child('lName').val()+' is '+state+' now!';
	else
		logs+='Customer '+snap.child('fName').val()+' '+snap.child('lName').val()+' '+state;
	logs+=br;
	console.log(logs);
}

// SERVER
app.use('/static', express.static(`${__dirname}/public`));

app.get('/',(req,res)=>{res.sendFile(`${__dirname}/login.html`)})
app.get('/operator',(req,res)=>{res.sendFile(`${__dirname}/operator.html`)})
app.get('/admin',(req,res)=>{res.sendFile(`${__dirname}/admin.html`)})
app.listen(6969,()=>{console.log("Server is live on port 6969*"+br)})
