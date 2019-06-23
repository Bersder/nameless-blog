<template>
	<div class="site-footer">
		<div class="site-info center">
			<p><span>Crafted with <i class="fas fa-hand-spock"></i> by Bersder</span></p>
			<p>Copyright ©2008-2018 Bersder All rights reserved</p>
		</div>
		<div class="technical-support center">
			<a href="https://www.vultr.com/?ref=7572602" target="_blank" rel="nofollow" alt="Service provider">
				<img src="https://cdn.jsdelivr.net/gh/moezx/cdn@3.0.8/img/logo/logo_onwhite.png" style="width: 78px;height: 16px">
			</a>
			<a href="https://cn.vuejs.org/" target="_blank" rel="nofollow" alt="Js frame">
				<img src="../assets/logo.png" style="width: 16px;height: 16px">
			</a>
		</div>
	</div>
</template>

<script>
    export default {
        name: "TheSiteFooter",
        data() {
            return {}
        },
        mounted() {
        },
        components: {}
    }
</script>

<style scoped>
	.site-footer{
		padding: 2%;
		width: 100%;
		margin: 0 auto;
	}
	.site-info{
		color: #6d757a;
	}
	.technical-support{
		margin-top: 1rem;
	}
		.technical-support a{
			margin: 0 .5rem;
		}

</style>
