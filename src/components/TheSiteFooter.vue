<template>
	<footer class="site-footer">
			<div class="site-info">
				<div class="foot-banner">
					<h2>ᛟᛊᚺᛁᚾᛟ</h2>
					<p>© 2019-2019</p>
				</div>
				<div class="foot-block1">
					<span>Alive: 233.23.23.23</span>
					<p>· Craft with <a href="https://github.com/Bersder" target="_blank">Bersder</a></p>
					<p><router-link to="/login">· signIn</router-link>&nbsp;&nbsp;&nbsp;<router-link to="/statistics">· statistics</router-link></p>
				</div>
				<div class="foot-block2">
					<span>朝循以始 夜继以终</span>
					<p>· 单身为狗 20 年</p>
					<p><a href="mailto:oshinoNya@outlook.com">· oshinoNya@outlook.com</a></p>
				</div>
				<div class="foot-support">
					<a href="https://www.vultr.com/?ref=7572602" target="_blank" rel="nofollow" >
						<img src="https://cdn.jsdelivr.net/gh/moezx/cdn@3.0.8/img/logo/logo_onwhite.png" height="16" alt="server">
					</a>
					<a href="https://cn.vuejs.org/" target="_blank" rel="nofollow" >
						<img src="../assets/logo.png" height="16" alt="frame">
					</a>
				</div>
			</div>
	</footer>
</template>

<script>
    export default {
        name: "TheSiteFooter",
        data() {
            return {
            	since:1567267200000, //9-1
				now:new Date().getTime()
			}
        },
        mounted() {
			setInterval(()=>this.now=new Date().getTime(),1000)
        },
		filters:{
			lastTime(now){

			}
		}
    }
</script>

<style>
</style>
