//index.js
//获取应用实例
const app = getApp()
const { ajax } = require('../../utils/ajax');
var config = require('../../config')
var { parseEmoji } = require('../../utils/emoji.js')
Page({
  data: {
    pageIndex: 0,
    pageSize: 10,
    timesList: [],
    hasMore: false,
    loaded: true,
    info: '数据加载中...',
    hasMsg: false,
  },
  onLoad: function () {
    console.log('onLoad')
    this.findAllTimes()
  },
  onShow() {
    this.getReadNum()
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
  // 是否有未读消息
  getReadNum() {
    ajax({
      url: config.service.getReadNum,
      data: {
        openid: app.globalData.openid
      },
      success: ({ data }) => {
        console.log(data, 'getReadNum')
        this.setData({
          hasMsg: data.data
        })
      }
    })
  },
  // 获取列表
  findAllTimes() {
    ajax({
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
        let timesList = data.data.map(item => {
          item.content = parseEmoji(item.content)
          item.isDelete = item.openid == app.globalData.openid
          item.nickName = item.openid == app.globalData.specialName ? '狗子' : item.nickName
          return item
        })
        console.log(data.data, 'hi')
        if (this.data.pageIndex == 0) {
          this.setData({
            timesList: timesList
          })
        } else {
          this.setData({
            timesList: [...this.data.timesList, ...timesList]
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
        wx.setStorage({
          key: 'userInfo',
          data: {
            openid: app.globalData.openid,
            nickname: app.globalData.userInfo.nickName,
            avatarurl: app.globalData.userInfo.avatarUrl
          },
          success: () => {
            wx.navigateTo({
              url: '../user/user'
            })
          }
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '你还没有登录呦╮(╯▽╰)╭',
          showCancel: false
        })
      }
    } else {
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
    }
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
          ajax({
            method: 'PUT',
            url: config.service.removeTimes,
            data: {
              id: id
            },
            success: () => {
              wx.showToast({
                title: '江湖再见，慢走不送...',
                icon: 'none'
              })
              this.setData({
                pageIndex: 0
              })
              this.findAllTimes()
            }
          })
        }
      }
    })
  },
  // 前往消息中心
  goMsg() {
    wx.navigateTo({
      url: '../msg/msg'
    })
  },
})
