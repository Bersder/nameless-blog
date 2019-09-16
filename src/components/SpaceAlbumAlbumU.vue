<template>
    <div>
		<div class="section upload">
			<h3 class="section-title">图片上传</h3>
			<div class="section-content">
				<div class="upload-box">
					<transition name="balloon">
						<div class="balloon" v-if="balloonShow">请确认你已经填好描述并选择图片</div>
					</transition>
					<div class="upload-img" :class="{empty:!tmpImg}" @click="imgAdd" id="img">
						<div class="no-img-meta" v-if="!tmpImg">
							<i style="font-size: .5rem" class="iconfont icon-plus clearm"></i>
							<p>点击添加图片</p>
						</div>
						<input type="file" @change="imgChange" id="img-input" hidden>
					</div>
					<button @click="add2wait">添加至待上传</button>
				</div>

				<h4 class="tl">图片描述及归类</h4>
				<div class="upload-info">
					<div class="type-input">
						<span>{{typeMap[tmpType]}}</span><i class="iconfont icon-down clearm pr"></i>
						<ul><li v-for="(item,key) in typeMap" @click="tmpType=key">{{item}}</li></ul>
					</div>
					<input type="text" class="description-input" placeholder="图片描述" v-model.trim="tmpDes">
				</div>
			</div>
		</div>

		<div class="section upload-list tl">
			<h3 class="section-title">待上传</h3>
			<div class="section-content" :class="{empty:!imgs.length}" etext="待上传图片——无">
				<div class="upload-list">
					<div class="album-card" v-for="item in imgs">
						<a class="picture" :style="item.img|bgUrl" :class="{uploading:item.uploading,fail:item.fail}"><a @click.stop="delImg(item)" v-if="!item.uploading" class="iconfont icon-trash clearm"></a></a>
						<a class="title">{{item.des}}<span style="font-size: .12rem;color: #8b8e99"> ·{{typeMap[item.type]}}</span></a>
					</div>
				</div>

				<div class="upload-foot" v-if="imgs.length">
					<span>最多同时上传5张图片(多图先后顺序受影响)</span>
					<button @click="uploadAll">上传所有</button>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {post_form} from "../util/http";

	export default {
        name: "SpaceAlbumAlbumU",
		data(){
        	return{
        		balloonShow:false,
				imgs:[],
				tmpImg:null,
				tmpDes:'',
				tmpType:'anime',
				typeMap:{anime:'Anime',game:'游民',trivial:'日常'},
			}
		},
		computed:{
			...mapState({
				token:state=>state.account.token
			})
		},
		methods:{
        	imgAdd(){
				document.getElementById('img-input').click();
			},
        	imgChange(e){
				let file = e.target.files[0];
				if (file){
					if(/image\/\w+/.test(file.type))
						if(file.size<10000000){
							let fr = new FileReader();
							fr.onload = ()=>document.getElementById('img').style.backgroundImage='url('+fr.result+')';
							fr.readAsDataURL(file);
							this.tmpImg = file;
						}
						else
							window.alert('文件过大');
					else window.alert('请选择正确的文件类型')
				}
			},
			add2wait(){
        		if (this.tmpImg&&this.tmpDes){
        			if (this.imgs.length<5){
						this.imgs.push({type:this.tmpType,des:this.tmpDes,img:this.tmpImg,uploading:false,fail:false});
						this.tmpImg = null;
						this.tmpDes = '';
						document.getElementById('img').style.backgroundImage='none'
					}
				}
        		else{
					this.balloonShow = true;
					setTimeout(()=>this.balloonShow=false,5000)
				}
			},
			uploadAll(){
				this.imgs.forEach(e=>{
					e.uploading = true;
					let fd = new FormData();
					fd.append('token',this.token);
					fd.append('type',e.type);
					fd.append('des',e.des);
					fd.append('img',e.img);
					post_form('/apis/auth/v9api.php',fd).then(response=>{
						if (response.data.code < 1)
							this.imgs.splice(this.imgs.indexOf(e),1);
						else{
							e.uploading = false;
							e.fail = true
						}
					})
				})


			},
			delImg(item){
        		this.imgs.splice(this.imgs.indexOf(item),1)
			}
		},
		filters:{
			bgUrl(file){
				let url = window.URL.createObjectURL(file);
				return  'background-image: url('+url+')'
			}
		}
    }
</script>

