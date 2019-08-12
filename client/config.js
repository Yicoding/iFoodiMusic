/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://0az3korx.qcloud.la'; // 开发
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
        getCompanyDetail: `${host}/weapp/getCompanyDetail`, // 查看公司列表
        addCompany: `${host}/weapp/addCompany`, // 新增公司
        updateCompany: `${host}/weapp/updateCompany`, // 更新单个公司
        removeCompany: `${host}/weapp/removeCompany`, // 删除单个公司
        // 角色
        getRoleList: `${host}/weapp/getRoleList`, // 查看公司列表
        getRoleDetail: `${host}/weapp/getRoleDetail`, // 查看公司列表
        addRole: `${host}/weapp/addRole`, // 新增公司
        updateRole: `${host}/weapp/updateRole`, // 更新单个公司
        removeRole: `${host}/weapp/removeRole`, // 删除单个公司
        // 商品类型
        getGoodsTypeList: `${host}/weapp/getGoodsTypeList`, // 查看商品类型列表
        getGoodsTypeDetail: `${host}/weapp/getGoodsTypeDetail`, // 查看商品类型列表
        addGoodsType: `${host}/weapp/addGoodsType`, // 新增商品类型
        updateGoodsType: `${host}/weapp/updateGoodsType`, // 更新单个商品类型
        removeGoodsType: `${host}/weapp/removeGoodsType`, // 删除单个商品类型
        // 用户
        getUserList: `${host}/weapp/getUserList`, // 查看用户列表
        getUserDetail: `${host}/weapp/getUserDetail`, // 查看用户列表
        addUser: `${host}/weapp/addUser`, // 新增用户
        updateUser: `${host}/weapp/updateUser`, // 更新单个用户
        removeUser: `${host}/weapp/removeUser`, // 删除单个用户
    }
};

module.exports = config;
