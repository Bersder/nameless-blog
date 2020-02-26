<template>
	<div class="content-aside">
		<div class="ca album">
			<div class="album-img-wrap">
				<img class="album-img" @click="openLB" :src="'/root'+firstImg">
				<p>{{firstDes}}</p>
			</div>
		</div>
		<div class="ca bgmw">
			<div class="bgmw-head"><router-link to="/bangumi">正在追番 | Bangumi</router-link></div>
			<div class="loading-content h-p5" v-if="loading"></div>
			<ul class="bgmw-content" v-else-if="bgms.length">
				<li v-for="(item,index) in bgms" :num="index+1" :title="`${item.curNum} / ${item.epsNum}`">
					<div class="bgm-process-bar" :style="{width:`${item.curNum/item.epsNum*100}%`}"></div>
					<span><a :href="item.link" target="_blank">{{item.nameCN}}</a></span>
				</li>
			</ul>
			<p class="no-content fz-14" v-else>没有在追的番w(ﾟДﾟ)w</p>
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
</template>

<script>
import contentAsideMixin from "../mixins/Mixin-ContentAside";
export default {
	name: "AnimeAside",
	mixins:[contentAsideMixin],
	data(){
		return{
			loading:true,
			bgms:[]
		}
	},
	created() {
		this.$fetch('/apis/apiv8p1.php',{_:'anime'}).then(res=>{
			let data = res.data.data;
			this.loading = false;
			if (data.album.length){
				this.$store.commit('lumiBox/imgsC',data.album);
				this.firstImg = data.album[0].imgSrc;
				this.firstDes = data.album[0].description;
			}
			data.bgms.forEach(e=>this.bgms.push(e));
			if (data.dynamic)
				this.dynamic = data.dynamic;
			this.dynamic.content = this.markIt(this.dynamic.content);
		})
	}
}
</script>

<style>
</style>
