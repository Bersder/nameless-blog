<template>
	<div class="content-aside">
		<div class="ca album">
			<div class="album-img-wrap">
				<img class="album-img" @click="openLB" :src="'/root'+firstImg">
				<p>{{firstDes}}</p>
			</div>
		</div>
		<div class="ca board">
			<div class="board-head">
				<span>日常　</span><i class="iconfont icon-story clearm ibold"></i>
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
	name: "TrivialAside",
	mixins:[contentAsideMixin],
	data(){
		return{
			loading:true,
		}
	},
	created() {
		this.$fetch('/apis/apiv8p1.php',{_:'trivial'}).then(res=>{
			let data = res.data.data;
			this.loading = false;
			if (data.album.length){
				this.$store.commit('lumiBox/imgsC',data.album);
				this.firstImg = data.album[0].imgSrc;
				this.firstDes = data.album[0].description;
			}
			if (data.dynamic)
				this.dynamic = data.dynamic;
			this.dynamic.content = this.markIt(this.dynamic.content);
		})
	}
}
</script>

<style>
</style>
