/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'https://0az3korx.qcloud.la'; // 开发
var host = 'https://ilovelyplat.com:3002'; // 生产
// var host = '766293205.ifoodimusic.club'; // 生产
var hostServer = 'http://localhost:3005'; // 开发
// var hostServer = 'https://ilovelyplat.com:3002'; // 生产

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/upload`,
        album: `${host}/album`,
        getSongList: `${host}/getSongList`,
        collectFindByOpenId: `${host}/collectFindByOpenId`,
        collectFindBySongId: `${host}/collectFindBySongId`,
        addCollect: `${host}/addCollect`,
        removeCollect: `${host}/removeCollect`,
        addTimes: `${host}/addTimes`,
        findAllTimes: `${host}/findAllTimes`,
        timesDetail: `${host}/timesDetail`,
        getRateList: `${host}/getRateList`,
        addTimesRate: `${host}/addTimesRate`,
        removeRate: `${host}/removeRate`,
        findTimesByOpenid: `${host}/findTimesByOpenid`,
        findTimesNumByOpenid: `${host}/findTimesNumByOpenid`,
        removeTimes: `${host}/removeTimes`,
        getWallList: `${host}/getWallList`,
        articleDetail: `${host}/articleDetail`,
        getArticleRateList: `${host}/getArticleRateList`,
        addArticleRate: `${host}/addArticleRate`,
        removeArticleRate: `${host}/removeArticleRate`,
        getFoodList: `${host}/getFoodList`,
        getFoodDetail: `${host}/getFoodDetail`,
        getFoodRate: `${host}/getFoodRate`,
        addFoodRate: `${host}/addFoodRate`,
        removeFoodRate: `${host}/removeFoodRate`,
        getFoodImg: `${host}/getFoodImg`,
        getReadNum: `${host}/getReadNum`,
        getMsgList: `${host}/getMsgList`,
        alterMsg: `${host}/alterMsg`,
        getPlantList: `${host}/getPlantList`,
        plantDetail: `${host}/plantDetail`,
        getPlantRateList: `${host}/getPlantRateList`,
        addPlantRate: `${host}/addPlantRate`,
        removePlantRate: `${host}/removePlantRate`,
        // 美食
        addFood: `${host}/addFood`,
        updateFood: `${host}/updateFood`,
        removeFood: `${host}/removeFood`,
        addFoodImg: `${host}/addFoodImg`,
        removeFoodImg: `${host}/removeFoodImg`,
        // 植物
        getPlantImg: `${host}/getPlantImg`,
        addPlant: `${host}/addPlant`,
        updatePlant: `${host}/updatePlant`,
        removePlant: `${host}/removePlant`,
        addPlantImg: `${host}/addPlantImg`,
        removePlantImg: `${host}/removePlantImg`,
        // 菜单种类
        getTypeList: `${host}/getTypeList`,
        getTypeDetail: `${host}/getTypeDetail`,
        addType: `${host}/addType`,
        updateType: `${host}/updateType`,
        removeType: `${host}/removeType`,

        // iplat平台
        // 公司
        getCompanyList: `${host}/getCompanyList`, // 查看公司列表
        getCompanyDetail: `${host}/getCompanyDetail`, // 查看单个公司
        addCompany: `${host}/addCompany`, // 新增公司
        updateCompany: `${host}/updateCompany`, // 更新单个公司
        removeCompany: `${host}/removeCompany`, // 删除单个公司
        // 角色
        getRoleList: `${host}/getRoleList`, // 查看角色列表
        getRoleDetail: `${host}/getRoleDetail`, // 查看单个角色
        addRole: `${host}/addRole`, // 新增角色
        updateRole: `${host}/updateRole`, // 更新单个角色
        removeRole: `${host}/removeRole`, // 删除单个角色
        // 商品类型
        getGoodsTypeList: `${host}/getGoodsTypeList`, // 查看商品类型列表
        getGoodsTypeDetail: `${host}/getGoodsTypeDetail`, // 查看单个商品类型
        addGoodsType: `${host}/addGoodsType`, // 新增商品类型
        updateGoodsType: `${host}/updateGoodsType`, // 更新单个商品类型
        removeGoodsType: `${host}/removeGoodsType`, // 删除单个商品类型
        // 用户
        getUserList: `${host}/getUserList`, // 查看用户列表
        getUserDetail: `${host}/getUserDetail`, // 查看单个用户
        userLogin: `${host}/userLogin`, // 用户登录
        addUser: `${host}/addUser`, // 新增用户
        updateUser: `${host}/updateUser`, // 更新单个用户
        removeUser: `${host}/removeUser`, // 删除单个用户
        // 商品
        getGoodsList: `${host}/getGoodsList`, // 查看商品列表
        getGoodsDetail: `${host}/getGoodsDetail`, // 查看单个商品
        addGoods: `${host}/addGoods`, // 新增商品
        updateGoods: `${host}/updateGoods`, // 更新单个商品
        removeGoods: `${host}/removeGoods`, // 删除单个商品
        getGoodsByCompany: `${host}/getGoodsByCompany`, // 按公司查找所有商品类型+类型下的商品列表
        // 单位
        getUnitList: `${host}/getUnitList`, // 查看单位列表
        getUnitDetail: `${host}/getUnitDetail`, // 查看单个单位
        addUnit: `${host}/addUnit`, // 新增单位
        updateUnit: `${host}/updateUnit`, // 更新单个单位
        removeUnit: `${host}/removeUnit`, // 删除单个单位
        // 订单
        getOrderList: `${host}/getOrderList`, // 查看订单列表
        getOrderDetail: `${host}/getOrderDetail`, // 查看订单详情
        updateOrder: `${host}/updateOrder`, // 更新单个订单信息
        removeOrder: `${host}/removeOrder`, // 删除单个订单
        getOrderDetailList: `${host}/getOrderDetailList`, // 单个订单包含的商品列表
        getShoplistEasy: `${host}/getShoplistEasy`, // 单个订单包含的商品列表
        putObject: `${host}/putObject`, // 单个订单包含的商品列表
        getOpenId: `${host}/getOpenId`, // 单个订单包含的商品列表
    }
};

module.exports = config;
