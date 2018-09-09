//index.js
//获取应用实例
const app = getApp();
var Base64 = require('../../utils/base64.js').Base64
var Lyric = require('../../utils/lyric-parse.js').default
var stop = null
Page({
  data: {
    item: {}, // 歌曲信息
    sliderValue: 0, // 滑块的值
    playStatus: 0, // 播放状态
    duration: 0, // 音频的长度（单位：s）
    currentPosition: 0, // 音频的播放位置（单位：s）
    timee: 0, // 定时器 根据歌曲进度改变slider进度
    parseLyric: '', // 解析的歌词
    mode: 'multiple', // 循环模式
    coverImg: '',
    imgRotate: 0,
  },
  onLoad(options) {
    
  },
  onUnload() {
    
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
})
