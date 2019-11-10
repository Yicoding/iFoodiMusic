const { mysql } = require('../qcloud')
const { changedate } = require('./util')

// 查看订单列表
async function getOrderList(ctx, next) {
    let item = ctx.query
    let filter = {}
    if (item.company_id) { //  按公司
        filter.company_id = item.company_id;
    } else if (item.state) { // 按状态
        filter.state = item.state;
    } else if (item.createUser) {
        filter.createUser = item.createUser;
    } else if (item.payUser) {
        filter.payUser = item.payUser;        
    } else if (item.finishUser) {
        filter.finishUser = item.finishUser;
    }
    item.pageIndex = item.pageIndex || 0;
    item.pageSize = item.pageSize || 10;
    item.order = item.order || 'id';
    item.sort = item.sort || 'ASC';
    try {
        let res = await mysql('order_list').
        select('*').
        where(filter).
        orderBy(ctx.query.order, ctx.query.sort).
        limit(ctx.query.pageSize).
        offset(ctx.query.pageIndex * ctx.query.pageSize);
        let data = await mysql('user').select('id', 'name', 'phone').where('company_id', item.company_id);
        let userInfo = {};
        data.forEach(item => {
            userInfo[item.id] = {
                name: item.name,
                phone: item.phone
            }
        });
        let total = await mysql('order_list').select(mysql.raw('count(*) as total')).where(filter);
        const role = item.role;
        res.forEach(item => {
            if (!role || role !== 'admin') {
                delete item.spend;
                delete item.gain;
            }
            if (item.createUser) {
                item.createUser = {
                    id: item.createUser,
                    name: userInfo[item.createUser].name,
                    phone: userInfo[item.createUser].phone
                }
            }
            if (item.payUser) {
                item.payUser = {
                    id: item.payUser,
                    name: userInfo[item.payUser].name,
                    phone: userInfo[item.payUser].phone
                }
            }
            if (item.finishUser) {
                item.finishUser = {
                    id: item.finishUser,
                    name: userInfo[item.finishUser].name,
                    phone: userInfo[item.finishUser].phone
                }
            }
        })
        const Data = Object.assign({}, total[0], {
            data: res
        });
        ctx.state.code = 0
        ctx.state.data = Data
    } catch(e) {
        ctx.state.code = -1
        throw new Error(e)
    }
}

// 查看单个订单详情
async function getOrderDetail(ctx, next) {
    await mysql('order_list').
    select('*').
    where({
        id: ctx.query.id
    }).then(async res => {
        await mysql('user').select('id', 'name', 'phone').where('company_id', res[0].company_id).then(data => {
            let userInfo = {};
            data.forEach(item => {
                userInfo[item.id] = {
                    name: item.name,
                    phone: item.phone
                }
            });
            let item = res[0];
            const role = ctx.query.role;
            if (!role || role !== 'admin') {
                delete item.spend;
                delete item.gain;
            }
            if (item.createUser) {
                item.createUser = {
                    id: item.createUser,
                    name: userInfo[item.createUser].name,
                    phone: userInfo[item.createUser].phone
                }
            }
            if (item.payUser) {
                item.payUser = {
                    id: item.payUser,
                    name: userInfo[item.payUser].name,
                    phone: userInfo[item.payUser].phone
                }
            }
            if (item.finishUser) {
                item.finishUser = {
                    id: item.finishUser,
                    name: userInfo[item.finishUser].name,
                    phone: userInfo[item.finishUser].phone
                }
            }
            ctx.state.code = 0
            ctx.state.data = item
        }).catch(err => {
            ctx.state.code = -1
            throw new Error(err)
        })
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 更新单个订单信息
async function updateOrder(ctx, next) {
    const item = ctx.request.body;
    const values = {
        state: item.state
    };
    const currentTime = changedate(new Date(), 'yyyy-MM-dd HH:mm:ss')
    if (item.state === 2) { // 收款
        values.payTime = currentTime;
        values.payUser = item.user_id;
    } else {
        values.finishTime = currentTime;
        values.finishUser = item.user_id;
    }
    await mysql('order_list').where({ id: item.id }).
    update(values).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 删除单个订单
async function removeOrder(ctx, next) {
    await mysql('order_list').where({
        id: ctx.query.id
    }).del().then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 单个订单包含的商品列表
async function getOrderDetailList(ctx, next) {
    const item = ctx.query;
    try {
        const res = await mysql('order_detail').
        select('*').
        where('order_id', item.order_id);
        const total = await mysql('order_detail').
        select(mysql.raw('count(*) as total')).
        where('order_id', item.order_id);
        const Data =  Object.assign({}, total[0], {
            data: res
        });
        ctx.state.code = 0;
        ctx.state.data = Data;
    } catch(e) {
        ctx.state.code = -1;
        throw new Error(e);
    }
}

module.exports = {
    getOrderList,
    getOrderDetail,
    updateOrder,
    removeOrder,
    getOrderDetailList
}
