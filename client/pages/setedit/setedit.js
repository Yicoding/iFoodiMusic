//index.js
//获取应用实例
const app = getApp()
var config = require('../../config')
var { uploadFile } = require('../../utils/upload.js')
var { formatTime } = require('../../utils/util.js')
var timee = 0
Page({
  data: {
    isIpx: app.globalData.isIpx,
    img: '../../images/index.jpg',
    name: '',
    desc: '',
    createTime: '2019-04-08 18:20:35',
    id: null,
    num: 9, // 图片数量限制
    imgList: [], // 数据库存储的
    tempFilePaths: [], // 临时文件
  },
  onLoad: function (options) {
    if (options.id) { // 编辑
      this.setData({ id: options.id })
      this.getTypeDetail(options.id)
    }
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    let item = this.data.img
    let urls = [item]
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
    wx.stopPullDownRefresh()
  },
  // 获取食物信息
  getTypeDetail(id) {
    wx.request({
      url: config.service.getTypeDetail,
      data: { id },
      success: ({ data }) => {
        console.log('getTypeDetail', data)
        this.setData({
          img: data.data.img,
          text: data.data.text
        })
      },
      fail: (err) => {
        console.log(err, 'err')
      }
    })
  },
  // 输入框回调
  textChange(e) {
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.type]: e.detail.value.trim()
    })
  },
  // 保存
  saveFood() {
    let { id, img, text } = this.data
    // 验证
    if (!!!text) {
      return wx.showToast({
        title: '请输入菜单名',
        icon: 'none'
      })
    }
    if (id) { // 编辑
      wx.request({
        method: 'PUT',
        url: config.service.updateType,
        data: {
          id,
          img,
          text
        },
        success: ({ data }) => {
          console.log(data)
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
        fail: (err) => {
          console.log(err, 'err')
          wx.showToast({
            title: '服务器抛出个错误并砸向你',
            icon: 'none'
          })
        }
      })
    } else { // 新增
      wx.request({
        method: 'POST',
        url: config.service.addType,
        data: {
          img,
          text
        },
        success: ({ data }) => {
          console.log(data)
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
        fail: (err) => {
          console.log(err, 'err')
          wx.showToast({
            title: '服务器抛出个错误并砸向你',
            icon: 'none'
          })
        }
      })
    }
  },
  //上传封面图片
  uploadCover() {
    wx.chooseImage({
      count: 1, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
          this.setData({ img: args[0] })
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timee)
  },
})
