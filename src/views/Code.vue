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
				<pc-acg type="code"></pc-acg>
				<div class="content-aside">
					<div class="ca language">
						<ul :style="{width:langNum*100+'%','margin-left':ulLeft*100+'%'}">
							<li class="language-img-wrap" v-for="each in languageList">
								<img :src="each.imgSrc" width="280" height="410">
								<p>{{each.description}}</p>
							</li>
						</ul>
						<span class="lprev" style="left: 0"><i class="iconfont icon-chevronleft" @click="ulLeft=ulLeft==0?1-langNum:ulLeft+1"></i></span>
						<span class="lnext" style="right: 0"><i class="iconfont icon-chevronright" @click="ulLeft=ulLeft==1-langNum?0:ulLeft-1"></i></span>
					</div>
					<div class="ca series tl" v-if="seriesList.length" style="min-height: 1rem;">
						<div class="series-head">
							<i class="iconfont icon-paperclip"></i> 现存系列
						</div>
						<div class="series-content">
							<p v-for="series in seriesList"><router-link :to="'/series/'+series.name" :title="series.name+' | '+series.count+'篇'">{{series.name}}</router-link><span> ({{series.count}}篇)</span></p>
						</div>
					</div>
					<div class="ca board">
						<div class="board-head">
							<span>Error　</span><i class="iconfont icon-story clearm ibold"></i>
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
	import {languageList} from "../util/USER_VAR";
	import {contentAsideMixin} from "../util/global";
	import {mapState} from 'vuex'
	import {fetch} from "../util/http";

	export default {
        name: "Code",
		created(){
			fetch('/apis/apiv8.php',{_:'code'}).then(response=>{
				let data = response.data.data;
				console.log(data);
				this.headerInfo = data.headerInfo;
				if (!this.isMobile){
					if (data.gossip)
						this.gossip = data.gossip;
					data.seriesList.forEach(e=>this.seriesList.push(e));
				}
			})
		},
        data() {
            return {
            	ulLeft:0,
				languageList:languageList,
				langNum:languageList.length,
				seriesList:[],
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'极客',description:''}

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
