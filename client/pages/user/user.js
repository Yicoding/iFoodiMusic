//index.js
//获取应用实例
const app = getApp()
var config = require('../../config')
var { parseEmoji } = require('../../utils/emoji.js')
Page({
  data: {
    userInfo: {},
    pageIndex: 0,
    pageSize: 10,
    timesList: [],
    hasMore: false,
    loaded: false,
    info: '数据加载中...',
    isDelete: false,
    total: 0,
  },
  onLoad: function () {
    var userInfo = wx.getStorageSync('userInfo')
    var isDelete = app.globalData.openid == userInfo.openid ? true : false
    console.log(userInfo, 'userInfo')
    this.setData({
      userInfo: userInfo,
      isDelete: isDelete
    })
    this.findTimesByOpenid()
    this.findTimesNumByOpenid()
  },
  onShow() {
    console.log('onShow')
    if (app.globalData.timesRefresh) {
      console.log(this.data.pageIndex)
      console.log('timesRefresh')
      this.setData({
        pageIndex: 0
      })
      this.findTimesByOpenid()
      app.globalData.timesRefresh = false
    }
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    console.log('ok')
    this.setData({
      pageIndex: 0
    })
    this.findTimesByOpenid()
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
      this.findTimesByOpenid()
      console.log(this.data.pageIndex)
    }
  },
  // 获取数目
  findTimesNumByOpenid() {
    wx.request({
      url: config.service.findTimesNumByOpenid,
      data: {
        openid: this.data.userInfo.openid
      },
      success: ({ data }) => {
        console.log(data)
        this.setData({
          total: data.data.total
        })
      }
    })
  },
  // 获取列表
  findTimesByOpenid() {
    if (this.data.pageIndex == 0) {
      wx.showLoading({
        title: '加载中'
      })
    }
    wx.request({
      url: config.service.findTimesByOpenid,
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
        openid: this.data.userInfo.openid
      },
      success:({ data }) => {
        if (this.data.pageIndex == 0) {
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              loaded: true
            })
          }, 800)
        } else {
          this.setData({
            loaded: true
          })
        }
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
  // 查看详情
  goDetail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../text/text?&id=${id}`
    })
  },
  // 删除
  remove(e) {
    wx.showModal({
      title: '主人',
      content: '您要抛弃小乖吗￣へ￣，我会不开心的',
      success: (res) => {
        console.log(res)
        if (res.confirm) {
          let id = e.currentTarget.dataset.id
          wx.request({
            method: 'PUT',
            url: config.service.removeTimes,
            data: {
              id: id
            },
            success: () => {
              this.findTimesByOpenid()
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
  }
})