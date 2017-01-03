
var eventEmitter = require('./eventEmitter.js');
var web3 = require('./web3.js');

//------------------------------------------------------------

var electionContract = web3.eth.contract([{
				"constant": false,
				"inputs": [{
						"name": "candidateNumber",
						"type": "uint256"
					}, {
						"name": "comment",
						"type": "string"
					}
				],
				"name": "vote",
				"outputs": [{
						"name": "voteID",
						"type": "uint256"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": true,
				"inputs": [],
				"name": "deadline",
				"outputs": [{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": true,
				"inputs": [{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "candidates",
				"outputs": [{
						"name": "candAddr",
						"type": "address"
					}, {
						"name": "description",
						"type": "string"
					}, {
						"name": "elected",
						"type": "bool"
					}, {
						"name": "numberOfVotes",
						"type": "uint256"
					}, {
						"name": "currentResult",
						"type": "int256"
					}, {
						"name": "proposalHash",
						"type": "bytes32"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": true,
				"inputs": [{
						"name": "",
						"type": "address"
					}
				],
				"name": "memberId",
				"outputs": [{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": true,
				"inputs": [],
				"name": "numCandidates",
				"outputs": [{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": true,
				"inputs": [{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "members",
				"outputs": [{
						"name": "member",
						"type": "address"
					}, {
						"name": "canVote",
						"type": "bool"
					}, {
						"name": "name",
						"type": "string"
					}, {
						"name": "memberSince",
						"type": "uint256"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": false,
				"inputs": [{
						"name": "targetMember",
						"type": "address"
					}, {
						"name": "memberName",
						"type": "string"
					}, {
						"name": "canVote",
						"type": "bool"
					}
				],
				"name": "changeMembership",
				"outputs": [],
				"payable": false,
				"type": "function"
			}, {
				"constant": false,
				"inputs": [{
						"name": "candAddr",
						"type": "address"
					}, {
						"name": "description",
						"type": "string"
					}
				],
				"name": "addCandidate",
				"outputs": [{
						"name": "candID",
						"type": "uint256"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": false,
				"inputs": [],
				"name": "getAddr",
				"outputs": [{
						"name": "",
						"type": "address"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": false,
				"inputs": [{
						"name": "flag",
						"type": "bool"
					}
				],
				"name": "changeVotingState",
				"outputs": [],
				"payable": false,
				"type": "function"
			}, {
				"constant": true,
				"inputs": [],
				"name": "open",
				"outputs": [{
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"constant": false,
				"inputs": [{
						"name": "candidateNumber",
						"type": "uint256"
					}
				],
				"name": "checkCandidate",
				"outputs": [{
						"name": "",
						"type": "uint256"
					}, {
						"name": "",
						"type": "uint256"
					}, {
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"type": "function"
			}, {
				"inputs": [],
				"payable": false,
				"type": "constructor"
			}, {
				"anonymous": false,
				"inputs": [{
						"indexed": false,
						"name": "memAddr",
						"type": "address"
					}, {
						"indexed": false,
						"name": "flag",
						"type": "bool"
					}
				],
				"name": "MembershipChanged",
				"type": "event"
			}, {
				"anonymous": false,
				"inputs": [{
						"indexed": false,
						"name": "candAddr",
						"type": "address"
					}, {
						"indexed": false,
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"name": "CandidateAdded",
				"type": "event"
			}, {
				"anonymous": false,
				"inputs": [{
						"indexed": false,
						"name": "memAddr",
						"type": "address"
					}, {
						"indexed": false,
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"name": "Voted",
				"type": "event"
			}
		]);

var election = electionContract.new({
		from: web3.eth.accounts[0],
		data: '0x606060405234610000575b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b61129a8061005c6000396000f300606060405236156100b8576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806324108475146100bd57806329dcb0cf146101315780633477ee2e1461015457806339106821146102625780635216509a146102a95780635daf08ca146102cc5780636f8a3505146103c45780639a594f0614610445578063a74c2bb6146104cf578063d6a714cb1461051e578063fcfff16f1461053d578063fee63f4a14610564575b610000565b346100005761011b600480803590602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506105a7565b6040518082815260200191505060405180910390f35b346100005761013e610762565b6040518082815260200191505060405180910390f35b346100005761016f6004808035906020019091905050610768565b604051808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200186151515158152602001858152602001848152602001836000191660001916815260200182810382528781815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561024e5780601f106102235761010080835404028352916020019161024e565b820191906000526020600020905b81548152906001019060200180831161023157829003601f168201915b505097505050505050505060405180910390f35b3461000057610293600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107dd565b6040518082815260200191505060405180910390f35b34610000576102b66107f5565b6040518082815260200191505060405180910390f35b34610000576102e760048080359060200190919050506107fb565b604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200184151515158152602001806020018381526020018281038252848181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156103b25780601f10610387576101008083540402835291602001916103b2565b820191906000526020600020905b81548152906001019060200180831161039557829003601f168201915b50509550505050505060405180910390f35b3461000057610443600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919080351515906020019091905050610864565b005b34610000576104b9600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610cb7565b6040518082815260200191505060405180910390f35b34610000576104dc611135565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100005761053b6004808035151590602001909190505061113e565b005b346100005761054a6111e6565b604051808215151515815260200191505060405180910390f35b346100005761057f60048080359060200190919050506111f9565b6040518084815260200183815260200182151515158152602001935050505060405180910390f35b600060006001544211806105c85750600060149054906101000a900460ff16155b156105ed576000600060146101000a81548160ff021916908315150217905550610000565b600384815481101561000057906000526020600020906008020160005b509050600115158160070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515141561066d57610000565b60018160070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550806003016000815480929190600101919050555080600401600081548092919060010191905055507f4d99b957a2bc29a30ebd96a7be8e68fe50a3c701db28a91436490b7d53870ca43342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5092915050565b60015481565b600381815481101561000057906000526020600020906008020160005b915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600101908060020160009054906101000a900460ff16908060030154908060040154908060050154905086565b60046020528060005260406000206000915090505481565b60025481565b600581815481101561000057906000526020600020906003020160005b915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060000160149054906101000a900460ff169080600101908060020154905084565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108c457610000565b6000600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610bc057600580549050600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060058054809190600101815481835581811511610a4357600302816003028360005260206000209182019101610a4291905b80821115610a3e5760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549060ff021916905560018201805460018160011615610100020316600290046000825580601f106109f55750610a2c565b601f016020900490600052602060002090810190610a2b91905b80821115610a27576000816000905550600101610a0f565b5090565b5b50600282016000905550600301610987565b5090565b5b50505091506080604051908101604052808673ffffffffffffffffffffffffffffffffffffffff168152602001841515815260200185815260200142815250600583815481101561000057906000526020600020906003020160005b5060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548160ff0219169083151502179055506040820151816001019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b5957805160ff1916838001178555610b87565b82800160010185558215610b87579182015b82811115610b86578251825591602001919060010190610b6b565b5b509050610bac91905b80821115610ba8576000816000905550600101610b90565b5090565b505060608201518160020155905050610c3f565b600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549150600582815481101561000057906000526020600020906003020160005b509050828160000160146101000a81548160ff0219169083151502179055505b7f27b022af4a8347100c7a041ce5ccf8e14d644ff05de696315196faae8cd50c9b8584604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a15b5b5050505050565b6000600060006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d1b57610000565b60009250600090505b600380549050811015610dbc57600381815481101561000057906000526020600020906008020160005b5091508573ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610dae57600192505b5b8080600101915050610d24565b82151561112a5760038054809190600101815481835581811511610f8257600802816008028360005260206000209182019101610f8191905b80821115610f7d5760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201805460018160011615610100020316600290046000825580601f10610e4f5750610e86565b601f016020900490600052602060002090810190610e8591905b80821115610e81576000816000905550600101610e69565b5090565b5b506002820160006101000a81549060ff02191690556003820160009055600482016000905560058201600090556006820180546000825560020290600052602060002090810190610f7291905b80821115610f6e5760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201805460018160011615610100020316600290046000825580601f10610f2d5750610f64565b601f016020900490600052602060002090810190610f6391905b80821115610f5f576000816000905550600101610f47565b5090565b5b5050600201610ed3565b5090565b5b5050600801610df5565b5090565b5b5050509350600384815481101561000057906000526020600020906008020160005b509150858260000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084826001019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061103857805160ff1916838001178555611066565b82800160010185558215611066579182015b8281111561106557825182559160200191906001019061104a565b5b50905061108b91905b8082111561108757600081600090555060010161106f565b5090565b505060008260020160006101000a81548160ff02191690831515021790555060008260030181905550600184016002819055507f32581d4a78c1456ab6ce9fb0954e9ce683965a580b3b21841367c105dad7a3138642604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b5b50505092915050565b60003390505b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561119a57610000565b80600060146101000a81548160ff021916908315150217905550600060149054906101000a900460ff16156111d95761025842016001819055506111e1565b426001819055505b5b5b50565b600060149054906101000a900460ff1681565b600060006000600060006000600387815481101561000057906000526020600020906008020160005b509250600091506001544210505b600160026005805490508115610000570401905080836004015410151561125657600191505b808360040154839550955095505b50505091939092505600a165627a7a723058201d924d5f53951f8075c2781ff7bfbb3a1c617baaffeaeb2fad37bb5cc5affa1a0029',
		gas: '4700000'
	}, function (e, contract) {

		if (typeof contract.address !== 'undefined') {
			//註冊事件
			election.CandidateAdded({}, function (err, event) {
				console.log('CandidateAdded:' + event.args.candAddr);
				eventEmitter.emit('CandidateAdded:' + event.args.candAddr, event.args);
			});

			election.MembershipChanged({}, function (err, event) {
				console.log('MembershipChanged:' + event.args.memAddr);
				eventEmitter.emit('MembershipChanged:' + event.args.memAddr, event.args);
			});

			election.Voted({}, function (err, event) {
				console.log('Voted:' + event.args.memAddr);
				eventEmitter.emit('Voted:' + event.args.memAddr, event.args);
			});

		}
	});

//------------------------------------------------------------
module.exports = election;
