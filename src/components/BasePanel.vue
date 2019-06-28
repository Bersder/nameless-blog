<template><!--接收article格式{aid:'111',type:'类型',title:'标题',preview:'文章概括',imgSrc:'背景链接',author:'作者',time:'时间',commentCount:评论数}-->
	<div class="panel">
		<div class="panel-img">
			<router-link :to="article.aid" append>
				<div class="img lazy" :style="{'background-image':'url(http://localhost:80'+article.imgSrc+')'}"></div>
			</router-link>
		</div>
		<div class="panel-info">
			<h2 class="title"><router-link class="title" :to="article.aid" append>{{article.title}}</router-link></h2>
			<p class="preview">{{article.preview}}</p>
			<p class="cut-line" style="margin: .1rem 0"></p>
			<div class="meta">
				<router-link to="/个人主页" class="author"><i class="fas fa-user"></i>{{article.author}}</router-link>
				<span class="time"><i class="far fa-clock"></i> {{article.time}}</span>
				<router-link to="评论区" class="comments"><i class="far fa-comments"></i> {{article.commentCount}}</router-link>
			</div>
			<router-link class="to-article" :to="article.aid" append></router-link>
		</div>
	</div>
</template>

<script>
    export default {
        name: "BasePanel",
        data() {
            return {
			}
        },
        mounted() {
        },
        props:['article']
    }
</script>

<style scoped>
	.to-article{
		display: none;
	}
	.panel{
		box-shadow: .01rem .01rem .03rem .01rem rgba(0,0,0,.3);
		border-radius: .1rem;
		margin-bottom: .25rem;
		background: rgba(255,255,255,.8);
		overflow: hidden;
		transition: .4s;
	}
	.panel-img{
		overflow: hidden;
		border-top-right-radius: .1rem;
		border-top-left-radius: .1rem;
	}
		.panel-img .img{
			background: no-repeat center center;
			background-size: cover;
			border-top-left-radius: .1rem;
			border-top-right-radius: .1rem;
			transition: .4s;
		}
		.panel:hover .img{
			transform: scale(1.1);
		}
	.panel-info{
		padding: .15rem .25rem .25rem .25rem;
		text-align: left;
		color: #636363;
	}
		.panel-info .title{
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			letter-spacing: .01rem;
			margin-bottom: .1rem;
			color: #636363;
			transition: color .5s;
		}
		.panel-info .title:hover{
			color: #FF7D7D;
		}
		.meta .author,.meta .time,.meta .comments{
			margin-right: .2rem;
			font-size: .14rem;
			color: #98a6ad;
		}
@media screen and (min-width: 800px) {
	.to-article{
		display: block;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
	.panel-img .img{
		height: 3rem;
		transition: .5s ease;
		filter: blur(0);
	}
	.panel:hover .img{
		filter: blur(.03rem);
	}
	.panel-info{
		position: relative;
		height: 3rem;
		margin-top: -3rem;
		padding-top: 1.3rem;
		padding-bottom: 0;
		border-radius: .1rem;
		background: rgba(0,0,0,.2);
		transition: .5s;
		color: white;
	}
	.panel:hover .panel-info{
		background: rgba(0,0,0,.6);
	}
		.panel-info .title{
			color: white;
			text-align: center;
			transition: .5s;
		}
		.panel:hover h2{
			display: block;
			transform: translateY(-.3rem);
			text-shadow: 0 0 .03rem white;
		}
		.panel-info .preview,.panel-info .cut-line,.panel-info .meta{
			opacity: 0;
			transition: all .5s ease-in;
		}
		.panel:hover .preview,.panel:hover .cut-line,.panel:hover .meta{
			opacity: 1;
			transform: translateY(.25rem);
		}
		.meta .author,.meta .time,.meta .comments{
			color: white;
			pointer-events: auto;
		}
}
@media screen and (max-width: 799px){
	.panel-img .img{
		min-height: 1.8rem;
		height: auto;
	}
}
@media screen and (max-width: 600px) {
	.panel-img .img{
		min-height: 2rem;
	}
	.panel-info{
		padding: .15rem;
	}
}@media screen and (max-width: 400px) {
	.panel-img .img{
		min-height: 1.7rem;
	}
}
</style>
