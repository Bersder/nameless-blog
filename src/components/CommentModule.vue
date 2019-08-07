<template>
    <section id="comments" class="comments tl">
		<div id="respond" class="respond">
			<button class="cancel-reply-btn" v-if="to_id" @click="cancelReply">取消回复</button>
			<h3 class="respond-title">{{to_uname|respondTitle}}</h3>
			<div class="comment-form">
				<div class="comment-info-input">
					<input placeholder="昵称(必填)" v-model="nickname" name="nickname">
					<input placeholder="邮箱(必填，保密)" v-model="email" name="email">
					<input placeholder="网站(选填)" v-model="website" name="website">
				</div>
				<textarea placeholder="请在这里输入你的评论..." v-model="content"></textarea>
			</div>
			<div class="comment-buttons tr">
				<span><label><input type="checkbox" v-model="notifyMe"> 回复提醒</label></span>
				<button @click="commentSubmit" >提交评论</button>
			</div>
		</div>

		<div class="waiting" id="anchor" v-show="commentWaiting">
			<div class="rect1"></div>
			<div class="rect2"></div>
			<div class="rect3"></div>
			<div class="rect4"></div>
			<div class="rect5"></div>
		</div>

		<div class="comments-main">
			<h3 class="comments-list-title">Comments<span> | {{allCount}} 条评论</span></h3>
			<div class="comments-list" v-if="allCount">
				<div class="comments-list-item" :id="'comment-'+comment.id" v-for="comment in commentList" :key="comment.id">
					<div class="comment-content-wrap">
						<div class="comment-avatar">
							<img :src="comment.avatar||'http://localhost:80/test/none.png'" width="50" height="50">
						</div>
						<div class="comment-meta">
							<p class="uname"><a :href="comment.ulink">{{comment.uname}}</a> <span class="comment-id pr">#{{comment.id}}</span></p>
							<span :title="comment.datetime.substr(0,16)">{{comment.datetime|commentTime}}</span>
						</div>
						<div class="comment-content">
							<p>{{comment.content}}</p>

						</div>
						<div class="comment-reply no-select" @click="replyThis(comment.id,comment.uid,comment.uname)">回复</div>
					</div>
					<div class="comment-children">
						<div class="comments-list">
							<div class="comments-list-item" :id="'comment-'+reply.id" v-for="reply in comment.children" :key="reply.id">
								<div class="comment-content-wrap">
									<div class="comment-avatar">
										<img :src="reply.avatar||'http://localhost:80/test/none.png'" width="50" height="50">
									</div>
									<div class="comment-meta">
										<p class="uname"><a :href="reply.ulink">{{reply.uname}}</a><span><span style="font-weight: normal"> 回复 </span><span>@{{reply.to_uname}}<span class="reply-id"> | #{{reply.parent_id}}</span></span></span> <span class="comment-id pr">#{{reply.id}}</span></p>
										<span :title="comment.datetime.substr(0,16)">{{reply.datetime|commentTime}}</span>
									</div>
									<div class="comment-content">
										<p>{{reply.content}}</p>
									</div>
									<div class="comment-reply no-select" @click="replyThis(reply.id,reply.uid,reply.uname)">回复</div>
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
			<li class="prev" @click="curPage--" v-show="curPage!==1"><i class="fas fa-caret-left"></i></li>
			<li v-show="curPage>=4" @click="curPage=1">1</li>
			<li v-if="curPage>=5" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
			<li v-for="each in pageList" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
			<li v-if="curPage<=pageNum-4" class="ellipses"><i class="fas fa-ellipsis-h"></i></li>
			<li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
			<li class="next" @click="curPage++" v-show="curPage!==pageNum"><i class="fas fa-caret-right"></i></li>
		</ol>
	</section>
</template>

