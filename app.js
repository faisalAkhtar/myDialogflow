// FRAMEWORKS AND MODULES USED
const firebase = require('firebase');
const logging = require('fs');
const express = require('express');
const app = express();
const pQueue = require('./pQueue.js');

// INITIALISING FIREBASE APP
var firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyDtS9Js6uGELqIN5ZaI4C8-FN45NQP3eXc",
	authDomain: "operatorhandler.firebaseapp.com",
	databaseURL: "https://operatorhandler.firebaseio.com",
	storageBucket: "operatorhandler.appspot.com"
});

// CONSTANTS
const br = "\n---------------------------------------------------------------------------";
var activeCustomers=0;
const activeOperators=new pQueue();

// GETTING DATABASE REFERENCE
var database = firebase.database().ref();

// GETTING AVAILABLE OPERATORS
database.child('operators').on('child_added',snap=>{
	database.child('operators').child(snap.key).child('online').on('value', snapp => {
		if(snapp.val()) {
			activeOperators.addOperator(snap.key);
			sendLog(snap,'online',0);
			appLogs()
		} else {
//			activeOperators.deleteOperator(snap.key);
			sendLog(snap,'offline',0);
			appLogs()
		}
	});
});

// DELETING OPERATORS IF DELETED FROM DATABASE
database.child('operators').on('child_removed',snap=>{
	activeOperators.deleteOperator(snap.key)
});

// GETTING AVAILABLE CUSTOMERS
database.child('customers').on('child_added',snap=>{
	activeOperators.assignCustomer(snap.key);
	sendLog(snap,'escalated',1)
	activeCustomers++
	appLogs()
});

// REMOVING UNAVAILABLE CUSTOMERS
database.child('customers').on('child_removed',snap=>{
	activeOperators.deleteCustomer(snap.key)
	sendLog(snap,'disconnected',1)
	activeCustomers--
	appLogs()
});

// CUSTOMERS AND OPERATORS LOG
function appLogs() {
	let logs=getTimestamp(new Date);
	logs+="\nOnline customers: "+activeCustomers;
	logs+="\nOnline operators: "+activeOperators.size();
	logs+='\nOperator queue: '+activeOperators.printPQueue();
	for (var i = 0; i < activeOperators.operators.length; i++) {
		logs+='\nOperator('+activeOperators.operators[i].operator+')'+'['+activeOperators.operators[i].customers.length+']'+' : { ';
		for (var j = 0; j < activeOperators.operators[i].customers.length; j++) {
			logs+=activeOperators.operators[i].customers[j]+' ';
		}
		logs+=' }';
	}
	logs+=br;
	console.log(logs);
	logging.appendFile('logs.txt',"\n"+logs,(err)=>{
		if(err) throw err
	});
}

// TIME OF LOG
function getTimestamp(date_ob) {
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds
}

// CONNECTION LOGS
function sendLog(snap,state,op) {
	let logs=getTimestamp(new Date);
	if(op==0)
		logs+='\nOperator '+snap.child('fName').val()+' '+snap.child('lName').val()+' is '+state+' now!';
	else
		logs+='\nCustomer '+snap.child('fName').val()+' '+snap.child('lName').val()+' '+state;
	logs+=br;
	console.log(logs);
	logging.appendFile('logs.txt',"\n"+logs,(err)=>{
		if(err) throw err
	});
}

// SERVER
app.use('/static', express.static(`${__dirname}/public`));

app.get('/',(req,res)=>{res.sendFile(`${__dirname}/login.html`)})
app.get('/operator',(req,res)=>{res.sendFile(`${__dirname}/operator.html`)})
app.get('/admin',(req,res)=>{res.sendFile(`${__dirname}/admin.html`)})

app.listen(6969,()=>{
	console.log(getTimestamp(new Date)+"\nServer is live on port 6969*"+br)
	logging.appendFile('logs.txt',getTimestamp(new Date)+"\nServer is live on port 6969*"+br,(err)=>{
		if(err) throw err
	});
})
