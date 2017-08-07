/*
	The data for the page layout is stored using JSON. The format is an
	Array of iframe layouts which includes the following:

Customized calendar from investing.com
Build it here: https://www.investing.com/webmaster-tools/economic-calendar
or use this one
	https://sslecal2.forexprostools.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_employment,_economicActivity,_inflation,_centralBanks,_confidenceIndex,_balance&importance=2,3&features=datepicker,timezone&countries=25,6,37,72,22,17,10,35,43,26,12,4,5&calType=day&timeZone=6&lang=1
*/

$(document).ready( function () {
	storedjsonData = getData();
	buildPage( storedjsonData);
	currencyConversions = getAllConversions();
});

function getData() {
	storedjsonData = JSON.parse( localStorage.getItem( 'FXTDashboard2'));
	if (storedjsonData === null) {
		storedjsonData = {pageTitle: 'Forex Dashboard', backgroundColor: 'lightgreen',
			iframes: [
				{row:1, column:1, heading: 'ForexLive.com', uri: 'http://www.forexlive.com', height: 900, width: 411, display: true}
				,{row:1, column:2, heading: 'Economic Calendar', uri: 'https://sslecal2.forexprostools.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_employment,_economicActivity,_inflation,_centralBanks,_confidenceIndex,_balance&importance=2,3&features=datepicker,timezone&countries=25,6,37,72,22,17,10,35,43,26,12,4,5&calType=day&timeZone=6&lang=1', height: 900, width: 411, display: true}
				,{row:1, column:3, heading: 'Open Currency Positions', uri: 'https://market24hclock.com/Technical/Forex-Open-Positions', height: 700, width: 411, display: true}
				,{row:2, column:1, heading: 'FXChoice Trade Account', uri: 'https://my.myfxchoice.com/webterminal', height: 700, width: 624, display: true}
				,{row:2, column:2, heading: 'FXChoice Trade Account', uri: 'https://my.myfxchoice.com/webterminal', height: 700, width: 624, display: true}
				,{row:3, column:1, heading: 'Cashback Forex', uri: 'https://www.cashbackforex.com/en-us/dashboard.aspx', height: 700, width: 700, display: true}
				,{row:3, column:2, heading: 'Trade School Chat', uri: 'https://secureonlinedaytradinguniversity.com/chat-room', height: 700, width: 548, display: true}
				]};
	}
	return( storedjsonData);
}

window.onresize = function() {
	let wdwSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let threeAcross = ((wdwSize - 70) / 3).toFixed(0);
	let twoAcross = ((wdwSize - 55) / 2).toFixed(0);
	let oneAcross = (wdwSize - 40).toFixed(0);
	document.getElementById('sizeRecommends').innerHTML = 'Recommended width for 1 column: ' + oneAcross + '.<br/>Recommended width for 2 columns: ' + twoAcross + '<br/>Recommended width for 3 columns: ' + threeAcross;
};

