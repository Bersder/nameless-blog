<template>
	<div class="panel">
		<div class="panel-img">
			<router-link :to="article.aid" append>
				<img class="img" v-lazyload="[`/root${article.imgSrc}`,`/root${article.imgSrc}.thumb`]">
			</router-link>
		</div>
		<div class="panel-info">
			<h2 class="title"><router-link class="title" :to="article.aid" append>{{article.title}}</router-link></h2>
			<p class="preview">{{article.preview}}</p>
			<p class="cut-line" style="margin: .1rem 0"></p>
			<div class="meta">
				<router-link to="/about" class="author"><i class="iconfont icon-geren"></i>{{article.author}}</router-link>
				<span class="time"><i class="iconfont icon-time"></i>{{article.time.substr(0,10)|ymd2Mdy}}</span>
				<span class="hit"><i class="iconfont icon-fire"></i>{{article.readCount}}</span>
				<router-link :to="article.aid+'#comments'" append class="comments"><i class="iconfont icon-comment"></i>{{article.commentCount}}</router-link>
			</div>
			<router-link class="to-article" :to="article.aid" append></router-link>
		</div>
	</div>
</template>

<script>
	export default {
        name: "BasePanel",
        data() {
            return {
			}
        },
        filters:{
        	ymd2Mdy(data){
				let ymd = data.split('-');
				return ['','Jan ','Feb ','Mar ','Apr ','May ','Jun ','Jul ','Aug ','Sep ','Oct ','Nov ','Dec '][parseInt(ymd[1])] + ymd[2] + ', ' + ymd[0]
			}
		},
        props:['article']
    }
</script>

<style>
</style>
