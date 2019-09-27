import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const account={//默认未登录状态
	namespaced:true,
	state:{
		uid:0,
		name:'???',//暂时这些信息
		avatar:'/root/site/static/passerby.png',
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
			window.localStorage.removeItem('BB3000_token');
			state.token = '';
			state.uid = 0;
			state.name = '???';
			state.avatar = '/root/site/static/passerby.png';
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
						img.onerror = () => el.attributes['data-src'].nodeValue = src;
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