function buildPage( jsonData) {
	document.getElementById('pageTitle').innerHTML = jsonData.pageTitle;
	document.getElementById('editPageTitle').value = jsonData.pageTitle;
	document.getElementById('backgroundColor').value = jsonData.backgroundColor;
	document.getElementById( 'colorSample').style.backgroundColor = jsonData.backgroundColor;

	// Go through the internal styles and set the background color of the heading and calulators
	// to the selected color.
	var ss = document.styleSheets;
	for (var s=0; s<ss.length; s++) {
		if (ss[s].href === null) { // internal css
			for (var c=0; c < ss[s].cssRules.length; c++) {
				if (ss[s].cssRules[c].selectorText === '.flex-heading' || ss[s].cssRules[c].selectorText === '.flex-calculator') {
					ss[s].cssRules[c].style.backgroundColor = jsonData.backgroundColor;
				}
			}
		} 
	}

	var alliframes = document.getElementById('alliframes');
	// Initialize alliframes div for rebuild
	let e = alliframes.querySelectorAll( '#iframeSection0, #iframeSection1, #iframeSection2, #iframeSection3, #iframeSection4, #iframeSection5, #iframeSection6, #iframeSection7, #iframeSection8, #iframeSection9, #iframeSection10, hr');
	if (e.length > 0) {
		for (i = 0; i < e.length; i++) {
			alliframes.removeChild( e[i]);
		}
	}

	// Remove the edit page items so they can be rebuilt.
	var editiframes = document.getElementById('editiframes');
	e = editiframes.querySelectorAll( 'div, hr');
	if (e.length > 0) {
		for (i = 0; i < e.length; i++) {
			try {
				editiframes.removeChild( e[i]);
			} catch (err) {}
		}
	}

	let editSizes = document.createElement('div');
	editSizes.classList.value = 'flex-container';
	editSizes.id = 'sizeRecommends';
	let wdwSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let threeAcross = ((wdwSize - 70) / 3).toFixed(0);
	let twoAcross = ((wdwSize - 55) / 2).toFixed(0);
	let oneAcross = (wdwSize - 40).toFixed(0);
	editSizes.innerHTML = 'Recommended width for 1 column: ' + oneAcross + '.<br/>Recommended width for 2 columns: ' + twoAcross + '<br/>Recommended width for 3 columns: ' + threeAcross;
	editiframes.appendChild( editSizes);

	var iframeData = jsonData.iframes;
	// Loop through the data and build the iframe sections

	// Create an array of rows. Each row has an array of column objects.
	let rows = [ {columns: [{row:1,column:1},{row:1,column:2},{row:1,column:3}]},{columns:[{row:2,column:1},{row:2,column:2},{row:2,column:3}]},{columns:[{row:3,column:1},{row:3,column:2},{row:3,column:3}]}];
	for (let d = 0; d < iframeData.length; d++) {
		rows[iframeData[d].row-1].columns[iframeData[d].column-1] = iframeData[d];
	}

	for (let r=0; r < rows.length; r++) {
		// Create div element for new iframe section.
		var newiframe = document.createElement('div');
		newiframe.id = 'iframeSection' + r;
		newiframe.classList.value = 'flex-container'

		// Loop through the columns in the row and add each ifram item
		for (let c=0; c<rows[r].columns.length; c++) {
			if (Object.keys(rows[r].columns[c]).length != 0) {
				if ( rows[r].columns[c].display) {

			// Add the iframes to the page
					let item = document.createElement('div');
					item.classList.value = 'flex-item';
					// item.style = 'border: 3px solid gray;';

					let hdg = document.createElement('h4');
					//hdg.classList.value = 'editShow';
					hdg.innerHTML = rows[r].columns[c].heading;

					colElem = document.createElement( 'input');
					colElem.type = 'button';
					colElem.value = 'Reload';
					colElem.title = 'Reload this page only';
					colElem.style = "float: right; margin-right: 5px;"
					colElem.onclick = function() {reloadiframe('iframe' + r + c);}
					hdg.appendChild( colElem);

					let ifm = document.createElement('iframe');
					ifm.classList.value = 'editShow';
					ifm.name = 'iframe' + r + c;
					ifm.id = 'iframe' + r + c;
					ifm.src = rows[r].columns[c].uri;
					ifm.height = rows[r].columns[c].height;
					ifm.width = rows[r].columns[c].width;

					item.appendChild( hdg);
					item.appendChild( ifm);
					newiframe.appendChild( item);
				}
			}
			var editiframe = document.createElement('div');
			editiframe.classList.value = 'flex-container'
			editiframe.appendChild( addiframeEdit( rows[r].columns[c]));
			editiframes.appendChild( editiframe);
		}

		if (newiframe.childElementCount > 0) {
			let hr = document.createElement('hr');
			hr.style = "border-width: 1px; border-color: blue; 	margin-bottom: 0; padding-bottom: 10px;";
			alliframes.appendChild( newiframe);
			alliframes.appendChild( hr);
		}
	}
}

