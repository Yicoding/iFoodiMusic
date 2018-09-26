const { mysql } = require('../qcloud')
// 按照openid查找是否有未读消息
async function getReadNum(ctx, next) {
    await mysql('times_rate').
    select(mysql.raw('count(*) as num')).where({
        ownId: ctx.query.openid,
        isRead: 'false'
    }).
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res[0].num
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 按照openid查找消息列表
async function getMsgList(ctx, next) {
    await mysql('times_rate').
    select('*').
    where({
        ownId: ctx.query.openid,
        isRead: 'false'
    }).
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
// 设为已读
async function alterMsg(ctx, next) {
    await mysql('times_rate').
    where({
        id: ctx.request.body.id
    }).
    update({
        isRead: true
    }).
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
module.exports = {
    getReadNum,
    getMsgList,
    alterMsg
}
