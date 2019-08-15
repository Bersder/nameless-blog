<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" style="background-image: url('http://127.0.0.1:80/static/img/10.jpg')"></div>
				<div class="page-info">
					<h2 class="intro">{{tag404|headerIntro($route.params.tag)}}</h2>
					<p class="tsukkomi">{{tag404|headerTsukkomi($route.params.tag,curList.length)}}</p>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="page-content">
				<div class="tag-cloud tl">
					<h2>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{this.tagExpand|expandStatus}}</a></h2>
					<ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
						<li class="tag" v-for="(item,key,index) in tagDict" :key="index" @click="tagClick(key)"><a href="javascript:void(0);" :title="item+' 相关'">{{key}}</a></li>
					</ul>
				</div>
				<div class="tag-query-result tl" v-if="!tag404">
					<h2 v-if="!$route.params.tag">随机推荐</h2>
					<ul>
						<li v-for="item in curList" :key="item.id+item.type">
							<span class="item-type">{{item.type_cn}}</span>
							<span class="item-name">
								<router-link :to="item.type|toUrl(item.id)" class="item-link">{{item.title}}</router-link><span class="item-tag" v-for="tag in item.tags"><a href="javascript:void(0);" @click="tagClick(tag)">{{tag}}</a></span>
							</span>
							<span class="item-date">{{item.time.substr(0,10)}}</span>
						</li>
					</ul>
				</div>
				<div class="not-find" v-if="tag404" >
					<h1>糟糕！这里什么也没有</h1>
					<p><router-link to="/">← 返回首页</router-link> · <router-link to="/archive">前往归档 →</router-link></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
	import {mapState} from 'vuex'
	export default {
        name: "Tag",
		created(){
			if(this.$route.params.tag){ //直接进入/tags/xxx的情况，一次性获取list和tag
				fetch('/apis/apiv5.php',{tag:this.$route.params.tag,init:''}).then(response=>{
					let data = response.data.data;
					this.artList = data.artInfos;
					this.noteList = data.noteInfos;
					this.typeEN2CN(this.artList);
					this.typeEN2CN(this.noteList);
					data.tags.forEach(e=>{
						this.$set(this.tagDict,e.tagName,e.relateArt.split(',').length + e.relateNote.split(',').length - 4)
					});
					if ((!this.isMobile&&Object.keys(this.tagDict).length>30)||(Object.keys(this.tagDict).length>12&& this.isMobile)) this.manyTags = true;
					if(response.data.exist<1)this.tag404 = true;
					else{
						let relateArts = data.tagRelate.relateArt.split(',');
						let relateNotes = data.tagRelate.relateNote.split(',');
						relateArts.shift();relateArts.pop();
						relateNotes.shift();relateNotes.pop();
						this.curListPush(relateArts,0);
						this.curListPush(relateNotes,1);
					}
				})
			}
			else {
				fetch('/apis/apiv5.php').then(response=>{
					console.log(response.data.data);
					let data = response.data.data;
					this.artList = data.artInfos;
					this.noteList = data.noteInfos;
					this.typeEN2CN(this.artList);
					this.typeEN2CN(this.noteList);
					data.tags.forEach(e=>{
						this.$set(this.tagDict,e.tagName,e.relateArt.split(',').length + e.relateNote.split(',').length - 4)
					});
					if ((!this.isMobile&&Object.keys(this.tagDict).length>30)||(Object.keys(this.tagDict).length>12&& this.isMobile)) this.manyTags = true;
					this.typeEN2CN(data.rand);
					data.rand.forEach(e=>{
						this.curList.push(e)
					})
				})

			}

		},
		data(){
        	return {
				tag404:false,
				artList:[],
				noteList:[],
				curList:[],
				tagDict:{},
				manyTags:false,
				tagExpand:false
			}
		},
		computed:{
			...mapState(['isMobile'])
		},
		methods:{
        	tagClick(tag){
        		if(tag!==this.$route.params.tag){
					this.$router.replace('/tags/'+tag);
        			fetch('/apis/apiv5.php',{tag:tag}).then(response=>{
        				this.tag404 = response.data.exist<1;
        				let data = response.data.data;
						let relateArts = data.tagRelate.relateArt.split(',');
						let relateNotes = data.tagRelate.relateNote.split(',');
						relateArts.shift();relateArts.pop();
						relateNotes.shift();relateNotes.pop();
						this.curList.length = 0;
						this.curListPush(relateArts,0);
						this.curListPush(relateNotes,1);

					})
				}
			},
			typeEN2CN(list){
        		list.forEach(e=>{ //可以为不同的类型设置不同的颜色
        			if(e.type==='note')this.$set(e,'type_cn','笔记');
        			else if(e.type==='anime')this.$set(e,'type_cn','二次元');
        			else this.$set(e,'type_cn',e.type==='code'?'极客':'游民');
					this.$set(e,'tags',e.tags?e.tags.split(','):[]);
				});
			},
			curListPush(idList,flag){
        		if (flag)
        			idList.forEach(e1=>{
						this.noteList.forEach(e2=>{if(e1===e2.id)this.curList.push(e2)})
					});
        		else
        			idList.forEach(e1=>{
        				this.artList.forEach(e2=>{if(e1===e2.id)this.curList.push(e2)})
					});
			}
		},
		filters:{
        	toUrl(type,id){
        		return type==='note'?'/note/'+id:'/archive/'+type+'/'+id
			},
			expandStatus(e){
				return e?'-':'+'
			},
			headerIntro(flag,tag){
				if(tag) return flag?'没有找到':'包含标签 “'+tag+'" 的条目';
				else return '标签'
			},
			headerTsukkomi(flag,tag,num){
				if (tag) return flag?'没有找到当然是NaN啦':'找到 '+num+' 个';
				else return '';
			}
		}
	}
