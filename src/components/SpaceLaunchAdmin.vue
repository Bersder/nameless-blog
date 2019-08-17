<template>
    <div>
		<h2 class="admin-head">内容管理</h2>
		<div class="admin-statistics">
			<div class="s-cell">
				<p>内容数</p>
				<span>{{numSum}}</span>
			</div>
			<div class="s-cell">
				<p>总PV</p>
				<span>{{pvSum}}</span>
			</div>
			<div class="s-cell">
				<p>评论数</p>
				<span>{{commentSum}}</span>
			</div>
		</div>
		<div class="admin-nav">
			<a class="admin-nav-item" href="javascript:void(0);" @click="curIndex=0" :class="{cur:!curIndex}" >文章</a>
			<a class="admin-nav-item" href="javascript:void(0);" @click="curIndex=1" :class="{cur:curIndex}">笔记</a>
		</div>
		<div class="a-table-wrap">
			<div class="a-table">
				<div class="a-table-head">
					<div>标题</div>
					<div>PV</div>
					<div>评论</div>
					<div>发布时间</div>
					<div>更新时间</div>
					<div>操作</div>
				</div>
				<div class="a-table-row" v-for="each in curList">
					<div class="title" ><p><router-link :to="each|itemUrl">{{each.title}}</router-link></p><span>{{each|itemInfo}}</span></div>
					<div class="pv">{{each.readCount|readNum}}</div>
					<div class="comment-num"><router-link :to="each|commentUrl">{{each.commentCount}}</router-link></div>
					<div class="ptime">{{each.time.substr(0,10)}}</div>
					<div class="utime">{{each.lut|updateTime}}</div>
					<div class="operate"><button @click="editItem(each)">编辑</button> / <button class="del">删除</button></div>
				</div>

			</div>
		</div>

	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {post} from "../util/http";
    export default {
        name: "SpaceLaunchContent",
		created(){
        	post('/apis/auth/v3api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
        		if (response.data.code < 1){
					let data = response.data.data;
					console.log(data);
					this.notes = data.notes;
					this.articles = data.articles;
					data.articles.forEach(e=>this.curList.push(e));
					this.numSum = data.notes.length + data.articles.length;
					let pvSum = 0;let commentSum = 0;
					data.notes.forEach(e=>{
						pvSum += parseInt(e.readCount);
						commentSum += parseInt(e.commentCount);
					});
					data.articles.forEach(e=>{
						pvSum += parseInt(e.readCount);
						commentSum += parseInt(e.commentCount);
					});
					this.pvSum = pvSum;this.commentSum = commentSum;
				}
			}).catch(err=>{
				if (err.response.status===401){
					this.$store.commit('account/logout');
					this.$router.push('/')
				}

			})

		},
		data(){
        	return{
        		numSum:0,
        		pvSum:0,
				commentSum:0,

        		curIndex:0,
				curList:[],
				notes:[],
				articles:[],
			}
		},
		watch:{
        	curIndex(cur,pre){
        		if (cur)
        			this.curList = this.notes;
        		else
        			this.curList = this.articles
			}
		},
		methods:{
        	editItem(item){
				post('/apis/auth/v2api.php?create',{token:this.token,id:item.id,type:item.type}).then(response=>{
					if (response.data.code < 1){
						let to = item.type==='note'?'/takenote?nid='+item.id:'/write?aid='+item.id;
						this.$router.push(to)
					}
				}).catch(err=>{
					if (err.response.status===401){
						this.$store.commit('account/logout');
						this.$router.push('/')
					}

				})
			},
			delItem(item){
        		//未实现，需要密码确认
			}
		},
		computed:{
			...mapState({
				token:state=>state.account.token
			})
		},
		filters:{
			itemUrl(item){
					return item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id
			},
			commentUrl(item){
				let url = item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id;
				return url + '#comments';
			},
			itemInfo(item){
				let series = item.series?' · '+item.series:'';
				if (item.type==='anime')return 'Anime'+series;
				else if (item.type==='code')return '极客'+series;
				else if (item.type==='game')return '游民'+series;
				else return item.type==='trivial'?'随写'+series:'笔记'+series;
			},
			readNum(count){
				return count.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
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
							else return '数月前'
						}
					}
				}
			}

		}
    }
</script>

<style scoped>
	.a-table-wrap{
		max-height: 5.5rem;
		overflow:auto;
	}
	.a-table{
		display: table;
		border-collapse: collapse;
		width: 100%;
		text-align: left;
	}
	.a-table span{
		font-size: .12rem;
		color: #a1a1a1;
	}
	.a-table a{
		color: #00a1d6;
	}
	.a-table a:hover{
		color: #0083af;
	}
	.a-table-head{
		display: table-header-group;
		border-bottom: .01rem solid #eaeaea;
		font-weight: bold;
	}
		.a-table-head div,.a-table-row div{
			display: table-cell;
			padding: .1rem;
			vertical-align: middle;
		}
	.a-table-row{
		display: table-row;
		border-top: .01rem solid #eaeaea;
		border-bottom: .01rem solid #eaeaea;
		font-size: .14rem;
	}
	.a-table-row:nth-child(even){
		background-color: #f0f6ff;
	}

		.a-table-row .title{
			width: 3rem;
		}
		.a-table-row .pv,.a-table-row .comment-num{
			width: 1rem;
		}
		.a-table-row .ptime{
			width: 1.2rem;
		}
		.a-table-row .utime{
			color: #6d757a;
			width: 1rem;
		}
		.a-table-row .operate button{
			padding: .02rem .05rem;
			border-radius: .03rem;
			background: #eaeaea;
		}
		.a-table-row .operate button.del{
			background: #ffd2db;
			color: #6d757a;
		}




	.admin-head{
		font-size: .2rem;
		line-height: .4rem;
		font-weight: normal;
		text-align: left;
	}
	.admin-statistics{
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		margin-bottom: .3rem;
	}
		.admin-statistics .s-cell:nth-child(2){
			margin: 0 .2rem;
		}
		.admin-statistics .s-cell{
			flex: 1;
			padding: .2rem 0;
			background: #f4f5f7;
			border: .01rem solid #eeeeee;
			border-radius: .05rem;
		}
			.s-cell p{
				margin-bottom: .05rem;
			}
			.s-cell span{
				font-size: .14rem;
				color: #8b8e99;
			}
	.admin-nav{
		border-bottom: .01rem solid #eaeaea;
		text-align: left;
	}
		.admin-nav-item{
			display: inline-block;
			padding: .06rem .2rem;
			border-radius: .04rem .04rem 0 0;
			transition: .3s ease;
			color: #00a1d6;
			margin-bottom: -.01rem;
		}
		.admin-nav-item:hover{
			background-color: #eaeaea;
			color: #008ebe;
		}
		.admin-nav-item.cur{
			background-color: white;
			color: #555;
			border: .01rem solid #eaeaea;
			border-bottom-color: transparent;

		}

</style>
