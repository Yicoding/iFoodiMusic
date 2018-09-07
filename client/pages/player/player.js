//index.js
//获取应用实例
const app = getApp();
var Base64 = require('../../utils/base64.js').Base64
var Lyric = require('../../utils/lyric-parse.js').default
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
    mode: 'multiple', // 循环模式
    coverImg: '',
  },
  onLoad(options) {
    console.log(app.globalData.mode, 'app.globalData.modeapp.globalData.modeapp.globalData.mode')
    this.setData({
      mode: app.globalData.mode,
      coverImg: app.globalData.album.poster
    })
    let item = app.globalData.playList[app.globalData.playIndex]
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
    let bgMusic = wx.getBackgroundAudioManager()
    if (bgMusic.src !== item.src) {
      this.getLyric(item.lyric)
      this.play(item)
    } else {
      this.setTimee()
      wx.getBackgroundAudioPlayerState({
        success: (res) => {
          let { currentPosition, status } = res
          let lyric = Base64.decode(item.lyric)
          this.setData({
            parseLyric: new Lyric(lyric, this.handleLyric)
          })
          console.log(currentPosition)
          this.data.parseLyric.seek((currentPosition+0.5)*1000)
          if (status == 0) {
            this.data.parseLyric.togglePlay()
          }
        }
      })
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
          this.setData({
            currentPosition: this.stotime(currentPosition),
            duration: this.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
          })
        } else {
          if (this.data.mode == 'multiple') {
            this.cutNext()
          } else {
            this.play(app.globalData.playList[app.globalData.playIndex])
            let lyric = Base64.decode(app.globalData.playList[app.globalData.playIndex].lyric)
            this.setData({
              parseLyric: new Lyric(lyric, this.handleLyric)
            })
            wx.getBackgroundAudioPlayerState({
              success: (res) => {
                this.data.parseLyric.play()
              }
            })
          }
        }
      }
    })
  },
  cutPrev() {
    this.delSongChange('prev')
  },
  cutNext() {
    this.delSongChange('next')
  },
  delSongChange(type) {
    if (this.data.duration !== 0) {
      clearInterval(this.data.timee)
      this.data.parseLyric.stop()
      if (type == 'prev') {
        if (app.globalData.playIndex > 0) {
          app.globalData.playIndex --
        } else {
          app.globalData.playIndex = app.globalData.playList.length - 1
        }
      } else {
        if (app.globalData.playIndex < app.globalData.playList.length - 1) {
          app.globalData.playIndex ++
        } else {
          app.globalData.playIndex = 0
        }
      }
      this.setData({
        item: app.globalData.playList[app.globalData.playIndex]
      })
      this.play(app.globalData.playList[app.globalData.playIndex])
      let lyric = Base64.decode(app.globalData.playList[app.globalData.playIndex].lyric)
      this.setData({
        parseLyric: new Lyric(lyric, this.handleLyric)
      })
      wx.getBackgroundAudioPlayerState({
        success: (res) => {
          this.data.parseLyric.play()
        }
      })
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1].route
      if (currentPage == 'pages/player/player') {
        wx.setNavigationBarTitle({
          title: app.globalData.playList[app.globalData.playIndex].name
        })
      }
    }
  },
  // 改变循环模式
  changeMode() {
    if (this.data.mode == 'multiple') {
      this.setData({
        mode: 'single'
      })
      app.globalData.mode = 'single'
    } else {
      this.setData({
        mode: 'multiple'
      })
      app.globalData.mode = 'multiple'
    }
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
