//index.js
//获取应用实例
var config = require('../../config')
const app = getApp()
var playIcon = '../../images/icon/play.png'
var pauseIcon = '../../images/icon/pause.png'
Page({
  data: {
    poster: '../../images/avatar.png',
    songList: [],
    songInfo: {},
    showNavigator: false,
    stateIcon: playIcon,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        poster: app.globalData.userInfo.avatarUrl
      })
      wx.setNavigationBarTitle({
        title: `${app.globalData.userInfo.nickName}的收藏`
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo, 'app.userInfoReadyCallback')
        this.setData({
          poster: res.userInfo.avatarUrl
        })
        wx.setNavigationBarTitle({
          title: `${res.userInfo.nickName}的收藏`
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res.userInfo, 'wx.getUserInfo')
          app.globalData.userInfo = res.userInfo
          this.setData({
            poster: res.userInfo.avatarUrl
          })
          wx.setNavigationBarTitle({
            title: `${res.userInfo.nickName}的收藏`
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
    this.getSongList()
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
  // 根据歌单id获取歌曲列表
  getSongList() {
    if (app.globalData.openid) {
      console.log('getSongList')
      wx.request({
        url: config.service.collectFindByOpenId,
        data: {
          openid: app.globalData.openid
        },
        success:({ data }) => {
          console.log(data)
          this.setData({
            songList: data.data
          })
        }
      })
    } else {
      // 登录
      wx.login({
        success: ({ code }) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(code, 'res.code异步')
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
            data: {
              appid: 'wxa951826c9c76290b',
              secret: '67957573d25420da690f4c6798e0e8a8',
              js_code: code,
              grant_type: 'authorization_code'
            },
            success: ({ data }) => {
              console.log(data, '小程序的openid')
              app.globalData.openid = data.openid
              wx.request({
                url: config.service.collectFindByOpenId,
                data: {
                  openid: data.openid
                },
                success:({ data }) => {
                  console.log(data)
                  this.setData({
                    songList: data.data
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  // 取随机整数
  getRandom() {
    var min = 0,
    max = app.globalData.playList.length - 1
    var num = parseInt(Math.random() * (max - min + 1) + min)
    return num
  },
  // 随机播放
  randomPlay() {
    if (this.data.songList.length) {
      app.globalData.album = {
        id: 1,
        name: "爱的主题",
        poster: "https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/menu1.jpg",
        info: "这世界偷偷爱着你"
      }
      app.globalData.playList = this.data.songList
      let index = this.getRandom()
      console.log(index, '随机数')
      app.globalData.playIndex = index
      let url = '../player/player'
      wx.navigateTo({
        url: url
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '还没有收藏过歌曲呦，快去收藏一波吧O(∩_∩)O~~',
        showCancel: false
      })
    }
  },
  // 播放歌曲
  play(e) {
    app.globalData.album = {
      id: 1,
      name: "爱的主题",
      poster: "https://qcloudtest-1257454171.cos.ap-guangzhou.myqcloud.com/img/menu1.jpg",
      info: "这世界偷偷爱着你"
    }
    app.globalData.playList = this.data.songList
    let index = e.currentTarget.dataset.index
    app.globalData.playIndex = index
    let url = '../player/player'
    console.log(app.globalData.playList, app.globalData.playIndex, '1111111111111')
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
