<template>
	<div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" style="background-image: url('http://127.0.0.1:80/static/img/10.jpg')"></div>
				<div class="page-info">
					<h2 class="intro">笔记页</h2>
					<p class="tsukkomi">高中时代留下来的“坏习惯”</p>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="page-content note">
				<div class="notice tl"><i class="fas fa-volume-up"></i> 自用笔记公开，基于个人记忆及思维习惯写成，有不同程度的省略和变形，仅供参考</div>
				<div class="content-primary-n">
					<div class="note-sort-options">
						<span class="nso-l" :class="{'nso-selected':!rSelected}" @click="rSelected=false">日期降序</span><span class="nso-r" :class="{'nso-selected':rSelected}" @click="rSelected=true">分类归类</span>
					</div>
<!--					<div class="note-filters tl">-->
<!--						<p style="font-size: .2rem">Filters</p>-->
<!--						<div class="filter-box no-select" v-for="each in catKey" @click="curFilter=each"><img src="http://127.0.0.1:80/static/img/python.png" width="20" height="20"><span>{{catMap[each]}}</span></div>-->
<!--					</div>-->
					<div class="list-container tl" v-if="rSelected">
						<div class="category-list" v-for="(item,key,index) in catMap" :key="index">
							<div class="category-title">
								{{item}} <span> · {{key}}</span>
							</div>
							<div class="category-list-item" v-for="(item_,index_) in sortedNotes[key]">
								<span class="item-num">{{index_|twoNum}}</span>
								<span class="item-name">
									<router-link :to="item_.nid" class="item-link" append>{{item_.title}}</router-link><span class="item-tag" v-for="tag in item_.tags"><a :href="'/tags/'+tag">{{tag}}</a></span>
								</span>
								<span class="item-date">{{item_.time.substr(0,10)}}</span>
							</div>
						</div>
					</div>


					<div class="note-list tl" v-if="!rSelected">

						<div class="panel-n-wrap" v-for="each in curNotes"><!--需要：时间o，标题o，预览o，图片o，分类，nido-->
							<div class="panel-n" >
								<div class="panel-n-img">
									<router-link :to="each.nid" append>
										<img :src="'http://localhost:80'+each.imgSrc">
										<div class="float-preview tl">
											{{each.preview}}
										</div>
									</router-link>
								</div>
								<div class="slant-mask slant-beneath"></div>
								<div class="slant-mask">
									<i class="far fa-clock"> {{each.time.substr(0,10)}}</i>
								</div>
								<div class="panel-n-info">
									<div class="title">
										<router-link :to="each.nid" append>{{each.title}}</router-link>
									</div>
									<div class="category no-select">
										<span >{{each.category}}</span><div class="cat-icon" style="background-image: url('http://localhost:80/static/img/python.png')"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="pager" v-if="curNotes.length<noteNum" @click="loadMore" >
							<div class="dec"></div>
							<div class="previous-more">
								<span>More</span>
							</div>
						</div>
						<div class="pager-no-more" v-if="curNotes.length>=noteNum">没有更多啦( *・ω・)✄╰ひ╯</div>

					</div>

				</div>
				<div class="content-aside-n">

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
    export default {
        name: "Note",
		created(){
			fetch('/apis/apiv1.php',{_:'n'}).then(response=>{
				console.log(response.data);
				let data = response.data.data;
				this.catMap = data.catMap;
				// this.catKey = Object.keys(this.catMap);
				// this.catCount = data.catCount;
				data.notes.forEach(e=>{
					if (e.tags) e.tags = e.tags.split(',');
					this.notes.push(e);
				});
				this.noteNum = data.notes.length;
				this.curNotes = this.notes.slice(0,this.noteNum<6?this.noteNum:6);
				for(let i in this.catMap)
					this.$set(this.sortedNotes,i,this.notes.filter(e=>e.category===i));
				// response.data.data.forEach((e)=>this.notes.all.push(e));
				// this.curNotes = this.notes.all
			})
		},
        data() {
            return {
            	catMap:null,
				// catKey:[],
				noteNum:0,
				// catCount:{},
				rSelected:false,

            	// curFilter:'all',
				notes:[],
				sortedNotes:{},
				curNotes:[]

			}
        },
		watch:{
			// curFilter(cur,pre){ //监视filter变化并切换到对应note列表
			// 	if(this.notes[cur])this.curNotes = this.notes[cur];
			// 	else{
			// 		fetch('/apis/apiv2.php',{_:'n',f:cur}).then(response=>{
			// 			console.log(response.data);
			// 			this.curNotes = this.notes[cur] = response.data.data;
			// 		})
			// 	}
			// }
		},
		methods:{
        	// loadMore(cur){ //加载更多，当前filter长度小于上限时发起请求，否则无作为
        	// 	console.log(cur);
        	// 	if(this.curNotes.length<parseInt(this.catCount[cur])){
        	// 		console.log(this.curNotes.length,parseInt(this.catCount[cur]));
			// 		fetch('/apis/apiv2.php',{_:'n',f:cur,o:this.curNotes.length}).then(response=>{
			// 			response.data.data.forEach(e=>this.notes[cur].push(e))
			// 		})
			// 	}
        	// 	else console.log(this.curNotes.length,parseInt(this.catCount[cur]));
			//
			//
			// },
			loadMore(){
				if(this.curNotes.length===this.noteNum){}
				else if(this.curNotes.length+6<this.noteNum)
					for(let i=0;i<6;i++)this.curNotes.push(this.notes[this.curNotes.length]);
				else
					for(let i=this.curNotes.length;i<this.noteNum;i++)this.curNotes.push(this.notes[i]);
			}
		},
		filters:{
        	twoNum(data){
        		data++;
        		return data<10?'0'+data:data
			}
		},

        mounted() {
        },

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
	.page-content.note{
		max-width: 9rem;
		overflow: hidden;
		height: 100%;
	}
	.note-sort-options{
		margin: .3rem 0;
	}
	.note-sort-options span{
		line-height: .25rem;
		border: .01rem solid #9dd9ff;
		color: #9dd9ff;
		cursor: pointer;
		user-select: none;
	}
		.note-sort-options .nso-l{
			border-radius: 1rem 0 0 1rem;
			padding:  .04rem .07rem .04rem .1rem;
			border-right: none;
		}
		.note-sort-options .nso-r{
			border-radius: 0 1rem 1rem 0;
			padding:  .04rem .1rem .04rem .07rem;
			border-left: none;

		}
		.note-sort-options .nso-selected{
			background-color: #9dd9ff;
			color: #fff;
		}

	.category-list{
		margin: .3rem 0;
		font-size: .15rem;
		line-height: .17rem;
	}
		.category-list .category-title{
			margin-bottom: .15rem;
			border-left: .15rem solid #dddddd;
			padding-left: .15rem;
			color: #00a1d6;
			font-size: .2rem;
			line-height: .24rem;
			letter-spacing: .01rem;
		}
			.category-title span{
				color: #bbbbbb;
				font-size: .12rem;
			}
		#mobile-app .category-list-item,.tag-query-result ul li{
			margin: 0 .1rem;
		}
		.category-list .category-list-item,.tag-query-result ul li{
			margin: 0 .5rem;
			padding: .1rem 0;
			line-height: .2rem;
			border-bottom: .01rem dotted #eaeaea;
		}
			.category-list-item .item-num,.tag-query-result ul li .item-type{
				display: inline-block;
				vertical-align: top;
				font-size: .14rem;
				margin-right: .05rem;
				padding:  0 .05rem;
				border-radius: .1rem;
				border: .01rem solid #9dd9ff;
				line-height: .18rem;
				user-select: none;
				color: #00a1d6;
			}
			.category-list-item .item-name,.tag-query-result ul li .item-name{
				display: inline-block;
				max-width: 60%;

			}
				.item-name .item-link{
					color: inherit;
					font-size: .16rem;
					margin-right: .1rem;
					transition: .5s;
				}
				.item-name .item-tag{
					display: inline-block;
					font-size: .12rem;
					background: #eaeaea;
					padding: 0 .05rem;
					line-height: .18rem;
					vertical-align: top;
					border-radius: .1rem;
					margin-right: .05rem;
				}
					.item-tag a{
						color: inherit;
					}
				.item-name .item-link:hover{
					color: #00a1d6;
				}
			.category-list-item .item-date,.tag-query-result ul li .item-date{
				font-size: .12rem;
				float: right;
				color: #888888;
			}

	.note-filters{
		width: 100%;
		padding:.1rem;
		border-bottom: .01rem solid #eaeaea;
	}
	.filter-box{
		display: inline-block;
		margin-right: .1rem;
		margin-top: .05rem;
		cursor: pointer;
		border-radius: .02rem;
		border: .02rem solid transparent;
	}
	.filter-box:hover{
		animation: borderShine .7s alternate infinite;
	}
	@keyframes borderShine {
		from{border-color: lightskyblue}
		to{border-color: #00a1d6}
	}


	.note-list{
		overflow: hidden;
		padding-top: .1rem;
		position: relative;
	}
	.note-list>div,.list-container>div{
		animation: mini-fadeInDown 1s cubic-bezier(.25,.46,.45,.94) forwards;
	}
	#mobile-app .panel-n-wrap{
		padding: .1rem 0;
	}
	.panel-n-wrap{
		display: inline-block;
		padding: .1rem;
		width: 50%;
		float: left;
	}
	.panel-n{
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: .03rem;
		border: .01rem solid #eaeaea;
		transition: .5s ease;
	}
	.panel-n:hover{
		box-shadow: 0 .01rem .04rem rgba(0,0,0,.5);
	}
	.panel-n-img{
		position: relative;
		height: 1.5rem;
		overflow: hidden;
		border-top-left-radius: .03rem;
		border-top-right-radius: .03rem;
		background: #313131;
	}
		.panel-n-img img{
			object-position: center center;
			object-fit: cover;
			width: 100%;
			height: 100%;
			transition:.5s ;
		}
		.panel-n:hover img{
			transform: scale(1.1);
			filter: blur(.03rem);
			opacity: .6;
		}
		.panel-n-img .float-preview{
			position: absolute;
			padding: 0 .2rem;
			text-indent: .2rem;
			color: snow;
			font-size: .15rem;
			opacity: 0;
			transition: .5s ease;
		}
		.panel-n:hover .float-preview{
			transform: translateY(-1.3rem);
			opacity: 1;
		}
	.slant-mask{
		position: absolute;
		width: 110%;
		top: 1rem;
		min-height: .5rem;
		padding: .1rem .2rem;
		transform-origin: left top;
		transform: rotate(8deg);
		background: white;
	}
	.slant-mask.slant-beneath{
		transform-origin: right top;
		transform: rotate(-8deg);
		background: rgba(0,0,0,.2);
	}
	.panel-n-info{
		padding: .1rem .2rem;
		position: relative;
		height: .8rem;
		background-color: white;
	}
		.panel-n-info .title a{
			color: inherit;
			font-weight: bold;
			font-size: .19rem;
		}
		.panel-n-info .title a:hover{
			color: #00a1d6;
		}
		.panel-n-info .category{
			position: absolute;
			padding: 0 .15rem .15rem;
			right: 0;
			bottom: 0;
			text-align: right;
		}
			.panel-n-info .category span{
				color: #636363;
				font-size: .14rem;
			}
			.panel-n-info .category .cat-icon{
				display: inline-block;
				margin-left: .1rem;
				width: .32rem;
				height: .32rem;
				border: .01rem solid #eaeaea;
				border-radius: 100%;
			}
	.pager{
		position: relative;
		height: .4rem;
		width: 1.2rem;
		margin: .2rem auto 0;
		cursor: pointer;
		text-align: center;
		clear: both;
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
		text-align: center;
		padding: .1rem;
		clear: both;
	}
@media screen and (max-width: 1005px){/*使用Code组件覆盖*/
	.page-img{
		height: 3rem;
	}
	.page-info .intro{
		font-size: .3rem;
	}
}
@media screen and (max-width: 550px) {
	.panel-n-wrap{
		width: 100%;
	}

}

</style>
