//index.js
//获取应用实例

var app = getApp()
var config = require('../../config')

Page({
  data: {
    height: 0,
    scrollY: true,
    pageIndex: 0,
    pageSize: 10,
    wallList: [],
    hasMore: false,
    loaded: false,
    info: '数据加载中...',
    isAdmin: false,
  },
  swipeCheckX: 20, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 175, //消息列表项最大左滑距离
  correctMoveLeft: 165, //显示菜单时的左滑距离
  thresholdMoveLeft: 45,//左滑阈值，超过则显示菜单
  lastShowMsgId: '', //记录上次显示菜单的消息id
  moveX: 0,  //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
  onLoad: function () {
    this.getTypeList()
    this.pixelRatio = app.data.deviceInfo.pixelRatio;
    var windowHeight = app.data.deviceInfo.windowHeight;
    var height = windowHeight;

    this.setData({
      isAdmin: app.globalData.isAdmin
    });
  },
  onShow() {
    if (app.globalData.timesRefresh) {
      this.setData({
        pageIndex: 0
      })
      this.getTypeList()
      wx.pageScrollTo({
        scrollTop: 0
      })
      // app.globalData.timesRefresh = false
    }
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    console.log('ok')
    this.setData({
      pageIndex: 0
    })
    this.getTypeList()
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
      this.getTypeList()
      console.log(this.data.pageIndex)
    }
  },
  ontouchstart: function (e) {
    if (this.showState === 1) {
      this.touchStartState = 1;
      this.showState = 0;
      this.moveX = 0;
      this.translateXMsgItem(this.lastShowMsgId, 0, 200);
      this.lastShowMsgId = "";
      return;
    }
    this.firstTouchX = e.touches[0].clientX;
    this.firstTouchY = e.touches[0].clientY;
    if (this.firstTouchX > this.swipeCheckX) {
      this.swipeCheckState = 1;
    }
    this.lastMoveTime = e.timeStamp;
  },

  ontouchmove: function (e) {
    if (this.swipeCheckState === 0) {
      return;
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.touchStartState === 1) {
      return;
    }
    var moveX = e.touches[0].clientX - this.firstTouchX;
    var moveY = e.touches[0].clientY - this.firstTouchY;
    //已触发垂直滑动，由scroll-view处理滑动操作
    if (this.swipeDirection === 2) {
      return;
    }
    //未触发滑动方向
    if (this.swipeDirection === 0) {
      console.log(Math.abs(moveY));
      //触发垂直操作
      if (Math.abs(moveY) > 4) {
        this.swipeDirection = 2;

        return;
      }
      //触发水平操作
      if (Math.abs(moveX) > 4) {
        this.swipeDirection = 1;
        this.setData({ scrollY: false });
      }
      else {
        return;
      }

    }
    //禁用垂直滚动
    // if (this.data.scrollY) {
    //   this.setData({scrollY:false});
    // }

    this.lastMoveTime = e.timeStamp;
    //处理边界情况
    if (moveX > 0) {
      moveX = 0;
    }
    //检测最大左滑距离
    if (moveX < -this.maxMoveLeft) {
      moveX = -this.maxMoveLeft;
    }
    this.moveX = moveX;
    this.translateXMsgItem(e.currentTarget.id, moveX, 0);
  },
  ontouchend: function (e) {
    // console.log('e.currentTarget.id', e.currentTarget.id)
    this.swipeCheckState = 0;
    var swipeDirection = this.swipeDirection;
    this.swipeDirection = 0;
    if (this.touchStartState === 1) {
      this.touchStartState = 0;
      this.setData({ scrollY: true });
      return;
    }
    //垂直滚动，忽略
    if (swipeDirection !== 1) {
      return;
    }
    if (this.moveX === 0) {
      this.showState = 0;
      //不显示菜单状态下,激活垂直滚动
      this.setData({ scrollY: true });
      return;
    }
    if (this.moveX === this.correctMoveLeft) {
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
      return;
    }
    if (this.moveX < -this.thresholdMoveLeft) {
      this.moveX = -this.correctMoveLeft;
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
    }
    else {
      this.moveX = 0;
      this.showState = 0;
      //不显示菜单,激活垂直滚动
      this.setData({ scrollY: true });
    }
    this.translateXMsgItem(e.currentTarget.id, this.moveX, 200);
    // console.log('e.currentTarget.id', e.currentTarget.id)
    //this.translateXMsgItem(e.currentTarget.id, 0, 0);
  },
  onDeleteMsgTap: function (e) {
    console.log(e)
    // this.deleteMsgItem(e);
  },
  onDeleteMsgLongtap: function (e) {
    console.log(e);
    let id = e.currentTarget.id
    this.translateXMsgItem(id, 0, 200);
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: (res) => {
        wx.request({
          method: 'GET',
          url: config.service.getFoodList,
          data: {
            title: '',
            type: id,
            order: 'id',
            sort: 'DESC',
            pageIndex: 0,
            pageSize: 1,
          },
          success: ({ data }) => {
            console.log('getTypeDetail', data)
            if (data.code == 0 && data.data.length > 0) {
              wx.showModal({
                title: '提示',
                content: '该菜单下存在美食，不能删除',
                showCancel: false
              })
            } else {
              if (res.confirm) {
                wx.request({
                  method: 'DELETE',
                  url: config.service.removeType,
                  data: { id },
                  success: () => {
                    this.getTypeList()
                    wx.showToast({
                      title: '江湖再见，慢走不送...',
                      icon: 'none'
                    })
                    app.globalData.timesRefresh = true
                  }
                })
              }
            }
          }
        })
      }
    })
  },
  onMarkMsgTap: function (e) {
    console.log(e);
  },
  onMarkMsgLongtap: function (e) {
    console.log(e);
    let id = e.currentTarget.id
    this.translateXMsgItem(id, 0, 200);
    wx.navigateTo({
      url: `../setedit/setedit?id=${id}`
    })
  },
  getItemIndex: function (id) {
    var wallList = this.data.wallList;
    for (var i = 0; i < wallList.length; i++) {
      if (wallList[i].id == id) {
        return i;
      }
    }
    return -1;
  },
  deleteMsgItem: function (e) {
    var animation = wx.createAnimation({ duration: 200 });
    animation.height(0).opacity(0).step();
    this.animationMsgWrapItem(e.currentTarget.id, animation);
    var s = this;
    setTimeout(function () {
      var index = s.getItemIndex(e.currentTarget.id);
      s.data.wallList.splice(index, 1);
      s.setData({ wallList: s.data.wallList });
    }, 200);
    this.showState = 0;
    this.setData({ scrollY: true });
  },
  translateXMsgItem: function (id, x, duration) {
    var animation = wx.createAnimation({ duration: duration });
    animation.translateX(x).step();
    this.animationMsgItem(id, animation);
  },
  animationMsgItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'wallList[' + index + '].animation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  animationMsgWrapItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'wallList[' + index + '].wrapAnimation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  // 获取植物列表
  getTypeList() {
    wx.request({
      url: config.service.getTypeList,
      success: ({ data }) => {
        console.log(data)
        this.setData({
          loaded: true,
          wallList: data.data,
        })
      }
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
      url: '../setedit/setedit'
    })
  },
})