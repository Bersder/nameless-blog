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
								<router-link to="/archive" class="cell"><p>{{statistics['aCount']}}</p><span>文章</span></router-link>
								<router-link to="/note" class="cell"><p>{{statistics['nCount']}}</p><span>笔记</span></router-link>
								<router-link to="/dynamic" class="cell"><p>{{statistics['dCount']}}</p><span>动态</span></router-link>
							</div>
							<span class="author-avatar"><img alt="author" :src="authorInfo.avatar"></span>
						</div>
					</div>

					<div class="recommend-sub-panel tl">
						<p class="title">推荐所</p>
						<div class="loading-content" v-if="loading"></div>
						<div class="recommend-list" v-else>
							<a v-for="item in recommendations"
							   target="_blank" :title="item.title"
							   :key="item.id" :href="item.url">{{item.title}}</a>
						</div>
					</div>
				</div>

				<div class="right-panel pl">
					<div class="publish-sub-panel">
						<span>目前没卵用的 input</span>
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
						<div class="no-more" v-show="noMore">
							<p>你已经到达了世界的尽头</p>
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
				didObj:{},//记录当前did，如果没有置空
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
        	let did = this.$route.params.id;
			if (did && !/\d+/.test(did)){this.$router.push('/404');return}
        	this.didObj = did?{did:did}:{};
			this.noMore = !!did;
        	this.$fetch('/apis/apiv16.php',this.didObj).then(response=>{
				if (response.data.code < 1) {
					let data = response.data.data;
					did && data.dynamics.length===0 && this.$router.push('/404');
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
			$route(cur){//如果在动态总页和分页间跳转，清空动态重新取数据
				let did = cur.params.id;
				if (did && !/\d+/.test(did)){this.$router.push('/404');return}
				this.didObj = did?{did:did}:{};
				this.noMore = !!did;
				this.waiting = false;
				this.dynamics.length = 0;
				this.$fetch('/apis/apiv16.php',{offset:0,...this.didObj}).then(response=>{
					let tmp = response.data.data.dynamics;
					if (tmp.length) tmp.forEach(e=>this.dynamics.push(e));
					else this.noMore = true;
				});
			},
        	xAboveBottom(cur){
        		if (cur<500)this.loadMore();
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
			...mapGetters(['xAboveBottom']),
		},
		components:{
        	'dynamic-card':DC,
		}
	}
</script>

<style>
</style>