<style scoped>
	.balloon-enter-active{
		animation: fadeIn .5s ease;
	}
	.balloon-leave-active{
		animation: fadeIn .5s ease reverse;
	}
	.upload-box{
		position: relative;
	}
	.upload-box .balloon{
		position: absolute;
		width: 1.5rem;
		top: .4rem;
		left: .4rem;
		padding: .15rem .1rem;
		border-radius: .05rem;
		background: rgba(30,30,30,.3);
		color: white;
		box-shadow: 0 0 .1rem rgba(0,0,0,.1);
	}
	.upload-box .balloon:before{
		content: '';
		position: absolute;
		top: 50%;
		transform: translate(0,-50%);
		right: -.2rem;
		border: .1rem solid;
		border-color: transparent transparent transparent rgba(30,30,30,.3);
	}
	.upload-box .balloon:after{
		content: '';
		position: absolute;
		left: 50%;
		transform: translate(-50%,0);
		bottom: -.2rem;
		border: .1rem solid;
		border-color: rgba(30,30,30,.3) transparent transparent transparent;
	}
	.upload-box .upload-img{
		display: inline-block;
		padding-top: .4rem;
		cursor: pointer;
		height: 1.7rem;
		width: 3rem;
		color: #b8c0cc;
		border-radius: .04rem;
		background-position: center center;
		background-size: cover;
		transition: .3s ease;
	}
	.upload-box .upload-img.empty{
		border: .02rem dashed #b8c0cc;
	}
	.upload-box .upload-img:hover{
		border-color: #00a1d6;
		color: #00a1d6;
	}
	.upload-box button,.upload-foot button{
		margin-left: .2rem;
		vertical-align: bottom;
		font-size: .14rem;
		line-height: .3rem;
		padding: 0 .12rem;
		border-radius: 1rem;
		border: .02rem solid rgba(0,0,0,.1);
		color: #6a737d;
		font-weight: bold;
		transition: .3s ease;
	}.upload-foot button{flex: 1}
	.upload-box button:hover,.upload-foot button:hover{
		color: white;
		background: #00a1d6;
	}



	.upload-info{
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		margin-top: .1rem;
		margin-bottom: .2rem;
	}
	.upload-info .type-input{
		flex: 1;
		position: relative;
		border: .01rem solid #b8c0cc;
		border-radius: .03rem 0 0 .03rem;
		line-height: .3rem;
		padding: 0 .1rem;

	}
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
	.upload-info .description-input{
		flex: 9;
		border: .01rem solid #b8c0cc;
		border-left-color: transparent;
		border-radius: 0 .03rem .03rem 0;
		padding: 0 .1rem;
		transition: .3s ease;
		color: grey;
		font-size: .14rem;
		line-height: .3rem;
		outline: none;
	}
	.upload-info .description-input:focus{
		color: #1e1e1e;
	}




	.upload-foot{
		margin-bottom: .2rem;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
	}
	.upload-foot span{
		flex: 6;
		line-height: .3rem;
		font-size: .15rem;
		color: #b8c0cc;
		text-align: center;
		border: .02rem dashed #edf2fa;
		border-radius: .03rem;

	}

/*	使用spaceAlbumAlbum样式*/
	.album-card{
		display: inline-block;
		width: 1.79rem;
		margin: 0 .15rem .15rem 0;
	}
	.album-card:nth-child(5n){margin-right: 0}
	.album-card .picture {
		display: block;
		position: relative;
		height: 1.4rem;
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
		border-radius: .04rem;
		margin-bottom: .05rem;
	}
	.album-card .picture.uploading:before{
		content: '上传中 ...';
		color: white;
		text-align: center;
		padding-top: .5rem;
		font-size: .2rem;
		font-weight: bold;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		border-radius: .04rem;
		background: rgba(0,0,0,.5);
	}
	.album-card .picture.fail:before{
		content: '上传失败';
		color: white;
		text-align: center;
		padding-top: .5rem;
		font-size: .2rem;
		font-weight: bold;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		border-radius: .04rem;
		background: rgba(0,0,0,.5);
	}
	.album-card .picture a{
		position: absolute;
		bottom: 0;
		right: 0;
		opacity: 0;
		padding: .07rem;
		color: white;
		background: rgba(0,0,0,.4);
		border-radius: .03rem 0 0 0;
		cursor: pointer;
	}
	.album-card .picture:hover a{
		opacity: 1;
	}
	.album-card .picture a:hover{
		background: rgba(0,0,0,.7);
	}
	.album-card .title {
		display: block;
		font-size: .14rem;
		line-height: .2rem;
		height: .4rem;
		overflow: hidden;
	}
</style>
