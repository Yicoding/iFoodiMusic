const { mysql } = require('../qcloud')
// 爱美食列表
async function getFoodList(ctx, next) {
    let type = ctx.query.type
    if (type == 'all') {
        await mysql('food').
        leftJoin('food_rate', 'food.id', '=', 'food_rate.food_id').
        select('food.id', 'food.cover', 'food.title', 'food.descript', 'food.time', mysql.raw('count(food_rate.id) as num')).
        where('title', 'like', `%${ctx.query.title}%`).
        orderBy(ctx.query.order, ctx.query.sort).
        groupBy('food.id').
        limit(ctx.query.pageSize).
        offset(ctx.query.pageIndex*ctx.query.pageSize).
        then(res => {
            ctx.state.code = 0
            ctx.state.data = res
        }).catch(err => {
            ctx.state.code = -1
            throw new Error(err)
        })
    } else {
        await mysql('food').
        leftJoin('food_rate', 'food.id', '=', 'food_rate.food_id').
        select('food.id', 'food.cover', 'food.title', 'food.descript', 'food.time', mysql.raw('count(food_rate.id) as num')).
        where('title', 'like', `%${ctx.query.title}%`).
        andWhere('food.type', ctx.query.type).
        orderBy(ctx.query.order, ctx.query.sort).
        groupBy('food.id').
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
}
// // 根据id获取文章
// async function articleDetail(ctx, next) {
//     await mysql('wall').
//     select('*').
//     where({
//         id: ctx.query.id
//     }).
//     then(res => {
//         ctx.state.code = 0
//         ctx.state.data = res[0]
//     }).catch(err => {
//         ctx.state.code = -1
//         throw new Error(err)
//     })
// }
// // 获取评论列表
// async function getArticleRateList(ctx, next) {
//     await mysql('wall_rate').
//     select('*').
//     orderBy('presentTime', 'desc').
//     where({
//         wall_id: ctx.query.id
//     }).
//     then(res => {
//         ctx.state.code = 0
//         ctx.state.data = res
//     }).catch(err => {
//         ctx.state.code = -1
//         throw new Error(err)
//     })
// }
// // 新增评论
// async function addArticleRate(ctx, next) {
//     let item = ctx.request.body
//     await mysql('wall_rate').insert({
//         content: item.content,
//         wall_id: item.wall_id,
//         openid: item.openid,
//         nickName: item.nickName,
//         avatarUrl: item.avatarUrl,
//         presentTime: item.presentTime
//     }).then(res => {
//         ctx.state.code = 0
//         ctx.state.data = res
//     }).catch(err => {
//         ctx.state.code = -1
//         throw new Error(err)
//     })
// }
// // 删除评论
// async function removeArticleRate(ctx, next) {
//     await mysql('wall_rate').where({
//         id: ctx.request.body.id
//     }).del().then(res => {
//         ctx.state.code = 0
//         ctx.state.data = res
//     }).catch(err => {
//         ctx.state.code = -1
//         throw new Error(err)
//     })
// }
module.exports = {
    getFoodList,
    // articleDetail,
    // getArticleRateList,
    // addArticleRate,
    // removeArticleRate
}
