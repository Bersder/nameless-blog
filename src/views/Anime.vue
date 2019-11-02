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
				<pc-acg type="anime"></pc-acg>
				<div class="content-aside"><!--侧边栏待开发-->
					<div class="ca album">
						<div class="album-img-wrap">
							<img class="album-img" @click="openLB" :src="'/root'+firstImg">
							<p>{{firstDes}}</p>
						</div>
					</div>
					<div class="ca broadcast">
						<div class="broadcast-head">
							今天周五 | 正在放送
						</div>
						<ul class="broadcast-content">
							<li><a href="/">罪恶王冠</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">罪恶王冠</a></li>
							<li><a href="/">罪恶王冠</a></li>
						</ul>
					</div>


					<div class="ca board">
						<div class="board-head">
							<span>吐槽　</span><i class="iconfont icon-story clearm ibold"></i>
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
	import ContentPrimaryACG from '@/components/ContentPrimaryACG'
	import contentAsideMixin from "../mixins/Mixin-ContentAside";
	import {mapState} from 'vuex'

	export default {
        name: "Anime",
		created(){
			this.$fetch('/apis/apiv8.php',{_:'anime'}).then(response=>{
				let data = response.data.data;
				this.headerInfo = data.headerInfo;
				if (!this.isMobile){
					this.$store.commit('lumiBox/imgsC',data.album);
					if (data.album.length){
						this.firstImg = data.album[0].imgSrc;
						this.firstDes = data.album[0].description;
					}
					if (data.gossip)
						this.gossip = data.gossip;
				}
			})
		},
        data() {
            return {
				headerInfo:{imgSrc:'/static/images/loading.gif',title:'Anime',description:''}
			}
        },
        computed:{
        	...mapState(['isMobile'])
		},
		components: {
			'pc-acg':ContentPrimaryACG
		},
		mixins:[contentAsideMixin]
    }
</script>

<style>
</style>
