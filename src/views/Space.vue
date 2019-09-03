<template>
    <div>
		<div class="space-h-wrap">
			<div class="h-inner">
				<div class="h-user">
					<div class="h-info">
						<div class="h-avatar"><img :src="avatar"></div>
						<div class="h-basic">
							<p>
								<span class="h-name">{{name}}</span>
								<span class="h-status" title="点击改变状态" @click="statusChange" :style="{background:statusMap[status].color}"><i class="iconfont" :class="statusMap[status].icon"></i>{{statusMap[status].des}}</span>
							</p>
							<div class="h-sign">
								<input type="text" @change="signChange" placeholder="这个人很懒，什么都没写" v-model="signature">
							</div>
						</div>
					</div>
				</div>
				<div class="h-change">

				</div>
			</div>
		</div>
		<div class="space-n-wrap">
			<div class="n-inner">
				<div class="n-tab-link">
					<router-link to="/space" class="n-btn"><span class="iconfont icon-home"></span><span class="n-title">首页</span></router-link>
					<router-link to="/space/dynamic" class="n-btn"><span class="iconfont icon-dongtai"></span><span class="n-title">动态</span></router-link>
					<router-link to="/space/launch" class="n-btn"><span class="iconfont icon-launch"></span><span class="n-title">发布</span></router-link>
					<router-link to="/space/album" class="n-btn"><span class="iconfont icon-album"></span><span class="n-title">相册</span></router-link>
					<router-link to="/space/setting" class="n-btn"><span class="iconfont icon-gear"></span><span class="n-title">设置</span></router-link>
				</div>
				<div class="n-statistics">

				</div>
			</div>
		</div>
		<div class="space-c-wrap">
			<router-view></router-view>
			<div class="space-home" v-if="$route.name==='space'">
				<div class="col-1">
					<div class="section">
						<h3 class="section-title">测试标题</h3>
						<div class="section-content">
						</div>
					</div>
					<div class="section">
						<h3 class="section-title">测试标题</h3>
						<div class="section-content">
						</div>
					</div>
				</div>
				<div class="col-2">
					<div class="section memo">
						<h4 class="section-title">便签</h4>
						<textarea v-model="memo" @change="memoChange" placeholder="编辑我的备忘录"></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {post} from "../util/http";
	import {mapState} from 'vuex';
	import {statusMap} from "../util/USER_VAR";

	export default {
        name: "Space",
		beforeRouteEnter(to,from,next){
			console.log(to);
			if (!from.name){
				if (window.localStorage.getItem('BB3000_token')){
					console.log('//非路由方式进入存在token，让space去验证');
					next();
				}
				else{
					console.log('//非路由方式进入不存在token，驳回访问');
					next('/');
				}
			}
			else{
				if (to.meta.loginStatus||to.matched[0].meta.loginStatus){
					console.log('路由方式进入，已经登录过');
					next();
				}
				else{
					console.log('(非法)路由方式进入，驳回访问');
					next('/');
				}
			}
		},
		computed:{
			...mapState({
				token:state=>state.account.token,
				avatar:state=>state.account.avatar,
				name:state=>state.account.name,
				isMobile:'isMobile'
			})
		},
		created(){
			post('/apis/auth/v0api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
				let info = response.data.data.info;
				this.signature = info.sign;
				this.status = parseInt(info.status);
				this.memo = info.memo
			}).catch(err=>console.warn(err))
		},
		data(){
        	return{
				signature:'编辑个性签名',
				status:0,
				statusMap:statusMap,
				memo:''
			}
		},
		methods:{
        	signChange(){
        		post('/apis/auth/v0api.php',{token:this.token,sign:this.signature}).then(response=>{
        			if (response.data.code < 1)
						this.$store.commit('infoBox/callInfoBox',{
							info:'个人签名更新成功',
							ok:true,
							during:2000
						});
				}).catch(err=>console.warn(err))
			},
			statusChange(){
        		let nextStatus = (this.status+1)%this.statusMap.length;
				post('/apis/auth/v0api.php',{token:this.token,status:nextStatus}).then(response=>{
					if (response.data.code < 1)
						this.status=nextStatus;
				}).catch(err=>console.warn(err))
			},
			memoChange(){
        		post('/apis/auth/v0api.php',{token:this.token,memo:this.memo}).then(response=>{
        			if (response.data.code<1)
						this.$store.commit('infoBox/callInfoBox',{
							info:'备忘录更新成功',
							ok:true,
							during:2000
						});
				}).catch(err=>console.warn(err))
			}
		}
    }
</script>

