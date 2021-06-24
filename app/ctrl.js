var async = require("async");
const fetch = require("node-fetch");
const { body, validationResult } = require("express-validator");
const { json } = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const config = require("./config");
const { render } = require("..");
const ObjectID = require("mongodb").ObjectID;


//// 						Test Codes
////
////

exports.test = function (req, res) {
	res.status(200).type("application/json").send({ myparam: "TEST OK" });
};

exports.smallcodetest = async function (req, res) {
	//>>>>          Add string to all item in an array
	let arr = ["1", "2", "3", "4", "5"];
	console.log("arr before change:", arr);
	arr.forEach(function (part, index) {
		this[index] = this[index] + "USDT";
	}, arr);
	console.log("arr After change:", arr);
	console.log("arr After change:");
	res.send("Check console");
	//<<<<          Add string to all item in an array
};
const cryptolist1 = [
	["BTC", "Bitcoin", "assets/img/bitcoin-logo.png","1"],
	["ETH", "Etheruim", "assets/img/ethereum-logo.png","1"],
	["BNB", "Binance Coin", "assets/img/bnb-logo.png","1"],
	["ADA", "Cardano", "assets/img/ada-logo.png","1"],
	["XRP", "Ripple", "assets/img/xrp-logo.png","1"],
	["XLM", "Steller", "assets/img/xlm-logo.png","1"],
	["LTC", "LightCoin", "assets/img/ltc-logo.png","1"],
	["DOT", "Polkadot", "assets/img/polkadot.png","1"],
	["UNI", "Uniswap", "assets/img/uni-logo.png","1"],
	["BCH", "Bitcoin Cash", "assets/img/bch-logo.png","1"],
];
/*
exports.backendgate = function (req, res) {
	if (req.session != "undefined" && req.session.loggedin) {
		console.log("Authorised");
		return true;
		//res.render("admin", {cryptolist1:cryptolist1});
	} else {
		res.redirect("/login");
		res.end();
		return false;
	}
};
*/

// old admin main - working well - no data base
exports.adminmain = async function (req, res) {
	/*
	const dbclist = await Promise.all(exports.db_readcryptolist());
	console.log (typeof(dbclist),"** clistdb ** ",dbclist);
	if (data) {
		//res.render("admin",{clist:dbclist[0]});
		console.log('Got ind');
		res.end();
	}
}catch(err){
	console.log(err);
}
	*/	
//exports.db_admincryptolist();

}


exports.db_admincryptolist = async function(req,res){

	console.log("Reading Cryptolist From DB");
	
	let json_res = { success: false, message: "", action: "" };
	const dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};
	const client = new MongoClient(dbinfo.url, { useUnifiedTopology: true });
	client.connect((err) => {
		console.log("Connected successfully to server");
		const db = client.db(dbinfo.db);
		const collection = db.collection("cryptoslist");
		collection.find({}).toArray((error, documents) => {
		client.close();
		if (error){
			throw error;
		}
		res.render('admin',{clist:documents});
		});
	});
}


exports.db_readcryptolist = async function(req,res){

	console.log("Reading Cryptolist From DB");
	
	let json_res = { success: false, message: "", action: "" };
	const dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};
	const client = new MongoClient(dbinfo.url, { useUnifiedTopology: true });
	client.connect((err) => {
		console.log("Connected successfully to server");
		const db = client.db(dbinfo.db);
		const collection = db.collection("cryptoslist");
		collection.find({}).toArray((error, documents) => {
		client.close();
		return documents;

		});
	});
}




