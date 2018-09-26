/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://0az3korx.qcloud.la';

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
    }
};

module.exports = config;
