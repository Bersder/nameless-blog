<template>
    <div>
		<div class="blank"></div>
		<div class="page-content-wrap">
			<div class="page-content">
				<h2 class="pc-title">归档</h2>
				<span class="pc-title-en">Archives</span>
				<div class="archives">
					<p class="tr"><a @click="test2">「展开／折叠」</a></p>
					<div class="years-list" v-for="year in year_ord">
						<h3>{{year}} 年</h3>
						<ul class="mons-list">
							<li class="ml-item" v-for="mon in arch_data[year].mon_ord">
								<span class="mon"  @click="test(year,mon)" >{{mon}} 月(加把劲{{arch_data[year][mon].articles.length}}次)</span>
								<ul class="days-list" :id="year+'-'+mon" :style="{height:arch_data[year][mon].articles.length*24+'px'}" >
									<li v-for="art in arch_data[year][mon].articles">
										<span class="day">{{art.day}}日</span>
										<router-link :to="'/archive/'+art.type+'/'+art.aid" >{{art.title}}</router-link>
									</li>
								</ul>
							</li>

						</ul>
					</div>


				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {fetch} from "../util/http";
	import {fast_unique} from "../util/util";

	export default {
        name: "Archive",
		created(){
			fetch('http://localhost:80/apis/apiv4.php').then(response=>{
				this.articles = response.data.data;
				this.articles.forEach(e=>{
					if(!this.arch_data[e.time.slice(0,4)])
						this.arch_data[e.time.slice(0,4)] = {};
					if(!this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)])
						this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)] = {unfolded:false,articles:[]};
					this.arch_data[e.time.slice(0,4)][e.time.slice(5,7)]['articles'].push({aid:e.aid,day:e.time.slice(8,10),title:e.title,type:e.type,readCount:e.readCount,commentCount:e.commentCount})

				});
				this.year_ord = Object.keys(this.arch_data).sort((a,b)=>{return b - a});
				this.year_ord.forEach(e=>{
					this.arch_data[e]["mon_ord"] = Object.keys(this.arch_data[e]).sort((a,b)=>{return b - a});
				});
				console.log(this.arch_data)



			})
		},
        data() {
            return {
				articles:[],
				year_ord:[],
				arch_data:{},
				expand_flag:true
			}
        },
        mounted() {
        },
		methods:{
        	test(y,m){
				let ul = document.getElementById(y+'-'+m);
				if (ul.style.height === '0px')
					ul.style.height = this.arch_data[y][m].articles.length * 24 + 'px';
				else
					ul.style.height = '0px';

			},
			test2(){
        		let es = document.getElementsByClassName('days-list');
				if(this.expand_flag)
					Array.from(es).forEach(e=>e.style.height='0px');
				else
					Array.from(es).forEach(e=>{
						let ym = e.getAttribute('id').split('-');
						let y = ym[0];
						let m = ym[1];
						e.style.height = this.arch_data[y][m].articles.length * 24 + 'px';
					});
				this.expand_flag = !this.expand_flag
			}
		}

    }
</script>

<style scoped>
	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: rgba(55,55,55,.5);
	}
	/*-----------------------------------------------*/
	.pc-title{
		display: inline-block;
		margin: .2rem 0;
		padding-right: .1rem;
		border-right: #ddd dashed .01rem;
		font-weight: normal;
	}
	.pc-title-en{
		padding-left: .1rem;
		color: #a1a1a1;
	}
	.archives{
		text-align: left;
	}
	.archives li{position: relative}
	.archives h3{
		font-size: .2rem;
		padding-left: 1.8rem;
	}
	.mons-list{
		position: relative;
		list-style: none;
		margin-left: .7rem;
		padding: .15rem 0;
	}
	.mons-list:before{
		position: absolute;
		content: '';
		display: block;
		left: 1.4rem;
		top: 0;
		width: .06rem;
		height: 100%;
		background: linear-gradient(to bottom,rgba(80,80,80,0) 0%, rgb(80,80,80) 8%, rgb(80,80,80) 92%, rgba(80,80,80,0) 100%);
		z-index: 5;
	}
	.ml-item>span{position: relative;cursor: pointer}
	.ml-item>span:before{
		position: absolute;
		top: .02rem;
		left: 1.36rem;
		content: '';
		width: .15rem;
		height: .15rem;
		background: white;
		border: .03rem solid #FF7D7D;
		border-radius: .1rem;
		z-index: 10;
		box-sizing: border-box;
	}

		.ml-item .days-list{
			margin-left: 1.05rem;
			padding-left: .5rem;
			overflow: hidden;
			transition: .5s ease-in-out;
		}
			.days-list a{
				color: inherit;
			}
			.days-list a:hover{
				color: #00a1d6;
			}
			.days-list .day{
				color: #FF7D7D;
			}
			.ml-item .days-list li:before{
				position: absolute;
				content: '';
				top: 40%;
				left: -.16rem;
				border-radius: .1rem;
				border: .04rem solid #FF7D7D;
				box-sizing: border-box;
				z-index: 10;
			}
</style>
