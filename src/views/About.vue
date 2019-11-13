<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-center page-header">
				<div class="ph-img" :style="'background-image: url(/root'+headerInfo.imgSrc+')'"></div>
				<div class="ph-info-about fc">
					<h1 style="font-weight: 500">关于</h1>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="page-content about fc">
				<div class="content-area">
					<blockquote>
						<p>自分の世界を変えるのは自分。 —— モルガナ</p>
						<p>my name is Van, I'm an artist, a performance artist —— Van·Darkholme</p>
					</blockquote>
					<div class="about-post">
						<h2><span>壹</span>关于我</h2>
						<p>因为单纯的喜欢物语系列和猫，所以起了个 <span><ruby>忍野<rp>(</rp><rt>おしの</rt><rp>)</rp></ruby><ruby>喵<rp>(</rp><rt>ニャ</rt><rp>)</rp></ruby></span> 的名字</p>
						<p>在广州上学的一名普通的独身大学生，与所有普通的独身大学生一样普通，吉良吉影都为我点赞</p>
						<p><del>不幸选择</del>计算机专业的程序猿、ACG爱好者、主机玩家、<span title="FGO&明日方舟">“硕博连读”</span></p>
						<p>不善言辞者，在某些方面的完美主义者</p>
						<p><strong>不是大佬，不是大佬，不是大佬</strong></p>
					</div>
					<div class="about-post">
						<h2><span>貳</span>一些喜好</h2>
						<p>科学爱好者，喜欢了解自己不清楚的科学原理</p>
						<p>茶叶上瘾者，最喜绿茶</p>
						<p>jo厨、物语厨、车万厨</p>
						<p>无音乐不欢，偏向于纯音乐及东方音乐</p>
						<p>游戏方面ARPG、JRPG最爱，另外P5天下第一</p>
						<p>为自己的兴趣瞎折腾，并付出巨大代价</p>
						<p>linux赛高</p>
						<p>··· ···</p>
					</div>
					<div class="about-post">
						<h2><span>叁</span>关于破站</h2>
						<p>能在茫茫网络中找到我这个破站(而且是不利于SEO的这种)，真是缘，妙不可言啊。很高兴你能看到这里</p>
						<p>破站用于记录和分享技术文章、日常琐事、吐槽及一些乱七八糟的东西。主要是为了单纯地记录来防止失忆，随缘扩散</p>
						<p>但可以的话也请考虑下 <router-link to="/links">交换友链</router-link> (py交易)</p>
<!--						<p>推荐使用 <code>Chrome</code> 或 <code>Firefox</code> 以获得最佳体验</p>-->
						<h4>破站黑历史</h4>
						<div class="history">
							<p v-for="item in siteHistory"><time>{{item[0]}}</time><span class="isolate">·</span>{{item[1]}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import UCONF from "../config/user.conf";
	export default {
        name: "About",
		created(){
			this.$fetch('/apis/apiv12.php').then(response=>{
				let data = response.data.data;
				this.headerInfo = data.headerInfo;
			});
			window.scrollTo(0,0);
		},
		data(){
        	return{
				headerInfo:{imgSrc:'/static/images/loading.gif',title:'关于',description:''},
				siteHistory: UCONF.siteHistory
			}
		}
    }
</script>

<style>
</style>
