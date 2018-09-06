//index.js
//获取应用实例
const app = getApp();
var Base64 = require('../../utils/base64.js').Base64;
var Lyric = require('../../utils/lyric-parse.js').default;
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
Page({
  data: {
    item: {}, // 歌曲信息
    sliderValue: 0, // 滑块的值
    playStatus: 0, // 播放状态
    duration: 0, // 音频的长度（单位：s）
    currentPosition: 0, // 音频的播放位置（单位：s）
    timee: 0, // 定时器 根据歌曲进度改变slider进度
    currentLyric: '', // 当前歌词
    parseLyric: '',
  },
  onLoad(options) {
    console.log(wx.getStorageSync('item'), 'asycn')
    let item = wx.getStorageSync('item')
    console.log(app.globalData.playList, 'playList')
    if (item) {
      this.setData({
        item: item
      })
      wx.setNavigationBarTitle({
        title: item.name
      })
      this.init(item)
    } else {
      console.log('item不存在')
    }
  },
  onUnload() {
    wx.removeStorageSync('item')
  },
  getLyric(songLyric) {
    let lyric = Base64.decode(songLyric)
    this.setData({
      parseLyric: new Lyric(lyric, this.handleLyric)
    })
    this.data.parseLyric.play()
  },
  handleLyric({lineNum, txt}) {
    console.log(lineNum, txt, 'txt')
    this.setData({
      currentLyric: txt
    })
  },
  // 初始化歌曲
  init(item) {
    this.getLyric(item.lyric)
    let bgMusic = wx.getBackgroundAudioManager()
    this.play(item)
    if (bgMusic.src !== item.src) {
      console.log('not not')
    } else {
      console.log('setTimeesetTimeesetTimee')
      this.setTimee()
      let bgMusic = wx.getBackgroundAudioManager()
      this.data.parseLyric.seek(parseInt(bgMusic.currentTime)*1000)
    }
  },
  setTimee() {
    this.data.timee = setInterval(() => {
      this.setDuration()
    }, 1000)
  },
  // 播放/暂停
  switch() {
    this.data.parseLyric.togglePlay()
    if (this.data.playStatus) {
      wx.pauseBackgroundAudio()
    } else {
      this.play(this.data.item)
    }
  },
  // 播放歌曲
  play(item) {
    wx.playBackgroundAudio({
      dataUrl: item.src,
      title: item.name,
      coverImgUrl: app.globalData.coverImg
    })
    this.setTimee()
  },
  // 完成一次拖动后触发的事件
  slideChange(e) {
    let value = e.detail.value
    wx.getBackgroundAudioPlayerState({
      success: (res) => {
        let {status, duration} = res
        if (status === 1 || status === 0) {
          let position = parseInt((value / 100) * duration)
          console.log(position, 'position')
          wx.seekBackgroundAudio({
            position: position
          })
          this.data.parseLyric.seek(position*1000)
          this.setData({
            sliderValue: value
          })
        }
      }
    })
  },
  // 控制滑块进度
  setDuration() {
    wx.getBackgroundAudioPlayerState({
      success: (res) => {
        let { status } = res
        this.setData({
          playStatus: status
        })
        if (status === 1 || status === 0) { // 1：播放中，0：暂停中
          let { duration, currentPosition } = res
          // console.log(duration,currentPosition)
          this.setData({
            currentPosition: this.stotime(currentPosition),
            duration: this.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
          })
        } else {
          clearInterval(this.data.timee)
          console.log('over')
          console.log(app.globalData.playIndex,  app.globalData.playList.length)
          if (app.globalData.playIndex < app.globalData.playList.length - 1) {
            app.globalData.playIndex ++
          } else {
            app.globalData.playIndex = 0
          }
          let pages = getCurrentPages()
          let currentPage = pages[pages.length - 1].route
          if (currentPage == 'pages/player/player') {
            wx.setNavigationBarTitle({
              title: app.globalData.playList[app.globalData.playIndex].name
            })
          }
          this.play(app.globalData.playList[app.globalData.playIndex])
        }
      }
    })
  },
  // 时间格式转换
  stotime(s) {
    let t = ''
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60
      if (min < 10) { t += '0' }
      t += min + ':'
      if (sec < 10) { t += '0' }
      t += sec
    }
    t = t.slice(0, 5)
    return t
  },
})
