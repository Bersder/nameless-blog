<template>
	<div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
				<div class="page-info fc">
					<h2 class="intro">{{headerInfo.title}}</h2>
					<p class="tsukkomi">{{headerInfo.description}}</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content acg fc">
				<pc-acg type="code"></pc-acg>
				<div class="content-aside">
					<div class="ca language">
						<ul :style="{width:langNum*100+'%','margin-left':ulLeft*100+'%'}">
							<li class="language-img-wrap" v-for="each in languageList">
								<img :src="each.imgSrc" width="280" height="410">
								<p>{{each.description}}</p>
							</li>
						</ul>
						<span class="lprev" style="left: 0"><i class="iconfont icon-chevronleft" @click="ulLeft=ulLeft==0?1-langNum:ulLeft+1"></i></span>
						<span class="lnext" style="right: 0"><i class="iconfont icon-chevronright" @click="ulLeft=ulLeft==1-langNum?0:ulLeft-1"></i></span>
					</div>
					<div class="ca series tl" v-if="seriesList.length" style="min-height: 1rem;">
						<div class="series-head">
							<i class="iconfont icon-paperclip"></i> 现存系列
						</div>
						<div class="series-content">
							<p v-for="series in seriesList"><router-link :to="'/series/'+series.name" :title="series.name+' | '+series.count+'篇'">{{series.name}}</router-link><span> ({{series.count}}篇)</span></p>
						</div>
					</div>
					<div class="ca board">
						<div class="board-head">
							<span>Error　</span><i class="iconfont icon-story clearm ibold"></i>
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
	import {languageList} from "../util/USER_VAR";
	import {contentAsideMixin} from "../util/global";
	import {mapState} from 'vuex'
	import {fetch} from "../util/http";

	export default {
        name: "Code",
		created(){
			fetch('/apis/apiv8.php',{_:'code'}).then(response=>{
				let data = response.data.data;
				console.log(data);
				this.headerInfo = data.headerInfo;
				if (!this.isMobile){
					if (data.gossip)
						this.gossip = data.gossip;
					data.seriesList.forEach(e=>this.seriesList.push(e));
				}
			})
		},
        data() {
            return {
            	ulLeft:0,
				languageList:languageList,
				langNum:languageList.length,
				seriesList:[],
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'极客',description:''}

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
		.cah,.ca{ /*请使用Homepage*/
			width: 100%;
			border-radius: .05rem;
			background: rgba(252,250,242,.7);
			box-shadow: 0 0.02rem 0.05rem rgba(0,0,0,.3);
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
			transition: all .3s;
		}
		.language i{
			position: relative;
			top: 40%;
			margin: 0;
			cursor: pointer;
			transform: scaleY(2.5);
			font-size: .24rem;
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
			.series-content p{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.series-content a:hover{
				color: #00a1d6;
			}
			.series-content p:before{
				content: '★';
				color: #edb100;
				margin-right: .05rem;
			}
			.series-content span{
				color: #afafaf;
			}

		.cah.board,.ca.board { /*以下使用homepage覆盖*/
			min-height: 1.1rem;
			position: relative;
		}
		.board-head{
			position: absolute;
			top: .15rem;
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
@media screen and (max-width: 800px) {
	.page-img{
		height: 2.5rem;
	}
}
</style>
