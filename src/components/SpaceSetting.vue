<template>
    <div class="space-setting">
		<div class="section setting-tags">
			<h3 class="section-title" id="setting-tags">标签管理</h3>
			<div class="section-content">
				<div class="tag-cloud">
					<h4>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{this.tagExpand|expandStatus}}</a></h4>
					<ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
						<li class="tag" v-for="(item,key,index) in tagDict" :key="index"><a :title="item+' 相关'">{{key}}</a></li>
					</ul>
				</div>
				<div class="tag-set-btns">
					<div class="tag-add">
						<input type="text" v-model.trim="newTag" placeholder="添加标签，不含英文逗号">
						<a class="iconfont icon-plus tag-add-btn" @click="addTag"></a>
					</div>
					<div class="tag-del">
						<input type="text" v-model.trim="searchKey" placeholder="删除标签">
						<ul class="match-list" v-show="tagTips.length">
							<li class="match-list-item" v-for="(item,key,index) in tagTips" :key="index" @click="searchKey=item">
								<span>{{item.substr(0,item.toLowerCase().indexOf(searchKey.toLowerCase()))}}</span><span style="color:#00a1d6">{{searchKey}}</span><span>{{item.substr(item.toLowerCase().indexOf(searchKey.toLowerCase())+searchKey.length)}}</span>
							</li>
						</ul>
						<a class="iconfont icon-trash tag-del-btn" @click="delTag"></a>
					</div>
				</div>
			</div>
		</div>

		<div class="section setting-series-cat">
			<h3 class="section-title" id="setting-series-cat">系列&分类管理</h3>
			<div class="section-content">
				<div class="setting-series">
					<h4>系列</h4>
					<ul>
						<li v-for="item in seriesList" :title="item.count+'相关'" :key="item.id">{{item.name}}<a class="iconfont icon-cancel" @click="delSeries(item)"></a></li>
					</ul>
					<div class="series-add">
						<input type="text" v-model.trim="newSeries" placeholder="添加新系列">
						<a class="iconfont icon-plus series-add-btn" @click="addSeries"></a>
					</div>
				</div>
				<div class="setting-cat">
					<h4>笔记类别</h4>
					<ul>
						<li v-for="item in categoryList" :title="item.count+'相关'" :key="item.id">{{item.nameCN}}<span> · {{item.nameEN}}</span><a class="iconfont icon-cancel" @click="delCat(item)"></a></li>
					</ul>
					<div class="cat-add">
						<input type="text" v-model.trim="newCat" placeholder="添加类别，格式CN@EN">
						<a class="iconfont icon-plus cat-add-btn" @click="addCat"></a>
					</div>
				</div>
			</div>
		</div>

		<div class="section setting-bg">
			<h3 class="section-title" id="setting-bg">背景管理</h3>
			<div class="section-content">
				<div class="header-card" v-for="item in headers" :key="item.id">
					<div class="bg-chg" :style="{backgroundImage:'url('+item.imgSrc+')'}">
						<input type="text"  v-if="item.id<6" v-model.trim="item.tmpDes" title="修改吐槽">
						<input type="file" hidden :id="item.id" @change="imgChange">
						<a class="iconfont icon-image clearm" title="修改背景" @click="imgAdd"></a>
					</div>
					<div class="bg-title">
						{{headerMap[item.id]}}
						<a class="iconfont icon-save" v-if="item.tmpDes!==item.description||item.file" @click="changeHeader(item)">更改</a>
					</div>
				</div>
			</div>
		</div>

		<div class="section setting-link">
			<h3 class="section-title" id="setting-link">链接管理</h3>
			<div class="section-content">
				<div class="s-link-list">
					<h4>工 具 箱</h4>
					<ul>
						<li v-for="item in outerLinks.tool" :key="item.id"><a target="_blank" :href="item.url">{{item.name}}</a><i class="iconfont icon-shanchutupian" @click="delLink(item)"></i></li>
					</ul>
				</div>
				<div class="s-link-list">
					<h4>A·C·G</h4>
					<ul>
						<li v-for="item in outerLinks.acg" :key="item.id"><a target="_blank" :href="item.url">{{item.name}}</a><i class="iconfont icon-shanchutupian" @click="delLink(item)"></i></li>
					</ul>
				</div>
				<div class="s-link-list">
					<h4>森 罗 万 象</h4>
					<ul>
						<li v-for="item in outerLinks.kaleidoscope" :key="item.id"><a target="_blank" :href="item.url">{{item.name}}</a><i class="iconfont icon-shanchutupian" @click="delLink(item)"></i></li>
					</ul>
				</div>
				<div class="link-add">
					<div class="type-input">
						<span>{{linkTypeMap[newLinkType]}}</span><i class="iconfont icon-down clearm pr"></i>
						<ul><li v-for="(item,key) in linkTypeMap" @click="newLinkType=key">{{item}}</li></ul>
					</div>
					<input type="text" v-model.trim="newLinkUrl" placeholder="ADD_URL">
					<input type="text" v-model.trim="newLinkName" placeholder="ADD_NAME" class="link-name">
					<a style="font-size: .16rem" class="iconfont icon-plus" @click="addLink"></a>
				</div>
			</div>
		</div>

		<div class="section setting-me">
			<h3 class="section-title" id="setting-me">帐号管理</h3>
			<div class="section-content">
				<p>因为很少用，待开发</p>
			</div>
		</div>

		<div class="popup-panel-container" v-if="popupShow">
			<div class="popup-panel">
				<h3 class="popup-title tl">{{popupTitle}}</h3>
				<div class="popup-content tl">{{popupContent}}?</div>
				<div class="popup-confirm tc">
					<button class="btn-primary" @click="delConfirm(true)">删除</button><button class="btn-secondary" @click="delConfirm(false)">手抖点错</button>
				</div>
				<a class="popup-cancel" @click="popupShow=false"><i class="iconfont icon-cancel"></i></a>
			</div>
		</div>
	</div>
