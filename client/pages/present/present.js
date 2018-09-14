// pages/gubaPost/gubaPost.js
var { emojiMap } = require('../../utils/emoji.js')
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
    picAllowed: true
  },
  // 键盘输入时
  valChange: function(e) {
    if (e.detail.value.trim()) {
      this.setData({textVal: e.detail.value})
    } else {
      this.setData({textVal: e.detail.value})
    }
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
    var that = this
    wx.chooseImage({
      count: this.data.num, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = [...that.data.tempFilePaths,...res.tempFilePaths]
        that.setData({tempFilePaths: tempFilePaths})
        that.data.num -= res.tempFilePaths.length
      }
    })
  },
  // 预览照片
  viewImage: function(e) {
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  // 移除照片
  remove: function(e) {
    this.data.tempFilePaths.splice(e.target.dataset.index, 1)
    this.setData({tempFilePaths: this.data.tempFilePaths})  
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
    this.setData({textVal: textVal})
    this.data.cursor += e.target.dataset.k.length
  },
  // 发布
  publish() {

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
