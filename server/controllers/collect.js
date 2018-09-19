const { mysql } = require('../qcloud')
// 按照openid查找收藏列表
async function collectFindByOpenId(ctx, next) {
    // await mysql('songlist').join('collect', 'songlist.id', '=', 'collect.songid').select('*').where('collect.openid', ctx.query.openid).then(res => {
    await mysql('songlist').join('collect', 'songlist.id', '=', 'collect.songid').select('*').where({
        openid: ctx.query.openid
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 按照歌曲id查找是否收藏过该歌曲
async function collectFindBySongId(ctx, next) {
    await mysql('collect').select('*').where({
        openid: ctx.query.openid,
        songid: ctx.query.id
    }).then(res => {
        ctx.state.code = 0
        if (res.length) {
            ctx.state.data = true
        } else {
            ctx.state.data = false
        }
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 添加收藏
async function addCollect(ctx, next) {
    await mysql('collect').insert({
        openid: ctx.query.openid,
        songid: ctx.query.id
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 取消收藏
async function removeCollect(ctx, next) {
    await mysql('collect').where({
        openid: ctx.query.openid,
        songid: ctx.query.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
module.exports = {
    collectFindByOpenId,
    collectFindBySongId,
    addCollect,
    removeCollect
}
