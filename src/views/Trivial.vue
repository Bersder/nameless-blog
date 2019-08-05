<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" style="background-image: url('http://127.0.0.1:80/static/img/10.jpg')"></div>
				<div class="page-info">
					<h2 @click="LBshow=true" class="intro">琐事</h2>
					<p class="tsukkomi">记录单身20年的生活</p>
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
					<div class="article-list">
						<div class="panel-t tl" v-for="art in curArts" :key="art.aid">
							<p class="pt-time"><i class="far fa-clock"></i> {{art.time.substr(0,10)}}</p>
							<div class="panel-t-img">
								<router-link :to="art.aid" append>
									<img :src="'http://127.0.0.1:80'+art.imgSrc">
								</router-link>
							</div>
							<div class="panel-t-info ">
								<h2 class="title"><router-link :to="art.aid" append>{{art.title}}</router-link></h2>
								<p class="preview">{{art.preview}}</p>
								<p class="cut-line-d" style="margin: .1rem 0"></p>
								<span><router-link to="/个人主页" class="author"><i class="fas fa-user"></i> nyanya</router-link></span>
								<span><i class="far fa-eye"></i> {{art.readCount}}</span>
								<span><router-link to="评论区" class="comments"><i class="far fa-comments"></i> {{art.commentCount}}</router-link></span>
							</div>
						</div>


					</div>
					<div class="paging-box" v-if="pageNum>1">
						<ol class="pb-original">
							<li class="prev" @click="curPage--" v-show="curPage!==1"><i class="fas fa-caret-left"></i></li>
							<li v-show="curPage>=4" @click="curPage=1">1</li>
							<li v-show="curPage>=5" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
							<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
							<li v-show="curPage<=pageNum-4" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
							<li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
							<li class="next" @click="curPage++" v-show="curPage!==pageNum"><i class="fas fa-caret-right"></i></li>
						</ol>
						<div class="pb-jump">
							<span>共{{pageNum}}页，跳至</span>
							<input type="text" @keyup.enter=""><!--指定跳转待开发-->
							页
						</div>
					</div>
				</div>
				<div class="content-aside">
					<div class="ca album" >
						<div class="album-img-wrap">
							<img class="album-img" src="http://127.0.0.1:80/static/img/7.jpg">
							<p>一张图片</p>
						</div>
					</div>
					<div class="ca board">
						<div class="board-head">
							<span>游言　</span>
							<i class="fab fa-first-order-alt"></i>
						</div>
						<div class="board-content">
							异度之刃2有毒，害我天天两点睡
						</div>
						<div class="board-post-time">
							-- Dec 12th, 23:33
						</div>
					</div>
				</div>
			</div>
		</div>
		<transition name="LB">
			<div class="luminous-box-container"  v-if="LBshow" :class="{'sidebar-show':LBsidebarShow}" >
				<div class="luminous-box-bg"></div>
				<div class="luminous-box-inner">
					<div class="luminous-box-topbar">
						<div class="process pl">
							{{LBIndex+1}} / {{LBImgs.length}}
						</div>
						<div class="toolbar pr">
							<button @click=""><i class="fas fa-play"></i></button>
							<button @click="LBsidebarShow=!LBsidebarShow"><i class="fas fa-bars"></i></button>
							<button @click=""><i class="fas fa-search"></i></button>
							<button @click="LBshow=!LBshow"><i class="fas fa-times"></i></button>
						</div>
					</div>
					<div class="luminous-box-nav">
						<button @click.stop="LBprevious" class="lprev"><i class="fas fa-arrow-left"></i></button>
						<button @click.stop="LBnext" class="rnext"><i class="fas fa-arrow-right"></i></button>
					</div>
					<div class="luminous-box-stage">
						<transition name="LBimg">
							<div class="luminous-box-img-wrap" v-if="LBimgShow">
								<img :src="LBImgs[LBIndex]">
							</div>
						</transition>

					</div>
					<div class="luminous-box-caption">
						<transition name="LBimg">
							<p v-if="LBimgShow">{{LBDescriptions[LBIndex]}}</p>
						</transition>

					</div>
				</div>
				<div class="luminous-box-sidebar" v-show="LBsidebarShow" >
					<a v-for="(each,index) in LBImgs" @click="jumpto(index)" :class="{active:index===LBIndex}" :style="{backgroundImage:'url('+each+')'}" :title="LBDescriptions[index]"></a>
				</div>
			</div>
		</transition>


	</div>
