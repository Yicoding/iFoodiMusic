const { mysql } = require('../qcloud');

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
    const { user_id, good_id, unitType, priceType, num } = ctx.request.body;
    const res = await mysql('shop').
    insert({
      user_id,
      good_id,
      unitType,
      priceType,
      num
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
    const { good_id, user_id, num, unitType, priceType, value } = ctx.request.body;
    const filter = { num };
    if (value) {
      filter.priceType = value;
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
  getShoplistEasy,
  addShop,
  updateShop,
  removeShop
};