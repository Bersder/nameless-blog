<template>
	<div>
		<div class="page-header-wrap">
			<div class="pattern-center page-header">
				<div class="ph-img" :style="'background-image: url(/root'+imgSrc+')'"></div>
				<div class="ph-info fc">
					<h1 class="entry-title">{{title}}</h1>
					<p class="entry-info">
						<router-link :to="xtype|typeUrl">{{xtype|typeEN2CN}}</router-link>
						<span class="isolate">·</span><span>{{time}}</span><span class="isolate">·</span><span>{{readCount|readNum}}阅读</span>
					</p>
				</div>
			</div>
		</div>

		<div class="page-content-wrap">
			<div class="page-content article">
				<div class="content-area fc">
					<div class="entry-series" id="entry-series" v-if="series">
						<p>本文属于系列<router-link :to="'/series/'+series">《{{series}}》</router-link></p>
					</div>
					<article :id="'post-'+$route.params.id" class="">
						<div class="entry-content tl"><!--markdown 渲染区域-->
							<mavon-editor v-model="rawContent"
										  :imageClick="imageClick"
										  :scrollStyle="mdSet.scrollStyle"
										  :boxShadow="mdSet.boxShadow"
										  :subfield="mdSet.subfield"
										  :defaultOpen="mdSet.defaultOpen"
										  :editable="mdSet.editable"
										  :toolbarsFlag="mdSet.toolbarsFlag"
										  :shortCut="mdSet.shortCut"
										  :tabSize="mdSet.tabSize"
										  :externalLink="mdSet.externalLink"
										  @change="afterRender">
							</mavon-editor>
						</div>
						<footer class="post-footer tl">
							<div class="post-update"><span>{{lut}} Lsat Update</span></div>
							<div class="post-reward"></div><!--暂不开发-->
							<div class="post-copyright">
								<div class="post-copyright-author tl">
									<span class="pck">文章作者：</span>
									<span class="pcv">忍野ニャ</span>
								</div>
								<div class="post-copyright-link tl">
									<span class="pck">文章链接：</span>
									<span class="pcv">{{xurl}}</span>
								</div>
								<div class="post-copyright-license tl">
									<span class="pck">版权声明：</span>
									<span>文章采用</span>
									<span><a class="pcv" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank" rel="nofollow"><i class="iconfont icon-cc" aria-hidden="true"></i>CC BY-NC-SA 4.0</a></span>
									<span>，转载时请标明来源并附上地址</span>
								</div>
							</div>
							<div class="post-bot">
								<div class="post-tags">
									<i class="iconfont icon-tags"></i>
									<ul>
										<li class="tag" v-for="(tag,index) in tags" :key="index"><router-link :to="'/tags/'+tag" rel="tag">{{tag}}</router-link></li>
									</ul>
								</div>
								<div class="post-like pr">
									<a href="javascript:void(0);" title="等待实装" class="like"><i class="iconfont icon-heart"></i><span class="count">{{liked}}</span></a>
								</div>
								<div class="post-share pr">
									<i class="iconfont icon-share clearm"></i>
									<div class="share-option">
										<a class="iconfont icon-wechat">
											<div class="wechat-qrcode">
												<h4>微信扫一扫</h4>
												<div class="qrcode" id="qrcode"></div>
												<p>微信扫一扫打开网页</p>
												<p>左上角分享给朋友/朋友圈</p>
											</div>
										</a>
										<a class="iconfont icon-qq" :href="qqShareUrl" target="_blank" rel="nofollow"></a>
										<a class="iconfont icon-weibo" :href="weiboShareUrl" target="_blank" rel="nofollow"></a>
										<a class="iconfont icon-facebook" :href="facebookShareUrl" target="_blank" rel="nofollow"></a>
										<a class="iconfont icon-twitter" :href="twitterShareUrl" target="_blank" rel="nofollow"></a>
									</div>
								</div>
							</div>
						</footer>
					</article>
					<div class="post-prev">
						<div class="previous tl" v-if="pre" :class="{half:pre&&next}">
							<router-link :to="pre|toUrl">
								<div class="background">
									<img v-lazyload="[`/root${pre.imgSrc}`,`/root${pre.imgSrc}.thumb`]">
								</div>
								<span class="label">PREVIOUS</span>
								<div class="info">
									<h3>{{pre.title}}</h3>
								</div>
							</router-link>
						</div>
						<div class="next tr" v-if="next" :class="{half:pre&&next}">
							<router-link :to="next|toUrl">
								<div class="background">
									<img v-lazyload="[`/root${next.imgSrc}`,`/root${next.imgSrc}.thumb`]">
								</div>
								<span class="label">NEXT</span>
								<div class="info">
									<h3>{{next.title}}</h3>
								</div>
							</router-link>
						</div>
					</div>

					<div class="toc-wrap" :style="{height:articleHeight+'px'}" v-if="!isMobile">
						<div class="toc">
							<ol class="toc-list">
								<li class="toc-list-item" v-for="each in titleList" :key="each.index">
									<a :href="'#'+each.id" class="toc-link" :title="each.des" :class="{'is-active-link':scrollTop>titlePosition[each.index]&&scrollTop<titlePosition[each.index+1]}">{{each.des}}</a>
									<ol v-if="each.subs.length" class="toc-list is-collapsible" :class="{'is-collapsed':isCollapsed(each.subs)}">
										<li class="toc-list-item" v-for="sub in each.subs" :key="sub.index">
											<a :href="'#'+sub.id" class="toc-link" :title="sub.des" :class="{'is-active-link':scrollTop>titlePosition[sub.index]&&scrollTop<titlePosition[sub.index+1]}">{{sub.des}}</a>
										</li>
									</ol>
								</li>
							</ol>
						</div>
					</div>
				</div>
				<comment :id_="xid" :type="xtype" :unique="xid+xtype"></comment>
			</div>
		</div>

	</div>
