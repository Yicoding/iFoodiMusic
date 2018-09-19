var config = require('../config')

function uploadFile(filePath) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: config.service.uploadUrl,
            filePath: filePath,
            name: 'file',
            success: function(res){
                res = JSON.parse(res.data)
                resolve(res.data.imgUrl)
            },
            fail: function(e) {
                reject('上传失败')
            }
        })
    })
}

module.exports = {
    uploadFile
}