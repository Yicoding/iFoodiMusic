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
    cover: '../../images/avatar.png',
    title: '',
    descript: '',
    time: '2019-04-08 18:20:35',
    type: '',
    id: null,
    index: 0,
    num: 9, // 图片数量限制
    imgList: [], // 数据库存储的
    tempFilePaths: [], // 临时文件
    array: [
      { id: '', text: '请选择' },
    ],
  },
  onLoad: function (options) {
    if (options.id) { // 编辑
      this.setData({ id: options.id })
      this.getTypeList(options.id)
      this.getFoodImg(options.id)
    } else {
      this.getTypeList()
    }
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    let item = this.data.cover
    let urls = [item]
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
    wx.stopPullDownRefresh()
  },
  // 获取菜单列表
  getTypeList(id = null) {
    wx.request({
      url: config.service.getTypeList,
      success: ({ data }) => {
        console.log('getTypeList', data)
        let array = [...this.data.array, ...data.data]
        this.setData({ array })
        id && this.getFoodDetail(id)
      }
    })
  },
  // 获取食物信息
  getFoodDetail(id) {
    wx.request({
      url: config.service.getFoodDetail,
      data: { id },
      success: ({ data }) => {
        console.log('getFoodDetail', data)
        let index = this.data.array.findIndex(item => item.id == data.data.type)
        console.log('index', index)
        this.setData({
          index,
          cover: data.data.cover,
          title: data.data.title,
          descript: data.data.descript,
          time: data.data.time,
          type: data.data.type
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
        console.log('getFoodImg', data)
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
      [e.currentTarget.dataset.type]: e.detail.value.trim()
    })
  },
  // pick回调
  bindPickerChange(e) {
    let index = e.detail.value
    let type = this.data.array[index].id
    console.log(type)
    this.setData({ index, type })
  },
  // 保存
  saveFood() {
    let { id, cover, title, descript, time, type } = this.data
    // 验证
    if (!!!title) {
      return wx.showToast({
        title: '请输入商品名',
        icon: 'none'
      })
    }
    if (!!!descript) {
      return wx.showToast({
        title: '请输入商品信息',
        icon: 'none'
      })
    }
    if (!!!type) {
      return wx.showToast({
        title: '请选择商品类别',
        icon: 'none'
      })
    }
    if (id) { // 编辑
      wx.request({
        method: 'PUT',
        url: config.service.updateFood,
        data: {
          id,
          cover,
          title,
          descript,
          time,
          type
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
        url: config.service.addFood,
        data: {
          cover,
          title,
          descript,
          time: formatTime(new Date()),
          type
        },
        success: ({ data }) => {
          console.log(data)
          if (data.code == 0) {
            let food_id = data.data[0]
            wx.showLoading({
              title: '上传中',
              duration: 100000,
              mask: true
            })
            var promises = []
            promises = this.data.tempFilePaths.map(item => {
              return uploadFile(item.src)
            })
            Promise.all(promises).then((args) => {
              wx.request({
                method: 'POST',
                url: config.service.addFoodImg,
                data: {
                  imgList: args,
                  food_id
                },
                success: () => {
                  wx.hideLoading()
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
                }
              })
            }).catch(err => {
              wx.hideLoading()
              wx.showToast({
                title: '上传失败，请重试',
                icon: 'none'
              })
            })
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
        // return console.log('uploadCover', res)
        var promises = []
        promises = res.tempFilePaths.map(item => {
          return uploadFile(item)
        })
        Promise.all(promises).then((args) => {
          this.setData({ cover: args[0] })
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
  viewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  // 移除照片
  remove(e) {
    wx.showModal({
      title: '提示',
      content: '真的不要我了吗？',
      success: (res) => {
        if (res.confirm) {
          if (this.data.id) { // 修改美食
            this.removePut(e)
          } else { // 新增美食
            this.removeAdd(e)
          }
        }
      }
    })
  },
  // 移除照片(新增美食)
  removeAdd(e) {
    this.data.tempFilePaths.splice(e.target.dataset.index, 1)
    this.setData({
      tempFilePaths: this.data.tempFilePaths
    })
    this.data.num++
  },
  // 移除照片(修改美食)
  removePut(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1)
    wx.request({
      method: 'PUT',
      url: config.service.removeFoodImg,
      data: { id: e.currentTarget.dataset.id },
      success: () => {
        this.setData({
          imgList: this.data.imgList
        })
        this.data.num++
      }
    })
  },
  // 上传图片
  loadImg() {
    if (this.data.id) { // 修改美食
      this.loadImgPut()
    } else { // 新增美食
      this.loadImgAdd()
    }
  },
  // 上传图片(新增美食)
  loadImgAdd() {
    wx.chooseImage({
      count: this.data.num, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths.map(item => {
          return {
            id: null,
            src: item
          }
        })
        this.setData({ tempFilePaths: [...this.data.tempFilePaths, ...tempFilePaths] })
      }
    })
  },
  // 上传图片(修改美食)
  loadImgPut() {
    wx.chooseImage({
      count: this.data.num, // 默认9
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
          console.log('args', args)
          this.data.num -= res.tempFilePaths.length
          wx.request({
            method: 'POST',
            url: config.service.addFoodImg,
            data: {
              imgList: args,
              food_id: this.data.id
            },
            success: () => {
              wx.hideLoading()
              this.getFoodImg(this.data.id)
            }
          })
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
