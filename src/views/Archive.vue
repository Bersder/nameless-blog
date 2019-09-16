<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
				<div class="page-info">
					<h2 class="intro">{{headerInfo.title}}</h2>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="page-content" style="padding: .1rem">
				<div class="tag-cloud tl">
					<h2>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{this.tagExpand|expandStatus}}</a></h2>
					<ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
						<li class="tag" v-for="(item,key,index) in tagDict" :key="index"><router-link :to="'/tags/'+key" :title="item+' 相关'">{{key}}</router-link></li>
					</ul>
				</div>
				<div class="archive-list">
					<h2 class="archive-title">归档</h2>
					<span class="archive-title-en">Archives</span>
					<p style="color: #8b8e99;font-size: .14rem;font-weight: 600">{{this.articles.length-this.noteNum}} 文章 + {{this.noteNum}} 笔记</p>
					<div class="archives">
						<p class="tr" style="padding: 0 .2rem"><a @click="test2" href="javascript:void(0);">「展开／折叠」</a></p>
						<div class="years-list" v-for="year in year_ord">
							<h3>{{year}} 年</h3>
							<ul class="mons-list">
								<li class="ml-item" v-for="mon in arch_data[year].mon_ord">
									<span class="mon"  @click="test(year,mon)" >{{mon}}月({{arch_data[year][mon].articles.length}}篇)</span>
									<ul class="days-list" :id="year+'-'+mon" :style="{height:arch_data[year][mon].articles.length*26+'px'}" >
										<li v-for="art in arch_data[year][mon].articles">
											<span class="day">{{art.day}}日</span>
											<router-link :to="art|toUrl">{{art.title}}<span style="color: #b8c0cc;font-size: .12rem" v-if="art.type==='note'"> · 笔记</span></router-link>
										</li>
									</ul>
								</li>

							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
	import {fast_unique} from "../util/util";
	import {mapState} from 'vuex'
	import {tagCloudMixin} from "../util/global";
	export default {
        name: "Archive",
		created(){
			fetch('/apis/apiv4.php').then(response=>{
				let data = response.data.data;
				this.articles = data.articles;
				this.headerInfo = data.headerInfo;
				this.noteNum = data.noteNum;
				this.articles.forEach(e=>{
					if(!this.arch_data[e.time.slice(0,4)])
						this.arch_data[e.time.slice(0,4)] = {};
					if(!this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)])
						this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)] = {unfolded:false,articles:[]};
					this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)]['articles'].push({id:e.id,day:e.time.slice(8,10),title:e.title,type:e.type,readCount:e.readCount,commentCount:e.commentCount})

				});
				this.year_ord = Object.keys(this.arch_data).sort((a,b)=>{return b - a});
				this.year_ord.forEach(e=>{
					this.arch_data[e]["mon_ord"] = Object.keys(this.arch_data[e]).sort((a,b)=>{return b - a});
				});
				response.data.data.tags.forEach(e=>{
					this.$set(this.tagDict,e.tagName,e.relateArt.split(',').length + e.relateNote.split(',').length - 4)
				});
				if ((!this.isMobile&&Object.keys(this.tagDict).length>30)||(Object.keys(this.tagDict).length>12&& this.isMobile)) this.manyTags = true;
			});

		},
        data() {
            return {
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'归档',description:''},
				noteNum:0,
				articles:[],
				year_ord:[],
				arch_data:{},
				expand_flag:true,
			}
        },
		computed:{
        	...mapState(['isMobile'])
		},
        mounted() {
        },
		methods:{
        	test(y,m){
				let ul = document.getElementById(y+'-'+m);
				if (ul.style.height === '0px')
					ul.style.height = this.arch_data[y][m].articles.length * 26 + 'px';
				else
					ul.style.height = '0px';

			},
			test2(){
        		let es = document.getElementsByClassName('days-list');
				if(this.expand_flag)
					Array.from(es).forEach(e=>e.style.height='0px');
				else
					Array.from(es).forEach(e=>{
						let ym = e.getAttribute('id').split('-');
						let y = ym[0];
						let m = ym[1];
						e.style.height = this.arch_data[y][m].articles.length * 26 + 'px';
					});
				this.expand_flag = !this.expand_flag
			}
		},
		mixins:[tagCloudMixin],
		filters:{
        	toUrl(item){
				return item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id;
			}
		}

    }
