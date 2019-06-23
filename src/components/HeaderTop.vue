<template>
    <div>
		<figure class="htbg" id="htbg" :style="{height:screenHeight+'px','background-image':'url('+bgUrl+')'}">
			<div class="focusinfo no-select">
				<div class="ht-title">
					Bersder3000
				</div>
				<div class="ht-info">
					<p>Mind is a terrible thing</p>
					<div class="social-box">
						<i class="fas fa-chevron-left fa-lg"></i>
						<a href="https://github.com/Bersder" target="_blank" title="github">
							<img width="20" height="20" src="https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.9/img/Sakura/images/sns/github.png">
						</a>
						<a href="https://github.com/Bersder" target="_blank" title="github">
							<img width="20" height="20" src="https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.9/img/Sakura/images/sns/github.png">
						</a>
						<a href="https://github.com/Bersder" target="_blank" title="github">
							<img width="20" height="20" src="https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.9/img/Sakura/images/sns/github.png">
						</a>
						<a href="https://github.com/Bersder" target="_blank" title="github">
							<img width="20" height="20" src="https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.9/img/Sakura/images/sns/github.png">
						</a>
						<a href="https://github.com/Bersder" target="_blank" title="github">
							<img width="20" height="20" src="https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.9/img/Sakura/images/sns/github.png">
						</a>
						<i class="fas fa-chevron-right fa-lg"></i>
					</div>
				</div>

			</div>
		</figure>
		<div class="htbg-info">
			<div class="author-avatar pl" style="background-image: url('http://127.0.0.1:80/static/img/2.jpg')"></div>
			<div class="work-name" style="font-style: italic">
				<a href="https://www.pixiv.net/member_illust.php?mode=medium&illust_id=51166367" title="作品名" rel="nofollow" target="_blank">佐田ゆう</a>
			</div>
			<div class="author-name">
				<a href="https://www.pixiv.net/member_illust.php?mode=medium&illust_id=51166367" title="作者" rel="nofollow" target="_blank">Satom</a>
			</div>
		</div>
		<div class="ht-down" @click="go_down">
			<span>
				<i class="fas fa-sort-down fa-3x"></i>
			</span>
		</div>
	</div>
</template>

<script>
	import {media} from "../util/global";

	export default {
        name: "",
        data() {
            return {
				screenHeight:0,
				bgUrl:'http://127.0.0.1:80/static/img/2.jpg'
			}
        },
        mounted() {
        	let me = this;
        	setTimeout(()=>me.screenHeight=window.innerHeight || document.documentElement.clientHeight,500);
        	media.$on('screenHeightC',function (data) {
        		me.screenHeight = data;
			});
        },
        components: {},
		methods:{
        	go_down:function () {
				document.getElementsByClassName('site-wrapper')[0].scrollIntoView({behavior: "smooth",
					block: "start",
					inline: "nearest"})
			}
		}
    }
</script>

<style scoped>
	.htbg{
		position: relative;
		width: 100%;
		height: 0;
		background: no-repeat center center fixed;
		background-size: cover;
		overflow: hidden;
		transition: 1s;
	}

	.focusinfo{
		position: relative;
		max-width: 8rem;
		padding: 0 .1rem;
		top: 48%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 99;
		color: #f5f5f0;
	}
		.ht-title{
			font-size: .7rem;
			font-family: "Comic Sans MS",sans-serif;
		}
		.ht-info{
			max-width: 5rem;
			margin: .2rem auto 0;
			background: rgba(0,0,0,.4);
			padding: .1rem .15rem;
			line-height: .2rem;
			border-radius: .1rem;
		}
			.social-box{
				color: #009ccd;
			}
				.social-box a{
					position: relative;
					top: .04rem;
					display: inline-block;
					margin: .07rem;
					height: .2rem;
				}
	.htbg-info{
		position: absolute;
		bottom: .4rem;
		right: .2rem;
		height: .5rem;
		max-width: 1.3rem;
		padding-right: .1rem;
		background: rgba(25,25,25,.3);
		border-radius: .03rem;
		z-index: 10;
	}
		.htbg-info .author-avatar{
			display: inline-block;
			width: .4rem;
			height: .4rem;
			border-radius: 100%;
			background-size: 100%;
			margin: .05rem;
		}
		.work-name,.author-name{
			float: left;
			font-size: .15rem;
			width: .7rem;
			line-height: .15rem;
			margin-top: .06rem;
		}
		.htbg-info a{
			display: inline-block;
			text-align: left;
			width: .7rem;
			color: #f5f5f0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	.ht-down{
		position: absolute;
		bottom: .5rem;
		cursor: pointer;
		color: #f5f5f0;
		z-index: 10;
		left: 50%;
		text-shadow: 0 0 .02rem #e6e6e1;
		animation: floating 1s infinite alternate;
	}
	@keyframes floating {
		from{transform: translateY(0) scaleX(2) translateX(-50%);}
		to{transform: translateY(.1rem) scaleX(2) translateX(-50%);}
	}
@media screen and (max-width: 800px) {
	.htbg{
		height: 2.5rem !important;
		background-attachment: scroll;
		margin-top: .5rem;
	}
	.focusinfo,.ht-down{
		display: none;
	}
	.header-top:before{
		background: transparent ;
	}

}
</style>
