const { mysql } = require('../qcloud')

// 查看用户列表
async function getUserList(ctx, next) {
    let item = ctx.query
    let filter = {},
        filterNot = []
    if (item.company_id) {
        filter = {
            company_id: item.company_id
        }
        filterNot = ['root']
    }
    await mysql('user').
        join('company', 'user.company_id', '=', 'company.id').
        join('role', 'user.role_id', '=', 'role.id').
        select(
            'user.id',
            'user.name',
            'user.phone',
            'user.password',
            'user.age',
            'user.sign',
            'user.avatar',
            'company.id as company_id',
            'company.name as companyName',
            'role.id as role_id',
            'role.name as role_name',
            'role.fullName as role_fullName'
        ).
        where(filter).
        whereNotIn('role.name', filterNot).
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
        }).then(res => {
            ctx.state.code = 0
            ctx.state.data = res[0]
        }).catch(err => {
            ctx.state.code = -1
            throw new Error(err)
        })
}

// 用户登录
async function userLogin(ctx, next) {
    let item = ctx.request.body
    await mysql('user').join('company', 'user.company_id', '=', 'company.id').join('role', 'user.role_id', '=', 'role.id').
        select(
            'user.id',
            'user.name',
            'user.phone',
            'user.password',
            'user.age',
            'user.sign',
            'user.avatar',
            'company.id as company_id',
            'company.name as companyName',
            'role.id as role_id',
            'role.name as role_name'
        ).where({
            'user.name': item.name,
            'user.password': item.password
        }).then(res => {
            ctx.state.code = 0
            if (res.length === 0) {
                ctx.state.code = -1
                ctx.state.data = '用户名或密码不正确'
                return
            }
            ctx.state.data = res[0]
        }).catch(err => {
            ctx.state.code = -1
            throw new Error(err)
        })
}

// 小程序用户登录
async function loginByWx(ctx, next) {
    try {
        const item = ctx.request.body;
        const res = await mysql('user').join('company', 'user.company_id', '=', 'company.id').join('role', 'user.role_id', '=', 'role.id').
            select(
                'user.id',
                'user.name',
                'user.sex',
                'user.phone',
                'user.password',
                'user.age',
                'user.sign',
                'user.avatar',
                'company.id as company_id',
                'company.name as companyName',
                'role.id as role_id',
                'role.name as role_name'
            ).where({
                'user.phone': item.phone,
                'user.password': item.password
            });
        ctx.state.code = 0
        if (res.length === 0) {
            ctx.state.code = -1
            ctx.state.data = '用户名或密码不正确'
            return
        }
        ctx.state.data = res[0]
    } catch (e) {
        ctx.state.code = -1
        throw new Error(e)
    }
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
        // id: ctx.request.body.id
        id: ctx.query.id || ctx.request.body.id
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
    loginByWx,
    addUser,
    updateUser,
    removeUser
}