</template>

<script>
	import {post} from "../util/http";
	import {post_form} from "../util/http";
	import {mapState} from 'vuex'
	import {tagCloudMixin} from "../util/global";
	import {aesEncrypt} from "../util/util";

	export default {
        name: "SpaceSetting",
		created(){
			post('/apis/auth/v10api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
				let data = response.data.data;
				//console.log(data);
				data.tags.forEach(e=>{
					this.$set(this.tagDict,e.tagName,e.relateArt.split(',').length + e.relateNote.split(',').length - 4)
				});
				if (Object.keys(this.tagDict).length>30) this.manyTags = true;
				this.tags = Object.keys(this.tagDict);
				data.series.forEach(e=>{
					e.count = e.relateArt.split(',').length - 2;
					delete e.relateArt;
					this.seriesList.push(e);
				});
				data.category.forEach(e=>{
					e.count = e.relateNote.split(',').length - 2;
					delete e.relateNote;
					this.categoryList.push(e);
				});
				data.headers.forEach(e=>{
					e.file = undefined;
					e.tmpDes = e.description;
					e.imgSrc = 'http://localhost:80'+e.imgSrc;
					this.headers.push(e);
				});
				this.outerLinks = data.outerLinks;
			}).catch(err=>console.warn(err))
		},
		data(){
			return{
				popupTitle:'',
				popupContent:'',
				popupShow:false,
				delTarget:{},//删除对象，允许多种
				delWaiting:false,//用于防止竞争删除

				newTag:'',
				searchKey:'',
				tags:[],
				tagTips:[],

				seriesList:[],
				newSeries:'',
				categoryList:[],
				newCat:'',

				headerMap: ['Anime', '极客', '游民', '随写', '笔记', '链接', '归档', '关于'],
				headers:[],

				linkTypeMap:{
					tool:'四次元工具箱',
					acg:'A·C·G',
					kaleidoscope:'森 罗 万 象'
				},
				outerLinks:{tool:[], acg:[], kaleidoscope:[]},
				newLinkUrl:'',
				newLinkName:'',
				newLinkType:'tool'

			}
		},
		watch:{
        	searchKey(cur,pre){
				this.tagTips = [];
				if (cur){
					let reg = new RegExp(cur,'i');
					for (let i=0;i<this.tags.length;i++)
						if (reg.test(this.tags[i]))
							this.tagTips.push(this.tags[i])
				}
			}
		},
		methods:{
        	addTag(){
				if (this.newTag&&!/,/.test(this.newTag)) {
					let data = {newTag:this.newTag};
					post('/apis/auth/v10api.php',{token:this.token,...aesEncrypt(JSON.stringify(data))}).then(response=>{
						if (response.data.code < 1){
							if (response.data.tagExist > 0)
								this.$store.commit('infoBox/callInfoBox',{info:'标签已存在', ok:false, during:2000});
							else{
								this.$set(this.tagDict,data.newTag,0);
								this.tags = Object.keys(this.tagDict);
								this.newTag = '';
								this.$store.commit('infoBox/callInfoBox',{info:'标签添加成功', ok:true, during:2000});
							}
						}
						else
							this.$store.commit('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
					}).catch(err=>console.warn(err))
				}
				else
					this.$store.commit('infoBox/callInfoBox',{info:'标签为空或非法', ok:false, during:2000});
			},
			addSeries(){
				if (this.newSeries){
					let data = {newSeries:this.newSeries};
					post('/apis/auth/v10api.php',{token:this.token,...aesEncrypt(JSON.stringify(data))}).then(response=>{
						if (response.data.code<1){
							if (response.data.seriesExist > 0)
								this.$store.commit('infoBox/callInfoBox',{info:'系列已存在', ok:false, during:2000});
							else{
								this.seriesList.push({name:data.newSeries,id:response.data.id,count:0});
								this.newSeries = '';
								this.$store.commit('infoBox/callInfoBox',{info:'系列添加成功', ok:true, during:2000});
							}
						}
						else
							this.$store.commit('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
					}).catch(err=>console.warn(err))
				}
				else
					this.$store.commit('infoBox/callInfoBox',{info:'系列名为空', ok:false, during:2000});
			},
			addCat(){
				let CNEN = this.newCat.split('@');
				if (CNEN.length===2){
					let CN = CNEN[0].trim();
					let EN = CNEN[1].trim();
					if (CN&&EN){
						let data = {newCatCN:CN,newCatEN:EN};
						post('/apis/auth/v10api.php',{token:this.token,...aesEncrypt(JSON.stringify(data))}).then(response=>{
							if (response.data.code < 1) {
								if (response.data.catExist > 0)
									this.$store.commit('infoBox/callInfoBox',{info:'笔记类别已存在', ok:false, during:2000});
								else{
									this.categoryList.push({nameCN:CN,nameEN:EN,id:response.data.id,count:0});
									this.newCat = '';
									this.$store.commit('infoBox/callInfoBox',{info:'笔记类别添加成功', ok:true, during:2000});
								}
							}
							else
								this.$store.commit('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
						}).catch(err=>console.warn(err))
					}
					else
						this.$store.commit('infoBox/callInfoBox',{info:'类别不能为空', ok:false, during:2000});
				}
				else
					this.$store.commit('infoBox/callInfoBox',{info:'创建格式非法', ok:false, during:2000});
			},
			addLink(){
				if (/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/#])+$/.test(this.newLinkUrl)&&this.newLinkName) {
					let data = {newLinkUrl:this.newLinkUrl,newLinkName:this.newLinkName,newLinkType:this.newLinkType};
					post('/apis/auth/v10api.php',{token:this.token,...aesEncrypt(JSON.stringify(data))}).then(response=>{
						if (response.data.code < 1) {
							if (response.data.linkExist>0)
								this.$store.commit('infoBox/callInfoBox',{info:'该链接已存在', ok:false, during:2000});
							else{
								this.outerLinks[data.newLinkType].push({name:data.newLinkName,url:data.newLinkUrl,type:data.newLinkType,id:response.data.id});
								this.newLinkName = this.newLinkUrl = '';
								this.$store.commit('infoBox/callInfoBox',{info:'外部链接添加成功', ok:true, during:2000});
							}
						}
						else
							this.$store.commit('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
					}).catch(err=>console.warn(err));
				}
				else
					this.$store.commit('infoBox/callInfoBox',{info:'请检查信息是否完整且合法', ok:false, during:2000});
			},
			delTag(){
				if (this.tags.indexOf(this.searchKey) >= 0) {
					if (this.delWaiting)
						this.$store.commit('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
					else{
						this.delTarget = {delTag:this.searchKey};
						this.popupTitle = '删除标签';
						this.popupContent = '确定要删除标签「'+this.searchKey+'」';
						this.popupShow = true
					}
				}
				else
					this.$store.commit('infoBox/callInfoBox',{info:'不存在该标签', ok:false, during:2000});
			},
			delSeries(item){
        		if (this.delWaiting)
					this.$store.commit('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
        		else{
					this.delTarget = {delSeriesID:item.id};
					this.popupTitle = '删除系列';
					this.popupContent = '确定要删除系列《'+item.name+'》';
					this.popupShow = true
				}
			},
			delCat(item){
        		if (this.delWaiting)
					this.$store.commit('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
        		else{
					this.delTarget = {delCatID:item.id};
					this.popupTitle = '删除笔记类别';
					this.popupContent = '确定要删除笔记类别「'+item.nameCN+'」';
					this.popupShow = true
				}
			},
			delLink(item){
        		if (this.delWaiting)
					this.$store.commit('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
        		else{
					this.delTarget = {delLinkID:item.id,delLinkType:item.type};
					this.popupTitle = '删除外部链接';
					this.popupContent = '确定要删除外部链接「'+item.name+'」';
					this.popupShow = true;
				}
			},
			delConfirm(bool){
				if (bool){
					this.delWaiting = true;
					post('/apis/auth/v10api.php',{token:this.token,...aesEncrypt(JSON.stringify(this.delTarget))}).then(response=>{
						if (response.data.code < 1){
							if (this.delTarget.delTag){
								this.searchKey = '';
								delete this.tagDict[this.delTarget.delTag];
								this.tags = Object.keys(this.tagDict);
							}
							else if(this.delTarget.delSeriesID){
								for(let i=0;i<this.seriesList.length;i++)
									if (this.seriesList[i].id === this.delTarget.delSeriesID){
										this.seriesList.splice(i,1);
										break;
									}
							}
							else if (this.delTarget.delCatID){
								for(let i=0;i<this.categoryList.length;i++)
									if (this.categoryList[i].id === this.delTarget.delCatID){
										this.categoryList.splice(i,1);
										break;
									}
							}
							else if(this.delTarget.delLinkID&&this.delTarget.delLinkType){
								let targetList = this.outerLinks[this.delTarget.delLinkType];
								for(let i=0;i<targetList.length;i++)
									if (targetList[i].id === this.delTarget.delLinkID){
										targetList.splice(i,1);
										break;
									}
							}
							this.$store.commit('infoBox/callInfoBox',{info:'删除操作成功', ok:true, during:2000});
						}
						else
							this.$store.commit('infoBox/callInfoBox',{info:'删除操作失败', ok:false, during:2000});
						this.delWaiting = false;
						this.popupShow = false;
					}).catch(err=>console.warn(err))
				} //确认删除
				else
					this.popupShow = false
			},
			changeHeader(item){
        		if (this.delWaiting)
					this.$store.commit('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
        		else{
					let data = item.file?{headerID:item.id,description:item.tmpDes,file:1}:{headerID:item.id,description:item.tmpDes,file:0};
					let fd = new FormData();
					fd.append('token',this.token);
					let encData_param = aesEncrypt(JSON.stringify(data));
					fd.append('encData',encData_param.encData);
					fd.append('param',encData_param.param);
					if (item.file){
						fd.append('bg',item.file)
					}
					post_form('/apis/auth/v10api.php',fd).then(response=>{
						if (response.data.code < 1){
							item.file = undefined;
							item.description = item.tmpDes = response.data.data.des;
							this.$store.commit('infoBox/callInfoBox',{info:'背景修改成功', ok:true, during:2000});
						}
						this.delWaiting = false;
					}).catch(err=>console.warn(err));
				}
			},
			imgAdd(e){
				e.target.previousElementSibling.click();
			},
			imgChange(e){
        		let id = e.target.id;
        		let file = e.target.files[0];
        		if (file){
					if(/image\/\w+/.test(file.type))
						if(file.size<10000000){
							let fr = new FileReader();
							fr.onload = ()=>this.headers[id].imgSrc = fr.result;
							fr.readAsDataURL(file);
							this.headers[id].file = file
						}
						else
							window.alert('文件过大');
					else window.alert('请选择正确的文件类型')
				}
			},
		},
		computed:{
			...mapState({
				token:state=>state.account.token,
			})
		},
		mixins:[tagCloudMixin]
    }
</script>

<style scoped>
	.tag-set-btns{
		margin: .1rem 0;
	}
		.tag-set-btns .tag-del,.tag-set-btns .tag-add{
			position: relative;
			display: inline-block;
			width: 2rem;
			margin-right: .2em;
		}
		.series-add,.cat-add{
			position: relative;

		}
			.tag-del a,.tag-add a,.series-add a,.cat-add a,.link-add a{
				padding: 0 .05rem;
				position: absolute;
				cursor: pointer;
				top: .06rem;
				right: 0;
				border-left: .01rem dotted #eaeaea;
			}
			.tag-del input,.tag-add input,.series-add input,.cat-add input{
				width: 100%;
				outline: none;
				font-size: .14rem;
				line-height: .14rem;
				padding: .05rem .3rem .05rem .1rem;
				border: .01rem solid #eeeeee;
				border-radius: .03rem;
			}
			.tag-del input:focus + .match-list,.tag-del:hover .match-list{
				display: block;
			}
			.tag-del .match-list{
				display: none;
				padding: .1rem 0;
				position: absolute;
				top: 100%;
				left: 0;
				width: 100%;
				font-size: .14rem;
				font-weight: 600;
				list-style-type: none;
				background: white;
				border: .01rem solid #eeeeee;
			}
				.tag-del .match-list .match-list-item{
					line-height: .2rem;
					padding: 0 .1rem;
					cursor: pointer;
					transition: .3s ease;
				}
				.tag-del .match-list .match-list-item:hover{
					background: #eaeaea;
				}
	.setting-series,.setting-cat{
		display: inline-block;
		width: 2.2rem;
		margin-right: .3rem;
		margin-bottom: .2rem;
		vertical-align: top;
	}
		.setting-series ul,.setting-cat ul{
			list-style-type: none;
			border: .01rem solid #eaeaea;
			border-radius: .04rem;
			margin: .1rem 0;
		}
			.setting-series ul li,.setting-cat ul li{
				position: relative;
				border-bottom: .01rem solid #eaeaea;
				height: .4rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				line-height: .4rem;
				font-size: .14rem;
				padding: 0 .3rem 0 .1rem;
				user-select: none;
				transition: .3s ease;
			}
			.setting-series ul li:hover,.setting-cat ul li:hover{
				background: #00a1d6;
				color: white;
			}
			.setting-series ul li:last-child,.setting-cat ul li:last-child{
				border-bottom: none;
			}
				.setting-series ul li:hover a,.setting-cat ul li:hover a{
					opacity: 1;
				}
				.setting-series ul li a,.setting-cat ul li a{
					position: absolute;
					top: 0;
					right: .1rem;
					font-size: .12rem;
					cursor: pointer;
					color: white;
					opacity: 0;
				}
				.setting-cat ul li span{
					color: #ddd;
					font-size: .12rem;
				}
	.header-card{
		display: inline-block;
		width: 2.5rem;
		border: .01rem solid #eaeaea;
		margin-right: .2rem;
		margin-bottom: .2rem;
	}
		.header-card .bg-chg{
			position: relative;
			background-position: center;
			background-size: cover;
			height: 1rem;
			padding: .2rem;
		}
		.header-card .bg-chg:before{
			content: '';
			position: absolute;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
			background: #1e1e1e60;
		}
			.header-card .bg-chg a{
				position: absolute;
				color: white;
				padding: .05rem;
				right: 0;
				bottom: 0;
				opacity: 0;
				cursor: pointer;
			}
			.header-card .bg-chg:hover a{
				opacity: 1;
			}
			.header-card .bg-chg input{
				position: relative;
				background: transparent;
				height: .3rem;
				width: 100%;
				border-radius: .02rem;
				border: none;
				outline: none;
				box-shadow: none;
				color: white;
				font-size: .14rem;
				line-height: .3rem;
				font-weight: 600;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				transition: .3s ease;
			}
			.header-card .bg-chg input:hover{ /*这一个可与spaceAlbumAlbum合并*/
				background: hsla(0,0%,100%,.2);
				box-shadow: 0 0 0 .01rem hsla(0,0%,100%,.5);
			}
			.header-card .bg-chg input:focus{
				background: #ffffffa0;
				box-shadow: inset 0 .02rem .04rem rgba(35,54,86,.3);
				color: #6d757a;
			}
		.header-card .bg-title{
			position: relative;
			height: .5rem;
			background: #f8f8f8;
			color: #6d757a;
			text-align: center;
			line-height: .5rem;
			font-weight: 600;
			user-select: none;
		}
			.header-card .bg-title a{
				position: absolute;
				top: .1rem;
				right: .1rem;
				background: white;
				font-size: .12rem;
				font-weight: normal;
				line-height: .12rem;
				padding: .05rem;
				border: .01rem solid #eaeaea;
				border-radius: .02rem;
				cursor: pointer;
			}
			.header-card .bg-title a:hover{
				background: #eaeaea;
			}

	.s-link-list{
		border: .01rem solid #eaeaea;
		font-size: 0;
		margin-bottom: .2rem;
	}
		.s-link-list h4{
			display: inline-block;
			background: #eaeaea;
			writing-mode: vertical-rl;
			font-size: .16rem;
			line-height: .5rem;
			width: .5rem;
			height: 1rem;
			text-align: center;
			vertical-align: top;
		}
		.s-link-list ul{
			display: inline-block;
			padding: .1rem .2rem;
			max-width: calc(100% - .5rem);
			max-height: 1rem;
			overflow: auto;
			vertical-align: top;
			list-style-type: none;
		}
			.s-link-list ul li{
				position: relative;
				float: left;
				font-size: .14rem;
				line-height: .2rem;
				margin-right: .15rem;
			}
				.s-link-list ul li a:hover{
					color: #00a1d6;
				}
				.s-link-list ul li i{
					position: absolute;
					opacity: 0;
					top: -.06rem;
					right: -.1rem;
					font-size: .12rem;
					line-height: .12rem;
					color: #b8c0cc;
					cursor: pointer;
					transition: .3s ease;
				}
				.s-link-list ul li:hover i{
					opacity: 1;
				}
				.s-link-list ul li i:hover{
					color: #FF7D7D;
				}

	.link-add{
		display: block;
		position: relative;
		margin-bottom: .2rem;
		font-size: 0;
	}
		.link-add .type-input{
			display: inline-block;
			position: relative;
			padding: 0 .1rem;
			width: 15%;
			border: .01rem solid #eaeaea;
			border-radius: .03rem 0 0 .03rem;
			line-height: .26rem;
			text-align: center;
			vertical-align: top;
		}
		.link-add .type-input span{
			font-size: .15rem;
			vertical-align: middle;
		}
		.link-add .type-input i{
			font-size: .16rem;
		}
		/*-----------这块使用spaceAlbumAlbumU样式*/
			.upload-info .type-input ul,.link-add .type-input ul{
				display: none;
				position: absolute;
				width: 100%;
				right: 0;
				top: 100%;
				list-style-type: none;
				margin-top: .01rem;
				padding: .05rem 0;
				background: white;
				border: .01rem solid #e5e9ef;
				border-radius: .03rem;
				box-shadow: 0 .02rem .04rem rgba(0,0,0,.2);
				z-index: 1000;
			}
			.upload-info .type-input:hover ul,.link-add .type-input:hover ul{
				display: block;
			}
				.upload-info .type-input ul li,.link-add .type-input ul li{
					font-size: .14rem;
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					transition: .3s ease;
					cursor: pointer;
				}
				.upload-info .type-input ul li:hover,.link-add .type-input ul li:hover{
					color: #00a1d6;
					background-color: #e5e9ef;
				}
		/*-------------------------------------*/
		.link-add input{
 			display: inline-block;
			padding: .05rem .3rem .05rem .1rem;
			width: 65%;
			outline: none;
			font-size: .14rem;
			line-height: .16rem;
			border: .01rem solid #eeeeee;
			margin-right: -.01rem;
		}
		.link-add input.link-name{
			width: 20%;
		}
		.link-add input:focus{
			box-shadow: inset 0 0 .04rem rgba(35,54,86,.1);
		}

	/*使用spaceLaunch样式覆盖*/
	.space-launch,.space-album,.space-setting{
		margin: 0 auto;
		max-width: 12rem;
		background: white;
		border-radius: .05rem;
		box-shadow: 0 0 0 .01rem #eee;
		overflow: hidden;/**/
	}
	.space-setting{
		text-align: left;
		padding: .2rem;
	}
	.setting-tags .section-content{
		max-width: 8rem;
	}
	/*-------------------------------------------借用Archive样式*/
	.tag-cloud h2{
		margin: .2rem 0 .1rem 0;
	}
	.tag-cloud h4{
		margin: .1rem 0;
	}
	.tag-cloud .roll-toggle{
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		background: #eaeaea;
		padding: .05rem 0;
		width: .22rem;
		font-size: .12rem;
		line-height: .12rem;
		border-radius: .03rem;
		transition: all .5s cubic-bezier(.25,.46,.45,.94);
	}
	.tag-cloud .roll-toggle:hover{
		color: white;
		background: rgba(0,0,0,.8);
	}
	.tag-list{
		list-style-type: none;
		overflow: hidden;
		max-height: 1rem;
		transition: 1s;
	}
	.tag-list.more{
		max-height: 10rem;
	}
	.tag-list .tag{
		display: inline-block;
		padding: 0 .08rem;
		margin-right: .05rem;
		margin-bottom: .1rem;
		border: .02rem solid rgba(0,0,0,.1);
		border-radius: 1rem;
		font-size: .14rem;
		line-height: .2rem;
		transition: .5s cubic-bezier(.25,.46,.45,.94);
	}
	.tag-list .tag a{
		color: #6d757a;
	}
	.tag-list .tag:hover a{
		color: white;
	}
	.tag-list .tag:hover{
		border-color: rgba(0,0,0,.5);
		background: rgba(0,0,0,.5);
	}
	/*--------------------------------------------------------*/
	/*下面使用SpaceDynamic样式*/
	.popup-panel-container{/*可能与authbox样式合并*/
		position: fixed;
		z-index: 2000;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,.4);
		left: 0;
		top: 0;
	}
	.popup-panel{
		position: relative;
		top: 50%;
		transform: translate(0,-50%);
		margin: 0 auto;
		width: 4.5rem;
		background: white;
		border: .01rem solid #6d757a;
		box-shadow: 0 0 .15rem rgba(0,0,0,.4);
		border-radius: .05rem;
		padding: .2rem;
	}
	.popup-panel .popup-title{
		color: #00a1d6;
	}
	.popup-content{
		font-size: .14rem;
		margin: .1rem 0;
	}
	.popup-confirm button{
		width: 1rem;
		padding: .05rem .1rem;
		font-size: .15rem;
		line-height: .15rem;
		margin: 0 .1rem;
		border-radius: .04rem;
		border: .01rem solid #23ade5;
		transition: .3s ease;
	}
	.popup-confirm button.btn-primary{
		background: #23ade5;
		color: white;
	}
	.popup-confirm button.btn-primary:hover{
		background: #00a1d6;
	}
	.popup-confirm button.btn-secondary{
		color: #23ade5;
	}
	.popup-confirm button.btn-secondary:hover{
		color: white;
		background: #23ade5;
	}
	.popup-cancel{
		position: absolute;
		top: .15rem;
		right: .15rem;
		font-size: .13rem;
		cursor: pointer;
	}
	.popup-cancel:hover{
		color: #00a1d6;
	}
</style>
