<template>
    <div>
		<h2 class="album-head">我的相簿</h2>
		<div class="album-content" :class="{empty:!typeCount[curType]}" etext="这里空空如也">
			<div class="tab-list">
				<span class="tab" v-for="(item,key) in typeMap" @click="curType=key" :class="{cur:curType===key}"><span class="name">{{item}}</span><span class="count">{{typeCount[key]}}</span></span>
			</div>
			<div class="waiting" v-show="albumWaiting">
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
					<li class="prev" @click="curPage--" v-if="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
					<li v-show="curPage>=4" @click="curPage=1">1</li>
					<li v-if="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
					<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
					<li v-if="curPage<=curPageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
					<li v-show="curPage<=curPageNum-3" @click="curPage=curPageNum">{{curPageNum}}</li>
					<li class="next" @click="curPage++" v-if="curPage!==curPageNum"><i class="iconfont icon-caretright"></i></li>
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
	import {mapState} from 'vuex'
	export default {
        name: "SpaceAlbumAlbum",
		created(){
        	this.$post('/apis/auth/v8api.php',{token:this.token||window.localStorage.getItem('BB3000_token'),type:this.type}).then(response=>{
				let data = response.data.data;
				let sum = 0;
				for(let i in data.counts){
					this.$set(this.typeCount,i,data.counts[i]);
					sum+=data.counts[i];
				}
				this.$set(this.typeCount, 'all', sum);
				this.curPageNum = Math.ceil(sum/20);
				this.albumWaiting = false;
				this.$store.commit('lumiBox/imgsC',data.pictures);
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
				typeCount:{all:2333,anime:233,game:233,trivial:233},

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
					this.$post('/apis/auth/v8api.php'+query,{token:this.token}).then(response=>{
						let data = response.data.data;
						this.albumWaiting = false;
						this.$store.commit('lumiBox/imgsC',data.pictures);
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
				this.$post('/apis/auth/v8api.php'+query,{token:this.token}).then(response=>{
					let data = response.data.data;
					this.albumWaiting = false;
					console.log(data);
					this.$store.commit('lumiBox/imgsC',data.pictures);
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
					this.$post('/apis/auth/v9api.php?delete='+this.delTarget.id,{token:this.token}).then(response=>{
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
				this.$store.commit('lumiBox/indexC',index);
				this.$store.commit('lumiBox/showC',true);
			},
		},

    }
</script>

<style>
</style>
