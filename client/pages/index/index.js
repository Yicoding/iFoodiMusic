//index.js
//获取应用实例
const app = getApp() 
var config = require('../../config')
Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isFixed: false,
    type: 'all',
    order: 'time',
    status: true,
    iconUp: '../../images/icon/arrow-up.png',
    iconDown: '../../images/icon/arrow-down.png',
    typeArrOne: [
      {
        src: '../../images/icon/unburden.png',
        type: 'all',
        text: '全部'
      },
      {
        src: '../../images/icon/unburden.png',
        type: 'chuancai',
        text: '川菜'
      },
      {
        src: '../../images/icon/unburden.png',
        type: 'yuecai',
        text: '粤菜'
      },
      {
        src: '../../images/icon/unburden.png',
        type: 'xiangcai',
        text: '湘菜'
      },
      {
        src: '../../images/icon/unburden.png',
        type: 'zhushi',
        text: '主食'
      },
    ],
    foodList: [],
    pageIndex: 0,
    pageSize: 10,
    hasMore: false,
    loaded: true,
    info: '数据加载中...',
    title: ''
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo, 'app.userInfoReadyCallback')
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res.userInfo, 'wx.getUserInfo')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    this.getFoodList()
  },
  // 监听用户滑动页面事件
  onPageScroll(e) {
    let scrollTop = e.scrollTop
    if (scrollTop >= 90) {
      this.setData({
        isFixed: true
      })
    } else {
      this.setData({
        isFixed: false
      })
    }
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
      this.getFoodList()
      console.log(this.data.pageIndex)
    }
  },
  // 获取列表
  getFoodList(type=null) {
    wx.request({
      url: config.service.getFoodList,
      data: {
        title: this.data.title,
        type: type? type : this.data.type,
        order: this.data.order,
        sort: this.data.status ? 'DESC' : 'ASC',
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
      },
      success:({ data }) => {
        this.setData({
          loaded: true
        })
        console.log(data)
        if (this.data.pageIndex == 0) {
          this.setData({
            foodList: data.data,
          })
        } else {
          this.setData({
            foodList: [...this.data.foodList, ...data.data]
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
  // 搜索
  search(val) {
    console.log(val.detail, 'val')
    this.setData({
      title: val.detail
    })
    let type = val.detail ? 'all' : ''
    this.getFoodList(type)
  },
  // 选择类别
  checkType(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      type: type
    })
    this.selectComponent("#search").empty()
    this.getFoodList()
  },
  // 选择排序方式
  checkOrder(e) {
    let order = e.currentTarget.dataset.order
    this.setData({
      order: order
    })
    this.getFoodList()
  },
  // 切换顺序
  switchStatus() {
    this.setData({
      status: !this.data.status
    })
    this.getFoodList()
  }
})
