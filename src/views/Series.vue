<template>
    <div>
		<div class="page-content-wrap">
			<div class="page-content series fc">
				<div class="content-primary-ser">
					<div class="ser-list-m" v-show="isMobile">
						<h4>所有系列</h4>
						<router-link :to="item.serName|seriesUrl" v-for="item in serList" :data-count="item.count" :key="item.serName" :class="{cur:serInfo.serName===item.serName}">{{item.serName}}</router-link>
					</div>
					<div class="waiting" v-show="serWaiting">
						<div class="rect1"></div>
						<div class="rect2"></div>
						<div class="rect3"></div>
						<div class="rect4"></div>
						<div class="rect5"></div>
					</div>
					<div class="ser-header" v-show="!serWaiting">
						<div class="ser-h-left">
							<i class="iconfont icon-book clearm"></i>
							<span>系列</span>
						</div>
						<div class="ser-h-right">
							<h2 class="ser-title">{{serInfo.serName}}</h2>
							<p class="ser-des">{{serInfo.serDes}}</p>
						</div>
					</div>
					<div class="ser-art-list" v-show="!serWaiting">
						<section class="ser-art-list-item" v-show="item.show" v-for="item in serArts" :key="item.id">
							<div class="meta">
								<h3><router-link :to="item|artUrl">{{item.title}}</router-link></h3>
								<span>{{item.time|postTimeCN}}<router-link :to="item|commentUrl">{{item.commentCount|commentNum}}</router-link></span>
								<p>{{item.preview}}</p>
							</div>
						</section>
					</div>
				</div>
				<div class="content-aside-ser">
					<div class="ser-tag-list">
						<h4>标签集</h4>
						<ul>
							<li @click="tagFilter('')">••••••</li>
							<li v-for="item in serTags" @click="tagFilter(item)" :class="{cur:item===curTag}">{{item}}</li>
						</ul>
					</div>
					<div class="ser-list">
						<h4>所有系列</h4>
						<ul>
							<li v-for="item in serList"><router-link :to="item.serName|seriesUrl" :class="{cur:serInfo.serName===item.serName}">{{item.serName}}</router-link><span>({{item.count}}篇)</span></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {unique} from "../utils/lib";
	import {mapState} from 'vuex';
	import UCONF from '../config/user.conf';
	const siteTitle = UCONF.siteTitle;
    export default {
        name: "Series",
		data(){
        	return{
				serWaiting:true,
				serInfo:{serName:'',serDes:''},
				serArts:[],
				serTags:[],
				serList:[],
				curTag:''
			}
		},
		created() {
			this.fetchSer({serName:this.$route.params.serName},true)
		},
		watch:{
        	$route(cur,pre){
				this.serTags.length = this.serArts.length = 0;
				this.curTag = '';
				this.serWaiting = true;
				this.fetchSer({serName:cur.params.serName},false)
			}
		},
		computed:{
			...mapState(['isMobile'])
		},
		methods:{
			fetchSer(params,init){
				let params_ = init?{init:'',...params}:params;
				this.$fetch('/apis/apiv14.php',params_).then(response=>{
					let data = response.data.data;
					this.serInfo = data.serInfo || {serName:'系列不存在',serDes:'×××××××××××××××××××××'};
					document.title = '系列：' + this.serInfo.serName + siteTitle.title_;
					let tags = [];
					data.serArts.forEach(e=>{
						tags = tags.concat(e.tags.split(',').filter(e=>e));
						e.show = true;
						e.tags = e.tags.split(',').filter(e=>e);
						this.serArts.push(e);
					});
					this.serWaiting = false;
					this.serTags = unique(tags);
					data.serList.forEach(e=>this.serList.push(e));
					//console.log(data);
				})
			},
			tagFilter(tag){
				if (this.curTag!==tag){
					if (tag)
						this.serArts.forEach(e=>e.show = e.tags.indexOf(tag)>-1);
					else
						this.serArts.forEach(e=>e.show = true);
					this.curTag = tag;
				}
			}
		},
		filters:{
			artUrl(item){
				return '/archive/'+item.type+'/'+item.id
			},
			postTimeCN(datetime){
				let ymd = datetime.substr(0,10).split('-');
				return ymd[0] + '年' + ymd[1] + '月' + ymd[2] + '日'
			},
			commentUrl(item){
				return '/archive/'+item.type+'/'+item.id + '#comments';
			},
			commentNum(count){
				return count>0?count+' 评论':'No Comment';
			},
			seriesUrl(serName){
				return '/series/'+serName;
			}
		}
	}
</script>

<style>
</style>
