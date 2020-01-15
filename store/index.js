import Vue from 'vue'
import Vuex from 'vuex'
import footer_store from "./modules/footer_store.js"
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		code: null,
		userInfo: {
			msg: '',
		},
		userInfoDetail:null,
		page: '',
		isShop: 1, //是否是商家  1=商家  2=用户
		hasLogin: true, //登陆状态
	},

	mutations: {
		//注册时间，type:increment，handler第一个参数是state；
		login(state, CODE) {
			uni.setStorageSync('CODE', CODE)
			state.userInfo.msg = CODE
			console.log(CODE, 'vuex全局缓存');
			// state.userInfo.headurl = userInfo.headurl || '/static/im/face/face_4.jpg'
		},
		logout(state) {
			uni.removeStorageSync('CODE')
			state.userInfo = null
		},
		setUserInfo(state,info){
			state.userInfoDetail = info
		},
		increment(state) {
			// 变更状态
			state.count++
		},
		commit(state, venueId) {
			state.venueId = venueId;

		},
		brandChange(state, brandId) {
			state.brandId = brandId;
		},

	},
	modules: {
		footer_store
	}

})

export default store
