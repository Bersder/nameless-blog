<template>
	<div @click="catExpand=tiFocus=false">
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="no-img" v-show="!hi" @click="hiAdd">
					<i class="iconfont icon-images clearm" style="font-size: .5rem"></i>
					<h4>请添加笔记头图</h4>
					<p class="tips">支持5MB内的JPG／JPEG／BMP／PNG格式的高清图片</p>
					<p class="tips">（建议大于960*540像素）</p>
				</div>
				<div class="header-img" id="hi" v-show="hi">
					<div class="hi-control">
						<button class="re-add" @click="hiAdd"><i class="iconfont icon-image clearm"></i></button>
						<button class="delete" @click="hi=null"><i class="iconfont icon-trash clearm"></i></button>
					</div>
				</div>
				<input type="file" @change="hiChange" id="hi-add" hidden>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="publish-area">
				<div class="pa-unit">
					<i class="iconfont icon-title">:</i>
					<input type="text" class="title-input" placeholder="无题" v-model.trim="title">
				</div>
				<div class="pa-unit">
					<i class="iconfont icon-file">:</i>
					<input type="text" class="preview-input" placeholder="无介绍则截取笔记内容开头代之" v-model.trim="preview">
				</div>
				<div class="pa-unit detail-select">
					<div class="tag-btn-wrap" >
						<span>Tags</span>
						<div class="tag-btn tl" @click.stop>
							<span v-if="!isMobile" v-for="each in selectedTags" class="tag-item">{{each}} <i class="iconfont icon-cancel clearm" @click="deleteTag(each)"></i></span>
							<span class="tag-num" v-if="selectedTags.length">{{selectedTags.length}}</span>
							<input type="text" v-model="inputTags" placeholder="请选中已有标签或新建标签，逗号/分号分隔" class="tag-input" @focus="tiFocus=true;catExpand=false" >
							<ul v-show="tiFocus&&tagOptions.length>0" @mouseover="tiFocus=true">
								<li v-for="each in tagOptions" @click="selectTag(each)" :class="{'t-selected':selectedTags.indexOf(each)!==-1}">{{each}}</li>
							</ul>
						</div>
					</div>
					<div class="cat-btn">
						<span>Category</span>
						<button @click.stop="catExpand=!catExpand;tiFocus=false" :title="catMap[selectedCat]" class="tl">
							<span>{{catMap[selectedCat]}}</span>
							<i class="iconfont icon-down"></i>
						</button>
						<ul v-show="catExpand">
							<li v-for="each in catOptions" @click="selectedCat=each">{{catMap[each]}}</li>
						</ul>
					</div>
				</div>
				<mavon-editor v-model.trim="rawContent" :externalLink="mdSetting.externalLink" :codeStyle="mdSetting.codeStyle" :tabSize="mdSetting.tabSize" :toolbars="mdSetting.toolbars" :imageFilter="mdSetting.imageFilter" :subfield="mdSetting.subfield" @imgAdd="$imgAdd" @save="saveTmp" ref=md />
				<div class="pa-submit"><button @click="launch"><i class="iconfont icon-launch"></i> Launch</button></div>
			</div>
		</div>
	</div>
</template>

