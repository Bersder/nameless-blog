<template>
    <section id="comments" class="comments tl">
		<div id="respond" class="respond">
			<button class="cancel-reply-btn" v-if="to_id" @click="cancelReply">取消回复</button>
			<h3 class="respond-title">{{to_uname|respondTitle}}<span v-show="to_id&&!isMobile"> | #{{to_id}}</span></h3>
			<div class="comment-form">
				<div class="comment-info-input">
					<input placeholder="昵称(必填)" v-model.trim="nickname" name="nickname">
					<input placeholder="邮箱(必填，保密)" v-model.trim="email" name="email">
					<input placeholder="网站(选填)" v-model.trim="website" name="website">
				</div>
				<span title="除了html、标题、分割线、表格、图片、下划线、标记、上下标"><i class="iconfont icon-markdown"></i>Markdown Supported</span>
				<div class="comment-content-input" v-show="!previewOn"><textarea @keydown="textareaTab" placeholder="说点什么吧..." v-model="content"></textarea></div>
				<div class="comment-content preview" v-show="previewOn" v-html="contentPreview" v-highlight></div>
			</div>
			<div class="comment-robot-check">
				简单数学题：{{add1}} + {{add2}} = <input type="text" v-model.trim="sum">
			</div>
			<div class="comment-buttons tr">
				<div class="emotion pl" :class="{'emo-open':emoBoxShow}">
					<span class="emotion-toggle" @click="emoBoxShow=!emoBoxShow"><i class="iconfont icon-emoji ibold"></i>表情</span>
					<div class="emotion-box">
						<div class="emo-title"><span>{{emoData[emoIndex].emoSeries}}</span></div>
						<div class="emo-wrap" :class="{'emo-text':!emoData[emoIndex].pic}">
							<a v-for="item in emoData[emoIndex].emoList"
							   :title="item.des"
							   @click="insertEmo(item,emoData[emoIndex].pic)"><img v-if="emoData[emoIndex].pic" :src="'/root'+item.imgSrc" :alt="item.des"><span v-else>{{item}}</span></a>
						</div>
						<div class="emo-tabs">
							<a v-for="(item,index) in emoData" :key="index" @click="emoIndex=index" :class="{cur:index===emoIndex}"><img :src="'/root'+item.thumbnail" :alt="item.emoSeries" height="22" width="22"></a>
						</div>
					</div>
				</div>

				<span><label><input type="checkbox" v-model="notifyMe"> 回复提醒</label></span>
				<button @click="commentPreview">{{previewOn?'返回编辑':'预览'}}</button>
				<button @click="commentSubmit" >提交评论</button>
			</div>
		</div>
		<div class="comments-main" id="anchor">
			<h3 class="comments-list-title">Comments<span> | {{allCount}} 条评论</span></h3>
			<div class="waiting" v-show="commentWaiting">
				<div class="rect1"></div>
				<div class="rect2"></div>
				<div class="rect3"></div>
				<div class="rect4"></div>
				<div class="rect5"></div>
			</div>
			<div class="comments-list" v-if="allCount" style="overflow: hidden;">
				<div class="comments-list-item" :id="'comment-'+comment.id" v-for="comment in commentList" :key="comment.id">
					<div class="comment-content-wrap">
						<div class="comment-avatar">
							<img src="/root/site/static/spinner-preloader.svg" class="lazyload" :data-src="comment.avatar||'/root/site/static/passerby.png'">
						</div>
						<div class="comment-meta">
							<p class="uname"><a :href="comment.ulink">{{comment.uname}}</a></p>
							<span class="comment-time" :title="comment.datetime.substr(0,16)">{{comment.datetime|commentTime}}</span>
							<span v-show="!isMobile" class="comment-id">#{{comment.id}}</span>
						</div>
						<div class="comment-content" v-html="commentRenderer(comment,false)" v-highlight>
						</div>
						<button class="comment-reply no-select" @click="replyThis(comment.id,comment.uid,comment.uname)">回复</button>
					</div>
					<div class="comment-children">
						<div class="comments-list">
							<div class="comments-list-item" :id="'comment-'+reply.id" v-for="reply in comment.children" :key="reply.id">
								<div class="comment-content-wrap">
									<div class="comment-avatar">
										<img src="/root/site/static/spinner-preloader.svg" class="lazyload" :data-src="reply.avatar||'/root/site/static/passerby.png'">
									</div>
									<div class="comment-meta">
										<p class="uname"><a :href="reply.ulink">{{reply.uname}}</a><span v-show="!isMobile"><span style="font-weight: normal"> 回复 </span><span>@{{reply.to_uname}}<span class="reply-id"> | #{{reply.parent_id}}</span></span></span></p>
										<span class="comment-time" :title="comment.datetime.substr(0,16)">{{reply.datetime|commentTime}}</span>
										<span v-show="!isMobile" class="comment-id">#{{reply.id}}</span>
									</div>
									<div class="comment-content" v-html="commentRenderer(reply,true)" v-highlight>
									</div>
									<button class="comment-reply no-select" @click="replyThis(reply.id,reply.uid,reply.uname)">回复</button>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
			<div class="no-comment" v-if="!allCount">
				<h3>这里什么都没有`╮(￣▽￣)╭` </h3>
			</div>
		</div>
		<ol class="c-pager" v-if="pageNum>1">
			<li class="prev" @click="curPage--" v-if="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
			<li v-show="curPage>=4" @click="curPage=1">1</li>
			<li v-if="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
			<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
			<li v-if="curPage<=pageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
			<li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
			<li class="next" @click="curPage++" v-if="curPage!==pageNum"><i class="iconfont icon-caretright"></i></li>
		</ol>
	</section>
