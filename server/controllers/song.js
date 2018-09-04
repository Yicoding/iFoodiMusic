const { mysql } = require('../qcloud')

async function getSongList(ctx, next) {
    await mysql('songlist').select('*').where({
        album_id: ctx.query.id
    }).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}
module.exports = {
    getSongList
}
