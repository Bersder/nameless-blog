<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
				<div class="page-info fc">
					<h2 class="intro">{{headerInfo.title}}</h2>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="page-content fc" style="padding: .1rem">
				<div class="tag-cloud tl">
					<h2>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{this.tagExpand|expandStatus}}</a></h2>
					<ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
						<li class="tag" v-for="item in tagCountList" :key="item.id"><router-link :to="'/tags/'+item.tagName" :title="item.count+' 相关'">{{item.tagName}}</router-link></li>
					</ul>
				</div>
				<div class="archive-list">
					<h2 class="archive-title">归档</h2>
					<span class="archive-title-en">Archives</span>
					<p style="color: #8b8e99;font-size: .14rem;font-weight: 600">{{this.articles.length-this.noteNum}} 文章 + {{this.noteNum}} 笔记</p>
					<div class="archives">
						<p class="tr" style="padding: 0 .2rem"><a @click="test2" href="javascript:void(0);">「展开／折叠」</a></p>
						<div class="years-list" v-for="year in year_ord">
							<h3>{{year}} 年</h3>
							<ul class="mons-list">
								<li class="ml-item" v-for="mon in arch_data[year].mon_ord">
									<span class="mon"  @click="test(year,mon)" >{{mon}}月({{arch_data[year][mon].articles.length}}篇)</span>
									<ul class="days-list" :id="year+'-'+mon" :style="{height:arch_data[year][mon].articles.length*26+'px'}" >
										<li v-for="art in arch_data[year][mon].articles">
											<span class="day">{{art.day}}日</span>
											<router-link :to="art|toUrl">{{art.title}}<span style="color: #b8c0cc;font-size: .12rem" v-if="art.type==='note'"> · 笔记</span></router-link>
										</li>
									</ul>
								</li>

							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import tagCloudMixin from "../mixins/Mixin-TagCloud";
	export default {
        name: "Archive",
		created(){
			this.$fetch('/apis/apiv4.php').then(response=>{
				let data = response.data.data;
				this.articles = data.articles;
				this.headerInfo = data.headerInfo;
				this.noteNum = data.noteNum;
				this.articles.forEach(e=>{
					if(!this.arch_data[e.time.slice(0,4)])
						this.arch_data[e.time.slice(0,4)] = {};
					if(!this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)])
						this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)] = {unfolded:false,articles:[]};
					this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)]['articles'].push({id:e.id,day:e.time.slice(8,10),title:e.title,type:e.type,readCount:e.readCount,commentCount:e.commentCount})

				});
				this.year_ord = Object.keys(this.arch_data).sort((a,b)=>{return b - a});
				this.year_ord.forEach(e=>{
					this.arch_data[e]["mon_ord"] = Object.keys(this.arch_data[e]).sort((a,b)=>{return b - a});
				});
				data.tagCountList.forEach(e=>this.tagCountList.push(e));
				if ((!this.isMobile&&this.tagCountList.length>30)||(this.tagCountList.length>12&& this.isMobile)) this.manyTags = true;
			});

		},
        data() {
            return {
				headerInfo:{imgSrc:'/static/images/loading.gif',title:'归档',description:''},
				noteNum:0,
				articles:[],
				year_ord:[],
				arch_data:{},
				expand_flag:true,
			}
        },
		computed:{
        	...mapState(['isMobile'])
		},
        mounted() {
        },
		methods:{
        	test(y,m){
				let ul = document.getElementById(y+'-'+m);
				if (ul.style.height === '0px')
					ul.style.height = this.arch_data[y][m].articles.length * 26 + 'px';
				else
					ul.style.height = '0px';

			},
			test2(){
        		let es = document.getElementsByClassName('days-list');
				if(this.expand_flag)
					Array.from(es).forEach(e=>e.style.height='0px');
				else
					Array.from(es).forEach(e=>{
						let ym = e.getAttribute('id').split('-');
						let y = ym[0];
						let m = ym[1];
						e.style.height = this.arch_data[y][m].articles.length * 26 + 'px';
					});
				this.expand_flag = !this.expand_flag
			}
		},
		mixins:[tagCloudMixin],
		filters:{
        	toUrl(item){
				return item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id;
			}
		}

    }
</script>

<style>
</style>
