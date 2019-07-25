<template>
	<div>
		<div class="page-content-wrap">
			<div class="page-content homepage">
				<div class="notice tl"><i class="fas fa-volume-up"></i> 自用笔记公开，基于个人记忆及思维习惯写成，有不同程度的省略和变形，仅供参考</div>
				<div class="content-primary-h">
					<div class="topped-area">
						<p class="description tl"><i class="fas fa-anchor"></i> 置顶区</p>
						<!--暂时不开发-->
					</div>
					<div class="panel-h-list">
						<p class="description tl"><i class="fas fa-torii-gate"></i> 入る</p>
						<div class="panel-h">
							<div class="panel-h-img">
								<router-link to="/">
									<img src="http://127.0.0.1:80/static/img/2.jpg">
									<div class="float-preview tl">
										真正开始传奇鱼的垂钓，最好将剧情推到第三章更换营地以后更加方便，因为解锁传奇鱼地图和鱼饵的位置还是相对偏
									</div>
								</router-link>
							</div>
							<div class="panel-h-info">
								<div class="post-time">
									<p class="pt-ym">2018. 18</p>
									<p class="pt-d">18</p>
								</div>
								<div class="post-meta">
									<span><i class="fas fa-hashtag"></i> 关键字</span>
									<span><i class="far fa-comments"></i>666 评论</span>
								</div>
								<div class="post-title">
									<p><router-link to="/">Roude镇枪店的秘密</router-link></p>
								</div>
							</div>
						</div>
					</div>
					<div class="pager">
						<div class="dec"></div>
						<div class="previous-more">
							<span>Previous</span>
						</div>
					</div>

				</div>
				<div class="content-aside-h">
					<div class="cah random tl">
						<div class="random-head">
							<i class="fas fa-random"></i>随便看看
						</div>
						<ul class="random-content">
							<li data-text="A">
								<div class="rc-item pl">
									<p><router-link to="/">文章一文章一文章一文章一文章一文章一文章一文章一</router-link></p>
									<span>666 阅读</span>
								</div>
							</li>
						</ul>
					</div>
					<div class="cah update tl">
						<div class="update-head">
							<i class="far fa-file-alt"> 最近更新</i>
						</div>
						<ul class="update-content">
							<li><router-link to="/">Python 从零开始爬虫(七)——实战：网易云音乐评论爬取（附加密算法）</router-link></li>
							<li><router-link to="/">文章二</router-link></li>
							<li><router-link to="/">文章三</router-link></li>
						</ul>
					</div>
					<div class="cah board">
						<div class="board-head">
							<span>雑談　</span>
							<i class="fab fa-first-order-alt"></i>
						</div>
						<div class="board-content">
							迷上柏大辅的歌了，打码听他的后摇真的带劲
						</div>
						<div class="board-post-time">
							-- Dec 12th, 23:33
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: "",
        data() {
            return {}
        },
        mounted() {
        },
        components: {}
    }
</script>

