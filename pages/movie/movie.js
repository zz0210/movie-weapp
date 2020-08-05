// pages/movie/movie.js
const app = getApp()  //app.js //获取应用实例
const util = require('../../utils/util.js')  //抽共通,放在util.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movieType:[]
},
  //点击更多跳转到对应的列表页面
  more:function(e){
    var index = e.currentTarget.dataset.titletypeid
    wx.navigateTo({   //列表页不带tabBar,换回navigateTo
      url: '../movieList/movieList?titleTypeId='+index //带参数跳转
    })
  },
  //点击电影跳转到对应的详情页
  movie:function(e){
    util.getMovieDetails(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = '?start=0&count=20&city=南宁&'  //从下标为0开始，获取20部电影的信息
    //app.globalData.doubanApi为定义在app.js中的变量，方便其它页面调用，开头需用getApp()获取
   this.getData(app.globalData.doubanApi+'movie/coming_soon'+type+app.globalData.apikey,0)
   this.getData(app.globalData.doubanApi+'movie/top250'+type+app.globalData.apikey,1)
   this.getData(app.globalData.doubanApi+'movie/in_theaters'+type+app.globalData.apikey,2)
  },
  //获取数据函数
  getData:function(dataUrl,typeNum){
    util.httpRequest(dataUrl,this.chuliData,typeNum)
    // wx.request({   //复习参考
    //   url: dataUrl,
    //   header:{
    //     'content-type': 'json'
    //   },
    //   success:function(res){
    //     // console.log(res) //数据只要res.data里的即可
    //     that.chuliData(res.data,typeNum)   //在此函数域内this.取不到外面的处理数据函数
    //   }
    // })
  },
  //处理数据的函数
  chuliData:function(realdata,typeNum){
    //开头data中设置的movieType[]中有三个对象，每个对象包含title和movie数组，其中movie数组又包含20（查不到20个就没有20）个对象（'即将上映'和下面的电影的信息）
    var movieTypeObj = {}
    var tmpMovies = []  //装20部（即将上映、正在热映不到20部就没有20）电影信息的临时数组
    for(var i=0;i<realdata.subjects.length;i++){
      util.getSingleMovieInfo(realdata,i)
      var movieObj = util.getSingleMovieInfo(realdata,i) //获取返回的movieObj
      //以下复习参考
      // var movieObj = {}  //装单独一部电影信息的对象
      // var title = realdata.subjects[i].title.length>6?realdata.subjects[i].title.substr(0,5)+'...':realdata.subjects[i].title;
      // movieObj.movieId = realdata.subjects[i].id
      // movieObj.movieImg = realdata.subjects[i].images.small
      // movieObj.movieName = title
      // movieObj.movieScore = realdata.subjects[i].rating.average
      // /*星星*/
      // var stars = realdata.subjects[i].rating.stars
      // movieObj.star = util.setStars(stars) /*数组*/
      tmpMovies.push(movieObj)
    }
    //设置realdat.title
    this.setRT(realdata,typeNum)
    movieTypeObj.title=this.setRT(realdata,typeNum)  //movieTypeObj对象中添加title属性并赋值
    movieTypeObj.movie=tmpMovies
    var name = 'movieType[' + typeNum + ']'  //typeNum为获取数据函数值传的数字实参
    this.setData({
      [name]:movieTypeObj
    })
  },
  //设置realdat.title的函数
  setRT:function(realdata,typeNum){
    if(typeNum==0){
      realdata.title='即将上映'
    }else if(typeNum==1){
      realdata.title='高分好评'
    }else {
      realdata.title='正在热映'
    }
    return realdata.title
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