const { mysql } = require('../qcloud')

// // var result = mysql('user').select('*').where({ id: 1 }) // => { id:1, name: 'leo', age: 20 }
// // var result = 'helllllllllll'
// module.exports = ctx => {
//     ctx.state.data = {
//         msg: result
//     }
//  }
module.exports = async (ctx, next) => {
    await mysql('user').select('*').then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}