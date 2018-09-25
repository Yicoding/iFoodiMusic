// components/user/user.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        avatar: String
    },
    /**
     * 组件的初始数据
     */
    data: {
        text: '',
        isFocus: false,
    },
    attached() {

    },
    methods: {
        // 键盘输入时触发
        textChange(e) {
            this.setData({
                text: e.detail.value.trim()
            })
            this.triggerEvent('callback', e.detail.value.trim())
        },
        // 初始化搜索
        cancel() {
            this.setData({
                text: ''
            })
            this.triggerEvent('callback', '')
        },
        empty() {
            this.setData({
                text: ''
            })
        }
    },
})
