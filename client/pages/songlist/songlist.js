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
  // 根据歌单id获取歌曲列表
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
  },
  // 播放歌曲
  play(e) {
    app.globalData.playList = this.data.songList
    app.globalData.coverImg = this.data.coverImg
    app.globalData.playIndex = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.type
    wx.setStorageSync('item', item)
    let url = '../player/player'
    wx.navigateTo({
      url: url
    })
  }
})
