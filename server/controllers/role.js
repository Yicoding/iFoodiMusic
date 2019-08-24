const { mysql } = require('../qcloud')

// 查看角色列表
async function getRoleList(ctx, next) {
    let item = ctx.query
    let filter = {}
    if (item.role_name !== 'root') {
        filter = {
            name: 'root'
        }
    }
    await mysql('role').
    select('*').
    whereNot(filter).
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 查看单个角色详情
async function getRoleDetail(ctx, next) {
    await mysql('role').
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

// 新增角色
async function addRole(ctx, next) {
    let item = ctx.request.body
    await mysql('role').insert({
        name: item.name,
        fullName: item.fullName
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

// 更新单个角色信息
async function updateRole(ctx, next) {
    let item = ctx.request.body
    await mysql('role').where({ id: item.id }).
    update({
        name: item.name,
        fullName: item.fullName
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 删除单个角色
async function removeRole(ctx, next) {
    await mysql('role').where({
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
    getRoleList,
    getRoleDetail,
    addRole,
    updateRole,
    removeRole
}
