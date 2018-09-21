// pages/gubaPost/gubaPost.js
var { emojiMap } = require('../../utils/emoji.js')
var { uploadFile } = require('../../utils/upload.js')
var config = require('../../config')
var { formatTime } = require('../../utils/util.js')
const app = getApp()
var timee = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyHeight: 0,
    tempFilePaths: [],
    num: 9,
    focus: true,
    isShow: true,
    toolHeight: 0,
    barHeight: 0,
    textVal: '',
    emojiArr: [],
    cursor: 0,
    picAllowed: true,
    pic: [],
  },
  // 键盘输入时
  valChange: function(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 输入框聚焦时
  handleFocus: function(e) {
    this.setData({keyHeight: e.detail.height, isShow: true, toolHeight: e.detail.height, barHeight: 0})
  },
  // 输入框失去焦点时
  outFocus: function(e) {
    this.setData({keyHeight: 0, cursor: e.detail.cursor})
  },
  // 上传图片
  loadImg: function() {
    this.setData({ isShow: true, barHeight: 0})
    wx.chooseImage({
      count: this.data.num, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: '上传中',
          duration: 100000,
          mask: true
        })
        var promises = []
        promises = res.tempFilePaths.map(item => {
          return uploadFile(item)
        })
        Promise.all(promises).then((args) => {
          var tempFilePaths = [...this.data.tempFilePaths, ...res.tempFilePaths]
          this.setData({
            tempFilePaths: tempFilePaths,
            pic: [...this.data.pic, ...args]
          })
          this.data.num -= res.tempFilePaths.length
          wx.hideLoading()
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          })
        })
      }
    })
  },
  // 预览照片
  viewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  // 移除照片
  remove: function(e) {
    this.data.tempFilePaths.splice(e.target.dataset.index, 1)
    this.data.pic.splice(e.target.dataset.index, 1)
    this.setData({
      tempFilePaths: this.data.tempFilePaths,
      pic: this.data.pic
    })  
    this.data.num ++
  },
  // 展开表情列表
  openPhiz: function() {
    setTimeout(() => {
      this.setData({ isShow: false, barHeight: this.data.toolHeight})
    },300)
  },
  // 获取表情
  getEmoji: function() {
    var emojiArr = []
    for (var k in emojiMap) {
      emojiArr.push({k: k, src: emojiMap[k]})
    }
    this.setData({emojiArr: emojiArr})
  },
  // 点击表情
  addEmoji: function(e) {
    console.log(e.target.dataset.k, 'e.target.dataset.ke.target.dataset.k')
    var preVal = this.data.textVal.slice(0, this.data.cursor)
    var nextVal = this.data.textVal.slice(this.data.cursor)
    var textVal = preVal + e.target.dataset.k + nextVal
    this.setData({
      textVal: textVal
    })
    this.data.cursor += e.target.dataset.k.length
  },
  // 发布
  publish() {
    console.log(this.data.textVal)
    if (this.data.textVal.trim()) {
      var data = {
        content: this.data.textVal,
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        province: app.globalData.userInfo.province,
        city: app.globalData.userInfo.city,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        pic: this.data.pic,
        time: formatTime(new Date())
      }
      wx.request({
        method: 'POST',
        url: config.service.addTimes,
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: ({ data }) => {
          console.log(data, 'dataInfo')
          if (data.code == 0) {
            wx.showToast({
              title: '发表成功呦O(∩_∩)O~~',
              icon: 'none'
            })
            app.globalData.timesRefresh = true
            timee = setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1800)
          } else {
            wx.showToast({
              title: '发表失败，请重新发送',
              icon: 'none'
            })
          }
        },
        fail: err => {
          console.log(err, 'err')
          wx.showToast({
            title: '发表失败，请重新发送',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '还没有输入内容呦，快去展示你的文采吧O(∩_∩)O~~',
        showCancel: false,
        success: () => {
          this.setData({
            textVal: ''
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEmoji()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timee)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
