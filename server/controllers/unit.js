const { mysql } = require('../qcloud')

// 查看单位列表
async function getUnitList(ctx, next) {
  let item = ctx.query
  let filter = {}
  if (item.company_id) {
    filter = {
      company_id: item.company_id
    }
  }
  await mysql('unit').
    join('company', 'unit.company_id', '=', 'company.id').
    select(
      'unit.id',
      'unit.name',
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

// 查看单个单位详情
async function getUnitDetail(ctx, next) {
  await mysql('unit').
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

// 新增单位
async function addUnit(ctx, next) {
  let item = ctx.request.body
  await mysql('unit').insert({
    name: item.name,
    company_id: item.company_id
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

// 更新单个单位信息
async function updateUnit(ctx, next) {
  const item = ctx.request.body;
  const info = {
    name: item.name
  };
  if (item.company_id) {
    info.company_id = item.company_id;
}
  await mysql('unit').where({ id: item.id }).
    update(info).then(res => {
      ctx.state.code = 0
      ctx.state.data = res
    }).catch(err => {
      ctx.state.code = -1
      throw new Error(err)
    })
}

// 删除单个单位
async function removeUnit(ctx, next) {
  await mysql('unit').where({
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
  getUnitList,
  getUnitDetail,
  addUnit,
  updateUnit,
  removeUnit
}
