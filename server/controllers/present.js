const { mysql } = require('../qcloud')
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
function addTimes(ctx, next) {
    return new Promise((resolve, reject) => {
        mysql('times').insert({
            content: ctx.request.body.content,
            openid: ctx.request.body.openid,
            nickName: ctx.request.body.nickName,
            province: ctx.request.body.province,
            city: ctx.request.body.city,
            avatarUrl: ctx.request.body.avatarUrl,
            present_time: ctx.request.body.time
        }).then(res => {
            resolve({
                code: 0,
                data: res[0]
            })
        }).catch(err => {
            reject({
                code: -1,
                err: err
            })
        })
    })
}
// 新增好时光图片
async function addTimesPic(ctx, next) {
    let config = await addTimes(ctx, next)
    if (config.code == 0) {
        if (ctx.request.body.pic.length) {
            let id = config.data
            let pic = ctx.request.body.pic.map(item => {
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
        } else {
            ctx.state.code = 0
            ctx.state.data = 'ok'
        }
    } else {
        ctx.state.code = -1
        throw new Error(config.err)
    }
}


module.exports = {
    groupTest,
    addTimesPic
}
