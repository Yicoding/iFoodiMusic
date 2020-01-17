//index.js
//获取应用实例
const app = getApp()
const { ajax } = require('../../utils/ajax');
var config = require('../../config')
Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isFixed: false,
    type: 0,
    order: 'time',
    status: true,
    iconUp: '../../images/icon/arrow-up.png',
    iconDown: '../../images/icon/arrow-down.png',
    addIcon: '../../images/icon/add.png',
    typeArrOne: [],
    foodList: [],
    pageIndex: 0,
    pageSize: 10,
    hasMore: false,
    loaded: true,
    info: '数据加载中...',
    title: '',
    isShow: false,
    isEdit: true
  },
  onLoad: function () {
    setTimeout(() => {
      this.setData({
        isShow: true
      })
    }, 1500)
    console.log(0)
    console.log('index: onLoad')
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo, 'index：存在全局用户信息')
      this.setData({
        userInfo: app.globalData.userInfo
      }, () => {
        console.log(1)
        setTimeout(() => {
          this.setData({
            isShow: true
          })
        }, 1500)
      })
    } else if (this.data.canIUse) {
      console.log('执行this.data.canIUse')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo, 'app.userInfoReadyCallback')
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        }, () => {
          console.log(2)
          setTimeout(() => {
            this.setData({
              isShow: true
            })
          }, 1500)
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
          }, () => {
            console.log(3)
            setTimeout(() => {
              this.setData({
                isShow: true
              })
            }, 1500)
          })
        },
        fail: () => {
          console.log('fail')
        }
      })
    }
    this.getFoodList()
    this.getTypeList()
  },
  onShow() {
    if (app.globalData.timesRefresh) {
      this.setData({
        pageIndex: 0
      })
      this.getFoodList()
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.getTypeList()
      app.globalData.timesRefresh = false
    }
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    this.setData({ pageIndex: 0 })
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
  // 获取菜单列表
  getTypeList() {
    ajax({
      url: config.service.getTypeList,
      success: ({ data }) => {
        console.log('getTypeList', data)
        let typeArrOne = [{
          id: 0,
          img: '../../images/icon/food-3.png',
          text: '全部'
        }, ...data.data, {
          id: '-1',
          text: '设置',
          img: '../../images/icon/setting.png'
        }]
        this.setData({ typeArrOne })
      }
    })
  },
  // 获取列表
  getFoodList(type = null) {
    ajax({
      url: config.service.getFoodList,
      data: {
        title: this.data.title,
        type: type ? type : this.data.type,
        order: this.data.order,
        sort: this.data.status ? 'DESC' : 'ASC',
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
      },
      success: ({ data }) => {
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
      },
      fail: (e) => {
        wx.stopPullDownRefresh()
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
    let type = val.detail ? '0' : ''
    this.getFoodList(type)
  },
  // 选择类别
  checkType(e) {
    let type = e.currentTarget.dataset.type
    if (type == '-1') { // 设置
      return wx.navigateTo({ url: '../setting/setting' })
    }
    this.setData({
      type,
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
  },
  // 切换编辑
  switchEdit() {
    if (app.globalData.isAdmin) {
      this.setData({ isEdit: !this.data.isEdit })
    }
  },
  // 新增美食
  addFood() {
    wx.navigateTo({
      url: '../foodedit/foodedit'
    })
  },
  // 编辑美食
  editFood(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../foodedit/foodedit?id=${id}`
    })
  },
  // 删除美食
  removeFood(e) {
    wx.showModal({
      title: '提示',
      content: '您要抛弃我这道好吃又不胖的美食吗？',
      success: (res) => {
        console.log(res)
        if (res.confirm) {
          let id = e.currentTarget.dataset.id
          ajax({
            method: 'PUT',
            url: config.service.removeFood,
            data: { id },
            success: () => {
              this.setData({ pageIndex: 0 })
              this.getFoodList()
              wx.showToast({
                title: '江湖再见，慢走不送...',
                icon: 'none'
              })
              wx.pageScrollTo({
                scrollTop: 0
              })
            }
          })
        }
      }
    })
  }
})