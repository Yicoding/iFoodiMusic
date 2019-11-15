const { mysql } = require('../qcloud');

// 获取购物车列表
async function getShoplist(ctx, next) {
  try {
    const { user_id, order='DESC' } = ctx.query;
    const res = await mysql('shop').
    join('goods', 'shop.good_id', '=', 'goods.id').
    join(mysql.raw('(select id, name from unit) as a'), 'goods.unitSingle', '=', 'a.id').
    join(mysql.raw('(select id, name from unit) as b'), 'goods.unitAll', '=', 'b.id').
      select(
        'shop.id',
        'shop.good_id',
        'shop.unitType',
        'a.name as unitSingleName',
        'b.name as unitAllName',
        'shop.priceType',
        'shop.num',
        'shop.writePrice',
        'goods.name',
        'goods.coverImg',
        'goods.desc',
        'goods.buySingle',
        'goods.buyAll',
        'goods.midSingle',
        'goods.midAll',
        'goods.sellSingle',
        'goods.sellAll',
        'goods.num as unitDecimal'
      ).
      where('user_id', user_id).
      orderBy('shop.id', order);
    ctx.state.code = 0;
    ctx.state.data = res;
  } catch(e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// // 获取购物车列表
// async function getShoplist(ctx, next) {
//   try {
//     const { user_id, order='DESC' } = ctx.query;
//     const res = await mysql('shop').
//     join('goods', 'shop.good_id', '=', 'goods.id').
//     leftJoin('good_remove', 'shop.good_id', '=', 'goods.id').
//     join(mysql.raw('(select id, name from unit) as a'), 'goods.unitSingle', '=', 'a.id').
//     join(mysql.raw('(select id, name from unit) as b'), 'goods.unitAll', '=', 'b.id').
//     join(mysql.raw('(select id, name from unit) as c'), 'good_remove.unitSingle', '=', 'c.id').
//     join(mysql.raw('(select id, name from unit) as d'), 'good_remove.unitAll', '=', 'd.id').
//       select(
//         'shop.id',
//         'shop.good_id',
//         'shop.unitType',
//         'a.name as unitSingleName',
//         'b.name as unitAllName',
//         'c.name as delunitSingleName',
//         'd.name as delunitAllName',
//         'shop.priceType',
//         'shop.num',
//         'shop.writePrice',
//         'goods.name',
//         'goods.coverImg',
//         'goods.desc',
//         'goods.buySingle',
//         'goods.buyAll',
//         'goods.midSingle',
//         'goods.midAll',
//         'goods.sellSingle',
//         'goods.sellAll',
//         'goods.num as unitDecimal',
//         'good_remove.name as delname',
//         'good_remove.coverImg as delcoverImg',
//         'good_remove.descript as deldesc',
//         'good_remove.buySingle as delbuySingle',
//         'good_remove.buyAll as delbuyAll',
//         'good_remove.midSingle as delmidSingle',
//         'good_remove.midAll as delmidAll',
//         'good_remove.sellSingle as delsellSingle',
//         'good_remove.sellAll as delsellAll',
//         'good_remove.num as delunitDecimal',
//       ).
//       where('user_id', user_id).
//       orderBy('shop.id', order);
//     ctx.state.code = 0;
//     ctx.state.data = res;
//   } catch(e) {
//     ctx.state.code = -1;
//     throw new Error(e);
//   }
// }

// 获取购物车列表easy版
async function getShoplistEasy(ctx, next) {
  try {
    const { user_id } = ctx.query;
    const res = await mysql('shop').
      select('*').
      where('user_id', user_id);
    ctx.state.code = 0;
    ctx.state.data = res;
  } catch(e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// 新增购物车
async function addShop(ctx, next) {
  try {
    const { user_id, good_id, unitType, priceType, num, writePrice } = ctx.request.body;
    const res = await mysql('shop').
    insert({
      user_id,
      good_id,
      unitType,
      priceType,
      num,
      writePrice
    });
    ctx.state.code = 0;
    const data = {
      id: res[0]
    };
    ctx.state.data = data;
  } catch(e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// 修改单个购物车商品数量
async function updateShop(ctx, next) {
  try {
    const { good_id, user_id, num, unitType, priceType, value, writePrice } = ctx.request.body;
    const filter = { num };
    if (value) {
      filter.priceType = value;
    }
    if (writePrice) {
      filter.writePrice = writePrice;
    }
    const res = await mysql('shop').
      update(filter).
      where({
        good_id,
        unitType,
        priceType,
        user_id
      });
    ctx.state.code = 0;
    ctx.state.data = res;
  } catch(e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// 删除单个购物车
async function removeShop(ctx, next) {
  try {
    const { good_id, user_id, unitType, priceType } = ctx.request.body;
    const res = await mysql('shop').where({
      good_id,
      unitType,
      priceType,
      user_id
    }).del();
    ctx.state.code = 0;
    ctx.state.data = res;
  } catch(e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// 按商品购物车id，删除单个购物车商品
async function removeShopById(ctx, next) {
  try {
    const { id } = ctx.request.body;
    const res = await mysql('shop').where({id}).del();
    ctx.state.code = 0;
    ctx.state.data = res;
  } catch(e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

// 按用户删除购物车
async function removeShopByUser(ctx, next) {
  try {
    const { user_id } = ctx.request.body;
    const res = await mysql('shop').where({
      user_id
    }).del();
    ctx.state.code = 0;
    ctx.state.data = res;
  } catch(e) {
    ctx.state.code = -1;
    throw new Error(e);
  }
}

module.exports = {
  getShoplist,
  getShoplistEasy,
  addShop,
  updateShop,
  removeShop,
  removeShopById,
  removeShopByUser
};