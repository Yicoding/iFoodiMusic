//index.js
//获取应用实例
var config = require('../../config')
const app = getApp()
var playIcon = '../../images/icon/play.png'
var pauseIcon = '../../images/icon/pause.png'

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
    songInfo: {},
    showNavigator: false,
    stateIcon: playIcon
  },
  onLoad: function () {
    wx.request({
      url: config.service.album,
      success: ({ data }) => {
        console.log(data)
        this.setData({
          albumList: data.data
        })
      },
      fail: (err) => {
        console.log(err, 'failed request')
      }
    })
  },
  onShow() {
    console.log('onShow')
    if (app.globalData.playList.length) { // 有音乐播放
      console.log(app.globalData.playList[app.globalData.playIndex], 'app.globalData.playList[app.globalData.playIndex]')
      this.setData({
        showNavigator: true,
        songInfo: app.globalData.playList[app.globalData.playIndex]
      })
    } else {
      this.setData({
        showNavigator: false
      })
    }
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    if (backgroundAudioManager.paused) { // 歌曲处于暂停状态
      this.setData({
        stateIcon: pauseIcon
      })
    } else { // 歌曲处于播放状态
      this.setData({
        stateIcon: playIcon
      })
    }
    backgroundAudioManager.onPlay(this.onPlay) // 监听背景音频播放事件
    backgroundAudioManager.onPause(this.onPause) // 监听背景音频暂停事件
  },
  onPlay() {
    console.log('面板onPlay')
    this.setData({
      stateIcon: playIcon
    })
  },
  onPause() {
    console.log('面板onPause')
    this.setData({
      stateIcon: pauseIcon
    })
  },
  gotoSongList(e) {
    let item = e.currentTarget.dataset.type
    app.globalData.album = item // 将专辑信息存入globalData
    wx.navigateTo({
      url: '../songlist/songlist'
    })
  },
  // 播放/暂停
  pauseSwitch() {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    if (backgroundAudioManager.paused) { // 歌曲处于暂停状态（去播放）
      backgroundAudioManager.play()
      this.setData({
        stateIcon: playIcon
      })
    } else { // 歌曲处于播放状态（去暂停）
      backgroundAudioManager.pause()
      this.setData({
        stateIcon: pauseIcon
      })
    }
  },
  // 停止音乐
  stopMusic() {
    console.log('closecloseclose')
    this.setData({
      showNavigator: false
    })
    app.globalData.playList = []
  }
})
