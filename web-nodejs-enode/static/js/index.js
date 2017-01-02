var contractAddressH5 = $('#contractAddressH5');
var deployedContractAddressInput = $('#deployedContractAddressInput');
var loadDeployedContractButton = $('#loadDeployedContractButton');
var deployNewContractButton = $('#deployNewContractButton');

var whoami
var whoamiButton
var deposit
var depositButton
var withdraw
var withdrawButton
var transferTo
var transferEtherValue
var transferButton
var ethBalance
var bankBalance
var logger

// 用於增加紀錄於活動紀錄
function log(input) {
	if (typeof input === 'object') {
		input = JSON.stringify(input, null, 2)
	}
	logger.html(input + '\n' + logger.html())
}

// AJAX GET 方法
function GET(url, callback, failback) {
	return jQuery
	.ajax(url, {
		method: 'GET',
		cache: false,
		crossDomain: false
	})
	.done(callback)
	.fail(failback)
}

// AJAX POST 方法
function POST(url, data, callback, failback) {
	return jQuery
	.ajax(url, {
		method: 'POST',
		cache: false,
		data: data,
		crossDomain: false
	})
	.done(callback)
	.fail(failback)
}

// 載入網頁之後
$(function () {

	whoami = $('#whoami')
	whoamiButton = $('#whoamiButton')
	deposit = $('#deposit')
	depositButton = $('#depositButton')
	withdraw = $('#withdraw')
	withdrawButton = $('#withdrawButton')
	transferTo = $('#transferTo')
	transferEtherValue = $('#transferEtherValue')
	transferButton = $('#transferButton')
	logger = $('#logger')
	ethBalance = $('#ethBalance')
	bankBalance = $('#bankBalance')

		//使用者
		GET('./accounts',
			function (res) {
			for (var k in res) {
				whoami.append('<option value="' + res[k] + '">' + k + '. ' + res[k] + '</option>');
				$('#candAddr').append('<option value="' + res[k] + '">' + k + '. ' + res[k] + '</option>');

				//candidateNumber
			}
		}, function (res) {
			log('使用者載入錯誤')
		})

		// 當按下載入既有合約位址時
		loadDeployedContractButton.on('click', function () {
			loadBank(web3, log, deployedContractAddressInput.val(), contractAddressH5);
		});

	// 當按下部署合約時
	deployNewContractButton.on('click', function () {
		newBank(web3, log, contractAddressH5, deployedContractAddressInput);
	});
	
	
	//------------------------------------------------------------

	// 當按下登入按鍵時
	whoamiButton.on('click', function () {
		// GET account?a=address
		GET('./account?a=' + whoami.val(),
			function (res) {
			// 更新活動紀錄
			log(res)
			log('更新帳戶資料')

			// 更新介面
			ethBalance.text('以太帳戶餘額 (wei): ' + res.ethBalance)
			bankBalance.text('銀行合約餘額 (wei): ' + res.bankBalance)
		},
			function (res) {
			//log(res.responseText.replace(/\<br\>/g, '\n').replace(/\&nbsp;/g, ' '))
			log('請檢查帳戶及銀行合約餘額')
		})
	})

	//------------------------------------------------------------

	$('#changeVotingState').on('click', function () {

		POST('./changeVotingState?'
			 + 'f=' + whoami.val()
			 + '&flag=' + $('#flag').val(), {}, function (res) {
			log(res);
			log('投票狀態');

		}, function (res) {

			/*
			log(res.responseText
			.replace(/\<br\>/g, '\n')
			.replace(/\&nbsp;/g, ' '));
			 */
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('請檢查帳戶及銀行合約餘額');
		})
	})

	$('#getAddr').on('click', function () {

		POST('./getAddr?'
			 + 'f=' + whoami.val(), {}, function (res) {
			log(res);
			log('取得地址');

			// 觸發更新帳戶資料
			//whoamiButton.trigger('click')


		}, function (res) {

			/*
			log(res.responseText
			.replace(/\<br\>/g, '\n')
			.replace(/\&nbsp;/g, ' '));
			 */
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('請檢查帳戶及銀行合約餘額');
		})
	})

	$('#addCandidate').on('click', function () {

		POST('./addCandidate?'
			 + 'f=' + whoami.val()
			 + '&candAddr=' + $('#candAddr').val()
			 + '&description=' + $('#description').val(), {}, function (res) {
			log(res);
			log('候選人新增成功');

			// 觸發更新帳戶資料
			//whoamiButton.trigger('click')


		}, function (res) {

			/*
			log(res.responseText
			.replace(/\<br\>/g, '\n')
			.replace(/\&nbsp;/g, ' '));
			 */
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('請檢查帳戶及銀行合約餘額');
		})
	})

	$('#changeMembership').on('click', function () {

		POST('./changeMembership?'
			 + 'f=' + whoami.val()
			 + '&targetMember=' + $('#targetMember').val()
			 + '&memberName=' + $('#memberName').val()
			 + '&canVote=' + $('#canVote').val(), {}, function (res) {
			log(res);
			log('候選人新增成功');

			// 觸發更新帳戶資料
			//whoamiButton.trigger('click')


		}, function (res) {

			/*
			log(res.responseText
			.replace(/\<br\>/g, '\n')
			.replace(/\&nbsp;/g, ' '));
			 */
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('請檢查帳戶及銀行合約餘額');
		})
	})

	//vote


	$('#vote').on('click', function () {

		POST('./vote?'
			 + 'f=' + whoami.val()
			 + '&candidateNumber=' + $('#candidateNumber').val()
			 + '&comment=' + $('#comment').val(), {}, function (res) {
			log(res);
			log('投票成功');

			// 觸發更新帳戶資料
			//whoamiButton.trigger('click')


		}, function (res) {

			/*
			log(res.responseText
			.replace(/\<br\>/g, '\n')
			.replace(/\&nbsp;/g, ' '));
			 */
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('請檢查帳戶及銀行合約餘額');
		})
	})

	$('#checkCandidate').on('click', function () {

		POST('./checkCandidate?'
			 + 'f=' + whoami.val()
			 + '&candidateNumber=' + $('#candidateNumber').val(), {}, function (res) {
			log(res);
			log('候選人新增成功');

			// 觸發更新帳戶資料
			//whoamiButton.trigger('click')


		}, function (res) {

			/*
			log(res.responseText
			.replace(/\<br\>/g, '\n')
			.replace(/\&nbsp;/g, ' '));
			 */
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('請檢查帳戶及銀行合約餘額');
		})
	})

})