function addiframeEdit( iframeData) {
	let item = document.createElement('div');
	let flexElem;

	// Row
	flexElem = document.createElement( 'label');
	flexElem.innerHTML = 'Row:&nbsp';
	item.appendChild(flexElem);

	flexElem = document.createElement( 'span');
	flexElem.id = 'row';
	flexElem.innerHTML = iframeData.row;
	item.appendChild(flexElem);

	// Column
	flexElem = document.createElement( 'label');
	flexElem.innerHTML = '&nbsp;&nbsp;Column:&nbsp';
	item.appendChild(flexElem);

	flexElem = document.createElement( 'span');
	flexElem.id = 'column';
	flexElem.innerHTML = iframeData.column;
	item.appendChild(flexElem);

	// Heading
	flexElem = document.createElement( 'label');
	flexElem.innerHTML = '&nbsp;&nbsp;Heading:&nbsp';
	item.appendChild(flexElem);

	flexElem = document.createElement( 'input');
	flexElem.type = 'text';
	flexElem.id = 'heading';
	flexElem.value = iframeData.heading ? iframeData.heading: '';
	item.appendChild(flexElem);

	// URI
	flexElem = document.createElement( 'label');
	flexElem.innerHTML = '&nbsp;&nbsp;URI:&nbsp';
	item.appendChild(flexElem);

	flexElem = document.createElement( 'input');
	flexElem.type = 'text';
	flexElem.id = 'uri';
	flexElem.value = iframeData.uri ? iframeData.uri: '';
	flexElem.size = '60';
	item.appendChild(flexElem);

	// Height
	flexElem = document.createElement( 'label');
	flexElem.innerHTML = '&nbsp;&nbsp;Height:&nbsp';
	item.appendChild(flexElem);

	flexElem = document.createElement( 'input');
	flexElem.type = 'number';
	flexElem.id = 'height';
	flexElem.value = iframeData.height;
	flexElem.min = '400';
	flexElem.max = '2000';
	item.appendChild(flexElem);

	// Width
	flexElem = document.createElement( 'label');
	flexElem.innerHTML = '&nbsp;&nbsp;Width:&nbsp';
	item.appendChild(flexElem);

	flexElem = document.createElement( 'input');
	flexElem.type = 'number';
	flexElem.id = 'width';
	flexElem.value = iframeData.width ? iframeData.width: '';
	flexElem.min = '400';
	flexElem.max = '1900';
	item.appendChild(flexElem);

	// Display?
	flexElem = document.createElement( 'label');
	flexElem.setAttribute( 'for', 'display' + iframeData.row + iframeData.column); 
	flexElem.innerHTML = '&nbsp;&nbsp;Display?&nbsp';
	item.appendChild(flexElem);

	flexElem = document.createElement( 'input');
	flexElem.type = 'checkbox';
	flexElem.id = 'display' + iframeData.row + iframeData.column;
	flexElem.checked = iframeData.display ? iframeData.display: false;
	item.appendChild(flexElem);
//====
	return( item);
}

function reloadiframe( id) {
	document.getElementById(id).src = document.getElementById(id).src;
}

function toggleEdit() {
	var buttonText = $("#toggleEdit").val();
	if (buttonText.substring(0,4) === 'Edit') {
		$("#toggleEdit").val( "Save Content");
		document.getElementById('editPageTitleDiv').classList.remove( 'editHide');
		let editiframeDiv = document.getElementById( "editiframes");
		editiframeDiv.classList.remove('editHide');
		let alliframesDiv = document.getElementById( "alliframes");
		alliframesDiv.classList.value = 'editHide';
		let div = document.getElementById( "calculatorHeading");
		div.classList.value = 'editHide';
		div = document.getElementById( "calculators");
		div.classList.value = 'editHide';

	} else {
		$("#toggleEdit").val( "Edit Content");
		let temp = document.getElementById('editPageTitleDiv').classList;
		temp.add( 'editHide');
		let editiframeDiv = document.getElementById( "editiframes");
		editiframeDiv.classList.value = 'editHide';
		let alliframesDiv = document.getElementById( "alliframes");
		alliframesDiv.classList.remove( 'editHide');
		let div = document.getElementById( "calculatorHeading");
		div.classList.value = 'flex-container';
		div = document.getElementById( "calculators");
		div.classList.value = 'flex-container';
		saveContent();
	}
}

