var express = require("express"),
  routes = express.Router(),
  MongoClient = require("mongodb").MongoClient;

//
var ctrl = require("./ctrl");

//>	Test routes
routes.get("/api/smallcode", ctrl.smallcodetest);

routes.get("/api/datentime", ctrl.datentime);

routes.get("/adddata7847",ctrl.adddata);

routes.get("/api/testdb", ctrl.testdb);

routes.get("/testd", (req, res) => {
	MongoClient.connect("mongodb://localhost:27017", function (err, client) {
	  const db = client.db("comics");
	  const collection = db.collection("superheroes");
  
	  collection.find({}).toArray((error, documents) => {
		client.close();
		console.log(documents);
		res.status(200).send("Ok");
	  });
	});
  });

routes.get("/api/t", ctrl.fetchtest);

routes.post("/ref", function (req, res) {
  res.json(req.body);
});

routes.get("/p", function (req, res) {
  //const fetchpricelist  = require('./app/fetchpricelist');
  //app.use('/fetchpricelist',fetchpricelist);

  const router = require("express").Router();
  const got = require("got");
  const { pipeline } = require("stream");

  const dataStream = got.stream({
    url: "http://api.binance.com/api/v3/ticker/price?symbol=BTCUSD",
    qs: {
      api_key: "",
      query: "",
    },
  });
});

//==> fromDB
const cryptolist1 = [
	['BTC','Bitcoin','assets/img/bitcoin-logo.png'],
	['ETH','Etheruim','assets/img/ethereum-logo.png'],
	['BNB','Binance Coin','assets/img/bnb-logo.png'],
	['ADA','Cardano','assets/img/ada-logo.png'],
	['XRP','Ripple','assets/img/xrp-logo.png'],
	['XLM','Steller','assets/img/xlm-logo.png'],
	['LTC','LightCoin','assets/img/ltc-logo.png'],
	['DOT','Polkadot','assets/img/polkadot.png'],
	['UNI','Uniswap','assets/img/uni-logo.png'],
	['BCH','Bitcoin Cash','assets/img/bch-logo.png']
  ];


//////////		Backend routes
//////////
//////////

routes.post("/api/auth", ctrl.authentication);

routes.post("/api/delemail", function (req,res){
//	if (req.session != "undefined" && req.session.loggedin) {
		ctrl.delemail(req,res);
//	} else/
/**
 {
		//res.redirect("/login");		
		res.status(200).send({success: false,message: "Denied reqeust.Login.", action: ""});
		res.end();
	}
	*/
});

routes.post("/api/cs_change",ctrl.cs_change);

routes.get("/admin",function (req,res){
//	if (req.session != "undefined" && req.session.loggedin) {
		ctrl.db_admincryptolist(req,res);
/*	} else 
{
		res.redirect("/login");		
		res.end();
	}
*/	
});

routes.get("/emaillist",function(req,res){
//	if (req.session != "undefined" && req.session.loggedin) {
		ctrl.emaillist(req,res);
/*	} else
 {
		res.redirect("/login");		
		res.end();
	} */
});



routes.get("/logout", function (req, res) {
	req.session.destroy();
	res.redirect("/login");
  });

//////////		Frontend routes
//////////
//////////




  routes.get("/", function (req, res) {
	res.render("index", {cryptolist1:cryptolist1});
  });

  routes.get("/about", function (req, res) {
	res.render("about", {});
  });
  
  routes.get("/login", function (req, res) {
	res.render("login", {});
  });
  
//////////		API routes
//////////
//////////
// 	post Routes

routes.post("/api/subscribemail", ctrl.subscribemail);

// 	Get Routes


routes.get("/api/usdcad", async function (req, res) {
  let result = await ctrl.fetchUSDCAD();
  res.send(result);
});

routes.get("/api/btcusd", async function (req, res) {
  let result = await ctrl.fetchBTCUSD();
  res.send(result);
});

routes.get("/api/cryptocad", async function (req, res) {
  let result = await ctrl.cryptocad();
  console.log(result);
  res.send(result);
});

routes.get("/api/fetchCrypto", async function (req, res) {
  let result = await ctrl.fetchCrypto();
  res.send(result);
});

module.exports = exports = routes;