<script>
	import {unique} from "../util/util";
	import {post} from "../util/http";
	import {post_form} from "../util/http";
	import {mapState} from 'vuex'
	import {mdSetEdit} from "../util/global";

	export default {
        name: "TakeNote",
		created(){
			if(!this.nid){
				post('/apis/edit/initn.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
					if (response.data.code < 1) {
						this.$router.replace({name:'takenote',query:{nid:response.data.nid}});
						this.nid = response.data.nid;
						this.tagOptions = response.data.tagOptions || [];
						this.catMap = response.data.catMap;
						this.catOptions = Object.keys(this.catMap)|| [];
					}
					else
						this.$router.push({name:'homepage'});
				}).catch(err=>console.warn(err));
			}
			else{
				post('/apis/edit/initn.php?nid='+this.nid,{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
					if(response.data.exist>0){
						let note = response.data;
						this.rawContent = note.rawContent || '';
						this.title = note.info.title || '';

						this.preview = note.info.preview || '';
						this.selectedCat = note.info.category || 'zatsu';
						this.selectedTags = note.info.tags || [];
						this.tagOptions = note.tagOptions || [];
						this.catMap = note.catMap;
						this.catOptions = Object.keys(this.catMap)|| [];
						this.inputTags = note.info.inputTags || '';
						this.hi = note.info.imgSrc || null;
						document.getElementById('hi').style.backgroundImage='url(http://localhost:80'+note.info.imgSrc+')'
					}
					else{
						//不存在nid，重新导向至写文章页/404
						this.$router.push({name:'homepage'})
					}
				}).catch(err=>console.warn(err));
			}
			if (this.isMobile){
				this.mdSetting.toolbars.subfield = false;
				this.mdSetting.subfield = false;
			}
		},
		computed:{
			...mapState({
				isMobile:'isMobile',
				token:state=>state.account.token
			}),
		},
        data() {
            return {
            	mdSetting:mdSetEdit,
            	catOptions:[],
				tagOptions:[],
				catMap:{zatsu:'雑モツ'},

				nid:this.$route.query.nid,
				title:'',
				author:'oshino',
				selectedType:'note',
				preview:'',
				rawContent:'',
				selectedCat:'zatsu',
				selectedTags:[],
				inputTags:'',
				hi:null,

				catExpand:false,
				tiFocus:false,
			}
        },
		beforeRouteLeave(to,from,next){
			if(to.name==='space'||to.name==='homepage')next();
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
				param.append('token',this.token);
				post_form('/apis/edit/mdimg.php',param).then(response=>this.$refs.md.$img2Url(pos,'http://localhost:80'+response.data.imgSrc)).catch(err=>console.warn(err));
			},
			hiAdd(){
				document.getElementById('hi-add').click();
			},
			hiChange(e){
				let file = e.target.files[0];
				if (file) {
					if(/image\/\w+/.test(file.type))
						if(file.size<5000000){
							let fr = new FileReader();
							fr.onload = function(){document.getElementById('hi').style.backgroundImage='url('+fr.result+')'};
							fr.readAsDataURL(file);
							this.hi = file;
						}
						else
							window.alert('文件过大');
					else window.alert('请选择正确的文件类型')
				}
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
					token:this.token,
					type:'note',
					title:this.title,
					preview:this.preview,
					author:this.author,
					tags:this.selectedTags.join(','),
					inputTags:it,
					category:this.selectedCat,
					rawContent:v,
				};
				post('/apis/edit/saveTmp.php?nid='+this.nid,data).then(response=>{
					if (response.data.code<1)
						this.$store.commit('infoBox/callInfoBox',{
							info:'草稿保存成功',
							ok:true,
							during:2000
						});
					else
						this.$store.commit('infoBox/callInfoBox',{
							info:'草稿保存失败',
							ok:false,
							during:2000
						});
				}).catch(err=>console.warn(err));
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
						token:this.token,
						type:this.selectedType,
						title:this.title,
						preview:this.preview?this.preview:this.rawContent.slice(0,100).replace(/!\[.+]\(.+\)|[#*+~^=> ]/g,'').replace(/\s/g,','),
						author:this.author,
						tags:this.selectedTags.join(','),
						newTags:it,
						category:this.selectedCat,
						rawContent:this.rawContent,
					};
					if(typeof this.hi==='object'){
						let fd = new FormData();
						fd.append('hi',this.hi);
						fd.append('token',this.token);
						post_form('/apis/edit/mdimg.php?nid='+this.nid,fd).then(response=>{
			 				if (response.data.code < 1) {
								data.imgSrc = response.data.imgSrc;
								post('/apis/edit/launch.php?nid='+this.nid,data).then(re=>{
									if (re.data.code<1)
										this.$router.push({name:'space'});
									else
										this.$store.commit('infoBox/callInfoBox',{
											info:'笔记发布失败，bug?',
											ok:false,
											during:2000
										});
								}).catch(err=>console.warn(err));
							}
							else
								this.$store.commit('infoBox/callInfoBox',{
									info:'笔记头图片上传失败，终止发布',
									ok:false,
									during:2000
								});
						}).catch(err=>console.warn(err));
					}
					else{
						data.imgSrc = this.hi;
						post('/apis/edit/launch.php?nid='+this.nid,data).then(response=>{
							if (response.data.code < 1){
								this.$store.commit('infoBox/callInfoBox',{info:'笔记发布成功', ok:true, during:2000});
								this.$router.push({name:'space'});
							}
							else
								this.$store.commit('infoBox/callInfoBox',{info:'笔记发布失败，bug?', ok:false, during:2000});
						}).catch(err=>console.warn(err));
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
		color: #99a2aa;
		padding-top: 2rem;
		height: 5rem;
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
		height: 5rem;
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

		.pa-unit>i{
			position: absolute;
			top: 50%;
			transform: translate(0,-50%);
			left: .2rem;
		}
		.title-input{
			height: .4rem;
			line-height: .4rem;
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
			line-height: .3rem;
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
				vertical-align: top;
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
				font-size: .16rem;
				right: .05rem;
				top: 50%;
				transform: translate(0,-50%);
			}
			.type-btn ul,.series-btn ul,.cat-btn ul {
				background: white;
				top: 100%;
				right: 0;
				width: 1.5rem;
				margin-top: .01rem;
				border-radius: .03rem;
				list-style-type: none;
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
					font-weight: 600;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.type-btn li:hover,.series-btn li:hover,.cat-btn li:hover{
					background: #eaeaea;
				}
		.tag-btn-wrap{
			max-width: 13rem;
			width: 100%;
		}
			.tag-btn{
				display: inline-block;
				vertical-align: top;
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
					line-height: .3rem;
					background: transparent;
					outline: none;
					border: none;
					max-width: 3.1rem;
					width: 100%;
				}
				.tag-btn .tag-item{
					display: inline-block;
					line-height: .2rem;
					padding: 0 .05rem;
					border-radius: .02rem;
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
					width: 3.2rem;
					font-size: .14rem;
					color: grey;
					background: white;
					border-radius: .03rem;
					box-shadow: 0 .04rem .07rem rgba(0,0,0,.2);
					padding: .1rem .15rem;
					z-index: 1600;
					list-style-type: none;

				}
					.tag-btn li{
						float: left;
						padding: 0 .1rem;
						margin-right: .05rem;
						margin-bottom: .05rem;
						border: .01rem solid #d9d9d9;
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
		text-align: right;
		margin-top: .1rem;
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
		background: white;
		border: .01rem solid #ccc;
		border-radius: .05rem;
		transition: .5s;
	}
	.pa-submit button:hover{
		border-color: #00a1d6;
		color: #00a1d6;
	}
	/*以上使用Write覆盖*/
@media screen and (max-width: 1000px) {
	.header-img,.no-img{
		height: 3rem;
	}
	.no-img{
		padding-top: .8rem;
	}
}
</style>
