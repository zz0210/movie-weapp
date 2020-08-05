// pages/bookDetails/bookDetails.js
const app = getApp()  //app.js //获取应用实例
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book:{},
    userName:'',
    ellipsis: true,  /*true内容简介收缩，flase简介展开*/
    Zellipsis: true, /*作者*/
    Mellipsis: true  /*目录*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var bookIsbn = options.bookIsbn
    var bookInfo = 'book/isbn/'
    this.getData(app.globalData.doubanApi+bookInfo+bookIsbn+'?'+app.globalData.apikey)
    var that = this
    wx.getSetting({  /*一开始就先获取用户昵称，存到data中*/
      success (res) {
        // console.log(res)
        if(res.authSetting['scope.userInfo']){  /*对象名['属性名']取属性值*/
          wx.getUserInfo({
            success (res) {
              // console.log(res)
              that.setData({
                userName:res.userInfo.nickName
              })
            }
          })
        }
      }
    })
  },
  getData:function(dataUrl) {
    util.httpRequest(dataUrl,this.chuliData)
  },
  //处理数据的函数
  chuliData:function(bookData){
    var bookObj = bookData
    bookObj.bookAuthor = bookData.author+' / '  /*作者*/
    bookObj.chubanse = bookData.publisher+' / '  /*出版社*/
    bookObj.chubanTime = '出版时间：'+bookData.pubdate
    this.setData({
      book:bookObj
    })
    this.setBarTitle(bookObj.title)  /*设置bartitle*/
  },
   //设置bartitle的函数
   setBarTitle:function(name){
    var barTitle=name.length>8?name.substr(0,8)+'...':name
    wx.setNavigationBarTitle({
      title: barTitle
    })
  },
  //内容简介‘展开收起’点击事件
  ellipsisBtn:function(){
    this.setData({
      ellipsis: !this.data.ellipsis
    }) 
  },
  //作者简介‘展开收起’点击事件
  ellipsisBtnZ:function(){
    this.setData({
      Zellipsis: !this.data.Zellipsis
    }) 
  },
  //目录‘展开收起’点击事件
  ellipsisBtnM:function(){
    this.setData({
      Mellipsis: !this.data.Mellipsis
    }) 
  },
  //点击“在读”跳转到对应的读数笔记页面
  zaidu:function(e){
    console.log(e)
    var bookId = e.currentTarget.dataset.bookid
    var isbn = e.currentTarget.dataset.zaiduisbn
    var userName = this.data.userName
    wx.navigateTo({
      url: '../bookReadingNotes/bookReadingNotes?zaiduIsbn='+isbn+'&bookId='+bookId+'&userName='+userName  //带参数跳转
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})