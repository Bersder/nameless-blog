<template>
    <div>
		<figure class="htbg" id="htbg" :style="{height:(SH || screenHeight)+'px',backgroundImage:'url('+bgInfo.imgSrc+')'}">
			<div class="focusinfo no-select">
				<div class="ht-title">OSHINO-NYA</div>
				<div class="ht-info">
					<p style="line-height: .3rem" class="fc">谢谢你，那个一直努力到了现在的自己</p>
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
		<div class="htbg-info fc">
			<div class="author-avatar pl" :style="{backgroundImage:'url('+bgInfo.avatar+')'}"></div>
			<a class="work-name" :href="bgInfo.workLink" :title="'作品:'+bgInfo.workName" rel="nofollow" target="_blank">{{bgInfo.workName}}</a>
			<a class="author-name" :href="bgInfo.authorLink" :title="'作者:'+bgInfo.authorName" rel="nofollow" target="_blank">{{bgInfo.authorName}}</a>
		</div>
		<div class="ht-down" @click="go_down"><span><i class="iconfont icon-down"></i></span></div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
        name: "HeaderTop",
		created(){
        	this.$fetch('/apis/apiv13.php').then(response=>{
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

<style>
</style>
