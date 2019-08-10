import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const account={
	namespaced:true,
	state:{
		name:'',
		token:'',
	},
	mutations:{
		login(state,payload){
		}
	}
};
export default new Vuex.Store({
	modules: {
		account:account
	},
	state:{
		platform:'',
		isMobile:false,
		scrollTop:window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
		upping:false,
		screenHeight:window.innerHeight || document.documentElement.clientHeight,
		screenWidth:window.innerWidth || document.body.clientWidth,
		isMasked:false,

		LBImgs:[],
		LBDescriptions:[],
		LBTimes:[],
		LBIndex:0,
		LBshow:false
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
		},
		lbImgsC(state,img_des_list){
			state.LBDescriptions.length = state.LBImgs.length = state.LBTimes.length = 0;
			img_des_list.forEach(e=>{
				state.LBImgs.push(e.imgSrc);
				state.LBDescriptions.push(e.description);
				e.time?state.LBTimes.push(e.time):state.LBTimes.push('')
			});
			state.LBIndex = 0;
		},
		lbIndexC(state,index){
			state.LBIndex = index;
		},
		lbShowC(state,cur){
			state.LBshow = cur
		}
	},
	getters:{
		reachBottom(state){
			return state.scrollTop + state.screenHeight >= document.documentElement.scrollHeight
		}
	}

})
