<template>
    <div>
		<figure class="htbg" id="htbg" :style="{height:(SH || screenHeight)+'px',backgroundImage:'url('+bgInfo.imgSrc+')'}">
			<div class="focusinfo no-select">
				<div class="ht-title">OSHINO-NYA</div>
				<div class="ht-info">
					<p style="line-height: .3rem" class="fc">谢谢你，那个一直努力到了现在的自己</p>
					<div class="social-box">
						<i class="iconfont icon-chevronleft"></i>
						<a v-for="item in socialList" :href="item.href" target="_blank" :title="item.title">
							<img height="20" :src="item.imgSrc">
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
	import UCONF from "../config/user.conf";
	export default {
        name: "HeaderTop",
		created(){
        	let htInfo = this.$store.state.htInfo;
        	if (htInfo){
        		this.bgInfo = htInfo;
        		this.SH = false;
        		return;
			}
        	this.$fetch('/apis/apiv13.php').then(response=>{
				this.bgInfo = response.data;
				this.$store.commit('htInfoC',this.bgInfo);
				this.$nextTick(()=>this.SH=false);
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
				socialList:UCONF.socialList
			}
        },
        computed:{
        	...mapState(['screenHeight'])
		},
		methods:{
        	go_down:function () {
				document.getElementsByClassName('page-content-wrap')[0].scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest"
				})
			}
		}
    }
</script>

<style>
</style>
