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
            offset(ctx.query.pageIndex * ctx.query.pageSize).
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
            offset(ctx.query.pageIndex * ctx.query.pageSize).
            then(res => {
                ctx.state.code = 0
                ctx.state.data = res
            }).catch(err => {
                ctx.state.code = -1
                throw new Error(err)
            })
    }
}
// 根据id获取食物详情
async function getFoodDetail(ctx, next) {
    await mysql('food').
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
// 新增美食
async function addFood(ctx, next) {
    let item = ctx.request.body
    await mysql('food').insert({
        cover: item.cover,
        title: item.title,
        descript: item.descript,
        time: item.time,
        type: item.type
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 更新美食
async function updateFood(ctx, next) {
    let item = ctx.request.body
    await mysql('food').where({ id: item.id }).
    update({
        cover: item.cover,
        title: item.title,
        descript: item.descript,
        time: item.time,
        type: item.type
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 删除美食
async function removeFood(ctx, next) {
    await mysql('food').where({
        id: ctx.request.body.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 获取图片列表
async function getFoodImg(ctx, next) {
    await mysql('food_pic').
        select('*').
        where({
            food_id: ctx.query.id
        }).
        then(res => {
            ctx.state.code = 0
            ctx.state.data = res
        }).catch(err => {
            ctx.state.code = -1
            throw new Error(err)
        })
}
// 新增美食图片
async function addFoodImg(ctx, next) {
    let item = ctx.request.body
    let arr = item.imgList.map(todo => {
        return {
            src: todo,
            food_id: item.food_id
        }
    })
    await mysql('food_pic').insert(arr).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 删除美食图片
async function removeFoodImg(ctx, next) {
    await mysql('food_pic').where({
        id: ctx.request.body.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 获取评论列表
async function getFoodRate(ctx, next) {
    await mysql('food_rate').
        select('*').
        orderBy('presentTime', 'desc').
        where({
            food_id: ctx.query.id
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
async function addFoodRate(ctx, next) {
    let item = ctx.request.body
    await mysql('food_rate').insert({
        content: item.content,
        food_id: item.food_id,
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
async function removeFoodRate(ctx, next) {
    await mysql('food_rate').where({
        id: ctx.request.body.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 获取type列表
async function getTypeList(ctx, next) {
    await mysql('food_type').
        select('*').
        then(res => {
            ctx.state.code = 0
            ctx.state.data = res
        }).catch(err => {
            ctx.state.code = -1
            throw new Error(err)
        })
}
// 新增type
async function addType(ctx, next) {
    let item = ctx.request.body
    await mysql('food_rate').insert({
        content: item.content,
        food_id: item.food_id,
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
// 删除type
async function removeFoodRate(ctx, next) {
    await mysql('food_rate').where({
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
    getFoodList,
    getFoodDetail,
    getFoodRate,
    addFoodRate,
    removeFoodRate,
    getFoodImg,
    addFood,
    updateFood,
    removeFood,
    addFoodImg,
    removeFoodImg,
    getTypeList,
}
