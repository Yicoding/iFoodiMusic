//index.js
//获取应用实例
var config = require('../../config')
const app = getApp()

Page({
  data: {
    interval: 3500,
    duration: 300,
    showDots: true,
    albumList: [],
    imgUrls: [
      'https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/swiper-1.jpg',
      'https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/swiper-2.jpg',
      'https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/swiper-3.jpg'
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
  gotoSongList(e) {
    let item = e.currentTarget.dataset.type
    app.globalData.album = item // 将专辑信息存入globalData
    wx.navigateTo({
      url: '../songlist/songlist'
    })
  }
})