</template>

<script>
	import {fetch} from "../util/http";
	export default {
        name: "Trivial",
		created(){
			fetch('/apis/apiv1.php',{_:'trivial'}).then(response=>{
				let data = response.data.data;
				console.log(data);
				this.$set(this.arts[0],'1',data.artsNew);
				this.$set(this.arts[1],'1',data.artsHot);
				data.artsNew.forEach(e=>{
					this.curArts.push(e)
				});
				this.pageNum = Math.ceil(parseInt(data.artNum)/8);
				data.album.forEach(e=>{
					this.album.push(e);
					this.LBImgs.push(e.imgSrc);
					this.LBDescriptions.push(e.description);
				})
			})
		},
        data() {
            return {
				pageNum:16,
				curPage:1,
				orderFlag:0,

				arts:{
					0:{},
					1:{}
				},
				curArts:[],
				album:[],
				curImgIndex:0,

				LBImgs:[],
				LBDescriptions:[],
				LBIndex:0,
				LBshow:false,
				LBimgShow:true,
				LBsidebarShow:false
			}
        },
        methods:{
        	LBnext(){
        		if (this.LBIndex<this.LBImgs.length-1){
        			this.LBimgShow = false;
        			this.LBIndex++;
        			setTimeout(()=>this.LBimgShow = true,200)


				}
			},
			LBprevious(){
        		if (this.LBIndex>0){
        			this.LBimgShow = false;
        			this.LBIndex--;
					setTimeout(()=>this.LBimgShow = true,200)
				}
			},
			jumpto(index){
        		if (this.LBIndex!==index){
					this.LBimgShow = false;
					this.LBIndex = index;
					setTimeout(()=>this.LBimgShow = true,200);
				}
			}
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
			}
		},
        watch:{
			LBshow(cur,pre){
				this.$store.commit('isMaskedC',cur)
			},
			orderFlag(cur,pre){
				if(this.curPage===1){
					this.curArts.length = 0;
					this.arts[cur][1].forEach(e=>{
						this.curArts.push(e);
					});
				}
				else this.curPage = 1;
			},
			curPage(cur,pre){
				if(this.arts[this.orderFlag][cur]){
					this.curArts.length = 0;
					this.arts[this.orderFlag][cur].forEach(e=>{
						this.curArts.push(e)
					})
				}
				else{
					fetch('/apis/apiv2.php',{_:'trivial',pn:cur,order:this.orderFlag}).then(response=>{
						this.$set(this.arts[this.orderFlag],cur,response.data.data.arts);
						this.curArts.length = 0;
						this.arts[this.orderFlag][cur].forEach(e=>{
							this.curArts.push(e)
						})
					})
				}
			}
		}
    }
</script>

