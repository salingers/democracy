
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
		data: '0x606060405234610000575b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b61122d8061005c6000396000f300606060405236156100b8576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806324108475146100bd57806329dcb0cf146101315780633477ee2e1461015457806339106821146102625780635216509a146102a95780635daf08ca146102cc5780636f8a3505146103c45780639a594f0614610445578063a74c2bb6146104cf578063d6a714cb1461051e578063fcfff16f1461053d578063fee63f4a14610564575b610000565b346100005761011b600480803590602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506105a7565b6040518082815260200191505060405180910390f35b346100005761013e610826565b6040518082815260200191505060405180910390f35b346100005761016f600480803590602001909190505061082c565b604051808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200186151515158152602001858152602001848152602001836000191660001916815260200182810382528781815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561024e5780601f106102235761010080835404028352916020019161024e565b820191906000526020600020905b81548152906001019060200180831161023157829003601f168201915b505097505050505050505060405180910390f35b3461000057610293600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506108a1565b6040518082815260200191505060405180910390f35b34610000576102b66108b9565b6040518082815260200191505060405180910390f35b34610000576102e760048080359060200190919050506108bf565b604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200184151515158152602001806020018381526020018281038252848181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156103b25780601f10610387576101008083540402835291602001916103b2565b820191906000526020600020905b81548152906001019060200180831161039557829003601f168201915b50509550505050505060405180910390f35b3461000057610443600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919080351515906020019091905050610928565b005b34610000576104b9600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610d1e565b6040518082815260200191505060405180910390f35b34610000576104dc61113f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100005761053b60048080351515906020019091905050611148565b005b346100005761054a611171565b604051808215151515815260200191505060405180910390f35b346100005761057f6004808035906020019091905050611184565b6040518084815260200183815260200182151515158152602001935050505060405180910390f35b600060006000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054148061066457506005600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054815481101561000057906000526020600020906003020160005b5060000160149054906101000a900460ff16155b1561066e57610000565b60015442118061068b5750600060149054906101000a900460ff16155b156106b0576000600060146101000a81548160ff021916908315150217905550610000565b600384815481101561000057906000526020600020906008020160005b509050600115158160070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515141561073057610000565b60018160070160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550806003016000815480929190600101919050555080600401600081548092919060010191905055507f4d99b957a2bc29a30ebd96a7be8e68fe50a3c701db28a91436490b7d53870ca43342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b5092915050565b60015481565b600381815481101561000057906000526020600020906008020160005b915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600101908060020160009054906101000a900460ff16908060030154908060040154908060050154905086565b60046020528060005260406000206000915090505481565b60025481565b600581815481101561000057906000526020600020906003020160005b915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060000160149054906101000a900460ff169080600101908060020154905084565b600060006000600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610c2857600580549050600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060058054809190600101815481835581811511610aab57600302816003028360005260206000209182019101610aaa91905b80821115610aa65760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549060ff021916905560018201805460018160011615610100020316600290046000825580601f10610a5d5750610a94565b601f016020900490600052602060002090810190610a9391905b80821115610a8f576000816000905550600101610a77565b5090565b5b506002820160009055506003016109ef565b5090565b5b50505091506080604051908101604052808673ffffffffffffffffffffffffffffffffffffffff168152602001841515815260200185815260200142815250600583815481101561000057906000526020600020906003020160005b5060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548160ff0219169083151502179055506040820151816001019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610bc157805160ff1916838001178555610bef565b82800160010185558215610bef579182015b82811115610bee578251825591602001919060010190610bd3565b5b509050610c1491905b80821115610c10576000816000905550600101610bf8565b5090565b505060608201518160020155905050610ca7565b600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549150600582815481101561000057906000526020600020906003020160005b509050828160000160146101000a81548160ff0219169083151502179055505b7f27b022af4a8347100c7a041ce5ccf8e14d644ff05de696315196faae8cd50c9b8584604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a15b5050505050565b600060006000600060009250600090505b600380549050811015610dc757600381815481101561000057906000526020600020906008020160005b5091508573ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610db957600192505b5b8080600101915050610d2f565b8215156111355760038054809190600101815481835581811511610f8d57600802816008028360005260206000209182019101610f8c91905b80821115610f885760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201805460018160011615610100020316600290046000825580601f10610e5a5750610e91565b601f016020900490600052602060002090810190610e9091905b80821115610e8c576000816000905550600101610e74565b5090565b5b506002820160006101000a81549060ff02191690556003820160009055600482016000905560058201600090556006820180546000825560020290600052602060002090810190610f7d91905b80821115610f795760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201805460018160011615610100020316600290046000825580601f10610f385750610f6f565b601f016020900490600052602060002090810190610f6e91905b80821115610f6a576000816000905550600101610f52565b5090565b5b5050600201610ede565b5090565b5b5050600801610e00565b5090565b5b5050509350600384815481101561000057906000526020600020906008020160005b509150858260000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084826001019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061104357805160ff1916838001178555611071565b82800160010185558215611071579182015b82811115611070578251825591602001919060010190611055565b5b50905061109691905b8082111561109257600081600090555060010161107a565b5090565b505060008260020160006101000a81548160ff02191690831515021790555060008260030181905550600184016002819055507f32581d4a78c1456ab6ce9fb0954e9ce683965a580b3b21841367c105dad7a3138642604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b50505092915050565b60003390505b90565b80600060146101000a81548160ff02191690831515021790555061025842016001819055505b50565b600060149054906101000a900460ff1681565b600060006000600060006000600387815481101561000057906000526020600020906008020160005b509250600091506001544210156111c357610000565b60016002600580549050811561000057040190508083600401541015156111e957600191505b808360040154839550955095505b50505091939092505600a165627a7a7230582021e34601c5de2f036db9ea53076a0f32538fd3d757ab95c9df8f950fd16ff0b30029',
		gas: '4700000'
	}, function (e, contract) {

		if (typeof contract.address !== 'undefined') {


				//註冊事件
			election.MembershipChanged({}, function (err, event) {
				//console.log('MembershipChanged:' + event.args.memAddr);
				eventEmitter.emit('MembershipChanged:' + event.args.memAddr, event.args)
			});

			election.CandidateAdded({}, function (err, event) {
				//console.log('CandidateAdded:' + event.args.candAddr);
				eventEmitter.emit('CandidateAdded:' + event.args.candAddr, event.args)
			});

			election.Voted({}, function (err, event) {
				//console.log('Voted:' + event.args.memAddr);
				eventEmitter.emit('Voted:' + event.args.memAddr, event.args)
			});

		}
	});

//------------------------------------------------------------
module.exports = election;
