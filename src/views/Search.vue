<template>
    <div>
		<div class="page-content-wrap">
			<div class="page-content">
				<div class="content-primary-s">
					<div class="search-box" v-if="!searchFound">
						<i class="fas fa-search fa-lg"></i>
						<input type="search" v-model.trim="searchKey" @keyup.enter="postSearch" name="s" placeholder="搜些其他东西?">
					</div>
					<header class="search-header">
						<h1>搜索结果：{{$route.params.key}}</h1>
					</header>
					<div class="waiting" id="anchor" v-show="searchWaiting">
						<div class="rect1"></div>
						<div class="rect2"></div>
						<div class="rect3"></div>
						<div class="rect4"></div>
						<div class="rect5"></div>
					</div>
					<div class="search-results" v-if="searchFound">
						<div class="panel-h" v-for="each in curResults" :key="each.id+each.type">
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
									<span><i class="fas fa-hashtag"></i><router-link :to="each|typeUrl"> {{each.type|typeEN2CN}}</router-link></span>
									<span><i class="far fa-comments"></i><router-link :to="each|commentUrl"> {{each.commentCount|commentNum}}</router-link></span>
								</div>
								<div class="post-title">
									<p><router-link :to="each|artUrl">{{each.title}}</router-link></p>
								</div>
							</div>
						</div>
						<div class="pager" v-if="curResults.length<resultNum" @click="loadMore" >
							<div class="dec"></div>
							<div class="previous-more">
								<span>More</span>
							</div>
						</div>
					</div>
					<div class="search-404" v-if="!searchFound">
						<h3>没有找到任何东西！看看其他文章吧</h3>
						<ul>
							<li v-for="each in searchResults" :key="each.id+each.type"><router-link :to="each|artUrl">{{each.title}}</router-link></li>
						</ul>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
	import {panelhMixin} from "../util/global";
	export default {
        name: "Search",
		created(){
			fetch('/apis/apiv10.php',{s:this.$route.params.key}).then(response=>{
				let data = response.data.data;
				console.log(data);
				this.searchWaiting = false;
				this.searchFound = Boolean(data.found);
				this.searchResults = data.result;
				this.resultNum = data.result.length;
				let pushNum = this.resultNum<8?this.resultNum:8;
				for (let i = 0; i < pushNum; i++) this.curResults.push(this.searchResults[i]);
			})
		},
        data() {
            return {
            	searchKey:'',
				searchWaiting:true,
				searchFound:true,
				searchResults:[],
				resultNum:0,
				curResults:[],

			}
        },
		watch:{
        	$route(cur,pre){
				console.log(cur,pre);
				this.curResults.length = this.resultNum = 0;
				this.searchWaiting = true;
				this.searchFound = true;
				fetch('/apis/apiv10.php',{s:cur.params.key}).then(response=>{
					let data = response.data.data;
					this.searchWaiting = false;
					this.searchFound = Boolean(data.found);
					this.searchResults = data.result;
					this.resultNum = data.result.length;
					let pushNum = this.resultNum<8?this.resultNum:8;
					for (let i = 0; i < pushNum; i++) this.curResults.push(this.searchResults[i])
				})
			}
		},
       	methods:{
        	postSearch(){
				if (this.searchKey){
					this.$router.push({name:'search',params:{key:this.searchKey}});
					this.searchKey = '';
				}
			},
			loadMore(){
        		if (this.curResults.length === this.resultNum){}
        		else if (this.curResults.length + 8 < this.resultNum)
        			for(let i=0;i<8;i++)this.curResults.push(this.searchResults[this.curResults.length]);
				else
					for(let i=this.curResults.length;i<this.resultNum;i++)this.curResults.push(this.searchResults[i]);

			}
		},
        filters:{
			artUrl(art){
				return art.type==='note'?'/note/'+art.id:'/archive/'+art.type+'/'+art.id
			},
			typeUrl(art){
				return art.type==='note'?'/note':'/archive/'+art.type
			},
			commentUrl(art){
				let url = art.type==='note'?'/note/'+art.id:'/archive/'+art.type+'/'+art.id;
				return url + '#comments';
			}
		},
		mixins:[panelhMixin]
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
	.content-primary-s{
		padding: 1rem 0 .5rem 0;
	}
	/*------------------------------------------------*/
	.search-box{
		position: relative;
	}
		.search-box i{
			position: absolute;
			left: .15rem;
			font-size: .2rem;
			color: darkgrey;
			top: .15rem;
		}
		.search-box input{
			outline: none;
			border: .02rem solid #eaeaea;
			padding-left: .5rem;
			padding-right: .2rem;
			width: 100%;
			font-size: .2rem;
			line-height: .4rem;
			transition: .5s;
			border-radius: .5rem;
			color: darkgrey;
			background: white;
		}
		.search-box input:focus{
			color: #2c3e50;
		}
	.search-header{
		margin: .3rem 0;
		color: #6d757a;
	}
		.search-header h1{
			font-weight: normal;
			font-size: .2rem;
			padding: .1rem;
			border: .01rem dashed #ddd;
		}
	.search-results{
		min-height: 5rem;
	}
	.search-404{
		text-align: left;
		border: .01rem solid #eaeaea;
		padding: .2rem;
	}
		.search-404 h3{
			color: #6d757a;
			margin: .1rem 0;
		}
		.search-404 ul{
			list-style-type: decimal;
			padding-left: .3rem;
		}
		.search-404 li{
			padding: .1rem 0;
		}
		.search-404 a:hover{
			color: #FF7D7D;
		}



	/*下面使用commentModule样式*/
	.waiting{
		margin: 1rem auto;
		text-align: center;
		height: .35rem;
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

	/*使用homepage样式覆盖*/
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

	/*下面使用Homepage样式*/
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
