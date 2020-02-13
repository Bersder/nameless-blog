import Vue from 'vue'
import Vuex from 'vuex'
import {delCookie} from "../utils/lib";

Vue.use(Vuex);
const account={//默认未登录状态
	namespaced:true,
	state:{
		uid:0,
		name:'???',//暂时这些信息
		avatar:'/static/images/passerby.png',
		token:'',
		loginStatus:false
	},
	mutations:{
		login(state,payload){
			state.token = payload.token;
			state.uid = payload.info.uid;
			state.name = payload.info.name;
			state.avatar = payload.info.avatar;
			state.loginStatus = true;
		},
		alogin(state,payload){
			state.token = payload.token;
			state.uid = payload.info.uid;
			state.name = payload.info.name;
			state.avatar = payload.info.avatar;
			state.loginStatus = true;
		},
		logout(state){
			delCookie('utk');
			state.token = '';
			state.uid = 0;
			state.name = '???';
			state.avatar = '/static/images/passerby.png';
			state.loginStatus = false;
		}
	}
};
const infoBox={
	namespaced:true,
	state:{
		info:'',
		infoShow:false,
		infoOK:true
	},
	mutations:{
		callInfoBox(state,payload){
			state.info = payload.info;
			state.infoOK = payload.ok;
			state.infoShow = true;
			setTimeout(()=>state.infoShow=false,payload.during)
		}
	}
};
const lumiBox = {
	namespaced:true,
	state:{
		imgs:[],
		descriptions:[],
		times:[],
		index:0,
		show:false
	},
	mutations:{
		imgsC(state,IDTs){
			state.imgs.length = state.descriptions.length = state.times.length = 0;
			IDTs.forEach(e=>{
				state.imgs.push(e.imgSrc);
				state.descriptions.push(e.description);
				e.time?state.times.push(e.time):state.times.push('Unknown Time');
			});
			state.index = 0;
		},
		indexC(state,index){
			state.index = index;
		},
		showC(state,cur){
			if (state.imgs.length===0&&cur){}
			else
				state.show = cur;
		}
	}
};
export default new Vuex.Store({
	modules: {
		account:account,
		infoBox:infoBox,
		lumiBox:lumiBox
	},
	state:{
		platform:'',
		isMobile:false,
		scrollTop:window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
		upping:false,
		screenHeight:window.innerHeight || document.documentElement.clientHeight,
		screenWidth:window.innerWidth || document.body.clientWidth,
		isMasked:false,
		appBg:'',
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
		appBgC(state,bg){
			state.appBg = bg;
		}
	},
	getters:{
		xAboveBottom(state){
			return document.documentElement.scrollHeight - state.scrollTop - state.screenHeight
		}
	}

})
