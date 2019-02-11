//index.js
//获取应用实例
const app = getApp()
var config = require('../../config')
var { formatTime } = require('../../utils/util.js')
Page({
  data: {
    id: null,
    food: {},
    imgList: [],
    rateList: [],
    keyHeight: 0,
    text: '',
    isIpx: app.globalData.isIpx
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    console.log(options)
    this.getFoodDetail()
    this.getFoodImg()
    this.getFoodRate()
    console.log(app.globalData.isIpx)
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    let item = this.data.food.cover
    let urls = [item]
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
    wx.stopPullDownRefresh()
  },
  // 监听用户上拉触底事件
  onReachBottom(e) {
    console.log('到底了')
  },
  // 获取食物信息
  getFoodDetail() {
    wx.request({
      url: config.service.getFoodDetail,
      data: {
        id: this.data.id
      },
      success: ({ data }) => {
        console.log(data)
        this.setData({
          food: data.data
        })
      },
      fail: (err) => {
        console.log(err, 'err')
      }
    })
  },
  // 获取图片列表
  getFoodImg() {
    wx.request({
      url: config.service.getFoodImg,
      data: {
        id: this.data.id
      },
      success: ({ data }) => {
        console.log(data)
        if (data.data.length) {
          this.setData({
            imgList: data.data
          })
        }
      },
      fail: (err) => {
        console.log(err, 'err')
      }
    })
  },
  // 获取食物评价
  getFoodRate(id) {
    wx.request({
      url: config.service.getFoodRate,
      data: {
        id: this.data.id
      },
      success: ({ data }) => {
        console.log(data)
        if (data.data.length) {
          let rateList = data.data.map(item => {
            item.presentTime = item.presentTime.slice(5)
            item.isMine = item.openid == app.globalData.openid
            item.nickName = item.openid == 'owaeP4rfixLOekUNAzFyW71rc9rY' ? '狗子' : item.nickName
            return item
          })
          this.setData({
            rateList: rateList
          })
        } else {
          this.setData({
            rateList: []
          })
        }
      },
      fail: (err) => {
        console.log(err, 'err')
      }
    })
  },
  // 键盘输入时触发
  textChange(e) {
    console.log(e)
    this.setData({
      text: e.detail.value.trim()
    })
  },
  // 输入框聚焦时触发
  keyFocus(e) {
    console.log(e.detail)
    this.setData({
      keyHeight: e.detail.height
    })
  },
  // 输入框失去焦点时触发
  keyBlur() {
    this.setData({
      keyHeight: 0
    })
  },
  // 发表评论
  send() {
    if (this.data.text) {
      console.log('ok')
      wx.request({
        method: 'POST',
        url: config.service.addFoodRate,
        data: {
          content: this.data.text,
          food_id: this.data.id,
          openid: app.globalData.openid,
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          presentTime: formatTime(new Date())
        },
        success: ({ data }) => {
          console.log(data)
          if (data.code == 0) {
            wx.showToast({
              title: '成功凑得热闹，啦啦啦O(∩_∩)O~~',
              icon: 'none'
            })
            this.setData({
              text: null
            })
            this.getFoodRate()
            app.globalData.timesRefresh = true
          } else {
            wx.showToast({
              title: '发表失败，请重新发送',
              icon: 'none'
            })
          }
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '服务器抛出个错误并砸向你',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showModal({
        title: '主人',
        content: '别闹，您什么都没写呢╮(╯▽╰)╭',
        showCancel: false
      })
    }
  },
  // 删除评论
  removeRate(e) {
    wx.showModal({
      title: '主人',
      content: '您要抛弃小乖吗￣へ￣，我会不开心的',
      success: (res) => {
        console.log(res)
        if (res.confirm) {
          let id = e.currentTarget.dataset.id
          wx.request({
            method: 'DELETE',
            url: config.service.removeFoodRate,
            data: {
              id: id
            },
            success: () => {
              this.getFoodRate()
              wx.showToast({
                title: '江湖再见，慢走不送...',
                icon: 'none'
              })
              app.globalData.timesRefresh = true
            }
          })
        }
      }
    })
  },
  // 去个人中心
  goUserCenter(e) {
    let item = e.currentTarget.dataset
    wx.setStorage({
      key: 'userInfo',
      data: {
        openid: item.openid,
        nickname: item.nickname,
        avatarurl: item.avatarurl
      },
      success: () => {
        wx.navigateTo({
          url: '../user/user'
        })
      }
    })
  },
  // 预览照片
  viewImage(e) {
    let current = e.currentTarget.dataset.current
    let urls = this.data.imgList.map(item => item.src)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
})