exports.adddata = function (req, res) {
	console.log("Adding data");
	
	let json_res = { success: false, message: "", action: "" };
	const dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};
	
	cryptolist1.forEach(element => {
		
	const doc = { symbol: element[0], name: element[1],logo: element[2],active:element[3] };
	const client = new MongoClient(dbinfo.url, { useUnifiedTopology: true });
	client.connect((err) => {

		console.log("Connected successfully to server");
		const db = client.db(dbinfo.db);
		const collection = db.collection("cryptoslist");
		//console.log('Collection : ',collection);
		/*
				collection.find({}).toArray((error, documents) => {
					//client.close();
					console.log(documents);
					//res.status(200).send("Ok");
				  });
				*/

		collection.insertOne(doc, (errInsert, result) => {
			client.close();
			console.log("Write in db result:", result);
			if (result.n === result.ok) {
				json_res = {
					success: true,
					message: "Thank you thanks for subscribing.",
					action: "",
				};
			}
			if (errInsert) {
				console.log("Error ", errInsert);
			}
			let resJson = JSON.stringify(json_res);
			console.log(json_res)
			//res.status(200).send(resJson);
			//res.send(resJson);
			
		});
	});
});
}


exports.emaillist = function (req, res) {
	console.log("Emaillist");

	let json_res = { success: false, message: "", action: "" };
	//date = Date();
	const dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};
	let emaillist1 = [];
	const client = new MongoClient(dbinfo.url, { useUnifiedTopology: true });
	client.connect((err) => {
		console.log("Connected successfully to server for Show email list");

		const db = client.db(dbinfo.db);
		const collection = db.collection("subs_list");
		//console.log("Collection : ", collection.collectionName);

		collection.find({}).toArray((error, documents) => {
			client.close();
			//console.log(documents);
			//res.status(200).send("Ok");
			res.render("emaillist", { emaillist1: documents });
		});
	});
};

exports.dateformatted = function (req, res) {
	console.log("date formating ");
	let now = new Date();
	let date1 = ("0" + now.getDate()).slice(-2);
	let month = ("0" + (now.getMonth() + 1)).slice(-2);
	let year = now.getFullYear();
	const datestr = year + "-" + month + "-" + date1;
	console.log("date result ", datestr);
	return datestr;
};

exports.timeformatted = function (req,res) {
	console.log("Time Formating");
	let now = new Date();
	let hours = ("0" + now.getHours()).slice(-2);
	let minutes = ("0" + now.getMinutes()).slice(-2);
	let seconds =("0" +  now.getSeconds()).slice(-2);
	let timestr = hours + ":" + minutes + ":" + seconds;
	console.log("Time result ", timestr);
	return timestr;
};

exports.datentime = function (req, res) {
	
	const nowdate = exports.dateformatted();
	const nowtime = exports.timeformatted();
	datetime = nowdate + " - " + nowtime;
	res.send(datetime);
	res.end();
};


exports.cs_change = async function (req,res){
	let json_res = { success: false, message: "", action: "" };
	let id = req.body.id;
	let active = req.body.active;
	json_res.message = "Recieved the order";
	const dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};

	const client = new MongoClient(dbinfo.url, { useUnifiedTopology: true });
	client.connect((err) => {
		if (err) {console.log("Error ", err);
			throw err;}
		console.log("Connected successfully to server");

		const db = client.db(dbinfo.db);
		const collection = db.collection("cryptoslist");
		const query = { '_id' : ObjectID(id)};
		const updatedata = { $set: {'active' : active}  };
		console.log("Update Query ",query);
		console.log("Update updatedata ",updatedata);
		collection.updateOne( query , updatedata);
		 {
			//client.close();

			//console.log("Write in db result:", result);
			//if (result.deletedCount == 1) {
				json_res = {
					success: true,
					message: "Deleted.",
					action: "",
				};
			//}
		//	if (errDel) {
		//		console.log("Error ", errDel);
		//	}
			
		//	let resJson = JSON.stringify(json_res);
			//res.status(200).send(resJson);

		//	res.send(resJson);
			res.end;
		}
	});

}

