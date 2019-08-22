<template>
    <div>
		<h2 class="album-head">我的相簿</h2>
		<div class="album-content" :class="{empty:!albumFound}" etext="这里空空如也">
			<div class="tab-list">
				<span class="tab" v-for="(item,key) in typeMap" @click="curType=key" :class="{cur:curType===key}"><span class="name">{{item}}</span><span class="count">{{typeCount[key]}}</span></span>
			</div>
			<div class="waiting" id="anchor" v-show="albumWaiting">
				<div class="rect1"></div>
				<div class="rect2"></div>
				<div class="rect3"></div>
				<div class="rect4"></div>
				<div class="rect5"></div>
			</div>
			<div class="album-list tl">
				<div class="album-card" v-for="item in curAlbums" :key="item.id">
					<a class="picture" :style="{backgroundImage:'url('+item.imgSrc+')'}"></a>
					<a class="title">{{item.description}}</a>
				</div>
			</div>
			<div class="paging-box" v-if="curPageNum>1">
				<ol class="pb-original">
					<li class="prev" @click="curPage--" v-show="curPage!==1"><i class="fas fa-caret-left"></i></li>
					<li v-show="curPage>=4" @click="curPage=1">1</li>
					<li v-if="curPage>=5" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
					<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
					<li v-if="curPage<=curPageNum-4" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
					<li v-show="curPage<=curPageNum-3" @click="curPage=curPageNum">{{curPageNum}}</li>
					<li class="next" @click="curPage++" v-show="curPage!==curPageNum"><i class="fas fa-caret-right"></i></li>
				</ol>
				<div class="pb-jump">
					<span>共{{curPageNum}}页，跳至</span>
					<input type="text" @keyup.enter="pageJump"><!--指定跳转待开发-->
					页
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {post} from "../util/http";
	import {mapState} from 'vuex'
	export default {
        name: "SpaceAlbumAlbum",
		created(){
        	post('/apis/auth/v8api.php',{token:this.token||window.localStorage.getItem('BB3000_token'),type:this.type}).then(response=>{
				let data = response.data.data;
				let sum = 0;
				for(let i in data.counts){
					this.$set(this.typeCount,i,data.counts[i]);
					sum+=data.counts[i];
				}
				this.$set(this.typeCount, 'all', sum);
				this.curPageNum = Math.ceil(sum/20);
				this.curAlbums = data.pictures;
			}).catch(err=>console.warn(err))
		},
		data(){
        	return{
        		albumFound:true,
				albumWaiting:true,

				curAlbums:[],
				curType:'all',
				curPage:1,
				curPageNum:1,
				typeMap:{all:'所有',anime:'Anime',game:'游民',trivial:'日常'},
				typeCount:{all:0,anime:0,game:0,trivial:0},

			}
		},
		computed:{
			pageList(){
				if(this.curPageNum===1)return [1];
				else if(this.curPageNum===2)return[1,2];
				else if(this.curPageNum===3)return[1,2,3];
				else if(this.curPage===1)return[1,2,3];
				else if(this.curPage===2)return[1,2,3,4];
				else if(this.curPage>=3&&this.curPage<=this.curPageNum-2)return[this.curPage-2,this.curPage-1,this.curPage,this.curPage+1,this.curPage+2];
				else if(this.curPage===this.curPageNum-1)return[this.curPage-2,this.curPage-1,this.curPage,this.curPageNum];
				else return[this.curPage-2,this.curPage-1,this.curPage];
			},
			...mapState({
				token:state=>state.account.token
			})
		},
		watch:{
			curType(cur,pre){
				this.curPageNum = Math.ceil(this.typeCount[cur] / 20);
				if (this.curPage===1){
					let query = '?pn=1&type='+cur;
					post('/apis/auth/v8api.php'+query,{token:this.token}).then(response=>{
						let data = response.data.data;
						this.curAlbums = data.pictures;
					})
				}
				else
					this.curPage = 1;

			},
			curPage(cur,pre){
				let query = '?pn='+cur+'&type='+this.curType;
				post('/apis/auth/v8api.php'+query,{token:this.token}).then(response=>{
					let data = response.data.data;
					console.log(data);
					this.curAlbums = data.pictures;
				})
			}
		},
		methods:{
			pageJump(e){
				let page = parseInt(e.target.value);
				if(isNaN(page)){}
				else this.curPage = page<1?1:(e.target.value>this.curPageNum?this.curPageNum:page);
				e.target.value='';
			},
		}
    }
</script>

<style scoped>
	/*部分使用spaceLaunchDraft样式覆盖*/
	.draft-head,.album-head{
		font-size: .2rem;
		line-height: .4rem;
		font-weight: normal;
		text-align: left;
		border-bottom: .01rem dashed #eaeaea;
	}
	.draft-content,.album-content{
		min-height: 4.5rem;
	}
	.draft-content.empty:after,.album-content.empty:after{
		background-image: url(http://localhost:80/site/images/nodata.png);
		content:attr(etext);
		display: block;
		background-position: center center;
		background-repeat: no-repeat;
		color: #6d757a;
		font-size: .14rem;
		height: 4.5rem;
		overflow: hidden;
		line-height: 6.4rem;
		text-align: center;
	}

	.album-content .tab-list {
		border-radius: .04rem;
		background-color: #edf2fa;
		margin: .1rem 0;
		padding: 0 .2rem;
		line-height: .35rem;
		text-align: left;
	}
		.tab-list .tab{
			margin-right: .2rem;
			font-size: .12rem;
			cursor: pointer;
		}
			.tab-list .tab .name{
				margin-right: .05rem;
				transition: .3s ease;
			}
			.tab-list .tab.cur .name{
				color: #00a1d6;
			}
			.tab-list .tab .count{
				color: #8b8e99;
			}
	.album-list .album-card{
		display: inline-block;
		width: 1.79rem;
		margin: 0 .15rem .15rem 0;
	}
	.album-card:nth-child(5n){margin-right: 0}
		.album-card .picture {
			display: block;
			height: 1.4rem;
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;
			border-radius: .04rem;
			margin-bottom: .05rem;
		}
		.album-card .title {
			display: block;
			font-size: .12rem;
			line-height: .2rem;
			height: .4rem;
			overflow: hidden;
		}
	.album-content .paging-box{
		margin: 0;
	}
/*	下面使用ContentPrimaryACG覆盖*/
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
</style>
