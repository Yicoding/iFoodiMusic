//index.js
//获取应用实例
var config = require('../../config')
const { ajax } = require('../../utils/ajax');
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
      'https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/swiper-3.jpg',
      'https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/swiper-4.jpg',
      'https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/swiper-5.jpg',
    ],
    songInfo: {},
    showNavigator: false,
    stateIcon: playIcon,
    poster: '../../images/avatar.png',
  },
  onLoad: function () {
    ajax({
      url: config.service.album,
      success: ({ data }) => {
        console.log(data)
        this.setData({
          albumList: data.data
        })
      },
      fail: (err) => {
        console.log(err, 'failed 12221 request')
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        poster: app.globalData.userInfo.avatarUrl
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo, 'app.userInfoReadyCallback')
        this.setData({
          poster: res.userInfo.avatarUrl
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            poster: res.userInfo.avatarUrl
          })
        }
      })
    }
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
    wx.setStorageSync('album', item) // 将专辑信息存入缓存中
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
  },
  // 跳转到我的收藏列表
  goCollectList() {
    wx.navigateTo({
      url: '../collect/collect'
    })
  }
})
