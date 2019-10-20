const { mysql } = require('../qcloud')

// 查看商品列表
/*async function getGoodsList(ctx, next) {
  let item = ctx.query
  let filter = {};
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
      'goods.unitSingle',
      'goods.unitAll',
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
        item.unitOne = {
          id: item.unitSingle,
          name: item.unitSingleName
        }
        item.unitDouble = {
          id: item.unitAll,
          name: item.unitAllName
        }
        delete item.unitSingle
        delete item.unitSingleName
        delete item.unitAll
        delete item.unitAllName
        item.typeName = item.typeName.split(',').map(todo => {
          todo = todo.split('-')
          return {
            id: Number(todo[0]),
            name: todo[1]
          }
        })
      })
      ctx.state.data = res
    }).catch(err => {
      ctx.state.code = -1
      throw new Error(err)
    })
}*/

// 查看商品列表
async function getGoodsList(ctx, next) {
  let item = ctx.query
  let filter = {};
  if (item.company_id) { // 按公司查找商品
    filter['goods.company_id'] = item.company_id
  }
  item.type_id = item.type_id || '';
  item.pageIndex = item.pageIndex || 0;
  item.pageSize = item.pageSize || 10;
  item.order = item.order || 'id';
  item.sort = item.sort || 'ASC';
  await mysql('goods').
    join('company', 'goods.company_id', '=', 'company.id').
    join(mysql.raw('(select id, name from unit) as a'), 'goods.unitSingle', '=', 'a.id').
    join(mysql.raw('(select id, name from unit) as b'), 'goods.unitAll', '=', 'b.id').
    select(
      'goods.id',
      'goods.name',
      'goods.company_id',
      'company.name as companyName',
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
      'goods.unitSingle',
      'goods.unitAll',
      'goods.typeName',
      'a.name as unitSingleName',
      'b.name as unitAllName',
    ).
    where(filter).
    andWhere('goods.typeName', 'like', `%${item.type_id}%`). // 按商品类型查找商品
    orderBy(ctx.query.order, ctx.query.sort).
    limit(ctx.query.pageSize).
    offset(ctx.query.pageIndex * ctx.query.pageSize).
    then(async res => {
      await mysql('goods').select(mysql.raw('count(*) as total')).where(filter).
      then(async response => {
        ctx.state.code = 0
        res.forEach(item => {
          item.unitOne = {
            id: item.unitSingle,
            name: item.unitSingleName
          }
          item.unitDouble = {
            id: item.unitAll,
            name: item.unitAllName
          }
          delete item.unitSingle
          delete item.unitSingleName
          delete item.unitAll
          delete item.unitAllName
        })
        if (!item.company_id) { // 查询全部
          const Data = Object.assign({}, response[0], {
            data: res
          });
          ctx.state.data = Data
        } else { // 按公司查找商品
          await mysql('type').select('*').where('company_id', item.company_id).
            then(data => {
              let typeInfo = {};
              data.forEach(item => {
                typeInfo[item.id] = item.name
              });
              res.forEach(item => {
                item.typeName = item.typeName.split(',').map(todo => {
                  return {
                    id: Number(todo),
                    name: typeInfo[todo]
                  }
                })
              })
              const Data = Object.assign({}, response[0], {
                data: res
              });
              ctx.state.data = Data
            }).catch(err => {
              ctx.state.code = -1
              throw new Error('three?'+err)
            })
        }
      }).catch(err => {
        ctx.state.code = -1
        throw new Error('two?' + err)
      })
    }).catch(err => {
      ctx.state.code = -1
      throw new Error('one?' + err)
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
      'goods.unitSingle',
      'goods.unitAll',
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
        item.unitOne = {
          id: item.unitSingle,
          name: item.unitSingleName
        }
        item.unitDouble = {
          id: item.unitAll,
          name: item.unitAllName
        }
        delete item.unitSingle
        delete item.unitSingleName
        delete item.unitAll
        delete item.unitAllName
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
    unitSingle: item.unitSingle,
    unitAll: item.unitAll,
    buySingle: item.buySingle,
    buyAll: item.buyAll,
    midSingle: item.midSingle,
    midAll: item.midAll,
    sellSingle: item.sellSingle,
    sellAll: item.sellAll,
    num: item.num,
    desc: item.desc,
    origin: item.origin,
    coverImg: item.coverImg,
    typeName: item.typeName
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
