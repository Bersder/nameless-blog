<template>
    <div>
		<figure class="htbg" id="htbg" :style="{height:(SH || screenHeight)+'px',backgroundImage:'url('+bgInfo.imgSrc+')'}">
			<div class="focusinfo no-select">
				<div class="ht-title">OSHINO-NYA</div>
				<div class="ht-info">
					<p style="line-height: .3rem">谢谢你，那个一直努力到了现在的自己</p>
					<div class="social-box">
						<i class="iconfont icon-chevronleft"></i>
						<a href="https://github.com/Bersder" target="_blank" title="github">
							<img width="20" height="20" src="/root/site/static/github.png">
						</a>
						<a href="https://music.163.com/user/home?id=93044810" target="_blank" title="netease">
							<img width="20" height="20" src="/root/site/static/netease.png">
						</a>
						<a href="https://space.bilibili.com/13351138" target="_blank" title="bilibili">
							<img width="20" height="20" src="/root/site/static/bilibili.png">
						</a>
						<a href="https://twitter.com/Bersder1" target="_blank" title="twitter">
							<img width="20" height="20" src="/root/site/static/twitter.png">
						</a>
						<i class="iconfont icon-chevronright"></i>
					</div>
				</div>

			</div>
		</figure>
		<div class="htbg-info">
			<div class="author-avatar pl" :style="{backgroundImage:'url('+bgInfo.avatar+')'}"></div>
			<a class="work-name" :href="bgInfo.workLink" :title="'作品:'+bgInfo.workName" rel="nofollow" target="_blank">{{bgInfo.workName}}</a>
			<a class="author-name" :href="bgInfo.authorLink" :title="'作者:'+bgInfo.authorName" rel="nofollow" target="_blank">{{bgInfo.authorName}}</a>
		</div>
		<div class="ht-down" @click="go_down"><span><i class="iconfont icon-down"></i></span></div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	import {fetch} from "../util/http";
	export default {
        name: "HeaderTop",
		created(){
        	fetch('/apis/apiv13.php').then(response=>{
				this.bgInfo = response.data;
				setTimeout(()=>this.SH=false,1000)
			})
		},
        data() {
            return {
				SH:'0',
				bgInfo:{
					imgSrc:'',
					workName:'',
					workLink:'',
					authorName:'',
					authorLink:'',
					avatar:''
				},
			}
        },
        computed:{
        	...mapState(['screenHeight'])
		},
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
			padding: .1rem .2rem;
			line-height: .2rem;
			font-size: .2rem;
			font-weight: 600;
			border-radius: .1rem;
		}
			.social-box{
				color: #009ccd;
				margin: .1rem 0;
			}
				.social-box i{
					font-size: .2rem;
					vertical-align: top;
				}
				.social-box a{
					display: inline-block;
					margin: 0 .1rem;
					vertical-align: top;
					height: .2rem;
				}
	.htbg-info{
		position: absolute;
		bottom: .3rem;
		right: .2rem;
		height: .5rem;
		width: 1.3rem;
		padding-right: .05rem;
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
			font-size: .14rem;
			font-weight: 600;
			line-height: .2rem;
			display: inline-block;
			text-align: left;
			max-width: .75rem;
			min-width: .4rem;
			color: #f5f5f0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}.work-name{margin-top: .05rem;}.author-name{margin-bottom: .05rem;}
	.ht-down{
		position: absolute;
		font-size: .35rem;
		bottom: .3rem;
		cursor: pointer;
		color: #f5f5f0;
		z-index: 10;
		left: 50%;
		text-shadow: 0 0 .1rem #e6e6e1;
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
	}
	.focusinfo,.ht-down{
		display: none;
	}
	.header-top:before{
		background: transparent ;
	}

}
</style>
