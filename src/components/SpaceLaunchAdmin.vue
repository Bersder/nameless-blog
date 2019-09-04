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
					<div class="operate"><button @click="editItem(each)">编辑</button> / <button v-if="each.topped" @click="topItem(each)">{{parseInt(each.topped)?'取消置顶':'置顶'}}</button> / <button @click="delItem(each)" class="del">删除</button></div>
				</div>

			</div>
		</div>
		<div class="auth-box-container" v-if="authBoxShow">
			<div class="auth-box">
				<div class="box-header">
					<span style="color: #db6e6e;font-weight: bold">危险操作</span><a @click="authBoxShow=false;password=''"><i class="iconfont icon-cancel"></i></a>
				</div>
				<div class="box-warn">你正在尝试删除现有文章/笔记</div>
				<div class="box-body">
					<p style="margin-bottom: .1rem;">该操作一旦执行无法撤销，将会永久的删除文章<strong>《{{delTarget.title}}》</strong>及其评论</p>
					<p>输入用户密码以授权操作</p>
					<input type="password" v-model="password">
					<button @click="authorize">授权操作</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {post} from "../util/http";
	import {aesEncrypt} from "../util/util";

	export default {
        name: "SpaceLaunchContent",
		created(){
        	post('/apis/auth/v3api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
        		if (response.data.code < 1){
					let data = response.data.data;
					console.log(data);
					this.notes = data.notes;
					this.curList =  this.articles = data.articles;
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
			}).catch(err=>console.warn(err))

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
				delTarget:'',
				authBoxShow:false,
				password:''
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
				}).catch(err=>console.warn(err))
			},
			topItem(item){
					let query = parseInt(item.topped)?'':'?topped';
					post('/apis/auth/v4api.php'+query,{token:this.token,id:item.id}).then(response=>{
						if (response.data.code < 1){
							//置顶或取消置顶成功
							this.$store.commit('infoBox/callInfoBox',{
								info:parseInt(item.topped)?'取消置顶成功':'置顶成功',
								ok:true,
								during:2000
							});
							item.topped = parseInt(item.topped)?'0':'1'
						}
						else
							this.$store.commit('infoBox/callInfoBox',{
								info:'操作失败',
								ok:true,
								during:2000
							});
					}).catch(err=>console.warn(err))
			},
			delItem(item){
        		//呼出授权box，为其指定目标
				this.delTarget = item;
				this.authBoxShow = true;
			},
			authorize(){
        		//开始授权
        		if (this.password) {
					let data = {
						name:this.name,
						psw:this.password,
						id:this.delTarget.id,
						type:this.delTarget.type
					};
					post('/apis/auth/v5api.php',{token:this.token,...aesEncrypt(JSON.stringify(data))}).then(response=>{
						if (response.data.code < 1){//授权成功删除
							this.password = '';
							this.authBoxShow = false;
							this.$store.commit('infoBox/callInfoBox',{
								info:'再见了你嘞！',
								ok:true,
								during:2000
							});
							this.numSum--;
							this.pvSum-=this.delTarget.readCount;
							this.commentSum-=this.delTarget.commentCount;
							if (this.curIndex)
								this.notes.splice(this.notes.indexOf(this.delTarget),1);
							else
								this.articles.splice(this.articles.indexOf(this.delTarget),1);
						}
						else{//授权失败
							this.password = '';
							this.$store.commit('infoBox/callInfoBox',{
								info:'密码错误，授权失败',
								ok:false,
								during:3000
							});
						}
					}).catch(err=>console.warn(err))
				}

			}
		},
		computed:{
			...mapState({
				token:state=>state.account.token,
				name:state=>state.account.name,
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
			font-size: .12rem;
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
	.auth-box-container{
		position: fixed;
		z-index: 2000;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,.4);
		left: 0;
		top: 0;
	}
	.auth-box{
		position: relative;
		top: 50%;
		transform: translate(0,-50%);
		margin: 0 auto;
		width: 3.5rem;
		background: white;
		border: .01rem solid #6d757a;
		box-shadow: 0 0 .15rem rgba(0,0,0,.4);
		border-radius: .03rem;
		text-align: left;
		font-size: .15rem;
	}
		.auth-box .box-header {
			padding: .15rem;
			background-color: #f6f8fa;
			line-height: .15rem;
		}
			.box-header a{
				font-size: .2rem;
				cursor: pointer;
				float: right;
				color: #6d757a;
				vertical-align: middle;
			}
			.box-header a:hover{
				color: #00a1d6;
			}
		.auth-box .box-warn{
			font-size: .14rem;
			background: #fffbdd;
			color: #735c0f;
			border: .01rem solid rgba(27,31,35,.15);
			padding: .1rem .15rem;
		}
		.auth-box .box-body{
			padding: .15rem;

		}
			.box-body input{
				display: block;
				border: .01rem solid #e0e0e0;
				border-radius: .03rem;
				padding: .05rem .1rem;
				width: 100%;
				margin: .1rem 0;
			}
			.box-body button{
				display: block;
				width: 100%;
				color: white;
				padding: .05rem .1rem;
				font-size: .16rem;
				line-height: .2rem;
				border-radius: .05rem;
				border: .01rem solid rgba(0,0,0,.1);
				background: linear-gradient(to bottom, #2faad6, #0093c3 90%);
			}
</style>
