<template>
  <div :id="isMobile?'mobile-app':'app'" :class="{DDF:darken}" >
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
		  <div class="info-box" v-if="infoShow" :style="{background:infoOK?'#3dcaff':'#ff763b'}">
<!--			  '#e5ffe880':'#ffe3e380'  #5abebc终物语出现的颜色-->
			  <h4><i :class="infoOK?'iconfont icon-ok':'iconfont icon-warn'"></i>{{info}}</h4>
		  </div>
	  </transition>
	  <!--回到顶部-->
	  <a class="back2top" :class="{visible:scrollTop>500&&!/takenote|write/.test($route.name)}" target="_self" @click="back2top"><img :src="back2topImg" width="100"></a>
	  <!--控制按钮-->
	  <aside class="ctrl-panel" :class="{visible:scrollTop>100&&!/takenote|write/.test($route.name)}" @click="setPanelShow=!setPanelShow"><span>SETTING | <i class="iconfont icon-gear clearm"></i></span></aside>
	  <!--设置面板-->
	  <transition name="miniFadeUD">
		  <aside class="setting-panel" v-show="setPanelShow">
			  <section>
				  <div class="toggle-mode" id="toggle-mode" title="暂未实装"><button @click="darkModeC"><i class="iconfont clearm" :class="darken?'icon-moono':'icon-suno'"></i></button></div>
				  <div class="theme-switch">
					  <ul class="theme-list">
						  <li><i class="iconfont icon-Pixiv"></i></li>
						  <li><i class="iconfont icon-Pixiv"></i></li>
						  <li><i class="iconfont icon-Pixiv"></i></li>
						  <li><i class="iconfont icon-Pixiv"></i></li>
					  </ul>
					  <div class="font-family-setting"><button @click="fontFamilyC(0)" :class="{selected:!fontFamily}">Serif</button><button @click="fontFamilyC(1)" :class="{selected:fontFamily}">Sans</button></div>
				  </div>
			  </section>
			  <section class="links">
				  <router-link to="/login" title="Sign In">ᛁ</router-link>
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
import LuminousBox from '@/components/LuminousBox'
import {mapState} from 'vuex'
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';
import {debounce,randInt} from "./util/util";
import {post,fetch} from "./util/http";

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
			post('/apis/auth/aLogin.php',{token:token}).then(response=>{
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
			let musicRes= await fetch('/music/music.json');
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
    		this.fontFamily = type
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
	@import "assets/animation.css";
	@font-face {
		font-family: 'Fira Code VF';
		src: url('/root/fonts/FiraCode-VF.woff') format('woff-variations'), url("/root/fonts/FiraCode-VF.ttf") format("truetype");
		font-weight: 500;
		font-style: normal;
	}
	.miniFadeUD-enter-active{
		animation: mini-fadeInUp .3s cubic-bezier(.25,.46,.45,.94);
	}
	.miniFadeUD-leave-active{
		animation: mini-fadeInUp .3s cubic-bezier(.25,.46,.45,.94) reverse;
	}
	#mobile-app .setting-panel,#mobile-app .ctrl-panel{
		display: none;
	}
	.setting-panel{
		position: fixed;
		right: .2rem;
		bottom: .3rem;
		color: #2e2e2e;
		background: #fafafa;
		border: .06rem solid #5abebc15;
		border-radius: .05rem;
		width: 2.5rem;
		box-shadow: 0 0 .2rem #5abebc20;
		z-index: 2000;
	}
		.setting-panel section{
			display: flex;
			padding: .1rem .05rem;
		}

		.setting-panel .toggle-mode{
			padding-right: .05rem;
			border-right: .01rem solid #eaeaea;
			text-align: center;
		}
			.toggle-mode.switching button{
				animation:switch 1.2s cubic-bezier(.25,.46,.45,.94);
			}
			.setting-panel .toggle-mode button{
				height: .66rem;
				width: .66rem;
				border-radius: 50%;
				line-height: .66rem;
				font-size: .5rem;
				color: orange;
			}
			.setting-panel .toggle-mode button:hover{
				background: #5abebc10;
			}

		.setting-panel .theme-switch{
			display: flex;
			flex-flow: column wrap;
			justify-content: space-between;
			flex: 1;
			padding-left: .05rem;
		}
			.setting-panel .theme-switch .theme-list{
				flex: 1;
				font-size: 0;
				list-style-type: none;
				margin-bottom: .04rem;
			}
				.theme-list li{
					display: inline-block;
					background: #5abebc10;
					margin-right: .05rem;
					width: .3rem;
					height: .3rem;
					line-height: .3rem;
					border-radius: 50%;
					cursor: pointer;
				}
				.theme-list li:hover{
					background: #5abebc;
					color: white;
				}
					.theme-list li i{
						margin: 0;
						font-size: .16rem;
					}

			.setting-panel .font-family-setting{
				flex: 1;
			}
				.setting-panel .font-family-setting button{
					height: 100%;
					font-size: .16rem;
					background: #5abebc10;
					color: #2e2e2e;
					margin: 0 .05rem;
					border-radius: .04rem;
					width: calc(50% - .1rem);
					transition: .3s ease;
				}
				.setting-panel .font-family-setting button.selected{
					background: #5abebc;
					color: white;
				}
		.setting-panel section.links{
			border-top: .01rem solid #eaeaea;
			justify-content: space-between;
			flex-flow: row wrap;
			font-size: .2rem;
			line-height: .2rem;
			padding: .1rem;
		}
		.setting-panel section.links i{
			margin: 0;
		}
		.setting-panel section.links a[title^=Sign]{
			font-weight: bold;
		}


	.ctrl-panel{
		position: fixed;
		display: none;
		bottom: 0;
		right: 0;
		color: #8b8e99;
		margin-right: .1rem;
		line-height: .3rem;
		user-select: none;
		animation: frontFlip .6s ease-in-out both;
		cursor: pointer;
	}
	.ctrl-panel.visible{
		display: block;

	}
		.ctrl-panel i{
			font-size: .2rem;
			animation: spin 3s linear infinite;
		}
	.back2top{
		position: fixed;
		transform: translate(1.1rem,0);
		font-size: 0;
		bottom: .4rem;
		right: .05rem;
		z-index: 1900;
		cursor: pointer;
		user-select: none;
		transition: .3s ease-in-out;
	}
	.back2top.visible{
		transform: translate(0,0);
	}
	@media screen and (max-width: 900px){
		.back2top{
			display: none;
		}
	}
	#aplayer{
		z-index: 1900;
		box-shadow: 0 0 0.1rem #1e1e1e80;
	}
	#aplayer.aplayer .aplayer-body{
		border-radius: 0 .05rem .05rem 0;
		box-shadow: 0 .1rem .1rem #1e1e1e80;
		overflow: hidden;
	}
	#aplayer.aplayer .aplayer-lrc p.aplayer-lrc-current {
		text-shadow: none;
		color: #00a1d6;
		font-size: .16rem;
		font-weight: bold;
	}
	#aplayer.aplayer .aplayer-lrc p{
		font-size: .14rem;
		opacity: .8;
		font-weight: bold;
	}
	#aplayer.aplayer-narrow .aplayer-body{
		left: -66px;
	}
	#aplayer:not(.aplayer-narrow) .aplayer-body,#aplayer.aplayer-narrow:hover .aplayer-body{
		left: 0;
	}
	/*commentModule marked 渲染使用----------------------------------*/
	.comment-content ul{
		padding-left: 1.5em;
	}
	.comment-content>ul{
		margin-bottom: .1rem;
	}
	.comment-content pre{
		font-family: "Fira Code VF",monospace,sans-serif;
		position: relative;
		overflow: auto;
		padding: 1em 0 0 3em;
		background: #fafafa;
		margin: .05rem 0;
		border-radius: .03rem;
		line-height: 1.2;
		font-size: 85%;
		max-width: 100%;
	}
	#mobile-app pre .copy-btn{
		opacity: 1;
		bottom: 0;
		top: unset;
		right: unset;
		left: 0;
		font-size: .12rem;
	}
	pre .copy-btn{
		position: absolute;
		top: .1rem;
		right: .1rem;
		opacity: 0;
		color: #b8c0cc;
		background: #f8f8f8f0;
		line-height: 1.4;
		padding: 0 .03rem;
		border-radius: .03rem;
		transition: .3s ease;
	}
	pre:hover .copy-btn{
		opacity: 1;
	}
	pre .copy-btn:hover{
		background: #f0f0f0;

	}
	.comment-content pre .line-numbers-rows{
		position: absolute;
		top: 1em;
		padding: 0;
		margin: 0;
		left: 0;
		width: 2.5em;
		text-align: center;
		border-right: .01rem solid #b8c0cc;
		list-style-type: none;
		color: #b8c0cc;
	}
	.comment-content pre>code{
		font-family: inherit;
		line-height: inherit;
		word-spacing: normal;
		word-wrap: normal;
		word-break: normal;
		white-space: pre;
		background: transparent;
	}
	.hljs{
		background: #fafafa !important;
		padding: 0 1em 1em 0 !important;
	}
	.comment-content blockquote,.link-description blockquote{
		margin: .1rem .05rem;
		padding: .05rem .2rem;
		background: #fafafa;
		position: relative;
		border-radius: .05rem;
		text-align: left;
		border-left: .04rem solid #ddd;
		color: rgba(121, 121, 121, .8);
		font-style: italic;
		line-height: 1.8;
	}



	.comment-content a,.about-post a,.link-description a{
		color: #5abebc;
		position: relative;
	}
	.comment-content a:hover,.about-post a:hover,.link-description a:hover{
		color: #00a1d6;
	}
	.comment-content a:after,.about-post a:after,.link-description a:after{
		content: '';
		position: absolute;
		width: 100%;
		transform: scaleX(0);
		height: .02rem;
		bottom: -.01rem;
		left: 0;
		background-color: #00a1d6;
		transform-origin: bottom right;
		transition: transform .3s ease-in-out;
	}
	.comment-content a:hover:after,.about-post a:hover:after,.link-description a:hover:after{
		transform: scaleX(1);
		transform-origin: bottom left;
	}
	.comment-content del,.about-post del{
		background: #1e1e1e;
		color: #1e1e1e;
		transition: .3s ease;
		text-decoration: none;
	}
	.comment-content del:hover,.about-post del:hover{
		color: white;
	}
	.comment-content p code{
		font-family: "Fira Code VF",monospace,sans-serif;
		padding: .03rem;
		font-size: 80%;
		background: #1b1f230d;
		border-radius: .03rem;
		color: #ff7d7d;
	}
	.comment-content strong{
		font-weight: bold;
	}
	/* -------------------------------------------------------------*/
	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	html{
		overflow-x: hidden;
		font-size: 625%;
		scroll-behavior: smooth
	}

	a{text-decoration: none;transition: .5s ease;color: inherit;outline: none}
	a:focus{outline:none}
	button::-moz-focus-inner, input[type="reset"]::-moz-focus-inner, input[type="button"]::-moz-focus-inner, input[type="submit"]::-moz-focus-inner, input[type="file"] > input[type="button"]::-moz-focus-inner {
		border:none
	}
	p,ul,ol{display: block;}
	h1{letter-spacing: 2px}
	button{
		cursor: pointer;
		border: none;
		background: transparent;
		outline: none;
	}
	textarea{
		background: transparent;
	}
	input::-webkit-search-cancel-button{
		display: none;
	}
	::-webkit-scrollbar{
		width: .06rem;
		height: .06rem;
	}
	::-webkit-scrollbar-track{
		-webkit-box-shadow: inset 0 0 .01rem #b8c0cc;
		background: #eee;
	}
	::-webkit-scrollbar-thumb{
		background-color: #5abebc;
	}
	.fadedown-enter-active{
		animation: infobox-fadeDown .5s cubic-bezier(.25,.46,.45,.94);
	}
	.fadedown-leave-active{
		animation: infobox-fadeDown .5s cubic-bezier(.25,.46,.45,.94) reverse;
	}
	@keyframes infobox-fadeDown {
		0%{
			opacity: 0;
			transform: translate(-50%,-.7rem);
		}
		100%{
			opacity: 1;
			transform: translate(-50%,0);
		}
	}
	.info-box{
		position: fixed;
		top: 0;
		left: 50%;
		height: .7rem;
		min-width: 1.5rem;
		color: white;
		padding: 0 .25rem;
		line-height: .7rem;
		border-bottom-right-radius: .05rem;
		border-bottom-left-radius: .05rem;
		transform: translateX(-50%);
		z-index: 2000;
	}

	/*测试*/
	.site-wrapper{
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-position: center center;
		background-size: cover;
	}
	.blank{
		padding-top: .7rem;
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
	::selection {
		background:rgba(33, 33, 37, 0.6);
		color:white;
	}
	.masked{
		-webkit-overflow-scrolling:touch;
		position: fixed;
		width: 100%;
	}
	#app,#mobile-app {
	    font-family: "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","WenQuanYi Micro Hei",sans-serif;
	    -webkit-font-smoothing: antialiased;
	    -moz-osx-font-smoothing: grayscale;
	    text-align: center;
	    color: #1e1e1e;
	    /*color: #2c3e50;*/
		font-size: .16rem;
		background: #f1f4f7;/*测试*/
	}
	.pr{float: right}.pl{float: left}.tc{text-align: center}
	.tr{text-align: right}.tl{text-align: left}
	.no-select{user-select: none;}
	.fa,.fas,.far,.fab{
		margin-right: .03rem;
	}
	.iconfont{margin-right: .03rem;display: inline-block}
	.clearm{margin:0}
	.ibold{font-weight: 600}
	.center{
		text-align: center;
	}
	.cut-line{
		border-bottom: 1px solid darkgray;
		margin: 10px ;
	}
	.cut-line-d{
		border: .01rem dashed #dadada;
		margin: .1rem;
	}
	.isolate{
		margin: 0 .05rem;
	}
	.is-collapsible{
		max-height: 10rem; /*折叠的关键*/
		overflow: hidden;
		transition:1s;
	}
	.is-collapsed{
		max-height: 0;
	}
	.page-content-wrap,.page-header-wrap{
		background: rgba(255,255,255,.66);
	}
	#mobile-app .publish-area .v-note-wrapper{
		height: 5.5rem;
	}
	.publish-area .v-note-wrapper{
		height: 8rem;
		clear: both;
	}
	.content-area .v-note-wrapper{
		z-index: 999;
	}
	.content-area .v-note-edit.divarea-wrapper,.content-area .v-note-show{
		min-height: 7rem;
	}
	.content-area .v-note-wrapper, .content-area .v-show-content,.content-area textarea:disabled{
		background: transparent !important;
		padding: 0 !important;
	}
	.content-area .v-note-panel.shadow{
		box-shadow: none !important;
	}
	.publish-area .v-note-wrapper,.publish-area .v-note-op{
		background: rgba(255,255,255,.8) !important;
	}
	.publish-area .v-show-content{
		background: rgba(251,251,251,.8) !important;
	}
	.header-top{
		position: relative;
		overflow: hidden;
		box-shadow: 0 0 .2rem .1rem rgba(0,0,0,0.5);
	}
	.header-top:before{
		content: '';
		background: url("https://phower.me/wp-content/uploads/2018/04/dot.png") fixed ;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9;
	}
	.notice{
		margin: .2rem  0;
		padding: .1rem .2rem;
		border: .01rem dashed #e2e2e2;
		color: #939393;
	}
	.article-list.empty:before{ /*用于acgt空页面*/
		background-image: url(/root/site/static/noart.png);
		content:attr(etext);
		display: block;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: auto 80%;
		color: #1e1e1e;
		opacity: .6;
		font-size: .2rem;
		font-weight: 600;
		height: 4rem;
		line-height: 7.2rem;
		width: 100%;
		overflow: hidden;
	}

/*-----------------------------------------供spaceAlbumAlbumU和spaceDynamic、space使用*/
	.section{
		margin-bottom: .15rem;
		border-bottom: .01rem solid #eaeaea;
	}
	.section:last-child{
		border-bottom: none;
	}
	.section .section-title{
		font-size: .2rem;
		text-align: left;
		padding-bottom: .1rem;
	}
	.section-content.empty:before{
		background-image: url(/root/site/static/nodata.png);
		content:attr(etext);
		display: block;
		background-position: center center;
		background-repeat: no-repeat;
		color: #6d757a;
		font-size: .14rem;
		height: 2.1rem;
		overflow: hidden;
		line-height: 3.9rem;
		text-align: center;
	}
	.col-2 .section{ /*多模块使用，可能与space共用*/
		margin-bottom: .1rem;
		padding: .15rem .2rem;
		background: white;
		border-radius: .05rem;
		box-shadow: 0 0 0 .01rem #eee;
		text-align: left;
	}
	.col-2 .section .section-title{
		font-size: .15rem;
		font-weight: 600;
		border-bottom: .01rem solid #eaeaea;
	}
/*---------------------------------------------------------------------------*/
</style>
