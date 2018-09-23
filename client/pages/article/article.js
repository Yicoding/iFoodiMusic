//index.js
//获取应用实例
const app = getApp()
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
    wx.request({
      url: config.service.articleDetail,
      data: {
        id: this.data.id
      },
      success: ({ data }) => {
        console.log(data)
        data.data.presentTime = data.data.presentTime.slice(5)
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
    wx.request({
      url: config.service.getArticleRateList,
      data: {
        id: this.data.id
      },
      success: ({ data }) => {
        console.log(data, 'rateList')
        if (data.data.length) {
          data.data.forEach(item => {
            item.presentTime = item.presentTime.slice(5)
            item.isMine = false
            if (item.openid == app.globalData.openid) {
              item.isMine = true
            }
          });
          this.setData({
            rateList: data.data
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
  // 发表评论
  send() {
    if (this.data.text) {
      console.log('ok')
      wx.request({
        method: 'POST',
        url: config.service.addArticleRate,
        data: {
          content: this.data.text,
          wall_id: this.data.id,
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
            title: '服务器异常',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '你还没有填写呦╮(╯▽╰)╭',
        showCancel: false
      })
    }
  },
  // 删除评论
  removeRate(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要抛弃我吗￣へ￣',
      success: (res) => {
        console.log(res)
        if (res.confirm) {
          let id = e.currentTarget.dataset.id
          wx.request({
            method: 'DELETE',
            url: config.service.removeArticleRate,
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