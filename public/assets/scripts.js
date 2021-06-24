///////  Tests for JS at http://localhost:3000/testjs?
///////

const testjsform = document.querySelector("#testform");
if (testjsform) {
	testjsform.addEventListener("submit", function (e) {
		getcryptocad(e, this);
	});
}


function testbtnclick() {
	console.log("Caught an click!!");
	h2element = document.getElementById("btntest");
	if (h2element) {
		console.log(document.location.pathname);
		h2element.innerHTML = "HHHHHHHHHHHHHHHHHHHH";
	}
}

function getID(element){
	document.getElementById(element).color = "red";
	console.log(element)
}

/////// End of Tests
///////

function updatetime(){
	let now = new Date;
		
	document.getElementById("date").innerHTML = now.toLocaleDateString()+' - ' + now.toLocaleTimeString();

}


////  Get Crypto CAD price list from API
//////////////////    Get Crypto Prices
async function getcryptocad(result = []) {
	console.log("getcryptocad function");
	const apiURL = "/api/cryptocad";
	const apiRes = await fetch(apiURL);
	const data = await apiRes.json();

	//console.log(data);	Its working = Done

	return data;
}


// Update the Price list on the Home page
async function updateHtmlprices() {
	console.log("updateHtmlprices");

	let res = await getcryptocad();

	if (!res) {
		console.log("Error in calling getcrypto function");
	}

	let arrRes = await Promise.resolve(res);

	console.log('Result', res);
	console.log('type of arrRes: ', typeof (arrRes));
	console.log('Length res', res.length);

	for (let i = 0; i < res.length; i++) {
		const item = res[i];

		console.log('Inside foreach loop', item);
		let elementP = document.getElementById(item.symbol);

		if (elementP) {
			console.log('Item / Element : ', item, ' / ', elementP);
			elementP.innerHTML = item.price;
			elementP.style.color = "var(--light2)";
			setTimeout(function () { elementP.style.color = null; }, 1300);
		}
	}
}

// Home page script functions

if (window.location.pathname === "/") {
	setInterval(updatetime, 1000);
	updateHtmlprices();
	setInterval(updateHtmlprices, 5000);

}

// Sending and receiving data in JSON format using POST method
// Login

const loginForm = document.querySelector("#loginform");
if (loginForm) {
	loginForm.addEventListener("submit", function (e) {
		submitform(e, this);
	});
}

const SubscribEmail = document.querySelector("#subscription-form");
if (SubscribEmail) {
	SubscribEmail.addEventListener("submit", function (e) {
		submitemail(e, this);
	});
}

const addnewemailform = document.querySelector("#addnewemailform");
if (addnewemailform) {
	addnewemailform.addEventListener("submit", function (e) {
		submitnewemail(e, this);
	});
}


const sliders = document.querySelectorAll(".eventelement");
if (sliders) {
	sliders.forEach(item =>{
	item.addEventListener('change', function (e) {
		//console.log("Got Click", this.id);
		//console.log(e);
		//console.log(e.target.checked);
		crypto_status_change(e);
		
	});
})
}

async function crypto_status_change(element){
	
	let id = element.id;
	let active = element.checked;
	console.log(element);
	/*
	if(this.checked != true){
		//console.log("Not checked");
		active = false;
	}else{	active = true;}
*/
	element.disabled = true;
	setTimeout(() => (element.disabled = false), 4000);
	let sysmessage = element;
	if (sysmessage) {
		sysmessage.innerHTML("");
		sysmessage.display= "none";
		}

	apiURL = "/api/cs_change";
	const apiRes = await fetch(apiURL, {
		method: 'POST',
		body: JSON.stringify({"id": id , "active" : active}),
		headers: {	'Content-type': 'application/json; charset=UTF-8'}
	});

	const delRed = await apiRes.json();

	if (delRed.success) {
		console.log("Successfull");
		sysmessage.innerHTML = delRed.message;
		//element.style.display = "none";
		sysmessage.style.display= "block";
		//setTimeout(()=>window.location.reload(),2000);
	} else
	{ sysmessage.innerHTML = "Error in connection with server, Please try later"
	sysmessage.style.display= "block";
	//if (element.checked)
	//sysmessage.style.display= "block";
}

}

