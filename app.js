// FRAMEWORKS AND MODULES USED
const firebase = require('firebase');
const logging = require('fs');
const express = require('express');
const app = express();
const pQueue = require('./pQueue.js');

// INITIALISING FIREBASE APP
const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyDtS9Js6uGELqIN5ZaI4C8-FN45NQP3eXc",
	authDomain: "operatorhandler.firebaseapp.com",
	databaseURL: "https://operatorhandler.firebaseio.com",
	storageBucket: "operatorhandler.appspot.com"
});

// FIREBASE OFF HANDLE
let handleA=[],handleB=[],handleC=[],handleD=[],handleE=[],handleF=[], handleG=[];

// CONSTANTS
const br = "\n---------------------------------------------------------------------------";
var activeCustomers=0;
var waitingCustomersList=[];
var pausedOperatorsList=[];
const activeOperators=new pQueue();

// GETTING DATABASE REFERENCE
const database = firebase.database().ref();

// GETTING OPERATORS FROM DATABASE
handleA.forEach(fn => database.child('operators').off('child_added',fn));
let fn=database.child('operators').on('child_added',snap=>{
	handleB.forEach(gn => database.child('operators').child(snap.key).child('online').off('value',gn));
	let gn=database.child('operators').child(snap.key).child('online').on('value', snapp => {
		if(snapp.val()) {
		// GETTING ONLINE OPERATORS
			database.child('operators/'+snap.key+'/customers').set(null);
			database.child('operators/'+snap.key+'/pause').set(false);
			activeOperators.addOperator(snap.key);
			sendLog(snap,'online',0);
			while(waitingCustomersList.length!=0 && activeOperators.assignCustomer(waitingCustomersList[0],database)!=null) {
				waitingCustomersList.shift()
			}
			appLogs()
		} else {
		// REMOVING OFFLINE OPERATORS
			database.child('operators/'+snap.key+'/customers').set(null);
			let customersWaiting=activeOperators.deleteOperator(snap.key,database)
			if(customersWaiting!=null) {
				if(activeOperators.length==0 || activeOperators.length==undefined || activeOperators.length==null) {
					while(customersWaiting.customers.length!=0) {
						waitingCustomersList.push(customersWaiting.customers[0]);
						customersWaiting.customers.shift();
					}
					waitingCustomersList=[];
				}
				sendLog(snap,'offline',0);
				appLogs()
			}
		}
	});
	handleB.push(gn)

	handleF.forEach(gn2=>database.child('operators/'+snap.key+'/pause').off('value',gn2))
	let gn2=database.child('operators/'+snap.key+'/pause').on('value',snapp=>{
		if(snap.child('online').val()) {
		   if(snapp.val()) {
		   	let temp=activeOperators.removeOperatorFromQueue(snap.key);
		   	if(temp!=null)
		   		pausedOperatorsList.push(temp)
		      console.log(getTimestamp(new Date)+"\nOperator "+snap.child('fName').val()+' '+snap.child('lName').val()+" is on a break now!!"+br)
				logging.appendFile('logs.txt',"\n"+getTimestamp(new Date)+"\nOperator "+snap.child('fName').val()+' '+snap.child('lName').val()+" is on a break now!"+br,(err)=>{
					if(err) throw err
				})
		      appLogs()
		   }
		   else {
		   	activeOperators.addOperatorToQueue(snap.key,pausedOperatorsList)
		      console.log(getTimestamp(new Date)+"\nOperator "+snap.child('fName').val()+' '+snap.child('lName').val()+" is accepting customers now!!"+br)
				logging.appendFile('logs.txt',"\n"+getTimestamp(new Date)+"\nOperator "+snap.child('fName').val()+' '+snap.child('lName').val()+" is accepting customers now!"+br,(err)=>{
					if(err) throw err
				})
		      appLogs()
		   }
		}
	})
	handleF.push(gn2);

	handleG.forEach(gn3=>database.child('operators/'+snap.key+'/customers').off('child_removed',gn3))
	let gn3=database.child('operators/'+snap.key+'/customers').on('child_removed',snapp=>{
		activeOperators.deleteCustomer(snapp)
		console.log(getTimestamp(new Date)+"\nOperator "+snap.child('fName').val()+' '+snap.child('lName').val()+" ended chat with a customer!!"+br)
		logging.appendFile('logs.txt',"\n"+getTimestamp(new Date)+"\nOperator "+snap.child('fName').val()+' '+snap.child('lName').val()+" ended chat with a customer!"+br,(err)=>{
			if(err) throw err
		})
		activeCustomers--
		appLogs()
	})
	handleG.push(gn3)
});
handleA.push(fn);

