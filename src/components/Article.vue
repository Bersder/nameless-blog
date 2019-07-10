<template>
	<div>
		<div class="page-header-wrap">
			<div class="pattern-center page-header">
				<div class="ph-img" :style="'background-image: url(http://localhost:80'+imgSrc+')'"></div>
				<div class="ph-info">
					<h1 class="entry-title" @click="genNavList">{{title}}</h1>
					<p class="entry-info">
						<span><router-link to="/"><img src="http://127.0.0.1:80/static/img/2.jpg">{{author}}</router-link></span>
						<span class="isolate">·</span>
						{{time}}
						{{readCount | rfilter}}
					</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content">
				<div class="content-area">
					<article :id="'post-'+$route.params.id" class="">
						{{xtype}},{{xid}}
						<div class="entry-content tl"><!--markdown 渲染区域-->
							<mavon-editor  v-model="rawContent" :codeStyle="mdSet.codeStyle" :subfield="mdSet.subfield" :defaultOpen="mdSet.defaultOpen" :editable="mdSet.editable" :toolbarsFlag="mdSet.toolbarsFlag" ></mavon-editor>
						</div>
						<footer class="post-footer">
							<div class="post-update"><span>{{lut}} Lsat Update</span></div>
							<div class="post-reward"></div><!--暂不开发-->
							<div class="post-copyright">
								<div class="post-copyright-author tl">
									<span class="pck">文章作者：</span>
									<span class="pcv">忍野ニャニャ</span>
								</div>
								<div class="post-copyright-link tl">
									<span class="pck">文章链接：</span>
									<span class="pcv">localhost:8080/test</span>
								</div>
								<div class="post-copyright-license tl">
									<span class="pck">版权声明：</span>
									<span>文章采用</span>
									<span><a class="pcv" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank" rel="nofollow"><i class="fab fa-creative-commons" aria-hidden="true"></i>CC BY-NC-SA 4.0</a></span>
									<span>，转载时请标明来源并附上地址</span>
								</div>
							</div>
							<div class="post-tags pl">
								<i class="fa fa-tags pl"></i>
								<ul style="list-style: none;float: left">
									<li class="tag" v-for="(tag,index) in tags" :key="index"><router-link :to="'/tags/'+tag" rel="tag">{{tag}}</router-link></li> <!--动态-->
								</ul>
							</div>
							<div class="post-like">
								<a href="/" class="like"><i class="far fa-heart"></i><span class="count">{{liked}}</span></a>
							</div>
							<div class="post-share">
								<i class="fas fa-share"></i>
								<div class="share-option">
									<a class="fab fa-weixin" href="/" target="_blank" rel="nofollow"></a>
									<a class="fab fa-qq" href="/" target="_blank" rel="nofollow"></a>
									<a class="fab fa-weibo" href="/" target="_blank" rel="nofollow"></a>
									<a class="fab fa-facebook-square fa-lg" href="/" target="_blank" rel="nofollow"></a>
									<a class="fab fa-twitter-square fa-lg" href="/" target="_blank" rel="nofollow"></a>
								</div>
							</div>
						</footer>
					</article>
					<div class="post-prev">
						<div class="half previous tl">
							<router-link to="/">
								<div class="background" style="background-image: url('http://127.0.0.1:80/static/img/4.jpg')"></div>
								<span class="label">PREVIOUS</span>
								<div class="info">
									<h3>shang</h3>
								</div>
							</router-link>
						</div>
						<div class="half next tr">
							<router-link to="/">
								<div class="background" style="background-image: url('http://127.0.0.1:80/static/img/5.jpg')"></div>
								<span class="label">NEXT</span>
								<div class="info">
									<h3>xia</h3>
								</div>
							</router-link>
						</div>
					</div>

					<div class="toc-wrap" :style="{height:articleHeight+'px'}" >
						<div class="toc">
							<ol class="toc-list">
								<li class="toc-list-item" v-for="each in titleList" :key="each.index">
									<a :href="'#'+each.id" class="toc-link" :class="{'is-active-link':scrollTop>titlePosition[each.index]&&scrollTop<titlePosition[each.index+1]}"> {{each.des}}</a>
									<ol v-if="each.subs.length" class="toc-list is-collapsible" :class="{'is-collapsed':isCollapsed(each.subs)}">
										<li class="toc-list-item" v-for="sub in each.subs" :key="sub.index">
											<a :href="'#'+sub.id" class="toc-link" :class="{'is-active-link':scrollTop>titlePosition[sub.index]&&scrollTop<titlePosition[sub.index+1]}"> {{sub.des}}</a>
										</li>
									</ol>
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import {media} from "../util/global";
	import {fetch} from "../util/http";

    export default {
        name: "Article",
		beforeRouteEnter(to,from,next){
        	if(/\d+/.test(to.params.id)&&(!to.params.type||['anime','code','game','trivial'].indexOf(to.params.type)!==-1))next();
			else next('/')
		},
		created(){
			this.xid = this.$route.params.id;
			this.xtype = this.$route.name === 'article_note'?'note':this.$route.params.type;
			this.fetchData({xid:this.xid,_:this.xtype[0]});
		},
        data() {
            return {
            	xid:null,
				xtype:null,

				title:'',
				imgSrc:'/site/images/loading.gif',
				author:'oshino',
				time:'6666-66-66',
				lut:'6666-66-66 66:66:66',
				tags:[],
				commentCount:0,
				liked:0,
				readCount:undefined,
				series:undefined,//acgt特有
				rawContent:'',

				mdSet:{
					subfield:false,
					defaultOpen:'preview',
					editable:false,
					toolbarsFlag:false,
					scrollStyle:true,
					codeStyle:'darcula'
				},

				titleList:[],
				titlePosition:[],
				articleHeight:null,
				scrollTop:window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,

			}
        },
        mounted() {
        	media.$on('scrollTopC',data=>this.scrollTop = data);
        },
        methods:{
			isCollapsed(subs) {
				if(!subs.length) return false;
				else return this.scrollTop>this.titlePosition[subs[subs.length-1].index+1];
			},
			initData(){
				this.imgSrc = '/site/images/loading.gif';
				this.rawContent = this.title = '';
				this.time = '6666-66-66';
				this.lut = '6666-66-66 66:66:66';
				this.tags = [];
				this.commentCount = 0;
				this.readCount = undefined;
				this.series = undefined;
			},
			genNavList(){
				this.titleList = [];
				let hs = document.querySelectorAll('.v-show-content h2,.v-show-content h3');
				let H2indexs =[];
				for(let i=0;i<hs.length;i++)
					if(hs[i].tagName === 'H2'){
						H2indexs.push(i);
						this.titleList.push({
							id:hs[i].children[0].getAttribute('id'),
							index:i+1,
							des:hs[i].innerText,
							subs:[]
						})
					}
				H2indexs.push(hs.length);
				for(let i=0;i<H2indexs.length-1;i++){
					for(let j=H2indexs[i]+1;j<H2indexs[i+1];j++){
						this.titleList[i].subs.push({
							id:hs[j].children[0].getAttribute('id'),
							index:j+1,
							des:hs[j].innerText,
							subs:false
						})
					}
				}
				//console.log(this.titleList);
				this.titlePosition = [];
				this.titlePosition.push(0);
				this.titleList.forEach((v1)=>{
					this.titlePosition.push(document.getElementById(v1.id).offsetTop+550);
					if(v1.subs.length)
						v1.subs.forEach((v2)=>this.titlePosition.push(document.getElementById(v2.id).offsetTop+550))
				});
				this.titlePosition.push(document.body.offsetHeight);
				this.articleHeight = document.getElementsByClassName('page-content')[0].offsetHeight;
				//console.log(this.titlePosition)
			},
			fetchData(data){
				fetch('/apis/apiv3.php',data).then(response=>{
					let data = response.data;
					//console.log(response.data);
					this.title = data.info.title;
					this.imgSrc = data.info.imgSrc;
					this.author = data.info.author;
					this.time = data.info.time.substr(0,10);
					this.lut = data.info.lut;
					this.tags = data.info.tags;
					this.commentCount = parseInt(data.info.commentCount);
					this.rawContent = data.rawContent || '';
					this.liked = parseInt(data.info.liked);
					this.readCount = data.info.readCount;
					this.series = data.info.series;//acgn特殊处理
					setTimeout(()=>this.genNavList(),600);
				})
			}

		},
		filters:{
        	rfilter(f){
        		if(f)return ' ·' + f + '阅读';
				else return null;
			}
		},
		activated() {
        	let type = this.$route.name === 'article_note'?'note':this.$route.params.type;
			if(this.xid!==this.$route.params.id||this.xtype!==type){//如果文章变更放弃缓存重新请求数据
				this.xid = this.$route.params.id;
				this.xtype = type;
				this.initData();
				this.fetchData({xid:this.xid,_:this.xtype[0]});
				document.body.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest"
				});
			}


		}
	}