////////////////	Enable/disable crypto on Admin page



///////////////// Delete Email subscribtion form By JSON
async function del_email(btn){
	if (!window.confirm("Are you sure?")){
		return;
	}
	let id = btn.id;
	btn.disabled = true;
	setTimeout(() => (btn.disabled = false), 5000);
	let sysmessage = document.querySelector("#servermessage");
	sysmessage.innerHTML = " ";

	apiURL = "/api/delemail";
	const apiRes = await fetch(apiURL, {
		method: 'POST',
		body: JSON.stringify({"id": id }),
		headers: {	'Content-type': 'application/json; charset=UTF-8'}
	});

	const delRed = await apiRes.json();

	if (delRed.success) {
		sysmessage.innerHTML = delRed.message;
		btn.style.display = "none";
		sysmessage.style.display= "block";
		setTimeout(()=>window.location.reload(),2000);
	} else
	{ sysmessage.innerHTML = "Error in connection with server, Please try later"
	sysmessage.style.display= "block";
	//sysmessage.style.display= "block";
}
}


async function submitnewemail(e,form) {
		
	e.preventDefault();

	const btnSubmitEmail = document.getElementById("submitemail1");
	btnSubmitEmail.disabled = true;
	setTimeout(() => (btnSubmitEmail.disabled = false), 4000);

	let sysmessage = document.querySelector("#servermessage");
	let email = document.querySelector("#newemail");
	console.log("Enterd email:", email);
	
	sysmessage.innerHTML = " ";

	apiURL = "/api/subscribemail";

	const apiRes = await fetch(apiURL, {
		method: "POST",
		body: JSON.stringify({"email": email.value}),
		headers: {"Content-type": "application/json; charset=UTF-8"}
	});

	const newemailRes = await apiRes.json();

	if (newemailRes.success) {
		sysmessage.innerHTML = "Email added!";
		window.alert("Email added!");
		window.location.reload("/emaillist");
	} else {
		sysmessage.innerHTML = "Error, Please try later";
		window.alert("Error, Please try later");
	}
}


///////////////// Email subscribtion form By JSON
 async function submitemail(e, form) {
	e.preventDefault();

	const btnSubmitEmail = document.getElementById("btnSubmitEmail");
	btnSubmitEmail.disabled = true;
	setTimeout(() => (btnSubmitEmail.disabled = false), 2000);

	let sysmessage = document.querySelector("#servermessage");
	let email = document.querySelector("#email");
	console.log("Enterd email",email);

	sysmessage.innerHTML = " ";

	apiURL = "/api/subscribemail";
	
	const apiRes = await fetch(apiURL, {
		method: 'POST',
		body: JSON.stringify({
			"email": email.value
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	});

	const subscribRes = await apiRes.json();

	if (subscribRes.success) {
		sysmessage.innerHTML = subscribRes.message;
		document.getElementById("subscription-form").style.display="none";
		//document.getElementById('subscription-form').disabled=true;

	} else
	{ sysmessage.innerHTML = "Error in connection with server, Please try later"}
	
}

///////////////// Submit Login Form By JSON
async function submitform(e, form) {
	e.preventDefault();

	const btnSubmit = document.getElementById("btnSubmit");
	btnSubmit.disabled = true;
	setTimeout(() => (btnSubmit.disabled = false), 2000);

	let sysmessage = document.querySelector("#sysmessage");
	let useremail = document.querySelector("#useremail");
	let password = document.querySelector("#inputPassword");

	sysmessage.innerHTML = " ";
	let xhr = new XMLHttpRequest();
	let url = "/api/auth";

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			let authresult = JSON.parse(this.response);
			if (authresult.success) {
				sysmessage.innerHTML = authresult.message;
				
				setTimeout(() => (window.location.href = authresult.action), 2500);
			} else {
				sysmessage.innerHTML = authresult.message;
			}
		}
	};
	var data = JSON.stringify({
		useremail: useremail.value,
		password: password.value,
	});
	xhr.send(data);
}