<style scoped>
	.LBimg-enter-active{
		animation: fadeIn .2s cubic-bezier(.25,.46,.45,.94);
	}
	.LBimg-leave-active{
		animation: fadeOut .2s cubic-bezier(.25,.46,.45,.94);
	}
	.LB-enter-active{
		animation: fadeIn .5s cubic-bezier(.25,.46,.45,.94);
	}
	.LB-leave-active{
		animation: fadeOut .5s cubic-bezier(.25,.46,.45,.94);
	}
	.luminous-box-container{
		position: fixed;
		z-index: 2000;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
	}
		.sidebar-show .luminous-box-inner{
			right: 2rem;
		}
		.luminous-box-bg,.luminous-box-inner,.luminous-box-stage{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}

		.luminous-box-bg{
			background: rgba(30,30,30,.9);
		}

			.luminous-box-topbar{
				position: absolute;
				padding-left: .25rem;
				color: #ccc;
				top: 0;
				left: 0;
				right: 0;
				height: .45rem;
				line-height: .45rem;
				z-index: 2010;
			}
				.luminous-box-topbar button{
					background: rgba(30,30,30,.8);
					height: .45rem;
					width: .45rem;
					text-align: center;
					font-size: .18rem;
					float: right;
					color: #bbbbbb;
					transition: 1s cubic-bezier(.25,.46,.45,.94);
				}
				.luminous-box-topbar button:hover,.luminous-box-nav button:hover{
					color: #ffffff;
				}
				.luminous-box-nav button{
					position: absolute;
					background: rgba(30,30,30,.6);
					height: .8rem;
					width: .6rem;
					font-size: .2rem;
					top: 50%;
					transform: translate(0,-50%);
					transition: .5s;
					z-index: 2010;
					color: #bbbbbb;
				}
				.luminous-box-nav button.lprev{
					padding: .2rem .2rem .2rem 0;
					margin-left: .1rem;
					left: 0;
				}
				.luminous-box-nav button.rnext{
					padding: .2rem 0 .2rem .2rem;
					margin-right: .1rem;
					right: 0;
				}
			.luminous-box-stage{
				overflow: hidden;
				z-index: 2004;
			}
				.luminous-box-stage .luminous-box-img-wrap{
					padding: 1rem 0;
					overflow: hidden;
					height: 100%;
					line-height: calc(100% - 2rem);
				}
					.luminous-box-img-wrap img{
						position: relative;
						top:50%;
						transform:translateY(-50%);
						background: transparent;
						max-height: 100%;
						object-fit: cover;
						max-width: 100%;
						user-select: none;
					}
			.luminous-box-caption{
				position: absolute;
				background: linear-gradient(transparent,rgba(30,30,30,.8));
				bottom: 0;
				left: 0;
				right: 0;
				color: white;
				padding: .2rem;
				font-size: .2rem;
				height: 1rem;
				z-index: 2006;
			}
		.luminous-box-sidebar{
			position: absolute;
			background: #dddddd;
			top: 0;
			bottom: 0;
			right: 0;
			width: 2rem;
			padding: .1rem;
			overflow: auto;
			z-index: 2005;
		}
			.luminous-box-sidebar a.active{
				border-color: #FF7D7D;
				box-shadow: 0 .04rem .07rem rgba(0,0,0,.2);
			}
			.luminous-box-sidebar a{
				display: block;
				background: no-repeat center center;
				background-size: cover;
				height: .8rem;
				border: .03rem solid transparent;
				margin-bottom: .05rem;
				cursor: pointer;
				transition: .5s;
			}





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
		margin-left: -3px;
		bottom: 0;
		width: 0;
		height: 0;
		border-bottom: 3px solid #00a1d6;
		border-top: 0;
		border-left: 3px dashed transparent;
		border-right: 3px dashed transparent;
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
				border-left: 6px solid darkgrey;
				line-height: 20px;
				font-size: 12px;

			}
			#mobile-app .panel-t-img{
				position: unset;
				padding: 0 .1rem;
			}
			.panel-t-img{
				position: absolute;
				top: .25rem;
				left: .15rem;
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
			.panel-t-info a{
				color: inherit;
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
		display: block;
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
		height: .3rem;
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
			/*font-size: .14rem;*/
			color: #eeeeee;
			width: 100%;
			background: rgba(0,0,0,.3);
		}



		.cah.board,.ca.board { /*以下使用homepage覆盖*/
			height: 1.1rem;
			position: relative;
		}
		.board-head{
			position: absolute;
			top: .2rem;
			left: 0;
			writing-mode: vertical-rl;
			padding-right: .1rem;
			border-right: .01rem dashed #c5ccd3;
		}
		.board-content{
			height: 70%;
			width: 100%;
			font-size: .14rem;
			letter-spacing: .003rem;
			line-height: .18rem;
			text-align: left;
			text-indent: .2rem;
			padding: .22rem .1rem 0 .55rem;
			color: #425066;
		}
		.board-post-time{
			position: absolute;
			right: .15rem;
			bottom: .15rem;
			color: #c5ccd3;
			font-size: .12rem;
		}

@media screen and (max-width: 1050px) {
	.content-primary{
		float: none;
	}
	.content-aside{
		display: none;
	}
}
@media screen and (max-width: 1005px){
	.page-img{
		height: 3rem;
	}
	.page-info .intro{
		font-size: .3rem;
	}
}
</style>
