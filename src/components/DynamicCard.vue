<template>
    <div class="d-card">
		<div class="author-avatar"></div>
		<div class="content tl">
			<p class="author-namae">我的世界</p>
			<p class="time">刚刚</p>
			<div class="d-card-content">
				<div class="text" v-html="dRenderer(test,0,0)"></div>
				<div class="imagesbox"></div>
			</div>
			<div class="d-card-bar">

			</div>

		</div>
	</div>
</template>

<script>
	import marked from 'marked';
	import {unique} from "../utils/lib";

	export default {
        name: "DynamicCard",
		async created(){
			let renderer = new marked.Renderer();
			renderer.heading = (text, level, raw, slugger) => '<p>'+ text +'</p>';
			renderer.hr = () => '';
			renderer.table = (header, body) => '';
			renderer.tablerow = content => '';
			renderer.tablecell = (content, flags) => '';
			marked.setOptions({
				renderer: renderer,
				gfm: true,
				tables: true,
				breaks: true, //不开启时，单个换行只会p内\n换行（表现为空格）、多个换行会生成两个p;开启时单个换行会导致p内br换行，多个换行会导致两个p间br换行
				pedantic: false,
				sanitize: true,//开启时忽略rawString中的html标签
				smartLists: true,
				smartypants: false
			});
			await this.fetchEmo();
			this.test.content = '**wwww** ∫f(2233_无语)'
		},
		data(){
        	return{
				emoData:[{emoSeries:'',emoList:[]}],
				emoMap:{},
				emoBoxShow:false,
				emoIndex:0,

				zooming:false,
        		commentList: [],
				test:{content:'**wwww**'}
			}
		},
		methods:{
			async fetchEmo(){
				let response = await this.$fetch('/static/emo/emo.json');
				let data = response.data;
				data.forEach(e=>{
					e.thumbnail = e.path + e.thumbnail;
					if (e.pic){
						let f = e.path.split('/');
						let g = f[f.length-2]+'_';//类别前缀
						e.emoList.forEach(f=>{
							f.des = g + f.des;
							f.imgSrc=e.path+f.imgSrc;
							f.insert = '∫f(' + f.des + ')';
							this.emoMap[f.des] = f.imgSrc;
						});
					}
				});
				this.emoData = data;
				console.log('1111')
			},
        	dRenderer(item,isComment,isReply){
        		if (isComment){
					let start = (isReply&&this.isMobile)?`[@${item.to_uname}](#dc-${item.parent_id})`:'';
					return marked(this.emoRenderer(start+item.content))
				}
        		else
        			return marked(this.emoRenderer(item.content))
			},
			emoRenderer(raw){
				let tmp = raw;
				let replaceSrcList = tmp.match(/∫f\(.+?\)/g);
				if (replaceSrcList){ //当使用了表情包后，需要转义替换以便mark
					let replaceDstList = [];
					let replaceAltList = [];
					replaceSrcList = unique(replaceSrcList);
					replaceSrcList.forEach(e=>{
						let alt = e.match(/∫f\((.+?)\)/)[1];
						replaceAltList.push(alt);
						console.log(alt);
						replaceDstList.push(this.emoMap[alt]);
						console.log(this.emoMap[alt])
					});
					// console.log(replaceSrcList);
					// console.log(replaceAltList);
					// console.log(replaceDstList);
					for (let i = 0; i < replaceSrcList.length; i++){
						let reg = new RegExp(replaceSrcList[i].replace('(','\\(').replace(')','\\)'),'g');
						if (replaceDstList[i])//没有的表情不进行渲染
							tmp = tmp.replace(reg,'!['+replaceAltList[i]+'](/root'+replaceDstList[i]+') ');
						else
							tmp = tmp.replace(reg,' ');
					}
				}
				return tmp
			},
			commentToggle(){

			}
		},
		computed:{
			isMobile(){return this.$store.state.isMobile}
		},
		props:['ddata']
    }
</script>

<style>
	.d-card{
		position: relative;
		border: .01rem solid #eaeaea;
		border-radius: .04rem;
		background: #fcfaf2;
	}
	.d-card .author-avatar{
		position: absolute;
		width: .5rem;
		height: .5rem;
		top: .2rem;
		left: .2rem;
		background: url("http://localhost/uploads/avatar/me.png") center/cover no-repeat;
		border-radius: 50%;
	}
	.d-card .content{
		margin-left: .8rem;
		margin-right: .1rem;
		padding-top: .3rem;
		height: 5rem;/*tmp*/
	}
		.d-card .content .time{
			font-size: .12rem;
			color: #bbb;
		}
		.d-card-content{
			margin-top: .1rem;
			padding-right: .1rem;
		}
			.d-card-content .text{
				margin-bottom: .1rem;
				font-size: .14rem;
				word-wrap: break-word;
			}

</style>
