<template>
    <div>
		<h2 class="draft-head">我的草稿</h2>
		<div class="draft-content" :class="{empty:!drafts.length}">
			<div class="draft-list">
				<div class="draft-list-item" v-for="each in drafts" :key="each.id">
					<p class="row1"><span class="draft-type">{{each.type|typeEN2CN}}</span><router-link :to="each|draftUrl">{{each.title}}</router-link></p>
					<p class="row2"><span class="draft-update">上次更新:{{each.lut|updateTime}}</span> · <router-link class="draft-edit" :to="each|draftUrl">编辑</router-link><a  href="javascript:void(0);" @click="dropDraft(each)" class="draft-trash pr">!!舍弃!!</a></p>
				</div>
			</div>
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
				let data = response.data.data;
				data.drafts.forEach(e=>this.drafts.push(e));
			})
		},
		data(){
        	return {
        		drafts:[]
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
						if (response.data.code < 1)
							this.drafts.splice(this.drafts.indexOf(draft),1)
					})
			}
		},
		watch:{
        	type(cur,pre){
        		while(this.drafts.pop()){}
        		post('/apis/auth/v1api.php',{token:this.token||window.localStorage.getItem('BB3000_token'),type:cur}).then(response=>{
        			let data = response.data.data;
        			data.drafts.forEach(e=>{this.drafts.push(e)})
				})
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
	.draft-head{
		font-size: .2rem;
		line-height: .4rem;
		font-weight: normal;
		text-align: left;
		border-bottom: .01rem dashed #eaeaea;
	}
	.draft-content{
		min-height: 4.5rem;
	}
	.draft-content.empty:after{
		background-image: url(http://localhost:80/site/images/nodata.png);
		content:"什么草稿都没有，好干净！";
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
	}
	.draft-list-item{
		padding: .15rem 0;
		font-size: .13rem;
		border-bottom: .01rem solid #eaeaea;
		text-align: left;
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
</style>
