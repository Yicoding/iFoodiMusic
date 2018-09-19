// components/user/user.js
var timee = 0
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        songInfo: Object,
        stateIcon: String
    },
    /**
     * 组件的初始数据
     */
    data: {
        isExpend: false,
    },
    attached() {
        
    },
    methods: {
        // 展开收起
        switch() {
            timee && clearTimeout(timee)
            this.setData({
                isExpend: !this.data.isExpend
            })
            if (this.data.isExpend) {
                timee = setTimeout(() => {
                    console.log('close')
                    this.setData({
                        isExpend: false
                    })
                }, 4500)
            }
        },
        // 跳转到播放页面
        goPlayer() {
            let url = '../player/player'
            wx.navigateTo({
                url: url
            })
        },
        // 播放/暂停
        play() {
            this.triggerEvent('pauseSwitch')
            timee && clearTimeout(timee)
            timee = setTimeout(() => {
                console.log('close')
                this.setData({
                    isExpend: false
                })
            }, 4500)
        },
        // 关闭歌曲
        close() {
            const backgroundAudioManager = wx.getBackgroundAudioManager()
            backgroundAudioManager.stop()
            this.triggerEvent('myevent')
        },
    },
})
