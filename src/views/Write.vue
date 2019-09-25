<template>
	<div @click="typeExpand=seriesExpand=tiFocus=false">
		<div class="page-header-wrap">
			<div class="pattern-full-width page-header">
				<div class="no-img" v-show="!hi" @click="hiAdd">
					<i class="iconfont icon-images clearm" style="font-size: .5rem"></i>
					<h4>请添加文章头图</h4>
					<p class="tips">支持5MB内的JPG／JPEG／BMP／PNG格式的高清图片</p>
					<p class="tips">（建议大于960*540像素）</p>
				</div>
				<div class="header-img" id="hi" v-show="hi">
					<div class="hi-control">
						<button class="re-add" @click="hiAdd"><i class="iconfont icon-image clearm"></i> </button>
						<button class="delete" @click="hi=null"><i class="iconfont icon-trash clearm"></i> </button>
					</div>
				</div>
				<input type="file" @change="hiChange" id="hi-add" hidden>
			</div>
		</div>
		<div class="page-content-wrap" >
			<div class="publish-area">
				<div class="pa-unit">
					<i class="iconfont icon-title">:</i>
					<input type="text" class="title-input" placeholder="无题" v-model.trim="title">
				</div>
				<div class="pa-unit">
					<i class="iconfont icon-file">:</i>
					<input type="text" class="preview-input" placeholder="无介绍则截取文章内容开头代之" v-model.trim="preview">
				</div>
				<div class="pa-unit detail-select">
					<div class="tag-btn-wrap" >
						<span>标签</span>
						<div class="tag-btn tl" @click.stop>
							<span v-if="!isMobile" v-for="each in selectedTags" class="tag-item">{{each}} <i class="iconfont icon-cancel clearm" @click="deleteTag(each)"></i></span>
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
							<i class="iconfont icon-down"></i>
						</button>
						<ul v-show="typeExpand">
							<li v-for="each in typeOptions" @click="selectedType=each">{{each}}</li>
						</ul>
					</div>
					<div class="series-btn">
						<span>系列</span>
						<button @click.stop="seriesExpand=!seriesExpand;tiFocus=typeExpand=false" :title="selectedSeries" class="tl">
							<span>{{selectedSeries||'不选择分组'}}</span>
							<i class="iconfont icon-down"></i>
						</button>
						<ul v-show="seriesExpand">
							<li v-for="each in seriesOptions" @click="selectedSeries=each" :title="each">{{each}}</li>
							<li @click="selectedSeries=null">不选择分组</li>
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
import {unique} from "../util/lib";
import {post} from "../util/http";
import {post_form} from "../util/http";
import UCONF from "../config/user.conf";
import {mapState} from 'vuex'
import PCONF from "../config/project.conf"
const siteTitle = UCONF.siteTitle;
export default {
        name: "Write",
		created(){
        	if(!this.aid){
				post('/apis/edit/initw.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
					if (response.data.code < 1) {
						this.$router.replace({name:'write',query:{aid:response.data.aid}});
						this.aid=response.data.aid;
						this.tagOptions = response.data.tagOptions || [];
						this.seriesOptions = response.data.seriesOptions || [];
					}
					else
						this.$router.push({name:'homepage'});
				}).catch(err=>console.warn(err));
				//全新文章获取其adi，添加至后缀
			}
			else {//如果有后缀，不申请aid，根据现有aid请求保存的信息
				post('/apis/edit/initw.php?aid='+this.aid,{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
					if(response.data.exist>0){
						let art = response.data;
						this.rawContent = art.rawContent || '';
						this.title = art.info.title || '';
						document.title = this.title?this.title:'标题未定'+siteTitle.title_;
						this.selectedType = art.info.type || 'code';
						this.preview = art.info.preview || '';
						this.selectedSeries = art.info.series || null;
						this.selectedTags = art.info.tags || [];
						this.tagOptions = art.tagOptions || [];
						this.seriesOptions = art.seriesOptions || [];
						this.inputTags = art.info.inputTags || '';
						this.hi = art.info.imgSrc || null;
						document.getElementById('hi').style.backgroundImage='url(/root'+art.info.imgSrc+')'
					}
					else{
						//不存在aid，重新导向至写文章页/404
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
			})
		},
        data() {
            return {
				mdSetting:PCONF.MDEditMode,
            	typeOptions:['anime','code','game','trivial'],
				seriesOptions:[],
				tagOptions:[],

				aid:this.$route.query.aid,
				title:'',
				author:'oshino',
            	selectedType:'code',
				preview:'',
				rawContent:'',
				selectedSeries:null,
				selectedTags:[],
				inputTags:'',
				hi:null,

				typeExpand:false,
				seriesExpand:false,
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
					if(file&&/image\/\w+/.test(file.type))
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
					type:this.selectedType,
					title:this.title,
					preview:this.preview,
					author:this.author,
					tags:this.selectedTags.join(','),
					inputTags:it,
					series:this.selectedSeries,
					rawContent:v
				};
        		post('/apis/edit/saveTmp.php?aid='+this.aid,data).then(response=>{
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
						series:this.selectedSeries,
						rawContent:this.rawContent,
					};
					if(typeof this.hi==='object'){
						let fd = new FormData();
						fd.append('hi',this.hi);
						fd.append('token',this.token);
						post_form('/apis/edit/mdimg.php?aid='+this.aid,fd).then(response=>{
							if (response.data.code < 1) {
								data.imgSrc = response.data.imgSrc;
								post('/apis/edit/launch.php?aid='+this.aid,data).then(re=>{
									if (re.data.code<1){
										this.$store.commit('infoBox/callInfoBox',{info:'文章发布成功', ok:true, during:2000});
										this.$router.push({name:'space'});
									}
									else
										this.$store.commit('infoBox/callInfoBox',{
											info:'文章发布失败，bug?',
											ok:false,
											during:2000
										});
								}).catch(err=>console.warn(err));
							}
							else
								this.$store.commit('infoBox/callInfoBox',{
									info:'文章头图片上传失败，终止发布',
									ok:false,
									during:2000
								});
						}).catch(err=>console.warn(err));
					}
					else{
						data.imgSrc = this.hi;
						post('/apis/edit/launch.php?aid='+this.aid,data).then(response=>{
							if (response.data.code<1){
								this.$store.commit('infoBox/callInfoBox',{info:'文章发布成功', ok:true, during:2000});
								this.$router.push({name:'space'});
							}
							else
								this.$store.commit('infoBox/callInfoBox',{info:'文章发布失败，bug?', ok:false, during:2000});
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
