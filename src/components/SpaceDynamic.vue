<template>
    <div class="space-dynamic">
		<div class="col-1">
			<div class="history-dynamic">
				<div class="dynamic-content-wrap" v-for="each in curDynamics" :key="each.id">
					<div class="dynamic-avatar"><img :src="avatar" height="40" width="40"></div>
					<div class="dynamic-meta">
						<p class="uname">{{name}}</p>
						<span>{{each.type|typeEN2CN}} · {{each.time|postTime}}</span>
					</div>
					<div class="dynamic-content"><p>{{each.content}}</p></div>
					<div class="dynamic-opt">
						<i class="iconfont icon-more"></i>
						<div class="more-opt">
							<a @click="delDynamic(each)">删除</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="col-2">
			<div class="section dynamic-launch">
				<h4>发布动态</h4>
				<textarea placeholder="要写些什么呢?" v-model="sendContent"></textarea>
				<div class="type-selector">
					<div v-for="(item,key) in typeMap" @click="sendType=key" :class="{cur:sendType===key}">{{item}}</div>
				</div>
				<button @click="launchDynamic">确认</button>
			</div>
		</div>

		<div class="popup-panel-container" v-if="popupShow">
			<div class="popup-panel">
				<h3 class="popup-title tl">删除动态</h3>
				<div class="popup-content tl">确定要删除此条动态?</div>
				<div class="popup-confirm tc">
					<button class="btn-primary" @click="delConfirm(true)">删除</button><button class="btn-secondary" @click="delConfirm(false)">手抖点错</button>
				</div>
				<a class="popup-cancel" @click="popupShow=false"><i class="iconfont icon-cancel"></i></a>
			</div>
		</div>
	</div>
</template>