<style scoped>
	.description{
		margin: .2rem 0;
		padding-bottom: .1rem;
		border-bottom: .01rem dashed #eaeaea;
	}
	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: snow;
	}
	/*-----------------------------------------------*/


	.page-content.homepage{
		max-width: 9.3rem;
		overflow: hidden;/*解决子元素浮动撑不开父元素*/
		height: 100%;
	}
	.page-focus{
		padding: .3rem;
		position: relative;
		font-size: .2rem;
		margin:  .2rem 0;
	}
	.content-primary-h{
		max-width: 6rem;
		margin: 0 auto;
		float: left;
		transition: .1s;
	}
	.panel-h{
		width: 100%;
		height: 2rem;
		margin-bottom: .2rem;
		border-radius: .03rem;
		background: rgba(252,250,242,.7);
		box-shadow: 0 .02rem .05rem rgba(0,0,0,.3);
		transition: all .5s ease-in-out;
	}
	.panel-h-img{
		width: 50%;
		height: 100%;
		overflow: hidden;
	}
	.panel-h:nth-child(odd) .panel-h-img{
		float: right;
		border-top-right-radius: .03rem;
		border-bottom-right-radius: .03rem;
	}
	.panel-h:nth-child(even) .panel-h-img{
		float: left;
		border-top-left-radius: .03rem;
		border-bottom-left-radius: .03rem;
	}
	.panel-h-img a{
		position: relative;
		display: block;
		height: 100%;
	}
	.panel-h-img img{
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;
		transition: opacity .5s;
	}
	.panel-h:hover img{
		opacity: .9;
	}
	.panel-h-img .float-preview{
		position: relative;
		height: .9rem;
		bottom: 0;
		font-size: .14rem;
		text-indent: .2rem;
		overflow: hidden;
		padding: .1rem .15rem;
		color: #f5f5f0;
		background: rgba(0,0,0,.5);
		transition: bottom .5s ease-in-out;
	}
	.panel-h:hover .float-preview{
		bottom: .9rem;
	}
	.panel-h-info{
		position: relative;
		display: inline-block;
		width: 50%;
		float: right;/*??*/
	}
	.panel-h:nth-child(odd) .post-time{
		float: left;
		margin-top: .15rem;
		margin-left: .2rem;
	}
	.panel-h:nth-child(even) .post-time{
		float: right;
		margin-top: .15rem;
		margin-right: .2rem;
	}
	.pt-ym{
		padding-bottom: .1rem;
	}
	.pt-d{
		font-family: "Comic Sans MS",sans-serif;
		font-size: .55rem;
		font-style: italic;
		line-height: .3rem;
	}
	.post-meta{
		transform: rotate(90deg);
		transform-origin: left top;
		display: inline-block;
		position: absolute;
		top: .15rem;
		right: -1.75rem;
		font-size: .13rem;
		font-weight: 300;
		width: 1.8rem;
		color: #c5ccd3;
	}
	.panel-h:nth-child(even) .post-meta{
		left: .22rem;
	}
	.post-meta span{
		margin-right: .1rem;
	}
	.post-title{
		writing-mode: vertical-rl;
		float: right;
		margin: .15rem .4rem 0 0;
		height: 1.7rem;
		font-size: .17rem;
		text-align: left;
	}
	.panel-h:nth-child(even) .post-title{
		float: left;
		margin: .15rem 0 0 .4rem;
	}
	.post-title p{
		letter-spacing: .005rem;
		text-transform: uppercase;
		text-shadow: 0 0 .02rem rgba(0,0,0,.4);
	}
	.post-title p:first-letter{
		font-size: .25rem;
		padding-bottom: .03rem;
		margin-top: -.04rem;
	}
	.post-title a{
		color: #425066;
	}


	.pager{
		position: relative;
		height: .4rem;
		width: 1.2rem;
		margin: .2rem auto 0;
		cursor: pointer;
	}
		.previous-more{
			position: relative;
			color: #00a1d6;
			text-shadow: 0 .01rem .01rem #00a1d6;
			line-height: .4rem;
			background: rgba(255,255,255,.8);
			transition: all	.25s ease;
		}
		.pager:hover .previous-more{
			color: snow;
			text-shadow: 0 .01rem .01rem snow;
			transform: translate(.02rem,.02rem);
		}
			.previous-more span{
				position: relative;
				z-index: 2;
			}

			.previous-more:before{
				content: '';
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				background: rgba(135, 186, 237, 0.8);
				height: 100%;
				width: 0;
				transition: .25s ease-out;
			}
			.pager:hover .previous-more:before{
				width: 100%;
			}
		.pager .dec{
			position: absolute;
			height: .4rem;
			width: 1.2rem;
			top: .05rem;
			left: .05rem;
			border: .02rem solid pink;
			transition: .25s ease-out;
		}
		.pager:hover .dec{
			border-color: #00a1d6;
			transform: translate(.02rem,.02rem);
		}






	.content-aside-h{
		width: 2.8rem;
		float: right;
	}
	.cah{
		width: 100%;
		border-radius: .05rem;
		background: rgba(252,250,242,.7);
		box-shadow: 0 .01rem .03rem rgba(26,26,26,.5);
		margin-bottom: .2rem;
	}
	.cah.random{
		height: 100%;
		overflow: hidden;
		position: relative;
	}
	.cah.board,.ca.board {
		height: 1.1rem;
		position: relative;
	}
	.board-head{
		position: absolute;
		top: .2rem;
		left: 0;
		writing-mode: vertical-rl;
		padding-right: .1rem;
		border-right: .01rem dashed #c5ccd3;
	}
	.board-content{
		height: 70%;
		width: 100%;
		font-size: .14rem;
		letter-spacing: .003rem;
		line-height: .18rem;
		text-align: left;
		text-indent: .2rem;
		padding: .22rem .1rem 0 .55rem;
		color: #425066;
	}
	.board-post-time{
		position: absolute;
		right: .15rem;
		bottom: .15rem;
		color: #c5ccd3;
		font-size: .12rem;
	}
	.update-head,.random-head{
		padding: .1rem .1rem 0;
	}
	.update-content,.random-content{
		padding: .1rem .1rem .1rem .3rem;
		font-size: .14rem;
		list-style-type: none;
	}
		.update-content li:before{
			content: '❁';
			color: #ff6052;
			margin-right: .05rem;
		}
		.update-content a,.random-content a{
			color: inherit;
		}

		.random-content li:before{
			content: attr(data-text);
			font-size: .3rem;
			line-height: .38rem;
			width: .38rem;
			height: .38rem;
			font-family: "Comic Sans MS",sans-serif;
			border-radius: 100%;
			text-indent: .09rem;
			margin-right: .1rem;
			border: .01rem dashed #d5d5d5;
			float: left;
		}
		.random-content span{
			font-size: .12rem;
			color: #bac1c8;
		}
		.random-content li{
			height: 100%;
			overflow: hidden;
			position: relative;
			padding-bottom: .1rem;
		}
		.rc-item{
			width: 1.9rem;
		}
	@media screen and (max-width: 920px){
		.content-primary-h{
			float: none;
		}
		.content-aside-h{
			display: none;
		}
	}
	@media screen and (max-width: 1005px){/*使用Code组件覆盖*/
		.page-img{
			margin-top: .5rem;
			height: 3rem;
		}
		.page-info .intro{
			font-size: .3rem;
		}
	}
	@media screen and (max-width: 500px) {
		.panel-h{ /*如果不行加important*/
			height: 4rem;
			padding: .1rem;
		}
		.panel-h-img{
			height: 50% ;
			width: 100% ;
			border-radius: .03rem;
			box-shadow: 0 0 .05rem rgba(0,0,0,.8);
		}
		.panel-h-info{
			padding-top: .1rem;
			float: none ;
			width: 100% ;
		}
	}
</style>
