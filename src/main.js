import Vue from 'vue'
import instance from './common/js/http';
import qs from 'qs'
//elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//公共css
import './common/css/index.css'

import App from './App.vue'
import router from './router'

import store from './store'
import './permission'

Vue.config.productionTip = false

Vue.prototype.$axios = instance
Vue.prototype._qs = qs

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
