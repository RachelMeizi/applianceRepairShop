import Vue from 'vue'
import App from './App'

import Utils from './utils/util.js'
import store from './store'  
import {formatTime} from '@/utils/format';
import wxPay from './utils/wxPay'

Vue.prototype.$wxPay = wxPay
Vue.prototype.$store = store 
Vue.prototype.$util=Utils
Vue.filter('formatTime',formatTime)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