function saveContent() {
	jsonData = buildJSON();
	localStorage.setItem( 'FXTDashboard2', JSON.stringify( jsonData));
	buildPage( jsonData);
}

// build the JSON data from info in the page.
function buildJSON () {
	var inputs = document.querySelectorAll( "input,span");

	// Loop through edited values and save them into JSON object.
	var jsonData = {};
	jsonData.pageTitle = document.getElementById( 'editPageTitle').value;
	jsonData.backgroundColor = document.getElementById('backgroundColor').value;
	jsonData.iframes = [];
	// heading, uri, height, width
	let iframe = {};
	for ( var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.id === 'width' || input.id === 'height' || input.id === 'uri' || input.id === 'heading') { // input element
			iframe[ input.id] = input.value;
		}
		if (input.id === 'row' || input.id === 'column') { // input element
			iframe[ input.id] = input.innerHTML;
		}
		if ( input.id === 'display') { // input element
			iframe[ input.id] = input.checked;
		}
		if (input.id === 'display' && iframe.heading !== '') {
			jsonData.iframes.push( iframe);
			iframe = {};
		}
	}
	return jsonData;
}

// Lot Size Calcs
function calcLotSizeAcctRisk() {
	var freeMargin = $('#freeMargin').val();
	var stopPips = $("#stopPips").val();
	var riskPct = $("#riskPct").val() * .01;
	var riskAmt = (freeMargin * riskPct).toFixed(2);
	var pipValue = $("#pipValue").val();

	if (freeMargin > 0 && stopPips > 0 && riskPct > 0 && pipValue > 0) {
		var lotSize = (freeMargin * riskPct) / (stopPips * pipValue);
		$("#calculatedLot").html( lotSize.toFixed(2));
		$('#riskAmt').html( '$' + riskAmt);
	} else {
		$("#calculatedLot").html( '');
		$('#riskAmt').html( '');
	}
	calcProfitPips();
}

function calcProfitPips() {
	var lotSize = $('#calculatedLot').html();
	if (lotSize === "") {
		$("#pipsNeeded").html( "");
		return;
	}
	var freeMargin = $('#freeMargin').val();
	var pipValue = $("#pipValue").val();
	var pctGoal = $('#profitGoalPct').val();
	var dollarGoal = freeMargin * ( pctGoal * .01);

	var pipGoal = (dollarGoal / (pipValue * lotSize)).toFixed(1);
	$("#dollarGoal").html( '$' + dollarGoal.toFixed(2));
	$("#pctText").html( pctGoal);
	$("#pipsNeeded").html( pipGoal);
}

function calcLotSizePOA() {
	var freeMargin = $('#freeMarginPOA').val();
	var acctPct = $("#acctPctPOA").val() * .01;
	var acctAmt = (freeMargin * acctPct).toFixed(2);
	var pipValue = $("#pipValuePOA").val();

	if (freeMargin > 0 && acctPct > 0 && pipValue > 0) {
		var lotSize = (freeMargin * (acctPct*.01)); // / (pipValue / 1);
		$("#calculatedLotPOA").html( lotSize.toFixed(2));
		$('#riskAmtPOA').html( '$' + acctAmt);
	} else {
		$("#calculatedLotPOA").html( '');
		$('#acctAmtPOA').html( '');
	}
	calcProfitPipsPOA();
}

function calcProfitPipsPOA() {
	var lotSize = $('#calculatedLotPOA').html();
	if (lotSize === "") {
		$("#pipsNeededPOA").html( "");
		return;
	}
	var freeMargin = $('#freeMarginPOA').val();
	var pipValue = $("#pipValuePOA").val();
	var pctGoal = $('#profitGoalPctPOA').val();
	var dollarGoal = freeMargin * ( pctGoal * .01);

	var pipGoal = (dollarGoal / (pipValue * lotSize)).toFixed(1);
	$("#dollarGoalPOA").html( '$' + dollarGoal.toFixed(2));
	$("#pctTextPOA").html( pctGoal);
	$("#pipsNeededPOA").html( pipGoal);
}

