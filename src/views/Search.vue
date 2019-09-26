<template>
    <div>
		<div class="page-content-wrap">
			<div class="page-content">
				<div class="content-primary-s">
					<div class="search-box">
						<i class="iconfont icon-search" @click="postSearch"></i>
						<input type="search" v-model.trim="searchKey" class="fc" @keyup.enter="postSearch" name="s" placeholder="搜些其他东西?">
					</div>
					<header class="search-header fc">
						<h1>搜索结果：{{$route.params.key}}</h1>
					</header>
					<div class="waiting" v-show="searchWaiting">
						<div class="rect1"></div>
						<div class="rect2"></div>
						<div class="rect3"></div>
						<div class="rect4"></div>
						<div class="rect5"></div>
					</div>
					<div class="search-results" v-if="searchFound">
						<div class="panel-h" v-for="each in curResults" :key="each.id+each.type">
							<div class="panel-h-img">
								<router-link :to="each|artUrl">
									<img :src="'/root'+each.imgSrc+'.thumb'" class="lazyload" :data-src="'/root'+each.imgSrc">
									<div class="float-preview fc tl">
										{{each.preview}}
									</div>
								</router-link>
							</div>
							<div class="panel-h-info">
								<div class="post-time">
									<p class="pt-ym">{{each.time|ym}}</p>
									<p class="pt-d">{{each.time.substr(8,2)}}</p>
								</div>
								<div class="post-meta">
									<span><i class="iconfont icon-hash"></i><router-link :to="each|typeUrl"> {{each.type|typeEN2CN}}</router-link></span>
									<span><i class="iconfont icon-comment"></i><router-link :to="each|commentUrl"> {{each.commentCount|commentNum}}</router-link></span>
								</div>
								<div class="post-title">
									<p><router-link :to="each|artUrl">{{each.title}}</router-link></p>
								</div>
							</div>
						</div>
						<div class="pager" v-if="curResults.length<resultNum" @click="loadMore" >
							<div class="dec"></div>
							<div class="previous-more">
								<span>More</span>
							</div>
						</div>
						<div class="pager-no-more fc" v-if="curResults.length>=resultNum&&!searchWaiting">没有更多啦( *・ω・)✄╰ひ╯</div>
					</div>
					<div class="search-404 fc" v-if="!searchFound">
						<h3>没有找到任何东西！看看其他文章吧</h3>
						<ul>
							<li v-for="each in searchResults" :key="each.id+each.type"><router-link :to="each|artUrl">{{each.title}}</router-link></li>
						</ul>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import panelHMixin from	"../mixins/Mixin-PanelH";
	import UCONF from "../config/user.conf";
	const siteTitle = UCONF.siteTitle;
	export default {
        name: "Search",
		created(){
        	document.title = '搜索：'+this.$route.params.key+siteTitle.title_;
			this.$fetch('/apis/apiv10.php',{s:this.$route.params.key}).then(response=>{
				let data = response.data.data;
				console.log(data);
				this.searchWaiting = false;
				this.searchFound = Boolean(data.found);
				this.searchResults = data.result;
				this.resultNum = data.result.length;
				let pushNum = this.resultNum<8?this.resultNum:8;
				for (let i = 0; i < pushNum; i++) this.curResults.push(this.searchResults[i]);
				setTimeout(()=>this.$store.commit('lazyCheck'),100);
			})
		},
        data() {
            return {
            	searchKey:'',
				searchWaiting:true,
				searchFound:true,
				searchResults:[],
				resultNum:0,
				curResults:[],

			}
        },
		watch:{
        	$route(cur,pre){
        		document.title = '搜索：'+cur.params.key+siteTitle.title_;
				this.curResults.length = this.resultNum = 0;
				this.searchWaiting = true;
				this.searchFound = true;
				this.$fetch('/apis/apiv10.php',{s:cur.params.key}).then(response=>{
					let data = response.data.data;
					this.searchWaiting = false;
					this.searchFound = Boolean(data.found);
					this.searchResults = data.result;
					this.resultNum = data.result.length;
					let pushNum = this.resultNum<8?this.resultNum:8;
					for (let i = 0; i < pushNum; i++) this.curResults.push(this.searchResults[i])
				})
			}
		},
       	methods:{
        	postSearch(){
        		if (this.searchKey){
					if (!this.searchWaiting){
						this.$router.push({name:'search',params:{key:this.searchKey}});
						this.searchKey = '';
					}
					else
						this.$store.commit('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
				}
			},
			loadMore(){
        		if (this.curResults.length === this.resultNum){}
        		else if (this.curResults.length + 8 < this.resultNum)
        			for(let i=0;i<8;i++)this.curResults.push(this.searchResults[this.curResults.length]);
				else
					for(let i=this.curResults.length;i<this.resultNum;i++)this.curResults.push(this.searchResults[i]);
				setTimeout(()=>this.$store.commit('lazyCheck'),100);
			}
		},
        filters:{
			artUrl(art){
				return art.type==='note'?'/note/'+art.id:'/archive/'+art.type+'/'+art.id
			},
			typeUrl(art){
				return art.type==='note'?'/note':'/archive/'+art.type
			},
			commentUrl(art){
				let url = art.type==='note'?'/note/'+art.id:'/archive/'+art.type+'/'+art.id;
				return url + '#comments';
			}
		},
		mixins:[panelHMixin]
    }
</script>

<style>
</style>
