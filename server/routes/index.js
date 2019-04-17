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


module.exports = router
