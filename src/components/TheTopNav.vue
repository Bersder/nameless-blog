<template>
	<div class="site-header" v-if="$route.name!=='login'" :class="{home:$route.name==='homepage'&&scrollTop<200&&!isOpened&&screenWidth>=1000,reachTop:scrollTop<200&&!/article.*|search|space.*/.test($route.name)&&!isMasked,pinned:upping||scrollTop<200}">
		<div class="header-scrollbar" :style="{width:processed}"></div>

		<div class="header-nav-m" v-show="screenWidth<1000">
			<div class="nav-content">
				<div class="nav-icon" :class="{open:isOpened}" @click="isOpened=!isOpened">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<p class="nav-title"><router-link to="/">Oshino·Nya</router-link></p>
<!--				<div class="nav-login pr"><router-link to="/"><i class="far fa-user-circle"></i></router-link></div>-->
			</div>
			<div class="nav-m-mask" @click="isOpened=!isOpened" v-show="isOpened" :style="{height:screenHeight-50+'px'}"></div>
			<div class="nav-aside" :class="{open:!isOpened}" :style="{height:screenHeight-50+'px'}">
				<div class="nav-avatar">
					<router-link :to="loginStatus?'/space':'/about'"><img src="http://localhost:80/uploads/avatar/me.png"></router-link>
				</div>
				<p style="color: #333;font-weight: 700;">忍野喵</p>
				<p style="color: #8b8e99;font-size: .12rem;margin-top: .05rem">君若喜坂上なち、友達</p>
				<p class="cut-line"></p>


				<div class="search-box-m"> <!--暂时未实现自定义弹框-->
					<input v-model.trim="searchKey" type="search" class="text-input pl" @keyup.enter="post_Search" required placeholder="なにをさがしますか">
					<button @click="post_Search"><i class="fas fa-search fa-lg"></i></button>
				</div>
				<div class="nav-menu">
					<p >站内导航</p>
					<ul>
						<li>
							<router-link to="/" class="animated"><i class="fab fa-fort-awesome fade-bf"></i> 首页</router-link>
							<span></span>
						</li>
						<li v-for="each in navData">
							<router-link :to="each.href" class="animated"><i :class="[each.icon,each.animate]"></i> {{each.des}}</router-link>
							<span  @click="each.isUnfolded=each.subs?!each.isUnfolded:each.isUnfolded"><i v-if="each.subs" class="fa fa-angle-right fa-lg" :class="{unfold:each.isUnfolded}" style="color: grey"></i> </span>
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
				<router-link to="/">
					<span class="oshino"><ruby>忍野<rp>(</rp><rt>おしの</rt><rp>)</rp></ruby></span>
					<span class="nyanya">ニャニャ</span>
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
	let navData = [
		{icon:'fa fa-archive',des:'归档',animate:'rotate-bf',subs:[
				{icon:'fa fa-film',des:'Anime',href:'/archive/anime'},
				{icon:'fas fa-code',des:'极客',href:'/archive/code'},
				{icon:'fa fa-gamepad',des:'游民',href:'/archive/game'},
				{icon:'fas fa-journal-whills',des:'随写',href:'/archive/trivial'}
			],href:'/archive',isUnfolded:true},
		{icon:'fa fa-pencil-alt',des:'笔记',animate:'writing',subs:false,href:'/note',isUnfolded:true},//笔记的sub待填充
		{icon:'fa fa-tags',des:'标签',animate:'fade-bf',subs:false,href:'/tags',isUnfolded:true},
		{icon:'fa fa-link',des:'友链',animate:'enlarge-abrupt',subs:false,href:'/links',isUnfolded:true},
		{icon:'fa fa-cogs',des:'实验室',animate:'spin',subs:false,href:'/lab',isUnfolded:true},
		{icon:'fa fa-leaf',des:'关于',animate:'axis-rotate',subs:false,href:'/about',isUnfolded:true}
	];
    export default {
        name: "TheTopNav",
        data() {
            return {
            	navData:navData,
				// scrollTop:window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
				// screenWidth:window.innerWidth || document.body.clientWidth,
				// screenHeight:window.innerHeight || document.documentElement.clientHeight,
				isOpened:false,
				searchKey:null
			}
        },
		watch:{
        	isOpened(cur,pre){
        		this.$store.commit('isMaskedC',cur)
			},
			screenWidth(cur,pre){
        		if (cur > 1000 && this.isOpened) this.isOpened = false;
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
				}

			}
		}
    }
