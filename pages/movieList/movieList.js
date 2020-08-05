// pages/movieList/movieList.js
const app = getApp()  //app.js
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies:[],
    count:0,  /*刚跳转到列表页时里面的电影为0，之后马上加载出20部*/
    typeNum:''
  },
  //点击电影跳转到对应的详情页
  movie:function(e){
    util.getMovieDetails(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var typeNum = options.titleTypeId
    var dataUrl = this.getUrl(typeNum)
    this.setBarTitle(typeNum)
    this.getData(dataUrl)
    this.setData({
      typeNum:typeNum
    })
  },
  //设置barTitle的函数
  setBarTitle:function(typeNum){
    if(typeNum==0){
      wx.setNavigationBarTitle({
        title: '即将上映'
      })
    }else if(typeNum==1){
      wx.setNavigationBarTitle({
        title: '高分好评'
      })
    }else {
      wx.setNavigationBarTitle({
        title: '正在热映'
      })
    }
  },
  //获取URL函数
  getUrl:function(typeNum){
    var movieType
    if(typeNum==0){
      movieType = 'movie/coming_soon'
    }else if(typeNum==1){
      movieType = 'movie/top250'
    }else {
      movieType = 'movie/in_theaters'
    }
    var urlType = '?start='+this.data.count+'&count=20&city=南宁&'
    var url = app.globalData.doubanApi+movieType+urlType+app.globalData.apikey
    return url
  },
  //获取数据的函数
  getData:function(dataUrl){
    util.httpRequest(dataUrl,this.chuliData)
  },
  //处理数据的函数
  chuliData:function(realdata){
    var movies = []
    var count = this.data.count + realdata.subjects.length
    for(var i=0;i<realdata.subjects.length;i++){
      util.getSingleMovieInfo(realdata,i)
      var movieObj = util.getSingleMovieInfo(realdata,i) //获取返回的movieObj
      movies.push(movieObj)
    }
    if(this.data.count!=0){
      movies = this.data.movies.concat(movies) /*拼接数组，新加载好的电影拼接在后面*/
    }
    this.setData({
      movies:movies,
      count:count
    })
  },

   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var typeNum = this.data.typeNum
    var url = this.getUrl(typeNum)
    this.getData(url,typeNum)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})