<style scoped>
	.space-c-wrap{
		margin: .15rem 0;
	}
	.space-home{
		margin: 0 auto;
		max-width: 12rem;
		background: transparent;
		overflow: hidden;
	}
	.space-dynamic .col-1,.space-home .col-1{/*下面两个使用spaceDynamic样式*/
		float: left;
		width: 8.35rem;
	}
	.space-dynamic .col-2,.space-home .col-2{
		float: right;
		width: 3.5rem;
	}
	.space-home .col-1{
		padding: .15rem .2rem;
		background: white;
	}
	.memo textarea{
		display: block;
		padding: .1rem;
		margin-left: -.1rem;
		height: 1.7rem;
		width: 100%;
		resize: none;
		font-size: .16rem;
		line-height: .2rem;
		color: #6d757a;
		border: .01rem solid transparent;
		border-radius: .03rem;
		outline: none;
		box-sizing: content-box;
		transition: .5s ease;
	}
	.memo textarea:hover,.memo textarea:focus{
		border-color: #00a1d6;
	}




	.h-inner{
		position: relative;
		padding-top: 1.2rem;
		max-width: 12rem;
		margin: .7rem auto 0;
		background-image: url(http://localhost:80/site/images/space.png);
		background-position: center center;
		background-size: cover;
		transition: .5s ease;
	}
	.h-inner:before{
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: .85rem;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAAAABdCAMAAADNEjtLAAABEVBMVEUDAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAACnjvHuAAAAW3RSTlMBAgMEBQYHCAkKCwwNDxAREhQVFhgZGxweHyEiJCUnKSosLS8xMjQ2ODk7PT5AQkNFR0hKTE5PUVNUVldZW1xeX2FiZGVnaGprbG5vcHFzdHV2d3h5ent8fX5/XoZ4lgAAAPVJREFUeAHt1AERADAQAiDdrX/mDyKEIAAAjGkDsOk3AAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECAgQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBAQIIEAAAQIseAEYdZ9sAcJDX4ICAAAAAElFTkSuQmCC);
		background-repeat: repeat-x;
	}
		.h-inner .h-user{
			position: relative;
		}
			.h-user .h-info{
				margin-left: .2rem;
				padding-bottom: .15rem;
				overflow: hidden;
			}
				.h-info .h-avatar{
					float: left;
					height: .7rem;
					width: .7rem;
					border: .02rem solid rgba(0,0,0,.2);
					border-radius: 50%;
				}
					.h-avatar img{
						border-radius: 50%;
						background-position: center center; /*暂时，等待截取功能实现*/
						background-size: cover;
						height: 100%;
						width: 100%;

					}
				.h-info .h-basic{
					float: left;
					margin: .1rem 0 0 .2rem;
					color: white;
					text-align: left;
				}
					.h-basic .h-name{
						display: inline-block;
						font-size: .18rem;
						line-height: .18rem;
						font-weight: bold;
						margin-right: .05rem;
						vertical-align: bottom;
					}
					.h-basic .h-status{
						font-size: .12rem;
						padding: .01rem .05rem;
						border-radius: .04rem;
						cursor: pointer;
					}
					.h-basic .h-sign{
						margin-top: .07rem;
					}
						.h-sign input{
							background: transparent;
							border-radius: .05rem;
							border: none;
							box-shadow: none;
							color: #d6dee4;
							font-size: .12rem;
							line-height: .26rem;
							height: .26rem;
							margin-left: -.05rem;
							padding: 0 .05rem;
							position: relative;
							width: 7rem;
							outline: none;
							transition: .3s ease;
						}
						.h-sign input::-webkit-input-placeholder,.h-sign input:-moz-placeholder,.h-sign input:-ms-input-placeholder{/*这个VUe打包不识别，需要直接插入css中*/
							color: white;
						}
						.h-sign input:hover{
							background: hsla(0,0%,100%,.2);
							box-shadow: 0 0 0 .01rem hsla(0,0%,100%,.5);
						}
						.h-sign input:focus{
							background: #fff;
							box-shadow: inset 0 .02rem .04rem rgba(35,54,86,.3);
							color: #6d757a;
						}
	.n-inner{
		margin: 0 auto;
		padding: 0 .2rem;
		max-width: 12rem;
		height: .6rem;
		text-align: left;
		background: white;
		border-radius: 0 0 .05rem .05rem;
		box-shadow: 0 0 0 .01rem #eee;
	}
		.n-inner .n-tab-link {
			display: inline-block;
		}
			.n-tab-link .n-btn{
				display: inline-block;
				margin-right: .3rem;
				font-size: 0;
				line-height: .6rem;
			}
				.n-btn .iconfont{
					font-size: .2rem;
					vertical-align: middle;
					margin-right: .04rem;
				}
				.iconfont.icon-home{
					color: #5abebc;
				}
				.iconfont.icon-dongtai{
					color: #fb7299;
				}
				.iconfont.icon-launch{
					color: slateblue;
				}
				.iconfont.icon-album{
					color: yellowgreen;
				}
				.iconfont.icon-gear{
					color: #00a1d6;
				}
				.n-btn .n-title{
					font-size: .13rem;
					vertical-align: middle;
				}

@media screen and (max-width: 1000px) {
	.h-inner{
		margin: .5rem auto 0;
	}
}
</style>
