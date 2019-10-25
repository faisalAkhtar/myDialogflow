const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyDtS9Js6uGELqIN5ZaI4C8-FN45NQP3eXc",
    authDomain: "operatorhandler.firebaseapp.com",
    projectId: "operatorhandler",
  };
  firebase.initializeApp(firebaseConfig);
  btnLogin.addEventListener('click', e=> {
    e.preventDefault();
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise
      .then(user => console.log(user))
      .catch(e => alert(e.message));
  });
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      window.location.href = "operator";
    }
  })

}());
