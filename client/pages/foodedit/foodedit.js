//index.js
//获取应用实例
const app = getApp()
var config = require('../../config')
var { formatTime } = require('../../utils/util.js')
Page({
  data: {
    isIpx: app.globalData.isIpx,
    cover: '../../images/avatar.png',
    title: '',
    descript: '',
    time: '2019-04-08 18:20:35',
    type: '',
    id: null,
    index: 0,
    imgList: [],
    array: [
      { value: '', text: '请选择' },
      { value: 'chuancai', text: '川菜' },
      { value: 'jiachangcai', text: '家常菜' },
      { value: 'xiangcai', text: '湘菜' },
      { value: 'zhushi', text: '主食' },
    ],
  },
  onLoad: function (options) {
    if (options.id) { // 编辑
      this.setData({ id: options.id })
      this.getFoodDetail(options.id)
      this.getFoodImg(options.id)
    }
  },
  // 获取食物信息
  getFoodDetail(id) {
    wx.request({
      url: config.service.getFoodDetail,
      data: { id },
      success: ({ data }) => {
        console.log(data)
        this.setData({
          cover: data.cover,
          title: data.title,
          descript: data.descript,
          time: data.time,
          type: data.type
        })
      },
      fail: (err) => {
        console.log(err, 'err')
      }
    })
  },
  // 获取图片列表
  getFoodImg(id) {
    wx.request({
      url: config.service.getFoodImg,
      data: { id },
      success: ({ data }) => {
        console.log(data)
        if (data.data.length) {
          this.setData({
            imgList: data.data
          })
        }
      },
      fail: (err) => {
        console.log(err, 'err')
      }
    })
  },
  // 键盘输入时触发
  textChange(e) {
    console.log(e)
    this.setData({
      text: e.detail.value.trim()
    })
  },
  // 预览照片
  viewImage(e) {
    let current = e.currentTarget.dataset.current
    let urls = this.data.imgList.map(item => item.src)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 输入框回调
  textChange(e) {
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.type]: e.detail.value
    })
  },
  // pick回调
  bindPickerChange(e) {
    let index = e.detail.value
    let type = this.data.array[index].value
    console.log(type)
    this.setData({ index, type })
  },
  // 保存
  saveFood() {

    if (this.data.id) { // 编辑
      wx.request({
        method: 'PUT',
        url: config.service.updateFood,
        data: {
          id: this.data.id,
          cover: this.data.cover,
          title: this.data.title,
          descript: this.data.descript,
          time: this.data.time,
          type: this.data.type
        },
        success: ({ data }) => {
          console.log(data)
          wx.navigateBack()
        },
        fail: (err) => {
          console.log(err, 'err')
        }
      })
    } else { // 新增
      wx.request({
        method: 'POST',
        url: config.service.addFood,
        data: {
          cover: this.data.cover,
          title: this.data.title,
          descript: this.data.descript,
          time: this.data.time,
          type: this.data.type
        },
        success: ({ data }) => {
          console.log(data)
          wx.navigateBack()
        },
        fail: (err) => {
          console.log(err, 'err')
        }
      })
    }
  },
})
