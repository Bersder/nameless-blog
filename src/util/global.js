export const tagCloudMixin = {
	data(){
		return{
			tagDict:{},
			manyTags:false,
			tagExpand:false
		}
	},
	filters:{
		expandStatus(e){
			return e?'-':'+'
		}
	}
};
export const contentAsideMixin = {
	data(){
		return{
			firstImg:'/site/static/nodata.png',
			firstDes:'数据正在赶路中',
			gossip:{content:'这里什么都没有',time:'2333-06-06 23:33:33'},
		}
	},
	methods:{
		openLB(){
			this.$store.commit('lbShowC',true);
		},
	},
	filters:{
		gossipTime(datetime){
			let ymd = datetime.substr(0,10).split('-');
			return ['','Jan ','Feb ','Mar ','Apr ','May ','Jun ','Jul ','Aug ','Sep ','Oct ','Nov ','Dec '][parseInt(ymd[1])] + ' ' + ymd[2] + ', ' + datetime.substr(11,5)
		}
	}
};
export const panelhMixin = {
	filters:{
		typeEN2CN(type){
			if (type==='anime')return 'Anime';
			else if (type==='code')return '极客';
			else if (type==='game')return '游民';
			else return type==='trivial'?'随写':'笔记'
		},
		ym(time){
			return time.substr(0,4) + '. ' + time.substr(5,2)
		},
		commentNum(count){
			return count>0?count+' 评论':'No Comment';
		},
		readNum(count){
			return count.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
		},
	}
};
export const mdSetEdit = {
	tabSize:4,
	codeStyle:'github',//darcula
	imageFilter:function(file){
		return (/image\/\w+/.test(file.type)&&file.size<5000000);
	},
	subfield:true,
	toolbars:{
		bold: true,
		italic: true,
		header: true,
		underline: true,
		strikethrough: true,
		mark: true,
		superscript: true,
		subscript: true,
		quote: true,
		ol: true,
		ul: true,
		link: true,
		imagelink: true,
		code: true,
		table: true,
		fullscreen: false,
		readmodel: true,
		htmlcode: false,
		help: true,
		undo: true,
		redo: true,
		trash: false,
		save: true,
		navigation: true,
		alignleft: true,
		aligncenter: true,
		alignright: true,
		subfield: true,
		preview: true,
	},
	externalLink: {
		markdown_css:()=>'/root/markdown/github-markdown3.0.css'
	}
};

export const mdSetPreview = {
	tabSize:4,
	subfield:false,
	defaultOpen:'preview',
	editable:false,
	toolbarsFlag:false,
	scrollStyle:true,
	codeStyle:'github',
	shortCut:false,
	externalLink: {
		markdown_css:()=>'/root/markdown/github-markdown3.0.css'
	}
};

