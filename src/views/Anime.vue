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
					<div class="ca bgmw" v-if="bgms.length">
						<div class="bgmw-head"><router-link to="/bangumi">正在追番 | Bangumi</router-link></div>
						<ul class="bgmw-content">
							<li v-for="(item,index) in bgms" :num="index+1" :title="item.curNum + '/' + item.epsNum">
								<div class="bgm-process-bar" :style="{width:item.curNum/item.epsNum*100 +'%'}"></div>
								<span><a :href="item.link" target="_blank">{{item.nameCN}}</a></span>
							</li>
						</ul>
					</div>


					<div class="ca board">
						<div class="board-head">
							<span>吐槽　</span><i class="iconfont icon-story clearm ibold"></i>
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
					data.bgms.forEach(e=>this.bgms.push(e));
					if (data.dynamic)
						this.dynamic = data.dynamic;
					this.dynamic.content = this.markIt(this.dynamic.content);
				}
			})
		},
        data() {
            return {
				headerInfo:{imgSrc:'/static/images/loading.gif',title:'Anime',description:''},
				bgms:[]
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
