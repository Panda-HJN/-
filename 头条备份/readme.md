## 说明
这个项目模仿了今日头条的首页.使用了Flex 进行布局.   

- 在这个项目中使用了如下API
1. 百度搜索:`suggestion.baidu.com/su`.   
2. 天气信息:`http://api.jirengu.com/weather.php`.   
3. 新浪新闻:``. 

- 使用 JavaScript 实现的效果有

1. 新闻内容懒加载. 
2. 左侧导航栏stickUp效果. 
3. 右侧搜索框的智能提示.
4. 中间区域的可切换模态框. 

- 计划添加
在右下角添加回到顶部功能

## Bug记录与心得记录

1. 引入了 normalize.css . a ul ol 的样式依然需要还需要重置. normalize.css 只是解决了基础样式的跨浏览器一致性.
2. require.js 原理 类似JSONP.不断地创建script标签 并把url赋值给src属性. 这次使用webpack来打包
3. 2017年第一次 愚蠢的把 相等判断`==`写成了赋值`=`.
4. flex 搭配 vh vw 让布局工作变得轻松很多.
5. 关于`jsonp`.遇到了这样的一个bug. 智能提示功能正常工作,返回的script 也是预期的`getData(...)`. 
可是回调函数却一直跳到`fail`. 打印了 fail的arguments.显示parseerror 和 jsonp3484... is not call   
review 代码后发现错误在于
  - $.ajax()的参数   jsonpCallback:'getData'. 大小写写错了.这个键值对变成了无用的.jquery 认为函数名没被指定,所以就 自动生成了一个
  jquery348411.....
但是,百度的这个api 有个必填的参数 wd: 返回的函数名. 具体返回的函数是由这个wd的值决定的.
所以返回了预期的script 但是不是jquery自动生成的.jquery就认为请求失败了,回调函数就跳到了fail.