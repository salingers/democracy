// 用於處理路徑
var path = require('path');

// import 同目錄的 eventEmitter.js
var eventEmitter = require('./eventEmitter.js');

// import 同目錄的 web3.js
console.log('./web3.js');
var web3 = require('./web3.js');
var eth = web3.eth;

console.log('./election.js');
var election = require('./election.js');

// Express.js

console.log('express');
var express = require('express');
var app = express();

// 讓 req 有 body
var bodyParser = require('body-parser');

// 使 static 中的檔案能被讀取
app.use(express.static(path.resolve(__dirname, 'static')));

// 註冊 body-parser 處理 body stream
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
		extended: true
	}));

//------------------------------------------------------------
// 取得以太帳戶們

console.log('/accounts');
app.get('/accounts', function (req, res) {
	eth.getAccounts(function (err, accounts) {
		if (!err) {
			console.log('accounts:success');
			res.json(accounts);
		} else {
			console.log('accounts:err')
			console.log(err);
			res.status(500).json(err);
		};
	});
});

//------------------------------------------------------------

app.post('/changeVotingState', function (req, res) {
	console.log("changeVotingState");

	var f = req.query.f;

	var flag = req.query.flag;

	election.changeVotingState(flag, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			console.log("success:");
			res.json(flag);
		} else {
			console.log("error:" + err);
			res.status(500).json(err);
		};
	});
});

app.post('/getAddr', function (req, res) {
	console.log("getAddr");

	var f = req.query.f;

	election.getAddr({
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			console.log("success:");
			res.json(f);
		} else {
			console.log("error:" + err);
			res.status(500).json(err);
		};
	});
});

app.post('/addCandidate', function (req, res) {
	console.log("addCandidate");

	var f = req.query.f;

	var candAddr = req.query.candAddr;
	var description = req.query.description;
	
	console.log("f:"+req.query.f);
	console.log("candAddr:"+candAddr);
	console.log("description:"+description);

	election.addCandidate(candAddr, description, {
		from: f,
		gas: 4600000
	}, function (err, candAddr, timestamp, txhash) {
		if (!err) {
			console.log("success:");
			eventEmitter.once('CandidateAdded:' + f, function (eventPayload) {
				eventPayload['txhash'] = txhash;
				res.json(eventPayload);
			});
		} else {
			console.log("error:" + err);
			res.status(500).json(err);
		};
	});
});

app.post('/vote', function (req, res) {
	console.log("vote");

	var f = req.query.f;

	var candidateNumber = req.query.candidateNumber;
	var comment = req.query.comment;

	election.vote(candidateNumber, comment, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			console.log("success:");
			eventEmitter.once('Voted:' + f, function (eventPayload) {
				eventPayload['txhash'] = txhash;
				res.json(eventPayload);
			});
		} else {
			console.log("error:" + err);
			res.status(500).json(err);
		};
	});
});

app.post('/changeMembership', function (req, res) {
	console.log("changeMembership");

	var f = req.query.f;

	var targetMember = req.query.targetMember;
	var memberName = req.query.memberName;
	var canVote = req.query.canVote;

	election.changeMembership(targetMember, memberName, canVote, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			console.log("success:");
			eventEmitter.once('MembershipChanged:' + f, function (eventPayload) {
				eventPayload['txhash'] = txhash;
				res.json(eventPayload);
			});
		} else {
			console.log("error:" + err);
			res.status(500).json(err);
		};
	});
});

app.post('/checkCandidate', function (req, res) {
	console.log("checkCandidate");

	var f = req.query.f;

	var candidateNumber = req.query.candidateNumber;

	election.checkCandidate(candidateNumber, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			console.log("success:");
			res.json(candidateNumber);
		} else {
			console.log("error:" + err);
			res.status(500).json(err);
		};
	});
});
//------------------------------------------------------------

// 網址為根目錄時，預設回傳 index.html
app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, 'static', 'index.html'))
});

// 沒有對應到任何 path 時，回傳 404
app.use(function (req, res) {
	res.status(404).send('not found')
});

// 聆聽 3030 port
app.listen(3030);