</script>

<style scoped>
		/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: snow;
	}
	.pattern-full-width{ /*使用Code组件覆盖*/
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
	/*-----------------------------------------------*/
	/*-------------------------------------------借用Archive样式*/
		.tag-cloud h2{
			margin: .2rem 0 .1rem 0;
		}
		.tag-cloud .roll-toggle{
			display: inline-block;
			text-align: center;
			vertical-align: middle;
			background: #eaeaea;
			padding: .05rem 0;
			width: .22rem;
			font-size: .12rem;
			line-height: .12rem;
			border-radius: .03rem;
			transition: all .5s cubic-bezier(.25,.46,.45,.94);
		}
		.tag-cloud .roll-toggle:hover{
			color: white;
			background: rgba(0,0,0,.8);
		}
		.tag-list{
			list-style-type: none;
			overflow: hidden;
			max-height: 1rem;
			transition: 1s;
		}
		.tag-list.more{
			max-height: 10rem;
		}
		.tag-list .tag{
			display: inline-block;
			padding: 0 .08rem;
			margin-right: .05rem;
			margin-bottom: .1rem;
			border: .02rem solid rgba(0,0,0,.1);
			border-radius: 1rem;
			font-size: .14rem;
			line-height: .2rem;
			transition: .5s cubic-bezier(.25,.46,.45,.94);
		}
		.tag-list .tag a{
			color: #6d757a;
		}
		.tag-list .tag:hover a{
			color: white;
		}
		.tag-list .tag:hover{
			border-color: rgba(0,0,0,.5);
			background: rgba(0,0,0,.5);
		}
	/*--------------------------------------------------------*/

	.tag-query-result{
		margin: .2rem 0;
		min-height: 2rem;
	}
	.tag-query-result ul{
		list-style-type: none;
	}
	/*----------------------------------------------借用Note样式*/
		#mobile-app .category-list-item,.tag-query-result ul li{
			margin: 0 .1rem !important;
		}
		.category-list .category-list-item,.tag-query-result ul li{
			margin: 0 .5rem;
			padding: .1rem 0;
			line-height: .2rem;
			border-bottom: .01rem dotted #eaeaea;
			animation: mini-fadeInDown 1s cubic-bezier(.25,.46,.45,.94) forwards;
		}
		.category-list-item .item-num,.tag-query-result ul li .item-type{
			display: inline-block;
			vertical-align: top;
			font-size: .14rem;
			margin-right: .05rem;
			padding:  0 .05rem;
			border-radius: .1rem;
			border: .01rem solid #9dd9ff;
			line-height: .18rem;
			user-select: none;
			color: #00a1d6;
		}
		.category-list-item .item-name,.tag-query-result ul li .item-name{
			display: inline-block;
			max-width: 60%;

		}
		.item-name .item-link{
			font-size: .16rem;
			margin-right: .1rem;
			transition: .5s;
		}
		.item-name .item-tag{
			display: inline-block;
			font-size: .12rem;
			background: #eaeaea;
			padding: 0 .05rem;
			line-height: .18rem;
			vertical-align: top;
			border-radius: .1rem;
			margin-right: .05rem;
		}

		.item-name .item-link:hover{
			color: #00a1d6;
		}
		.category-list-item .item-date,.tag-query-result ul li .item-date{
			font-size: .12rem;
			float: right;
			color: #888888;
		}
	/*-------------------------------------------------------*/

	.not-find{
		height: 3rem;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
		.not-find  h1{
			font-size: .3rem;
			margin-bottom: .3rem;
		}
		.not-find a{
			color: #888888;
		}
@media screen and (max-width: 1005px){/*使用Code组件覆盖*/
	.page-img{
		height: 3rem;
	}
	.page-info .intro{
		font-size: .3rem;
	}
}
</style>
