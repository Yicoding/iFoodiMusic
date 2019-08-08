const { mysql } = require('../qcloud')
// 查看公司列表
async function getCompanyList(ctx, next) {
    await mysql('company').
    select('*').
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 查看单个公司详情
async function getCompanyDetail(ctx, next) {
    await mysql('company').
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
// 新增公司
async function addCompany(ctx, next) {
    let item = ctx.request.body
    await mysql('company').insert({
        name: item.name,
        createTime: item.createTime,
        desc: item.desc,
        logo: item.logo
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 更新单个公司
async function updateCompany(ctx, next) {
    let item = ctx.request.body
    await mysql('company').where({ id: item.id }).
    update({
        name: item.name,
        desc: item.desc,
        logo: item.logo
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
// 删除单个公司
async function removeCompany(ctx, next) {
    await mysql('company').where({
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
    getCompanyList,
    getCompanyDetail,
    addCompany,
    updateCompany,
    removeCompany
}
