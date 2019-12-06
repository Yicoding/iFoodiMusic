/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://0az3korx.qcloud.la'; // 开发
// var host = 'https://ilovelyplat.com:3000'; // 生产
// var host = '766293205.ifoodimusic.club'; // 生产

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,
        album: `${host}/weapp/album`,
        getSongList: `${host}/weapp/getSongList`,
        collectFindByOpenId: `${host}/weapp/collectFindByOpenId`,
        collectFindBySongId: `${host}/weapp/collectFindBySongId`,
        addCollect: `${host}/weapp/addCollect`,
        removeCollect: `${host}/weapp/removeCollect`,
        addTimes: `${host}/weapp/addTimes`,
        findAllTimes: `${host}/weapp/findAllTimes`,
        timesDetail: `${host}/weapp/timesDetail`,
        getRateList: `${host}/weapp/getRateList`,
        addTimesRate: `${host}/weapp/addTimesRate`,
        removeRate: `${host}/weapp/removeRate`,
        findTimesByOpenid: `${host}/weapp/findTimesByOpenid`,
        findTimesNumByOpenid: `${host}/weapp/findTimesNumByOpenid`,
        removeTimes: `${host}/weapp/removeTimes`,
        getWallList: `${host}/weapp/getWallList`,
        articleDetail: `${host}/weapp/articleDetail`,
        getArticleRateList: `${host}/weapp/getArticleRateList`,
        addArticleRate: `${host}/weapp/addArticleRate`,
        removeArticleRate: `${host}/weapp/removeArticleRate`,
        getFoodList: `${host}/weapp/getFoodList`,
        getFoodDetail: `${host}/weapp/getFoodDetail`,
        getFoodRate: `${host}/weapp/getFoodRate`,
        addFoodRate: `${host}/weapp/addFoodRate`,
        removeFoodRate: `${host}/weapp/removeFoodRate`,
        getFoodImg: `${host}/weapp/getFoodImg`,
        getReadNum: `${host}/weapp/getReadNum`,
        getMsgList: `${host}/weapp/getMsgList`,
        alterMsg: `${host}/weapp/alterMsg`,
        getPlantList: `${host}/weapp/getPlantList`,
        plantDetail: `${host}/weapp/plantDetail`,
        getPlantRateList: `${host}/weapp/getPlantRateList`,
        addPlantRate: `${host}/weapp/addPlantRate`,
        removePlantRate: `${host}/weapp/removePlantRate`,
        // 美食
        addFood: `${host}/weapp/addFood`,
        updateFood: `${host}/weapp/updateFood`,
        removeFood: `${host}/weapp/removeFood`,
        addFoodImg: `${host}/weapp/addFoodImg`,
        removeFoodImg: `${host}/weapp/removeFoodImg`,
        // 植物
        getPlantImg: `${host}/weapp/getPlantImg`,
        addPlant: `${host}/weapp/addPlant`,
        updatePlant: `${host}/weapp/updatePlant`,
        removePlant: `${host}/weapp/removePlant`,
        addPlantImg: `${host}/weapp/addPlantImg`,
        removePlantImg: `${host}/weapp/removePlantImg`,
        // 菜单种类
        getTypeList: `${host}/weapp/getTypeList`,
        getTypeDetail: `${host}/weapp/getTypeDetail`,
        addType: `${host}/weapp/addType`,
        updateType: `${host}/weapp/updateType`,
        removeType: `${host}/weapp/removeType`,

        // iplat平台
        // 公司
        getCompanyList: `${host}/weapp/getCompanyList`, // 查看公司列表
        getCompanyDetail: `${host}/weapp/getCompanyDetail`, // 查看单个公司
        addCompany: `${host}/weapp/addCompany`, // 新增公司
        updateCompany: `${host}/weapp/updateCompany`, // 更新单个公司
        removeCompany: `${host}/weapp/removeCompany`, // 删除单个公司
        // 角色
        getRoleList: `${host}/weapp/getRoleList`, // 查看角色列表
        getRoleDetail: `${host}/weapp/getRoleDetail`, // 查看单个角色
        addRole: `${host}/weapp/addRole`, // 新增角色
        updateRole: `${host}/weapp/updateRole`, // 更新单个角色
        removeRole: `${host}/weapp/removeRole`, // 删除单个角色
        // 商品类型
        getGoodsTypeList: `${host}/weapp/getGoodsTypeList`, // 查看商品类型列表
        getGoodsTypeDetail: `${host}/weapp/getGoodsTypeDetail`, // 查看单个商品类型
        addGoodsType: `${host}/weapp/addGoodsType`, // 新增商品类型
        updateGoodsType: `${host}/weapp/updateGoodsType`, // 更新单个商品类型
        removeGoodsType: `${host}/weapp/removeGoodsType`, // 删除单个商品类型
        // 用户
        getUserList: `${host}/weapp/getUserList`, // 查看用户列表
        getUserDetail: `${host}/weapp/getUserDetail`, // 查看单个用户
        userLogin: `${host}/weapp/userLogin`, // 用户登录
        addUser: `${host}/weapp/addUser`, // 新增用户
        updateUser: `${host}/weapp/updateUser`, // 更新单个用户
        removeUser: `${host}/weapp/removeUser`, // 删除单个用户
        // 商品
        getGoodsList: `${host}/weapp/getGoodsList`, // 查看商品列表
        getGoodsDetail: `${host}/weapp/getGoodsDetail`, // 查看单个商品
        addGoods: `${host}/weapp/addGoods`, // 新增商品
        updateGoods: `${host}/weapp/updateGoods`, // 更新单个商品
        removeGoods: `${host}/weapp/removeGoods`, // 删除单个商品
        getGoodsByCompany: `${host}/weapp/getGoodsByCompany`, // 按公司查找所有商品类型+类型下的商品列表
        // 单位
        getUnitList: `${host}/weapp/getUnitList`, // 查看单位列表
        getUnitDetail: `${host}/weapp/getUnitDetail`, // 查看单个单位
        addUnit: `${host}/weapp/addUnit`, // 新增单位
        updateUnit: `${host}/weapp/updateUnit`, // 更新单个单位
        removeUnit: `${host}/weapp/removeUnit`, // 删除单个单位
        // 订单
        getOrderList: `${host}/weapp/getOrderList`, // 查看订单列表
        getOrderDetail: `${host}/weapp/getOrderDetail`, // 查看订单详情
        updateOrder: `${host}/weapp/updateOrder`, // 更新单个订单信息
        removeOrder: `${host}/weapp/removeOrder`, // 删除单个订单
        getOrderDetailList: `${host}/weapp/getOrderDetailList`, // 单个订单包含的商品列表
        getShoplistEasy: `${host}/weapp/getShoplistEasy`, // 单个订单包含的商品列表
    }
};

module.exports = config;
