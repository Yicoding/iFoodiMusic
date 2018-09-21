//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: ({ code }) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(code, 'res.code')
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
          data: {
            appid: 'wxa951826c9c76290b',
            secret: '3ad8c27bb84a60a4fb71714b7741713c',
            js_code: code,
            grant_type: 'authorization_code'
          },
          success: ({ data }) => {
            console.log(data, '小程序的openid')
            this.globalData.openid = data.openid
            this.getSetting()
          }
        })
      }
    })
    // 打开调试
    wx.setEnableDebug({
      enableDebug: true
    })
  },
  // 获取用户信息
  getSetting() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo, 'res.userInfo')
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              wx.getUserInfo({
                success: res => {
                  console.log(res.userInfo, '弹框确认获取到的用户信息res.userInfo')
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    openid: null, // 用户的openid
    userInfo: null, // 用户信息
    album: null, // 当前专辑信息
    playList: [], // 播放列表
    playIndex: 0, // 当前播放歌曲index
    mode: 'multiple', // 循环模式 multiple: 循环播放, single: 单曲循环
    imgRotate: 0, // 封面旋转角度
    timesRefresh: false, // 好时光页面是否要刷新
  }
})