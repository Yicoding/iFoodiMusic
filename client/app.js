var config = require('./config')
const { ajax } = require('./utils/ajax');

//app.js
App({
  data: {
    deviceInfo:{}
  },
  onLaunch: function () {
    this.data.deviceInfo = wx.getSystemInfoSync();
    console.log(this.data.deviceInfo);
    // 登录
    wx.login({
      success: ({ code }) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(code, 'res.code')
        ajax({
          // url: 'https://api.weixin.qq.com/sns/jscode2session',
          // url: 'http://localhost:3003/getOpenId',
          // url: 'https://ilovelyplat.com:3002/getOpenId',
          url: config.service.getOpenId,
          data: {
            // appid: 'wxa951826c9c76290b',
            // secret: '67957573d25420da690f4c6798e0e8a8',
            // js_code: code,
            // grant_type: 'authorization_code'
            code
          },
          success: ({ data }) => {
            console.log(data.data.openid, '小程序的openid')
            this.globalData.openid = data.data.openid
            this.getSetting()
            this.globalData.isAdmin = this.globalData.adminCount.includes(data.data.openid);
          }
        })
      }
    })
    // // 打开调试11
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    this.getSystemInfo()
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
  // 获取设备信息
  getSystemInfo() {
    var _that = this
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        var model = res.model
        if (model.search('iPhone X') != -1 || model.search('iPhone XS') != -1 || model.search('iPhone XR') != -1 || model.search('iPhone XS Max') != -1) {
          _that.globalData.isIpx = true;
        } else {
          _that.globalData.isIpx = false;
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
    isIpx: false, // 是否为iPhone X
    adminCount: ['owaeP4tIVLu3Q7IwWjlAV6stfkpo', 'owaeP4rfixLOekUNAzFyW71rc9rY'], // 管理员账号
    specialName: 'owaeP4rfixLOekUNAzFyW71rc9rY',
    isAdmin: false, // 是否为管理员
  }
})