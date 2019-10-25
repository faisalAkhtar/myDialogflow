let handleA = [];
let handleB = [];
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
		firebase.auth().signOut();
	});
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser) {
			initApp(firebaseUser.uid);
		} else {
			window.location.href = "index.html";
		}
	});
}());

function initApp(uid) {
	document.getElementsByClassName('peopleMsgs')[0].innerHTML = "";
	const dbRef = firebase.database().ref();
	dbRef.child('operators').child(uid).once('value', snap => {
		document.getElementsByClassName('loggedProfile')[0].id = snap.key;
//		document.getElementsByClassName('loggedName')[0].innerHTML = snap.child('fName').val() + " " + snap.child('lName').val();
//		document.getElementsByClassName('loggedDP')[0].src = snap.child('photoURL').val();
	});
	dbRef.child('customers').on('child_added', snap => {
		const ppl = document.getElementsByClassName('peopleMsgs')[0];
			var pplDiv = document.createElement("div");
				pplDiv.setAttribute("class","people "+snap.key);
				pplDiv.setAttribute("onclick","opnMsgs('"+snap.key+"')");
			var pplImg = document.createElement("img");
				pplImg.src = snap.child('photoURL').val();
				pplImg.setAttribute("class","peopleImg");
			var pplTxt = document.createElement('text');
				pplTxt.setAttribute("class","peopleName");
				var pplTxtName = document.createElement("div");
					pplTxtName.setAttribute("class","name");
					pplTxtName.innerHTML = snap.child('fName').val();
// 			TODO :  DISPLAY LATEST MESSAGE and NUMBER OF MESSAGES ARRIVED
//					var pplTxtTxt = document.createElement("div");
//						pplTxtTxt.setAttribute("class","text");
//						pplTxtTxt.innerHTML = "Kya kr rha hh be!!!!!!!!!!!!!!";
				pplTxt.appendChild(pplTxtName);
//					pplTxt.appendChild(pplTxtTxt);
			pplDiv.appendChild(pplImg);
			pplDiv.appendChild(pplTxt);
		ppl.appendChild(pplDiv);
	});
}

function opnMsgs(sndrID) {
	var checkBool=0;
	const dbRef = firebase.database().ref();
	const usrID = firebase.auth().currentUser.uid;
	document.getElementById('txtMsg').removeAttribute("readonly");

	var title = document.getElementsByClassName('title')[0];
	var dp = document.getElementsByClassName('dpImg')[0];
	document.getElementById('txtMsg').value = '';
	dbRef.child('customers').once('value', snap => {
	title.innerHTML = snap.child(sndrID).child('fName').val();
		title.id = snap.child(sndrID).key;
	dp.src = snap.child(sndrID).child('photoURL').val();
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
			newDiv.id = snap.key;
			if(snap.child('from').val()==usrID) {
				newDiv.setAttribute("class", "container sender");
				newDiv.setAttribute("onclick","msgOptions('"+snap.key+"')");
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

	handleB.forEach(fn2 => dbRef.child('messageBox').off('child_removed',fn2));
	let fn2 = dbRef.child('messageBox').on('child_removed', snap=> {
		if(document.getElementById(snap.key)!=null)
			document.getElementById(snap.key).remove();
	});
	handleB.push(fn2);

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
	var chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

function msgOptions(msgID) {
	document.getElementsByClassName('messages')[0].style.overflowY = "hidden";
	document.getElementById('txtMsg').setAttribute("readonly","true");
	var a = document.createElement("div");
	a.setAttribute("class","overlay");
	a.setAttribute("style","height:"+document.getElementsByClassName('messages')[0].scrollHeight+"px");
	a.setAttribute("onclick","hideMsgOptions()");
	var b = document.createElement("div");
	b.setAttribute("class","overlayMenu");
	var clH =  document.getElementsByClassName('messages')[0].clientHeight;
	var scH = document.getElementsByClassName('messages')[0].scrollHeight;
	var x = scH-(clH/2)*1.1;
	b.setAttribute("style","top:"+x+"px");
	b.setAttribute("onclick","deleteMsg('"+msgID+"')");
	var c = document.createElement("p");
	c.innerHTML = "Unsend this message";
	b.appendChild(c);
	a.appendChild(b);
	document.getElementsByClassName('messages')[0].appendChild(a);
}

function hideMsgOptions() {
	document.getElementsByClassName('messages')[0].style.overflowY = "auto";
	document.getElementById('txtMsg').removeAttribute("readonly");
	if(document.getElementsByClassName('container')[0]!=null) {
		document.getElementsByClassName('overlay')[0].remove();
	}
}

function deleteMsg(msgID) {
	firebase.database().ref().child('messageBox').child(msgID).remove();
	if(document.getElementById(msgID)!=null)
		document.getElementById(msgID).remove();
	if(document.getElementsByClassName('container')[0]==null) {
		var msgsDiv = document.getElementsByClassName('messages')[0];
		msgsDiv.innerHTML = "";
			var newDiv = document.createElement("div");
				newDiv.setAttribute("class", "hiiMsg");
				newDiv.setAttribute("onclick", "hiiMsg()");
				var para = document.createElement("p");
					para.innerHTML = "Send a hii";
					para.setAttribute("style","color:darkGrey;font-style:italic;text-align:center")
				newDiv.appendChild(para);
			msgsDiv.appendChild(newDiv);
	}
}
