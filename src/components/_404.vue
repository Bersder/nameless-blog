<template>
    <div class="not-find-404" :style="{height:screenHeight+'px'}">
		<div class="container-404">
			<h2>... 404 NOT FIND ...</h2>
			<section>
			</section>
			<router-link to="/">· 返回主页 ·</router-link>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
    export default {
        name: "NotFind404",
		computed:{
			...mapState(['screenHeight'])
		},
	}
</script>

<style>
</style>
