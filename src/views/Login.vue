<template>
	<div>
		<div class="login-wrap" :style="{height:screenHeight+'px'}">
			<div class="login">
				<h1><router-link to="/">Oshino·Nya</router-link></h1>
				<p>
					<label>
						Username or Email Address
						<input type="text" v-model="account">
					</label>
				</p>
				<p>
					<label>
						Password
						<input type="password" v-model="password" @keyup.enter="loginSubmit">
					</label>
				</p>
				<p class="remember" style="line-height: .2rem">
					Remember Me
					<span :class="{active:remember}" @click="remember=!remember"></span>
				</p>
				<p class="login-submit">
					<button @click="loginSubmit">Sign in</button>
				</p>
			</div>
		</div>
	</div>

</template>

<script>
	import {mapState} from 'vuex'
	import {aesEncrypt} from "../utils/lib";

	export default {
        name: "Login",
		data(){
        	return {
        		account:'',
				password:'',
				remember:false,
				loginInfoShow:false,
				loginInfo:'',
				loginOK:true

			}
		},
		computed:{
			...mapState(['screenHeight']),
		},
		beforeRouteEnter(to,from,next){
        	console.log(to,from);
        	if (!from.name){ //非路由方式进入
        		if (window.localStorage.getItem('BB3000_token')){
        			console.log('//非路由方式进入,存在token，回去主页等待验证');
					next('/');
				}//存在token，回去主页等待验证

				else{
					console.log('//非路由方式进入,没有token，允许进行登录');
					next()
				}//没有token，允许进行登录

			}
			else{//路由方式进入
				if (to.meta.loginStatus){
					console.log('路由方式进入，已经登录过');
					next('/');
				} //已经登录过
				else{
					console.log('路由方式进入，没登录');
					next();
				}

			}
		},
		methods:{
        	loginSubmit(){
				if (this.account && this.password) {
					let data = {
						account:this.account,
						psw:this.password,
						remember: this.remember?1:0
					};
					this.$post('/apis/auth/login.php',aesEncrypt(JSON.stringify(data))).then(response=>{
						if (response.data.code > 0){
							//信息错误
							this.$store.commit('infoBox/callInfoBox',{
								info:'登录失败，请检查帐号密码是否正确',
								ok:false,
								during:3000
							});
						}
						else{
							let data = response.data.data;
							this.$store.commit('account/login',data);
							this.$store.commit('infoBox/callInfoBox',{
								info:'登录成功，返回主页',
								ok:true,
								during:3000
							});
							this.account = this.password = '';
							this.$router.push({name:'homepage'});

						}
					})
				}
				else
					window.alert("make sure you have filled the boxes below")
			},
		}

    }
</script>

<style>
</style>
