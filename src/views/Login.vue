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
						<input type="password" v-model="password">
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
		<transition name="fadedown">
			<div class="login-info" v-if="loginInfoShow" :style="{background:loginOK?'#e5ffe880':'#ffe3e380',color:loginOK?'#e5ffe8':'#ffe3e3'}">
				<h4><i :class="loginOK?'far fa-check-circle':'fas fa-exclamation'"></i>{{loginInfo}}</h4>
			</div>
		</transition>
	</div>

</template>

<script>
	import {mapState} from 'vuex'
	import {post} from "../util/http";
	import {aesEncrypt} from "../util/util";

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
					post('/apis/auth/login.php',aesEncrypt(JSON.stringify(data))).then(response=>{
						if (response.data.code > 0){
							//信息错误
							this.callLoginInfo('登录失败，请检查帐号密码是否正确',false)
						}
						else{
							let data = response.data.data;
							this.$store.commit('account/login',data);
							this.callLoginInfo('登录成功，即将返回主页',true);
							this.account = this.password = '';
							setTimeout(()=>{
								this.$router.push({name:'homepage'});
							},4000)

						}
					})
				}
				else
					window.alert("make sure you have filled the boxes below")


			},
			callLoginInfo(info,ok){
				this.loginInfo=info;
				this.loginOK = ok;
        		this.loginInfoShow = true;
        		setTimeout(()=>this.loginInfoShow=false,3000)
			}
		}

    }
</script>

<style scoped>
	.fadedown-enter-active{
		animation: infobox-fadeDown .5s cubic-bezier(.25,.46,.45,.94);
	}
	.fadedown-leave-active{
		animation: infobox-fadeDown .5s cubic-bezier(.25,.46,.45,.94) reverse;
	}
	@keyframes infobox-fadeDown {
		0%{
			opacity: 0;
			transform: translate(-50%,-.7rem);
		}
		100%{
			opacity: 1;
			transform: translate(-50%,0);
		}
	}
	.login-info{
		position: fixed;
		top: 0;
		left: 50%;
		height: .7rem;
		padding: 0 .2rem;
		color: #8b8e99;
		line-height: .7rem;
		border-bottom-right-radius: .05rem;
		border-bottom-left-radius: .05rem;
		transform: translateX(-50%);
	}
	.login-wrap{
		position: relative;
	}
	.login-wrap:before{
		content: '';
		position: absolute;
		background-image: url(http://localhost:80/site/bg/loginbg.jpg);
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		filter: blur(2px);
	}
	.login{
		width: 350px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		padding: .2rem .25rem;
		background: rgba(255,255,255,.5);
		border-radius: .05rem;
		text-align: left;
	}
		.login h1{
			text-align: center;
			margin-bottom: .2rem;
		}
		.login label{
			color: #494949;
			font-size: .14rem;
		}
		.login input{
			display: block;
			border: .01rem solid #eaeaea;
			border-radius: .03rem;
			padding: .05rem .1rem;
			transition: .5s;
			color: grey;
			margin-top: .1rem;
			margin-bottom: .15rem;
			width: 100%;
			outline: none;
			font-size: .18rem;
		}
		.login input:focus{
			border-color: #00a1d6;
			color: #2c3e50;
		}
			.login .remember span{
				float: right;
				position: relative;
				display: inline-block;
				width: .4rem;
				height: .2rem;
				border-radius: .1rem;
				background-color: grey;
				cursor: pointer;
				transition: .5s ease;
			}
			.login .remember span.active{
				background-color: #14b119;
			}

			.login .remember span:before{
				content: '';
				position: absolute;
				top: .02rem;
				left: .02rem;
				height: .16rem;
				width: .16rem;
				border-radius: 50%;
				transition: .5s ease;
				background: white;
			}
			.login .remember span.active:before{
				left: .22rem;
			}

			.login .login-submit button{
				display: block;
				width: 100%;
				color: white;
				margin-top: .1rem;
				padding: .05rem .1rem;
				font-size: .16rem;
				line-height: .2rem;
				border-radius: .05rem;
				border: .01rem solid rgba(0,0,0,.1);
				background: linear-gradient(top,#00a1d6, #0093c3);
			}
</style>
