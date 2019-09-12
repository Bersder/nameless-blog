<template>
    <div>
		<h2 class="album-head">我的相簿</h2>
		<div class="album-content" :class="{empty:!typeCount[curType]}" etext="这里空空如也">
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
				<div class="album-card" v-for="(item,index) in curAlbums" :key="item.id">
					<a class="picture" :style="{backgroundImage:'url(/root'+item.imgSrc+')'}" @click="openLB(index)"><a @click.stop="delPicture(item)" class="iconfont icon-trash clearm"></a></a>
					<a class="title">{{item.description}}</a>
				</div>
			</div>
			<div class="paging-box" v-if="curPageNum>1">
				<ol class="pb-original">
					<li class="prev" @click="curPage--" v-show="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
					<li v-show="curPage>=4" @click="curPage=1">1</li>
					<li v-if="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
					<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
					<li v-if="curPage<=curPageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
					<li v-show="curPage<=curPageNum-3" @click="curPage=curPageNum">{{curPageNum}}</li>
					<li class="next" @click="curPage++" v-show="curPage!==curPageNum"><i class="iconfont icon-caretright"></i></li>
				</ol>
				<div class="pb-jump">
					<span>共{{curPageNum}}页，跳至</span>
					<input type="text" @keyup.enter="pageJump"><!--指定跳转待开发-->
					页
				</div>
			</div>
		</div>
		<div class="popup-panel-container" v-if="popupShow">
			<div class="popup-panel">
				<h3 class="popup-title tl">删除图片</h3>
				<div class="popup-content tl">确定要删除此图片?</div>
				<div class="popup-confirm tc">
					<button class="btn-primary" @click="delConfirm(true)">删除</button><button class="btn-secondary" @click="delConfirm(false)">手抖点错</button>
				</div>
				<a class="popup-cancel" @click="popupShow=false"><i class="iconfont icon-cancel"></i></a>
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
				this.albumWaiting = false;
				this.$store.commit('lbImgsC',data.pictures);
				this.curAlbums = data.pictures;
			}).catch(err=>console.warn(err))
		},
		data(){
        	return{
				albumWaiting:true,
				popupShow:false,
				delTarget:null,

				curAlbums:[],
				curType:'all',
				curPage:1,
				curPageNum:1,
				typeMap:{all:'所有',anime:'Anime',game:'游民',trivial:'日常'},
				typeCount:{all:-1,anime:0,game:0,trivial:0},

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
				if(!this.typeCount[cur])
					this.curAlbums = [];
				else if (this.curPage===1){
					this.curAlbums = [];
					this.albumWaiting = true;
					let query = '?pn=1&type='+cur;
					post('/apis/auth/v8api.php'+query,{token:this.token}).then(response=>{
						let data = response.data.data;
						this.albumWaiting = false;
						this.$store.commit('lbImgsC',data.pictures);
						this.curAlbums = data.pictures;
					})
				}
				else
					this.curPage = 1;

			},
			curPage(cur,pre){
				this.curAlbums = [];
				this.albumWaiting = true;
				let query = '?pn='+cur+'&type='+this.curType;
				post('/apis/auth/v8api.php'+query,{token:this.token}).then(response=>{
					let data = response.data.data;
					this.albumWaiting = false;
					console.log(data);
					this.$store.commit('lbImgsC',data.pictures);
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
			delPicture(item){
				this.delTarget = item; //待删目标
				this.popupShow = true;
			},
			delConfirm(bool){
				if (bool) //确认删除
					post('/apis/auth/v9api.php?delete='+this.delTarget.id,{token:this.token}).then(response=>{
						if (response.data.code < 1) {
							this.popupShow = false;
							location.reload()
						}
						else
							this.$store.commit('infoBox/callInfoBox',{
								info:'图片删除失败',
								ok:false,
								during:2000
							});
					}).catch(err=>console.warn(err));
				else
					this.popupShow = false
			},
			openLB(index){
				this.$store.commit('lbIndexC',index);
				this.$store.commit('lbShowC',true);
			},
		},

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
		background-image: url(/root/site/static/nodata.png);
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
	.album-card{
		display: inline-block;
		width: 1.79rem;
		margin: 0 .15rem .15rem 0;
	}
	.album-card:nth-child(5n){margin-right: 0}
		.album-card .picture {
			display: block;
			position: relative;
			height: 1.4rem;
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;
			border-radius: .04rem;
			margin-bottom: .05rem;
		}
			.album-card .picture a{
				position: absolute;
				bottom: 0;
				right: 0;
				opacity: 0;
				padding: .07rem;
				color: white;
				background: rgba(0,0,0,.4);
				border-radius: .03rem 0 0 0;
				cursor: pointer;
			}
			.album-card .picture:hover a{
				opacity: 1;
			}
			.album-card .picture a:hover{
				background: rgba(0,0,0,.7);
			}
		.album-card .title {
			display: block;
			font-size: .14rem;
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

	/*下面使用SpaceDynamic样式*/
	.popup-panel-container{/*可能与authbox样式合并*/
		position: fixed;
		z-index: 2000;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,.4);
		left: 0;
		top: 0;
	}
	.popup-panel{
		position: relative;
		top: 50%;
		transform: translate(0,-50%);
		margin: 0 auto;
		width: 4.5rem;
		background: white;
		border: .01rem solid #6d757a;
		box-shadow: 0 0 .15rem rgba(0,0,0,.4);
		border-radius: .05rem;
		padding: .2rem;
	}
	.popup-panel .popup-title{
		color: #00a1d6;
	}
	.popup-content{
		font-size: .14rem;
		margin: .1rem 0;
	}
	.popup-confirm button{
		width: 1rem;
		padding: .05rem .1rem;
		font-size: .15rem;
		line-height: .15rem;
		margin: 0 .1rem;
		border-radius: .04rem;
		border: .01rem solid #23ade5;
		transition: .3s ease;
	}
	.popup-confirm button.btn-primary{
		background: #23ade5;
		color: white;
	}
	.popup-confirm button.btn-primary:hover{
		background: #00a1d6;
	}
	.popup-confirm button.btn-secondary{
		color: #23ade5;
	}
	.popup-confirm button.btn-secondary:hover{
		color: white;
		background: #23ade5;
	}
	.popup-cancel{
		position: absolute;
		top: .15rem;
		right: .15rem;
		font-size: .2rem;
		cursor: pointer;
	}
	.popup-cancel:hover{
		color: #00a1d6;
	}

</style>
