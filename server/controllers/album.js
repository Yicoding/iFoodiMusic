const { mysql } = require('../qcloud')
// 查找专辑列表
module.exports = async (ctx, next) => {
    await mysql('album').select('*').then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}