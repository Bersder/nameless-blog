<template>
    <div>
		<div class="space-h-wrap">
			<div class="h-inner">
				<div class="h-user">
					<div class="h-info">
						<div class="h-avatar">
							<img src="http://localhost:80/uploads/avatar/me.png">
						</div>
						<div class="h-basic">
							<p>
								<span class="h-name">忍野喵</span>
								<span class="h-status"><i class="iconfont icon-gezi"></i> 咕咕咕</span>
							</p>
							<div class="h-sign">
								<input type="text" @change="signChange" v-model="signature">
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

				</div>
				<div class="">

				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import {post} from "../util/http";
	export default {
        name: "Space",
		components: {

		},
		created(){

		},
		data(){
        	return{
				signature:'编辑个性签名'
			}
		},
		methods:{
        	signChange(e){

			}
		}
    }
</script>

<style scoped>
	.h-inner{
		position: relative;
		padding-top: 1.2rem;
		max-width: 11rem;
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
						background: #f45a8d;
						cursor: pointer;
					}
						.h-status i{
							font-size: .12rem;
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
		max-width: 11rem;
		height: .6rem;
		background: white;
		border-radius: 0 0 .05rem .05rem;
	}

@media screen and (max-width: 1000px) {
	.h-inner{
		margin: .5rem auto 0;
	}
}
</style>