</template>

<script>
	import {copyText} from "../utils/lib";
	import {mapState} from 'vuex';
	import QRCode from 'qrcodejs2';
	import PCONF from "../config/project.conf";
	import UCONF from "../config/user.conf";
	import CommentModule from "@/components/CommentModule";
	const siteTitle = UCONF.siteTitle;
	export default {
        name: "Article",
		beforeRouteEnter(to,from,next){
        	if(/\d+/.test(to.params.id)&&(!to.params.type||['anime','code','game','trivial'].indexOf(to.params.type)!==-1))next();
			else next('/404')
		},
		beforeRouteLeave(to,from,next){
        	this.$store.commit('appBgC','');
        	next()
		},
		created(){
			this.xid = this.$route.params.id;
			this.xtype = this.$route.name==='article_note'?'note':this.$route.params.type;
			this.xurl = document.location.href.split('#')[0];
			document.title = this.xtype==='article_note'?'笔记XXX'+siteTitle.title_:'文章XXX'+siteTitle.title_;
			this.fetchData({xid:this.xid,_:this.xtype[0]});
		},
		mounted(){
			this.qrcode = new QRCode('qrcode',{
				width:100,
				height:100
			});
		},
        data() {
            return {
            	xid:null,
				xtype:null,
				xurl:'',
				title:'',
				preview:'',
				imgSrc:'/static/images/loading.gif',
				author:'oshino',
				time:'1111-11-11',
				lut:'1111-11-11 11:11:11',
				tags:[],
				commentCount:0,
				liked:0,
				readCount:undefined,
				series:undefined,//acgt特有
				rawContent:'',
				qrcode:null,
				pre:null,
				next:null,
				mdSet:PCONF.MDPreviewMode,

				titleList:[],
				titlePosition:[],
				articleHeight:null,
				imageClick: (e)=>{
            		let imgs = document.querySelectorAll('.v-show-content img');
            		let index = 0;
					for (; index < imgs.length; index++) {
						if(imgs[index]===e)
							break
					}
					this.$store.commit('lumiBox/indexC',index);
					this.$store.commit('lumiBox/showC',true);
				}
			}
        },
		watch:{
        	$route(cur,pre){
				if (/article.*/.test(cur.name)) {
					let type = cur.name === 'article_note'?'note':cur.params.type;
					if(this.xid!==cur.params.id||this.xtype!==type){//如果文章变更放弃缓存重新请求数据
						this.xid = cur.params.id;
						this.xtype = type;
						this.xurl = document.location.href;
						document.title = this.xtype==='article_note'?'笔记XXX'+siteTitle.title_:'文章XXX'+siteTitle.title_;
						this.initData();
						this.fetchData({xid:this.xid,_:this.xtype[0]});
					}
					else{//直接使用缓存，不用等待渲染
						document.title = this.title;
						this.$store.commit('appBgC', this.imgSrc);
						if (!cur.hash)
							document.body.scrollIntoView(true);
						else{
							try {
								document.getElementById(cur.hash.substr(1)).scrollIntoView(true)
							}catch (e) {

							}
						}
					}
				}
			}
		},
		computed:{
        	...mapState(['scrollTop','isMobile']),
			qqShareUrl(){
        		return 'http://connect.qq.com/widget/shareqq/index.html?'+
					'url='+encodeURIComponent(this.xurl)+
					'&title='+encodeURIComponent(this.title)+
					'&source='+encodeURIComponent(this.title)+
					'&desc='+encodeURIComponent(this.preview)+
					'&pics='+encodeURIComponent(location.origin + this.imgSrc)+
					'&summary='+encodeURIComponent(this.preview)
			},
			weiboShareUrl(){
        		return 'http://service.weibo.com/share/share.php?'+
					'url='+encodeURIComponent(this.xurl)+
					'&title='+encodeURIComponent(this.title)+
					'&pic='+encodeURIComponent(location.origin + this.imgSrc)+
					'&appkey='
			},
			twitterShareUrl(){
        		return 'https://twitter.com/intent/tweet?'+
					'text='+encodeURIComponent(this.title)+
					'&url='+encodeURIComponent(this.xurl)+
					'&via='+encodeURIComponent(location.origin)
			},
			facebookShareUrl(){
        		return 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(this.xurl)
			},
		},
        methods:{
        	afterRender(raw,render){
				if (!this.$route.hash)
					setTimeout(()=>document.body.scrollIntoView(true),250);
        		else{
        			setTimeout(()=>document.getElementById(this.$route.hash.substr(1)).scrollIntoView(true),250);
				}
        		if (!this.isMobile)
					setTimeout(()=>this.genNavList(),500);
				setTimeout(()=>this.codeDecorate(),500);
				setTimeout(()=>this.loadImgs(),500)
			},
			isCollapsed(subs) {
				if(!subs.length) return false;
				else return this.scrollTop>this.titlePosition[subs[subs.length-1].index+1];
			},
			initData(){
				this.imgSrc = '/static/images/loading.gif';
				this.title = '';
				this.time = '1111-11-11';
				this.lut = '1111-11-11 11:11:11';
				this.tags = [];
				this.commentCount = 0;
				this.readCount = undefined;
				this.series = undefined;
				this.pre = null;
				this.next = null;
			},
			genNavList(){
        		let ESNode = document.getElementById('entry-series');
				let ESHeight = ESNode?ESNode.offsetHeight:0;
        		while (this.titleList.pop()){}
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
				if (this.titleList.length){
					let sublen = this.titleList[this.titleList.length-1].subs.length;
					let cindex = sublen?this.titleList[this.titleList.length-1].subs[sublen-1].index+1:this.titleList[this.titleList.length-1].index+1;
					this.titleList.push({des:'Comments',id:'comments',index:cindex,subs:[]});
				}
				else
					this.titleList.push({des:'Comments',id:'comments',index:1,subs:[]});
				//console.log(this.titleList);
				this.titlePosition = [];
				this.titlePosition.push(0);
				this.titleList.forEach((v1)=>{
					this.titlePosition.push(document.getElementById(v1.id).offsetTop+540+ESHeight);
					if(v1.subs.length)
						v1.subs.forEach((v2)=>this.titlePosition.push(document.getElementById(v2.id).offsetTop+540+ESHeight))
				});
				this.titlePosition[this.titlePosition.length-1] -= 600+ESHeight;
				this.titlePosition.push(document.body.offsetHeight);
				this.articleHeight = document.getElementsByClassName('content-area')[0].offsetHeight+380;
				//console.log(this.titlePosition)
			},
			codeDecorate(){
				let blocks = document.querySelectorAll('.v-show-content pre code');//下面是代码块修饰，待markdown渲染完后，添加侧边行数和复制按钮
				blocks.forEach(e=>{
					let copyBtn = document.createElement('button');
					copyBtn.innerText = 'Copy';
					copyBtn.classList.add('copy-btn');
					copyBtn.onclick = (e) => {
						let flag = copyText(e.target.previousElementSibling.innerText);
						if (flag)
							this.$store.commit('infoBox/callInfoBox',{info:'代码拷贝成功', ok:true, during:2000});
						else
							this.$store.commit('infoBox/callInfoBox',{info:'代码拷贝失败', ok:false, during:2000});
					};
					e.parentElement.appendChild(copyBtn);

					let numberring = document.createElement('ul');
					numberring.classList.add('line-numbers-rows');
					for (let i=1;i<=e.innerText.split('\n').length-1;i++){
						let li = document.createElement('li');
						li.innerText = i;
						numberring.appendChild(li)
					}
					e.parentElement.appendChild(numberring);
				})
			},
			loadImgs(){
				let imgs = document.querySelectorAll('.v-show-content img');
				let IDTs = [];
				imgs.forEach(e=>{
					IDTs.push({imgSrc:e.src,description:e.alt})
				});
				this.$store.commit('lumiBox/imgsC',IDTs)
			},
			fetchData(data){
				this.$fetch('/apis/apiv3.php',data).then(response=>{
					if (response.data.code < 1) {
						let data = response.data.data;
						this.rawContent = data.rawContent || '';
						this.title = data.info.title;
						document.title = this.title+siteTitle.title_;
						this.preview = data.info.preview;
						this.imgSrc = data.info.imgSrc;
						this.$store.commit('appBgC', this.imgSrc);
						this.author = data.info.author;
						this.time = data.info.time.substr(0,10);
						this.lut = data.info.lut;
						this.tags = data.info.tags;
						this.commentCount = parseInt(data.info.commentCount);
						this.liked = parseInt(data.info.liked);
						this.readCount = data.info.readCount;
						this.series = data.info.series;//acgn特殊处理
						this.pre = data.pre;
						this.next = data.next;
						this.qrcode.makeCode(this.xurl);
					}
					else{
						//不存在该文章
						this.$router.push('/404');
					}
				})
			}

		},
		filters:{
        	toUrl(item){
        		if (item)
					return item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id;
        		else
					return '';
			},
			typeUrl(type){
        		if (type)
					return type==='note'?'/note':'/archive/'+type;
        		else
        			return ''
			},
			typeEN2CN(type){
        		if (type)
					if (type==='anime')return 'Anime';
					else if (type==='code')return '极客';
					else if (type==='game')return '游民';
					else return type==='trivial'?'随写':'笔记';
				else
					return '???'
			},
			readNum(count){
				return count?count.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,'):'???'
			},
		},
		components:{
        	comment:CommentModule
		},
	}
</script>

<style>
</style>
