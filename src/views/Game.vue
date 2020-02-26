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
				<game-aside v-if="!isMobile"/>
			</div>
		</div>
	</div>
</template>

<script>
	import ContentPrimaryACG from '@/components/ContentPrimaryACG'
	import GameAside from './GameAside';
	import {mapState} from 'vuex'

	export default {
        name: "Game",
		created(){
			this.$fetch('/apis/apiv8.php',{_:'game'}).then(response=>{
				let data = response.data.data;
				this.headerInfo = data.headerInfo;
			})
		},
        data() {
            return {
				headerInfo:{imgSrc:'/static/images/loading.gif',title:'游民',description:''}
			}
        },
		computed:{
        	...mapState(['isMobile'])
		},
		components: {
			'pc-acg':ContentPrimaryACG,
			GameAside
		},
    }
</script>

<style>
</style>
