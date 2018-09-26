//index.js
//获取应用实例
const app = getApp()
var config = require('../../config')
Page({
  data: {
    pageIndex: 0,
    pageSize: 10,
    msgList: [],
    hasMore: false,
    loaded: true,
    info: '数据加载中...',
    num: 0
  },
  onLoad: function () {
    this.getMsgList()
    this.getReadNum()
  },
  onShow() {
    this.getMsgList()
    this.getReadNum()
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    console.log('ok')
    this.setData({
      pageIndex: 0
    })
    this.getMsgList()
    this.getReadNum()
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
      this.getMsgList()
      console.log(this.data.pageIndex)
    }
  },
  // 获取未读消息条数
  getReadNum() {
    wx.request({
      url: config.service.getReadNum,
      data: {
        openid: app.globalData.openid
      },
      success: ({ data }) => {
        console.log(data, 'getReadNum')
        this.setData({
          num: data.data
        })
      }
    })
  },
  // 获取消息列表
  getMsgList() {
    wx.request({
      url: config.service.getMsgList,
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
        openid: app.globalData.openid
      },
      success: ({ data }) => {
        console.log(data)
        this.setData({
          loaded: true
        })
        if (this.data.pageIndex == 0) {
          this.setData({
            msgList: data.data,
          })
        } else {
          this.setData({
            msgList: [...this.data.msgList, ...data.data]
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
  // 查看详情
  goDetail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.request({
      method: 'PUT',
      url: config.service.alterMsg,
      data: {
        id: id
      }
    })
    wx.navigateTo({
      url: `../text/text?&id=${e.currentTarget.dataset.timesid}`
    })
  },
})
