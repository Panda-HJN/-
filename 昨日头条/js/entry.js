//添加stickUp效果
$("nav").stickup()
$("#copyright").stickup()
//首屏图片渲染
$("#imgNav").each(function () {
    new ImgTabs($(this))
})
var $imgNavBoxs = $('.img-nav-box') //
$.ajax({
    type: "get",
    url: "http://platform.sina.com.cn/slide/album_tech",
    dataType: "jsonp",
    jsonp: "jsoncallback",
    async: true,
    data: {
        app_key: '1271687855',
        num: 18, //每页有几
        page: 50 //当前页数
    }
}).done(function (json) {
    if (json.status === 0 || json.status.code === "0") {
        for (let i = 0; i < 6; i++) {
            $imgNavBoxs.eq(i).children("img")[0].src = json.data[i].img_url
            $imgNavBoxs.eq(i).children("h2").text(json.data[i].name)
        }
    }
}).fail(function(){
	console.log(arguments)
})

//goto top

	var aa =	(function() {
			var $goTop = $('<div id="go-top"><i class="fa fa-angle-up" aria-hidden="true"></div>')
			$("body").append($goTop)
			$(window).on('scroll', function(event) {
				var offsetTop = $('body').scrollTop()
					// scrollTop([val])
					// 获取匹配元素相对滚动条顶部的偏移。
					// 即
					// 此方法对可见和隐藏元素均有效。
				if (offsetTop > 100) { //如果offsetTop值大于100px 则展示  回到顶部按钮
					$goTop.show()
				} else {
					$goTop.hide() //否则 隐藏
				}
			})
			$goTop.on('click', function() { //点击则跳转到顶部
				$(window).scrollTop(0)
			})
		})()