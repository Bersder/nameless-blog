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
				<pc-acg type="game"></pc-acg>
				<div class="content-aside"><!--侧边栏待开发-->
					<div class="ca album">
						<div class="album-img-wrap">
							<img class="album-img" @click="openLB" :src="'/root'+firstImg">
							<p>{{firstDes}}</p>
						</div>
					</div>
					<div class="ca fexchange tl">
						<div class="fexchange-head">
							<i class="iconfont icon-friends"></i> 好友交换
						</div>
						<div class="fexchange-content">
							<p v-for="each in friendExchange"><i :class="each.icon"> {{each.description}}</i>:{{each.value}}</p>
						</div>
					</div>
					<div class="ca board">
						<div class="board-head">
							<span>游言　</span><i class="iconfont icon-story clearm ibold"></i>
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
	import UCONF from "../config/user.conf";

	export default {
        name: "Game",
		created(){
			this.$fetch('/apis/apiv8.php',{_:'game'}).then(response=>{
				console.log(response.data.data);
				let data = response.data.data;
				this.headerInfo = data.headerInfo;
				if (!this.isMobile){
					this.$store.commit('lbImgsC',data.album);
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
				friendExchange:UCONF.friendExchange,
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'游民',description:''}
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
