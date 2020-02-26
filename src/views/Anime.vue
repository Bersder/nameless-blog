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
				<AnimeAside v-if="!isMobile"/>
			</div>
		</div>
	</div>
</template>

<script>
	import ContentPrimaryACG from '@/components/ContentPrimaryACG'
	import AnimeAside from './AnimeAside';
	import {mapState} from 'vuex'

	export default {
        name: "Anime",
		created(){
			this.$fetch('/apis/apiv8.php',{_:'anime'}).then(response=>{
				let data = response.data.data;
				this.headerInfo = data.headerInfo;
			})
		},
        data() {
            return {
				headerInfo:{imgSrc:'/static/images/loading.gif',title:'Anime',description:''},
			}
        },
        computed:{
        	...mapState(['isMobile'])
		},
		components: {
			'pc-acg':ContentPrimaryACG,
			AnimeAside
		},
    }
</script>

<style>
</style>
