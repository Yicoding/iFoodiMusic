const { mysql } = require('../qcloud')
// 表白墙列表
async function getWallList(ctx, next) {
    await mysql('wall').
    select('*').
    orderBy('presentTime', 'desc').
    limit(ctx.query.pageSize).
    offset(ctx.query.pageIndex*ctx.query.pageSize).
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 根据id获取文章
async function articleDetail(ctx, next) {
    await mysql('wall').
    select('*').
    where({
        id: ctx.query.id
    }).
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res[0]
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 获取评论列表
async function getArticleRateList(ctx, next) {
    await mysql('wall_rate').
    select('*').
    orderBy('presentTime', 'desc').
    where({
        wall_id: ctx.query.id
    }).
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 新增评论
async function addArticleRate(ctx, next) {
    let item = ctx.request.body
    await mysql('wall_rate').insert({
        content: item.content,
        wall_id: item.wall_id,
        openid: item.openid,
        nickName: item.nickName,
        avatarUrl: item.avatarUrl,
        presentTime: item.presentTime
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 删除评论
async function removeArticleRate(ctx, next) {
    await mysql('wall_rate').where({
        id: ctx.request.body.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
module.exports = {
    getWallList,
    articleDetail,
    getArticleRateList,
    addArticleRate,
    removeArticleRate
}
