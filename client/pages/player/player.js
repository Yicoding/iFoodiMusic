//index.js
//获取应用实例
const app = getApp()
var Base64 = require('../../utils/base64.js').Base64
Page({
  data: {
    sliderValue: 0, // 滑块的值
    playStatus: false, // 播放状态
    duration: 0, // 音频的长度（单位：s）
    currentPosition: 0, // 音频的播放位置（单位：s）
    timee: 0, // 定时器 根据歌曲进度改变slider进度
  },
  onLoad(options) {
    this.getLyric()
    if (options.item) {
      console.log(app.globalData.playList, 'playList')
      let item = JSON.parse(options.item)
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
    let lyric = Base64.decode('W3RpOuiKseWEv+e6s+WQiV0KW2FyOua0m+WkqeS+nS/oqIDlkoxdClthbDromZrmi5/muLjkuZDlnLpdCltieTpdCltvZmZzZXQ6MF0KWzAwOjAwLjE4XeiKseWEv+e6s+WQiSAtIOa0m+WkqeS+nS/oqIDlkowKWzAwOjAwLjU0Xeivje+8mmlsZW0KWzAwOjAwLjY0Xeabsu+8mmlsZW0KWzAwOjAwLjc0Xeiwg+aVme+8mmlsZW0KWzAwOjAwLjkyXQpbMDA6MTIuMzBd5ZCI77yaClswMDoxMi45OV0KWzAwOjE3LjAxXei/nOaWueeahOaci+WPiwpbMDA6MTguOTBd5L2g5ZSx55qE5piv5LuA5LmI5q2MClswMDoyMy43OF0KWzAwOjI0LjQ5XeiogO+8mgpbMDA6MjUuMDRdClswMDoyOC4xN13mnIDpq5jmnIDov5zmmK/lpKnlpJblpKkKWzAwOjMwLjE3Xea0m++8mgpbMDA6MzAuNTJd6auY5aSp5LmL5LiK5pyJ56We5LuZClswMDozMi45M13oqIDvvJoKWzAwOjMzLjI3XeaXpeaciOWwseWcqOmCo+WkqeS4iuS9jwpbMDA6MzUuMzFd5ZCI77yaClswMDozNS42M13kv53kvZHohJrkuIvnmoTlranlrZDku6zlpb3lkIPnqb8KWzAwOjM3Ljk4Xea0m++8mgpbMDA6MzguMjZd5bGx6L+e5bGx5p2l5rC057uV5rC0ClswMDo0MC41OV3lsbHmsLTlhbvogrLkuobkupTosLfogqUKWzAwOjQyLjgyXeiogO+8mgpbMDA6NDMuMTRd5pyA5aW955qE57Gz5p2l5pyA5aW955qE5rOJClswMDo0NS42Ml3nrYnpgqPmnIDlpb3nmoTnvo7phZIKWzAwOjQ2Ljg0XemFv+S4ieW5tApbMDA6NDcuODJd5rSb77yaClswMDo0OC4zMV3kuIDmlazlpKnmnaXpo47pm6josIMKWzAwOjUwLjgwXeS6jOaVrOWkp+WcsOmCo+mVv+emvuiLlwpbMDA6NTMuMzdd5LiJ5pWs5aSq6ZizClswMDo1NC42N13lho3mlazmnIjkuq4KWzAwOjU1LjU3XeiogO+8mgpbMDA6NTUuODhd5p2l5ZCn6L+Z5LiA5p2v5pWs55qEClswMDo1Ny4wOV3mmK/ov5zmnaXnmoTlrqIKWzAwOjU4LjExXeWQiO+8mgpbMDA6NTguMzVd56m/6Iqx55qE6J206J2257+p57+p6aOeClswMTowMC44NF3lkrHlrrbnmoTotLXlrqLkvaDlubLkuIDmna8KWzAxOjAzLjM5XeWFiOelneelluWFiApbMDE6MDQuNzld5YaN56Wd54i35aiYClswMTowNS45NF0KWzAxOjA3LjA3XeiKguiKguacqOWEv+WhngpbMDE6MDguMjRd5ZCI77yaClswMTowOC41N13oirHpl7TnmoTonbTonbbkuIDlr7nlr7kKWzAxOjEwLjk4Xei0teWuouWAkuayoemGieaIkeWFiOmGiQpbMDE6MTMuNDld5b+D6YeM5aS05oOz55qE5piv5LiA5LiH5Y+lClswMToxNS44N13liLDkuoblmLTph4zlpLTllLHnmoQKWzAxOjE3LjE2XeaYr+iKseWEv+e6s+WQiQpbMDE6MTguMjNd5rSb77yaClswMToxOC42N13oirHmiJDlj4wKWzAxOjE5LjcyXem4n+aIkOaOkgpbMDE6MjEuMDFd5p+U6IKg55m+57uT5Y+j6Zq+5byAClswMToyMy41OV3ov5zov5zlkKzop4HkuobmrYzlo7AKWzAxOjI1LjU1XeaCoOaCoOadpQpbMDE6MjYuODRd6KiA77yaClswMToyNy4zNF3oioLoioLmnKjlhL/loZ4KWzAxOjI4LjQ5XQpbMDE6MzAuMzdd5Zeo5Za95Zi/5ZGAClswMTozMy4wOF0KWzAxOjM0LjY2XeiKseWEv+e6s+WQiQpbMDE6MzYuMjNdClswMTozOC41OV3oirHlhL/nurPlkIkKWzAxOjQwLjkwXeWQiO+8mgpbMDE6NDEuMzFdClswMTo0Ny43OF3otavllr0KWzAxOjQ4LjMxXei1q+WWveWkp+WxseWWveW3jeW3jQpbMDE6NDkuNzVd5bCP5rKz5reM5r265r26ClswMTo1MS4yOF3mtJvvvJoKWzAxOjUxLjk3XemCo+WnkeWomOe+juWmguawtApbMDE6NTMuNDNd6KiA77yaClswMTo1My45NV3pgqPlkI7nlJ/lo67lpoLlsbEKWzAxOjU1Ljc1Xea0m++8mgpbMDE6NTUuOTRd6Iqx5YS/57qz5ZCJClswMTo1Ni41NF3lv4PkuK3ol4/nnYDkuIDnr5PnmoTor50KWzAxOjU4LjU1XeaDs+ivtOWPiOS4jeaVogpbMDI6MDAuMTBdClswMjowMC44MF3lkKzop4HmrYzlo7DmgoTmgoTmiqzlpLTnnIsKWzAyOjAzLjI4XQpbMDI6MDMuNzhd6KiA77yaClswMjowNC4xNV3oioLoioLmnKjlhL/loZ4KWzAyOjA1LjI3XeS7hOWWvQpbMDI6MDUuNzdd5LuE5Za9ClswMjowNi4xOF3mvILkuq7nmoTlprnlprkKWzAyOjA3LjIzXei3n+aIkeadpeWUseWxseatjOWWvQpbMDI6MDkuMjBd5rSb77yaClswMjowOS41M13miJHpmo/kvaDmnaXllLHlsbHmrYzllr0KWzAyOjExLjIzXeiogO+8mgpbMDI6MTEuNjRd5bCx5oiR5ZSx5L2g5p2l5ZKMClswMjoxMy4yNl0KWzAyOjE0LjA0Xea0m++8mgpbMDI6MTQuMzRd5q2M5aOw5rqc5rqc5omT5oiQ5LqG57uTClswMjoxNi4xNl3miorkvaDnmoTlv4PmnaXnibUKWzAyOjE3LjY1Xea0m++8mgpbMDI6MTguMjVd54m15bGx54m15rC05LiA54m15bCx5LiA5Y2D5bm0ClswMjoyMS4wOF3oqIDvvJoKWzAyOjIxLjUwXeiKguiKguacqOWEv+WhngpbMDI6MjIuNTddClswMjozMC42Ml3oirHoirHlhL/lmJ4KWzAyOjMxLjQ3XQpbMDI6NDEuNTVd5Zeo5Za95Zi/5ZGAClswMjo0Mi4yOF0KWzAyOjQ2LjM0XeiKseWEv+e6s+WQiQpbMDI6NDguMDBdClswMjo0OC45NV3lkIjvvJoKWzAyOjQ5LjQ3XQpbMDI6NTcuNzdd6L+c5pa555qE5pyL5Y+L5L2g5ZSx55qE5piv5LuA5LmI5q2MClswMzowMy4xNV0KWzAzOjE1LjIxXei1q+WWvQpbMDM6MTUuNTRd6LWr5Za9ClswMzoxNi4xNl3lpKflsbHllr3lt43lt40KWzAzOjE3LjIxXeWwj+ays+a3jOa9uua9ugpbMDM6MTguODJd5rSb77yaClswMzoxOS4yMl3pgqPlp5HlqJjnvo7lpoLmsLQKWzAzOjIxLjA0XeiogO+8mgpbMDM6MjEuNTBd6YKj5ZCO55Sf5aOu5aaC5bGxClswMzoyMi45OV3mtJvvvJoKWzAzOjIzLjI3XeiKseWEv+e6s+WQiQpbMDM6MjMuOTRd5b+D5Lit6JeP552A5LiA56+T55qE6K+dClswMzoyNS44OF3mg7Por7Tlj4jkuI3mlaIKWzAzOjI3LjM3XeiogO+8mgpbMDM6MjcuODhd6Iqx6Iqx5YS/5ZieClswMzoyOC42MV3mtJvvvJoKWzAzOjI4Ljk0XeWQrOingeatjOWjsOaChOaChOaKrOWktOeciwpbMDM6MzAuNzJdClswMzozMS40NV3oirHlhL/nurPlkIkKWzAzOjMyLjMwXeiogO+8mgpbMDM6MzIuNThd5LuE5Za9ClswMzozMy4wNF3ku4Tllr0KWzAzOjMzLjQxXea8guS6rueahOWmueWmuQpbMDM6MzQuNTVd6Lef5oiR5p2l5ZSx5bGx5q2M5Za9ClswMzozNi4xOF3mtJvvvJoKWzAzOjM2LjQ5XeiKseWEv+e6s+WQiQpbMDM6MzcuMDFd5oiR6ZqP5L2g5p2l5ZSx5bGx5q2M5Za9ClswMzozOC40Ml3oqIDvvJoKWzAzOjM4Ljc0XeWwseaIkeWUseS9oOadpeWSjApbMDM6NDAuNDNd6Iqx6Iqx5YS/5ZieClswMzo0MS4zOV3mtJvvvJoKWzAzOjQxLjY5XeatjOWjsOa6nOa6nOaJk+aIkOS6hue7kwpbMDM6NDMuNTld5oqK5L2g55qE5b+D5p2l54m1ClswMzo0NC44OV0KWzAzOjQ1LjU2XeeJteWxseeJteawtOS4gOeJteWwseS4gOWNg+W5tApbMDM6NDguMzRd6KiA77yaClswMzo0OC43Ml3oirHoirHlhL/lmJ4=')
    console.log(lyric)
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
          wx.setNavigationBarTitle({
            title: app.globalData.playList[app.globalData.playIndex].name
          })
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
