let handleA=[], handleB=[], handleC=[];
var noOfCustomers = 0;
(function() {
	var firebaseConfig = {
		apiKey: "AIzaSyDtS9Js6uGELqIN5ZaI4C8-FN45NQP3eXc",
		authDomain: "operatorhandler.firebaseapp.com",
		databaseURL: "https://operatorhandler.firebaseio.com",
		projectId: "operatorhandler",
		storageBucket: "operatorhandler.appspot.com"
	};
	firebase.initializeApp(firebaseConfig);
	const btnLogout = document.getElementById('logOut');
	btnLogout.addEventListener('click', e=> {
		let uid = document.getElementsByClassName('loggedProfile')[0].id;
		console.log(uid);
		firebase.database().ref().child('operators').child(uid).update({
			"online" : false
		}, (err)=>{
			if(err) console.log(err);
		});
		firebase.auth().signOut();
	});
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser) {
			initApp(firebaseUser.uid);
		} else {
			window.location.href = "/";
		}
	});
}());

function initApp(uid) {
	const dbRef = firebase.database().ref();
	dbRef.child('operators').child(uid).update({
		"online" : true
	}, (err)=>{
		if(err) console.log(err);
	});
	dbRef.child('operators').child(uid).once('value', snap => {
		document.getElementsByClassName('loggedProfile')[0].id = snap.key;
//		document.getElementsByClassName('loggedName')[0].innerHTML = snap.child('fName').val() + " " + snap.child('lName').val();
//		document.getElementsByClassName('loggedDP')[0].src = snap.child('photoURL').val();
	});
	handleB.forEach(fn2 => dbRef.child('operators').child(uid).child('customers').off('child_added',fn2));
	let fn2=dbRef.child('operators').child(uid).child('customers').on('child_added', snap => {
		noOfCustomers++
		if (noOfCustomers==1) {
			console.log("FIRST CUSTOMER")
			document.getElementsByClassName('peopleMsgs')[0].innerHTML=""
		} else {
			console.log("No. of customers: "+noOfCustomers)
		}
		const ppl = document.getElementsByClassName('peopleMsgs')[0];
			var pplDiv = document.createElement("div");
				pplDiv.setAttribute("class","people "+snap.key);
				pplDiv.setAttribute("onclick","opnMsgs('"+snap.key+"')");
			var pplTxt = document.createElement('text');
				pplTxt.setAttribute("class","peopleName");
				var pplTxtName = document.createElement("div");
					pplTxtName.setAttribute("class","name");
					pplTxtName.innerHTML = snap.child('fName').val();
//			 TODO :	DISPLAY LATEST MESSAGE and NUMBER OF MESSAGES ARRIVED
//					var pplTxtTxt = document.createElement("div");
//						pplTxtTxt.setAttribute("class","text");
//						pplTxtTxt.innerHTML = "Kya kr rha hh be!!!!!!!!!!!!!!";
				pplTxt.appendChild(pplTxtName);
//					pplTxt.appendChild(pplTxtTxt);
			pplDiv.appendChild(pplTxt);
		ppl.prepend(pplDiv);
	});
	handleB.push(fn2)

	handleC.forEach(fn3 => dbRef.child('operators').child(uid).child('customers').off('child_removed',fn3));
	let fn3=dbRef.child('operators').child(uid).child('customers').on('child_removed', snap => {
		noOfCustomers--
		if(noOfCustomers==0) {
			console.log("NO CUSTOMERS")
			const ppl = document.getElementsByClassName('peopleMsgs')[0];
				var pplDiv = document.createElement("div");
					pplDiv.setAttribute("class","people "+"noCustomers");
				var pplTxt = document.createElement('text');
					pplTxt.setAttribute("class","peopleName");
					var pplTxtName = document.createElement("div");
						pplTxtName.setAttribute("class","name");
						pplTxtName.innerHTML = "< No customers >";
					pplTxt.appendChild(pplTxtName);
				pplDiv.appendChild(pplTxt);
			ppl.appendChild(pplDiv);
			var coverDiv = document.createElement("div");
				coverDiv.setAttribute("id","cover");
			document.getElementsByTagName('body')[0].appendChild(coverDiv);
		} else {
			console.log("No. of customers: "+noOfCustomers)
		}
		document.getElementsByClassName(snap.key)[0].remove();
	});
	handleC.push(fn3);
}