</template>

<script>
	import {copyText} from "../utils/lib";
	import marked from 'marked';
	import hljs from "highlight.js"
	import {unique,randInt} from "../utils/lib";
	export default {
        name: "CommentModule",
		async created(){
			let renderer = new marked.Renderer();
			renderer.heading = (text, level, raw, slugger) => '<p>'+ text +'</p>';
			renderer.hr = () => '';
			renderer.table = (header, body) => '';
			renderer.tablerow = content => '';
			renderer.tablecell = (content, flags) => '';
			marked.setOptions({
				renderer: renderer,
				gfm: true,
				tables: true,
				breaks: true, //不开启时，单个换行只会p内\n换行（表现为空格）、多个换行会生成两个p;开启时单个换行会导致p内br换行，多个换行会导致两个p间br换行
				pedantic: false,
				sanitize: true,//开启时忽略rawString中的html标签
				smartLists: true,
				smartypants: false
			});
			this.genRandAdd();
			await this.fetchEmo();
			this.fetchComment(0);
		},
		data(){
        	return {
        		allCount:'??',
				pageNum:1,
				curPage:1,
				newing:false,//用于标识“需要更新”，同步curPage和unique的
				commentWaiting:true,
				commentList:[],

				nickname:'',
				email:'',
				website:'',
				content:'',
				contentPreview:'',
				previewOn:false,

				emoData:[{emoSeries:'',emoList:[]}],
				emoMap:{},
				emoBoxShow:false,
				emoIndex:0,

				add1:NaN,
				add2:NaN,
				sum:'',

				to_id:null,
				to_uid:null,
				to_uname:null,
				notifyMe:true,
			}
		},
		watch:{
			curPage(cur,pre){
				this.commentWaiting = true;
				this.commentList.length = 0;
				this.fetchComment((cur - 1)*10);
				if (this.newing)//被unique叫去更新
					this.newing = false;
				else//页内跳转
					setTimeout(()=>document.getElementById('comments').scrollIntoView(true),100);
			},
			unique(cur,pre){//文章发生更新，评论跟着更新
				this.allCount = '??';
				this.pageNum = 1;
				if (this.curPage === 1){ //原来就在第一页，不去触发curPage，自己去更新数据
					//原来在第一页，自己更新
					this.commentWaiting = true;
					this.commentList.length = 0;
					this.fetchComment(0);
				}
				else{//原来不在第一页，更新并触发curPage，让他更新数据，
					//原来不在第一页，让curPage更新
					this.newing = true;
					this.curPage = 1;
				}
			}
		},
		methods:{
			commentRenderer(item,isReply){//存在一个问题：发生任意更新时全部评论会调用一次，v-html的郭？如果真这样可以不要contentPreview将其纳入commentRenderer
				//let start = (isReply&&this.isMobile)?'回复 @**'+item.to_uname+'** | [#'+item.parent_id+'](#comment-'+item.parent_id+')：':'';
				let start = (isReply&&this.isMobile)?'回复 [@'+item.to_uname+'](#comment-'+item.parent_id+')：\n':'';
				return marked(this.emoRenderer(start+item.content))
			},
			commentPreview(){
				if (!this.previewOn)
					this.contentPreview = marked(this.emoRenderer(this.content));
				this.previewOn = !this.previewOn;
			},
			emoRenderer(raw){
				let tmp = raw;
				let replaceSrcList = tmp.match(/∫f\(.+?\)/g);
				if (replaceSrcList){ //当使用了表情包后，需要转义替换以便mark
					let replaceDstList = [];
					let replaceAltList = [];
					replaceSrcList = unique(replaceSrcList);
					replaceSrcList.forEach(e=>{
						let alt = e.match(/∫f\((.+?)\)/)[1];
						replaceAltList.push(alt);
						replaceDstList.push(this.emoMap[alt]);
					});
					// console.log(replaceSrcList);
					// console.log(replaceAltList);
					// console.log(replaceDstList);
					for (let i = 0; i < replaceSrcList.length; i++){
						let reg = new RegExp(replaceSrcList[i].replace('(','\\(').replace(')','\\)'),'g');
						if (replaceDstList[i])//没有的表情不进行渲染
							tmp = tmp.replace(reg,'!['+replaceAltList[i]+'](/root'+replaceDstList[i]+') ');
						else
							tmp = tmp.replace(reg,' ');
					}
				}
				return tmp
			},
			insertEmo(item,isPic){
				this.content = isPic?this.content + item.insert:this.content + item.replace(/_/g,'\\_');
			},
			genRandAdd(){
				this.add1 = randInt(-50,50);
				this.add2 = randInt(-50,50);
				this.sum = '';
			},
			textareaTab(e){
				if (e.keyCode === 9){//支持tab输入
					let target = e.target;
					if (document.selection){
						let sel = document.selection.createRange();
						sel.text = '    ';
					}
					else if (typeof target.selectionStart==='number'&&typeof target.selectionEnd==='number'){
						let startPos = target.selectionStart, endPos = target.selectionEnd;
						let cursorPos = startPos, tmp = this.content;
						this.content = tmp.substring(0,startPos) + '    ' +tmp.substring(endPos,tmp.length);
						cursorPos += 4;
						setTimeout(() => target.selectionStart = target.selectionEnd = cursorPos, 10);
					}
					else{
						this.content += '    ';
					}
					if (e&&e.preventDefault)
						e.preventDefault();
					else
						window.event.returnValue = false;
				}
			},
			async fetchEmo(){
				let response = await this.$fetch('/emo/emo.json');
				let data = response.data;
				data.forEach(e=>{
					e.thumbnail = e.path + e.thumbnail;
					if (e.pic){
						let g = e.path.split('/')[2]+'_';//类别前缀
						e.emoList.forEach(f=>{
							f.des = g + f.des;
							f.imgSrc=e.path+f.imgSrc;
							f.insert = '∫f(' + f.des + ')';
							this.emoMap[f.des] = f.imgSrc;
						});
					}
				});
				this.emoData = data;
			},
        	fetchComment(offset){
				this.$post('/apis/apiv6.php',{id:this.id_,type:this.type,offset:offset}).then(response=>{
					if (response.data.code < 1) {
						let data = response.data.data;
						this.allCount = parseInt(data.allCount);
						this.pageNum = Math.ceil(data.commentCount/10);
						//console.log(this.allCount,this.pageNum);
						this.commentWaiting = false;
						data.comments.forEach(e=>{
							e['children'] = this.gen_children(e);
							delete e.replies;
							this.commentList.push(e)
						});
					}
				})
			},
        	gen_children(comment){
        		let stack = [];
        		let children = [];
        		stack.push(comment);
        		let replies;
				while (stack.length){
					replies = stack.pop();
					let target = {...replies};
					delete target.replies;
					children.push(target);
					replies = replies.replies;
					for (let i = replies.length - 1; i >= 0; i--) stack.push(replies[i])
				}
				children.shift();
				return children;
			},
			replyThis(id,uid,uname){
        		if (id!==this.to_id){
					this.to_id = id;
					this.to_uid = uid;
					this.to_uname = uname;
					let target = document.getElementById('comment-'+id);
					target.appendChild(document.getElementById('respond'));
					document.getElementById('respond').scrollIntoView(false);
				}

			},
			cancelReply(){
        		this.to_id = this.to_uid = this.to_uname= null;
        		document.getElementById('comments').insertBefore(document.getElementById('respond'),document.getElementById('anchor'))
			},
			commentSubmit(){
				if (!this.sum){
					this.$store.commit('infoBox/callInfoBox',{info:'请完成简单数学题', ok:false, during:4000});
					return;
				}
				if (this.add1+this.add2==this.sum){
					if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)&&this.nickname&&this.content){
						if (!this.website || (this.website && /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/#])+$/.test(this.website))){ //网址验证
							let data = {
								puzzle:btoa(this.add1+','+this.add2+','+this.sum),
								id:this.id_,
								type:this.type,
								nickname:this.nickname,
								email:this.email,
								website:this.website,
								content:this.content.trim(),
								to_id:this.to_id,
								to_uid:this.to_uid,
								//to_uname:this.to_uname,
								notifyMe:this.notifyMe
							};
							if(window.confirm('即将提交评论，是否确认')){
								this.$post('/apis/apiv7.php',data).then(response=>{
									if (response.data.code<1)
										location.reload();
									else
										this.$store.commit('infoBox/callInfoBox',{info:'评论发布失败', ok:false, during:3000});
										//console.warn('评论失败，错误编号：'+response.data.code)
								})
							}
							else
								return;
						}
						else{
							window.alert('网址不合法');
							return;
						}
					}
					else{
						//!!信息不全
						window.alert('请检查必要信息是否完整且正确');
						return;
					}
				}
				else{
					this.$store.commit('infoBox/callInfoBox',{info:'数学题不通过', ok:false, during:4000});
				}
				this.genRandAdd();
			}
		},
		computed:{
			pageList:function () {
				if(this.pageNum===1)return [1];
				else if(this.pageNum===2)return[1,2];
				else if(this.pageNum===3)return[1,2,3];
				else if(this.curPage===1)return[1,2,3];
				else if(this.curPage===2)return[1,2,3,4];
				else if(this.curPage>=3&&this.curPage<=this.pageNum-2)return[this.curPage-2,this.curPage-1,this.curPage,this.curPage+1,this.curPage+2];
				else if(this.curPage===this.pageNum-1)return[this.curPage-2,this.curPage-1,this.curPage,this.pageNum];
				else return[this.curPage-2,this.curPage-1,this.curPage];
			},
			isMobile(){return this.$store.state.isMobile}
		},
		props:['id_','type','unique'],
		filters:{
        	commentTime(datetime){
				let gap = new Date().getTime() -  new Date(datetime).getTime();
				if (gap<60000)return '刚刚';
				else{
					let gap_m = Math.floor(gap/60000);
					if (gap_m<60)return gap_m + '分钟前';
					else{
						let gap_h = Math.floor(gap_m/60);
						if (gap_h<24)return gap_h + '小时前';
						else{
							let gap_d = Math.floor(gap_h/24);
							if (gap_d<30)return gap_d + '日前';
							else return datetime
						}
					}
				}
			},
			respondTitle(to_uname){
        		return to_uname?' @'+to_uname:'添加新评论'
			}
		},
		directives:{
        	highlight(e,dir,vm){
        		let blocks = e.querySelectorAll('pre code');
        		blocks.forEach(e=>{
					let copyBtn = document.createElement('button');
					copyBtn.innerText = 'Copy';
					copyBtn.classList.add('copy-btn');
					copyBtn.onclick = (e) => {
						let flag = copyText(e.target.previousElementSibling.innerText);
						if (flag)
							vm.context.$store.commit('infoBox/callInfoBox',{info:'代码拷贝成功', ok:true, during:2000});
						else
							vm.context.$store.commit('infoBox/callInfoBox',{info:'代码拷贝失败', ok:false, during:2000});
					};
					e.parentElement.appendChild(copyBtn);

        			let numberring = document.createElement('ul');
        			numberring.classList.add('line-numbers-rows');
        			for (let i=1;i<=e.innerText.split('\n').length;i++){
        				let li = document.createElement('li');
        				li.innerText = i;
        				numberring.appendChild(li)
					}
        			e.parentElement.appendChild(numberring);
					hljs.highlightBlock(e)
				})
			}
		}

    }
</script>

<style>
</style>
