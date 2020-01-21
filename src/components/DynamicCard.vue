<template>
    <div class="d-card">
		<div class="author-avatar" :style="{backgroundImage:`url(${ddata.avatar})`}"></div>
		<div class="content tl">
			<p class="author-namae">{{ddata.author}}</p>
			<p class="time">{{ddata.time|commentTime}}</p>
			<div class="d-card-content">
				<div class="text" v-html="dRenderer(ddata,0,0)" v-highlight></div>
				<!--当存在图片时开启下面的imgsbox-->
				<div class="imgsbox no-select" v-if="ddata.imgs.length">
					<div class="thumbnail-wrap" v-if="!zoomingIn">
						<ul class="thumbnail-list fzz">
							<li class="item" v-for="(item,index) in ddata.imgs">
								<div class="img-content" :style="{backgroundImage:`url(${item})`}"></div>
							</li>
						</ul>
					</div>
					<div class="zoom-wrap" v-else>
						<ul class="zoom-control">
							<li><i class="iconfont icon-compress"></i><span>收起</span></li>
							<li><i class="iconfont icon-expand"></i><span>大图</span></li>
							<li><i class="iconfont icon-rotateleft"></i><span>向左旋转</span></li>
							<li><i class="iconfont icon-rotateright"></i><span>向右旋转</span></li>
						</ul>
						<div class="zoom-img">
							<div class="zoom-img-container"><img :src="ddata.imgs[zoomingIndex]"></div>
							<div class="prev"></div>
							<div class="next"></div>
						</div>
						<!--当不止一张图片时才启用滑动栏-->
						<div class="zoom-slider-wrap" v-if="ddata.imgs.length>1">
							<div class="zoom-slider-border" :style="{left:`${zoomingIndex*66}px`}"></div>
							<ul class="zoom-slider fzz">
								<li v-for="(item,index) in ddata.imgs"><img :src="item"></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="d-card-btn-bar">
				<button><i class="iconfont icon-comment"></i>{{ddata.commentCount}}</button>
				<button><i class="iconfont icon-heart"></i>{{ddata.liked}}</button>
			</div>
		</div>
		<div class="bottom">
			<div class="d-card-comment">
				<div id="respond" class="respond">
					<button class="cancel-reply-btn" v-if="to_id" @click="cancelReply">取消回复</button>
					<h3 class="respond-title">{{to_uname|respondTitle}}<span v-show="to_id&&!isMobile"> | #{{to_id}}</span></h3>
					<div class="comment-form">
						<div class="comment-info-input">
							<input placeholder="昵称(必填)" v-model.trim="nickname" name="nickname">
							<input placeholder="邮箱(必填，保密)" v-model.trim="email" name="email">
							<input placeholder="qq(选填，拉取头像)" v-model.trim="qq" name="qqnum">
						</div>
						<span title="除了html、标题、分割线、表格、图片、下划线、标记、上下标"><i class="iconfont icon-markdown"></i>Markdown Supported</span>
						<div class="comment-content-input"><textarea @keydown="textareaTab" placeholder="说点什么吧..." v-model="content"></textarea></div>
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
						<button @click="commentSubmit">提交评论</button>
					</div>
				</div>
				<div class="comments-main" id="anchor">
					<h3 class="comments-list-title">Comments<span> | {{allCount}} 条评论</span></h3>
					<div class="waiting" v-if="commentWaiting">
						<div class="rect1"></div>
						<div class="rect2"></div>
						<div class="rect3"></div>
						<div class="rect4"></div>
						<div class="rect5"></div>
					</div>
					<div class="comments-list" v-else-if="allCount">
						<div class="comments-list-item" :id="'comment-'+comment.id" v-for="comment in commentList" :key="comment.id">
							<div class="comment-content-wrap">
								<div class="comment-avatar">
									<img src="/static/images/spinner-preloader.svg" class="lazyload" :data-src="comment.avatar||'/static/images/passerby.png'">
								</div>
								<div class="comment-meta">
									<p class="uname"><a :href="comment.ulink">{{comment.uname}}</a></p>
									<span class="comment-time" :title="comment.datetime.substr(0,16)">{{comment.datetime|commentTime}}</span>
									<span v-show="!isMobile" class="comment-id">#{{comment.id}}</span>
								</div>
								<div class="comment-content" v-html="dRenderer(comment,1,0)" v-highlight>
								</div>
								<button class="comment-reply no-select" @click="replyThis(comment.id,comment.uid,comment.uname)">回复</button>
							</div>
							<div class="comment-children">
								<div class="comments-list">
									<div class="comments-list-item" :id="'comment-'+reply.id" v-for="reply in comment.children" :key="reply.id">
										<div class="comment-content-wrap">
											<div class="comment-avatar">
												<img src="/static/images/spinner-preloader.svg" class="lazyload" :data-src="reply.avatar||'/static/images/passerby.png'">
											</div>
											<div class="comment-meta">
												<p class="uname"><a :href="reply.ulink">{{reply.uname}}</a><span v-show="!isMobile"><span style="font-weight: normal"> 回复 </span><span>@{{reply.to_uname}}<span class="reply-id"> | #{{reply.parent_id}}</span></span></span></p>
												<span class="comment-time" :title="comment.datetime.substr(0,16)">{{reply.datetime|commentTime}}</span>
												<span v-show="!isMobile" class="comment-id">#{{reply.id}}</span>
											</div>
											<div class="comment-content" v-html="dRenderer(reply,1,1)" v-highlight>
											</div>
											<button class="comment-reply no-select" @click="replyThis(reply.id,reply.uid,reply.uname)">回复</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="no-comment" v-else>
						<h3>这里什么都没有`╮(￣▽￣)╭` </h3>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import marked from 'marked';
	import richTextMixin from "../mixins/Mixin-RichText";
	export default {
        name: "DynamicCard",
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
			await this.fetchEmo();
		},
		data(){
        	return{
				zoomingIn:1,
				zoomingIndex:0,
			}
		},
		methods:{
        	dRenderer(item,isComment,isReply){
        		if (isComment){
					let start = (isReply&&this.isMobile)?`[@${item.to_uname}](#dc-${item.parent_id})`:'';
					return marked(this.emoRenderer(start+item.content))
				}
        		else
        			return marked(this.emoRenderer(item.content))
			},
			commentToggle(){

			},
			imgRotate(direction){

			},
			fetchComment(offset){
				this.$fetch('/apis/apiv16p1.php',{did:this.did,offset:offset}).then(response=>{
					if (response.data.code < 1) {
						let data = response.data.data;
						this.allCount = data.allCount;
						this.pageNum = Math.ceil(data.commentCount/10);
						//console.log(this.allCount,this.pageNum);
						this.commentWaiting = false;
						data.comments.forEach(e=>{
							e['children'] = this.gen_children(e);
							delete e.replies;
							this.commentList.push(e)
						});
						setTimeout(()=>this.$store.commit('lazyCheck'),100);
					}
				})
			},
			commentSubmit(){

			}
		},
		props:['ddata'],
		mixins:[richTextMixin]
    }
</script>

<style>
</style>
