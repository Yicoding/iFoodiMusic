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
        src: '../../images/icon/food-3.png',
        type: 'all',
        text: '全部'
      },
      {
        src: '../../images/icon/food-4.png',
        type: 'chuancai',
        text: '川菜'
      },
      {
        src: '../../images/icon/food-7.png',
        type: 'jiachangcai',
        text: '家常菜'
      },
      {
        src: '../../images/icon/food-11.png',
        type: 'xiangcai',
        text: '湘菜'
      },
      {
        src: '../../images/icon/food-8.png',
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
    title: '',
    isShow: false
  },
  onLoad: function () {
    console.log('index: onLoad')
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo, 'index：存在全局用户信息')
      this.setData({
        userInfo: app.globalData.userInfo
      },() => {
        this.setData({
          isShow: true
        })
      })
    } else if (this.data.canIUse){
      console.log('执行this.data.canIUse')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo, 'app.userInfoReadyCallback')
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        },() => {
          this.setData({
            isShow: true
          })
        })
      }
    } else {
      console.log('index: 最后情况')
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res.userInfo, 'wx.getUserInfo')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          },() => {
            setTimeout(() => {
              this.setData({
                isShow: true
              })
            }, 500)
          })
        }
      })
    }
    this.getFoodList()
  },
  onShow() {
    if (app.globalData.timesRefresh) { 
      this.setData({
        pageIndex: 0
      })
      this.getFoodList()
      app.globalData.timesRefresh = false
    }
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
  getuserInfo(e) {
    let userInfo = e.detail.userInfo
    console.log(userInfo)
    this.setData({
      userInfo: userInfo
    })
    app.globalData.userInfo = userInfo
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
            app.globalData.openid = data.openid
          }
        })
      }
    })
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
        data.data.forEach(item => {
          item.time = item.time.slice(0, 10)
        })
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
      title: val.detail,
      pageIndex: 0
    })
    let type = val.detail ? 'all' : ''
    this.getFoodList(type)
  },
  // 选择类别
  checkType(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      type: type,
      pageIndex: 0
    })
    this.selectComponent("#search").empty()
    this.getFoodList()
  },
  // 选择排序方式
  checkOrder(e) {
    let order = e.currentTarget.dataset.order
    this.setData({
      order: order,
      pageIndex: 0
    })
    this.getFoodList()
  },
  // 切换顺序
  switchStatus() {
    this.setData({
      status: !this.data.status,
      pageIndex: 0
    })
    this.getFoodList()
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
  // 进入食物详情
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../food/food?id=${id}`
    })
  }
})