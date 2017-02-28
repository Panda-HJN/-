var userCity = $('.userCity') //user 信息元素
var curCity = $('.userCity').find('.currentCity>span')
var curWeather = $('.userCity').find('.weather>span')
var curTemp = $('.userCity').find('.temperature>span')



$.get('http://api.jirengu.com/weather.php') //设置了 cors 的API 就是省事啊
    .done(function (jsonStr) {
        var json = JSON.parse(jsonStr)
        if (json.error == -2) { 
            userCity.remove()
            $('#tp-weather-widget').removeClass('weather2nd') //如果这个api挂了就执行二号方案
            return
        }
        var city = json.results[0].currentCity //当前城市
         city = city.replace(/市$/,'')
        var temp = json.results[0].weather_data[0].temperature
        var weather = json.results[0].weather_data[0].weather
        curCity.text(city)
        curWeather.text(weather)
        curTemp.text(temp)
    })
    .fail(function () {
        userCity.remove()
        $('#tp-weather-widget').removeClass('weather2nd')
    })

// 备用天气 api