<template>
  <div :id="isMobile?'mobile-app':'app'" >
	  <top-nav></top-nav>
	  <header-top class="header-top filter-grid" v-if="this.$route.name==='homepage'"></header-top>
	  <keep-alive include="Article">
		  <router-view class="site-wrapper"></router-view>
	  </keep-alive>
	  <luminous-box></luminous-box>
  </div>
</template>

<script>
import TheSiteFooter from './components/TheSiteFooter'
import TheTopNav from './components/TheTopNav'
import HeaderTop from './components/HeaderTop'
import LuminousBox from '@/components/LuminousBox'
import {mapState} from 'vuex'
import {debounce} from "./util/util";
export default {
    name: 'App',
	data(){
    	return {
    		st:0
		}
	},
	created(){
		let agents = ["Android", "SymbianOS", "BlackBerry","Windows Phone", "iPad", "iPod", "iPhone"];
		for(let i=0;i<agents.length;i++)
			if (navigator.userAgent.indexOf(agents[i])>0){
				this.$store.commit('platformInit',{platform:agents[i],isMobile:true});
				break;
			}
	},
	watch:{
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
		}
	},
	mounted(){
		window.onscroll = debounce(()=>this.$store.commit('scrollTopC',window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop),50);
		window.onresize = debounce(()=>this.$store.commit('screenSizeC',{
			screenHeight:window.innerHeight || document.documentElement.clientHeight,
			screenWidth:window.innerWidth || document.body.clientWidth
		}),50)
	},
	components:{
    	'site-footer':TheSiteFooter,
		'header-top':HeaderTop,
		'top-nav':TheTopNav,
		'luminous-box':LuminousBox
	},
	computed:{
    	...mapState(['isMobile','isMasked','screenWidth'])
	}

}
</script>

<style>
	@import "assets/animation.css";
	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	html{
		overflow-x: hidden;
		font-size: 625%;
	}

	a{text-decoration: none;transition: .5s}
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
		height: .07rem;
	}
	::-webkit-scrollbar-track{
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
		border-radius: .05rem;
	}
	::-webkit-scrollbar-thumb{

		border-radius: .05rem;
		background-color: #ffa7a5;
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
	    font-family: 'Avenir', Helvetica, Arial, sans-serif;
	    -webkit-font-smoothing: antialiased;
	    -moz-osx-font-smoothing: grayscale;
	    text-align: center;
	    color: #2c3e50;
		font-size: .16rem;
		/*height: 10000px;*/
		background: #f1f4f7;/*测试*/
	}
	.pr{float: right}.pl{float: left}.tc{text-align: center}
	.tr{text-align: right}.tl{text-align: left}
	.no-select{user-select: none;}
	.fa,.fas,.far,.fab{
		margin-right: .03rem;
	}
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
	.page-content-wrap{
		background: rgba(255,255,255,.5);
	}
	#mobile-app .publish-area .v-note-wrapper{
		height: 5.5rem;
	}
	.publish-area .v-note-wrapper{
		height: 6.9rem;
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
		padding: .2rem;
		border: .01rem dashed #e2e2e2;
		color: #939393;
	}


</style>
