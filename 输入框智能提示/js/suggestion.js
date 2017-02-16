	/*<form id="form" action="http://www.baidu.com/s" method="get" accept-charset="utf-8" name="myForm">
			<input id="input_search" type="text"  autocomplete="off" maxlength="100" name="wd" onkeyup="keyEvent(event);">
			<div id="suggestion-ct">
				<ul id="suggestions-ul"></ul>
			</div>
		</form>*/

	var inputField = document.forms["myForm"].input_search;
	var suggestionDiv = document.getElementById("suggestion-ct");
	var suggestionsUl = document.getElementById("suggestions-ul");
	var suggestionLi = null;

	function clearSuggestions() {
		for (var i = suggestionsUl.childNodes.length - 1; i >= 0; i--)
			suggestionsUl.removeChild(suggestionsUl.childNodes[i]);
		suggestionDiv.className = "hide";
	}

	function setSuggestions(the_suggestions) { // 动态生成suggestion下拉框
		clearSuggestions(); // 每输入一个字符就先清除原先的提示
		suggestionDiv.className = "show";
		for (var i = 0; i < the_suggestions.length; i++) { // 将匹配的提示结果逐一显示给用户
			suggestionLi = document.createElement("li");
			suggestionsUl.appendChild(suggestionLi);
			suggestionLi.appendChild(document.createTextNode(the_suggestions[i]));
			mouseEvent(); // 对每个<li>触发鼠标事件
		}
	}

	function mouseEvent() {
		suggestionLi.onmouseover = function () {
			this.className = "mouseOver"; // 鼠标经过时高亮
		}
		suggestionLi.onmouseout = function () {
			this.className = "mouseOut"; // 离开时恢复原样
		}
		suggestionLi.onclick = function () { // 用户点击某个匹配项时清除提示框
			clearSuggestions();
		}
	}

	function fillUrls() {
		var strdomin = $.trim($("#input_search").val());
		var queryData = {
			'wd': strdomin,
			'p': '3',
			'cb': 'findSuggestions',
			't': new Date().getTime().toString()
		}
		$.ajax({
			async: false,
			url: "http://suggestion.baidu.com/su",
			type: "GET",
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			data: queryData,
			timeout: 800,
			// success: function (json) {
			// },
			// error: function (xhr) {
			//     console.log(xhr);
			// }
		});
	}

					function assemble(resData){
					var tpl = ''
					for (var i = 0;i<resData.length;i++) {
						tpl += '<li class="item">'
						tpl += '<a href="'+ resData[i].url +'" class="link"><img src="' + resData[i].img_url +'"/></a>'
						tpl += '<h4 class="item-header">'+resData[i].short_name +'</h4>'
						tpl += '<p class="description">'+resData[i].short_intro+'</p>'+'</li>'
						//执行一次变得到一组字符串形式的 li
					}
					var $tpl=$(tpl)//此时的tpl 是多组li 拼在一起的字符串
					$('#item-ct li:last').before($tpl)
					return $tpl
				}



	function findSuggestions(strurls) {
		var aResult = []; // 用于存放匹配结果
		console.dir(strurls);
		var urls = strurls.s; //各项放在这里


		if (inputField.value.length > 0) {
			for (var i = 0; i < urls.length; i++) { // 从数据源中找匹配的数据
				if (urls[i].indexOf(inputField.value) == 0) {
					aResult.push(urls[i]); // 压入结果
				}
			}
			if (aResult.length > 0) // 如果有匹配的数据则显示出来
				setSuggestions(aResult);
		} else {
			clearSuggestions(); // 此步用作用户输入（Backspace健）将输入框清除完时的处理
			inputField.onblur = function () {
				clearSuggestions(); // 输入框失去焦点时，清除suggestion下拉提示框
			}
			inputField.onfocus = function () { // 输入框获取焦点时，显示suggestion内容
				if (aResult.length > 0)
					setSuggestions(aResult);
			}
		}

	}


	var selectedSuggestion = -1; // 索引值

	function moveUp(suggestionNodes) {
		suggestionNodes.eq(selectedSuggestion).css("background-color", "white"); //先将上面一个<li>变成白色
		selectedSuggestion++; // 每向下移一位，selectedSuggestion就+1
		if (selectedSuggestion == suggestionNodes.length) {
			selectedSuggestion = 0; //如果索引值变成suggestionNodes.length，则将索引值指向第一个元素
		}
		//console.log(selectedSuggestion);
		suggestionNodes.eq(selectedSuggestion).css("background-color", "#ebebeb"); //再将下面一个<li>变成灰色
		var comText = suggestionNodes.eq(selectedSuggestion).text();
		$("#input_search").val(comText); //向输入框赋值
	}

	function moveDown(suggestionNodes) {
		suggestionNodes.eq(selectedSuggestion).css("background-color", "white"); //先将下面一个<li>变成白色
		selectedSuggestion--; // 每向上移一位，selectedSuggestion就-1
		if (selectedSuggestion == -1) {
			selectedSuggestion = suggestionNodes.length - 1; //如果索引值变成-1，则将索引值指向最后一个元素
		}
		//console.log(selectedSuggestion);
		suggestionNodes.eq(selectedSuggestion).css("background-color", "#ebebeb"); //再将上面一个<li>变成灰色
		var comText = suggestionNodes.eq(selectedSuggestion).text();
		$("#input_search").val(comText); //向输入框赋值	
	}

	$("#input_search").on('keyup', function (event) {
		keyEvent(event)
	})



	function keyEvent(event) {
		console.log(event)
		var myEvent = event
		var keyCode = myEvent.keyCode;
		var suggestionNodes = $("#suggestion-ct").children("ul").children("li");
		//console.log(keyCode);
		if (keyCode == 40) { // 向下
			moveUp(suggestionNodes);
		} else if (keyCode == 38) { //向上
			moveDown(suggestionNodes);
		} else {
			fillUrls(); //加载下拉列表
			selectedSuggestion = -1; // 同时将selectedSuggestion调整为初始值-1
		}
	}