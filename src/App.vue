<template>
  <div :id="isMobile?'mobile-app':'app'" :class="{DDF:darken,serif:fontFamily}" @click="setPanelShow=false">
	  <top-nav></top-nav>
	  <keep-alive>
		  <header-top class="header-top filter-grid" v-if="this.$route.name==='homepage'"></header-top>
	  </keep-alive>
	  <keep-alive include="Article">
		  <router-view class="site-wrapper"></router-view>
	  </keep-alive>
	  <site-footer v-if="!/login|takenote|write/.test($route.name)"></site-footer>
	  <luminous-box></luminous-box>
	  <transition name="fadedown">
		  <div class="info-box fc" v-if="infoShow" :style="{background:infoOK?'#3dcaff':'#ff763b'}">
<!--			  '#e5ffe880':'#ffe3e380'  #5abebc终物语出现的颜色-->
			  <h4><i :class="infoOK?'iconfont icon-ok':'iconfont icon-warn'"></i>{{info}}</h4>
		  </div>
	  </transition>
	  <!--回到顶部-->
	  <a class="back2top" :class="{visible:scrollTop>500&&!/takenote|write/.test($route.name)}" target="_self" @click="back2top"><img :src="back2topImg" width="100"></a>
	  <!--控制按钮-->
	  <aside class="ctrl-panel" :class="{visible:scrollTop>100&&!/takenote|write/.test($route.name)}" @click.stop="setPanelShow=!setPanelShow"><span>SETTING | <i class="iconfont icon-gear clearm"></i></span></aside>
	  <!--设置面板-->
	  <transition name="miniFadeUD">
		  <aside class="setting-panel" v-show="setPanelShow" @click.stop>
			  <section>
				  <div class="toggle-mode" id="toggle-mode" title="暂未实装"><button @click="darkModeC"><i class="iconfont clearm" :class="darken?'icon-moono':'icon-suno'"></i></button></div>
				  <div class="theme-switch">
					  <ul class="theme-list">
						  <li><i class="iconfont icon-Pixiv"></i></li>
						  <li><i class="iconfont icon-Pixiv"></i></li>
						  <li><i class="iconfont icon-Pixiv"></i></li>
						  <li><i class="iconfont icon-Pixiv"></i></li>
					  </ul>
					  <div class="font-family-setting"><button @click="fontFamilyC(1)" :class="{selected:fontFamily}">Serif</button><button @click="fontFamilyC(0)" :class="{selected:!fontFamily}">Sans</button></div>
				  </div>
			  </section>
			  <section class="links">
				  <router-link to="/login" title="Sign In" v-if="!loginStatus">ᛁ</router-link>
				  <a href="javascript:void(0);" @click="signOut" title="Sign Out" v-if="loginStatus">ᛟ</a>
				  <a target="_blank" href="https://github.com/Bersder" title="Github"><i class="iconfont icon-github"></i></a>
				  <a target="_blank" href="https://space.bilibili.com/13351138" title="Bilibili"><i class="iconfont icon-bilibili"></i></a>
				  <a target="_blank" href="https://music.163.com/user/home?id=93044810" title="网易云"><i class="iconfont icon-neteaseMusic"></i></a>
				  <a target="_blank" href="https://twitter.com/Bersder1" title="Twitter"><i class="iconfont icon-twitter"></i></a>
			  </section>
		  </aside>
	  </transition>
	  <div id="aplayer"></div>
  </div>
</template>

<script>
import TheSiteFooter from './components/TheSiteFooter'
import TheTopNav from './components/TheTopNav'
import HeaderTop from './components/HeaderTop'
import LuminousBox from './components/LuminousBox'
import {mapState} from 'vuex'
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';
import {debounce,randInt} from "./utils/lib";

