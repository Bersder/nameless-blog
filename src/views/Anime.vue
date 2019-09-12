<template>
	<div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
				<div class="page-info">
					<h2 class="intro">{{headerInfo.title}}</h2>
					<p class="tsukkomi">{{headerInfo.description}}</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content acg">
				<pc-acg type="anime"></pc-acg>
				<div class="content-aside"><!--侧边栏待开发-->
					<div class="ca album">
						<div class="album-img-wrap">
							<img class="album-img" @click="openLB" :src="'/root'+firstImg">
							<p>{{firstDes}}</p>
						</div>
					</div>
					<div class="ca broadcast">
						<div class="broadcast-head">
							今天周五 | 正在放送
						</div>
						<ul class="broadcast-content">
							<li><a href="/">罪恶王冠</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">魔法少女特殊战明日香</a></li>
							<li><a href="/">罪恶王冠</a></li>
							<li><a href="/">罪恶王冠</a></li>
						</ul>
					</div>


					<div class="ca board">
						<div class="board-head">
							<span>吐槽　</span><i class="iconfont icon-story clearm ibold"></i>
						</div>
						<div class="board-content">
							{{gossip.content}}
						</div>
						<div class="board-post-time">
							-- {{gossip.time|gossipTime}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ContentPrimaryACG from '@/components/ContentPrimaryACG'
	import {contentAsideMixin} from "../util/global";
	import {mapState} from 'vuex'
	import {fetch} from "../util/http";

	export default {
        name: "Anime",
		created(){
			fetch('/apis/apiv8.php',{_:'anime'}).then(response=>{
				let data = response.data.data;
				console.log(data);
				this.headerInfo = data.headerInfo;
				if (!this.isMobile){
					this.$store.commit('lbImgsC',data.album);
					if (data.album.length){
						this.firstImg = data.album[0].imgSrc;
						this.firstDes = data.album[0].description;
					}
					if (data.gossip)
						this.gossip = data.gossip;
				}
			})
		},
        data() {
            return {
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'Anime',description:''}
			}
        },
        computed:{
        	...mapState(['isMobile'])
		},
		components: {
			'pc-acg':ContentPrimaryACG
		},
		mixins:[contentAsideMixin]
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
		letter-spacing: .05rem;
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

		.broadcast-head{
			padding: .1rem .1rem 0;
			font-size: .15rem;
			border-bottom: .01rem dashed #dadada;
		}
		.broadcast-content{
			padding: .1rem .15rem;
			font-size: .12rem;
			overflow: hidden;
			list-style-type: none;
		}
			.broadcast-content li{
				float: left;
				margin-right: .05rem;
				margin-bottom: .05rem;
				padding: 0 .05rem;
				border-radius: .1rem;
				background: #eaeaea;
			}

		.cah.board,.ca.board { /*以下使用homepage覆盖*/
			min-height: 1.1rem;
			position: relative;
		}
		.board-head{
			position: absolute;
			top: .2rem;
			left: 0;
			bottom: .2rem;
			writing-mode: vertical-rl;
			border-right: .01rem dashed #c5ccd3;
		}
		.board-head span{
			display: inline-block;
			padding: 0 .1rem;
		}
		.board-content{
			width: 100%;
			font-size: .14rem;
			letter-spacing: .003rem;
			line-height: .18rem;
			text-align: left;
			text-indent: .2rem;
			padding: .22rem .1rem .4rem .55rem;
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