<script>
	import {post} from "../util/http";

	export default {
        name: "CommentModule",
		created(){
			post('/apis/apiv6.php',{id:this.id_,type:this.type,offset:0}).then(response=>{
				let data = response.data.data;
				this.allCount = parseInt(data.allCount);
				this.pageNum = Math.ceil(data.commentCount/10);
				console.log(this.allCount,this.pageNum);
				this.commentWaiting = false;
				data.comments.forEach(e=>{
					e['children'] = this.gen_children(e);
					delete e.replies;
					this.commentList.push(e)
				});
			})
		},
		data(){
        	return {
        		allCount:'??',
				pageNum:1,
				curPage:1,
				commentWaiting:true,
				commentList:[],

				nickname:'',
				email:'',
				website:'',
				content:'',
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
				post('/apis/apiv6.php',{id:this.id_,type:this.type,offset:(cur-1)*10}).then(response=>{
					console.log(response.data.data);
					let data = response.data.data;
					this.allCount = parseInt(data.allCount);
					this.pageNum = Math.ceil(data.commentCount/10);
					console.log(this.allCount,this.pageNum);
					this.commentWaiting = false;
					data.comments.forEach(e=>{
						e['children'] = this.gen_children(e);
						delete e.replies;
						this.commentList.push(e)
					});
					console.log(this.commentList)
				})
			}
		},
		methods:{
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
					target.appendChild(document.getElementById('respond'))
				}

			},
			cancelReply(){
        		this.to_id = this.to_uid = this.to_uname= null;
        		document.getElementById('comments').insertBefore(document.getElementById('respond'),document.getElementById('anchor'))
			},
			commentSubmit(){
        		if (/\d{11}|^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)&&this.nickname.replace(/^\s*|\s*$/g,'')&&this.content.replace(/^\s*|\s*$/g,'')){
        			if (!this.website || (this.website && /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/#])+$/.test(this.website))){ //网址验证
						let data = {
							id:this.id_,
							type:this.type,
							nickname:this.nickname.replace(/^\s*|\s*$/g,''),
							email:this.email,
							website:this.website,
							content:this.content.replace(/^\s*|\s*$/g,''),
							to_id:this.to_id,
							to_uid:this.to_uid,
							to_uname:this.to_uname,
							notifyMe:this.notifyMe
						};
						if(window.confirm('即将提交评论，是否确认')){
							post('/apis/apiv7.php',data).then(response=>{
								console.log(response);
								if (response.data.code<1)
									location.reload();
								else
									console.warn('评论失败，错误编号：'+response.data.code)
							})
						}
					}
        			else{
        				window.alert('网址不合法')
					}

				}
        		else{
        			//!!信息不全
					window.alert('请检查必要信息是否完整且正确')
				}

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
			}
		},
		props:['id_','type'],
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
		}

    }
</script>

