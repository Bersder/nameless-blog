<template>
    <div>
		<div class="page-content-wrap">
			<div class="page-content bangumi">
				<div class="content-primary-b">
					<h1 class="bgm-title">番组</h1><span class="bgm-des">致现在、永远年轻的我</span>
					<div class="bgm-body">
						<h2>在看<span>{{wingNum}}部</span></h2>
						<div class="bgm-collections">
							<div class="bgm-item" v-for="item in watching">
								<div class="bgm-item-pic" :style="{backgroundImage:'url('+item.cover+')'}"></div>
								<div class="bgm-item-info">
									<span class="bgm-item-title raw"><a :href="item.link" target="_blank">{{item.name}}</a></span>
									<span class="bgm-item-title" :title="item.nameCN">{{item.nameCN}}</span>
									<div class="bgm-item-status-wrap">
										<div class="bgm-item-status" :style="{width:item.curNum/item.epsNum*100 +'%'}"></div>
										{{item|progress}}
									</div>
								</div>
							</div>
						</div>
						<div class="pager" v-if="watching.length<wingNum" @click="loadMore('watching')" >
							<div class="dec"></div>
							<div class="previous-more"><span>More</span></div>
						</div>
						<h2>已看<span>{{wedNum}}部</span></h2>
						<div class="bgm-collections">
							<div class="bgm-item" v-for="item in watched">
								<div class="bgm-item-pic" :style="{backgroundImage:'url('+item.cover+')'}"></div>
								<div class="bgm-item-info">
									<span class="bgm-item-title raw"><a :href="item.link" target="_blank">{{item.name}}</a></span>
									<span class="bgm-item-title" :title="item.nameCN">{{item.nameCN}}</span>
								</div>
							</div>
						</div>
						<div class="pager" v-if="watched.length<wedNum" @click="loadMore('watched')" >
							<div class="dec"></div>
							<div class="previous-more"><span>More</span></div>
						</div>
					</div>
					<comment id_="1" type="bgm" unique="1bgm"></comment>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import CommentModule from "@/components/CommentModule";
    export default {
        name: "Bangumi",
		data(){
        	return{
				watching:[],
				watched:[],
				wingNum:0,
				wedNum:0,
			}
		},
		created() {
        	this.$fetch('/apis/apiv15.php').then(response=>{
        		let data = response.data.data;
        		this.wingNum = data.wingNum;
        		this.wedNum = data.wedNum;
        		data.watching.forEach(e=>this.watching.push(e));
				data.watched.forEach(e => this.watched.push(e));
			})
		},
		methods:{
        	loadMore(type){
        		let isWatching = type==='watching';
        		let offset = isWatching?this.watching.length:this.watched.length;
				this.$fetch('/apis/apiv15.php',{type:type,offset:offset}).then(response=>{
					let data = response.data.data;
					if (isWatching){
						data.watching.forEach(e=>this.watching.push(e));
					}
					else{
						data.watched.forEach(e=>this.watched.push(e));
					}
				})
			}
		},
		filters:{
        	progress(item){
				return '进度：' + item.curNum + '/' + item.epsNum
			}
		},
		components:{
			comment:CommentModule
		},
	}
</script>

<style>
	.page-content.bangumi{
		max-width: 8.6rem;
	}
	.content-primary-b{
		padding: 1rem 0 .5rem 0;
	}
	.bgm-title{
		display: inline-block;
		padding-right: .1rem;
		border-right: #ddd dashed .01rem;
		font-weight: normal;
	}
	.bgm-des{
		padding-left: .1rem;
		color: #a1a1a1;
	}
	.bgm-body h2{
		text-align: left;
		margin-top: .3rem;
		margin-bottom: .2rem;
	}
	.bgm-body h2 span{
		font-size: .14rem;
		color: #b8c0cc;
		padding-left: .1rem;
		margin-left: .1rem;
		border-left: .01rem solid #eaeaea;
	}
	.bgm-collections{
		min-height: 3.5rem;
		text-align: left;
	}
	.bgm-item{
		display: inline-block;
		width: calc(25% - .15rem);
		margin: 0 0 .15rem .15rem;
		box-shadow: 0 0 .06rem rgba(0,0,0,0.2);
		transition: .3s ease;
		background: white;
	}
	.bgm-item:hover{
		box-shadow: 0 .06rem .12rem rgba(0,0,0,0.2);
	}
		.bgm-item-pic{
			width: 100%;
			padding-top: 120%;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}
		.bgm-item-info{
			text-align: center;
			padding: .08rem;
		}
			.bgm-item-title{
				display: block;
				max-width: 100%;
				font-size: .18rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				line-height: .3rem;
			}
			.bgm-item-title:not(.raw){
				font-size: .16rem;
				color: #a1a1a1;
				line-height: 1;
			}
			.bgm-item-status-wrap{
				position: relative;
				height: .3rem;
				line-height: .3rem;
				background: #eaeaea;
				margin: .05rem 0;
				z-index: 0;
			}
				.bgm-item-status{
					position: absolute;
					height: 100%;
					left: 0;
					top: 0;
					background: #5abebc;
					z-index: -1;
				}
@media screen and (max-width: 750px){
	.bgm-item{
		width: calc(33.33333333% - .15rem);
	}
}
@media screen and (max-width: 450px){
	.bgm-collections{
		margin-left: -.1rem;
		width: calc(100% + .1rem);
	}
	.bgm-item{
		width: calc(50% - .1rem);
		margin: 0 0 .1rem .1rem;
	}
	.bgm-item-title{
		font-size: .16rem;
		line-height: .24rem;
	}
	.bgm-item-title:not(.raw){
		font-size: .14rem;
	}
}
</style>
