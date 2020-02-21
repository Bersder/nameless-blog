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
				<div class="content-aside-h fc">
					<div class="cah hit tl">
						<div class="hit-head">
							<span><i class="iconfont icon-fire"></i> 最热</span>
						</div>
						<ul class="hit-content">
							<li :data-text="index+1" v-for="(item,index) in hits" :key="item.aid">
								<div class="rc-item">
									<p class="ellipsis"><router-link :title="item.title" :to="item|artUrl">{{item.title}}</router-link></p>
									<span>{{item.type|typeEN2CN}} | {{item.readCount|readNum}} 阅读</span>
								</div>
							</li>
						</ul>
					</div>
					<div class="cah update tl">
						<div class="update-head">
							<span><i class="iconfont icon-file"></i> 最近更新</span>
						</div>
						<ul class="update-content">
							<li v-for="item in latestUpdate" :key="item.aid"><router-link :to="item|artUrl">{{item.title}}</router-link><span> ({{item.lut|updateTime}})</span></li>
						</ul>
					</div>
					<div class="cah board">
						<div class="board-head">
							<span>雑談　</span><i class="iconfont icon-story clearm ibold"></i>
						</div>
						<div class="board-content"
							 :class="{pointer:dynamic.id}"
							 @click="openDyn(dynamic.id)"
							 v-html="dynamic.content"></div>
						<div class="board-post-time">{{dynamic.time|dynTime}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {mapState} from 'vuex'
	import contentAsideMixin from "../mixins/Mixin-ContentAside";
	import panelHMixin from	"../mixins/Mixin-PanelH";

	export default {
        name: "Homepage",
		created(){
        	this.$fetch('/apis/apiv9.php').then(response=>{
        		let data = response.data.data;
				data.arts.forEach(e=>this.curArts.push(e));
				data.latestUpdate.forEach(e=>this.latestUpdate.push(e));
				data.hits.forEach(e=>this.hits.push(e));
				data.topped.forEach(e=>this.topped.push(e));
				if (data.dynamic)
					this.dynamic = data.dynamic;
				this.dynamic.content = this.markIt(this.dynamic.content);
				this.notice = data.notice;

			});
			window.scrollTo(0,0);
		},
        data() {
            return {
            	curArts:[],
				latestUpdate:[],
				hits:[],
				topped:[],
				notice:null,
				waiting:false,
				noMore:false
			}
        },
        mounted() {

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
				if (!this.noMore&&!this.waiting){
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
			updateTime(datetime){
				let gap = new Date().getTime() -  new Date(datetime).getTime();
				if (gap<60000)return '刚刚';
				else{
					let gap_m = Math.floor(gap/60000);
					if (gap_m<60)return gap_m + '分钟前';
					else{
						let gap_h = Math.floor(gap_m/60);
						if (gap_h<24)return gap_h + '小时前';
						else{
							let gap_d = Math.floor(gap_h/24);
							if (gap_d<30)return gap_d + '日前';
							else{
								let gap_mon = Math.floor(gap_d/30);
								if (gap_mon<12)return gap_mon + '月前';
								else return '很久以前';
							}
						}
					}
				}
			}
		},
		mixins:[contentAsideMixin,panelHMixin]
    }
</script>

<style>
</style>