<script>
	import {post} from "../util/http";
	import {mapGetters} from 'vuex';
	import {mapState} from 'vuex';
	export default {
        name: "SpaceDynamic",
		created(){
			post('/apis/auth/v6api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
				let data = response.data.data;
				data.dynamics.forEach(e=>this.curDynamics.push(e));
				this.dynamicNum = parseInt(data.dNum);
			}).catch(err=>console.warn(err))
		},
		data(){
        	return{
				curDynamics:[],
				dynamicNum:0,
				popupShow:false,
				delTarget:null, //待删目标
				sendContent:'',
				sendType:'',
				typeMap:{anime:'Anime',code:'极客',game:'游民',trivial:'随写'}
        	}
		},
		watch:{
			reachBottom(cur,pre){
				if (cur)this.loadMore();
			}
		},
		methods:{
        	launchDynamic(){
        		if (this.sendContent.replace(/^\s*|\s*$/g,'')&&this.sendType){
        			let data = {
        				token:this.token,
						content:this.sendContent.replace(/^\s*|\s*$/g,''),
						type:this.sendType
					};
        			post('/apis/auth/v7api.php',data).then(response=>{
						if (response.data.code<1){
							this.sendContent = '';
							this.$store.commit('infoBox/callInfoBox',{
								info:'动态发布成功',
								ok:true,
								during:2000
							});
							setTimeout(()=>location.reload(),2000)
						}
					}).catch(err=>console.warn(err))
				}
        		else{
					window.alert('请检查必要信息是否完整且正确')
				}
			},
        	delDynamic(item){
				this.delTarget = item;
				this.popupShow = true;
			},
			delConfirm(bool){
				if (bool) //确认删除
					post('/apis/auth/v7api.php?delete='+this.delTarget.id,{token:this.token}).then(response=>{
						if (response.data.code<1){//删除成功，总数-1,
							this.dynamicNum--;
							this.curDynamics.splice(this.curDynamics.indexOf(this.delTarget),1);
							this.popupShow = false;
							this.$store.commit('infoBox/callInfoBox',{
								info:'动态删除成功',
								ok:true,
								during:2000
							});
						}
					}).catch(err=>console.warn(err));
				else
					this.popupShow = false
			},
        	loadMore(){
				if (this.curDynamics.length < this.dynamicNum) {
					post('/apis/auth/v6api.php?more='+Math.floor(this.curDynamics.length/10),{token:this.token}).then(response=>{
						response.data.data.dynamics.forEach(e=>this.curDynamics.push(e))
					}).catch(err=>console.warn(err))
				}
			}
		},
		computed:{
			...mapGetters(['reachBottom']),
			...mapState({
				token:state=>state.account.token,
				avatar:state=>state.account.avatar,
				name:state=>state.account.name
			})
		},
		filters:{
        	typeEN2CN(type){
				if (type==='anime')return '吐槽';
				else if (type==='code')return 'Error';
				else if (type==='game')return '游言';
				else return '日常';
			},
			postTime(datetime){
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
	.space-dynamic { /*可能与其他模块合并*/
		margin: 0 auto;
		max-width: 12rem;
		background: transparent;
		overflow: hidden;
	}
	.space-dynamic .col-1,.space-home .col-1{
		float: left;
		width: 8.35rem;
	}
	.space-dynamic .col-2,.space-home .col-2{
		float: right;
		border-radius: .03rem;
		width: 3.5rem;
	}
	/*下面可能和comment的样式合并？*/
	.dynamic-content-wrap{
		position: relative;
		padding: .2rem;
		background: white;
		border-radius: .03rem;
		box-shadow: 0 0 0 .01rem #eee;
		text-align: left;
		margin-bottom: .1rem;
	}
		.dynamic-content-wrap .dynamic-avatar{
			position: absolute;
			top: .2rem;
			left: .2rem;
		}
			.dynamic-avatar img{
				border-radius: 50%;
				transition: .3s cubic-bezier(.25,.46,.45,.94);
			}
			.dynamic-avatar img:hover{
				transform: scale(1.05);
			}
		.dynamic-content-wrap .dynamic-meta{
			margin-left: .5rem;
		}
			.dynamic-meta .uname{
				margin-bottom: .02rem;
				font-weight: bold;
				font-size: .15rem;
			}
			.dynamic-meta span{
				font-size: .12rem;
				color: #bbbbbb;
			}
		.dynamic-content-wrap .dynamic-content{
			margin: .07rem .5rem 0 .5rem;
		}
		.dynamic-content-wrap .dynamic-opt{
			position: absolute;
			right: .2rem;
			top: .2rem;
			font-size: .2rem;
			color: #bbbbbb;
		}
			.dynamic-opt .more-opt{
				position: absolute;
				display: none;
				background: white;
				right: -50%;
				padding: .05rem;
				width: .9rem;
				text-align: center;
				border: .01rem solid #e5e9ef;
				box-shadow: 0 .1rem .1rem 0 rgba(106,115,133,0.12);
				border-radius: .03rem;
				font-size: .15rem;
				color: #6d757a;
			}
			.dynamic-opt:hover .more-opt{
				display: block;
			}
			.more-opt a{display: block;cursor: pointer}
			.more-opt a:hover{color: #00a1d6;}
			.more-opt:after{
				content: "";
				display: block;
				border-top: .01rem solid #e5e9ef;
				border-left: .01rem solid #e5e9ef;
				transform: rotate(45deg);
				width: .08rem;
				height: .08rem;
				position: absolute;
				top: -.05rem;
				right: .14rem;
				background: #fff;
			}

	.dynamic-launch{
		position: relative;
	}
		.dynamic-launch textarea{
			display: block;
			margin: .1rem 0;
			padding: .1rem;
			height: 1.3rem;
			width: 100%;
			resize: none;
			font-size: .14rem;
			line-height: .2rem;
			border: .02rem solid rgba(0,0,0,.1);
			outline: none;
			transition: .5s;
		}
		.dynamic-launch textarea:focus{
			border-color: #00a1d6;
		}
		.dynamic-launch .type-selector{
			display: flex;
			width: 70%;
			flex-flow: row wrap;
			justify-content: space-between;
		}
			.type-selector div{
				flex: 1;
				font-size: .15rem;
				line-height: .15rem;
				padding: .05rem 0;
				margin-right: -.01rem;
				border: .01rem solid #41a7ea;
				text-align: center;
				cursor: pointer;
				color: #00a1d6;
				transition: .3s ease;
				user-select: none;
			}
			.type-selector div.cur{
				background: #00a1d6;
				color: white;
			}
		.dynamic-launch button{
			position: absolute;
			bottom: .15rem;
			right: .2rem;
			border-radius: 1rem;
			border: .02rem solid rgba(0,0,0,.1);
			padding: .04rem .15rem;
			font-size: .14rem;
			line-height: .14rem;
			color: #6a737d;
			font-weight: 600;
			transition: .5s;
		}
		.dynamic-launch button:hover{
			color: white;
			background: #00a1d6;
		}






	.popup-panel-container{/*可能与authbox样式合并*/
		position: fixed;
		z-index: 2000;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,.4);
		left: 0;
		top: 0;
	}
	.popup-panel{
		position: relative;
		top: 50%;
		transform: translate(0,-50%);
		margin: 0 auto;
		width: 4.5rem;
		background: white;
		border: .01rem solid #6d757a;
		box-shadow: 0 0 .15rem rgba(0,0,0,.4);
		border-radius: .05rem;
		padding: .2rem;
	}
		.popup-panel .popup-title{
			color: #00a1d6;
		}
		.popup-content{
			font-size: .14rem;
			margin: .1rem 0;
		}
		.popup-confirm button{
			width: 1rem;
			padding: .05rem .1rem;
			font-size: .15rem;
			line-height: .15rem;
			margin: 0 .1rem;
			border-radius: .04rem;
			border: .01rem solid #23ade5;
			transition: .3s ease;
		}
		.popup-confirm button.btn-primary{
			background: #23ade5;
			color: white;
		}
		.popup-confirm button.btn-primary:hover{
			background: #00a1d6;
		}
		.popup-confirm button.btn-secondary{
			color: #23ade5;
		}
		.popup-confirm button.btn-secondary:hover{
			color: white;
			background: #23ade5;
		}
		.popup-cancel{
			position: absolute;
			top: .15rem;
			right: .15rem;
			font-size: .2rem;
			cursor: pointer;
		}
		.popup-cancel:hover{
			color: #00a1d6;
		}

</style>