</script>

<style scoped>
	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		/*background: rgba(55,55,55,.5);*/
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
	.tag-cloud h2,.tag-query-result h2{
		margin: .1rem 0;
		font-size: .2rem;
	}
	.tag-cloud h4{
		margin: .1rem 0;
	}
	.tag-cloud .roll-toggle{
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		background: #eaeaea;
		padding: .05rem 0;
		width: .22rem;
		font-size: .12rem;
		line-height: .12rem;
		border-radius: .03rem;
		transition: all .5s cubic-bezier(.25,.46,.45,.94);
	}
	.tag-cloud .roll-toggle:hover{
		color: white;
		background: rgba(0,0,0,.8);
	}
	.tag-list{
		list-style-type: none;
		overflow: hidden;
		max-height: 1rem;
		transition: 1s;
	}
	.tag-list.more{
		max-height: 10rem;
	}
		.tag-list .tag{
			display: inline-block;
			padding: 0 .08rem;
			margin-right: .05rem;
			margin-bottom: .1rem;
			border: .02rem solid rgba(0,0,0,.1);
			border-radius: 1rem;
			font-size: .14rem;
			line-height: .2rem;
			transition: .5s cubic-bezier(.25,.46,.45,.94);
		}
			.tag-list .tag a{
				color: #6d757a;
			}
			.tag-list .tag:hover a{
				color: white;
			}
		.tag-list .tag:hover{
			border-color: rgba(0,0,0,.5);
			background: rgba(0,0,0,.5);
		}


	.archive-title{
		display: inline-block;
		margin: .15rem 0;
		padding-right: .1rem;
		border-right: #ddd dashed .01rem;
		font-weight: normal;
	}
	.archive-title-en{
		padding-left: .1rem;
		color: #a1a1a1;
	}
	.archives{
		text-align: left;
	}
	.archives li{position: relative;line-height: .26rem}
	#mobile-app .archives h3{
		padding-left: .5rem;
	}
	.archives h3{
		font-size: .25rem;
		padding-left: 1.5rem;
	}
	#mobile-app .mons-list{
		margin-left: 0;
	}
	.mons-list{
		position: relative;
		list-style-type: none;
		margin-left: 1rem;
		padding: .15rem 0;
	}
	.mons-list:before{
		position: absolute;
		content: '';
		display: block;
		left: .8rem;
		top: 0;
		width: .06rem;
		height: 100%;
		background: linear-gradient(to bottom,rgba(80,80,80,0) 0%, rgb(80,80,80) 8%, rgb(80,80,80) 92%, rgba(80,80,80,0) 100%);
		z-index: 5;
	}
	.ml-item>span{position: relative;cursor: pointer}
	.ml-item>span:before{
		position: absolute;
		top: .02rem;
		left: .76rem;
		content: '';
		width: .15rem;
		height: .15rem;
		background: white;
		border: .03rem solid #FF7D7D;
		border-radius: .1rem;
		z-index: 10;
		box-sizing: border-box;
	}

		.ml-item .days-list{
			margin-left: .45rem;
			padding-left: .5rem;
			overflow: hidden;
			list-style-type: none;
			transition: .5s ease-in-out;
		}
			.days-list a{
				position: absolute;
				left: .35rem;
				right: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.days-list a:hover{
				color: #00a1d6;
			}
			.days-list .day{
				color: #FF7D7D;
			}
			.ml-item .days-list li:before{
				position: absolute;
				content: '';
				top: .1rem;
				left: -.16rem;
				border-radius: .1rem;
				border: .04rem solid #FF7D7D;
				box-sizing: border-box;
				z-index: 10;
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
