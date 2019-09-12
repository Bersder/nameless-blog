import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const account={//默认未登录状态
	namespaced:true,
	state:{
		uid:0,
		name:'???',//暂时这些信息
		avatar:'/root/test/none.png',
		token:'',
		loginStatus:false
	},
	mutations:{
		login(state,payload){
			window.localStorage.setItem('BB3000_token',payload.token);
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
			console.log('logout');
			window.localStorage.removeItem('BB3000_token');
			state.token = '';
			state.uid = 0;
			state.name = '???';
			state.avatar = '/root/test/none.png';
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
export default new Vuex.Store({
	modules: {
		account:account,
		infoBox:infoBox
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
		},
		lazyCheck(state){
			document.querySelectorAll('.lazyload').forEach(el=>{
				if (el.attributes['data-src']&&(el.src !== el.attributes['data-src'].nodeValue)){
					//到时候src和data-src需要不带端口
					//console.log(el.src,el.attributes['data-src'].nodeValue);
					if ((el.getBoundingClientRect().top<state.screenHeight + 50)&&(el.getBoundingClientRect().top>-50)){
						let img = document.createElement('img');
						const src = el.src;
						img.src = el.attributes['data-src'].nodeValue;
						img.onload = () => el.src = el.attributes['data-src'].nodeValue;
						img.onerror = () => el.attributes['data=src'].nodeValue = src;
					}
				}
			})
		}
	},
	getters:{
		reachBottom(state){
			return state.scrollTop + state.screenHeight >= document.documentElement.scrollHeight
		}
	}

})
