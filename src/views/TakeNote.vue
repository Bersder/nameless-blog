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
	import {siteTitle} from "../util/USER_VAR";
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
						document.title = this.title?this.title:'标题未定'+siteTitle.title_;
						this.preview = note.info.preview || '';
						this.selectedCat = note.info.category || 'zatsu';
						this.selectedTags = note.info.tags || [];
						this.tagOptions = note.tagOptions || [];
						this.catMap = note.catMap;
						this.catOptions = Object.keys(this.catMap)|| [];
						this.inputTags = note.info.inputTags || '';
						this.hi = note.info.imgSrc || null;
						document.getElementById('hi').style.backgroundImage='url(/root'+note.info.imgSrc+')'
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
									if (re.data.code<1){
										this.$store.commit('infoBox/callInfoBox',{info:'笔记发布成功', ok:true, during:2000});
										this.$router.push({name:'space'});
									}
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

<style>
</style>
