<template>
    <div>
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="page-img" style="background-image: url('http://127.0.0.1:80/static/img/10.jpg')">
					<div class="page-info">
						<h2 class="intro">友 链</h2>
						<p class="tsukkomi">Boy♂Next♂Door</p>
					</div>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content">
				<div class="link-description tl">
					<h2>壹 · 关于友链</h2>
					<p>作为半个肥宅 + 半个技术宅，每访问一个船新的博客，我总会不自觉地去点开 关于&链接，想着会不会又见到一个技术dalao或者和我志趣相投的人。这是一种非常神奇的体验，遇到同类、发现新事物让我欣喜雀跃（或许也只是我的怪癖而已）。<br><br>不管怎样，现在拥有了自己博客之后，我也能参与到这条链的传递当中了，请多多指教</p>
					<h2>貳 · 几点希望</h2>
					<ul>
						<li>符合社会主义核心价值观，网站不会给人造成困扰</li>
						<li>全站启用 HTTPS 访问 or 支持HTTP/2</li>
						<li>原创内容过半且定期更新</li>
						<li>第一点是硬性要求，不满足直接否决</li>
					</ul>
					<h2>叁 · 交易方式</h2>
					<p>通过评论 or 邮箱留下 <strong>名称，链接，简介，头像</strong> 即可如</p>
					<blockquote>
						<p>Name：忍野喵<br>Link：https://www.bilibili.com<br>Bio：今天喝了典明粥了吗<br>Avatar：https://www.bilibili.com</p>
					</blockquote>
					<p>友達になろう( *・ω・)✄╰ひ╯</p>
				</div>
				<div class="link-category">
					<div class="link_subtitle friends">
						友情链接
						<p>以添加时间为序</p>
					</div>
					<div class="friend-list">
						<ul>
							<li v-for="(item,index) in FList" :key="index">
								<a :href="item.href" target="_blank" :title="item.message" rel="noopener">
									<img :src="item.image">
									<h5>{{item.name}}</h5>
									<p>{{item.message}}</p>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="link-category">
					<div class="link_subtitle">
						四次元工具箱
						<p>从最常用解析工具到各种神奇的网站</p>
					</div>
					<div class="link-list">
						<ul>
							<li v-for="(item,index) in TList" :key="index">
								<a :href="item.href" target="_blank" rel="nofollow">{{item.name}}</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="link-category">
					<div class="link_subtitle">
						A·C·G
						<p>肥宅天堂</p>
					</div>
				</div>
				<div class="link-category">
					<div class="link_subtitle">
						森 罗 万 象
						<p>没事多看看，总有所收获</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: "Link",
		created(){

		},
		data(){
        	return {
				FList:[
					{image:'http://localhost:80/static/img/python.png',name:'Oshino',message:'刃下心赛高',href:'https://baidu.com'},
					{image:'http://localhost:80/static/img/python.png',name:'Oshino',message:'刃下心赛高',href:'https://baidu.com'},
				],
				TList:[
					{name:'萌娘百科',href:'https://baidu.com'},
					{name:'THB Wiki',href:'https://baidu.com'},
					{name:'萌娘百科',href:'https://baidu.com'},
					{name:'THB Wiki',href:'https://baidu.com'}
				],

			}
		},
    }
</script>

<style scoped>
	/*-----------------------------------------------暂时重复 请使用article组件覆盖*/
	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: white;
	}
	.pattern-full-width{ /*使用Code组件覆盖*/
		position: relative;
		width: 100%;
		overflow: hidden;
	}
	.pattern-full-width:before{
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.1);
	}
	.page-img{
		background: no-repeat center center;
		background-size: cover;
		background-origin: border-box;
		width: 100%;
		height: 5rem;
		transition: all .5s;
	}
	.page-info{
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		top: 40%;
		color: white;
		padding: 0 .5rem;
		text-shadow: 0.02rem 0.02rem 0.1rem black;
	}
	.page-info .intro{
		font-size: .4rem;
		margin-bottom: .1rem;
		transition: .5s;
	}
	.page-info .tsukkomi{
		font-size: .2rem;
	}
	/*-----------------------------------------------*/
	#mobile-app .link-description{
		padding: .2rem;
	}
	.link-description{
		padding: .2rem .4rem;
	}
	.link-description h2{
		font-size: .2rem;
		letter-spacing: .02cm;
		margin: .25rem 0 .1rem;

	}
	.link-description blockquote{
		font-size: .14rem;
		border-left: .05rem solid #bbbbbb;
		padding: .05rem 0 0 .1rem;
		margin: .15rem 0 .15rem .2rem;
		color: #6a737d;
	}
		.link-description ul{
			margin: .1rem 0;
			padding-left: .4rem;
			list-style: disc;
		}

	.link-category .link_subtitle.friends{
		color: #FF7D7D;
		background: linear-gradient(90deg, #ffffff, #fff3f3, #ffffff);
	}
	.link-category .link_subtitle {
		margin: .2rem 0;
		padding: .1rem 0;
		font-weight: bold;
		color: #00a1d6;
		background: linear-gradient(90deg, #ffffff, #f0faff, #ffffff);
	}
		.link_subtitle p{
			font-weight: normal;
			font-size: .12rem;
			padding-top: .05rem;
			color: #bbbbbb;
		}
		#mobile-app .link-category .friend-list{
			padding: 0 .2rem;
		}
		.link-category .friend-list{
			padding: 0 .5rem;
		}
			.friend-list ul,.link-list ul{
				overflow: hidden;
				list-style-type: none;
			}
				#mobile-app .friend-list ul li{
					width: 100%;
				}
				.friend-list ul li{
					position: relative;
					float: left;
					width: 50%;
					border-radius: .05rem;
					transition: all .3s ease-out;
					list-style: none;
				}
				.friend-list ul li:hover{
					background: rgba(230,244,250,.5);
				}
					.friend-list ul li a{
						display: block;
						color: #2c3e50;
						height: .9rem;
						padding: 0 .1rem 0 .9rem;
						text-align: left;
					}
					.friend-list ul li a img{
						position: absolute;
						width: .6rem;
						height: .6rem;
						top: .15rem;
						left: .15rem;
						border-radius: 50%;

					}
					.friend-list ul li a h5{
						padding-top: .15rem;
						font-size: .2rem;
					}
					.friend-list ul li a p{
						font-size: .14rem;
						margin: .1rem 0;
					}
					.friend-list ul li a h5,.fa-mavon-repeat ul li a p{
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
		.link-category .link-list{

		}
			.link-list ul li{
				width: 50%;
				display: inline-block;
				font-size: .14rem;
				padding: .05rem .15rem;
			}
			.link-list ul li:nth-child(odd){
				text-align: right;
			}
			.link-list ul li:nth-child(even){
				text-align: left;
			}
				.link-list ul li a:hover{
					color: #00a1d6;
				}
@media screen and (max-width: 1005px){/*使用Code组件覆盖*/
	.page-img{
		height: 3rem;
	}
	.page-info .intro{
		font-size: .3rem;
	}
}
</style>
