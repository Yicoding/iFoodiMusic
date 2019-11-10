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
        'a.name as unitName',
        'shop.priceType',
        'shop.num',
        'shop.writePrice',
        'goods.name',
        'goods.coverImg',
        'goods.desc',
        'goods.buySingle',
        'goods.buyAll',
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

module.exports = {
  getShoplist,
  getShoplistEasy,
  addShop,
  updateShop,
  removeShop
};