// 用於處理路徑
var path = require('path');

var eventEmitter = require('./eventEmitter.js');

var web3 = require('./web3.js');
var eth = web3.eth;

var election = require('./election.js');

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

// ?a=address
app.get('/account', function (req, res) {
	var account = req.query.a

		// 先取得 etherBalance
		eth.getBalance(account, function (err, ethBalance) {
			if (!err) {
				// 再取得 bank balance
				// { from: account } 為 tx object
				bank.h5({
					from: account
				}, function (err, bankBalance) {
					if (!err) {
						// 回傳 json
						res.json({
							address: account,
							ethBalance: ethBalance,
							bankBalance: bankBalance
						});
					} else {
						console.log(err);
						res.status(500).json(err);
					}
				})
			} else {
				console.log(err);
				res.status(500).json(err);
			};
		});
});

// 取得以太帳戶們
app.get('/accounts', function (req, res) {
	eth.getAccounts(function (err, accounts) {
		if (!err) {
			res.json(accounts)
		} else {
			console.log(err)
			res.status(500).json(err)
		}
	})
});

app.post('/deposit', function (req, res) {
	var account = req.query.a
		var value = parseInt(req.query.e, 10)

		// 存款
		// 而 deposit 雖然本身沒有 args，但是需要透過描述 tx object 來達成送錢與表明自己的身分 (以哪個帳戶的名義)
		bank.deposit({
			from: account,
			value: web3.toWei(value, 'ether'),
			gas: 4600000
		}, function (err, txhash) {
			if (!err) {
				// 當 eventEmitter 收到事件描述之後，只會觸發一次以下的 callback
				eventEmitter.once('DepositEvent:' + account, function (eventPayload) {
					// 增加 txhash 欄位
					eventPayload['txhash'] = txhash
						// 並回傳 json
						res.json(eventPayload)
				})
			} else {
				console.log(err)
				res.status(500).json(err)
			}
		})
});

app.get('/withdraw', function (req, res) {
	var account = req.query.a
		var etherValue = parseInt(req.query.e, 10)

		// 提款
		// withdraw 本身只有一個 args，而 { from: account, gas: ...  } 為 tx object
		bank.withdraw(etherValue, {
			from: account,
			gas: 4600000
		}, function (err, txhash) {
			if (!err) {
				// 當 eventEmitter 收到事件描述之後，只會觸發一次以下的 callback
				eventEmitter.once('WithdrawEvent:' + account, function (eventPayload) {
					// 增加 txhash 欄位
					eventPayload['txhash'] = txhash
						// 並回傳 json
						res.json(eventPayload)
				})
			} else {
				console.log(err)
				res.status(500).json(err)
			}
		})
});

// ?f=address&t=address&e=etherValue
app.post('/transfer', function (req, res) {
	var from = req.query.f
		var to = req.query.t
		var etherValue = parseInt(req.query.e, 10)

		// 提款
		// withdraw 本身有兩個 args，而 { from: from, gas: ... } 為 tx object
		bank.transfer(to, etherValue, {
			from: from,
			gas: 4600000
		}, function (err, txhash) {
			if (!err) {
				// 當 eventEmitter 收到事件描述之後，只會觸發一次以下的 callback
				eventEmitter.once('TransferEvent:' + from, function (eventPayload) {
					// 增加 txhash 欄位
					eventPayload['txhash'] = txhash
						// 並回傳 json
						res.json(eventPayload)
				})
			} else {
				console.log(err)
				res.status(500).json(err)
			}
		})
});

//------------------------------------------------------------

app.post('/vote', function (req, res) {
	var f = req.query.f;

	var candidateNumber = req.query.candidateNumber;
	var comment = req.query.comment;

	election.vote(candidateNumber, comment, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			eventEmitter.once('Voted:' + f, function (eventPayload) {
				eventPayload['txhash'] = txhash;
				res.json(eventPayload);
			});
		} else {
			res.status(500).json(err);
		};
	});
});

app.post('/deadline', function (req, res) {
	var f = req.query.f;

	election.deadline({
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			//res.json(accounts);
		} else {

			res.status(500).json(err);
		};
	});
});

app.post('/candidates', function (req, res) {
	var f = req.query.f;

	election.candidates({
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			//res.json(accounts);
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

app.post('/memberId', function (req, res) {
	var f = req.query.f;

	election.memberId({
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			//res.json(accounts);
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

app.post('/numCandidates', function (req, res) {
	var f = req.query.f

		election.numCandidates({
			from: f,
			gas: 4600000
		}, function (err, txhash) {
			if (!err) {
				//res.json(accounts);
			} else {
				console.log("error");
				console.log(err);
				res.status(500).json(err);
			};
		});
});

app.post('/members', function (req, res) {
	var f = req.query.f;
	election.members(candAddr, description, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {

			//res.json(accounts);
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

app.post('/changeMembership', function (req, res) {
	var f = req.query.f;

	var targetMember = req.query.targetMember;
	var memberName = req.query.memberName;
	var canVote = req.query.canVote;

	election.changeMembership(targetMember, memberName, canVote, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			eventEmitter.once('MembershipChanged:' + f, function (eventPayload) {
				eventPayload['txhash'] = txhash
					res.json(eventPayload)
			});
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

app.post('/addCandidate', function (req, res) {
	var f = req.query.f

		var candAddr = req.query.candAddr
		var description = req.query.description

		election.addCandidate(candAddr, description, {
			from: f,
			gas: 4600000
		}, function (err, txhash) {
			if (!err) {
				eventEmitter.once('CandidateAdded:' + f, function (eventPayload) {
					eventPayload['txhash'] = txhash
						res.json(eventPayload)
				});
			} else {
				console.log("error");
				console.log(err);
				res.status(500).json(err);
			};
		});
});

app.post('/getAddr', function (req, res) {
	var f = req.query.f;

	election.getAddr({
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {

			//res.json(accounts);
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

app.post('/changeVotingState', function (req, res) {
	var f = req.query.f;

	var flag = req.query.flag;

	election.changeVotingState(flag, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {

			//res.json(accounts);
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

app.post('/open', function (req, res) {
	var f = req.query.f;

	election.open(candAddr, description, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {

			//res.json(accounts);
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

app.post('/checkCandidate', function (req, res) {
	var f = req.query.f;

	var candidateNumber = req.query.candidateNumber;

	election.checkCandidate(candidateNumber, {
		from: f,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {

			//res.json(accounts);
		} else {
			console.log("error");
			console.log(err);
			res.status(500).json(err);
		};
	});
});

//------------------------------------------------------------


// 網址為根目錄時，預設回傳 index.html
app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, 'static', 'index.html'))
})

// 沒有對應到任何 path 時，回傳 404
app.use(function (req, res) {
	res.status(404).send('not found')
})

// 聆聽 3030 port
app.listen(3030)
