function ImgTabs($tabs) {
    this.currentIdx = 0;
    this.$lis = $tabs.find("ul.imgNavRight>li")
    this.$boxs = $tabs.find(".imgNavLeft>div")
    this.bindEvent()
    this.autoChange()
}
ImgTabs.prototype.bindEvent = function () {
    var that = this
    this.$lis.on("mouseenter", function () {
        $this = $(this)
        var idx = $this.index()
        that.change(idx)
    })
}
ImgTabs.prototype.change = function (idx) {

    this.currentIdx = idx
    this.$lis.eq(idx).addClass("active").siblings().removeClass("active")
    this.$boxs.eq(idx).addClass("active").siblings().removeClass("active")

}
ImgTabs.prototype.autoChange = function () {
    var that = this
    setInterval(function () {
        console.log(that.currentIdx)
        if (that.currentIdx == 5) {
            that.currentIdx = -1
        }
        that.change(that.currentIdx + 1)
    }, 3000)
}

$("#imgNav").each(function () {
    new ImgTabs($(this))
})