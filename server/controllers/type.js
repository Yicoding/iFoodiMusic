const { mysql } = require('../qcloud')

// 查看商品类型列表
async function getGoodsTypeList(ctx, next) {
    let item = ctx.query
    let filter = {}
    if (item.company_id) {
        filter = {
            company_id: item.company_id
        }
    }
    await mysql('type').
    join('company', 'type.company_id', '=', 'company.id').
    select(
        'type.id',
        'type.name',
        'type.code',
        'company.id as company_id',
        'company.name as companyName'
    ).where(filter).
    then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 查看单个商品类型详情
async function getGoodsTypeDetail(ctx, next) {
    await mysql('type').
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

// 新增商品类型
async function addGoodsType(ctx, next) {
    try {
        const item = ctx.request.body;
        const res = await mysql('type').insert({
            name: item.name,
            company_id: item.company_id
        });
        const id = res[0];
        const num = 6 - String(id).length;
        let code = '1';
        for (let i = 0; i < num; i ++) {
            code += 0
        }
        code += id;
        await mysql('type').where({ id }).update({ code });
        const data = { id };
        ctx.state.data = data;
    } catch(e) {
        ctx.state.code = -1;
        throw new Error(e);
    }
}

// 更新单个商品类型信息
async function updateGoodsType(ctx, next) {
    const item = ctx.request.body;
    const info = {
        name: item.name
    };
    if (item.company_id) {
        info.company_id = item.company_id;
    }
    await mysql('type').where({ id: item.id }).
    update(info).then(res => {
        ctx.state.code = 0
        ctx.state.data = res
    }).catch(err => {
        ctx.state.code = -1
        throw new Error(err)
    })
}

// 删除单个商品类型
async function removeGoodsType(ctx, next) {
    await mysql('type').where({
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
    getGoodsTypeList,
    getGoodsTypeDetail,
    addGoodsType,
    updateGoodsType,
    removeGoodsType
}
