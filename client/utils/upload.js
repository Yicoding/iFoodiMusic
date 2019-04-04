var config = require('../config')

function uploadFile(filePath) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: config.service.uploadUrl,
            filePath: filePath,
            name: 'file',
            header: {
                'Content-Type': 'multipart/form-data'
            },
            formData: {
                uploadfile: filePath
            },
            success: function (res) {
                res = JSON.parse(res.data)
                if(data.result == 1) {
                    resolve(res.data.imgUrl)
                } else {
                    reject('else：上传失败')
                }
            },
            fail: function (e) {
                reject('上传失败')
            }
        })
    })
}

module.exports = {
    uploadFile
}