</script>

<style scoped>
	.nav-m-mask{
		position: fixed;
		top: .5rem;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,.4);
	}
	.masked .site-header{
		z-index: 2000;
	}
	.site-header{
		position: fixed;
		top: 0;
		width: 100%;
		background: rgba(255,255,255,.9);
		z-index: 1000;
		transition: all .4s;
		box-shadow: 0 .01rem .4rem -.08rem rgba(0,0,0,.5);
		transform: translateY(-.75rem);
	}
	.site-header.pinned{
		transform: translateY(0);
	}
	.site-header.reachTop{
		box-shadow: none;
		background: transparent;
	}
	.header-scrollbar{
		height: .03rem;
		background: orange;
		transition: 1s ease-in-out;
	}
	.header-nav{
		width: 100%;
		padding: 0 .2rem;
	}
		.site-brand{
			position: relative;
			height: .67rem;
			animation: fadeInLeft 1.5s;
		}
			.site-brand a{
				color: #464646;
				font-size: .2rem;
				font-weight: 800;
				line-height: .8rem;
				margin: 0 .3rem;

			}
			.oshino{
				padding-top: .13rem;
				transition: .5s;
			}
			.nyanya{
				transition: .5s;
				border-radius: .05rem;
			}
			.site-brand a:hover .oshino{
				color: goldenrod;
			}
			.site-brand a:hover .nyanya{
				color: white;
				background: goldenrod;
			}
		.snh{
			position: absolute;
			height: .67rem;
			left: 50%;
			min-width: 7.6rem;
			pointer-events: none;
		}
		.site-nav{
			display: inline-block;
			position: relative;
			left: -50%;
			margin-top: .16rem;
			pointer-events: auto !important;
			animation: enlarge 1.5s;
		}
			.site-nav .menu{
				display: inline-block;
				list-style-type: none;
				width: auto;
			}
				.site-nav .menu>li{
					float: left;
					margin: 0 .13rem;
					position: relative;
				}
					.menu>li>a:after{
						content: '';
						position: absolute;
						display: block;
						bottom: -.14rem;
						height: .05rem;
						width: 0;
						background: goldenrod;
						transition: width .5s ease-in-out;
					}
					.menu>li>a:hover:after{
						width: 100%;
					}
					.reachTop .menu>li>a{
						color: white;
					}
				.menu li a{
					color: #666;
					padding: .05rem 0;
					font-size: .18rem;
					display: inline-block;
				}
				.menu li a:hover{
					color: goldenrod;
				}
				.sub-menu{
					display: none;
					position: absolute;
					list-style-type: none;
					top: .42rem;
					right: -.12rem;
					padding: .1rem 0;
					background: white;
					width: .8rem;
					text-align: center;
					border-radius: .06rem;
					box-shadow: 0 .01rem .4rem -.08rem rgba(0,0,0,.7);
					z-index: 999;
					animation: frontFlip .6s .1s ease-in both;
				}
				.sub-menu:before{
					content: '';
					position: absolute;
					top: -.2rem;
					left: 50%;
					border: .1rem solid;
					border-color: transparent transparent white transparent;
				}
				.menu li:hover .sub-menu{
					display: block;
				}
					.sub-menu li a{
						font-size: .16rem;
						margin: .05rem 0;
					}
		.search-box-t{
			position: relative;
			margin: .16rem .1rem;
			animation: fadeInRight 1.5s;
		}
			.home .search-box-t{
				display: none;
			}
			.search-box-t input{
				outline: none;
				border: .02rem solid #eaeaea;
				padding: .07rem;
				width: .33rem;
				transition: .5s;
				border-radius: .5rem;
				color: transparent;
				background: url("http://127.0.0.1:80/static/img/search.png") no-repeat .05rem .05rem;
			}
			.search-box-t input:focus{
				color: #425066;
				width: 2rem;
				padding: .07rem .07rem .07rem .3rem;
				border-color: #00a1d6;
			}
	.animated:hover .spin{
		animation: spin 2s linear infinite forwards;
	}
	.animated:hover .rotate-bf{
		animation: rotateBF 2.5s infinite;
	}
	.animated:hover .fade-bf{
		animation: fadeBF 2s infinite;
	}
	.animated:hover .axis-rotate{
		animation: rotateXY 5s infinite;
	}
	.animated:hover .enlarge-abrupt{
		animation: enlargeA 3s infinite;
	}

	/*小型导航*/
	.nav-content{
		height: .47rem;
		width: 100%;
		padding: 0 .15rem;
		text-align: center;
		animation: fadeInDown .5s ease-out;
	}
		.nav-icon{
			width: .21rem;
			height: .21rem;
			margin-top: .12rem;
			position: absolute;
			transition: .5s ease-in-out;
			cursor: pointer;
		}
			.reachTop .nav-icon span{
				background: #dfdfdf;
			}
			.nav-icon span{
				display: block;
				position: absolute;
				background: #464646;
				width: 100%;
				height: .03rem;
				transform: rotate(0deg);
				border-radius: .2rem;
				transition: .3s ease-in-out;
			}
			.nav-icon span:nth-child(1){top: 0}
			.nav-icon span:nth-child(2){top: .09rem}
			.nav-icon span:nth-child(3){top: .18rem}
			.nav-icon.open span:nth-child(1){top: .09rem;transform: rotate(135deg)}
			.nav-icon.open span:nth-child(2){opacity: 0;transform: translateX(-.6rem);}
			.nav-icon.open span:nth-child(3){top: .09rem;transform: rotate(-135deg)}
		.nav-title{
			height: .47rem;
			display: inline-block;
			line-height: .47rem;
			font-size: .25rem;
			font-weight: 600;
		}
			.nav-title a{
				color: #464646;
			}
		.nav-login{
			position: relative;
			margin-top: .1rem;
			font-size: .25rem;
		}


	.nav-aside{
		display: block;
		position: fixed;
		top: .5rem;
		bottom: 0;
		width: 2.4rem;
		border-right: .01rem solid #ddd;
		border-top: .01rem solid #ddd;
		background: rgba(252,252,252,.9);
		transition: .5s;
		overflow-y: auto;
	}
	.nav-aside::-webkit-scrollbar{
		display: none;
	}
	.nav-aside.open{
		transform: translateX(-2.4rem);
	}
		.nav-avatar{
			padding: .15rem .2rem;
			position: relative;
		}
			.nav-avatar a{
				display: inline-block;
				width: .9rem;
				height: .9rem;
				overflow: hidden;
				font-size: 0;
				border-radius: 50%;
			}
				.nav-avatar a img{
					object-fit: cover;
					object-position: center center;
					height: 100%;
					width: 100%;
				}
		.search-box-m{
			margin: .2rem 0;
			padding: .1rem .15rem;
		}
			.search-box-m input{
				font-size: .16rem;
				width: 80%;
			}
		.nav-menu{
			padding: 0.1rem;
		}
			.nav-menu ul{
				list-style-type: none;
			}

			.nav-menu p{font-size: .15rem;text-align: left;margin-bottom: .1rem}
			.nav-menu span{
				float: right;
				height: .32rem;
				width: 25%;
				padding: .08rem 0;
				text-align: center;
			}
			.nav-menu span i{transition: .3s ease-in-out;}
			.nav-menu span i.unfold{transform: rotate(90deg);}
			.nav-menu a{
				display: inline-block;
				padding: .06rem .35rem;
				font-size: .16rem;
				color: #42b983;
				width: 75%;
				text-align: left;
			}
			.nav-menu li li a{
				width: 100%;
				padding-left: .55rem;
			}
			.nav-menu li{
				transition: all 1s ease;
			}
			.nav-menu li:hover{
				background: rgba(225,225,225,.8);
			}
			.nav-menu li:hover>a{
				color: #35aa7e;
			}
			.nav-menu li li:hover{
				background:rgba(240,243,244,.8);
			}
		.nav-footer{
			font-size: .13rem;
			color: #b9b9b9;
			margin: .15rem 0;
		}





</style>
