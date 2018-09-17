// components/user/user.js
var timee = 0
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },
    /**
     * 组件的初始数据
     */
    data: {
        isExpend: false,
        name: ''
    },
    attached() {
        
    },
    methods: {
        switch() {
            const backgroundAudioManager = wx.getBackgroundAudioManager()
            console.log(backgroundAudioManager, 'backgroundAudioManagerbackgroundAudioManagerbackgroundAudioManager')
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
                }, 3000)
            }
        }
    },
})
