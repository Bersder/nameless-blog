<template>
	<div>
		<div class="login-wrap" :style="{height:screenHeight+'px'}">
			<div class="login">
				<h1><router-link to="/">Oshino·Nya</router-link></h1>
				<p>
					<label>
						Username or Email Address
						<input type="text" v-model="account" ref="account">
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
	import {aesEncrypt,getCookie} from "../utils/lib";

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
		mounted() {
        	this.$refs.account.focus();
		},
		computed:{
			...mapState(['screenHeight']),
		},
		beforeRouteEnter(to,from,next){
        	if (!from.name){ //非路由方式进入
        		if (getCookie('utk')){
					next('/');
				}//存在token，回去主页等待验证

				else{
					next()
				}//没有token，允许进行登录

			}
			else{//路由方式进入
				if (to.meta.loginStatus){
					next('/');
				} //已经登录过
				else{
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
						switch (response.data.code) {
							case 0:
								let data = response.data.data;
								this.$store.commit('account/login',data);
								this.$store.commit('infoBox/callInfoBox',{
									info:'登录成功，返回',
									ok:true,
									during:3000
								});
								this.account = this.password = '';
								this.$router.push('/');
								break;
							case 1:
								this.$store.commit('infoBox/callInfoBox',{
									info:'登录失败，请检查帐号密码是否正确',
									ok:false,
									during:3000
								});
								break;
							case 2:
								this.$store.commit('infoBox/callInfoBox',{
									info:'失败过多，请明天再试',
									ok:false,
									during:3000
								});
								break;
							default:
								this.$store.commit('infoBox/callInfoBox',{
									info:'出现未知错误',
									ok:false,
									during:3000
								});
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