exports.delemail = async function (req,res){
	let json_res = { success: false, message: "", action: "" };
	let id = req.body.id;
	json_res.message = "Recieved the order";
	const dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};
	//test 
	//json_res = { success: true, message: "Deleted", action: "" };
	//res.send(json_res);
	console.log("Delete Api id ",id);
	const client = new MongoClient(dbinfo.url, { useUnifiedTopology: true });
	client.connect((err) => {
		if (err) {console.log("Error ", err);
			throw err;}
		console.log("Connected successfully to server");

		const db = client.db(dbinfo.db);
		const collection = db.collection("subs_list");
		const query = { _id : ObjectID(id)};
		console.log("Delete Query ",query);
		collection.deleteOne(query, (errDel, result) => {
			client.close();
			if (errDel) {console.log(errDel);
				throw errDel;}
			console.log("Write in db result:", result.deletedCount);
			if (result.deletedCount == 1) {
				json_res = {
					success: true,
					message: "Deleted.",
					action: "",
				};
			}
			if (errDel) {
				console.log("Error ", errDel);
			} 
			let resJson = JSON.stringify(json_res);
			//res.status(200).send(resJson);
			res.send(resJson);
			res.end;
		});
	});

}


exports.subscribemail = function (req, res) {
	console.log("Got in subscribemail");

	let email = req.body.email;
	let json_res = { success: false, message: "", action: "" };
	date = exports.dateformatted();
	time = exports.timeformatted();
	const dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};
	const doc = { email: email, date: date,time: time };
	const client = new MongoClient(dbinfo.url, { useUnifiedTopology: true });
	client.connect((err) => {

		console.log("Connected successfully to server");
		const db = client.db(dbinfo.db);
		const collection = db.collection("subs_list");
		//console.log('Collection : ',collection);
		/*
				collection.find({}).toArray((error, documents) => {
					//client.close();
					console.log(documents);
					//res.status(200).send("Ok");
				  });
				*/

		collection.insertOne(doc, (errInsert, result) => {
			client.close();
			console.log("Write in db result:", result);
			if (result.n === result.ok) {
				json_res = {
					success: true,
					message: "Thank you thanks for subscribing.",
					action: "",
				};
			}
			if (errInsert) {
				console.log("Error ", errInsert);
			}
			let resJson = JSON.stringify(json_res);
			//res.status(200).send(resJson);
			res.send(resJson);
			res.end;
		});
	});
};

exports.testdb = function (req, res) {
	console.log("TestDB");
	//const
	var dbinfo = {
		url: config.database.url,
		db: config.database.db,
		user: config.database.user,
		password: config.database.password,
	};
	//console.log('dbinfo',dbinfo);
	MongoClient.connect(
		dbinfo.url,
		{ useUnifiedTopology: true },
		function (err, client) {
			console.log("Connected successfully to server");
			const db = client.db(dbinfo.db);
			client.close();
		}
	);

	res.send(dbinfo);
	res.end();
};

////					End of Tests
////

exports.authentication = function (req, res) {
	
	let username = req.body.useremail;
	let password = req.body.password;
	let json_res = { success: false, message: "", action: "" };

	console.log("username: ", username, "password: ", password);

	if (username && password) {
		if (username == "a@a.com" && password == "a") {
			req.session.loggedin = true;
			req.session.username = username;
			//res.json({ success: true, message : "Successfull",adminurl:"/admin" });
			//res.redirect('/admin');
			//showif_loggedin(req,res);
			//prepare JSON Answer
			json_res = { success: true, message: "Successfull", action: "/admin" };
		} else {
			//res.json({ success: false, message: 'Invalid uername or password',action: '' });
			json_res = {
				success: false,
				message: "Invalid uername or password",
				action: "",
			};
		}
	} else {
		json_res = { success: false, message: "No data", action: "" };
		console.log(json_res.message);
	}
	res.json(json_res);
	res.end();
};

