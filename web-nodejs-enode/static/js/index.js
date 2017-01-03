var contractAddressH5 = $('#contractAddressH5');

var whoami;
var whoamiButton;
var deposit;
var depositButton;
var withdraw;
var withdrawButton;
var transferTo;
var transferEtherValue;
var transferButton;
var ethBalance;
var bankBalance;
var logger;

//------------------------------------------------------------
function log(input) {
	if (typeof input === 'object') {
		input = JSON.stringify(input, null, 2)
	}
	logger.html(input + '\n' + logger.html())
}

//------------------------------------------------------------
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

//------------------------------------------------------------

// 載入網頁之後
$(function () {

	whoami = $('#whoami');
	whoamiButton = $('#whoamiButton');
	deposit = $('#deposit');
	depositButton = $('#depositButton');
	withdraw = $('#withdraw');
	withdrawButton = $('#withdrawButton');
	transferTo = $('#transferTo');
	transferEtherValue = $('#transferEtherValue');
	transferButton = $('#transferButton');
	logger = $('#logger');
	ethBalance = $('#ethBalance');
	bankBalance = $('#bankBalance');

	//------------------------------------------------------------
	//初始化
	//------------------------------------------------------------

	GET('./accounts',
		function (res) {
		for (var k in res) {

			if (k == 0) {
				whoami.append('<option value="' + res[k] + '">' + k + '. ' + res[k] + '</option>');
			} else {

				$('#candAddr').append('<option value="' + res[k] + '">' + k + '. ' + res[k] + '</option>');
				$('#targetMember').append('<option value="' + res[k] + '">' + k + '. ' + res[k] + '</option>');
			}

		}
	}, function (res) {
		log('使用者載入錯誤')
	})

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
	/*
	log(res.responseText
	.replace(/\<br\>/g, '\n')
	.replace(/\&nbsp;/g, ' '));
	 */
	$('#changeVotingState').on('click', function () {

		POST('./changeVotingState?'
			 + 'f=' + whoami.val()
			 + '&flag=' + $("input[name='flag']:checked").val(), {}, function (res) {

			if (res.toLowerCase() === 'true') {
				$('#changeVotingState-message').html("狀態：開啟");
			} else {
				$('#changeVotingState-message').html("狀態：關閉");
			}

		}, function (res) {
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
		})
	})

	$('#getAddr').on('click', function () {

		POST('./getAddr?'
			 + 'f=' + whoami.val(), {}, function (res) {

			$('#getAddr-message').html('' + res);
		}, function (res) {
			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
		})
	})

	$('#addCandidate').on('click', function () {

		POST('./addCandidate?'
			 + 'f=' + whoami.val()
			 + '&candAddr=' + $('#candAddr').val()
			 + '&description=' + $('#description').val(), {}, function (res) {

			var josn;
			var object;
			if (typeof res === 'object') {
				json = JSON.stringify(res, null, 2);
			}

			object = jQuery.parseJSON(json);

			$('#addCandidate-message').html("新增成功：<br/>"
				 + "txhash:" + object.txhash + "<br/>"
				 + "candAddr:" + object.candAddr + "<br/>"
				 + "timestamp:" + object.timestamp + "<br/>");

			$('#candidateNumber').append('<option value="' + $('select#candidateNumber option').length + '">'
				 + $('#description').val() + '. ' + object.candAddr
				 + '</option>');
			$('#memAddr').append('<option value="' + $('select#memAddr option').length + '">'
				 + $('#description').val() + '. ' + object.candAddr
				 + '</option>');

			$("#candAddr option[value='" + $('#candAddr').val() + "']:selected").remove();
			$('#description').val('');

		}, function (res) {

			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('addCandidate:error');
		})
	})

	$('#changeMembership').on('click', function () {

		POST('./changeMembership?'
			 + 'f=' + whoami.val()
			 + '&targetMember=' + $('#targetMember').val()
			 + '&memberName=' + $('#memberName').val()
			 + '&canVote=' + $('#canVote').val(), {}, function (res) {

			var josn;
			var object;
			if (typeof res === 'object') {
				json = JSON.stringify(res, null, 2);
			}

			object = jQuery.parseJSON(json);

			$('#changeMembership-message').html("新增成功：<br/>"
				 + "txhash:" + object.txhash + "<br/>"
				 + "memAddr:" + object.memAddr + "<br/>"
				 + "flag:" + object.flag + "<br/>");

			$('#Member').append('<option value="' + object.memAddr + '">'
				 + $('#memberName').val() + '. ' + object.memAddr
				 + '</option>');

			$("#targetMember option[value='" + $('#targetMember').val() + "']:selected").remove();
			$('#memberName').val('');

		}, function (res) {

			//var jsonResponse = JSON.parse(req.responseText);
			//log(jsonResponse);
			log('請檢查帳戶及銀行合約餘額');
		});
	});

	$('#vote').on('click', function () {

		POST('./vote?'
			 + 'f=' + $('#Member').val()
			 + '&candidateNumber=' + $('#memAddr').val()
			 + '&comment=' + $('#comment').val(), {}, function (res) {
			log(res);
			log('投票成功');

			// 觸發更新帳戶資料
			//whoamiButton.trigger('click')


		}, function (res) {

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
