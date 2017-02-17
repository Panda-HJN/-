/* DOM结构是这个样子滴
    <form id="search" action="http://www.baidu.com/s" method="get" accept-charset="utf-8" name="myForm">
        <input type="text" autocomplete="on" maxlength="100" name="wd">
        <div class="suggestion-box">
            <ul class="suggestion-ct">
                <li class="suggestion-item">1</li>
            </ul>
        </div>
    </form>
	*/





var inputBlock = $("#search>input")

var suggestionCt = $('#search ul.suggestion-ct')



var curIndex = -1 //下拉列表中当前被选中的,啥也没选是-1 选中第一个就是0 ......

//绑定

//按键抬起来,我们就得搞点事情
$("#search>input").on('keyup', function (event) {
	//节流函数!! 控制执行次数
	function throttle(method, p, delay) {
		clearTimeout(method.tId)
		method.tId = setTimeout(function () {
			method(p)
		}, delay)
	}
	throttle(keyEvent, event, 200)
})


inputBlock.on('blur',function () {
	console.log("失去焦点")
	suggestionCt.addClass("hide")
	// 输入框失去焦点时，清除suggestion下拉提示框
})

inputBlock.on('focus',function () {
	console.log("获得焦点")
	suggestionCt.removeClass("hide")
	// 输入框失去焦点时，清除suggestion下拉提示框
})



//处理敲键盘的函数
function keyEvent(event) { //参数是事件对象
	let myEvent = event
	let keyCode = myEvent.keyCode;
	let suggestionItems = $(' #search  ul.suggestion-ct>li') //所有的提示li

	if (keyCode == 40) { // 方向键下
		console.log("下")
		moveDown(suggestionItems);
	} else if (keyCode == 38) { //方向键上

		console.log("上")
		moveUp(suggestionItems)
		
	} else { //不是 上下  那就是在输入内容了 
		getSuggestion() //从服务器获取信息
		 // 同时将curIndex调整为初始值-1
	}
}



//处理鼠标的函数
function mouseEvent(event) {

}

function moveUp() {
	var items = suggestionCt.children()

	if(curIndex <= 0){
		curIndex = items.length-1
		items.removeClass("active")
		items.eq(curIndex).addClass("active")
		inputBlock.val(items[curIndex].innerText)
		return
	}
	curIndex --

	
	items.removeClass("active")
	items.eq(curIndex).addClass("active")

	inputBlock.val(items[curIndex].innerText)
}

function moveDown() {
	var items = suggestionCt.children()
	if(curIndex>=(items.length -1)){
		curIndex = 0
		items.removeClass("active")
		items.eq(0).addClass("active")
		inputBlock.val(items[curIndex].innerText)
		return
	}
	curIndex ++
	console.log(curIndex)
	
	items.removeClass("active")
	items.eq(curIndex).addClass("active")
	inputBlock.val(items[curIndex].innerText)
}



function getSuggestion() {
	var inputVal = $.trim(inputBlock.val()) //把输入的内容 两侧的空白去掉
	if (inputVal === "") { //内容为空则不予操作
		return
	}
	var queryData = {
		"wd": inputVal,
		"p": true,
		"cb": 'getData',
		"t": new Date().getMilliseconds().toString()
	}

	$.ajax({
		url: "//suggestion.baidu.com/su",
		type: "GET",
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		data: queryData,
		// timeout: 800,
		// success: function (json) {
		// 	console.log("成功")
		// 	console.log(json)
		// },
		// error: function (obj) {
		// 	console.log("出错了")
		// 	console.log(obj)
		// }
	}).done(function () {
		console.log(1)
	}).fail(function () {
		console.log(arguments)
	})

}

function render(resData) {
	var tpl = ''
	for (var i = 0; i < resData.length; i++) {
		tpl += '<li class="suggestion-item">'
		tpl += resData[i]
		tpl += '</li>'
		//执行一次变得到一组字符串形式的 li
	}
	var $tpl = $(tpl) //此时的tpl 是多组li 拼在一起的字符串
	$('#search ul.suggestion-ct').append($tpl)


	//为新生成li绑定事件
	$("#search li.suggestion-item").on('mouseenter', function (event) {
		console.log(this)
		mouseEvent(event)
	})
	// return $tpl
}

function getData(jsonp) {
	suggestionCt.children().remove() //这里用remove 是为了把绑定上去的事件一并消除
	render(jsonp.s) //渲染生成提示列表
	// var suggestionArr =   jsonp.s
	// var aResult = []; // 用于存放匹配结果
	// var urls = strurls.s;
	// if (inputField.value.length > 0) {
	// 	for (var i = 0; i < urls.length; i++){ // 从数据源中找匹配的数据
	// 		if (urls[i].indexOf(inputField.value) == 0){
	// 			aResult.push(urls[i]); // 压入结果
	// 		} 
	// 	}
	// 	if (aResult.length > 0) // 如果有匹配的数据则显示出来
	// 		setSuggestions(aResult);
	// }else
	// 	clearSuggestions(); // 此步用作用户输入（Backspace健）将输入框清除完时的处理


	// console.dir(strurls)
}