<style scoped>
	.comments .respond{
		position: relative;
	}
		.respond .cancel-reply-btn{
			position: absolute;
			top: .15rem;
			right: .2rem;
			padding: .02rem .05rem;
			border-radius: .02rem;
			background: rgba(0,0,0,.1);
		}
		.respond .respond-title{
			margin: .2rem 0;
		}
			/*------------------------------------*/
			.comment-form .comment-info-input{
				display: flex;
				flex-flow: row wrap;
				justify-content: space-between;
			}
				.comment-info-input input:nth-child(2){
					margin: .05rem;
				}
				.comment-info-input input{
					padding: .05rem;
					border: .02rem solid rgba(0,0,0,.1);
					background: transparent;
					border-radius: .03rem;
					flex: 1;
					outline: none;
					margin: .05rem 0;
					transition: .5s;
				}
				.comment-info-input input:focus,.comment-form textarea:focus{
					border-color: rgba(0,0,0,.3);
				}
			.comment-form textarea{
				display: block;
				margin-top: .1rem;
				padding: .1rem;
				height: 1.5rem;
				resize: none;
				width: 100%;
				border: .02rem solid rgba(0,0,0,.1);
				outline: none;
				background: transparent;
				transition: .5s;
			}
		.respond .comment-buttons{
			margin: .2rem 0;

		}
			.comment-buttons span{
				margin-right: .1rem;
				color: #bbbbbb;
			}
			.comment-buttons button{
				display: inline-block;
				border-radius: 1rem;
				border: .02rem solid rgba(0,0,0,.1);
				padding: .04rem .12rem;
				font-size: .14rem;
				color: #6a737d;
				font-weight: 600;
				transition: .5s;
			}
			.comment-buttons button:hover{
				color: white;
				background: #00a1d6;
			}


	.waiting{
		margin: 1rem auto;
		text-align: center;
		height: .35rem;
		width: .5rem;
		font-size: .1rem;
	}
		.waiting>div{
			display: inline-block;
			height: 100%;
			width: .05rem;
			background: #00a1d6;
			animation: stretchdelay 1.2s infinite ease-in-out;
		}
		.waiting .rect2{
			animation-delay: -1.1s;
		}
		.waiting .rect3{
			animation-delay: -1s
		}
		.waiting .rect4{
			animation-delay: -.9s;
		}
		.waiting .rect5{
			animation-delay: -.8s;
		}


	.comments-list-title{
		margin-bottom: .2rem;
		border-bottom: .01rem dotted #eaeaea;
	}
		.comments-list-title span{
			font-size: .14rem;
			color: #bbbbbb;
			vertical-align: text-bottom;
		}

	.comment-children .comments-list .comments-list-item{
		border-bottom: none;
	}
	.comments-list-item{
		position: relative;
		border-bottom: .01rem solid #eaeaea;
		margin-top: .1rem;
	}
		.comments-list-item .comment-content-wrap{
			position: relative;
			margin-bottom: .15rem;
		}
		#mobile-app .comments-list-item .comment-children{
			margin-left: .3rem;
		}
		#mobile-app .comment-children .comment-avatar img{
			height: .4rem;
			width: .4rem;
		}
		#mobile-app .comment-children .comment-meta,#mobile-app .comment-children .comment-content{
			margin-left: .5rem;
		}
		#mobile-app .comment-content{
			font-size: .14rem;
			margin-right: .2rem;
			margin-top: .05rem;
		}
		.comments-list-item .comment-children{
			margin-left: .65rem;
		}
			.comment-content-wrap .comment-avatar{
				position: absolute;
				top: 0;
				left: 0;
			}
				.comment-avatar img{
					border-radius: 50%;
					transition: .3s cubic-bezier(.25,.46,.45,.94);
				}
				.comment-avatar img:hover{
					transform: scale(1.05);
				}
			.comment-content-wrap .comment-meta{
				margin-left: .65rem;
			}
				.comment-meta .uname{
					margin-bottom: .03rem;
					font-weight: bold;
					font-size: .15rem;
				}
					.uname a{
						color: inherit;
					}
					.uname .comment-id,.uname .reply-id{
						font-size: .12rem;
						vertical-align: text-bottom;
						color: #bbbbbb;
					}
				.comment-meta>span{
					color: #bbbbbb;
					font-size: .14rem;
				}
			.comment-content-wrap .comment-content{
				margin: .1rem .5rem 0 .65rem;
			}
			.comment-content-wrap .comment-reply{
				position: absolute;
				font-size: .12rem;
				padding: 0 .1rem;
				line-height: .2rem;
				top: .15rem;
				right: .2rem;
				background: #9dd9ff;
				color: white;
				opacity: 0;
				cursor: pointer;
				transition: .5s;
			}
			.comment-content-wrap .comment-reply:hover{
				background: #00a1d6;
			}
			.comment-content-wrap:hover .comment-reply{
				opacity: 1;
			}
	.no-comment{
		padding: .4rem 0;
		text-align: center;
	}

	.c-pager{
		display: inline-block;
		margin: .2rem 0;
		list-style-type: none;
		color: #bbbbbb;
	}
		.c-pager li{
			transition: 1s cubic-bezier(.25,.46,.45,.94);
			float: left;
			line-height: .2rem;
			padding: 0 .05rem;
			cursor: pointer;
		}
		.c-pager li.current{
			color: #00a1d6;
		}
		.c-pager li:hover{
			color: #00a1d6;
		}

	@media screen and (max-width: 700px){
		.comment-form .comment-info-input{
			flex-direction: column;
		}
		.comment-info-input input:nth-child(2){
			margin: .05rem 0;
		}
	}
</style>
