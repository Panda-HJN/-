var $hidden = $('#hidden') //懒加载的定位点 
var $closeBtns //所有的 X 每次调用都要重选

var curPage = 2
var imgCount = 6

var lock = false

getNews()

//获得新闻的数据
function getNews() {
    lock = true

    $.ajax({
        type: "get",
        url: "http://platform.sina.com.cn/slide/album_tech",
        dataType: "jsonp",
        jsonp: "jsoncallback",
        async: false,
        data: {
            app_key: '1271687855',
            num: imgCount,
            page: curPage //第几页
        }
    }).done(function (json) {
        if (json.status === 0 || json.status.code === "0") {
            itemRunder(json)
            curPage++
        }
    }).fail(function () {
        console.log(arguments)
    })
}

//每渲染一次就要更新一次
function itemRunder(json) {
    // lock = true
    var tpl = ''

    for (let i = 0; i < imgCount; i++) {
        let url = json.data[i].url
        tpl = tpl + '<div class="item">' + '<div class="item-img">' +
            '<a href="' + json.data[i].url + '">' +
            '<img src="' + json.data[i].img_url + '" alt="">' +
            '</a></div>' + '<div class="item-news"><div class="item-news-title">' +
            '<a href="' + json.data[i].url + '"><h3>' + json.data[i].name +
            '</h3></a></div><div class="item-news-info"> <div class="item-source"><span class="source">新浪</span><a href="' +
            json.data[i].cmnt_url + '" class="comment">评论</a></div><div class="close-news"><span>不感兴趣</span><span>X</span></div></div> </div></div>'
    }





    var $loadMore = $('<div id="load-more"><div><div class="load1"></div><div class="load2"></div><div class="load3"></div><div class="load4"></div></div></div>')


    $hidden.after($loadMore) 
    var $nodes = $(tpl)

    $nodes.find('img').on('load', function () {
        var loadMores = document.querySelectorAll("#load-more")
        for(let i =0;i<loadMores.length;i++){
            loadMores[i].remove()
        }
        $hidden.before($nodes)      
        $hidden.after($loadMore)
        setTimeout(function () {
            lock = false
        }, 800 )

    })

    //每渲染一次就要更新一次 X的集合和为之绑定的事件
    $closeBtns = $('.close-news') //更新 X 按钮
    $closeBtns.on('click', function (event) {
        closeNews(event)
    })
}

//关闭这条新闻
function closeNews(event) {
    $(event.target).parents('.item').remove()
    $closeBtns = $('.close-news')
}



function isShow($e) {
    var scrollH = $(window).scrollTop(), //获取窗口的scrollTop
        winH = $(window).height(), //获取窗口高度
        top = $e.offset().top //获取元素高度的偏移值

    if (top < winH + scrollH) { //有上述三个值判定是否要加载图片
        return true
    } else {
        return false
    }
}

$(window).on('scroll', function () {
    if (isShow($('div.item').last())) {
        if (lock === false) {
            getNews()
        }
        return

    }
    return
})