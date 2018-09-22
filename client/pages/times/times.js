//index.js
//获取应用实例
const app = getApp()
var config = require('../../config')
var { parseEmoji } = require('../../utils/emoji.js')
Page({
  data: {
    html: '',
    pageIndex: 0,
    pageSize: 10,
    timesList: [],
    hasMore: false,
    loaded: true,
    info: '',
  },
  onLoad: function () {
    console.log('onLoad')
    this.findAllTimes()
  },
  onShow() {
    console.log('onShow')
    if (app.globalData.timesRefresh) {
      console.log(this.data.pageIndex)
      console.log('timesRefresh')
      this.setData({
        pageIndex: 0
      })
      this.findAllTimes()
      app.globalData.timesRefresh = false
    }
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    console.log('ok')
    this.setData({
      pageIndex: 0
    })
    this.findAllTimes()
  },
  // 监听用户上拉触底事件
  onReachBottom(e) {
    console.log('到底了')
    if (this.data.hasMore) {
      this.setData({
        pageIndex: this.data.pageIndex + 1,
        loaded: false,
        info: '数据加载中...'
      })
      this.findAllTimes()
      console.log(this.data.pageIndex)
    }
  },
  // 获取列表
  findAllTimes() {
    wx.request({
      url: config.service.findAllTimes,
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      },
      success:({ data }) => {
        this.setData({
          loaded: true
        })
        console.log(data)
        data.data.forEach(item => {
          item.present_time = item.present_time.slice(5)
          item.content = parseEmoji(item.content)
        })
        if (this.data.pageIndex == 0) {
          this.setData({
            timesList: data.data,
          })
        } else {
          this.setData({
            timesList: [...this.data.timesList, ...data.data]
          })
        }
        wx.stopPullDownRefresh()
        if (data.data.length == 10) {
          this.setData({
            hasMore: true
          })
        } else {
          this.setData({
            hasMore: false,
            info: '没有更多啦~\(≧▽≦)/~啦啦啦'
          })
        }
      }
    })
  },
  // 预览照片
  viewImage(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.urls // 需要预览的图片http链接列表
    })
  },
  // 新增
  toPresent() {
    wx.navigateTo({
      url: '../present/present'
    })
  },
  // 去个人中心
  goUserCenter(e) {
    let item = e.currentTarget.dataset
    if (item.type == 'mine') {
      if (!!app.globalData.openid) {
        wx.navigateTo({
          url: `../user/user?&openid=${app.globalData.openid}`
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '你还没有登录呦╮(╯▽╰)╭',
          showCancel: false
        })
      }
    } else {
      wx.navigateTo({
        url: `../user/user?&openid=${item.openid}`
      })
    }
  },
  // 查看详情
  goDetail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../text/text?&id=${id}`
    })
  }
})
