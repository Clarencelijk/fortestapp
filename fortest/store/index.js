import  Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		userName   : '未登录用户'
		//userName: uni.getStorageSync('userName') ? uni.getStorageSync('userName') : '未登录用户'
	},
	mutations:{
		MLOGIN(state, userName){
			uni.setStorageSync('userName', userName)
			state.userName = userName
		},
		MLOGOUT(){
			uni.clearStorageSync()
			state.userName = '退出状态用户'
		}
	},
	actions:{
		login(context, userName){
			context.commit('MLOGIN', userName)
		},
		logout(context){
			context.commit('MLOGOUT')
		}
	}
})

export default store