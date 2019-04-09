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
// 新增植物
async function addPlant(ctx, next) {
    let item = ctx.request.body
    await mysql('plant').insert({
        coverImg: item.coverImg,
        name: item.name,
        desc: item.desc,
        createTime: item.createTime,
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 更新植物
async function updatePlant(ctx, next) {
    let item = ctx.request.body
    await mysql('plant').where({ id: item.id }).
    update({
        coverImg: item.coverImg,
        name: item.name,
        desc: item.desc,
        createTime: item.createTime,
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 删除植物
async function removePlant(ctx, next) {
    await mysql('plant').where({
        id: ctx.request.body.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 获取植物列表
async function getPlantImg(ctx, next) {
    await mysql('plant_pic').
        select('*').
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
// 新增植物图片
async function addPlantImg(ctx, next) {
    let item = ctx.request.body
    let arr = item.imgList.map(todo => {
        return {
            src: todo,
            plant_id: item.plant_id
        }
    })
    await mysql('plant_pic').insert(arr).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 删除植物图片
async function removePlantImg(ctx, next) {
    await mysql('plant_pic').where({
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
    removePlantRate,
    getPlantImg,
    addPlant,
    updatePlant,
    removePlant,
    addPlantImg,
    removePlantImg
}
