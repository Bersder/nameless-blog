<template>
	<div @click="typeExpand=seriesExpand=tiFocus=false">
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="no-img" v-show="!hi" @click="hiAdd">
					<i class="far fa-images"></i>
					<h4>请添加文章头图</h4>
					<p class="tips">支持5MB内的JPG／JPEG／BMP／PNG格式的高清图片</p>
					<p class="tips">（建议大于960*540像素）</p>
				</div>
				<div class="header-img" id="hi" v-show="hi">
					<div class="hi-control">
						<button class="re-add" @click="hiAdd"><i class="fas fa-image"></i> </button>
						<button class="delete" @click="hi=null"><i class="fas fa-trash-alt"></i> </button>
					</div>
				</div>
				<input type="file" @change="hiChange" id="hi-add" hidden>
			</div>
		</div>
		<div class="page-content-wrap" >
			<div class="publish-area">
				<div class="pa-unit">
					<i class="far fa-file"> :</i>
					<input type="text" class="title-input" placeholder="无题" v-model.trim="title">
				</div>
				<div class="pa-unit">
					<i class="far fa-edit">:</i>
					<input type="text" class="preview-input" placeholder="无介绍则截取文章内容开头代之" v-model.trim="preview">
				</div>
				<div class="pa-unit detail-select">
					<div class="tag-btn-wrap" >
						<span>标签</span>
						<div class="tag-btn tl" @click.stop>
							<span v-if="!isMobile" v-for="each in selectedTags" class="tag-item">{{each}} <i class="fas fa-times" @click="deleteTag(each)"></i></span>
							<span class="tag-num" v-if="selectedTags.length">{{selectedTags.length}}</span>
							<input type="text" v-model="inputTags" placeholder="请选中已有标签或新建标签，逗号/分号分隔" class="tag-input" @focus="tiFocus=true;seriesExpand=typeExpand=false" >
							<ul v-show="tiFocus&&tagOptions.length!==0" @mouseover="tiFocus=true">
								<li v-for="each in tagOptions" @click="selectTag(each)" :class="{'t-selected':selectedTags.indexOf(each)!==-1}">{{each}}</li>
							</ul>
						</div>
					</div>
					<div class="type-btn">
						<span>类别</span>
						<button @click.stop="typeExpand=!typeExpand;tiFocus=seriesExpand=false" class="tl">
							<span>{{selectedType}}</span>
							<i class="fas fa-sort-down fa-lg"></i>
						</button>
						<ul v-show="typeExpand">
							<li v-for="each in typeOptions" @click="selectedType=each">{{each}}</li>
						</ul>
					</div>
					<div class="series-btn">
						<span>系列</span>
						<button @click.stop="seriesExpand=!seriesExpand;tiFocus=typeExpand=false" :title="selectedSeries" class="tl">
							<span>{{selectedSeries}}</span>
							<i class="fas fa-sort-down fa-lg"></i>
						</button>
						<ul v-show="seriesExpand">
							<li v-for="each in seriesOptions" @click="selectedSeries=each">{{each}}</li>
							<li @click="selectedSeries='null'">不选择分组</li>
						</ul>
					</div>

					<div class="pa-submit">
						<button @click="launch"><i class="fas fa-rocket"></i> Launch</button>
					</div>
				</div>
				<mavon-editor v-model="rawContent" :codeStyle="mdSetting.codeStyle" :tabSize="mdSetting.tabSize" :toolbars="mdSetting.toolbars" :imageFilter="mdSetting.imageFilter" :subfield="mdSetting.subfield" @imgAdd="$imgAdd" @save="saveTmp" ref=md />
			</div>

		</div>
	</div>

</template>

