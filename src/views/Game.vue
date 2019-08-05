<template>
	<div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" style="background-image: url('http://127.0.0.1:80/static/img/7.jpg')"></div>
				<div class="page-info">
					<h2 class="intro">Game</h2>
					<p class="tsukkomi">Do You Like Van 游戏</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content acg">
				<pc-acg type="game"></pc-acg>
				<div class="content-aside"><!--侧边栏待开发-->
					<div class="ca album">
						<div class="album-img-wrap">
							<img class="album-img" src="http://127.0.0.1:80/static/img/7.jpg">
							<p>一张图片</p>
						</div>
					</div>
					<div class="ca fexchange tl">
						<div class="fexchange-head">
							<i class="fas fa-user-friends"></i> 好友交换
						</div>
						<div class="fexchange-content">
							<p><i class="fab fa-playstation"> PSN</i>:Bersder3000</p>
							<p><i class="fab fa-nintendo-switch"> NS</i>:SW-1724-8480-2131</p>
							<p><i class="fab fa-steam-symbol"> Steam</i>:Bersder3000</p>
						</div>
					</div>
					<div class="ca board">
						<div class="board-head">
							<span>游言　</span>
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
	import {fetch} from "../util/http";

	export default {
        name: "Game",
		created(){
			fetch('/apis/apiv8.php',{_:'game'}).then(response=>{
				console.log(response.data.data)
			})
		},
        data() {
            return {
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
		top: 40%;
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
		.fexchange-head,.series-head{
			padding: .1rem .1rem 0;
			font-size: .15rem;
		}
		.fexchange-content,.series-content{
			padding: .1rem .1rem .1rem .3rem;
			font-size: .14rem;
		}
			.fexchange-content i{
				width: .6rem;
				color: #2c3e50;
			}
			.fexchange-content p{
				color: #afafaf;
				margin-bottom: .02rem;
			}
		.album{
			overflow: hidden;
		}
			.album-img-wrap{
				position: relative;
				height: 2.8rem;
				width: 2.8rem;
			}
				.album-img{
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center center;
				}
				.album-img-wrap p{
					position: absolute;
					bottom: 0;
					padding: .05rem .1rem;
					font-size: .14rem;
					color: #eeeeee;
					width: 100%;
					background: rgba(0,0,0,.3);
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
