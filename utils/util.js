const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const setStars = stars => {  /*箭头函数，函数名 = 形参 =>*/
  var first = stars.substr(0,1)  /*如查到的参数stars:50,获取第一位‘5’*/
  var second =  stars.substr(1,1)
  var starsArr = []  /*用于循环星星的数组，长度固定为5，区别在于每一位不同则星星图片不同*/
  for(var i=0;i<first;i++){
    starsArr.push('a')  /*a表示有色星星*/
  }
  var starLength = starsArr.length
  if(starLength != 5){
    if(second == 5){
      starsArr.push('b')  /*b表示半星*/
    }
    for(var j=starsArr.length;j<5;j++){
      starsArr.push('c')  /*c表示无色（灰色）星星*/
    }
  }
  return starsArr
}

const httpRequest = (url,callBack,other) =>{ /*不一定每一个调用都要传三个参数*/
  wx.request({
    url: url,
    header:{
      'content-type': 'json'
    },
    success:res => {
      // console.log(res.data)
      callBack(res.data,other)  //数据只要res.data里的即可
    }
  })
}

const getMovieDetails = e => {  //点击电影跳转到对应的详情页
  var idNum = e.currentTarget.dataset.movieid
  wx.navigateTo({   //详情页不带tabBar,用navigateTo
    url: '../movieDetails/movieDetails?movieId='+idNum //带参数跳转
  })
}

const getSingleMovieInfo = (realdata,i) => {
  var movieObj = {}
  var title = realdata.subjects[i].title.length>6?realdata.subjects[i].title.substr(0,5)+'...':realdata.subjects[i].title;
  movieObj.movieId = realdata.subjects[i].id
  movieObj.movieImg = realdata.subjects[i].images.small
  movieObj.movieName = title
  movieObj.movieScore = realdata.subjects[i].rating.average
  /*星星*/
  var stars = realdata.subjects[i].rating.stars
  movieObj.star = setStars(stars) /*数组*/
  return movieObj
}

module.exports = {
  formatTime: formatTime,
  setStars:setStars,
  httpRequest:httpRequest,
  getMovieDetails:getMovieDetails,
  getSingleMovieInfo:getSingleMovieInfo
}
