//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    html: ''
  },
  onLoad: function () {
    
  },
  // 监听用户下拉动作
  onPullDownRefresh() {

  },
  // 滚动到底部
  bindscrolltolower(e) {
    console.log(e)
  },
  // 发表
  toPresent() {
    wx.navigateTo({
      url: '../present/present'
    })
  },
})
