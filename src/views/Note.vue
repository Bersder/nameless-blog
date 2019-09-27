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
			<div class="page-content note fc">
				<div class="notice tl" v-if="notice"><i class="iconfont icon-notify"></i> {{notice}}</div>
				<div class="content-primary-n">
					<div class="note-sort-options">
						<span class="nso-l" :class="{'nso-selected':!rSelected}" @click="rSelected=false">日期降序</span><span class="nso-r" :class="{'nso-selected':rSelected}" @click="rSelected=true">分类归类</span>
					</div>
					<div class="waiting" v-show="noteWaiting">
						<div class="rect1"></div>
						<div class="rect2"></div>
						<div class="rect3"></div>
						<div class="rect4"></div>
						<div class="rect5"></div>
					</div>
					<div class="list-container tl" v-show="rSelected">
						<div class="category-list" v-for="(item,key,index) in catMap" :key="index">
							<div class="category-title">
								{{item}} <span> · {{key}}</span>
							</div>
							<div class="category-list-item" v-for="(item_,index_) in sortedNotes[key]">
								<span class="item-num">{{index_|twoNum}}</span>
								<span class="item-name">
									<router-link :to="item_.nid" class="item-link" append>{{item_.title}}</router-link><span class="item-tag" v-for="tag in item_.tags"><a :href="'/tags/'+tag">{{tag}}</a></span>
								</span>
								<span class="item-date">{{item_.time.substr(0,10)}}</span>
							</div>
						</div>
					</div>


					<div class="note-list tl" v-show="!rSelected">

						<div class="panel-n-wrap" v-for="each in curNotes"><!--需要：时间o，标题o，预览o，图片o，分类，nido-->
							<div class="panel-n" >
								<div class="panel-n-img">
									<router-link :to="each.nid" append>
										<img :src="'/root'+each.imgSrc+'.thumb'" class="lazyload" :data-src="'/root'+each.imgSrc">
										<div class="float-preview tl">
											{{each.preview}}
										</div>
									</router-link>
								</div>
								<div class="slant-mask slant-beneath"></div>
								<div class="slant-mask">
									<i class="iconfont icon-time"> {{each.time.substr(0,10)}}</i>
								</div>
								<div class="panel-n-info">
									<div class="title">
										<router-link :to="each.nid" append>{{each.title}}</router-link>
									</div>
									<div class="category no-select">
										{{catMap[each.category]}}<span> · {{each.category}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="pager" v-if="curNotes.length<noteNum" @click="loadMore" >
							<div class="dec"></div>
							<div class="previous-more">
								<span>More</span>
							</div>
						</div>
						<div class="pager-no-more" v-if="curNotes.length>=noteNum&&!noteWaiting">没有更多啦( *・ω・)✄╰ひ╯</div>

					</div>

				</div>
				<div class="content-aside-n">

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
    export default {
        name: "Note",
		created(){
			this.$fetch('/apis/apiv1.php',{_:'note'}).then(response=>{
				let data = response.data.data;
				this.noteWaiting = false;
				this.headerInfo = data.headerInfo;
				this.catMap = data.catMap;
				data.notes.forEach(e=>{
					if (e.tags) e.tags = e.tags.split(',');
					this.notes.push(e);
				});
				this.noteNum = data.notes.length;
				this.curNotes = this.notes.slice(0,this.noteNum<6?this.noteNum:6);
				this.notice = data.notice;
				for(let i in this.catMap)
					this.$set(this.sortedNotes,i,this.notes.filter(e=>e.category===i));
				setTimeout(()=>this.$store.commit('lazyCheck'),100);
			})
		},
        data() {
            return {
				headerInfo:{imgSrc:'/site/static/loading.gif',title:'笔记',description:''},
            	catMap:null,
				noteWaiting:true,
				noteNum:0,
				rSelected:false,

				notice:null,
				notes:[],
				sortedNotes:{},
				curNotes:[]

			}
        },
		computed:{
			...mapGetters(['reachBottom']),
		},
		watch:{
			reachBottom(cur,pre){
				if (cur)this.loadMore();
			}
		},
		methods:{
			loadMore(){
				if(this.curNotes.length===this.noteNum){}
				else if(this.curNotes.length+6<this.noteNum)
					for(let i=0;i<6;i++)this.curNotes.push(this.notes[this.curNotes.length]);
				else
					for(let i=this.curNotes.length;i<this.noteNum;i++)this.curNotes.push(this.notes[i]);
				setTimeout(()=>this.$store.commit('lazyCheck'),100);
			}
		},
		filters:{
        	twoNum(data){
        		data++;
        		return data<10?'0'+data:data
			}
		},
    }
</script>

<style>
</style>
