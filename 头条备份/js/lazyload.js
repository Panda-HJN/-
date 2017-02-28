var $hidden = $('#hidden') //懒加载的定位点 
var $closeBtns //所有的X 每次调用都要重选

var curPage = 0 //一组十个
var imgCount = 6





//获得新闻的数据
function getNews() {
    console.log(curPage)
    $.ajax({
        type: "get",
        url: "http://platform.sina.com.cn/slide/album_tech",
        dataType: "jsonp",
        jsonp: "jsoncallback",
        async: true,
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
    })

}

//每渲染一次就要更新一次
function itemRunder(json) {
    var tpl = ''
    console.log(curPage)

    for(let i = 0; i < imgCount; i++){
            tpl = tpl + '<div class="item"><div class="item-img">' +
                '<a href="' + json.data[i].url + '"><img src="' + json.data[i].img_url +
                '" alt=""></a></div>' + '<div class="item-news"><div class="item-news-title">' +
                '<a href="' + json.data[i].url + '"><h2>' + json.data[i].name +
                '</h2></a></div><div class="item-news-info"> <div class="item-source"><span class="source">新浪</span><a href="' +
                json.data[i].cmnt_url + '" class="comment">评论</a></div><div class="close-news"><span>不感兴趣</span><span>X</span></div></div> </div></div>'
        }


    // if (!curPage % 2) {
    //     for (let i = 0; i < imgCount; i++) {
    //         tpl = tpl + '<div class="item"><div class="item-img">' +
    //             '<a href="' + json.data[i].url + '"><img src="' + json.data[i].img_url +
    //             '" alt=""></a></div>' + '<div class="item-news"><div class="item-news-title">' +
    //             '<a href="' + json.data[i].url + '"><h2>' + json.data[i].name +
    //             '</h2></a></div><div class="item-news-info"> <div class="item-source"><span class="source">新浪</span><a href="' +
    //             json.data[i].cmnt_url + '" class="comment">评论</a></div><span class="close-news ">x</span></div> </div></div>'
    //     }
    // } else {
    //     for (let i = 0; i < imgCount; i++) {
    //         tpl = tpl + '<div class="item">' +
    //             '<div class="item-news">' +
    //             ' <div class="item-news-title">' +
    //             '<a href="' + json.data[i].url + '"><h2>' + json.data[i].name + '</h2></a></div>' +
    //             '<div class="item-news-info">' +
    //             '<span class="close-news ">x</span>' +
    //             '<div class="item-source"><span class="source">新浪</span><a href="' + json.data[i].url +
    //             '" class="comment">评论</a></div>' +
    //             '</div></div> <div class="item-img"><a href="' + json.data[i].url + '"><img src="' + json.data[i].img_url + '" alt=""></a></div></div>'
    //     }

    // }
    $('#hidden').before(tpl)
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
        getNews()
    }
    return
})



/*dom 结构
<div class="item">
                <div class="item-img">
                    <a href=""><img src="" alt=""></a>
                </div>
                <div class="item-news">
                    <div class="item-news-title">
                        <a href="">
                            <h2>titletitletitletitletitletitletitle</h2>
                        </a>
                    </div>
                    <div class="item-news-info">
                        <div class="item-source"><span class="source">新浪</span><a href="" class="comment">评论</a></div>
                        <span class="close-news ">x</span>
                    </div>
                </div>
            </div> 
            <div class="item">
                <div class="item-news">
                    <div class="item-news-title">
                        <a href="">
                            <h2>titletitletitletitletitletitletitle</h2>
                        </a>
                    </div>
                    <div class="item-news-info">
                        <span class="close-news ">x</span>
                        <div class="item-source"><span class="source">新浪</span><a href="" class="comment">评论</a></div>             
                    </div>
                </div>
                <div class="item-img">
                    <a href=""><img src="" alt=""></a>
                </div>
            </div>*/
getNews()