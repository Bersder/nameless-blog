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
							<div class="no-select dis-ib" v-if="!isMobile">
								<span v-for="each in selectedTagsID" class="tag-item">
									{{tagMap[each]}}
									<i class="iconfont icon-cancel clearm" @click="deleteTagID(each)"></i>
								</span>
							</div>
							<span class="tag-num" v-if="selectedTagsID.length">{{selectedTagsID.length}}</span>
							<input class="tag-input" type="text" placeholder="请选中已有标签或新建标签，逗号/分号分隔"
								   v-model="inputTags"
								   @focus="tagInputFocus">
							<ul v-show="tiFocus&&Object.keys(tagMap).length>0">
								<li v-for="(item,key) in tagMap"
									:class="{'t-selected':selectedTagsID.indexOf(key)!==-1}"
									@click="selectTagID(key)">{{item}}</li>
							</ul>
						</div>
					</div>
					<div class="type-btn">
						<span>类别</span>
						<button @click.stop="typeClick" class="tl">
							<span>{{selectedType}}</span>
							<i class="iconfont icon-down"></i>
						</button>
						<ul v-show="typeExpand">
							<li v-for="item in typeOptions"
								@click="selectedType=item">{{item}}</li>
						</ul>
					</div>
					<div class="series-btn">
						<span>系列</span>
						<button @click.stop="seriesClick" :title="selectedSeries" class="tl">
							<span>{{selectedSeries||'不选择分组'}}</span>
							<i class="iconfont icon-down"></i>
						</button>
						<ul v-show="seriesExpand">
							<li v-for="item in seriesOptions"
								:title="item['seriesName']"
								@click="seriesSelect(item)">{{item['seriesName']}}</li>
							<li @click="selectedSeriesID=selectedSeries=null">不选择分组</li>
						</ul>
					</div>
				</div>
				<mavon-editor v-model="rawContent"
							  :imageClick="imageClick"
							  :placeholder="mdSetting.placeholder"
							  :imageFilter="mdSetting.imageFilter"
							  :tabSize="mdSetting.tabSize"
							  :toolbars="mdSetting.toolbars"
							  :externalLink="mdSetting.externalLink"
							  @imgAdd="imgAdd"
							  @imgDel="imgDel"
							  @save="saveTmp"
							  ref=md>
				</mavon-editor>
				<div class="pa-submit"><button @click="launch"><i class="iconfont icon-launch"></i> Launch</button></div>
			</div>

		</div>
	</div>

</template>

