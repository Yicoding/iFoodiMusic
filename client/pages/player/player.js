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
    this.getLyric()
    if (options.item) {
      console.log(app.globalData.playList, 'playList')
      let item = JSON.parse(options.item)
      this.setData({
        item: JSON.parse(options.item)
      })
      console.log(item)
      wx.setNavigationBarTitle({
        title: item.name
      })
      this.init(item)
    } else {
      console.log('不存在')
    }
  },
  getLyric() {
    let lyric = Base64.decode('W3RpOuWQjOagt+eahOaDheivnV0KW2FyOuWogeS7lC/ljZXkuZ3luIxdClthbDrlkIzmoLfnmoTmg4Xor51dCltieTpdCltvZmZzZXQ6MF0KWzAwOjAwLjI1XeWQjOagt+eahOaDheivnSAtIOWogeS7lC/ljZXkuZ3luIwKWzAwOjAxLjExXeivje+8muWogeS7lApbMDA6MDEuNzJd5puy77ya5aiB5LuUClswMDowMi42MF3lpbPvvJrlkIzmoLfnmoTmg4Xor50KWzAwOjA0LjY3XeS9oOWcqOiwgeiAs+i+uemHjeWkjeS6huWHoOmBjQpbMDA6MDguMTRd5L2g5Y205rKh5pyJ6IS457qi5b+D6Lez5LiN5YePClswMDoxMS41OV0KWzAwOjEyLjc3XeWOn+acrOeCmeeDreeahOW/gwpbMDA6MTQuODBd6KKr5L2g5Ya757uT54ix6LWw5ZCR5bm754GtClswMDoxOC4wMV3miJHku6znmoTlm57lv4bpg73ooqvkvaDmkpXnoo4KWzAwOjIyLjAyXQpbMDA6MjIuOTJd55S377ya54K554eD5LqG6aaZ54OfClswMDoyNS43MF3ljbTmiJLkuI3mjonmgJ3lv7UKWzAwOjI4LjAyXeWcqOi/mSDnqbrmsJTnqIDoloTnmoTmiL/pl7QKWzAwOjMzLjc2XeWcqOi/meS4gOeerOmXtApbMDA6MzUuNThd5oCd5b+156qB54S25aW95by654OIClswMDozOC4wMV3lpI/lpKkg5piv5Liq5Lyk5oSf55qE5a2j6IqCClswMDo0Mi42NV0KWzAwOjQzLjY3XeacgOWQjueahOaDheiKggpbMDA6NDUuNDdd5L2g6Lqr5peB54m155qE5piv6LCBClswMDo0Ny43NV3kvKroo4Ug6YO95Y+Y5b6X6YKj5LmI6IKk5rWFClswMDo1Mi4wN10KWzAwOjUzLjQzXeayoeS9oOeahOa1t+i+uQpbMDA6NTUuMzJd6Ziz5YWJ5qC85aSW55qE5Yi655y8ClswMDo1Ny44MV3osIHov5gg6K6w5b6X5b2T5Yid55qE6KqT6KiAClswMTowMi4wOF3lpbPvvJrlkIzmoLfnmoTmg4Xor50KWzAxOjA0LjEwXeS9oOWcqOiwgeiAs+i+uemHjeWkjeS6huWHoOmBjQpbMDE6MDcuNDRd5L2g5Y205rKh5pyJ6IS457qi5b+D6Lez5LiN5YePClswMToxMi40N13ljp/mnKzngpnng63nmoTlv4MKWzAxOjE0LjI4Xeiiq+S9oOWGu+e7k+eIsei1sOWQkeW5u+eBrQpbMDE6MTcuMzZd5oiR5Lus55qE5Zue5b+G6YO96KKr5L2g5pKV56KOClswMToyMS4xN10KWzAxOjIyLjA1XeeUt++8mueCueeHg+S6hummmeeDnwpbMDE6MjUuMTNd5Y205oiS5LiN5o6J5oCd5b+1ClswMToyNy41N13lnKjov5kg56m65rCU56iA6JaE55qE5oi/6Ze0ClswMTozMS40NF0KWzAxOjMzLjA4XeWcqOi/meS4gOeerOmXtApbMDE6MzUuMDNd5oCd5b+156qB54S25aW95by654OIClswMTozNy4zN13lpI/lpKkg5piv5Liq5Lyk5oSf55qE5a2j6IqCClswMTo0MS44MV0KWzAxOjQzLjAxXeacgOWQjueahOaDheiKggpbMDE6NDQuOTBd5L2g6Lqr5peB54m155qE5piv6LCBClswMTo0Ny4zMV3kvKroo4Ug6YO95Y+Y5b6X6YKj5LmI6IKk5rWFClswMTo1MS4xOF0KWzAxOjUyLjkzXeayoeS9oOeahOa1t+i+uQpbMDE6NTQuNzNd6Ziz5YWJ5qC85aSW55qE5Yi655y8ClswMTo1Ny4yMl3osIHov5gg6K6w5b6X5b2T5Yid55qE6KqT6KiAClswMjowMS4zNF3lpbPvvJrlkIzmoLfnmoTmg4Xor50KWzAyOjAzLjU1XeS9oOWcqOiwgeiAs+i+uemHjeWkjeS6huWHoOmBjQpbMDI6MDYuODFd5L2g5Y205rKh5pyJ6IS457qi5b+D6Lez5LiN5YePClswMjoxMS42OV3ljp/mnKzngpnng63nmoTlv4MKWzAyOjEzLjY0Xeiiq+S9oOWGu+e7k+eIsei1sOWQkeW5u+eBrQpbMDI6MTYuNzhd5oiR5Lus55qE5Zue5b+G6YO96KKr5L2g5pKV56KOClswMjoyMC43OF3lkIjvvJrlkIzmoLfnmoTmg4Xor50KWzAyOjIzLjI1XeS9oOWcqOiwgeiAs+i+uemHjeWkjeS6huWHoOmBjQpbMDI6MjYuNThd5L2g5Y205rKh5pyJ6IS457qi5b+D6Lez5LiN5YePClswMjozMS40NV3ljp/mnKzngpnng63nmoTlv4MKWzAyOjMzLjQyXeiiq+S9oOWGu+e7k+eIsei1sOWQkeW5u+eBrQpbMDI6MzYuNTZd5oiR5Lus55qE5Zue5b+G6YO96KKr5L2g5pKV56KO')
    // console.log(lyric)
    this.setData({
      parseLyric: new Lyric(lyric, this.handleLyric)
    })
    // let parseLyric = new Lyric(lyric, this.handleLyric)
    // parseLyric.seek(0)
    this.data.parseLyric.play()
    // console.log(Lyric)
    // console.log(parseLyric, 'parseLyric')
    // setInterval(() => {
    //   let pureMusicLyric = parseLyric.lrc.replace(timeExp, '').trim()
    //   console.log(pureMusicLyric)
    // },1000)
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
    if (bgMusic.title !== item.name) {
      this.play(item)
    } else {
      this.setTimee()
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
    this.data.timee = setInterval(() => {
      this.setDuration()
    }, 1000)
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
