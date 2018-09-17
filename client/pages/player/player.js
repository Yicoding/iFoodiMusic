//index.js
//获取应用实例
const app = getApp();
var Base64 = require('../../utils/base64.js').Base64
var Lyric = require('../../utils/lyric-parse.js')
Page({
  data: {
    item: {}, // 当前歌曲信息
    parseLyric: '', // 歌曲解析后的歌词
    lineLyric: '', // 当前播放进度点的歌词
    mode: '', // 播放模式
    imgRotate: 0, // 封面旋转的角度
    sliderValue: 0, // 进度条的值
    duration: 0, // 音频的长度（单位：s）
    currentPosition: 0, // 音频的播放位置（单位：s）
    playStatus: 0, // 播放状态
    timee: 0, // 定时器 根据歌曲进度改变slider进度
    coverImg: '', // 封面图片
    isDel: false, // 当前列表是否只有一首歌曲
  },
  onLoad() {
    let item = app.globalData.playList[app.globalData.playIndex]
    let album = app.globalData.album
    // 获取背景音频信息
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    console.log(backgroundAudioManager, 'backgroundAudioManager')
    if (backgroundAudioManager.src == item.src) { // 继续听歌
      console.log('继续听歌')
    } else { // 播放新歌
      app.globalData.imgRotate = 0
      console.log('播放新歌')
      backgroundAudioManager.title = item.name
      backgroundAudioManager.epname = album.name
      backgroundAudioManager.singer = item.author
      backgroundAudioManager.coverImgUrl = album.poster
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = item.src
    }
    let lyric = Base64.decode(item.lyric)
    this.setData({
      item: item,
      coverImg: album.poster,
      playStatus: !backgroundAudioManager.paused,
      duration: this.stotime(backgroundAudioManager.duration),
      currentPosition: this.stotime(backgroundAudioManager.currentTime),
      parseLyric: new Lyric(lyric, this.handleLyric),
      mode: app.globalData.mode,
      imgRotate: app.globalData.imgRotate
    })
    this.data.parseLyric.seek(backgroundAudioManager.currentTime*1000 + this.data.item.bias)
    console.log(this.data.playStatus, 'playStatus')
    if (backgroundAudioManager.paused) {
      this.data.parseLyric.togglePlay()
    } else if (!this.data.timee) {
      this.toRotate()
    }
    backgroundAudioManager.onPlay(this.onPlay) // 监听背景音频播放事件
    backgroundAudioManager.onPause(this.onPause) // 监听背景音频暂停事件
    backgroundAudioManager.onTimeUpdate(this.onTimeUpdate) // 监听背景音频播放进度更新事件
    backgroundAudioManager.onEnded(this.onEnded) // 监听背景音频自然播放结束事件
    wx.setNavigationBarTitle({
      title: item.name
    })
    console.log(app.globalData.playList.length, 'app.globalData.playList.length')
    if (app.globalData.playList.length == 1) {
      this.setData({
        isDel: true
      })
    }
  },
  onShow() {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    if (!backgroundAudioManager.paused) {
      this.toRotate()
    }
  },
  onHide() {
    clearInterval(this.data.timee)
  },
  handleLyric({lineNum, txt}) { // 歌词回调
    console.log(lineNum, txt, 'txt')
    this.setData({
      lineLyric: txt
    })
  },
  onPlay() {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    console.log('onPlay')
    console.log(backgroundAudioManager.duration, 'backgroundAudioManager.duration')
    this.setData({
      playStatus: true
    })
    this.data.parseLyric.seek(backgroundAudioManager.currentTime*1000 + this.data.item.bias)
    this.toRotate()
  },
  onPause() {
    clearInterval(this.data.timee)
    this.data.parseLyric.stop()
    console.log('onPause')
    this.setData({
      playStatus: false
    })
  },
  switch() { // 切换歌曲播放状态
    if (this.data.playStatus) { // 切换为暂停状态
      const backgroundAudioManager = wx.getBackgroundAudioManager()
      backgroundAudioManager.pause()
    } else { // 切换为播放状态
      const backgroundAudioManager = wx.getBackgroundAudioManager()
      backgroundAudioManager.play()
    }
  },
  onTimeUpdate() {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    let sliderValue = backgroundAudioManager.currentTime / backgroundAudioManager.duration * 100
    this.setData({
      currentPosition: this.stotime(backgroundAudioManager.currentTime),
      sliderValue: sliderValue,
      duration: this.stotime(backgroundAudioManager.duration)
    })
    // this.data.parseLyric.seek(backgroundAudioManager.currentTime*1000)
  },
  toRotate() {
    this.data.timee && clearInterval(this.data.timee)
    this.data.timee = setInterval(() => {
      app.globalData.imgRotate  = app.globalData.imgRotate + 0.8
      this.setData({
        imgRotate: app.globalData.imgRotate
      })
    }, 35)
  },
  onEnded() {
    console.log('onEnded')
    this.setData({
      playStatus: false
    })
    if (this.data.mode == 'multiple') {
      this.cutNext()
    } else {
      const backgroundAudioManager = wx.getBackgroundAudioManager()
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = this.data.item.src
    }
  },
  slideChange(e) { // 拖动滑块
    let value = e.detail.value
    this.setData({
      sliderValue: value
    })
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    let currentTime = (value / 100) * backgroundAudioManager.duration
    backgroundAudioManager.seek(currentTime)
    this.data.parseLyric.seek(currentTime*1000 + this.data.item.bias)
  },
  cutPrev() { // 上一首
    this.delSongChange('prev')
  },
  cutNext() { // 下一首
    this.delSongChange('next')
  },
  delSongChange(type) { // 切换歌曲
    if (this.data.duration !== 0 && !this.data.isDel) {
      if (app.globalData.playList.length > 1) {
        clearInterval(this.data.timee)
      }
      this.data.duration = 0
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
      let item = app.globalData.playList[app.globalData.playIndex]
      wx.setNavigationBarTitle({
        title: item.name
      })
      const backgroundAudioManager = wx.getBackgroundAudioManager()
      backgroundAudioManager.title = item.name
      backgroundAudioManager.singer = item.author
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = item.src
      let lyric = Base64.decode(item.lyric)
      this.setData({
        item: item,
        playStatus: !backgroundAudioManager.paused,
        parseLyric: new Lyric(lyric, this.handleLyric)
      })
      this.data.parseLyric.seek(backgroundAudioManager.currentTime*1000 + this.data.item.bias)
      console.log(this.data.playStatus, 'playStatus')
      if (backgroundAudioManager.paused) {
        this.data.parseLyric.togglePlay()
      }
    }
  },
  // 改变播放模式
  changeMode() {
    if (this.data.mode == 'multiple') {
      this.setData({
        mode: 'single'
      })
    } else {
      this.setData({
        mode: 'multiple'
      })
    }
    app.globalData.mode = this.data.mode
  },
  // 时间格式转换
  stotime(s) {
    let t = ''
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = Math.floor(s) % 60
      if (min < 10) { t += '0' }
      t += min + ':'
      if (sec < 10) { t += '0' }
      t += sec
    }
    return t
  },
  onUnload() { // 页面卸载
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.onTimeUpdate()
    backgroundAudioManager.onPlay()
    backgroundAudioManager.onPause()
    this.data.parseLyric.stop()
    clearInterval(this.data.timee)
  },
})