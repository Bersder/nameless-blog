<template>
	<div>
		<div class="page-content-wrap">
			<div class="page-content homepage" :class="{hidden:scrollTop<screenHeight/3&&screenWidth>800}">
				<div class="notice fc tl" v-if="notice"><i class="iconfont icon-notify"></i> {{notice}}</div>
				<div class="content-primary-h">
					<div class="topped-area" v-if="!isMobile&&topped.length">
						<p class="description tl"><i class="iconfont icon-anchor"></i> 置顶区</p>
						<div class="topped-list tl">
							<div class="panel-topped" v-for="item in topped" :key="item.aid" :class="{odd:topped.length%2}">
								<router-link :to="item|artUrl">
									<img v-lazyload="[`/root${item.imgSrc}`,`/root${item.imgSrc}.thumb`]">
									<div class="float-preview fc tl">
										<h3 :title="item.title">{{item.title}}</h3>
										{{item.preview}}
									</div>
								</router-link>
							</div>
						</div>
					</div>
					<div class="panel-h-list">
						<p class="description tl"><i class="iconfont icon-torii-gate"></i> 入る</p>
						<div class="panel-h" v-for="each in curArts" :key="each.aid">
							<div class="panel-h-img">
								<router-link :to="each|artUrl">
									<img v-lazyload="[`/root${each.imgSrc}`,`/root${each.imgSrc}.thumb`]">
									<div class="float-preview fc tl">
										{{each.preview}}
									</div>
								</router-link>
							</div>
							<div class="panel-h-info">
								<div class="post-time">
									<p class="pt-ym">{{each.time|ym}}</p>
									<p class="pt-d">{{each.time.substr(8,2)}}</p>
								</div>
								<div class="post-meta tl">
									<span><i class="iconfont icon-hash"></i><router-link :to="'/archive/'+each.type">{{each.type|typeEN2CN}}</router-link></span>
									<span><i class="iconfont icon-comment"></i><router-link :to="'/archive/'+each.type+'/'+each.aid+'#comments'">{{each.commentCount|commentNum}}</router-link></span>
								</div>
								<div class="post-title">
									<p><router-link :to="each|artUrl">{{each.title}}</router-link></p>
								</div>
								<div class="post-read">
									<i class="iconfont icon-fire"></i> {{each.readCount|readNum}}
								</div>
							</div>
						</div>
					</div>
					<div class="pager" @click="loadMore" v-if="!noMore">
						<div class="dec"></div>
						<div class="previous-more">
							<span>Previous</span>
						</div>
					</div>
					<div class="pager-no-more fc" v-else>已经到达底部啦</div>

				</div>
				<homepage-aside/>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {mapState} from 'vuex'
	import HomepageAside from './HomepageAside';
	import panelHMixin from	"../mixins/Mixin-PanelH";

	export default {
        name: "Homepage",
		components:{
        	HomepageAside
		},
		created(){
        	this.$fetch('/apis/apiv9.php').then(response=>{
        		let data = response.data.data;
        		this.loading = false;
				data.arts.forEach(e=>this.curArts.push(e));
				data.topped.forEach(e=>this.topped.push(e));
				this.notice = data.notice;

			});
			window.scrollTo(0,0);
		},
        data() {
            return {
				loading:true,
            	curArts:[],
				topped:[],
				notice:null,
				waiting:false,
				noMore:false
			}
        },
		computed:{
        	...mapGetters(['xAboveBottom']),
			...mapState(['scrollTop','screenHeight','screenWidth','isMobile'])
		},
		watch:{
        	xAboveBottom(cur){
        		if (cur<650)this.loadMore();
			}
		},
        methods:{
        	loadMore(){
				if (!this.noMore&&!this.loading&&!this.waiting){
					this.waiting = true;
					this.$fetch('/apis/apiv9.php',{offset:this.curArts.length}).then(response=>{
						let tmp = response.data.data.arts;
						this.waiting = false;
						if (tmp.length) tmp.forEach(e=>this.curArts.push(e));
						else this.noMore = true;

					});
				}
			}
		},
		filters:{
			artUrl(art){
        		return '/archive/'+art.type+'/'+art.aid
			},
		},
		mixins:[panelHMixin]
    }
</script>

<style>
</style>
