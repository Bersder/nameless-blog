<template>
	<div>
		<div class="page-content-wrap">
			<div class="page-content homepage" :class="{hidden:scrollTop<screenHeight/3&&screenWidth>800}">
				<div class="notice tl" v-if="notice"><i class="fas fa-volume-up"></i> {{notice}}</div>
				<div class="content-primary-h">
					<div class="topped-area" v-if="!isMobile">
						<p class="description tl"><i class="fas fa-anchor"></i> 置顶区</p>
						<div class="topped-list tl">
							<div class="panel-topped" v-for="item in topped" :key="item.aid" :class="{odd:topped.length%2}">
								<router-link :to="item|artUrl">
									<img :src="'http://localhost:80'+item.imgSrc">
									<div class="float-preview tl">
										<h3 :title="item.title">{{item.title}}</h3>
										{{item.preview}}
									</div>
								</router-link>
							</div>
						</div>
					</div>
					<div class="panel-h-list">
						<p class="description tl"><i class="fas fa-torii-gate"></i> 入る</p>
						<div class="panel-h" v-for="each in curArts" :key="each.aid">
							<div class="panel-h-img">
								<router-link :to="each|artUrl">
									<img :src="'http://localhost:80'+each.imgSrc">
									<div class="float-preview tl">
										{{each.preview}}
									</div>
								</router-link>
							</div>
							<div class="panel-h-info">
								<div class="post-time">
									<p class="pt-ym">{{each.time|ym}}</p>
									<p class="pt-d">{{each.time.substr(8,2)}}</p>
								</div>
								<div class="post-meta">
									<span><i class="fas fa-hashtag"></i><router-link :to="'/archive/'+each.type"> {{each.type|typeEN2CN}}</router-link></span>
									<span><i class="far fa-comments"></i><router-link :to="'/archive/'+each.type+'/'+each.aid+'#comments'"> {{each.commentCount|commentNum}}</router-link></span>
								</div>
								<div class="post-title">
									<p><router-link :to="each|artUrl">{{each.title}}</router-link></p>
								</div>
								<div class="post-read">
									<i class="fas fa-fire"></i> {{each.readCount|readNum}}
								</div>
							</div>
						</div>
					</div>
					<div class="pager" @click="loadMore" v-if="curArts.length<artNum">
						<div class="dec"></div>
						<div class="previous-more">
							<span>Previous</span>
						</div>
					</div>
					<div class="pager-no-more" v-if="curArts.length>=artNum">没有更多啦( *・ω・)✄╰ひ╯</div>

				</div>
				<div class="content-aside-h">
					<div class="cah hit tl">
						<div class="hit-head">
							<span><i class="fas fa-fire"></i> 最热</span>
						</div>
						<ul class="hit-content">
							<li :data-text="item.type[0].toUpperCase()" v-for="item in hits" :key="item.aid">
								<div class="rc-item pl">
									<p><router-link :to="item|artUrl">{{item.title}}</router-link></p>
									<span>{{item.type|typeEN2CN}} | {{item.readCount|readNum}} 阅读</span>
								</div>
							</li>
						</ul>
					</div>
					<div class="cah update tl">
						<div class="update-head">
							<i class="far fa-file-alt"> 最近更新</i>
						</div>
						<ul class="update-content">
							<li v-for="item in latestUpdate" :key="item.aid"><router-link :to="item|artUrl">{{item.title}}</router-link><span> ({{item.lut|updateTime}})</span></li>
						</ul>
					</div>
					<div class="cah board">
						<div class="board-head">
							<span>雑談　</span>
							<i class="fab fa-first-order-alt"></i>
						</div>
						<div class="board-content">
							{{gossip.content}}
						</div>
						<div class="board-post-time">
							-- {{gossip.time|gossipTime}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
	import {mapGetters} from 'vuex'
	import {mapState} from 'vuex'
	import {contentAsideMixin,panelhMixin} from "../util/global";

	export default {
        name: "Homepage",
		created(){
        	fetch('/apis/apiv9.php').then(response=>{
        		let data = response.data.data;
        		this.artNum = parseInt(data.artNum);
				data.arts.forEach(e=>this.curArts.push(e));
				data.latestUpdate.forEach(e=>this.latestUpdate.push(e));
				data.hits.forEach(e=>this.hits.push(e));
				data.topped.forEach(e=>this.topped.push(e));
				if (data.gossip)
					this.gossip = data.gossip;
				this.notice = data.notice;
			})
		},
        data() {
            return {
            	artNum:0,
            	curArts:[],
				latestUpdate:[],
				hits:[],
				topped:[],
				notice:null

			}
        },
        mounted() {

        },
		computed:{
        	...mapGetters(['reachBottom']),
			...mapState(['scrollTop','screenHeight','screenWidth','isMobile'])
		},
		watch:{
        	reachBottom(cur,pre){
        		if (cur)this.loadMore();
			}
		},
        methods:{
        	loadMore(){
				if (this.curArts.length<this.artNum)
					fetch('/apis/apiv9.php',{more:Math.floor(this.curArts.length/8)}).then(response=>{
						response.data.data.arts.forEach(e=>this.curArts.push(e))
					});
			}
		},
		filters:{
			artUrl(art){
        		return '/archive/'+art.type+'/'+art.aid
			},
			updateTime(datetime){
				let gap = new Date().getTime() -  new Date(datetime).getTime();
				if (gap<60000)return '刚刚';
				else{
					let gap_m = Math.floor(gap/60000);
					if (gap_m<60)return gap_m + '分钟前';
					else{
						let gap_h = Math.floor(gap_m/60);
						if (gap_h<24)return gap_h + '小时前';
						else{
							let gap_d = Math.floor(gap_h/24);
							if (gap_d<30)return gap_d + '日前';
							else return '数月前'
						}
					}
				}
			}
		},
		mixins:[contentAsideMixin,panelhMixin]
    }
</script>

<style scoped>
	.description{
		margin: .2rem 0;
		padding-bottom: .1rem;
		border-bottom: .01rem dashed #eaeaea;
	}
	.topped-list{
		overflow: hidden;
	}
		.panel-topped.odd:last-child{
			width: 100%;
		}
		.panel-topped{
/*			display: inline-block;*/
			margin: 0 .05rem .1rem .05rem;
			height: 1.5rem;
			width: calc(50% - .1rem);
			position: relative;
			overflow: hidden;
			float: left;
		}
		.panel-topped:before{
			content: 'Top';
			position: absolute;
			right: .1rem;
			top: .1rem;
			text-align: center;
			width: 1rem;
			transform-origin: top;
			background: #00a1d699;
			font-size: .16rem;
			line-height: .2rem;
			font-weight: bold;
			color: white;
			z-index: 10;
			transform: translateX(50%) rotate(45deg);
		}
			.panel-topped a{
				border-radius: .05rem;
				overflow: hidden;
			}
				.panel-topped a:hover .float-preview{
					transform: translateY(-100%);
				}
				.panel-topped a:hover img{
					transform: scale(1.1);
				}

				.panel-topped .float-preview{
					position: relative;
					height: 100%;
					font-size: .14rem;
					overflow: hidden;
					padding: .2rem .15rem 0;
					color: #f5f5f0;
					background: rgba(30,30,30,.6);
					transition: .5s ease;
					text-align: center;
				}
					.panel-topped .float-preview h3{
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: .2rem;
						line-height: .4rem;
					}


	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: snow;
	}
	/*-----------------------------------------------*/


	.page-content.homepage{
		max-width: 9.3rem;
		overflow: hidden;/*解决子元素浮动撑不开父元素*/
		height: 100%;
		transition: 1s cubic-bezier(.25,.46,.45,.94);
		background: transparent;
	}
	#app .page-content.homepage.hidden{
		opacity: 0;
	}
	.content-primary-h{
		max-width: 6rem;
		margin: 0 auto;
		float: left;
		transition: .1s;
	}
	.panel-h{
		width: 100%;
		height: 2rem;
		margin-bottom: .3rem;
		border-radius: .03rem;
		background: rgba(252,250,242,.7);
		box-shadow: 0 .02rem .05rem rgba(0,0,0,.3);
		transition: all .5s ease-in-out;
		animation: fadeInDown .6s cubic-bezier(.25,.46,.45,.94);
	}
	.panel-h-img{
		width: 50%;
		height: 100%;
		overflow: hidden;
	}
	.panel-h:nth-child(odd) .panel-h-img{
		float: right;
		border-top-right-radius: .03rem;
		border-bottom-right-radius: .03rem;
	}
	.panel-h:nth-child(even) .panel-h-img{
		float: left;
		border-top-left-radius: .03rem;
		border-bottom-left-radius: .03rem;
	}
	.panel-h-img a,.panel-topped a{
		position: relative;
		display: block;
		height: 100%;
		font-size: 0;
	}
	.panel-h-img img,.panel-topped img{
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;
		transition: .5s;
	}
	.panel-h:hover img{
		opacity: .9;
	}
	.panel-h-img .float-preview{
		position: relative;
		height: .9rem;
		font-size: .14rem;
		text-indent: .2rem;
		overflow: hidden;
		padding: .1rem .15rem;
		color: #f5f5f0;
		background: rgba(0,0,0,.5);
		transition: .5s ease;
	}
	.panel-h:hover .float-preview{
		transform: translateY(-.9rem) ;
	}
	.panel-h-info{
		position: relative;
		display: inline-block;
		width: 50%;
		float: right;/*??*/
	}
	.panel-h:nth-child(odd) .post-time{
		float: left;
		margin-top: .15rem;
		margin-left: .2rem;
	}
	.panel-h:nth-child(even) .post-time{
		float: right;
		margin-top: .15rem;
		margin-right: .2rem;
	}
	.panel-h .post-read{
		position: absolute;
		bottom: 0;
		font-size: .16rem;
		line-height: .2rem;
		user-select: none;
		color: #FF7D7D;
		padding: 0 .1rem;
		border: .02rem solid #FF7D7D;
		border-radius: .03rem;
	}
	.panel-h:nth-child(odd) .post-read{
		left: .15rem;
	}
	.panel-h:nth-child(even) .post-read{
		right: .15rem;
	}
	.pt-ym{
		padding-bottom: .1rem;
	}
	.pt-d{
		font-family: "Comic Sans MS",sans-serif;
		font-size: .55rem;
		font-style: italic;
		line-height: .3rem;
	}
	.post-meta{
		transform: rotate(90deg);
		transform-origin: left top;
		display: inline-block;
		position: absolute;
		top: .15rem;
		right: -1.75rem;
		font-size: .13rem;
		font-weight: 300;
		width: 1.8rem;
		color: #c5ccd3;
	}
	.panel-h:nth-child(even) .post-meta{
		left: .22rem;
	}
	.post-meta span{
		margin-right: .1rem;
	}
	.post-meta a:hover{
		color: #FF7D7D;
	}
	.post-title{
		writing-mode: vertical-rl;
		float: right;
		margin: .15rem .4rem 0 0;
		height: 1.7rem;
		font-size: .17rem;
		text-align: left;
	}
	.panel-h:nth-child(even) .post-title{
		float: left;
		margin: .15rem 0 0 .4rem;
	}
	.post-title p{
		letter-spacing: .005rem;
		text-transform: uppercase;
		text-shadow: 0 0 .02rem rgba(0,0,0,.4);
	}
	.post-title p:first-letter{
		font-size: .25rem;
		padding-bottom: .03rem;
		margin-top: -.04rem;
	}
	.post-title a{
		color: #425066;
	}


	.pager{
		position: relative;
		height: .4rem;
		width: 1.2rem;
		margin: .2rem auto 0;
		cursor: pointer;
	}
		.previous-more{
			position: relative;
			color: #00a1d6;
			text-shadow: 0 .01rem .01rem #00a1d6;
			line-height: .4rem;
			background: rgba(255,255,255,.8);
			transition: all	.25s ease;
		}
		.pager:hover .previous-more{
			color: snow;
			text-shadow: 0 .01rem .01rem snow;
			transform: translate(.02rem,.02rem);
		}
			.previous-more span{
				position: relative;
				z-index: 2;
			}

			.previous-more:before{
				content: '';
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				background: rgba(135, 186, 237, 0.8);
				height: 100%;
				width: 0;
				transition: .25s ease-out;
			}
			.pager:hover .previous-more:before{
				width: 100%;
			}
		.pager .dec{
			position: absolute;
			height: .4rem;
			width: 1.2rem;
			top: .05rem;
			left: .05rem;
			border: .02rem solid pink;
			transition: .25s ease-out;
		}
		.pager:hover .dec{
			border-color: #00a1d6;
			transform: translate(.02rem,.02rem);
		}
	.pager-no-more{
		color: grey;
		margin: .2rem 0;
		text-align: center;
		padding: .1rem;
		clear: both;
	}






	.content-aside-h{
		margin-top: .5rem;
		width: 2.8rem;
		float: right;
	}
	.cah{
		width: 100%;
		border-radius: .05rem;
		background: rgba(252,250,242,.7);
		box-shadow: 0 .01rem .03rem rgba(26,26,26,.5);
		margin-bottom: .2rem;
	}
	.cah.hit{
		height: 100%;
		overflow: hidden;
		position: relative;
	}
	.cah.board,.ca.board {
		min-height: 1.1rem;
		position: relative;
	}
	.board-head{
		position: absolute;
		top: .2rem;
		left: 0;
		bottom: .2rem;
		writing-mode: vertical-rl;
		padding-right: .1rem;
		border-right: .01rem dashed #c5ccd3;
	}
	.board-content{
		width: 100%;
		font-size: .14rem;
		letter-spacing: .003rem;
		line-height: .18rem;
		text-align: left;
		text-indent: .2rem;
		padding: .22rem .1rem .4rem .55rem;
		color: #425066;
	}
	.board-post-time{
		position: absolute;
		right: .15rem;
		bottom: .15rem;
		color: #c5ccd3;
		font-size: .12rem;
	}
	.update-head,.hit-head{
		padding: .1rem .1rem 0;
	}
	.update-content,.hit-content{
		padding: .1rem .1rem .1rem .3rem;
		font-size: .14rem;
		list-style-type: none;
	}
		.update-content li:before{
			content: '❁';
			color: #ff6052;
			margin-right: .05rem;
		}


		.hit-content li:before{
			content: attr(data-text);
			font-size: .3rem;
			line-height: .38rem;
			width: .38rem;
			height: .38rem;
			font-family: "Comic Sans MS",sans-serif;
			border-radius: 100%;
			text-align: center;
			margin-right: .1rem;
			border: .01rem dashed #d5d5d5;
			float: left;
		}
		.hit-content span,.update-content span{
			font-size: .12rem;
			user-select: none;
			color: #bac1c8;
		}
		.hit-content li{
			height: 100%;
			overflow: hidden;
			position: relative;
			padding-bottom: .1rem;
		}
		.rc-item{
			width: 1.9rem;
		}
	@media screen and (max-width: 920px){
		.content-primary-h{
			float: none;
		}
		.content-aside-h{
			display: none;
		}
	}
	@media screen and (max-width: 500px) {
		.panel-h{ /*如果不行加important*/
			height: 3.5rem;
			padding: .05rem;
			margin-bottom: .1rem;
		}
		.panel-h-img{
			height: 1.5rem;
			width: 100% ;
			border-radius: .03rem;
			box-shadow: 0 0 .05rem rgba(0,0,0,.8);
		}
		.panel-h .float-preview{
			height: 100%;
		}
		.panel-h:hover .float-preview{
			transform: translateY(-100%) ;
		}
		.panel-h-info{
			float: none ;
			width: 100% ;
		}
	}
</style>
