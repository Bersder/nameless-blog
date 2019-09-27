<template>
	<div class="site-header" :class="{home:$route.name==='homepage'&&scrollTop<200&&!isOpened&&screenWidth>=1000,reachTop:scrollTop<200&&!/article.*|search|space.*|about/.test($route.name)&&!isMasked,pinned:upping||scrollTop<200}">
		<div class="header-scrollbar" :style="{width:processed}"></div>

		<div class="header-nav-m" v-show="screenWidth<1000">
			<div class="nav-content">
				<div class="nav-icon" :class="{open:isOpened}" @click="isOpened=!isOpened">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<router-link class="nav-title" to="/">Oshino·Nya</router-link>
<!--				<div class="nav-login pr"><router-link to="/"><i class="far fa-user-circle"></i></router-link></div>-->
			</div>
			<div class="nav-m-mask" @click="isOpened=!isOpened" v-show="isOpened" :style="{height:screenHeight-50+'px'}"></div>
			<div class="nav-aside" :class="{open:isOpened}" :style="{height:screenHeight-50+'px'}">
				<div class="nav-avatar">
					<router-link :to="loginStatus?'/space':'/about'"><img src="/root/uploads/avatar/me.png"></router-link>
					<span class="me-status" :title="'STATUS:'+statusMap[meStatus].des" :style="{background:statusMap[meStatus].color}"><i class="iconfont" :class="statusMap[meStatus].icon"></i></span>
				</div>
				<p style="color: #333;font-weight: 700;">忍野喵</p>
				<p class="me-sign">{{meSign}}</p>
				<p class="cut-line"></p>


				<div class="search-box-m"> <!--暂时未实现自定义弹框-->
					<input v-model.trim="searchKey" type="search" class="text-input pl" @keyup.enter="post_Search" required placeholder="なにをさがしますか">
					<button @click="post_Search"><i class="iconfont icon-search clearm"></i></button>
				</div>
				<div class="nav-menu">
					<p >站内导航</p>
					<ul>
						<li><router-link to="/" class="animated"><i class="iconfont icon-home fade-bf"></i> 首页</router-link></li>
						<li v-for="each in navData">
							<router-link :to="each.href" class="animated"><i :class="[each.icon,each.animate]"></i> {{each.des}}</router-link>
							<span  @click="each.isUnfolded=each.subs?!each.isUnfolded:each.isUnfolded"><i v-if="each.subs" class="iconfont icon-chevronright clearm" :class="{unfold:each.isUnfolded}" style="color: grey"></i> </span>
							<ul v-if="each.subs" :class="{'is-collapsible':each.subs,'is-collapsed':!each.isUnfolded}">
								<li v-for="sub in each.subs">
									<router-link :to="sub.href"><i :class="sub.icon"></i> {{sub.des}}</router-link>
								</li>
							</ul>
						</li>
					</ul>
				</div>
				<p class="nav-footer">© 2019 忍野ニャニャ</p>
			</div>
		</div>

		<div class="header-nav no-select" v-show="screenWidth>=1000">
			<div class="site-brand pl">
				<router-link :to="loginStatus?'/space':'/'">
					<span class="oshino"><ruby>忍野<rp>(</rp><rt>おしの</rt><rp>)</rp></ruby></span>
					<span class="nyanya">ニャ</span>
				</router-link>
			</div>
			<div class="snh">
				<div class="site-nav">
					<ul class="menu" id="">
						<li v-for="each in navData">
							<router-link :to="each.href" class="animated"><i :class="[each.icon,each.animate]"></i> {{each.des}}</router-link>
							<ul v-show="each.subs" class="sub-menu">
								<li v-for="sub in each.subs"><router-link :to="sub.href"><i :class="sub.icon"></i> {{sub.des}}</router-link></li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
			<div class="search-box-t pr">
				<input type="search" v-model.trim="searchKey" @keyup.enter="post_Search" required>
			</div>

		</div>
	</div>

</template>

<script>
	import {mapState} from 'vuex'
	import UCONF from "../config/user.conf";
	import PCONF from "../config/project.conf"
    export default {
        name: "TheTopNav",
		created(){
        	this.$fetch('/apis/apiv0.php').then(response=>{
        		let data = response.data.data;
				this.meSign = data.info.sign;
        		this.meStatus = data.info.status
			})
		},
        data() {
            return {
            	navData:PCONF.navList,
				// scrollTop:window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
				// screenWidth:window.innerWidth || document.body.clientWidth,
				// screenHeight:window.innerHeight || document.documentElement.clientHeight,
				isOpened:false,
				searchKey:null,
				meSign:'如果你看到了这个，提醒我今晚吃烤鸽子',
				meStatus:0,
				statusMap:UCONF.statusMap
			}
        },
		watch:{
        	isOpened(cur,pre){
        		this.$store.commit('isMaskedC',cur)
			},
			screenWidth(cur,pre){
        		if (cur > 1000 && this.isOpened) this.isOpened = false;
			},
			$route(cur,pre){
        		if (this.isOpened)
					this.isOpened = false;
			}
		},
        // mounted() {
        // 	let me = this;
        // 	window.onscroll = debounce(function () {
		// 		me.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		// 		media.$emit('scrollTopC',me.scrollTop)
		// 	},50);
        // 	window.onresize = debounce(function () {
		// 		me.screenWidth = window.innerWidth || document.body.clientWidth;
		// 		media.$emit('screenWidthC',me.screenWidth);
		// 		me.screenHeight = window.innerHeight || document.documentElement.clientHeight;
		// 		media.$emit('screenHeightC',me.screenHeight);
		// 	},50)
        // },
        computed:{
        	processed:function () {
				return this.scrollTop/(document.body.offsetHeight-document.documentElement.clientHeight)*100 + '%';
			},
			...mapState(['scrollTop','screenWidth','screenHeight','upping','isMasked']),
			...mapState({
				loginStatus:state=>state.account.loginStatus,
			})

		},
		methods:{
        	post_Search(){
        		if (this.searchKey){
					this.$router.push({name:'search',params:{key:this.searchKey}});
					this.searchKey = '';
					this.isOpened = false;
				}
			}
		}
    }
</script>

<style>
</style>
