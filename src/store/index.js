import Vue from 'vue'
import Vuex from 'vuex'
import dialogVisible from './publicStatus/dialogVisble.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 左侧菜单栏数据
        menuItems:[]
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
    },
    modules:{
        dialogVisible
    }
})

export default store