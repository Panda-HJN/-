//添加stickUp效果
$("nav").stickup()

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
    console.log(json)
    if (json.status === 0 || json.status.code === "0") {
        for (let i = 0; i < 6; i++) {
            $imgNavBoxs.eq(i).children("img")[0].src = json.data[i].img_url
            $imgNavBoxs.eq(i).children("h2").text(json.data[i].name)
        }
    }
})