<template>
	<div>
		<div class="page-content-wrap">
			<div class="page-content homepage" :class="{hidden:scrollTop<screenHeight/3&&screenWidth>800}">
				<div class="notice fc tl" v-if="notice"><i class="iconfont icon-notify"></i> {{notice}}</div>
				<div class="content-primary-h">
					<div class="topped-area" v-if="!isMobile">
						<p class="description tl"><i class="iconfont icon-anchor"></i> 置顶区</p>
						<div class="topped-list tl">
							<div class="panel-topped" v-for="item in topped" :key="item.aid" :class="{odd:topped.length%2}">
								<router-link :to="item|artUrl">
									<img :src="'/root'+item.imgSrc+'.thumb'" class="lazyload" :data-src="'/root'+item.imgSrc">
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
									<img :src="'/root'+each.imgSrc+'.thumb'" class="lazyload" :data-src="'/root'+each.imgSrc">
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
								<div class="post-meta">
									<span><i class="iconfont icon-hash"></i><router-link :to="'/archive/'+each.type"> {{each.type|typeEN2CN}}</router-link></span>
									<span><i class="iconfont icon-comment"></i><router-link :to="'/archive/'+each.type+'/'+each.aid+'#comments'"> {{each.commentCount|commentNum}}</router-link></span>
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
					<div class="pager" @click="loadMore" v-if="curArts.length<artNum">
						<div class="dec"></div>
						<div class="previous-more">
							<span>Previous</span>
						</div>
					</div>
					<div class="pager-no-more fc" v-if="curArts.length>=artNum">没有更多啦( *・ω・)✄╰ひ╯</div>

				</div>
				<div class="content-aside-h fc">
					<div class="cah hit tl">
						<div class="hit-head">
							<span><i class="iconfont icon-fire"></i> 最热</span>
						</div>
						<ul class="hit-content">
							<li :data-text="item.type[0].toUpperCase()" v-for="item in hits" :key="item.aid">
								<div class="rc-item pl">
									<p><router-link :to="item|artUrl">{{item.title}}</router-link></p>
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
	import {mapGetters} from 'vuex'
	import {mapState} from 'vuex'
	import contentAsideMixin from "../mixins/Mixin-ContentAside";
	import panelHMixin from	"../mixins/Mixin-PanelH";

	export default {
        name: "Homepage",
		created(){
        	this.$fetch('/apis/apiv9.php').then(response=>{
        		let data = response.data.data;
        		this.artNum = parseInt(data.artNum);
				data.arts.forEach(e=>this.curArts.push(e));
				data.latestUpdate.forEach(e=>this.latestUpdate.push(e));
				data.hits.forEach(e=>this.hits.push(e));
				data.topped.forEach(e=>this.topped.push(e));
				if (data.gossip)
					this.gossip = data.gossip;
				this.notice = data.notice;
				setTimeout(()=>this.$store.commit('lazyCheck'),100);
			})
		},
        data() {
            return {
            	artNum:0,
            	curArts:[],
				latestUpdate:[],
				hits:[],
				topped:[],
				notice:null

			}
        },
        mounted() {

        },
		computed:{
        	...mapGetters(['reachBottom']),
			...mapState(['scrollTop','screenHeight','screenWidth','isMobile'])
		},
		watch:{
        	reachBottom(cur,pre){
        		if (cur)this.loadMore();
			}
		},
        methods:{
        	loadMore(){
				if (this.curArts.length<this.artNum)
					this.$fetch('/apis/apiv9.php',{more:Math.floor(this.curArts.length/8)}).then(response=>{
						response.data.data.arts.forEach(e=>this.curArts.push(e));
						setTimeout(()=>this.$store.commit('lazyCheck'),100);
					});
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
							else return '数月前'
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
