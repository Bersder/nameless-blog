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
						<h3 class="section-title">网站公告</h3>
						<div class="section-content">

						</div>
					</div>
					<div class="section">
						<h3 class="section-title">站点访问</h3>
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
	import {mapState} from 'vuex';
	import UCONF from "../config/user.conf";

	export default {
        name: "Space",
		beforeRouteEnter(to,from,next){
        	// 下面4种情况分别是
			// 1.非路由方式进入存在token，去验证
			// 2.非路由方式进入不存在token，驳回访问
			// 3.路由方式进入，已经登录过
			// 4.(非法)路由方式进入，驳回访问
			if (!from.name){
				if (window.localStorage.getItem('BB3000_token')){
					next();
				}
				else{
					next('/');
				}
			}
			else{
				if (to.meta.loginStatus||to.matched[0].meta.loginStatus){
					next();
				}
				else{
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
        	if (this.isMobile){
        		if (window.confirm('个人空间并没适配移动端，是否进入?'))
					this.$post('/apis/auth/v0api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
						let info = response.data.data.info;
						this.signature = info.sign;
						this.status = parseInt(info.status);
						this.memo = info.memo
					}).catch(err=>console.warn(err));
				else
					this.$router.go(-1)
			}
        	else
				this.$post('/apis/auth/v0api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
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
				statusMap:UCONF.statusMap,
				memo:''
			}
		},
		methods:{
        	signChange(){
        		this.$post('/apis/auth/v0api.php',{token:this.token,sign:this.signature}).then(response=>{
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
				this.$post('/apis/auth/v0api.php',{token:this.token,status:nextStatus}).then(response=>{
					if (response.data.code < 1)
						this.status=nextStatus;
				}).catch(err=>console.warn(err))
			},
			memoChange(){
        		this.$post('/apis/auth/v0api.php',{token:this.token,memo:this.memo}).then(response=>{
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

<style>
</style>