</script>

<style scoped>
	.page-content-wrap,.page-header-wrap{
		background: rgba(255,255,255,.5);
	}
	.pattern-center{
		position: relative;
		margin: 0 auto;
		overflow: hidden;
		max-width: 8rem;

	}
	.ph-img:before{
		content: '';
		position: absolute;
		top: 1.5rem;
		left: 0;right: 0;bottom: 0;
		border-top-right-radius: .05rem;
		border-top-left-radius: .05rem;
		background-color: rgba(0,0,0,.2);
	}

	.ph-img{
		border-top-right-radius: .05rem;
		border-top-left-radius: .05rem;
		background: no-repeat center center;
		background-size: cover;
		background-origin: border-box;
		width: 100%;
		height: 4rem;
		margin-top: 1.5rem;
		transition: all .3s;
	}
	.ph-info{
		position: absolute;
		left: 0;
		right: 0;
		color: white;
		text-align: left;
		bottom: .5rem;
		padding: 0 .5rem;
		text-shadow: .02rem .02rem .1rem black;
	}
		.ph-info .entry-title{
			font-weight: 500;
			color: snow;
			margin-left: -.1rem;
		}
		.ph-info .entry-info{
			font-size: .15rem;
			line-height: .4rem;
			padding-top: .2rem;

		}
		.ph-info .entry-info img{
			width: .35rem;
			height: .35rem;
			border-radius: 100%;
			float: left;
			margin-right: .15rem;
		}
		.ph-info .entry-info a{
			color: white;
		}




	.page-content{
		max-width: 8rem;
		padding: 0 .1rem;
		margin: 0 auto;
		background: snow;
	}
		.content-area{
			padding-top: .5rem;
			animation: fadeInUp 1.5s .3s;
		}
			.post-footer{
				border-top: .01rem dashed #ddd;
				border-bottom: .01rem dashed #ddd;
				padding: .2rem .1rem;
				height: 2rem; /*暂定*/
			}
				.post-update{
					font-family: 'Comic Sans MS',sans-serif;
				}
				.post-copyright{
					padding: .2rem 0;
					line-height: .25rem;
				}.pck{color: #7d7d7d;font-weight: bold}.pcv{color: #b3b3b3;text-decoration: underline}a.pcv:hover{color: #FF7D7D}
				.post-tags{
					color: grey;
					text-transform: uppercase;
				}
					.post-tags i{margin-top: .04rem;margin-right: .05rem}
					.post-tags .tag{
						float: left;
						padding: 0 .1rem;
						margin-right: .1rem;
						border: .01rem solid #e5e9ef;
						height: .22rem;
						border-radius: .2rem;
						transition: all .5s ease;
					}
					.post-tags .tag:hover{
						border-color: #00a1d6;
					}
					.post-tags .tag a{
						color: #6d757a;
						font-size: .14rem;
						display: inline-block;
						transition: all .5s ease;
					}
					.post-tags .tag:hover a{
						color: #00a1d6;
					}
				.post-like{
					clear: both;
					float: right;
				}
					.post-like .like{
						color: #ff4646;
						float: right;
					}
				.post-share{
					float: right;
					margin-right: .2rem;
					color: #ff4646;
				}
					.share-option{
						display: none;
						float: left;
						margin-right: .1rem;
						animation: mini-fadeInUp .5s;
					}
					.post-share:hover .share-option{
						display: inline-block;
					}
						.share-option a{
							margin-right: .05rem;
							border-radius: 20%;
						}
						a.fa-weixin{
							 color: #00c500;
							 border: .01rem solid #00c500;
						 }
						a.fa-weibo{
							color:#ff3d36;
							border: .01rem solid #ff3d36;
						}
						a.fa-qq{
							color: lightskyblue;
							border: .01rem solid lightskyblue;
							height: .18rem;
							width: .19rem;
						}
						a.fa-facebook-square{
							color: cornflowerblue;
						}
						a.fa-twitter-square{
							color: lightskyblue;
						}
						a.fa-weixin:hover{
							background: #00c500;
							color: white;
							text-shadow: 0 0 .3rem #00c500;
						}
						a.fa-facebook-square:hover{
							background: cornflowerblue;
							color: white;
							text-shadow: 0 0 .3rem cornflowerblue;
						}
						a.fa-twitter-square:hover{
							background: lightskyblue;
							color: white;
							text-shadow: 0 0 .3rem lightskyblue;
						}
						a.fa-qq:hover{
							background: lightskyblue;
							color: white;
							text-shadow: 0 0 .3rem lightskyblue;
						}
						a.fa-weibo:hover{
							background: #ff3d36;
							color: white;
							text-shadow: 0 0 .3rem #ff3d36;
						}



			.post-prev{
				width: 100%;
				margin: .5rem 0;
				overflow: hidden;
				background: black;
			}
			.post-prev .half{
				width: 50%;
				float: left;
			}
			.post-prev a{
				display: inline-block;
				position: relative;
				width: 100%;
				height: 1.5rem;
				float: left;
			}
			.post-prev .background{
				background: no-repeat center center;
				background-size: cover;
				background-origin: border-box;
				width: 100%;
				opacity: .4;
				height: 1.5rem;
				transition: opacity .5s;
			}
		.previous:hover .background,.next:hover .background{
			opacity: .7;
		}
			.post-prev .label{
				position: absolute;
				display: block;
				font-size: .14rem;
				color: rgba(255,255,255,.8);
				letter-spacing: .01rem;
				z-index: 100;
			}
			.post-prev .info{
				position: absolute;
				z-index: 98;
			}
			.post-prev h3{
				font-size: .16rem;
				color: white;
				margin: .2rem;
			}
			.previous .label{
				top: .4rem;
				left: .4rem;
			}
			.previous .info{
				bottom: .4rem;
				left: .4rem;
			}
			.next .label{
				top: .4rem;
				right: .4rem;
			}
			.next .info{
				bottom: .4rem;
				right: .4rem;
			}


	.toc-wrap{
		position: absolute;
		top: 5.5rem;
		right: calc((100% - 12rem)/2);
		width: 2rem;
		z-index: 99;
		padding: .1rem 0;
		animation: holdFadeIn 3s linear;
		transition: opacity 1s ease-in;
	}
		.toc{
			position: sticky;
			top: 1rem;
		}
			.toc-list{
				padding-left: .1rem;
				list-style: none;
				text-align: left;
			}
			.toc-list .toc-list{
				padding-left: .2rem;
			}
			a.toc-link{
				display: inline-block;
				font-size: .15rem;
				color: #2c3e50;
				margin-bottom: .01rem;
				line-height: .2rem;
			}
			.is-active-link{
				font-weight: bold;
			}
			.toc-link:before{
				content: '';
				display: inline-block;
				position: absolute;
				background: #cbcbcb;
				width: .02rem;
				height: .21rem;
				left: 0;
				transition: height 1s;
				pointer-events: none;
			}
			.is-active-link:before{
				background: #FF6052;
			}
			.is-collapsed a:before{
				height: 0;
			}
	@media screen and (max-width: 1150px) {
		.toc-wrap{
			opacity: 0;
			pointer-events: none;
			display: none;
		}
	}
	@media screen and (max-width: 800px) {
		.ph-img{
			margin-top: .5rem;
			height: 2.5rem;
		}
		.ph-img:before{
			top: .5rem;
		}
	}
	@media screen and (max-width: 650px) {
		.post-prev .half{
			float: none;
			width: 100%;
		}
	}

</style>
