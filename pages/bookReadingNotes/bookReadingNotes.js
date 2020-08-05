// pages/bookReadingNotes/bookReadingNotes.js
const app = getApp()  //app.js //获取应用实例
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notesArr:[],
    note:{},
    userName:'',
    jinduShow:true,   /*true表示进度条盒子隐藏*/
    noteShow:true,    /*true表示读书笔记盒子隐藏*/
    jinduValue:'0%'   /*放在note里则进度条颜色不能立刻变更*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bookId = options.bookId
    this.data.note.bookId = bookId
    var userName = options.userName
    this.setData({
      userName:userName
    })
    var isbn = options.zaiduIsbn
    var bookInfo = 'book/isbn/'
    this.getData(app.globalData.doubanApi+bookInfo+isbn+'?'+app.globalData.apikey)
    // var keyName = {}    /*使用用户昵称和booId一起作为缓存的key*/
    // keyName.userName = this.data.userName
    // keyName.bookId = this.data.note.bookId
    var keyName = (this.data.userName).concat(this.data.note.bookId)
    console.log(keyName)
    var that = this
    wx.getStorage({
      key: keyName,
      success (res) {
        // console.log(res)
        var oldNotesArr = res.data
        that.setData({
          notesArr:oldNotesArr
        })
      }
    })
    console.log(this.data.notesArr)
  },
  //点击“阅读进度”右边加号，进度条盒子出现，再点隐藏
  jinduShow:function(){
    this.setData({
      jinduShow:!this.data.jinduShow
    })
  },
  //点击“读书笔记”右边加号，读书笔记输入框盒子出现，再点隐藏
  noteShow:function(){
    this.setData({
      noteShow:!this.data.noteShow
    })
  },
  //通过IBSN获取书本信息的函数(获取数据)
  getData:function(dataUrl) {
    util.httpRequest(dataUrl,this.chuliData)
  },
   //处理数据的函数（此处仅设置NavigationBarTitle）
   chuliData:function(bookData){
    var title = bookData.title.length>6?bookData.title.substr(0,5)+'...'+'读书笔记':bookData.title+'读书笔记';
    wx.setNavigationBarTitle({
      title: title,
    })
  },
  //获取“标题”input的value值的函数
  titleBlur:function(e){
    var titleValue = e.detail.value
    this.data.note.titleValue = titleValue
    // this.setData({
    //   titleValue:titleValue
    // })
  },
  //获取“阅读日期”input的value值的函数
  readDateBlur:function(e){
    var readDateValue = e.detail.value
    this.data.note.readDateValue = readDateValue
  },
  //获取“读到哪里”input的value值的函数
  dudaoBlur:function(e){
    var dudaoValue = e.detail.value
    this.data.note.dudaoValue = dudaoValue
  },
  //获取“开始页码”input的value值的函数
  pagesStarBlur:function(e){
    var pagesStarValue = e.detail.value
    this.data.note.pagesStarValue = pagesStarValue
  },
  //获取“结束页码”input的value值的函数
  pagesEndBlur:function(e){
    var pagesEndValue = e.detail.value
    this.data.note.pagesEndValue = pagesEndValue
  },
  //获取“进度”input的value值的函数
  jinduBlur:function(e){
    var jinduValue = e.detail.value
    var jinduValueNum = Number(jinduValue)  /*Number方法可筛选掉数字加字符串的组合*/
    var isNum = isNaN(jinduValueNum)   /*isNaN判断输入的是否非数值*/
    if(isNum){      /*如果输入的非数值，显示模态对话框*/
      wx.showModal({
        title: '数据类型错误',
        content: '请输入百分比或数字'
      })
      jinduValue = ''   /*模态对话框关闭后清空输入的值*/
    }
    var newJinduValue = ''
    if(jinduValue.trim()==''){  /*如果输入为空让其等于0%*/
      newJinduValue = '0%'
    }else if(jinduValue.indexOf('%')==-1){  /*如果用户输入的数值不含百分号帮他加上*/
      newJinduValue = jinduValue+"%"
    }else {
      newJinduValue = jinduValue
    }
    if(parseInt(newJinduValue) > 100){
      newJinduValue = '100%'
    }
    // this.data.note.jinduValue = newJinduValue /*放在note里作为属性颜色不会立刻变更*/
    this.setData({    /*用setData方法进度条颜色才可实时变更*/
      jinduValue:newJinduValue
    })
  },
  //获取笔记textarea的value值的函数
  textareaBlur:function(e){
    var textareaValue = e.detail.value
    this.data.note.textareaValue = textareaValue
  },
  //点击“保存”按钮，设置缓存
  save:function(){
    //判断note中是否含有标题和阅读时间两项属性（两样都没输入则没有）
    var flag1 = this.data.note.hasOwnProperty('titleValue')==false&&this.data.note.hasOwnProperty('readDateValue')==false
    if(flag1){
      wx.showModal({
        title: '错误提示',
        content: '标题和阅读时间至少填写一项'
      })
    }else {
      if(this.data.note.titleValue.trim()==''&&this.data.note.readDateValue.trim()==''){
        wx.showModal({
          title: '错误提示',
          content: '标题和阅读时间至少填写一项'
        })
      }else {
      var notesArrName = 'notesArr[' + this.data.notesArr.length + ']'
      console.log(notesArrName)
      console.log(this.data.note)
      var obj = {}   /*jinduValue不在note里，先用一个对象装起来*/
      obj.note = this.data.note
      obj.jinduValue = this.data.jinduValue
      this.setData({
        [notesArrName]:obj
      })
      console.log(this.data.notesArr)
      // var keyName = {}    /*使用用户昵称和booId一起作为缓存的key*/
      // keyName.userName = this.data.userName
      // keyName.bookId = this.data.note.bookId
      this.setData({
        userName:this.data.userName
      })
      // var keyName = (this.data.userName).concat(this.data.note.bookId)
      // console.log(keyName)
      // wx.setStorage({
      //   key:keyName,
      //   data:this.data.notesArr
      // })
      this.delete()
      }
    }
  },
  //点击“清空所有”按钮清除缓存
  delete:function(){
    var that = this
    var bookId = this.data.note.bookId   /*清除缓存不清除bookId*/
    var temNote = {bookId:bookId}
    var keyName = this.data.note.bookId
    wx.removeStorage({
      key: keyName,
      success (res) {
        that.setData({
          note:temNote,
          jinduValue:'0%'
        })
      }
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
    var keyName = (this.data.userName).concat(this.data.note.bookId)
    wx.setStorage({
      key: keyName,
      data: this.data.notesArr
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