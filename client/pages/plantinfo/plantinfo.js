//index.js
//获取应用实例
const app = getApp()
const { ajax } = require('../../utils/ajax');
var config = require('../../config')
var { formatTime } = require('../../utils/util.js')
var timee = 0
Page({
  data: {
    id: null,
    article: {},
    rateList: [],
    keyHeight: 0,
    text: null,
    isIpx: app.globalData.isIpx
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.getDetail()
  },
  // 获取文章内容
  getDetail() {
    timee = setTimeout(() => {
      wx.showLoading()
    }, 500)
    ajax({
      url: config.service.plantDetail,
      data: {
        id: this.data.id
      },
      success: ({ data }) => {
        console.log('getDetail', data)
        data.data.createTime = data.data.createTime.slice(5)
        this.setData({
          article: data.data
        })
        this.getRateList()
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        timee && clearTimeout(timee)
        wx.hideLoading()
      }
    })
  },
  // 获取评论列表
  getRateList() {
    ajax({
      url: config.service.getPlantRateList,
      data: {
        id: this.data.id
      },
      success: ({ data }) => {
        console.log(data, 'rateList')
        if (data.data.length) {
          let rateList = data.data.map(item => {
            item.presentTime = item.presentTime.slice(5)
            item.isMine = item.openid == app.globalData.openid
            item.nickName = item.openid == app.globalData.specialName ? '狗子' : item.nickName
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
      fail: err => {
        console.log(err)
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
  // 发表评论
  send() {
    if (this.data.text) {
      console.log('ok')
      ajax({
        method: 'POST',
        url: config.service.addPlantRate,
        data: {
          content: this.data.text,
          plant_id: this.data.id,
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
            this.getRateList()
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
          ajax({
            method: 'PUT',
            url: config.service.removePlantRate,
            data: {
              id: id
            },
            success: () => {
              this.getRateList()
              wx.showToast({
                title: '江湖再见，慢走不送...',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
})