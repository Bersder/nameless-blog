<template>
    <div>
		<h2 class="draft-head">{{this.type==='note'?'笔记':'文章'}}草稿<router-link title="新写一篇" :to="this.type==='note'?'/takenote':'/write'"><i class="iconfont icon-addfriend"></i></router-link> </h2>
		<div class="draft-content" :class="{empty:!draftExist}" etext="什么草稿都没有，好干净！">
			<div class="waiting" v-show="draftWaiting">
				<div class="rect1"></div>
				<div class="rect2"></div>
				<div class="rect3"></div>
				<div class="rect4"></div>
				<div class="rect5"></div>
			</div>
			<transition-group tag="div" name="flip" class="draft-list" v-if="!draftWaiting">
				<div class="draft-list-item" v-for="each in drafts" :key="each.id">
					<p class="row1"><span class="draft-type">{{each.type|typeEN2CN}}</span><router-link :to="each|draftUrl">{{each.title||'标题未定'}}</router-link></p>
					<p class="row2"><span class="draft-update">上次更新:{{each.lut|updateTime}}</span> · <router-link class="draft-edit" :to="each|draftUrl">编辑</router-link><a  href="javascript:void(0);" @click="dropDraft(each)" class="draft-trash pr">!!舍弃!!</a></p>
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {post} from "../util/http";
	export default {
        name: "SpaceLaunchDraft",
		created(){
			post('/apis/auth/v1api.php',{token:this.token||window.localStorage.getItem('BB3000_token'),type:this.type}).then(response=>{
				if (response.data.code < 1){
					let data = response.data.data;
					this.draftWaiting = false;
					data.drafts.forEach(e=>this.drafts.push(e));
					this.draftExist = Boolean(this.drafts.length);
				}
			}).catch(err=>console.warn(err))
		},
		data(){
        	return {
        		drafts:[],
				draftWaiting:true,
				draftExist:true
			}
		},
		computed:{
        	...mapState({
				token:state=>state.account.token
			})
		},
		methods:{
        	dropDraft(draft){
        		if(window.confirm('确认舍弃该草稿？'))
					post('/apis/auth/v2api.php',{token:this.token,type:this.type,id:draft.id}).then(response=>{
						if (response.data.code < 1){
							this.drafts.splice(this.drafts.indexOf(draft),1);
							this.draftExist = Boolean(this.drafts.length);
						}
					}).catch(err=>console.warn(err))
			}
		},
		watch:{
        	type(cur,pre){
				this.draftExist = this.draftWaiting = true;
        		while(this.drafts.pop()){}
        		post('/apis/auth/v1api.php',{token:this.token||window.localStorage.getItem('BB3000_token'),type:cur}).then(response=>{
        			if (response.data.code<1){
						let data = response.data.data;
						this.draftWaiting = false;
						data.drafts.forEach(e=>{this.drafts.push(e)});
						this.draftExist = Boolean(this.drafts.length);
					}
				}).catch(err=>console.warn(err))
			}
		},
		props:['type'],
		filters:{
			typeEN2CN(type){
				if (type==='anime')return 'Anime';
				else if (type==='code')return '极客';
				else if (type==='game')return '游民';
				else return type==='trivial'?'随写':'笔记'
			},
        	draftUrl(draft){
				if (draft.type==='note')return '/takenote?nid='+draft.id;
				else return '/write?aid='+draft.id;

			},
			updateTime(datetime){
				let gap = new Date().getTime() -  new Date(datetime).getTime();
				if (gap<60000)return '刚刚';
				else{
					let gap_m = Math.floor(gap/60000);
					if (gap_m<60)return gap_m + '分钟前';
					else{
						let gap_h = Math.floor(gap_m/60);
						if (gap_h<24)return gap_h + '小时前';
						else{
							let gap_d = Math.floor(gap_h/24);
							if (gap_d<30)return gap_d + '日前';
							else return datetime.substr(0,10);
						}
					}
				}
			}
		}
	}
</script>

<style scoped>
	.flip-leave-active{
		position: absolute;
	}
	.flip-leave-to{
		opacity: 0;
		transform: translateY(-.7rem);
	}
	.draft-head,.album-head{
		font-size: .2rem;
		line-height: .4rem;
		font-weight: normal;
		text-align: left;
		border-bottom: .01rem dashed #eaeaea;
	}
		.draft-head a{
			margin-left: .1rem;
		}
		.draft-head i{
			font-size: .2rem;
			transition: .5s ease;
			color: #6d757a;
		}
		.draft-head i:hover{
			color: #00a1d6;
		}
	.draft-content,.album-content{
		min-height: 4.5rem;
	}
	.draft-content.empty:after,.album-content.empty:after{
		background-image: url(/root/site/static/nodata.png);
		content:attr(etext);
		display: block;
		background-position: center center;
		background-repeat: no-repeat;
		color: #6d757a;
		font-size: .14rem;
		height: 4.5rem;
		overflow: hidden;
		line-height: 6.4rem;
		text-align: center;
	}
	.draft-list{
		margin-bottom: .2rem;
		position: relative;
	}
	.draft-list-item{
		width: 100%;
		padding: .15rem 0;
		font-size: .13rem;
		border-bottom: .01rem solid #eaeaea;
		text-align: left;
		transition: .5s ease;
	}
	.draft-list-item:last-child{
		border-bottom: none;
	}
		.draft-list-item .row1{
			margin-bottom: .05rem;
		}
		.draft-list-item .draft-type{
			background: #00abe0;
			color: white;
			border-radius: .03rem;
			padding: .02rem .05rem;
			margin-right: .07rem;
		}
		.draft-list-item .row1 a{
			font-size: .16rem;
			vertical-align: middle;
		}
		.draft-list-item .row1 a:hover{
			color: #00a1d6;
		}
		.draft-list-item .draft-update{
			color: #6d757a;
		}
		.draft-list-item .draft-edit{
			color: #00a1d6;
		}
		.draft-list-item .draft-trash:hover{
			border-radius: .03rem;
			padding: .01rem .05rem;
			background: indianred;
			color: white;
		}
	/*下面使用commentModule样式*/
	.waiting{
		margin: 0 auto;
		text-align: center;
		height: 2.35rem;
		padding: 1rem 0;
		width: .5rem;
		font-size: .1rem;
	}
	.waiting>div{
		display: inline-block;
		height: 100%;
		width: .05rem;
		background: #00a1d6;
		animation: stretchdelay 1.2s infinite ease-in-out;
	}
	.waiting .rect2{
		animation-delay: -1.1s;
	}
	.waiting .rect3{
		animation-delay: -1s
	}
	.waiting .rect4{
		animation-delay: -.9s;
	}
	.waiting .rect5{
		animation-delay: -.8s;
	}
</style>