function opnMsgs(sndrID) {
	if(document.getElementById('cover')!=null){
		document.getElementById('cover').parentNode.removeChild(document.getElementById('cover'));
	}
	var checkBool=0;
	const dbRef = firebase.database().ref();
	const usrID = firebase.auth().currentUser.uid;
	document.getElementById('txtMsg').removeAttribute("readonly");

	var title = document.getElementsByClassName('title')[0];
	document.getElementById('txtMsg').value = '';
	dbRef.child('operators').child(usrID).child('customers').once('value', snap => {
	title.innerHTML = snap.child(sndrID).child('fName').val() + " <span id=\"sub-title\">" + snap.child(sndrID).child('lName').val() + "</span>";
		title.id = snap.child(sndrID).key;
	});

	var msgsDiv = document.getElementsByClassName('messages')[0];
	msgsDiv.innerHTML = "";
		var newDiv = document.createElement("div");
			newDiv.setAttribute("class", "hiiMsg");
			newDiv.setAttribute("onclick", "sendTxtMsg('hii')");
			var para = document.createElement("p");
				para.innerHTML = "Send a hii";
				para.setAttribute("style","color:darkGrey;font-style:italic;text-align:center")
			newDiv.appendChild(para);
		msgsDiv.appendChild(newDiv);

	handleA.forEach(fn => dbRef.child('messageBox').off('child_added',fn));
	let fn = dbRef.child('messageBox').on('child_added', snap=> {
		if((snap.child('to').val()==usrID || snap.child('to').val()==sndrID) && (snap.child('from').val()==sndrID || snap.child('from').val()==usrID)) {
			var newDiv = document.createElement("div");
			if(snap.child('from').val()==usrID) {
				newDiv.setAttribute("class", "container sender");
			} else {
				newDiv.setAttribute("class", "container");
			}
			var para = document.createElement("p");
			para.innerHTML = snap.child('msg').val();
			newDiv.appendChild(para);
			if(checkBool==0) {
				msgsDiv.innerHTML = "";
				checkBool++;
			}
			msgsDiv.appendChild(newDiv);
			newDiv.scrollIntoView();
		}
	});
	handleA.push(fn);

	for (var i = 0; i < document.getElementsByClassName('people').length; i++) {
		document.getElementsByClassName('people')[i].classList.remove("selected");
	}
	document.getElementsByClassName(sndrID)[0].classList.add("selected");
	if(document.getElementsByClassName('messages')[0].classList.contains("overlay"))
		document.getElementsByClassName('messages')[0].classList.remove("overlay");
	if(window.innerWidth < 1279) {
		openMessages();
	}
}

function rand(len) {
	var result = '';
	var chars	= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for ( var i = 0; i < len; i++ ) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

function sendTxtMsg(arg) {
	var sntTo = document.getElementsByClassName('title')[0].id;
	var sntMsg;
	var sntFrm = document.getElementsByClassName('loggedProfile')[0].id;
	if(arg!=null) {
		sntMsg = arg;
	} else {
		sntMsg = document.getElementById('txtMsg').value;
		sntMsg = sntMsg.replace(/(?:\r\n|\r|\n)/g, '<br>');
	}
	var now = new Date();
	var timeStamp = now.getFullYear() + ("0" + (now.getMonth()+1)).slice(-2) + ("0" + now.getDate()).slice(-2) + ("0" + now.getHours()).slice(-2) + ("0" + now.getMinutes()).slice(-2) + ("0" + now.getSeconds()).slice(-2) + rand(4);

	if(sntTo!="" && sntMsg!="") {
		firebase.database().ref().child('messageBox').child(timeStamp).set({
			"from" : sntFrm,
			"msg" : sntMsg,
			"to" : sntTo
		});
		document.getElementById('txtMsg').value = "";
		document.getElementById('txtMsg').focus();
	}
}
