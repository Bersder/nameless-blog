<template>
	<div @click="catExpand=tiFocus=false">
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="header-img" id="hi">
					<div class="hi-btn" @click="hiAdd">
						<span class="far fa-images" v-if="!hi"> 选择一张图片</span>
						<span class="far fa-images" v-if="hi"> 更换图片</span>
						<input type="file" @change="hiChange" id="hi-add" hidden>
					</div>
				</div>
			</div>
		</div>
		<div class="page-content-wrap">
			<div class="publish-area">
				<div class="pa-unit">
					<i class="far fa-file fa-lg"> :</i>
					<input type="text" class="title-input" placeholder="无题" v-model.trim="title">
				</div>
				<div class="pa-unit">
					<i class="far fa-edit fa-lg">:</i>
					<input type="text" class="preview-input" placeholder="无介绍则截取文章内容开头代之" v-model.trim="preview">
				</div>
				<div class="pa-unit">
					<div class="cat-btn">
						<span>Category</span>
						<button @click.stop="catExpand=!catExpand;tiFocus=false" class="tl">
							<span>{{catMap[selectedCat]}}</span>
							<i class="fas fa-sort-down fa-lg"></i>
						</button>
						<ul v-show="catExpand">
							<li v-for="each in catOptions" @click="selectedCat=each">{{catMap[each]}}</li>
						</ul>
					</div>
					<div class="tag-btn-wrap" >
						<span>Tags</span>
						<div class="tag-btn tl" @click.stop>
							<span v-for="each in selectedTags" class="tag-item">{{each}} <i class="fas fa-times" @click="deleteTag(each)"></i></span>
							<input type="text" v-model="inputTags" placeholder="请选中已有标签或新建标签，逗号/分号分隔" class="tag-input" @focus="tiFocus=true;catExpand=false" >
							<ul v-show="tiFocus&&tagOptions.length!==0" @mouseover="tiFocus=true">
								<li v-for="each in tagOptions" @click="selectTag(each)" :class="{'t-selected':selectedTags.indexOf(each)!==-1}">{{each}}</li>
							</ul>
						</div>
					</div>
				</div>
				<mavon-editor v-model="rawContent" @imgAdd="$imgAdd" @save="saveTmp" ref=md />
				<div class="pa-submit">
					<button @click="launch"><i class="fas fa-rocket"></i> Launch</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {unique} from "../util/util";
	import {post} from "../util/http";
	import {post_form} from "../util/http";
	import {fetch} from "../util/http";
    export default {
        name: "TakeNote",
		created(){
			if(!this.nid){
				fetch('/apis/edit/initn.php').then(response=>{
					this.$router.replace({name:'takenote',query:{nid:response.data.nid}});
					this.nid = response.data.nid;
					this.tagOptions = response.data.tagOptions || [];
					this.catMap = response.data.catMap;
					this.catOptions = Object.keys(this.catMap)|| [];
				});
			}
			else{
				fetch('/apis/edit/initn.php',{nid:this.nid}).then(response=>{
					let note = response.data;
					if(note.exist){
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
				})
			}
		},
        data() {
            return {
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
					type:'note',
					title:this.title,
					preview:this.preview,
					author:this.author,
					tags:this.selectedTags.join(','),
					inputTags:it,
					category:this.selectedCat,
					rawContent:v.replace(/\\/g,'\\\\').replace(/'/g,"\\'"),
				};
				post('/apis/edit/saveTmp.php?nid='+this.nid,data);
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
						category:this.selectedCat,
						rawContent:this.rawContent.replace(/\\/g,'\\\\').replace(/'/g,"\\'"),
					};
					if(typeof this.hi==='object'){
						let fd = new FormData();
						fd.append('hi',this.hi);
						post_form('/apis/edit/mdimg.php?nid='+this.nid,fd).then(response=>{
							data.imgSrc = response.data[1];
							post('/apis/edit/launch.php?nid='+this.nid,data)
						});
					}
					else{
						data.imgSrc = this.hi;
						post('/apis/edit/launch.php?nid='+this.nid,data)
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
	.pattern-full-width:before{/*以上使用code覆盖*/
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.1);
	}
	.header-img{
		position: relative;
		background: no-repeat 40% center;
		background-size: cover;
		background-origin: border-box;
		width: 100%;
		height: 4rem;
		margin-top: .7rem;
		transition: all .5s;
	}
		.hi-btn{
			position: absolute;
			top: .3rem;
			left: .5rem;
			background: rgba(0,0,0,.4);
			border: .03rem solid rgba(255,255,255,.3);
			padding: 0 .1rem;
			color: white;
			cursor: pointer;
			border-radius: .04rem;
			line-height: .3rem;
		}
	.publish-area{
		padding:.2rem .2rem;
	}
	.pa-unit{
		margin-bottom: .1rem;
	}
		.title-input{
			height: .4rem;
			max-width: 8rem;
			width: 100%;
			font-size: .2rem;
			padding: .1rem .2rem;
			outline: none;
			border: .01rem solid #adadad;
			border-radius: .05rem;
		}
		.preview-input{
			padding-left: .1rem;
			height: .3rem;
			max-width: 8rem;
			width: 100%;
			outline: none;
			border: .01rem solid #adadad;
			border-radius: .05rem;
		}
		.type-btn,.series-btn,.tag-btn,.cat-btn{
			display: inline-block;
			position: relative;
			margin-right: .2rem;
		}
			.type-btn button,.series-btn button,.cat-btn button{
				position: relative;
				height: .3rem;
				min-width: 1rem;
				text-transform: capitalize;
				padding: 0 .25rem 0 .15rem;
				background: snow;
				border: .01rem solid #adadad;
				border-radius: .05rem;
			}
			.type-btn i,.series-btn i,.cat-btn i{
				position: absolute;
				right: .05rem;
				top: .05rem;
			}
			.type-btn ul,.series-btn ul,.cat-btn ul {
				background: snow;
				top: .31rem;
				right: -.5rem;
				width: 1.5rem;
				border-radius: .03rem;
				border: .01rem solid #e5e5e5;
				box-shadow: 0 0 .05rem rgba(0,0,0,.5);
				padding: .1rem .15rem;
				z-index: 1600;
				position: absolute;
			}.series-btn ul{left: .5rem !important;}

				.type-btn li,.series-btn li,.cat-btn li{
					cursor: pointer;
					text-align: left;
					line-height: .2rem;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.type-btn li:hover,.series-btn li:hover,.cat-btn li:hover{
					background: #eaeaea;
				}
		.tag-btn-wrap{
			display: inline-block;
			max-width: 7rem;
			width: 100%;
		}
			.tag-btn{
				display: inline-block;
				position: relative;
				width: calc(100% - .6rem);
				background: snow;
				line-height: .3rem;
				padding: 0 .1rem;
				border: .01rem solid #adadad;
				border-radius: .05rem;
			}
				.tag-input{
					display: inline-block;
					height: .3rem;
					background: transparent;
					outline: none;
					border: none;
					max-width: 3.06rem;
					width: 100%;
				}
				.tag-btn span{
					display: inline-block;
					height: .2rem;
					line-height: .2rem;
					background: #a6f1fb;
					font-size: .12rem;
					margin-right: .05rem;
				}
				.tag-btn span i{
					cursor: pointer;
				}
				.tag-btn ul{
					position: absolute;
					top: .32rem;
					left: 0;
					width: 3rem;
					font-size: .14rem;
					color: grey;
					background: snow;
					border-radius: .03rem;
					border: .01rem solid #e5e5e5;
					box-shadow: 0 0 .05rem rgba(0,0,0,.5);
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
					.tag-btn li:hover,li.t-selected{
						color: white;
						background: #00a1d6;
					}
	.pa-submit{
		margin: .2rem 0;
		text-align: right;
	}
	.pa-submit button{
		height: .36rem;
		max-width: 5rem;
		width: 100%;
		padding: .1rem;
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

@media screen and (max-width: 1005px) {
	.header-img{
		margin-top: .5rem;
		height: 3rem;
	}
}
</style>
