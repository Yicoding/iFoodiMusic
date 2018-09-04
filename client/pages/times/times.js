//index.js
//获取应用实例
var config = require('../../config')
const app = getApp()

Page({
  data: {
    albumList: [],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
  },
  onLoad: function () {
    wx.request({
      url: config.service.album,
      success: ({ data }) => {
        console.log(data)
        this.setData({
          albumList: data.data
        })
      }
    })
  },
})