// DELETING OPERATORS IF DELETED FROM DATABASE
handleC.forEach(fn2 => database.child('operators').off('child_removed',fn2));
let fn2=database.child('operators').on('child_removed',snap=>{
	activeOperators.deleteOperator(snap.key,database)
});
handleC.push(fn2)

// GETTING AVAILABLE CUSTOMERS
handleD.forEach(fn3 => database.child('customers').off('child_added',fn3));
let fn3=database.child('customers').on('child_added',snap=>{
	let operatorAssignedTo=activeOperators.assignCustomer(snap,database)
	if(operatorAssignedTo==null) {
		waitingCustomersList.push(snap)
	}
	sendLog(snap,'escalated',1)
	activeCustomers++
	appLogs()
});
handleD.push(fn3)

/*
// REMOVING UNAVAILABLE CUSTOMERS
handleE.forEach(fn4 => database.child('customers').off('child_removed',fn4));
let fn4=database.child('customers').on('child_removed',snap=>{
	let Operator=activeOperators.deleteCustomer(snap.key)
	if(Operator!=null) {
		database.child('operators/'+Operator.operator+'/customers').on('child_added',snapp=>{
			if(snapp.child('id').val()==snap.key)
				database.child('operators/'+Operator.operator+'/customers/'+snapp.key).remove();
		});
	}
	sendLog(snap,'disconnected',1)
	activeCustomers--
	appLogs()
});
handleE.push(fn4)
*/

// CUSTOMERS AND OPERATORS LOG
function appLogs() {
	let logs=getTimestamp(new Date);
	logs+="\nOnline customers: "+activeCustomers;
	logs+="\nAwaited customers: "+waitingCustomersList.length;
	logs+="\nOnline operators: "+activeOperators.size();
	logs+='\nOperator queue: '+activeOperators.printPQueue();
	for (var i = 0; i < activeOperators.operators.length; i++) {
		logs+='\nOperator('+activeOperators.operators[i].operator+')'+'['+activeOperators.operators[i].customers.length+']'+' : { ';
		for (var j = 0; j < activeOperators.operators[i].customers.length; j++) {
			logs+=activeOperators.operators[i].customers[j].child('id').val()+' ';
		}
		logs+='}';
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
app.get('/add',(req,res)=>{res.sendFile(`${__dirname}/addCustomers.html`)})

app.listen(6969,()=>{
	console.log("\n"+getTimestamp(new Date)+"\nServer is live on port 6969*"+br)
	logging.appendFile('logs.txt',"\n"+getTimestamp(new Date)+"\nServer is live on port 6969*"+br,(err)=>{
		if(err) throw err
	});
})

// TEMPORARILY ADDING CUSTOMERS ITSELF
function cust(id,fName,lName) {
	let c=database.child('customers').push()
	c.set({
		id:id,
		fName:fName,
		lName:lName
	})
}
setTimeout(()=>{
	cust("gaurav","Gaurav","Saini")
	cust("vikas","Vikas","Kambojh")
	cust("ridhwan","Ridhwan","Luthra")
	cust("rishabh","Rishabh","Jain")
	cust("hardik","Hardik","Kapoor")
},3000);