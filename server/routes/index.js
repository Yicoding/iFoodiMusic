/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)
router.get('/album', controllers.album)
router.get('/getSongList', controllers.song.getSongList)

// 歌曲收藏
router.get('/collectFindByOpenId', controllers.collect.collectFindByOpenId)
router.get('/collectFindBySongId', controllers.collect.collectFindBySongId)
router.post('/addCollect', controllers.collect.addCollect)
router.delete('/removeCollect', controllers.collect.removeCollect)
router.post('/addTimes', controllers.present.addTimes)
router.get('/findAllTimes', controllers.present.findAllTimes)
router.get('/timesDetail', controllers.present.timesDetail)
router.get('/getRateList', controllers.present.getRateList)
router.post('/addTimesRate', controllers.present.addTimesRate)
router.delete('/removeRate', controllers.present.removeRate)
router.get('/findTimesByOpenid', controllers.present.findTimesByOpenid)
router.get('/findTimesNumByOpenid', controllers.present.findTimesNumByOpenid)
router.delete('/removeTimes', controllers.present.removeTimes)
router.get('/getWallList', controllers.wall.getWallList)
router.get('/articleDetail', controllers.wall.articleDetail)
router.get('/getArticleRateList', controllers.wall.getArticleRateList)
router.post('/addArticleRate', controllers.wall.addArticleRate)
router.delete('/removeArticleRate', controllers.wall.removeArticleRate)
router.get('/getFoodList', controllers.food.getFoodList)
router.get('/getFoodDetail', controllers.food.getFoodDetail)
router.get('/getFoodRate', controllers.food.getFoodRate)
router.post('/addFoodRate', controllers.food.addFoodRate)
router.delete('/removeFoodRate', controllers.food.removeFoodRate)
router.get('/getFoodImg', controllers.food.getFoodImg)
router.get('/collectFoodByOpenId', controllers.collect.collectFoodByOpenId)
router.get('/collectFoodByFoodId', controllers.collect.collectFoodByFoodId)
router.post('/addFoodCollect', controllers.collect.addFoodCollect)
router.delete('/removeFoodCollect', controllers.collect.removeFoodCollect)
router.get('/getReadNum', controllers.msg.getReadNum)
router.get('/getMsgList', controllers.msg.getMsgList)
router.put('/alterMsg', controllers.msg.alterMsg)
router.get('/getPlantList', controllers.plant.getPlantList)
router.get('/plantDetail', controllers.plant.plantDetail)
router.get('/getPlantRateList', controllers.plant.getPlantRateList)
router.post('/addPlantRate', controllers.plant.addPlantRate)
router.delete('/removePlantRate', controllers.plant.removePlantRate)
//美食
router.post('/addFood', controllers.food.addFood)
router.put('/updateFood', controllers.food.updateFood)
router.delete('/removeFood', controllers.food.removeFood)
router.post('/addFoodImg', controllers.food.addFoodImg)
router.delete('/removeFoodImg', controllers.food.removeFoodImg)
// 植物
router.get('/getPlantImg', controllers.plant.getPlantImg)
router.post('/addPlant', controllers.plant.addPlant)
router.put('/updatePlant', controllers.plant.updatePlant)
router.delete('/removePlant', controllers.plant.removePlant)
router.post('/addPlantImg', controllers.plant.addPlantImg)
router.delete('/removePlantImg', controllers.plant.removePlantImg)
// 菜单种类
router.get('/getTypeList', controllers.food.getTypeList)
router.get('/getTypeDetail', controllers.food.getTypeDetail)
router.post('/addType', controllers.food.addType)
router.put('/updateType', controllers.food.updateType)
router.delete('/removeType', controllers.food.removeType)

// iplat平台
// 公司
router.get('/getCompanyList', controllers.company.getCompanyList) // 查看公司列表
router.get('/getCompanyDetail', controllers.company.getCompanyDetail) // 查看单个公司列表
router.post('/addCompany', controllers.company.addCompany) // 新增公司
router.put('/updateCompany', controllers.company.updateCompany) // 更新单个公司
router.delete('/removeCompany', controllers.company.removeCompany) // 删除单个公司

//角色
router.get('/getRoleList', controllers.role.getRoleList) // 查看角色列表
router.get('/getRoleDetail', controllers.role.getRoleDetail) // 查看单个角色列表
router.post('/addRole', controllers.role.addRole) // 新增角色
router.put('/updateRole', controllers.role.updateRole) // 更新单个角色
router.delete('/removeRole', controllers.role.removeRole) // 删除单个角色

// 商品类型
router.get('/getGoodsTypeList', controllers.type.getGoodsTypeList) // 查看商品类型列表
router.get('/getGoodsTypeDetail', controllers.type.getGoodsTypeDetail) // 查看单个商品类型列表
router.post('/addGoodsType', controllers.type.addGoodsType) // 新增商品类型
router.put('/updateGoodsType', controllers.type.updateGoodsType) // 更新单个商品类型
router.delete('/removeGoodsType', controllers.type.removeGoodsType) // 删除单个商品类型

// 用户
router.get('/getUserList', controllers.users.getUserList) // 查看用户列表
router.get('/getUserDetail', controllers.users.getUserDetail) // 查看单个用户列表
router.post('/userLogin', controllers.users.userLogin) // 用户登录
router.post('/addUser', controllers.users.addUser) // 新增用户
router.put('/updateUser', controllers.users.updateUser) // 更新单个用户
router.delete('/removeUser', controllers.users.removeUser) // 删除单个用户

// 商品
router.get('/getGoodsList', controllers.goods.getGoodsList) // 查看商品列表
router.get('/getGoodsDetail', controllers.goods.getGoodsDetail) // 查看单个商品列表
router.post('/addGoods', controllers.goods.addGoods) // 新增商品
router.put('/updateGoods', controllers.goods.updateGoods) // 更新单个商品
router.delete('/removeGoods', controllers.goods.removeGoods) // 删除单个商品

// 单位
router.get('/getUnitList', controllers.unit.getUnitList) // 查看单位列表
router.get('/getUnitDetail', controllers.unit.getUnitDetail) // 查看单个单位列表
router.post('/addUnit', controllers.unit.addUnit) // 新增单位
router.put('/updateUnit', controllers.unit.updateUnit) // 更新单个单位
router.delete('/removeUnit', controllers.unit.removeUnit) // 删除单个单位

// 订单
router.get('/getOrderList', controllers.order.getOrderList) // 查看订单列表
router.get('/getOrderDetail', controllers.order.getOrderDetail) // 查看订单详情
router.put('/updateOrder', controllers.order.updateOrder) // 更新单个订单信息
router.delete('/removeOrder', controllers.order.removeOrder) // 删除单个订单
router.get('/getOrderDetailList', controllers.order.getOrderDetailList) // 单个订单包含的商品列表


module.exports = router
