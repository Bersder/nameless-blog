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
					<p><a href="mailto:B1747322151@outlook.com">· oshinoNya@outlook.com</a></p>
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

<style scoped>
	.site-footer{
		padding: .15rem .2rem;
		width: 100%;
		background: rgba(255,255,255,0.8);
		animation: holdFadeIn 2s linear forwards;
	}
	.site-info{
		width: 5.1rem;
		margin: 0 auto;
		font-size: .14rem;
		color: #6d757a;
		overflow: hidden;
		text-shadow: 0 0 .01rem rgba(0, 0, 0, .3);
	}

	.site-info a:hover{
		color: #00a1d6;
	}
		.site-info .foot-banner{
			float: left;
		}
			.foot-banner h2{
				font-size: .3rem;
				line-height: .35rem;
			}
		.site-info .foot-block1{
			float: left;
			line-height: .2rem;
			text-align: left;
			margin-left: .4rem;
		}
		.site-info .foot-block2{
			float: right;
			line-height: .2rem;
			text-align: left;
			padding-left: .3rem;
			margin-left: .3rem;
			border-left: .01rem dashed;
		}
		.site-info .foot-support{
			clear: both;
			padding-top: .1rem;
		}
			.site-info .foot-support a{
				font-size: 0;
				margin-left: .15rem;
			}

	.technical-support{
		margin-top: .1rem;
	}
		.technical-support a{
			margin: 0 .5rem;
		}
@media screen and (max-width: 550px){
	.site-footer{
		padding: .1rem .2rem;
	}
	.site-info{
		width: auto;
	}
	.site-info .foot-banner{
		margin-left: .2rem;
	}
	.site-info .foot-block1{
		float: right;
		margin-right: .2rem;
		margin-bottom: .1rem;
	}
	.site-info .foot-block2{
		clear: both;
		float: none;
		text-align: center;
		margin-left: 0;
		border-left: none;
		padding-left: 0;
	}
}
</style>
