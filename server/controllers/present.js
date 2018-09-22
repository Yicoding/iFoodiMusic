const { mysql } = require('../qcloud')
// 查看好时光列表
async function findAllTimes(ctx, next) {
    await mysql('times').
    leftJoin('timespic', 'times.id', '=', 'timespic.times_id').
    select('times.id', 'times.content', 'times.nickName', 'times.openid', 'times.avatarUrl', 'times.present_time', mysql.raw('group_concat(timespic.src) as pic')).
    groupBy('times.id').
    orderBy('times.present_time', 'desc').
    limit(ctx.query.pageSize).
    offset(ctx.query.pageIndex*ctx.query.pageSize).
    then(res => {
        ctx.state.code = 0
        res.forEach(item => {
            if (!!item.pic) {
                item.pic = item.pic.split(',')
            }
        })
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 获取单条好时光内容
async function timesDetail(ctx, next) {
    await mysql('times').
    leftJoin('timespic', 'times.id', '=', 'timespic.times_id').
    select('times.id', 'times.content', 'times.nickName', 'times.openid', 'times.avatarUrl', 'times.present_time', mysql.raw('group_concat(timespic.src) as pic')).
    groupBy('times.id').
    where('times.id', ctx.query.id).
    then(res => {
        ctx.state.code = 0
        if (!!res[0].pic) {
            res[0].pic = res[0].pic.split(',')
        }
        ctx.state.data = res[0]
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 新增好时光
async function addTimes(ctx, next) {
    let item = ctx.request.body
    await mysql('times').insert({
        content: item.content,
        openid: item.openid,
        nickName: item.nickName,
        province: item.province,
        city: item.city,
        avatarUrl: item.avatarUrl,
        present_time: item.time
    }).then(res => {
        if (item.pic.length) {
            addTimesPic(res[0], item.pic)
        } else {
            ctx.state.code = 0
            ctx.state.data = res
        }
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
// 获取好时光评论列表
async function getRateList(ctx, next) {
    await mysql('times_rate').
    select('*').
    orderBy('present_time', 'desc').
    where({
        times_id: ctx.query.id
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 新增好时光评论
async function addTimesRate(ctx, next) {
    let item = ctx.request.body
    await mysql('times_rate').insert({
        content: item.content,
        times_id: item.times_id,
        openid: item.openid,
        nickName: item.nickName,
        avatarUrl: item.avatarUrl,
        present_time: item.present_time
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 删除评论
async function removeRate(ctx, next) {
    await mysql('times_rate').where({
        id: ctx.query.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
module.exports = {
    addTimes,
    findAllTimes,
    timesDetail,
    getRateList,
    addTimesRate,
    removeRate
}
