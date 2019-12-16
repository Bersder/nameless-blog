<template>
    <div>
		<div class="page-content-wrap">
			<div class="page-content bangumi fc">
				<div class="content-primary-b">
					<h1 class="bgm-title">番组</h1><span class="bgm-des">致现在、永远年轻的我</span>
					<div class="bgm-body">
						<h2>在看<span>{{wingNum}}部</span></h2>
						<div class="bgm-collections">
							<div class="bgm-item" v-for="item in watching">
								<div class="bgm-item-pic" :style="{backgroundImage:'url('+item.cover+')'}" :title="item.comment"></div>
								<div class="bgm-item-info">
									<span class="bgm-item-title raw"><a :href="item.link" target="_blank">{{item.name}}</a></span>
									<span class="bgm-item-title" :title="item.nameCN">{{item.nameCN}}</span>
									<div class="bgm-item-status-wrap">
										<div class="bgm-item-status" :style="{width:item.curNum/item.epsNum*100 +'%'}"></div>
										{{item|progress}}
									</div>
								</div>
							</div>
						</div>
						<div class="pager" v-if="watching.length<wingNum" @click="loadMore('watching')" >
							<div class="dec"></div>
							<div class="previous-more"><span>More</span></div>
						</div>
						<h2>已看<span>{{wedNum}}部</span></h2>
						<div class="bgm-collections">
							<div class="bgm-item" v-for="item in watched">
								<div class="bgm-item-pic" :style="{backgroundImage:'url('+item.cover+')'}" :title="item.comment"></div>
								<div class="bgm-item-info">
									<span class="bgm-item-title raw"><a :href="item.link" target="_blank">{{item.name}}</a></span>
									<span class="bgm-item-title" :title="item.nameCN">{{item.nameCN}}</span>
								</div>
							</div>
						</div>
						<div class="pager" v-if="watched.length<wedNum" @click="loadMore('watched')" >
							<div class="dec"></div>
							<div class="previous-more"><span>More</span></div>
						</div>
					</div>
					<comment id_="1" type="bgm" unique="1bgm"></comment>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import CommentModule from "@/components/CommentModule";
    export default {
        name: "Bangumi",
		data(){
        	return{
				watching:[],
				watched:[],
				wingNum:0,
				wedNum:0,
				wingWait:false,
				wedWait:false
			}
		},
		created() {
        	this.$fetch('/apis/apiv15.php').then(response=>{
        		let data = response.data.data;
        		this.wingNum = data.wingNum;
        		this.wedNum = data.wedNum;
        		data.watching.forEach(e=>this.watching.push(e));
				data.watched.forEach(e => this.watched.push(e));
			});
			window.scrollTo(0,0);
		},
		methods:{
        	loadMore(type){
        		let isWatching = type==='watching';
        		if (isWatching&&this.wingWait)return;
        		if (!isWatching&&this.wedWait)return;
        		if (isWatching)this.wingWait = true;
        		else this.wedWait = true;
        		let offset = isWatching?this.watching.length:this.watched.length;
				this.$fetch('/apis/apiv15.php',{type:type,offset:offset}).then(response=>{
					let data = response.data.data;
					if (isWatching){
						this.wingWait = false;
						data.watching.forEach(e=>this.watching.push(e));
					}
					else{
						this.wedWait = false;
						data.watched.forEach(e=>this.watched.push(e));
					}
				})
			}
		},
		filters:{
        	progress(item){
				return '进度：' + item.curNum + '/' + item.epsNum
			}
		},
		components:{
			comment:CommentModule
		},
	}
</script>

<style>
</style>
