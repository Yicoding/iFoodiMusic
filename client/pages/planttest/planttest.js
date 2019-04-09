//index.js
//获取应用实例
const app = getApp()
var config = require('../../config')
Page({
  data: {
    pageIndex: 0,
    pageSize: 10,
    wallList: [],
    hasMore: false,
    loaded: true,
    info: '数据加载中...',
    isAdmin: false,
  },
  onLoad: function () {
    this.getPlantList()
  },
  onShow() {
    this.setData({ isAdmin: app.globalData.isAdmin })
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    console.log('ok')
    this.setData({
      pageIndex: 0
    })
    this.getPlantList()
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
      this.getPlantList()
      console.log(this.data.pageIndex)
    }
  },
  // 获取文章列表
  getPlantList() {
    wx.request({
      url: config.service.getPlantList,
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      },
      success: ({ data }) => {
        console.log(data)
        this.setData({
          loaded: true
        })
        data.data.forEach(item => {
          item.createTime = item.createTime.slice(5)
        })
        if (this.data.pageIndex == 0) {
          this.setData({
            wallList: data.data,
          })
        } else {
          this.setData({
            wallList: [...this.data.wallList, ...data.data]
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
  // 跳转到详情页
  goWallDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../plantinfo/plantinfo?id=${id}`
    })
  },
  // 预览照片
  viewImage(e) {
    console.log(e)
    let urls = [e.currentTarget.dataset.urls]
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 新增
  toPresent() {
    wx.navigateTo({
      url: '../plantedit/plantedit'
    })
  },
})