export default {
    name: 'App',
	data(){
    	return {
    		st:0,
			ap:null,
			setPanelShow:false,
			fontFamily:0,
			darken:0,
			blocking:0,
			back2topImg:''
		}
	},
	created(){
		let agents = ["Android", "SymbianOS", "BlackBerry","Windows Phone", "iPad", "iPod", "iPhone"];
		for(let i=0;i<agents.length;i++)
			if (navigator.userAgent.indexOf(agents[i])>0){
				this.$store.commit('platformInit',{platform:agents[i],isMobile:true});
				break;
			}
		this.back2topImg = "/root/site/images/back2top"+randInt(1,5)+".png";
		if (window.localStorage.getItem('BB3000_token')){//尝试自动登录
			let token = window.localStorage.getItem('BB3000_token');
			this.$post('/apis/auth/aLogin.php',{token:token}).then(response=>{
				if (response.data.code>0){
					//token过期或非法,清除token
					window.localStorage.removeItem('BB3000_token');
					console.log('自动登录失败，过期/非法');
				}
				else{
					//vuex用户信息注入
					console.log('自动登录成功，开始信息注入');
					let data = response.data.data;
					data.token = token;
					this.$store.commit('account/alogin',data);
				}
			})
		}
		let FF = window.localStorage.getItem('BB3000_fontType');//尝试获取历史设置记录
		if (FF)this.fontFamily = parseInt(FF);
	},
	watch:{
    	$route(cur,pre){
    		this.setPanelShow = false;//页面发生变化强制关闭控制面板
		},
    	isMasked(cur,pre){
			//弹窗屏蔽底层滑动
    		if (cur){
				this.st = document.scrollingElement.scrollTop;
				document.body.classList.add('masked');
				document.body.style.top = -this.st+'px';
			}
    		else{
				document.body.classList.remove('masked');
				document.scrollingElement.scrollTop = this.st;
			}
		},
		loginStatus(cur,pre){
			this.$router.options.routes[1].meta.loginStatus = this.$router.options.routes[2].meta.loginStatus = cur;
			if (!cur&&/^space.*/.test(this.$route.name)){//当在个人空间进行注销时，退出个人空间返回主页
				this.$router.push({name:'homepage'});
				window.scrollTo(0,0);
			}
		},
		scrollTop(cur,pre){
			//全局图片懒加载监听
			this.$store.commit('lazyCheck');
			if (cur<=150&&this.$route.name==='homepage')//首页靠近顶部时强制关闭控制面板
				this.setPanelShow = false;
		}
	},
	mounted(){
		window.onscroll = debounce(()=>this.$store.commit('scrollTopC',window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop),50);
		window.onresize = debounce(()=>this.$store.commit('screenSizeC',{
			screenHeight:window.innerHeight || document.documentElement.clientHeight,
			screenWidth:window.innerWidth || document.body.clientWidth
		}),50);
		this.musicInit();

	},
	methods:{
    	async musicInit(){
			let musicRes= await this.$fetch('/music/music.json');
			this.ap= new APlayer({
				container:document.getElementById('aplayer'),
				fixed:true,
				volume:.2,
				lrcType:3,
				audio:musicRes.data,
				listMaxHeight:'3rem',
				storageName:'ap-setting'
			});
			this.ap.on('play',()=>this.ap.lrc.show());
			this.ap.lrc.hide();
		},
		back2top(){
    		window.scrollTo(0,0)
		},
		fontFamilyC(type){
			if (type !== this.fontFamily) {
				this.fontFamily = type;
				window.localStorage.setItem('BB3000_fontType',type.toString())
			}
		},
		darkModeC(){
    		if (!this.blocking){//用于防止频繁转换
				this.blocking ^= 1;
				document.getElementById('toggle-mode').classList.add('switching');
				setTimeout(()=>this.darken ^= 1,600);
				setTimeout(()=>{
					document.getElementById('toggle-mode').classList.remove('switching');
					this.blocking ^= 1;
				},1200);
			}
		},
		signOut(){
    		this.$store.commit('account/logout')
		}
	},
	components:{
    	'site-footer':TheSiteFooter,
		'header-top':HeaderTop,
		'top-nav':TheTopNav,
		'luminous-box':LuminousBox
	},
	computed:{
    	...mapState(['isMobile','isMasked','screenWidth','scrollTop','screenHeight']),
		...mapState({
			loginStatus:state=>state.account.loginStatus,
			infoShow:state=>state.infoBox.infoShow,
			infoOK:state=>state.infoBox.infoOK,
			info:state=>state.infoBox.info
		})
	}

}
</script>

<style>
	@import "styles/index.css";
	@import "styles/animation.css";
	@font-face {
		font-family: 'Fira Code VF';
		src: url('/root/fonts/FiraCode-VF.woff') format('woff-variations'), url("/root/fonts/FiraCode-VF.ttf") format("truetype");
		font-weight: 500;
		font-style: normal;
	}
	.serif .fc,.serif .comment-content,.serif .markdown-body{
		font-family: 'Noto Serif SC',sans-serif;
	}
	#mobile-app .content-area{
		font-size: .15rem;
	}
	.text-input{
		background: transparent;
		outline: none;
		border: none;
		color: #6c6c6c;
		text-align: center;
	}
	.text-input:focus{
		color: black;
	}
</style>
