<template>
    <div class="space-setting">
		<div class="section setting-tags">
			<h3 class="section-title" id="setting-tags">标签管理</h3>
			<div class="section-content">
				<div class="tag-cloud">
					<h4>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{this.tagExpand|expandStatus}}</a></h4>
					<ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
						<li class="tag" v-for="(item,key,index) in tagDict" :key="index" draggable="true"><a :title="item+' 相关'">{{key}}</a></li>
					</ul>
				</div>
				<div class="tag-set-btns">
					<div class="tag-del">
						<input v-model.trim="searchKey">
						<ul class="match-list" v-show="tagTips.length">
							<li class="match-list-item" v-for="(item,key,index) in tagTips" :key="index" @click="searchKey=item">
								<span>{{item.substr(0,item.toLowerCase().indexOf(searchKey.toLowerCase()))}}</span><span style="color:red">{{searchKey}}</span><span>{{item.substr(item.toLowerCase().indexOf(searchKey.toLowerCase())+searchKey.length)}}</span>
							</li>
						</ul>
						<a class="iconfont icon-trash tag-del-btn" @click="delTag"></a>
					</div>

				</div>
			</div>
		</div>

		<div class="section setting-tags">
			<h3 class="section-title" id="setting-series">系列管理</h3>
			<div class="section-content">

			</div>
		</div>
		<div class="section setting-tags">
			<h3 class="section-title" id="setting-category">笔记分类管理</h3>
			<div class="section-content">

			</div>
		</div>
		<div class="popup-panel-container" v-if="popupShow">
			<div class="popup-panel">
				<h3 class="popup-title tl">删除图片</h3>
				<div class="popup-content tl">确定要删除此图片?</div>
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

	export default {
        name: "SpaceSetting",
		created(){
			post('/apis/auth/v10api.php',{token:this.token||window.localStorage.getItem('BB3000_token')}).then(response=>{
				let data = response.data.data;
				console.log(data);
				data.tags.forEach(e=>{
					this.$set(this.tagDict,e.tagName,e.relateArt.split(',').length + e.relateNote.split(',').length - 4)
				});
				if (Object.keys(this.tagDict).length>30) this.manyTags = true;
				this.tags = Object.keys(this.tagDict);

			})
		},
		data(){
			return{
				popupTitle:'',
				popupContent:'',
				popupShow:false,
				delTarget:{},//删除对象，允许多种
				searchKey:'',
				tags:[],
				tagTips:[],
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
			delTag(){
				if (this.tags.indexOf(this.searchKey) >= 0) {
					this.delTarget = {delTag:this.searchKey};
					this.popupShow = true
				}
				else
					this.$store.commit('infoBox/callInfoBox',{
						info:'不存在该标签',
						ok:false,
						during:2000
					});
			},
			delConfirm(bool){
				if (bool){

				} //确认删除
				else
					this.popupShow = false
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
	.tag-del{
		position: relative;
		display: inline-block;
		width: 2rem;
	}
	.tag-del a{
		padding: 0 .05rem;
		position: absolute;
		cursor: pointer;
		top: .06rem;
		right: 0;
		border-left: .01rem dotted #eaeaea;
	}
	.tag-del input{
		width: 100%;
		outline: none;
		font-size: .14rem;
		line-height: .14rem;
		padding: .05rem .1rem;
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
