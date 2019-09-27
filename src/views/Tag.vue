<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" style="background-image: url('/root/site/header/tag.jpg')"></div>
				<div class="page-info fc">
					<h2 class="intro tag">{{tag404|headerIntro($route.params.tag)}}</h2>
					<p class="tsukkomi tag">{{tag404|headerTsukkomi($route.params.tag,curList.length)}}</p>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="page-content tag fc">
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
	import {mapState} from 'vuex'
	import tagCloudMixin from "../mixins/Mixin-TagCloud";
	import UCONF from "../config/user.conf";
	const siteTitle = UCONF.siteTitle;
	export default {
        name: "Tag",
		created(){
			if(this.$route.params.tag){ //直接进入/tags/xxx的情况，一次性获取list和tag
				document.title = '标签：'+this.$route.params.tag+siteTitle.title_;
				this.$fetch('/apis/apiv5.php',{tag:this.$route.params.tag,init:''}).then(response=>{
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
				document.title = '标签'+siteTitle.title_;
				this.$fetch('/apis/apiv5.php').then(response=>{
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
			}
		},
		computed:{
			...mapState(['isMobile'])
		},
		methods:{
        	tagClick(tag){
        		if(tag!==this.$route.params.tag){
					this.$router.replace('/tags/'+tag);
					document.title = '标签：'+tag+siteTitle.title_;
        			this.$fetch('/apis/apiv5.php',{tag:tag}).then(response=>{
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
			headerIntro(flag,tag){
				if(tag) return flag?'没有找到':'包含标签 “'+tag+'" 的条目';
				else return '标签'
			},
			headerTsukkomi(flag,tag,num){
				if (tag) return flag?'没有找到当然是NaN啦':'找到 '+num+' 个';
				else return '';
			}
		},
		mixins:[tagCloudMixin]
	}
</script>

<style>
</style>
