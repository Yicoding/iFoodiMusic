const { mysql } = require('../qcloud')
// 植物列表
async function getPlantList(ctx, next) {
    await mysql('plant').
    select('*').
    orderBy('createTime', 'desc').
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
// 根据id获取植物
async function plantDetail(ctx, next) {
    await mysql('plant').
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
async function getPlantRateList(ctx, next) {
    await mysql('plant_rate').
    select('*').
    orderBy('presentTime', 'desc').
    where({
        plant_id: ctx.query.id
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
async function addPlantRate(ctx, next) {
    let item = ctx.request.body
    await mysql('plant_rate').insert({
        content: item.content,
        plant_id: item.plant_id,
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
async function removePlantRate(ctx, next) {
    await mysql('plant_rate').where({
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
    getPlantList,
    plantDetail,
    getPlantRateList,
    addPlantRate,
    removePlantRate
}
