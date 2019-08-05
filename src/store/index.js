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
		isMasked:false,

		LBImgs:[],
		LBDescriptions:[],
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
		lbImgsC(state,payload){
			state.LBDescriptions.length = state.LBImgs.length = 0;
			for(let i=0;i<payload.imgs.length;i++){
				state.LBImgs.push(payload.imgs[i]);
				state.LBDescriptions.push(payload.descriptions[i]);
			}
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

	}

})
