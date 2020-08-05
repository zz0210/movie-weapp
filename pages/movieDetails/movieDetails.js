// pages/movieDetails/movieDetails.js
const app = getApp()  //app.js
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movie:{},
    ellipsis: true,  /*true简介收缩，flase简介展开*/
    xunhuanFive:[1,1,1,1,1],  /*用于豆瓣评分中进度条左边倒三角星星的循环*/
    xunhuanFour:[1,1,1,1],
    xunhuanThree:[1,1,1],
    xunhuanTwo:[1,1]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.movieId
    const type = 'movie/subject/'
    this.getData(app.globalData.doubanApi+type+movieId+'?'+app.globalData.apikey)
  },
  //获取数据函数
  getData:function(dataUrl){
    util.httpRequest(dataUrl,this.chuliData)
  },
  //处理数据的函数
  chuliData:function(realdata){
    // console.log(realdata)
    var movieObj = realdata
    movieObj.movieYear = '('+realdata.year+')'
    var movieType = realdata.genres.join(' ')  /*给电影种类名词之间拼接空格，\b样式不对*/
    movieObj.movieType = movieType + ' / '  /*类别，科幻惊悚等(数组)*/
    var movieCountry = realdata.countries.join(' ')
    movieObj.movieCountry = movieCountry + ' / ' /*电影地区*/
    movieObj.movieTime = '片长' + realdata.durations[0]  /*电影时长*/
    /*评分下面星星*/
    var stars = realdata.rating.stars
    movieObj.star = util.setStars(stars) /*数组*/
    movieObj.userDuanping = realdata.popular_comments /*短评（数组）*/
    /*短评中用户名下面的星星和发表评论的日期*/
    this.setUserDuanpingStarsAndTime(movieObj.userDuanping)
    /*一到五星评论数占总评论数的百分比*/
    /*将对象中的属性值找出来放进一个数组*/
    var allStarCountArr = Object.values(realdata.rating.details)
    /*将该数组求和*/
    var allStarCountSum=0
    for(var i=0;i<allStarCountArr.length;i++){
      allStarCountSum+=allStarCountArr[i]
    }
    movieObj.allStarCountSum = allStarCountSum  /*当星星总大于0，才显示有色进度条*/
    movieObj.oneStarPercent = realdata.rating.details['1']/allStarCountSum*100
    movieObj.twoStarPercent = realdata.rating.details['2']/allStarCountSum*100
    movieObj.threeStarPercent = realdata.rating.details['3']/allStarCountSum*100
    movieObj.fourStarPercent = realdata.rating.details['4']/allStarCountSum*100
    movieObj.fiveStarPercent = realdata.rating.details['5']/allStarCountSum*100
    this.setData({
      movie:movieObj
    })
    this.setBarTitle(movieObj.title)  /*设置bartitle*/
  },
  //设置bartitle的函数
  setBarTitle:function(name){
    var barTitle=name.length>8?name.substr(0,8)+'...':name
    wx.setNavigationBarTitle({
      title: barTitle
    })
  },
  //简介‘展开收起’点击事件
  ellipsisBtn:function(){
    this.setData({
      ellipsis: !this.data.ellipsis
    }) 
  },
  //设置短评中用户打分的星星和发表评论的时间的函数
  setUserDuanpingStarsAndTime:function(Duanping){
    for(var i=0;i<Duanping.length;i++){
      var starsDuanping = Duanping[i].rating.value + '0'
      Duanping[i].star = util.setStars(starsDuanping) /*数组*/
      Duanping[i].time = Duanping[i].created_at.substr(0,4) + '年' + Duanping[i].created_at.substr(5,2) + '月' + Duanping[i].created_at.substr(8,2) + '日'
    }
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