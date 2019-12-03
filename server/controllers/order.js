const { mysql } = require('../qcloud')
const { changedate } = require('./util')
// 打印配置
// const yly = require('yly-nodejs-sdk');
// const config = new yly.Config({
//     'cid': '1087420892',         //应用id
//     'secret': 'fbd1936498aa2bae20e2b7d5332d67c2'       //应用秘钥
// });
// const oauthClient = new yly.OauthClinet(config);
// let tokenData;

// 查看订单列表
async function getOrderList(ctx, next) {
    const item = ctx.query;
    const filter = {};
    const betweenFiler = {};
    item.company_id && (filter.company_id = item.company_id); //  按公司
    item.state && (filter.state = item.state); // 按状态
    item.createUser && (filter.createUser = item.createUser);
    item.payUser && (filter.payUser = item.payUser);
    item.finishUser && (filter.finishUser = item.finishUser);

    item.pageIndex = item.pageIndex || 0;
    item.pageSize = item.pageSize || 10;
    item.order = item.order || 'id';
    item.sort = item.sort || 'ASC';
    if (item.date) {
        betweenFiler.createTime = [`${item.date} 00:00:00`, `${item.date} 23:59:59`];
    }
    try {
        let res;
        if (item.date) {
            res = await mysql('order_list').
                select('*').
                where(filter).
                whereBetween('createTime', [`${item.date} 00:00:00`, `${item.date} 23:59:59`]).
                orderBy(item.order, item.sort).
                limit(item.pageSize).
                offset(item.pageIndex * item.pageSize);
        } else {
            res = await mysql('order_list').
                select('*').
                where(filter).
                orderBy(item.order, item.sort).
                limit(item.pageSize).
                offset(item.pageIndex * item.pageSize);
        }
        const data = await mysql('user').select('id', 'name', 'phone').where('company_id', item.company_id);
        const userInfo = {};
        data.forEach(item => {
            userInfo[item.id] = {
                name: item.name,
                phone: item.phone
            }
        });
        const total = await mysql('order_list').select(mysql.raw('count(*) as total')).where(filter);
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
    } catch (e) {
        ctx.state.code = -1
        throw new Error(e)
    }
}

// 打印订单
async function printOrderById(ctx, next) {
    try {
        const item = ctx.request.body;
        const { id } = item;
        const res = await mysql('order_list').select('*').where({ id });
        
        const data = await mysql('order_detail').
            select('*').
            where('order_id', id);
        res[0].goodList = data;
        // let goodList = '';
        // for (let i = 0; i < data.length; i ++) {
        //     const item = data[i];
        //     goodList + `<tr><td>${item.name}</td><td>${item.sale}</td><td>x${item.num}${item.unitType == 1 ? item.unitSingle : item.unitAll}</td><td>${item.total}</td></tr>`;
        // }
        // res[0].msg = goodList;
        // const result = await oauthClient.getToken();
        // if (
        //     result.error != 0 &&
        //     result.error_description != 'success'
        // ) {
        //     throw new Error('failed:' + result.error_description);
        // }
        // tokenData = {
        //     'accessToken': result.body.access_token,
        //     'refreshToken': result.body.refresh_token,
        // };
        // if (result.body.machine_code) {
        //     tokenData.machineCode = result.body.machine_code;
        // }

        // var RpcClient = new yly.RpcClient(tokenData.accessToken, config);
        // var Print = new yly.Print(RpcClient);
        // var content = "<FS2><center>**#恒祥茶庄**</center></FS2>";
        // // content += repeat('.', 32);
        // content += '.'.repeat(32);
        // content += "<FS2><center>--在线支付--</center></FS2>";
        // content += `订单时间:${changeDate(new Date(), 'yyyy-MM-dd HH:mm')}\n`;
        // content += `订单编号:${res[0].id}\n`;
        // content += '*'.repeat(32) + "商品" + '*'.repeat(32);
        // content += "<table>";
        // content += "<tr><td>商品名</td><td>单价</td><td>数量</td><td>合计</td></tr>";
        // content += goodList;
        // content += "</table>";
        // content += '.'.repeat(32);
        // content += "<QR>这是二维码内容</QR>";
        // content += '*'.repeat(32);
        // content += `订单总价: ¥ ${res[0].total} 元\n`;
        // content += "<FS2><center>**#end**</center></FS2>";
        // await Print.index(tokenData.machineCode || '4004632435', 'orderNo1', content);

        ctx.state.code = 0;
        ctx.state.data = res[0];
    } catch (err) {
        ctx.state.code = -1
        throw new Error(err)
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

// 新增订单
async function addOrder(ctx, next) {
    try {
        const item = ctx.request.body;
        const {
            company_id,
            spend,
            total,
            gain,
            createUser,
            customerName,
            customerPhone,
            customerSite,
            orderList
        } = item;
        const currentTime = changedate(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const res = await mysql('order_list').insert({
            company_id,
            spend,
            total,
            gain,
            state: 1,
            createTime: currentTime,
            createUser,
            customerName,
            customerPhone,
            customerSite
        });
        const id = res[0]
        orderList.forEach(item => {
            item.order_id = id
        })
        await mysql('order_detail').insert(orderList);
        ctx.state.code = 0
        const data = { id };
        ctx.state.data = data;
    } catch (e) {
        ctx.state.code = -1;
        throw new Error(e);
    }
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

// 更新单个订单商品发货状态
async function updateOrderGood(ctx, next) {
    try {
        const item = ctx.request.body;
        const { ids, isChecked } = item;
        const res = await mysql('order_detail').where('id', 'in', ids).update('isChecked', isChecked);
        ctx.state.code = 0
        ctx.state.data = res
    } catch (e) {
        ctx.state.code = -1
        throw new Error(e)
    }
}

// 删除单个订单
async function removeOrder(ctx, next) {
    await mysql('order_list').where({
        id: ctx.query.id || ctx.request.body.id
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
        const Data = Object.assign({}, total[0], {
            data: res
        });
        ctx.state.code = 0;
        ctx.state.data = Data;
    } catch (e) {
        ctx.state.code = -1;
        throw new Error(e);
    }
}

module.exports = {
    getOrderList,
    getOrderDetail,
    addOrder,
    updateOrder,
    updateOrderGood,
    removeOrder,
    getOrderDetailList,
    printOrderById
}
