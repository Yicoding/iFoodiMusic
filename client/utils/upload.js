var config = require('../config')

function uploadFile(filePath) {
    return new Promise((resolve, reject) => {
        const token = 'ifoodimusic';
        wx.uploadFile({
            // url: config.service.uploadUrl,
            url: config.service.putObject,
            filePath: filePath,
            header: {
                phone: token,
                token
            },
            name: 'file',
            success: function (res) {
                console.log('uploadFile', res)
                res = JSON.parse(res.data)
                if(res.code == 0) {
                    // resolve(res.data.imgUrl)
                    resolve(`https://${res.data.Location}`)
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