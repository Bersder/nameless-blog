<template>
    <section id="comments" class="comments tl">
		<div id="respond" class="respond">
			<button class="cancel-reply-btn">取消回复</button>
			<h3 class="respond-title">添加新评论</h3>
			<div class="comment-form">
				<div class="comment-info-input">
					<input placeholder="昵称(必填)" v-model="nickname">
					<input placeholder="邮箱(必填，保密)" v-model="email">
					<input placeholder="网站(选填)" v-model="website">
				</div>
				<textarea placeholder="请在这里输入你的评论..." v-model="content"></textarea>
			</div>
			<div class="comment-buttons tr">
				<span><label><input type="checkbox"> 有回复提醒我</label></span>
				<button>提交评论</button>
			</div>
		</div>
		<div class="waiting"></div>
		<div class="comments-main ">
			<h3 class="comments-list-title">Comments<span> | 233 条评论</span></h3>
			<div class="comments-list">
				<div class="comments-list-item">
					<div class="comment-content-wrap">
						<div class="comment-avatar">
							<img src="http://localhost:80/test/me.png" width="50" height="50">
						</div>
						<div class="comment-meta">
							<p class="uname">Bersder</p>
							<span>2018-08-08 23:23:23</span>
						</div>
						<div class="comment-content">
							<p>第一眼一看...... 这电影厅怎么感觉这么熟悉</p>
							<p>第一眼一看...... 这电影厅怎么感觉这么熟悉</p>
							<p>第一眼一看...... 这电影厅怎么感觉这么熟悉</p>
						</div>
						<div class="comment-reply no-select">回复</div>
					</div>
					<div class="comment-children">
						<div class="comments-list">
							<div class="comments-list-item">
								<div class="comment-content-wrap">
									<div class="comment-avatar">
										<img src="http://localhost:80/test/me.png" width="50" height="50">
									</div>
									<div class="comment-meta">
										<p class="uname">Bersder<span><span style="font-weight: normal"> 回复 </span><span>@cxk</span></span></p>
										<span>2018-08-08 23:23:23</span>
									</div>
									<div class="comment-content">
										<p>第一眼一看...... 这电影厅怎么感觉这么熟悉</p>
										<p>第一眼一看...... 这电影厅怎么感觉这么熟悉</p>
										<p>第一眼一看...... 这电影厅怎么感觉这么熟悉</p>
									</div>
									<div class="comment-reply no-select">回复</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>

		<ol class="pager">
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
			post('/apis/apiv6.php',{id:1,type:'code',offset:0}).then(response=>{
				console.log(response.data.data);
				let data = response.data.data;
				this.allCount = data.allCount;
				this.pageNum = Math.ceil(data.commentCount/5);
				data.comments.forEach(e=>{
					e['children'] = this.gen_children(e);
					delete e.replies;
					this.commentList.push(e)
				});
				console.log(this.commentList)


			})
		},
		data(){
        	return {
        		allCount:'??',
				pageNum:1,
				curPage:1,
				commentList:[],

				nickname:'',
				email:'',
				website:null,
				content:'',
				to_id:null,
				to_uid:null,
				to_uname:null
			}
		},
		methods:{
        	gen_children(comment){
        		let stack = [];
        		let children = [];
        		stack.push(comment);
        		let replies;
				while (stack.length){
					console.log('www');
					replies = stack.pop();
					let target = {...replies};
					delete target.replies;
					children.push(target);
					replies = replies.replies;
					for (let i = replies.length - 1; i >= 0; i--) stack.push(replies[i])
				}
				children.shift();
				return children;


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


	.comments-list-title{
		margin-bottom: .2rem;
		border-bottom: .01rem dotted #eaeaea;
	}
		.comments-list-title span{
			font-size: .14rem;
			color: #bbbbbb;
			vertical-align: text-bottom;
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
				.comment-meta>span{
					color: #bbbbbb;
					font-size: .14rem;
				}
			.comment-content-wrap .comment-content{
				margin: .1rem .1rem 0 .65rem;
			}
			#mobile-app .comment-content-wrap .comment-reply{
				opacity: 1;
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


	.pager{
		display: inline-block;
		margin: .2rem 0;
		list-style-type: none;
		color: #bbbbbb;
	}
		.pager li{
			transition: 1s cubic-bezier(.25,.46,.45,.94);
			float: left;
			line-height: .2rem;
			padding: 0 .05rem;
			cursor: pointer;
		}
		.pager li.current{
			color: #00a1d6;
		}
		.pager li:hover{
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
