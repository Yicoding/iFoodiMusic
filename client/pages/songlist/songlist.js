//index.js
//获取应用实例
var config = require('../../config')
const app = getApp()

Page({
  data: {
    coverImg: '',
    songList: [],
  },
  onLoad(options) {
    let item = JSON.parse(options.item)
    wx.setNavigationBarTitle({
      title: item.name
    })
    this.setData({
      coverImg: item.poster
    })
    this.getSongList(item.id)
  },
  getSongList(id) {
    wx.request({
      url: config.service.getSongList,
      data: {
        id: id
      },
      success:({ data }) => {
        console.log(data)
        this.setData({
          songList: data.data
        })
      }
    })
  }
})