<script>
import {unique} from "../utils/lib";
import UCONF from "../config/user.conf";
import Validator from '../utils/Validator';
import writingMixin from "../mixins/Mixin-Writing"
const siteTitle = UCONF.siteTitle;
export default {
        name: "Write",
		created(){
        	if(!this.aid){
				this.$post('/apis/edit/initw.php').then(response=>{
					if (response.data.code < 1) {
						this.$router.replace({name:'write',query:{aid:response.data.aid}});
						this.aid=response.data.aid;
						this.tagMap = response.data.tagMap;
						this.seriesOptions = response.data.seriesOptions || [];
					}
					else
						this.$router.push({name:'homepage'});
				}).catch(err=>console.warn(err));
				//全新文章获取其adi，添加至后缀
			}
			else {//如果有后缀，不申请aid，根据现有aid请求保存的信息
				this.$post('/apis/edit/initw.php?aid='+this.aid).then(response=>{
					if(response.data.exist>0){
						let art = response.data;
						this.rawContent = art.rawContent || '';
						this.title = art.info.title || '';
						document.title = this.title?this.title:'标题未定'+siteTitle.title_;
						this.selectedType = art.info.type || 'code';
						this.preview = art.info.preview || '';
						this.selectedSeries = art.info.series || null;
						this.selectedSeriesID = art.info.seriesID || null;
						art.info.tagsID.forEach(e=>this.selectedTagsID.push(e));
						this.tagMap = art.tagMap;
						this.seriesOptions = art.seriesOptions || [];
						this.inputTags = art.info.inputTags || '';
						this.hi = art.info.imgSrc || null;
						document.getElementById('hi').style.backgroundImage='url(/root'+art.info.imgSrc+')';
						setTimeout(()=>this.loadImgs(),500);
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
        data() {
            return {
            	typeOptions:['anime','code','game','trivial'],
				seriesOptions:[],

				aid:this.$route.query.aid,
            	selectedType:'code',

				selectedSeries:null,
				selectedSeriesID:null,

				typeExpand:false,
				seriesExpand:false,
			}
        },
        methods:{
			tagInputFocus(){
				this.tiFocus=true;
				this.seriesExpand=this.typeExpand=false
			},
			typeClick(){
				this.typeExpand=!this.typeExpand;
				this.tiFocus=this.seriesExpand=false
			},
			seriesClick(){
				this.seriesExpand=!this.seriesExpand;
				this.tiFocus=this.typeExpand=false
			},
			seriesSelect(item){
				this.selectedSeries=item['seriesName'];
				this.selectedSeriesID=item['sid']
			},
			saveTmp(v){
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
					tagsID:this.selectedTagsID.join(','),
					inputTags:it,
					seriesID:this.selectedSeriesID,
					rawContent:v.trim()
				};
        		this.$post('/apis/edit/saveTmp.php?aid='+this.aid,data).then(response=>{
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
				let validator = new Validator();
				validator.check(this.title,{strategy:'notEmpty',errMsg:'请填写标题'});
				validator.check(this.rawContent.trim(),{strategy:'notEmpty',errMsg:'请写点东西'});
				validator.check(this.hi,{strategy:'notEmpty',errMsg:'请选择背景图'});
				let err = validator.checkResult();
				if (err){
					this.$store.commit('infoBox/callInfoBox',{info:err, ok:false, during:3000});
					return;
				}
				let it;
				let it_ = [];//当前标签集合
				for (let key in this.tagMap)it_.push(this.tagMap[key].toLowerCase());
				if(/^([^,;，；]+[,;]?\s*)*$/.test(this.inputTags)){
					it = this.inputTags.replace(/^[\s,;]+|[\s,;]+$/gm,'').replace(/\s*[,;]\s*/g,',').split(',');
					it = unique(it);
					it  = it.filter(v=>{return it_.indexOf(v.toLowerCase())===-1}).join(',');
					//然后去重,筛选新标签合并,发送至launch
				}
				else{
					window.alert('inputTags非法');
					return ;
				}
				let tmp = document.createElement('div');
				tmp.innerHTML = this.$refs.md.$data['d_render'];
				let data = {
					type:this.selectedType,
					title:this.title,
					preview:this.preview?this.preview:`${tmp.innerText.slice(0,80).replace(/ +/g,' ')}…`,
					author:this.author,
					tagsID:this.selectedTagsID.join(','),
					newTags:it,
					seriesID:this.selectedSeriesID,
					rawContent:this.rawContent.trim(),
				};
				if(typeof this.hi==='object'){
					let fd = new FormData();
					fd.append('hi',this.hi);
					this.$post_form('/apis/edit/mdimg.php?aid='+this.aid,fd).then(response=>{
						if (response.data.code < 1) {
							data.imgSrc = response.data.imgSrc;
							this.$post('/apis/edit/launch.php?aid='+this.aid,data).then(re=>{
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
					this.$post('/apis/edit/launch.php?aid='+this.aid,data).then(response=>{
						if (response.data.code<1){
							this.$store.commit('infoBox/callInfoBox',{info:'文章发布成功', ok:true, during:2000});
							this.$router.push({name:'space'});
						}
						else
							this.$store.commit('infoBox/callInfoBox',{info:'文章发布失败，bug?', ok:false, during:2000});
					}).catch(err=>console.warn(err));
				}

			},
		},
	mixins:[writingMixin]

    }
</script>

<style>
</style>
