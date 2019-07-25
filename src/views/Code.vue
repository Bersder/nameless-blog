<template>
	<div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" style="background-image: url('http://127.0.0.1:80/static/img/7.jpg')"></div>
				<div class="page-info">
					<h2 class="intro">Code</h2>
					<p class="tsukkomi">一天快乐的源泉（伪）</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content acg">
				<pc-acg type="code"></pc-acg>
				<div class="content-aside"><!--侧边栏待开发-->
					<div class="ca language">
						<ul :style="{width:langNum*100+'%','margin-left':ulLeft*100+'%'}">
							<li class="language-img-wrap">
								<img src="http://127.0.0.1:80/static/img/moe.python.jpg" width="280" height="410">
								<p>python是最好的语言</p>
							</li>
							<li class="language-img-wrap">
								<img src="http://127.0.0.1:80/static/img/moe.c.png" width="280" height="410">
								<p>python是最好的语言</p>
							</li>
							<li class="language-img-wrap">
								<img src="http://127.0.0.1:80/static/img/moe.php.jpg" width="280" height="410">
								<p>本站后端支持</p>
							</li>
							<li class="language-img-wrap">
								<img src="http://127.0.0.1:80/static/img/moe.javaScript.jpg" width="280" height="410">
								<p>JavaScript</p>
							</li>
						</ul>
						<span class="lprev" style="left: 0"><i class="fas fa-chevron-left fa-2x" @click="ulLeft=ulLeft==0?1-langNum:ulLeft+1"></i></span>
						<span class="lnext" style="right: 0"><i class="fas fa-chevron-right fa-2x" @click="ulLeft=ulLeft==1-langNum?0:ulLeft-1"></i></span>
					</div>
					<div class="ca series tl">
						<div class="series-head">
							<i class="fas fa-paperclip"></i> 现存系列
						</div>
						<div class="series-content">
							<p><router-link to="/">系列一</router-link><span> (6篇)</span></p>
							<p><router-link to="/">系列一</router-link><span> (6篇)</span></p>
							<p><router-link to="/">系列一</router-link><span> (6篇)</span></p>
						</div>
					</div>
					<div class="ca board">
						<div class="board-head">
							<span>Error　</span>
							<i class="fab fa-first-order-alt"></i>
						</div>
						<div class="board-content">
							异度之刃2有毒，害我天天两点睡
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
	import ContentPrimaryACG from '@/components/ContentPrimaryACG'
    export default {
        name: "Code",
        data() {
            return {
            	ulLeft:0,
				langNum:4
			}
        },
        mounted() {
        },
        components: {
        	'pc-acg':ContentPrimaryACG
		},

    }
</script>

<style scoped>
	.pattern-full-width{
		position: relative;
		width: 100%;
		overflow: hidden;
	}
	.pattern-full-width:before{
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.1);
	}
	.page-img{
		background: no-repeat center center;
		background-size: cover;
		background-origin: border-box;
		width: 100%;
		height: 5rem;
		transition: all .5s;
	}
	.page-info{
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		top: 50%;
		color: white;
		padding: 0 .5rem;
		text-shadow: 0.02rem 0.02rem 0.1rem black;
	}
		.page-info .intro{
			font-size: .4rem;
			margin-bottom: .1rem;
			transition: .5s;
		}
		.page-info .tsukkomi{
			font-size: .2rem;
		}
	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: snow;
	}
	/*-----------------------------------------------*/
	.page-content.acg{
		max-width: 10.5rem;
		overflow: hidden;/*解决子元素浮动撑不开父元素*/
		height: 100%;
		position: relative;
	}

	.content-aside{
		width: 2.8rem;
		margin-top: .5rem;
		float: right;
	}
		.ca{ /*以Game为标准*/
			width: 100%;
			border-radius: .05rem;
			background: rgba(252,250,242,.7);
			box-shadow: 0 0.01rem 0.03rem rgba(26,26,26,.5);
			margin-bottom: .2rem;
		}
		.language{
			overflow: hidden;
			position: relative;
		}
		.language span{
			position: absolute;
			top: 0;
			bottom: 0;
			opacity: 0;
			width: .26rem;
			transition: all .3s;
		}
		.language i{
			position: relative;
			top: 40%;
			margin: 0;
			cursor: pointer;
			transform: scaleY(2);
			padding: .01rem .03rem;
			color: #eaeaea;
			background: black;
		}
		.language span:hover{
			opacity: .4;
		}
			.lprev i{
				border-bottom-right-radius: .03rem;
				border-top-right-radius: .03rem;
			}
			.lnext i{
				border-bottom-left-radius: .03rem;
				border-top-left-radius: .03rem;
			}
		.language ul{
			transition: all .3s;
			list-style-type: none;
		}
			.language-img-wrap{
				position: relative;
				float: left;
			}
				.language-img-wrap p{
					position: absolute;
					bottom: 0;
					padding: .05rem .1rem;
					font-size: .14rem;
					color: #eeeeee;
					width: 100%;
					background: rgba(0,0,0,.4);
				}




		.fexchange-head,.series-head{
			padding: .1rem .1rem 0;
			font-size: .15rem;
		}
		.fexchange-content,.series-content{
			padding: .1rem .1rem .1rem .3rem;
			font-size: .14rem;
		}
			.series-content p:before{
				content: '★';
				color: #edb100;
				margin-right: .05rem;
			}
			.series-content a{
				color: inherit;
			}
			.series-content span{
				color: #afafaf;
			}

		.cah.board,.ca.board { /*以下使用homepage覆盖*/
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
@media screen and (max-width: 1050px) {
	.content-primary{
		float: none;
	}
	.content-aside{
		display: none;
	}
}
@media screen and (max-width: 1005px){
	.page-img{
		height: 3rem;
	}
	.page-info .intro{
		font-size: .3rem;
	}
}
</style>
