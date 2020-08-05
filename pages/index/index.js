//index.js
//获取应用实例
const app = getApp()

Page({
 enter:function(e){
   wx.switchTab({   //跳转到带有tabBar的页面
     url: '../movie/movie'
   })
 }
})
