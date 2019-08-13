const { mysql } = require('../qcloud')

// 查看用户列表
async function getUserList(ctx, next) {
    await mysql('user').join('company', 'user.company_id', '=', 'company.id').join('role', 'user.role_id', '=', 'role.id').
    select('user.id', 'user.name', 'user.phone', 'user.password', 'user.age', 'user.sign', 'user.avatar', 'company.id as company_id', 'company.name as companyName', 'role.id as role_id', 'role.fullName as role_fullName').
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 查看单个用户详情
async function getUserDetail(ctx, next) {
    await mysql('user').
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

// 用户登录
async function userLogin(ctx, next) {
    let item = ctx.query
    await mysql('user').
    select('*').
    where({
        name: item.name,
        password: item.password
    }).
    then(res => {
        ctx.state.code = 0
        if (!res[0]) {
            ctx.state.code = 500
            ctx.state.data = { msg: '用户名或密码不正确' }
        }
        ctx.state.data = res[0]
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 新增用户
async function addUser(ctx, next) {
    let item = ctx.request.body
    await mysql('user').insert({
        name: item.name,
        phone: item.phone,
        password: item.password,
        age: item.age,
        sign: item.sign,
        avatar: item.avatar,
        role_id: item.role_id,
        company_id: item.company_id
    }).then(res => {
        ctx.state.code = 0
        let data = {
            id: res[0]
        }
        ctx.state.data = data
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 更新单个用户信息
async function updateUser(ctx, next) {
    let item = ctx.request.body
    await mysql('user').where({ id: item.id }).
    update({
        name: item.name,
        phone: item.phone,
        password: item.password,
        age: item.age,
        sign: item.sign,
        avatar: item.avatar,
        role_id: item.role_id,
        company_id: item.company_id
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 删除单个用户
async function removeUser(ctx, next) {
    await mysql('user').where({
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
    getUserList,
    getUserDetail,
    userLogin,
    addUser,
    updateUser,
    removeUser
}
