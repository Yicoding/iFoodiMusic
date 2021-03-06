//index.js
//获取应用实例
var config = require('../../config')
const { ajax } = require('../../utils/ajax');
const app = getApp()
var playIcon = '../../images/icon/play.png'
var pauseIcon = '../../images/icon/pause.png'

Page({
  data: {
    album: {},
    songList: [],
    songInfo: {},
    showNavigator: false,
    stateIcon: playIcon
  },
  onLoad() {
    let item = wx.getStorageSync('album')
    this.setData({
      album: item
    })
    wx.setNavigationBarTitle({
      title: item.name
    })
    this.getSongList(item.id)
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
    this.setData({
      stateIcon: playIcon
    })
  },
  onPause() {
    this.setData({
      stateIcon: pauseIcon
    })
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    console.log('ok')
    let item = this.data.album.poster,
    urls = [item]
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
    wx.stopPullDownRefresh()
  },
  // 根据歌单id获取歌曲列表
  getSongList(id) {
    ajax({
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
    app.globalData.album = this.data.album
    app.globalData.playList = this.data.songList
    let index = e.currentTarget.dataset.index
    app.globalData.playIndex = index
    let url = '../player/player'
    wx.navigateTo({
      url: url
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
