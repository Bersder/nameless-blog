<template>
	<div class="content-primary">
		<div class="article-order no-select">
			<span>排序</span>
			<ul class="order-list">
				<li :class="{'o-selected':orderFlag===0}" @click="orderFlag=0">按时间</li>
				<li :class="{'o-selected':orderFlag===1}" @click="orderFlag=1">按热度</li>

			</ul>
		</div><!--文章排序待开发-->
		<div class="article-list">

			<panel v-for="(article,index) in curArts" :key="index" :article="article"></panel>
		</div>
		<div class="paging-box">
			<ol class="pb-original">
				<li class="prev" @click="curPage--" v-show="curPage!==1"><i class="fas fa-caret-left"></i></li>
				<li v-show="curPage>=4" @click="curPage=1">1</li>
				<li v-if="curPage>=5" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
				<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
				<li v-if="curPage<=pageNum-4" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
				<li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
				<li class="next" @click="curPage++" v-show="curPage!==pageNum"><i class="fas fa-caret-right"></i></li>
			</ol>
			<div class="pb-jump">
				<span>共{{pageNum}}页，跳至</span>
				<input type="text" @keyup.enter="pageJump"><!--指定跳转待开发-->
				页
			</div>
		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
	let articles = [
		{aid:'1',title:'物语系列时间线',preview:'《物语系列》是由日本轻小说作家西尾维新创作、台湾插画家VOFAN（本名戴源亨）负责插画的轻小说系列',imgSrc:'http://127.0.0.1:80/static/img/2.jpg',commentCount:'567',author:'nyanya',time:'2018-12-12',type:'code'},
		{aid:'2',title:'何西亚之死',preview:'何西亚是个咋骗家，被德奇害死了？',imgSrc:'http://127.0.0.1:80/static/img/4.jpg',commentCount:'234',author:'nyanya',time:'2018-12-1',type:'code'},
		{aid:'2',title:'何西亚之死',preview:'何西亚是个咋骗家，被德奇害死了？',imgSrc:'http://127.0.0.1:80/static/img/4.jpg',commentCount:'234',author:'nyanya',time:'2018-12-1',type:'code'},
		{aid:'2',title:'何西亚之死',preview:'何西亚是个咋骗家，被德奇害死了？',imgSrc:'http://127.0.0.1:80/static/img/4.jpg',commentCount:'234',author:'nyanya',time:'2018-12-1',type:'code'},
		{aid:'2',title:'何西亚之死',preview:'何西亚是个咋骗家，被德奇害死了？',imgSrc:'http://127.0.0.1:80/static/img/4.jpg',commentCount:'234',author:'nyanya',time:'2018-12-1',type:'code'},
		{aid:'2',title:'何西亚之死',preview:'何西亚是个咋骗家，被德奇害死了？',imgSrc:'http://127.0.0.1:80/static/img/4.jpg',commentCount:'234',author:'nyanya',time:'2018-12-1',type:'code'},

	];
	import BasePanel from '@/components/BasePanel'
    export default {
        name: "ContentPrimaryACG",
		created(){
			fetch('/apis/apiv1.php?',{_:this.type[0]}).then(response=>{
				console.log(response.data);
				let data = response.data.data;
				this.curArts = this.arts[0][1] = data.artsNew;
				this.arts[1][1] = data.artsHot;
				this.pageNum = Math.ceil(parseInt(data.artNum) / 6);
				console.log(this.arts)
				//侧边栏初始化
			})
		},
        data() {
            return {
            	articles:articles,
				pageNum:1,
				curPage:1,
				orderFlag:0,
				arts:{
            		0:{},
					1:{}
				},
				curArts:[]
			}
        },
		watch:{
        	orderFlag(cur,pre){
        		if(this.curPage===1)this.curArts = this.arts[cur][1];
        		else this.curPage = 1;
			},
			curPage(cur,pre){
        		if(this.arts[this.orderFlag][cur])this.curArts = this.arts[this.orderFlag][cur];
        		else{
					fetch('/apis/apiv2.php',{_:this.type[0],pn:cur,order:this.orderFlag}).then(response=>{
						this.curArts = this.arts[this.orderFlag][cur] = response.data.data.arts;
					})
				}
			}
		},
        methods:{
			pageJump(e){
				let page = parseInt(e.target.value);
				if(isNaN(page)){}
				else this.curPage = page<1?1:(e.target.value>this.pageNum?this.pageNum:page);
				e.target.value='';
			},
		},
		computed:{
			pageList:function () {
				if(this.pageNum===1)return [1];
				else if(this.pageNum===2)return[1,2];
				else if(this.pageNum===3)return[1,2,3];
				else if(this.curPage===1)return[1,2,3];
				else if(this.curPage===2)return[1,2,3,4];
				else if(this.curPage>=3&&this.curPage<=this.pageNum-2)return[this.curPage-2,this.curPage-1,this.curPage,this.curPage+1,this.curPage+2];
				else if(this.curPage===this.pageNum-1)return[this.curPage-2,this.curPage-1,this.curPage,this.pageNum];
				else return[this.curPage-2,this.curPage-1,this.curPage];
			}
		},
        components: {
        	panel:BasePanel
		},
		props:['type']
    }
