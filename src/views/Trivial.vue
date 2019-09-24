<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
				<div class="page-info fc">
					<h2 class="intro">{{headerInfo.title}}</h2>
					<p class="tsukkomi">{{headerInfo.description}}</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content acg fc">
				<div class="content-primary">
					<div class="article-order no-select">
						<span>排序</span>
						<ul class="order-list">
							<li :class="{'o-selected':orderFlag===0}" @click="orderFlag=0">按时间</li>
							<li :class="{'o-selected':orderFlag===1}" @click="orderFlag=1">按热度</li>
						</ul>
					</div><!--文章排序待开发-->
					<div class="article-list" etext="如果你看到了这个，说明我在搬砖" :class="{empty:noContent}">
						<div class="waiting" v-show="artWaiting">
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
								<span><i class="iconfont icon-fire"></i>{{art.readCount}}</span>
								<span><router-link :to="art.aid+'#comments'" append class="comments"><i class="iconfont icon-comment"></i>{{art.commentCount}}</router-link></span>
							</div>
						</div>


					</div>
					<div class="paging-box" v-if="pageNum>1">
						<ol class="pb-original">
							<li class="prev" @click="curPage--" v-if="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
							<li v-show="curPage>=4" @click="curPage=1">1</li>
							<li v-show="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
							<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
							<li v-show="curPage<=pageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
							<li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
							<li class="next" @click="curPage++" v-if="curPage!==pageNum"><i class="iconfont icon-caretright"></i></li>
						</ol>
						<div class="pb-jump">
							<span>共{{pageNum}}页，跳至</span>
							<input type="text" @keyup.enter="pageJump">
							页
						</div>
					</div>
					<div class="pager-no-more" v-if="pageNum===curPage&&!artWaiting">已经到达底部啦</div>
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

<style>
</style>
