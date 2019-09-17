<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
				<div class="page-info">
					<h2 class="intro">{{headerInfo.title}}</h2>
					<p class="tsukkomi">{{headerInfo.description}}</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content acg">
				<div class="content-primary">
					<div class="article-order no-select">
						<span>排序</span>
						<ul class="order-list">
							<li :class="{'o-selected':orderFlag===0}" @click="orderFlag=0">按时间</li>
							<li :class="{'o-selected':orderFlag===1}" @click="orderFlag=1">按热度</li>
						</ul>
					</div><!--文章排序待开发-->
					<div class="article-list" etext="如果你看到了这个，说明我在搬砖" :class="{empty:noContent}">
						<div class="waiting" id="anchor" v-show="artWaiting">
							<div class="rect1"></div>
							<div class="rect2"></div>
							<div class="rect3"></div>
							<div class="rect4"></div>
							<div class="rect5"></div>
						</div>
						<div class="panel-t tl" v-for="art in curArts" :key="art.aid">
							<p class="pt-time"><i class="iconfont icon-time"></i> {{art.time.substr(0,10)}}</p>
							<div class="panel-t-img">
								<router-link :to="art.aid" append>
									<img :src="'/root'+art.imgSrc+'.thumb'" class="lazyload" :data-src="'/root'+art.imgSrc">
								</router-link>
							</div>
							<div class="panel-t-info ">
								<h2 class="title"><router-link :to="art.aid" append>{{art.title}}</router-link></h2>
								<p class="preview">{{art.preview}}</p>
								<p class="cut-line-d" style="margin: .1rem 0"></p>
								<span><router-link to="/about" class="author"><i class="iconfont icon-geren"></i>oshino</router-link></span>
								<span><i class="iconfont icon-fire"></i> {{art.readCount}}</span>
								<span><router-link :to="art.aid+'#comments'" append class="comments"><i class="iconfont icon-comment"></i> {{art.commentCount}}</router-link></span>
							</div>
						</div>


					</div>
					<div class="paging-box" v-if="pageNum>1">
						<ol class="pb-original">
							<li class="prev" @click="curPage--" v-show="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
							<li v-show="curPage>=4" @click="curPage=1">1</li>
							<li v-show="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
							<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
							<li v-show="curPage<=pageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
							<li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
							<li class="next" @click="curPage++" v-show="curPage!==pageNum"><i class="iconfont icon-caretright"></i></li>
						</ol>
						<div class="pb-jump">
							<span>共{{pageNum}}页，跳至</span>
							<input type="text" @keyup.enter="pageJump">
							页
						</div>
					</div>
				</div>
				<div class="content-aside">
					<div class="ca album" >
						<div class="album-img-wrap">
							<img class="album-img" @click="openLB" :src="'/root'+firstImg">
							<p>{{firstDes}}</p>
						</div>
					</div>
					<div class="ca board">
						<div class="board-head">
							<span>日常　</span><i class="iconfont icon-story clearm ibold"></i>
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
	import {contentAsideMixin} from "../util/global";
	import {mapState} from 'vuex'
	export default {
        name: "Trivial",
		created(){
			fetch('/apis/apiv1.php',{_:'trivial'}).then(response=>{
				let data = response.data.data;
				console.log(data);
				this.headerInfo = data.headerInfo;
				this.$set(this.arts[0],'1',data.artsNew);
				this.$set(this.arts[1],'1',data.artsHot);
				data.artsNew.forEach(e=>{
					this.curArts.push(e)
				});
				this.artWaiting = false;
				this.noContent = !Boolean(parseInt(data.artNum));
				this.pageNum = Math.ceil(parseInt(data.artNum)/8);
				if (!this.isMobile){
					this.$store.commit('lbImgsC',data.album);
					if (data.album.length){
						this.firstImg = data.album[0].imgSrc;
						this.firstDes = data.album[0].description;
					}
					if (data.gossip)
						this.gossip = data.gossip;
				}
				setTimeout(()=>this.$store.commit('lazyCheck'),100);
			})
		},
        data() {
            return {
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'随写',description:''},
				artWaiting:true,
				noContent:false,
				pageNum:1,
				curPage:1,
				orderFlag:0,
				arts:{
					0:{},
					1:{}
				},
				curArts:[],
			}
        },
        methods:{
        	openLB(){
        		this.$store.commit('lbShowC',true);
			},
			pageJump(e){
				let page = parseInt(e.target.value);
				if(isNaN(page)){}
				else this.curPage = page<1?1:(e.target.value>this.pageNum?this.pageNum:page);
				e.target.value='';
			},
		},
		computed:{
			pageList:function () {
				if(this.pageNum===1)return [1];
				else if(this.pageNum===2)return[1,2];
				else if(this.pageNum===3)return[1,2,3];
				else if(this.curPage===1)return[1,2,3];
				else if(this.curPage===2)return[1,2,3,4];
				else if(this.curPage>=3&&this.curPage<=this.pageNum-2)return[this.curPage-2,this.curPage-1,this.curPage,this.curPage+1,this.curPage+2];
				else if(this.curPage===this.pageNum-1)return[this.curPage-2,this.curPage-1,this.curPage,this.pageNum];
				else return[this.curPage-2,this.curPage-1,this.curPage];
			},
			...mapState(['isMobile'])
		},
        watch:{
			orderFlag(cur,pre){
				if(this.curPage===1){
					this.curArts.length = 0;
					this.arts[cur][1].forEach(e=>this.curArts.push(e));
					setTimeout(()=>this.$store.commit('lazyCheck'),100);
				}
				else this.curPage = 1;
			},
			curPage(cur,pre){
				if(this.arts[this.orderFlag][cur]){
					this.curArts.length = 0;
					this.arts[this.orderFlag][cur].forEach(e=>this.curArts.push(e));
					setTimeout(()=>this.$store.commit('lazyCheck'),100);
				}
				else{
					while (this.curArts.pop()){}
					this.artWaiting = true;
					fetch('/apis/apiv2.php',{_:'trivial',pn:cur,order:this.orderFlag}).then(response=>{
						this.$set(this.arts[this.orderFlag],cur,response.data.data.arts);
						this.artWaiting = false;
						this.arts[this.orderFlag][cur].forEach(e=>this.curArts.push(e));
						setTimeout(()=>this.$store.commit('lazyCheck'),100);
					})
				}
			}
		},
		mixins:[contentAsideMixin]
    }
