// Pages/book/book.js
const app = getApp()  //app.js //获取应用实例
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    books:[],
    count:0   /*books数组的下标*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var that = this
    wx.getStorage({
      key: 'userBooks',
      success (res) {
        var oldBooks = res.data.books
        var oldCount = res.data.count
        that.setData({
          books:oldBooks,
          count:oldCount
        })
      }
    })
  },
  //点击清空书架清除缓存
  delete:function(){
    var that = this
    var tembooks = []
    wx.removeStorage({
      key: 'userBooks',
      success (res) {
        that.setData({
          books:tembooks,
          count:0
        })
      }
    })
  },
  //点击扫码加书
  saoma:function(){
    var that = this
    wx.scanCode({
      success (res) {
        var isbn = res.result
        var bookInfo = 'book/isbn/'
        that.getData(app.globalData.doubanApi+bookInfo+isbn+'?'+app.globalData.apikey)
      }
    })
  },
  //通过IBSN获取书本信息的函数(获取数据)
  getData:function(dataUrl) {
    util.httpRequest(dataUrl,this.chuliData)
  },
  //处理数据的函数
  chuliData:function(bookData){
    if(bookData.id == undefined){
      wx.showModal({
        title: '错误提示',
        content: '未找到图书信息'
      })
    }else {
    var bookObj = {}
    var title = bookData.title.length>6?bookData.title.substr(0,5)+'...':bookData.title;
    bookObj.img = bookData.images.small
    bookObj.name =title
    bookObj.bookIsbn = bookData.isbn13
    bookObj.bookId = bookData.id
    this.data.count+=1
    var name = 'books[' + (this.data.count-1) + ']'
    this.setData({
      [name]:bookObj
    })
    }

  },
  //点击书籍跳转到对应的详情页
  bookDetails:function(e){
    // console.log(e)
    var isbn = e.currentTarget.dataset.bookisbn
    wx.navigateTo({
      url: '../bookDetails/bookDetails?bookIsbn='+isbn  //带参数跳转
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
  onHide: function () { //设置缓存
    var userBooks = {}
    userBooks.books = this.data.books
    userBooks.count = this.data.count
    wx.setStorage({   //将所有参数整合成一个数组设置到缓存中
      key:"userBooks",
      data:userBooks
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var userBooks = {}
    userBooks.books = this.data.books
    userBooks.count = this.data.count
    wx.setStorage({   //将所有参数整合成一个数组设置到缓存中
      key:"userBooks",
      data:userBooks
    })
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