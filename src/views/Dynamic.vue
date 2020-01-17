<template>
    <div>
		<div class="page-content-wrap">
			<div class="page-content dynamic">
				<div class="left-panel pl">
					<div class="author-sub-panel">
						<div class="loading-content" v-if="loading"></div>
						<div class="content tl" v-else>
							<div class="author-pic"></div>
							<p class="fzz">
								<router-link to="/about" class="author-namae">忍野喵</router-link>
								<span class="author-status no-select" :style="{background:statusMap[status].color}"><i class="iconfont" :class="statusMap[status].icon"></i>{{statusMap[status].des}}</span>
								<span class="author-sign">我的世界我的世界我的世界我的世界我的世界我的世界界我的世界我的世界</span>
							</p>
							<div class="author-statistics tc">
								<router-link to="/archive" class="cell"><p>233</p><span>文章</span></router-link>
								<router-link to="/note" class="cell"><p>233</p><span>笔记</span></router-link>
								<router-link to="" class="cell"><p>233</p><span>动态</span></router-link>
							</div>
							<span class="author-avatar"><img alt="author" src="http://localhost/uploads/avatar/me.png"></span>
						</div>
					</div>

					<div class="recommend-sub-panel tl">
						<p class="title">推荐所</p>
						<div class="loading-content" v-if="loading"></div>
						<div class="recommend-list" v-else>
							<a target="_blank" href="https://baidu.com">推荐y</a>
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
							<dynamic-card></dynamic-card>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import UCONF from "../config/user.conf";
	import DC from '../components/DynamicCard'
    export default {
        name: "Dynamic",
		data(){
        	return{
        		loading:false,
				status:0,
				statusMap:UCONF.statusMap,
				authorInfo:{},
				recommendations:[],
				danmaku:'',
				dynamics:[]
			}
		},
		async created(){

		},
		methods:{

		},
		components:{
        	'dynamic-card':DC,
		}
	}
</script>

<style>
</style>