</script>

<style scoped>
	.content-primary{
		max-width: 7rem;
		margin: 0 auto;
		float: left;
		transition: .5s;
		width: 100%;
	}
	.article-order{
		margin: .2rem 0;
		height: 100%;
		overflow: hidden;
		border-bottom: .01rem solid #e5e5e5;
	}
	.article-order span{
		font-size: .2rem;
		float: left;
		margin: 0 .2rem;
	}
	.order-list{
		list-style-type: none;
		float: left;
	}
	.order-list li{
		cursor: pointer;
		display: inline-block;
		float: left;
		line-height: .3rem;
		padding: 0 .05rem;
		border-bottom:.01rem solid #e5e5e5;
		transition: .5s;
	}
	.order-list li:hover{
		color: #00a1d6;
		border-color: #00a1d6;
	}
	.o-selected{
		border-color: #00a1d6 !important;
		color: unset !important;
		position: relative;
	}
	.o-selected:before{
		content: "";
		position: absolute;
		left: 50%;
		margin-left: -3px;
		bottom: 0;
		width: 0;
		height: 0;
		border-bottom: 3px solid #00a1d6;
		border-top: 0;
		border-left: 3px dashed transparent;
		border-right: 3px dashed transparent;
	}
	.article-list,.trivial-list{
		clear: both;
	}
	.paging-box{
		margin: .3rem 0;
		text-align: left;/*??*/
	}
	.paging-box .pb-original{
		display: inline-block;
		margin: 0 .2rem;
		border-radius: .05rem;
		list-style-type: none;
	}
	.pb-original li{
		display: block;
		float: left;
		height: .25rem;
		width: .25rem;
		line-height: .25rem;
		color: #009ccd;
		cursor: pointer;
		user-select: none;
		text-align: center;
		transition: background-color.3s;
	}
	.pb-original .ellipses{
		cursor: auto;
	}
	.pb-original li:hover{
		background: #eaeaea;
	}
	.pb-original .prev{
		border-top-left-radius: .05rem;
		border-bottom-left-radius: .05rem;
	}
	.pb-original .next{
		border-top-right-radius: .05rem;
		border-bottom-right-radius: .05rem;
	}
	.pb-original .current{
		background: #009ccd !important;
		color: white;
		text-shadow: 0 0 .04rem white;
		border-radius: .05rem;
	}
	.pb-jump{
		float: right;
		color: #99a2aa;
		line-height: .25rem;
		font-size: .14rem;
		margin-right: .2rem;
	}
	.pb-jump input{
		background: transparent;
		outline: none;
		border: .01rem solid #ddd;
		border-radius: .05rem;
		width: .4rem;
		height: .3rem;
		padding: 0 .07rem;
		color: #6c6c6c;
		text-align: center;
		transition: .3s;
	}
	.pb-jump input:focus{
		border-color: #009ccd;
	}
	@media screen and (max-width: 1050px) {
		.content-primary{
			float: none;
		}
		.content-aside{
			right: -3rem;
		}
	}
</style>
