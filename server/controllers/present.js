const { mysql } = require('../qcloud')
const Promise = require('../es6-promise.min.js')
// 查找专辑列表
async function groupTest(ctx, next) {
    await mysql('album').
    innerJoin('songlist', 'album.id', '=', 'songlist.album_id').
    select('album.id', 'album.name', mysql.raw('group_concat(songlist.name) as list')).
    groupBy('album.id').
    then(res => {
        ctx.state.code = 0
        for (let i = 0; i < res.length - 1; i ++) {
            let item = res[i]
            item.list = item.list.split(',')
        }
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 新增好时光
async function addTimes(ctx, next) {
    mysql('times').insert({
        content: ctx.request.body.content,
        openid: ctx.request.body.openid,
        nickName: ctx.request.body.nickName,
        province: ctx.request.body.province,
        city: ctx.request.body.city,
        avatarUrl: ctx.request.body.avatarUrl,
        present_time: ctx.request.body.time
    }).then(res => {
        if (ctx.request.body.pic.length) {
            addTimesPic(res[0], ctx.request.body.pic)
        } else {
            ctx.state.code = 0
            ctx.state.data = res
        }
        resolve({
            code: 0,
            data: res[0]
        })
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 新增好时光图片
async function addTimesPic(id, picArr) {
    let pic = picArr.map(item => {
        return {
            src: item,
            times_id: id
        }
    })
    await mysql('timespic').insert(pic).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}


module.exports = {
    groupTest,
    addTimes
}
