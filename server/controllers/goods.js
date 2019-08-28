const { mysql } = require('../qcloud')

// 查看商品列表
async function getGoodsList(ctx, next) {
  let item = ctx.query
  let filter = {}
  if (item.type) { // 按商品类型查找商品
    filterIn = ['type.id', '=', item.type]
  }
  if (item.company_id) { // 按公司查找商品
    filter['goods.company_id'] = item.company_id
  }
  if (item.type) { // 按商品类型查找商品
    filter['goods_type.type_id'] = item.type
  }
  await mysql('goods').
    join('company', 'goods.company_id', '=', 'company.id').
    join('goods_type', 'goods_type.good_id', '=', 'goods.id').
    leftJoin('type', 'goods_type.type_id', '=', 'type.id').
    join(mysql.raw('(select id, name from unit) as a'), 'goods.unitSingle', '=', 'a.id').
    join(mysql.raw('(select id, name from unit) as b'), 'goods.unitAll', '=', 'b.id').
    distinct(
      'goods.id',
      'goods.name',
      'goods.coverImg',
      'goods.desc',
      'goods.buySingle',
      'goods.buyAll',
      'goods.midSingle',
      'goods.midAll',
      'goods.sellSingle',
      'goods.sellAll',
      'goods.num',
      'goods.origin',
      'goods.company_id',
      'company.name as companyName',
      'a.name as unitSingleName',
      'b.name as unitAllName',
      mysql.raw('group_concat(type.id, "-" ,type.name) as typeName')
    ).
    groupBy('goods.id').
    where(filter).
    then(res => {
      ctx.state.code = 0
      res.forEach(item => {
        item.typeName = item.typeName.split(',').map(todo => {
          todo = todo.split('-')
          return {
            id: todo[0],
            name: todo[1]
          }
        })
      })
      ctx.state.data = res
    }).catch(err => {
      ctx.state.code = -1
      throw new Error(err)
    })
}

// 查看单个商品详情
async function getGoodsDetail(ctx, next) {
  let item = ctx.query
  await mysql('goods').
    join('company', 'goods.company_id', '=', 'company.id').
    join('goods_type', 'goods_type.good_id', '=', 'goods.id').
    leftJoin('type', 'goods_type.type_id', '=', 'type.id').
    join(mysql.raw('(select id, name from unit) as a'), 'goods.unitSingle', '=', 'a.id').
    join(mysql.raw('(select id, name from unit) as b'), 'goods.unitAll', '=', 'b.id').
    select(
      'goods.id',
      'goods.name',
      'goods.coverImg',
      'goods.desc',
      'goods.buySingle',
      'goods.buyAll',
      'goods.midSingle',
      'goods.midAll',
      'goods.sellSingle',
      'goods.sellAll',
      'goods.num',
      'goods.origin',
      'goods.company_id',
      'company.name as companyName',
      'a.name as unitSingleName',
      'b.name as unitAllName',
      mysql.raw('group_concat(type.id, "-" ,type.name) as typeName')
      // mysql.raw(`(select unit.name from unit join goods on unit.id=goods.unitSingle where goods.id=${item.id}) as unitSingleName`),
      // mysql.raw(`(select unit.name from unit join goods on unit.id=goods.unitAll where goods.id=${item.id}) as unitAllName`),
    ).
    where({
      'goods.id': item.id
    }).
    then(res => {
      ctx.state.code = 0
      res.forEach(item => {
        item.typeName = item.typeName.split(',').map(todo => {
          todo = todo.split('-')
          return {
            id: todo[0],
            name: todo[1]
          }
        })
      })
      ctx.state.data = res[0]
    }).catch(err => {
      ctx.state.code = -1
      throw new Error(err)
    })
}

// 新增商品
async function addGoods(ctx, next) {
  let item = ctx.request.body
  await mysql('goods').insert({
    name: item.name,
    company_id: item.company_id,
    coverImg: item.coverImg,
    desc: item.desc,
    unitSingle: item.unitSingle,
    unitAll: item.unitAll,
    buySingle: item.buySingle,
    buyAll: item.buyAll,
    midSingle: item.midSingle,
    midAll: item.midAll,
    sellSingle: item.sellSingle,
    sellAll: item.sellAll,
    num: item.num,
    origin: item.origin
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

// 更新单个商品信息
async function updateGoods(ctx, next) {
  let item = ctx.request.body
  await mysql('goods').where({ id: item.id }).
    update({
      name: item.name,
      company_id: item.company_id,
      coverImg: item.coverImg,
      desc: item.desc,
      unitSingle: item.unitSingle,
      unitAll: item.unitAll,
      buySingle: item.buySingle,
      buyAll: item.buyAll,
      midSingle: item.midSingle,
      midAll: item.midAll,
      sellSingle: item.sellSingle,
      sellAll: item.sellAll,
      num: item.num,
      origin: item.origin
    }).then(res => {
      ctx.state.code = 0
      ctx.state.data = res
    }).catch(err => {
      ctx.state.code = -1
      throw new Error(err)
    })
}

// 删除单个商品
async function removeGoods(ctx, next) {
  await mysql('goods').where({
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
  getGoodsList,
  getGoodsDetail,
  addGoods,
  updateGoods,
  removeGoods
}