function calcPriceAvg() {
	document.getElementById( 'paMessage').innerHTML = '&nbsp;';
	let tt = document.getElementById( 'longShort').value;
	let fe = document.getElementById( 'firstEntry').value;
	let pae = document.getElementById( 'avgEntry').value;
	let pips = document.getElementById( 'paDesiredPips').value;
	if (fe < 20) {
		var decPlaces = 5;
		var divisor = 100000;
	} else {
		decPlaces = 3;
		divisor = 1000;
	}

	if (fe != 0 && pae != 0) {
		if (tt === 'Long') {
			var diff = (fe - pae).toFixed( decPlaces);
			var halfway = (Number(pae) + (diff / 2)).toFixed( decPlaces);
			var tpp = (Number(halfway) + ((pips/2) * 10)/divisor).toFixed( decPlaces);
		}
		if (tt === 'Short') {
			diff = (pae - fe).toFixed( decPlaces);
			halfway = (Number(pae) - ( diff / 2)).toFixed( decPlaces);
			tpp = (Number(halfway) - (( pips/2) * 10)/divisor).toFixed( decPlaces);
		}

		document.getElementById( 'priceDifference').innerHTML = diff;
		if (diff < 0) {
			if (tt == 'Long') {
				document.getElementById( 'paMessage').innerHTML = 'Long trade Price Average Entry price must be below First Trade Entry price.';
			} else {
				document.getElementById( 'paMessage').innerHTML = 'Short trade Price Average Entry price must be above First Trade Entry price.';
			}
			halfway = '';
			tpp = '';
		}
		document.getElementById( 'halfway').innerHTML = halfway;
		document.getElementById( 'takeProfit').innerHTML = tpp;
	} else {
		document.getElementById( 'priceDifference').innerHTML = '';
		document.getElementById( 'halfway').innerHTML = '';
		document.getElementById( 'takeProfit').innerHTML = '';

	}
}		

function changeSampleColor( color) {
	document.getElementById( 'colorSample').style.backgroundColor = color;
}

function resetDefaultData() {
	localStorage.removeItem( 'FXTDashboard2');
	storedjsonData = getData();
	buildPage( storedjsonData);
	$("#toggleEdit").val( "Edit Content");
	toggleEdit();
}

function getAllConversions() {
	// Build a list of sybols from the select list.
	var quotePairs = [];
	let opts = document.getElementById('currencyPair').options;
	for (let x = 0; x < opts.length; x++) {
		quotePairs.push( opts[x].value);
	}

	// Call the api to get the conversion rates
  var uri = 'http://api.fixer.io/latest?base=USD&symbols=' + quotePairs.toString();
  var request = new XMLHttpRequest();
  request.open("GET", uri);
  request.onload = function() {
    if(request.status == 200) {
      currencyConversions = JSON.parse( request.responseText).rates;
    }
 	}
  request.send(null);
}

function getCurrencyConversion( quotePair, pipID, rateID) {
	if (quotePair == 'USD') {
		document.getElementById(pipID).value = 10;
		if (pipID === 'pipValuePOA') {
			calcLotSizePOA();
		} else {
			calcLotSizeAcctRisk();
		}
	  document.getElementById( rateID).innerHTML = '1.00';
		return;
	}

  let exchangeRate = currencyConversions[quotePair];
  document.getElementById( rateID).innerHTML = exchangeRate;
	if (quotePair == 'JPY') {
		document.getElementById(pipID).value = (1000 / exchangeRate).toFixed(2);
	} else {
		document.getElementById(pipID).value = (10 / exchangeRate).toFixed(2);
	}
	if (pipID === 'pipValuePOA') {
		calcLotSizePOA();
	} else {
		calcLotSizeAcctRisk();
	}
}