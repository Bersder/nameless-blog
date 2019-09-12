<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-center page-header">
				<div class="ph-img" :style="'background-image: url(/root'+headerInfo.imgSrc+')'"></div>
				<div class="ph-info-about">
					<h1 style="font-weight: 500">关于</h1>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="page-content about">
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
						<p><strong>不是大佬，不是大佬，不是大佬</strong></p>
					</div>
					<div class="about-post">
						<h2><span>貳</span>一些喜好</h2>
						<p>科学爱好者，喜欢了解自己不清楚的科学原理</p>
						<p>茶叶上瘾者，特别是绿茶花茶这类的茶</p>
						<p>jo厨、物语厨、车万厨</p>
						<p>无音乐不欢，偏向于纯音乐及东方音乐</p>
						<p>游戏方面ARPG、JRPG最爱，另外P5天下第一</p>
						<p>为自己的兴趣瞎折腾，并付出巨大代价</p>
						<p>linux!!(震声)</p>
						<p>··· ···</p>
					</div>
					<div class="about-post">
						<h2><span>叁</span>关于破站</h2>
						<p>能在茫茫网络中找到我这个破站(而且是不利于SEO的这种)，真是缘，妙不可言啊。很高兴你能看到这里</p>
						<p>破站用于记录技术文章、日常琐事、吐槽及一些乱七八糟的东西。主要是为了单纯地记录，扩散出去什么的随缘了</p>
						<p>可以的话考虑下 <router-link to="/links">交换友链</router-link> (py交易)</p>
<!--						<p>推荐使用 <code>Chrome</code> 或 <code>Firefox</code> 以获得最佳体验</p>-->
						<h4>破站黑历史</h4>
						<div class="history">
							<p><time>????-??-??</time><span class="isolate">·</span>学Vue时用Vue写了一个页面，自认为还不错，加之有建博客的想法，然后一发不可收拾...</p>
							<p><time>????-??-??</time><span class="isolate">·</span>经过3个月的摸爬滚打，初版V0.0博客最终完成，主题无名</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
	export default {
        name: "About",
		created(){
			fetch('/apis/apiv12.php').then(response=>{
				let data = response.data.data;
				this.headerInfo = data.headerInfo;
			})
		},
		data(){
        	return{
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'关于',description:''},
			}
		}
    }
</script>

<style scoped>
	blockquote{
		margin: 0 .05rem .2rem;
		padding: .05rem .2rem;
		background: #F9F9F9;
		position: relative;
		border-radius: .05rem;
		text-align: left;
		border-left: .04rem solid #ddd;
		color: rgba(121, 121, 121, .8);
		font-style: italic;
		line-height: .3rem;
	}
	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.pattern-center{
		position: relative;
		margin: 0 auto;
		overflow: hidden;
		max-width: 8rem;
	}
	.ph-img:before{
		content: '';
		position: absolute;
		top: 1.5rem;
		left: 0;right: 0;bottom: 0;
		border-top-right-radius: .05rem;
		border-top-left-radius: .05rem;
		background-color: rgba(0,0,0,.2);
	}
	.ph-img{
		border-top-right-radius: .05rem;
		border-top-left-radius: .05rem;
		background: no-repeat center center;
		background-size: cover;
		background-origin: border-box;
		width: 100%;
		height: 4rem;
		margin-top: 1.5rem;
		transition: .3s ease;
	}
	.ph-info-about{/*about特有*/
		position: absolute;
		left: 0;
		right: 0;
		color: white;
		bottom: 2rem;
		text-shadow: .02rem .02rem .1rem black;
		transition: .3s ease;
	}
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		/*background: rgba(55,55,55,.5);*/
	}
	.content-area{
		padding: .5rem 0;
		animation: fadeIn 2s ;
		color: #1e1e1e;
	}
	.about-post{
		margin-bottom: .25rem;
		text-align: left;
	}
		.about-post time{
			font-weight: 600;
		}
		.about-post a{
			color: #00a1d6;
		}
		.about-post a:hover{
			color: #5abebc;
		}
		.about-post code{
			background: #b8c0cc30;
			border-radius: .03rem;
			padding: .02rem;
		}
		.about-post del{
			text-decoration: none;
			background: #1e1e1e;
			transition: .3s ease;
		}
		.about-post del:hover{
			color: white;
		}
		.about-post rt{
			background: #b8c0cc30;
		}
		.about-post p{
			margin-bottom: .15rem;
		}
		.about-post h2{
			font-size: .18rem;
			margin-bottom: .1rem;
		}
		.about-post h4{
			border-bottom: .01rem dotted #eaeaea;
			padding-bottom: .05rem;
			margin-bottom: .05rem;
		}
			.about-post h2 span{
				font-size: .22rem;
				padding-right: .05rem;
				margin-right: .05rem;
				border-right: .01rem solid #8b8e99;
			}




	@media screen and (max-width: 800px) { /*请使用article组件覆盖*/
		.ph-img{
			margin-top: .5rem;
			height: 2.5rem;
		}
		.ph-info-about{ /*about特有*/
			bottom: 1rem;
		}
		.ph-img:before{
			top: .5rem;
		}
	}
</style>