exports.fetchCrypto = async function (req, res) {
	try {
		//console.log('fetchCrypto function inside');
		const cryptolist = [
			"BTC",
			"ETH",
			"BNB",
			"ADA",
			"XRP",
			"XLM",
			"LTC",
			"DOT",
			"UNI",
			"BCH",
		];
		let cryptoSymbols = cryptolist.slice(0);
		let cryptoPLUSD = [];

		cryptoSymbols.forEach(function (part, index) {
			cryptoSymbols[index] = cryptoSymbols[index] + "USDT";
		}, cryptoSymbols);

		let ResBinanceApi = await fetch(
			"https://api.binance.com/api/v3/ticker/price",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		let ResBinancejson = await ResBinanceApi.text();
		try {
			let resParsed = JSON.parse(ResBinancejson);

			cryptoPLUSD = resParsed.filter(function (itm) {
				return cryptoSymbols.indexOf(itm.symbol) > -1;
			});

			return cryptoPLUSD;
			//res.send(parsedata);
		} catch (err) {
			//console.error(err)
			return err;
		}
	} catch (err) {
		//console.log(err)
		return err;
		//res.status(500).send('Something went wrong')
	}
};

exports.fetchUSDCAD = async function () {
	try {
		let apiResponse = await fetch(
			"https://www.bankofcanada.ca/valet/observations/FXCADUSD/json"
		);
		let apiResponseJson = await apiResponse.text();

		try {
			let parsedata = JSON.parse(apiResponseJson);
			// console.log(parsedata.observations[parsedata.observations.length-1]);
			return parsedata.observations[parsedata.observations.length - 1];
		} catch (err) {
			//console.error(err);
			return "Error : " + err;
		}
	} catch (err) {
		//console.log(err)
		return "Error : " + err;
		//res.status(500).send('Something went wrong')
	}
};

exports.cryptocad = async function (res, req) {
	const cryptolist = [
		"BTC",
		"ETH",
		"BNB",
		"ADA",
		"XRP",
		"XLM",
		"LTC",
		"DOT",
		"UNI",
		"BCH",
	];

	let result;

	try {
		console.log("CryptoCAD Function");
		const [resCryptoUSD, resUsdCad] = await Promise.all([
			this.fetchCrypto(),
			this.fetchUSDCAD(),
		]);

		//console.log('HI2');
		let cadusdrate = resUsdCad.FXCADUSD.v;
		let cryptoPLUSD = resCryptoUSD.slice(0);
		//let cryptoPLCAD =  resCryptoUSD.slice(0);
		let cryptoPLCAD = [];

		cryptoPLUSD.forEach(function (part, index) {
			let symbol = cryptoPLUSD[index].symbol;
			let price = String((cryptoPLUSD[index].price / cadusdrate).toFixed(5));
			symbol = symbol.slice(0, symbol.length - 4);

			jsonElement = {
				symbol: symbol,
				price: price,
			};
			cryptoPLCAD[index] = jsonElement;
		}, cryptoPLCAD);

		//console.log('***** Crypto Price list in CAD *****',cryptoPLCAD);
		//console.log('cryptoPLUSD : ',cryptoPLUSD);
		result = JSON.stringify(cryptoPLCAD);
	} catch (err) {
		//console.error(err)
		result = err;
	}

	return result;
};

exports.fetchBTCUSD = async function () {
	try {
		let apiResponse = await fetch(
			"https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
		);
		let apiResponseJson = await apiResponse.text();

		try {
			let parsedata = JSON.parse(apiResponseJson);
			return parsedata;
		} catch (err) {
			//console.error(err)
			return "Error : " + err;
		}
	} catch (err) {
		return "Error : " + err;
		//res.status(500).send('Something went wrong')
	}
};

exports.fetchtest = async function (req, res) {
	try {
		let { apiRoute } = "";

		let apiResponse = await fetch(
			"https://www.bankofcanada.ca/valet/observations/FXCADUSD/json"
		);
		let apiResponseJson = await apiResponse.text();
		try {
			let parsedata = JSON.parse(apiResponseJson);
			console.log(parsedata.observations[parsedata.observations.length - 1]);
			res.send(parsedata);
		} catch (err) {
			console.error(err);
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Something went wrong");
	}
};
