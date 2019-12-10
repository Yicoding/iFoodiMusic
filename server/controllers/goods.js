const { mysql } = require('../qcloud')

// 查看商品列表
async function getGoodsList(ctx, next) {
  try {
    let item = ctx.query
    let filter = {};
    if (item.company_id) { // 按公司查找商品
      filter['goods.company_id'] = item.company_id
    }
    item.code = item.code || '[1-9]+';
    item.name = item.name || '';
    item.pageIndex = item.pageIndex || 0;
    item.pageSize = item.pageSize || 10;
    item.order = item.order || 'id';
    item.sort = item.sort || 'ASC';
    const res = await mysql('goods').
      leftJoin('order_detail', 'goods.id', '=', 'order_detail.good_id').
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
        mysql.raw('count(order_detail.id) as saleNum')
      ).
      groupBy('goods.id').
      where(filter).
      andWhere('goods.typeName', 'REGEXP', `${item.code}`).
      andWhere('goods.name', 'like', `%${item.name}%`). // 按商品类型查找商品
      orderBy(ctx.query.order, ctx.query.sort).
      limit(ctx.query.pageSize).
      offset(ctx.query.pageIndex * ctx.query.pageSize);
    const response = mysql('goods').select(mysql.raw('count(*) as total')).where(filter).
      andWhere('goods.typeName', 'REGEXP', `${item.code}`).
      andWhere('goods.typeName', 'like', `%${item.name}%`);
    ctx.state.code = 0;
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
    });
    if (!item.company_id) { // 查询全部
      const Data = Object.assign({}, response[0], {
        data: res
      });
      ctx.state.data = Data
    } else { // 按公司查找商品
      const data = await mysql('type').select('*').where('company_id', item.company_id);
      let typeInfo = {};
      data.forEach(item => {
        typeInfo[item.code] = {
          id: item.id,
          name: item.name,
          code: item.code
        }
      });
      res.forEach(item => {
        if (item.typeName === '0') {
          item.typeName = '0'
        } else {
          item.typeName = item.typeName.split(',').map(todo => {
            return {
              id: typeInfo[todo].id,
              name: typeInfo[todo].name,
              code: typeInfo[todo].code
            }
          })
        }
      })
      const Data = Object.assign({}, response[0], {
        data: res
      });
      ctx.state.data = Data
    }
  } catch (e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// 查看单个商品详情
async function getGoodsDetail(ctx, next) {
  try {
    const { id, company_id } = ctx.query;
    const res = await mysql('goods').
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
        'goods.unitSingle',
        'goods.unitAll',
        'goods.buySingle',
        'goods.buyAll',
        'goods.midSingle',
        'goods.midAll',
        'goods.sellSingle',
        'goods.sellAll',
        'goods.num',
        'goods.origin',
        'goods.typeName',
        'a.name as unitSingleName',
        'b.name as unitAllName',
      ).where({ 'goods.id': id });
    if (res.length === 0) { // 不存在
      ctx.state.code = -1;
      throw new Error('商品不存在');
      return;
    }
    const data = await mysql('type').select('*').where('company_id', company_id);
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
      let typeInfo = {};
      data.forEach(item => {
        typeInfo[item.code] = {
          id: item.id,
          name: item.name,
          code: item.code
        }
      });
      if (item.typeName === '0') {
        item.typeName = '0'
      } else {
        item.typeName = item.typeName.split(',').map(todo => {
          return {
            id: typeInfo[todo].id,
            name: typeInfo[todo].name,
            code: typeInfo[todo].code
          }
        })
      }
    });
    ctx.state.code = 0;
    ctx.state.data = res[0];
  } catch (e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}
// 查看单个商品详情
async function getGoodsDetailById(ctx, next) {
  try {
    const { id } = ctx.query;
    const res = await mysql('goods').
      select('*').where({ id });
    if (res.length === 0) { // 不存在
      ctx.state.code = -1;
      throw new Error('商品不存在');
      return;
    }
    ctx.state.code = 0;
    ctx.state.data = res[0];
  } catch (e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// 新增商品
async function addGoods(ctx, next) {
  let item = ctx.request.body
  await mysql('goods').insert({
    name: item.name,
    company_id: item.company_id,
    unitSingle: item.unitOne_id,
    unitAll: item.unitDouble_id,
    num: item.num,
    buySingle: item.buySingle,
    buyAll: item.buyAll,
    midSingle: item.midSingle,
    midAll: item.midAll,
    sellSingle: item.sellSingle,
    sellAll: item.sellAll,
    desc: item.desc,
    origin: item.origin,
    coverImg: item.coverImg,
    typeName: String(item.typeName)
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
      unitSingle: item.unitOne_id,
      unitAll: item.unitDouble_id,
      num: item.num,
      buySingle: item.buySingle,
      buyAll: item.buyAll,
      midSingle: item.midSingle,
      midAll: item.midAll,
      sellSingle: item.sellSingle,
      sellAll: item.sellAll,
      desc: item.desc,
      origin: item.origin,
      coverImg: item.coverImg,
      typeName: String(item.typeName)
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

// 按公司查找所有商品类型+类型下的商品列表
async function getGoodsByCompany(ctx, next) {
  try {
    const item = ctx.query;
    const res = await mysql('type').
      select('id', 'name', 'code').
      where('company_id', item.company_id);
    for (let i = 0; i < res.length; i++) {
      const todu = res[i];
      const data = await mysql('goods').
        leftJoin('order_detail', 'goods.id', '=', 'order_detail.good_id').
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
          'goods.unitSingle',
          'goods.unitAll',
          'a.name as unitSingleName',
          'b.name as unitAllName',
          mysql.raw('count(order_detail.id) as saleNum')
        ).where('goods.typeName', 'REGEXP', `${todu.code}`).
        groupBy('goods.id');
      data.forEach(one => {
        one.unitOne = {
          id: one.unitSingle,
          name: one.unitSingleName
        };
        one.unitDouble = {
          id: one.unitAll,
          name: one.unitAllName
        };
        delete one.unitSingle;
        delete one.unitSingleName;
        delete one.unitAll;
        delete one.unitAllName;
        if (!item.role || item.role !== 'admin') {
          delete one.buySingle;
          delete one.buyAll;
        }
      });
      todu.children = data;
    }
    ctx.state.code = 0;
    ctx.state.data = res;
  } catch (e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

module.exports = {
  getGoodsList,
  getGoodsDetail,
  getGoodsDetailById,
  addGoods,
  updateGoods,
  removeGoods,
  getGoodsByCompany
}
