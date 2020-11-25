//index.js
//获取应用实例
const arr = require('./arr');

Page({
  data: {
    dataList: [],
    value: '',
    src: '/images/icon/top.png'
  },
  onLoad: function () {
  },
  // 输入框改变
  onChange(e) {
    const { value } = e.detail;
    this.setData({ value });
  },
  // 搜索
  search() {
    const { value } = this.data;
    this.searchFuc(value.trim());
  },
  // 清空
  clear() {
    this.setData({ dataList: [], value: '' })
  },
  // 搜索逻辑
  searchFuc(value) {
    if (value) {
      console.log('value', value)
      const dataList = [];
      arr.forEach(item => {
        var patten = new RegExp(value);
        if (patten.test(item.title) || patten.test(item.content)) {
          dataList.push(item)
        }
      });
      this.setData({ dataList });
    }
  },
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
})
