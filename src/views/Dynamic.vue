<template>
    <div style="background-image: url(http://localhost/site/bg/dynamicbg.png)">
		<div class="page-content-wrap">
			<div class="page-content dynamic">
				<div class="left-panel pl">
					<div class="author-sub-panel">
						<div class="loading-content" v-if="loading"></div>
						<div class="content tl" v-else>
							<div class="author-pic"></div>
							<p class="fzz">
								<router-link to="/about" class="author-namae">{{authorInfo.author}}</router-link>
								<span class="author-status no-select" :style="{background:statusMap[status].color}"><i class="iconfont" :class="statusMap[status].icon"></i>{{statusMap[status].des}}</span>
								<span class="author-sign">{{authorInfo.signature}}</span>
							</p>
							<div class="author-statistics tc">
								<router-link to="/archive" class="cell"><p>{{statistics.aCount}}</p><span>文章</span></router-link>
								<router-link to="/note" class="cell"><p>{{statistics.nCount}}</p><span>笔记</span></router-link>
								<router-link to="" class="cell"><p>{{statistics.dCount}}</p><span>动态</span></router-link>
							</div>
							<span class="author-avatar"><img alt="author" :src="authorInfo.avatar"></span>
						</div>
					</div>

					<div class="recommend-sub-panel tl">
						<p class="title">推荐所</p>
						<div class="loading-content" v-if="loading"></div>
						<div class="recommend-list" v-else>
							<a v-for="(item,index) in recommendations" target="_blank" :key="index" :href="item.url">{{item.title}}</a>
						</div>
					</div>
				</div>

				<div class="right-panel pl">
					<div class="publish-sub-panel">
						<span>弹幕发送，测试性功能</span>
						<div class="editor">
							<input v-model="danmaku" type="text" class="danmaku-input" placeholder="弹幕测试！" >
							<div class="danmaku-send no-select">biu~</div>
						</div>
						<div class="toolbar">
						</div>
					</div>
					<div class="main-panel">
						<div class="d-card-list">
							<dynamic-card v-for="item in dynamics" :key="item.id" :ddata="item"></dynamic-card>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';
	import UCONF from "../config/user.conf";
	import DC from '../components/DynamicCard'
    export default {
        name: "Dynamic",
		data(){
        	return{
        		loading:true,//标识初始化加载状态
				status:0,
				statusMap:UCONF.statusMap,
				authorInfo:{},
				statistics:{},
				recommendations:[],
				danmaku:'',

				dynamics:[],
				waiting:false,//标识更多动态加载状态
				noMore:false//标识是否穷尽动态
			}
		},
		created(){
        	this.$fetch('/apis/apiv16.php').then(response=>{
				if (response.data.code < 1) {
					let data = response.data.data;
					this.loading = false;
					this.authorInfo.author = data.author;
					this.authorInfo.avatar = data.avatar;
					this.authorInfo.signature = data.info.sign;
					this.status = data.info.status;
					this.statistics = data.statistics;
					data.recommendations.forEach(e=>this.recommendations.push(e));
					data.dynamics.forEach(e=>this.dynamics.push(e));
				}
			});
		},
		watch:{
        	reachBottom(cur,pre){
        		if (cur) this.loadMore();
			}
		},
		methods:{
			loadMore(){
				if (!this.noMore&&!this.waiting) {
					this.waiting = true;
					this.$fetch('/apis/apiv16.php',{offset:this.dynamics.length}).then(response=>{
						let tmp = response.data.data.dynamics;
						this.waiting = false;
						if (tmp.length) tmp.forEach(e=>this.dynamics.push(e));
						else this.noMore = true;
					})
				}
			}
		},
		computed:{
			...mapGetters(['reachBottom']),
		},
		components:{
        	'dynamic-card':DC,
		}
	}
</script>

<style>
</style>
