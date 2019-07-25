import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		platform:'',
		isMobile:false,
		scrollTop:window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
		upping:false,
		screenHeight:window.innerHeight || document.documentElement.clientHeight,
		screenWidth:document.body.clientWidth,
		isMasked:false
	},
	mutations:{
		platformInit(state,payload){
			state.platform = payload.platform;
			state.isMobile = payload.isMobile;
		},
		scrollTopC(state,cur){
			if (Math.abs(state.scrollTop - cur)>50)state.upping = (state.scrollTop > cur);
			state.scrollTop = cur
		},
		screenSizeC(state,payload){
			state.screenHeight = payload.screenHeight;
			state.screenWidth = payload.screenWidth;
		},
		isMaskedC(state,cur){
			state.isMasked = cur;
		}
	},
	getters:{

	}

})