</script>

<style scoped>
	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: snow;
	}
	/*-----------------------------------*/
	.page-content.acg{
		max-width: 10.5rem;
		overflow: hidden;/*解决子元素浮动撑不开父元素*/
		height: 100%;
		position: relative;
	}
	.pattern-full-width{ /*使用Code组件覆盖*/
		position: relative;
		width: 100%;
		overflow: hidden;
	}
	.pattern-full-width:before{
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.1);
	}
	.page-img{
		background: no-repeat center center;
		background-size: cover;
		background-origin: border-box;
		width: 100%;
		height: 5rem;
		transition: all .5s;
	}
	.page-info{
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		top: 40%;
		color: white;
		padding: 0 .5rem;
		text-shadow: 0.02rem 0.02rem 0.1rem black;
	}
	.page-info .intro{
		font-size: .4rem;
		letter-spacing: .05rem;
		margin-bottom: .1rem;
		transition: .5s;
	}
	.page-info .tsukkomi{
		font-size: .2rem;
	}
	/*-----------------------------------------------*/
	.content-primary{ /*使用coacg覆盖*/
		max-width: 7rem;
		margin: 0 auto;
		float: left;
		width: 100%;
		transition: .5s;
	}
	.article-order{
		margin: .2rem 0;
		height: 100%;
		overflow: hidden;
		border-bottom: .01rem solid #e5e5e5;
	}
	.article-order span{
		font-size: .2rem;
		float: left;
		margin: 0 .2rem;
	}
	.order-list{
		list-style-type: none;
		float: left;
	}
	.order-list li{
		cursor: pointer;
		display: inline-block;
		float: left;
		line-height: .3rem;
		padding: 0 .05rem;
		border-bottom:.01rem solid #e5e5e5;
		transition: .5s;
	}
	.order-list li:hover{
		color: #00a1d6;
		border-color: #00a1d6;
	}
	.o-selected{
		border-color: #00a1d6 !important;
		color: unset !important;
		position: relative;
	}
	.o-selected:before{
		content: "";
		position: absolute;
		left: 50%;
		margin-left: -.03rem;
		bottom: 0;
		width: 0;
		height: 0;
		border-bottom: .03rem solid #00a1d6;
		border-top: 0;
		border-left: .03rem dashed transparent;
		border-right: .03rem dashed transparent;
	}
	.article-list{
		clear: both;
		min-height: 4rem;
	}
		.panel-t{
			border-radius: .03rem;
			box-shadow: 0 .01rem .02rem rgba(0,0,0,0.15), 0 .02rem .04rem rgba(0,0,0,0.10);
			border:.01rem solid #e5e5e5;
			position: relative;
			margin-bottom: .2rem;
			color: #636363;
			transition: .3s;
		}
		.panel-t:hover{
			box-shadow: 0 .03rem .06rem rgba(0,0,0,0.15), 0 .06rem .12rem rgba(0,0,0,0.10);
		}
			.pt-time{
				padding-left: .1rem;
				border-left: .07rem solid #5abebc;
				line-height: .2rem;
				font-size: .12rem;
			}
			#mobile-app .panel-t-img{
				position: unset;
				padding: 0 .1rem;
			}
			.panel-t-img{
				position: absolute;
				top: .25rem;
				left: .15rem;
				font-size: 0;
			}
				#mobile-app .panel-t-img a{
					display: block;
					font-size: 0;
				}
				#mobile-app .panel-t-img img{
					width: 100%;
				}
				.panel-t-img img{
					object-fit: cover;
					object-position: center center;
					width: 1.5rem;
					height: 1.5rem;
				}
			#mobile-app .panel-t-info{
				margin-left: 0;
				height: auto;
			}
			.panel-t-info{
				margin-left: 1.8rem;
				padding: 0 .1rem .1rem .1rem;
				height: 1.65rem;
			}

			.panel-t-info span{
				margin-right: .15rem;
				font-size: .14rem;
				color: #9e9e9e;
			}
				#mobile-app .panel-t-info .title{
					line-height: .3rem;
					font-size: .16rem;
				}
				.panel-t-info .title{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: .2rem;
					line-height: .4rem;
				}
					.panel-t-info .title a:hover{
						color: #5abebc;
					}
				#mobile-app .panel-t-info .preview{
					font-size: .14rem;
					line-height: .2rem;
					height: .6rem;
				}
				.panel-t-info .preview{
					overflow: hidden;
					line-height: .22rem;
					height: .66rem;
				}
	.paging-box{
		margin: .3rem 0;
		text-align: left;/*??*/
	}
	.paging-box .pb-original{
		display: inline-block;
		margin: 0 .2rem;
		border-radius: .05rem;
		list-style-type: none;
	}
	.pb-original li{
		float: left;
		height: .25rem;
		width: .25rem;
		line-height: .25rem;
		color: #009ccd;
		cursor: pointer;
		user-select: none;
		text-align: center;
		transition: background-color.3s;
	}
	.pb-original .ellipses{
		cursor: auto;
	}
	.pb-original li:hover{
		background: #eaeaea;
	}
	.pb-original .prev{
		border-top-left-radius: .05rem;
		border-bottom-left-radius: .05rem;
	}
	.pb-original .next{
		border-top-right-radius: .05rem;
		border-bottom-right-radius: .05rem;
	}
	.pb-original .current{
		background: #009ccd !important;
		color: white;
		text-shadow: 0 0 .04rem white;
		border-radius: .05rem;
	}
	.pb-jump{
		float: right;
		color: #99a2aa;
		line-height: .25rem;
		font-size: .14rem;
		margin-right: .2rem;
	}
	.pb-jump input{
		background: transparent;
		outline: none;
		border: .01rem solid #ddd;
		border-radius: .05rem;
		width: .4rem;
		line-height: .23rem;
		padding: 0 .07rem;
		color: #6c6c6c;
		text-align: center;
		transition: .3s;
	}
	.pb-jump input:focus{
		border-color: #009ccd;
	}
	.content-aside{/*使用coacg覆盖*/
		width: 2.8rem;
		margin-top: .5rem;
		float: right;
	}
		.ca{ /*以Game为标准*/
			width: 100%;
			border-radius: .05rem;
			background: rgba(252,250,242,.7);
			box-shadow: 0 0.01rem 0.03rem rgba(26,26,26,.5);
			margin-bottom: .2rem;
		}
		.album{
			overflow: hidden;
		}
		.album-img-wrap{
			position: relative;
			height: 2.8rem;
			width: 2.8rem;
		}
		.album-img{
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center center;
		}
		.album-img-wrap p{
			position: absolute;
			bottom: 0;
			padding: .05rem .1rem;
			font-size: .14rem;
			color: #eeeeee;
			width: 100%;
			background: rgba(0,0,0,.3);
		}



		.cah.board,.ca.board { /*以下使用homepage覆盖*/
			min-height: 1.1rem;
			position: relative;
		}
		.board-head{
			position: absolute;
			top: .2rem;
			left: 0;
			bottom: .2rem;
			writing-mode: vertical-rl;
			border-right: .01rem dashed #c5ccd3;
		}
		.board-head span{
			display: inline-block;
			padding: 0 .1rem;
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
	/*下面使用commentModule样式*/
	.waiting{
		margin: 0 auto;
		text-align: center;
		height: 2.35rem;
		padding: 1rem 0;
		width: .5rem;
		font-size: .1rem;
	}
	.waiting>div{
		display: inline-block;
		height: 100%;
		width: .05rem;
		background: #00a1d6;
		animation: stretchdelay 1.2s infinite ease-in-out;
	}
	.waiting .rect2{
		animation-delay: -1.1s;
	}
	.waiting .rect3{
		animation-delay: -1s
	}
	.waiting .rect4{
		animation-delay: -.9s;
	}
	.waiting .rect5{
		animation-delay: -.8s;
	}
@media screen and (max-width: 1050px) {
	.content-primary{
		float: none;
	}
	.content-aside{
		display: none;
	}
}
@media screen and (max-width: 1005px){/*使用Code组件覆盖*/
	.page-img{
		height: 3rem;
	}
	.page-info .intro{
		font-size: .3rem;
	}
}
@media screen and (max-width: 800px) {/*使用Code组件覆盖*/
	.page-img{
		height: 2.5rem;
	}
}
</style>