<script>
import {unique} from "../util/util";
import {post} from "../util/http";
import {post_form} from "../util/http";
import {fetch} from "../util/http";
import {mapState} from 'vuex'
import {mdSetEdit} from "../util/global";
export default {
        name: "Write",
		created(){
        	if(!this.aid){
				fetch('/apis/edit/initw.php').then(response=>{
					this.$router.replace({name:'write',query:{aid:response.data.aid}});
					this.aid=response.data.aid;
					this.tagOptions = response.data.tagOptions || [];
				});
				//全新文章获取其adi，添加至后缀
			}
			else {//如果有后缀，不申请aid，根据现有aid请求保存的信息
				fetch('/apis/edit/initw.php',{aid:this.aid}).then(response=>{
					let art = response.data;
					if(art.exist){
						this.rawContent = art.rawContent || '';
						this.title = art.info.title || '';
						this.selectedType = art.info.type || 'code';
						this.preview = art.info.preview || '';
						this.selectedSeries = art.info.series || 'null';
						this.selectedTags = art.info.tags || [];
						this.tagOptions = art.tagOptions || [];
						//this.seriesOptions = art.seriesOptions || [];
						this.inputTags = art.info.inputTags || '';
						this.hi = art.info.imgSrc || null;
						document.getElementById('hi').style.backgroundImage='url(http://localhost:80'+art.info.imgSrc+')'
					}
					else{
						//不存在aid，重新导向至写文章页/404
						this.$router.push({name:'homepage'})
					}
				})
			}
			if (this.isMobile){
				this.mdSetting.toolbars.subfield = false;
				this.mdSetting.subfield = false;
			}

		},
		computed:{
        	...mapState(['isMobile'])
		},
        data() {
            return {
				mdSetting:mdSetEdit,
            	typeOptions:['anime','code','game','trivial'],
				seriesOptions:[],
				tagOptions:[],

				aid:this.$route.query.aid,
				title:'',
				author:'oshino',
            	selectedType:'code',
				preview:'',
				rawContent:'',
				selectedSeries:'null',
				selectedTags:[],
				inputTags:'',
				hi:null,

				typeExpand:false,
				seriesExpand:false,
				tiFocus:false,
			}
        },
		beforeRouteLeave(to,from,next){
        	if(to.name==='homepage')next();
        	else{
				let r = window.confirm('离开会导致未保存的信息丢失，是否继续');
				if(r)next();
			}

		},
        methods:{
        	selectTag(t){
        		if(this.selectedTags.indexOf(t)===-1)
        			this.selectedTags.push(t);
				else this.selectedTags.splice(this.selectedTags.indexOf(t),1)
			},
			deleteTag(t){
				this.selectedTags.splice(this.selectedTags.indexOf(t),1)
			},
			$imgAdd(pos,$file){
				let param = new FormData();
				param.append('img',$file);
				post_form('/apis/edit/mdimg.php',param).then(response=>this.$refs.md.$img2Url(pos,'http://localhost:80'+response.data[1]))
			},
			hiAdd(){
				document.getElementById('hi-add').click();
			},
			hiChange(e){
        		let file = e.target.files[0];
        		if(/image\/\w+/.test(file.type))
        			if(file.size<5000000){
        				let fr = new FileReader();
        				fr.onload = function(){document.getElementById('hi').style.backgroundImage='url('+fr.result+')'};
        				fr.readAsDataURL(file);
        				this.hi = file;
					}
				else window.alert('请选择正确的文件类型')
			},
			saveTmp(v,r){
				let it;
				if(!this.title){//标题非空
					window.alert('请输入标题');
					return;
				}
        		if(/^([^,;，；]+[,;]?\s*)*$/.test(this.inputTags)){//输入标签合法并处理
        			it = this.inputTags.replace(/^[\s,;]+|[\s,;]+$/gm,'').replace(/\s*[,;]\s*/g,',');
				}
				else{
        			window.alert('inputTags非法');
        			return ;
				}
				let data = {
					type:this.selectedType,
					title:this.title,
					preview:this.preview,
					author:this.author,
					tags:this.selectedTags.join(','),
					inputTags:it,
					series:this.selectedSeries,
					rawContent:v.replace(/\\/g,'\\\\').replace(/'/g,"\\'")
				};
        		post('/apis/edit/saveTmp.php?aid='+this.aid,data);
			},
			launch(){

				if(this.title&&this.rawContent&&this.hi){//检查信息是否完整合法
					let it;
					if(/^([^,;，；]+[,;]?\s*)*$/.test(this.inputTags)){
						it = this.inputTags.replace(/^[\s,;]+|[\s,;]+$/gm,'').replace(/\s*[,;]\s*/g,',').split(',');
						it = unique(it);
						it  = it.filter(v=>{return this.tagOptions.indexOf(v)===-1}).join(',');
						console.log(it,typeof it)
						//然后去重,筛选新标签合并,发送至launch
					}
					else{
						window.alert('inputTags非法');
						return ;
					}
					let data = {
						type:this.selectedType,
						title:this.title,
						preview:this.preview?this.preview:this.rawContent.slice(0,100).replace(/!\[.+]\(.+\)|[#*+~^=> ]/g,'').replace(/\s/g,','),
						author:this.author,
						tags:this.selectedTags.join(','),
						newTags:it,
						series:this.selectedSeries,
						rawContent:this.rawContent.replace(/\\/g,'\\\\').replace(/'/g,"\\'"),
					};
					if(typeof this.hi==='object'){
						let fd = new FormData();
						fd.append('hi',this.hi);
						post_form('/apis/edit/mdimg.php?aid='+this.aid,fd).then(response=>{
							data.imgSrc = response.data[1];
							post('/apis/edit/launch.php?aid='+this.aid,data)
						});
					}
					else{
						data.imgSrc = this.hi;
						post('/apis/edit/launch.php?aid='+this.aid,data)
					}

				}
				else{
					window.alert('标题，内容，图片不能为空');
				}

			},
		}

    }
</script>

<style scoped>
	.pattern-full-width{
		position: relative;
		width: 100%;
		overflow: hidden;
	}
	.header-img:before{/*以上使用code覆盖*/
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.1);
	}
	.no-img{
		margin-top: .7rem;
		color: #99a2aa;
		padding-top: 1.5rem;
		height: 4.5rem;
		cursor: pointer;
		background-color: #eff0f2;
	}
	.no-img:hover{
		background-color: #e8e9eb;
	}
		.no-img .fa-images{
			font-size: .5rem;
		}
		.no-img h4{
			margin: .1rem 0;
		}
		.no-img .tips{
			font-size: .14rem;
		}
	.header-img{
		position: relative;
		background: no-repeat 40% center;
		background-size: cover;
		background-origin: border-box;
		width: 100%;
		height: 4.5rem;
		margin-top: .7rem;
		transition: all .5s;
	}
		.header-img:hover .hi-control{
			opacity: 1;
		}
		.header-img .hi-control{
			position: absolute;
			border-top-left-radius: .05rem;
			bottom: 0;
			right: 0;
			background-color: rgba(0,0,0,.5);
			transition: .2s;
			opacity: 0;
		}
			.header-img .hi-control button{
				border: 0;
				color: white;
				font-size: .2rem;
				outline: none;
				padding: .1rem .15rem;
				line-height: .3rem;
			}
			.header-img .hi-control button:hover{
				transition-duration: .2s;
				background-color: rgba(0,0,0,.5);
			}
	#mobile-app .publish-area{
		padding: .1rem .05rem;
	}
	.publish-area{
		padding:.1rem .2rem;
	}
	.pa-unit{
		margin-bottom: .1rem;
		position: relative;
	}
	#mobile-app .pa-unit.detail-select>div{
		margin-right: 0;
	}
	.pa-unit.detail-select{
		margin: 0;
		text-align: left;
	}
		.pa-unit .fa-file,.pa-unit .fa-edit{
			position: absolute;
			top: 50%;
			left: .2rem;
			transform: translate3d(0,-50%,0);
		}
		.title-input{
			height: .4rem;
			width: 100%;
			font-size: .2rem;
			padding-left: .5rem;
			outline: none;
			border: .01rem solid #adadad;
			border-radius: .05rem;
		}
		.preview-input{
			padding-left: .5rem;
			height: .3rem;
			width: 100%;
			outline: none;
			border: .01rem solid #adadad;
			border-radius: .05rem;
		}

		.type-btn,.series-btn,.tag-btn-wrap,.cat-btn{
			display: inline-block;
			position: relative;
			margin-right: .1rem;
			margin-bottom: .05rem;
		}
			.type-btn button,.series-btn button,.cat-btn button{
				position: relative;
				width: 1.5rem;
				text-transform: capitalize;
				padding: 0 .25rem 0 .15rem;
				background: white;
				border: .01rem solid #ccd0d7;
				border-radius: .05rem;
			}
				.type-btn button span,.cat-btn button span,.series-btn button span{
					display: block;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					line-height: .3rem;
				}
			.type-btn i,.series-btn i,.cat-btn i{
				position: absolute;
				right: .05rem;
				top: .05rem;
			}
			.type-btn ul,.series-btn ul,.cat-btn ul {
				background: snow;
				top: 100%;
				right: 0;
				width: 1.5rem;
				margin-top: .01rem;
				border-radius: .03rem;
				box-shadow: 0 .04rem .07rem rgba(0,0,0,.2);
				padding: .1rem 0;
				z-index: 1600;
				position: absolute;
			}.series-btn ul{left: .5rem !important;}

				.type-btn li,.series-btn li,.cat-btn li{
					cursor: pointer;
					text-align: left;
					padding: 0 .2rem;
					line-height: .25rem;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.type-btn li:hover,.series-btn li:hover,.cat-btn li{
					background: #eaeaea;
				}
		.tag-btn-wrap{
			max-width: 9rem;
			width: 100%;
		}
			.tag-btn{
				display: inline-block;
				position: relative;
				width: calc(100% - .4rem);
				background: white;
				padding: 0 .1rem;
				border: .01rem solid #ccd0d7;
				border-radius: .05rem;
			}
				.tag-input{
					display: inline-block;
					height: .3rem;
					background: transparent;
					outline: none;
					border: none;
					max-width: 3.1rem;
					width: 100%;
				}
				.tag-btn .tag-item{
					display: inline-block;
					height: .2rem;
					line-height: .2rem;
					background: #a6f1fb;
					font-size: .12rem;
					margin-right: .05rem;
				}
				.tag-btn .tag-num{
					display: inline-block;
					position: absolute;
					top: -.05rem;
					left: -.05rem;
					height: .16rem;
					width: .16rem;
					line-height: .16rem;
					text-align: center;
					color: white;
					font-size: .12rem;
					background: #FF7D7D;
					border-radius: 50%;
				}
				.tag-btn span i{
					cursor: pointer;
				}
				.tag-btn ul{
					position: absolute;
					top: 100%;
					margin-top: .02rem;
					left: 0;
					width: 3rem;
					font-size: .14rem;
					color: grey;
					background: snow;
					border-radius: .03rem;
					box-shadow: 0 .04rem .07rem rgba(0,0,0,.2);
					padding: .1rem .15rem;
					z-index: 1600;

				}
					.tag-btn li{
						float: left;
						padding: 0 .1rem;
						margin-right: .05rem;
						margin-bottom: .05rem;
						border: .01rem solid #d9d9d9;
						height: .2rem;
						line-height: .18rem;
						border-radius: .1rem;
						cursor: pointer;
						transition: all .5s ease;
					}
					.tag-btn li:hover{
						color: #00a1d6;
						border-color: #00a1d6;
					}
					.tag-btn li.t-selected{
						color: white;
						background: #00a1d6;
						border-color: #00a1d6;
					}
	.pa-submit{
		display: inline-block;
		margin-bottom: .05rem;
	}
	#mobile-app .pa-submit{
		display: block;
	}
	#mobile-app .pa-submit button{
		width: 100%;
	}
	.pa-submit button{
		width: 3rem;
		line-height: .3rem;
		padding: 0 .1rem;
		color: #535a63;
		background: snow;
		border: .01rem solid #ccc;
		border-radius: .05rem;
		transition: .5s;
	}
	.pa-submit button:hover{
		border-color: #00a1d6;
		color: #00a1d6;
	}
	/*{ article_info:
    aid 文章id 无符smallint 主键 自增长
    type 类型 varchar（10）
    title 标题 varchar （30）
    preview 预览 varchar（100）
    imgSrc 头图地址 varchar（100）后台生成
    author 作者 varchar（20）
    time 时间 datetime 后台生成？
    tags 标签集 varchar（100）
    series 系列 varchar（50）
    commentCount 评论数info专有 无符smallint 默认0
    readCount 观看数info专有 无符int 默认0
    article_content:
    aid 文章id 无符smallint 主键
    rawContent 文章内容 varchar（15000）
    inputTags 临时专有 varchar（100）
    asbackup 临时专有 完成发布并作为备份
    }*/
@media screen and (max-width: 1000px) {
	.header-img,.no-img{
		margin-top: .5rem;
		height: 3rem;
	}
	.no-img{
		padding-top: .8rem;
	}
}

</style>
