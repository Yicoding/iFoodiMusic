//index.js
//获取应用实例
var config = require('../../config')
const app = getApp()

Page({
  data: {
    
  },
  onLoad: function () {
    wx.request({
      url: config.service.db,
      success: (res) => {
        console.log(res.data, 'db')
      }
    })
  },
})
