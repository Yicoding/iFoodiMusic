//index.js
//获取应用实例
var config = require('../../config')
const app = getApp()

Page({
  data: {
    album: {},
    songList: [],
  },
  onLoad() {
    let item = app.globalData.album
    this.setData({
      album: item
    })
    wx.setNavigationBarTitle({
      title: item.name
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
    let index = e.currentTarget.dataset.index
    app.globalData.playIndex = index
    let url = '../player/player'
    wx.navigateTo({
      url: url
    })
  }
})
