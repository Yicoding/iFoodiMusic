/**
 * 全局封装wx.request
 * @param {*} obj 
 */
const ajax = ({ method = 'GET', url, data, success, fail, complete }) => {
  const token = 'ifoodimusic';
  wx.request({
    url,
    method,
    data,
    header: {
      phone: token,
      token
    },
    success: function (res) {
      success && success(res);
    },
    fail: function (err) {
      fail && fail(err);
    },
    complete: function () {
      complete && complete();
    },
  })
}
module.exports = {
  ajax
}
