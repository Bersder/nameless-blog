<template>
	<transition name="LB">
		<div class="luminous-box-container"  v-if="LBshow" :class="{'sidebar-show':LBsidebarShow}" >
			<div class="luminous-box-bg"></div>
			<div class="luminous-box-inner">
				<div class="luminous-box-topbar">
					<div class="process pl">
						{{LBIndex+1}} / {{LBImgs.length}}&nbsp;&nbsp;&nbsp;
						<span>{{LBTimes[LBIndex].substr(0,16)}}</span>
					</div>
					<div class="toolbar pr">
						<button @click="LBsidebarShow=!LBsidebarShow"><i class="fas fa-bars"></i></button>
						<button @click="autoplay"><i :class="interval?'fas fa-stop':'fas fa-play'"></i></button>
						<button @click="closeLB"><i class="fas fa-times"></i></button>
					</div>
				</div>
				<div class="luminous-box-nav">
					<button @click.stop="LBprevious" class="lprev"><i class="fas fa-arrow-left"></i></button>
					<button @click.stop="LBnext" class="rnext"><i class="fas fa-arrow-right"></i></button>
				</div>
				<div class="luminous-box-stage">
					<transition name="LBimg">
						<div class="luminous-box-img-wrap" v-if="LBimgShow">
							<img :src="LBImgs[LBIndex]">
						</div>
					</transition>

				</div>
				<div class="luminous-box-caption">
					<transition name="LBimg">
						<p v-if="LBimgShow">{{LBDescriptions[LBIndex]}}</p>
					</transition>

				</div>
			</div>
			<div class="luminous-box-sidebar" v-show="LBsidebarShow" >
				<a v-for="(each,index) in LBImgs" @click="jumpto(index)" :class="{active:index===LBIndex}" :style="{backgroundImage:'url('+each+')'}" :title="LBDescriptions[index]"></a>
			</div>
		</div>
	</transition>
</template>

<script>
	import {mapState} from 'vuex'
    export default {
        name: "LuminousBox",
		created(){
        	console.log('creating')
		},
		data(){
        	return {
				LBimgShow:true,
        		LBsidebarShow:false,
				interval:null
			}
		},
		watch:{
			LBshow(cur,pre){
				this.$store.commit('isMaskedC',cur)
			},
		},
		methods:{
			LBnext(){
				if (this.LBIndex<this.LBImgs.length-1){
					this.LBimgShow = false;
					this.$store.commit('lbIndexC',this.LBIndex+1);
					setTimeout(()=>this.LBimgShow = true,200)


				}
			},
			LBprevious(){
				if (this.LBIndex>0){
					this.LBimgShow = false;
					this.$store.commit('lbIndexC',this.LBIndex-1);
					setTimeout(()=>this.LBimgShow = true,200)
				}
			},
			jumpto(index){
				if (this.LBIndex!==index){
					this.LBimgShow = false;
					this.$store.commit('lbIndexC',index);
					setTimeout(()=>this.LBimgShow = true,200);
				}
			},
			closeLB(){
				this.$store.commit('lbShowC',false);
				if (this.interval)
					clearInterval(this.interval);
					this.interval = null;
			},
			autoplay(){
				if (!this.interval)
					this.interval = setInterval(()=>this.jumpto((this.LBIndex+1)%this.LBImgs.length),4000);
				else{
					clearInterval(this.interval);
					this.interval = null
				}
			}
		},
		computed:{
        	...mapState(['LBImgs','LBDescriptions','LBTimes','LBIndex','LBshow'])
		}
    }
</script>

<style scoped>
	.LBimg-enter-active{
		animation: fadeIn .2s cubic-bezier(.25,.46,.45,.94);
	}
	.LBimg-leave-active{
		animation: fadeOut .2s cubic-bezier(.25,.46,.45,.94);
	}
	.LB-enter-active{
		animation: fadeIn .5s cubic-bezier(.25,.46,.45,.94);
	}
	.LB-leave-active{
		animation: fadeOut .5s cubic-bezier(.25,.46,.45,.94);
	}
	.luminous-box-container{
		position: fixed;
		z-index: 2000;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
	}
		.sidebar-show .luminous-box-inner{
			right: 2rem;
		}
		.luminous-box-bg,.luminous-box-inner,.luminous-box-stage{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}

		.luminous-box-bg{
			background: rgba(30,30,30,.9);
		}

			.luminous-box-topbar{
				position: absolute;
				padding-left: .25rem;
				color: #ccc;
				top: 0;
				left: 0;
				right: 0;
				height: .45rem;
				line-height: .45rem;
				z-index: 2010;
			}
				.luminous-box-topbar button{
					background: rgba(30,30,30,.8);
					height: .45rem;
					width: .45rem;
					text-align: center;
					font-size: .18rem;
					float: right;
					color: #bbbbbb;
					transition: 1s cubic-bezier(.25,.46,.45,.94);
				}
				.luminous-box-topbar button:hover,.luminous-box-nav button:hover{
					color: #ffffff;
				}
				.luminous-box-nav button{
					position: absolute;
					background: rgba(30,30,30,.6);
					height: .8rem;
					width: .6rem;
					font-size: .2rem;
					top: 50%;
					transform: translate(0,-50%);
					transition: .5s;
					z-index: 2010;
					color: #bbbbbb;
				}
				.luminous-box-nav button.lprev{
					padding: .2rem .2rem .2rem 0;
					margin-left: .1rem;
					left: 0;
				}
				.luminous-box-nav button.rnext{
					padding: .2rem 0 .2rem .2rem;
					margin-right: .1rem;
					right: 0;
				}
			.luminous-box-stage{
				overflow: hidden;
				z-index: 2004;
			}
				.luminous-box-stage .luminous-box-img-wrap{
					padding: 1rem 0;
					overflow: hidden;
					height: 100%;
					line-height: calc(100% - 2rem);
				}
					.luminous-box-img-wrap img{
						position: relative;
						top:50%;
						transform:translateY(-50%);
						background: transparent;
						max-height: 100%;
						object-fit: cover;
						max-width: 100%;
						user-select: none;
					}
			.luminous-box-caption{
				position: absolute;
				background: linear-gradient(transparent,rgba(30,30,30,.8));
				bottom: 0;
				left: 0;
				right: 0;
				color: white;
				padding: .2rem;
				font-size: .2rem;
				height: 1rem;
				z-index: 2006;
			}
		.luminous-box-sidebar{
			position: absolute;
			background: #dddddd;
			top: 0;
			bottom: 0;
			right: 0;
			width: 2rem;
			padding: .1rem;
			overflow: auto;
			z-index: 2005;
		}
			.luminous-box-sidebar a.active{
				border-color: #FF7D7D;
				box-shadow: 0 .04rem .07rem rgba(0,0,0,.2);
			}
			.luminous-box-sidebar a{
				display: block;
				background: no-repeat center center;
				background-size: cover;
				height: 1rem;
				border: .03rem solid transparent;
				margin-bottom: .05rem;
				cursor: pointer;
				transition: .5s;
			}





</style>
