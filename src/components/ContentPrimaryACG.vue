<template>
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
			<panel v-for="article in curArts" :key="article.aid" :article="article"></panel>
		</div>
		<div class="paging-box" v-if="pageNum>1">
			<ol class="pb-original">
				<li class="prev" @click="curPage--" v-if="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
				<li v-show="curPage>=4" @click="curPage=1">1</li>
				<li v-if="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
				<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
				<li v-if="curPage<=pageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
				<li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
				<li class="next" @click="curPage++" v-if="curPage!==pageNum"><i class="iconfont icon-caretright"></i></li>
			</ol>
			<div class="pb-jump">
				<span>共{{pageNum}}页，跳至</span>
				<input type="text" @keyup.enter="pageJump"><!--指定跳转待开发-->
				页
			</div>
		</div>
		<div class="pager-no-more" v-if="pageNum===curPage&&!artWaiting">已经到达底部啦</div>
	</div>
</template>

<script>
	import BasePanel from '@/components/BasePanel'
    export default {
        name: "ContentPrimaryACG",
		created(){
			this.$fetch('/apis/apiv1.php?',{_:this.type}).then(response=>{
				let data = response.data.data;
				this.artWaiting = false;
				this.noContent = !Boolean(parseInt(data.artNum));
				this.curArts = this.arts[0][1] = data.artsNew;
				this.arts[1][1] = data.artsHot;
				this.pageNum = Math.ceil(parseInt(data.artNum) / 6);
				setTimeout(()=>this.$store.commit('lazyCheck'),100);
			})
		},
        data() {
            return {
            	artWaiting:true,
            	noContent:false,
				pageNum:1,
				curPage:1,
				orderFlag:0,
				arts:{
            		0:{},
					1:{}
				},
				curArts:[]
			}
        },
		watch:{
        	orderFlag(cur,pre){
        		if(this.curPage===1){
					this.curArts = this.arts[cur][1];
					setTimeout(()=>this.$store.commit('lazyCheck'),100);
				}
        		else this.curPage = 1;
			},
			curPage(cur,pre){
        		if(this.arts[this.orderFlag][cur]){
					this.curArts = this.arts[this.orderFlag][cur];
					setTimeout(()=>this.$store.commit('lazyCheck'),100);
				}
        		else{
        			this.curArts = [];
        			this.artWaiting = true;
					this.$fetch('/apis/apiv2.php',{_:this.type,pn:cur,order:this.orderFlag}).then(response=>{
						this.artWaiting = false;
						this.curArts = this.arts[this.orderFlag][cur] = response.data.data.arts;
						setTimeout(()=>this.$store.commit('lazyCheck'),100);
					})
				}
			}
		},
        methods:{
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
			}
		},
        components: {
        	panel:BasePanel
		},
		props:['type']
    }
</script>

<style>
</style>
