import Vue from 'vue'
export const media = new Vue({});
export const monsMap = ['','Jan ','Feb ','Mar ','Apr ','May ','Jun ','Jul ','Aug ','Sep ','Oct ','Nov ','Dec '];
export const mdSetEdit = {
	tabSize:4,
	codeStyle:'darcula',
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
	}
};

export const mdSetPreview = {
	tabSize:4,
	subfield:false,
	defaultOpen:'preview',
	editable:false,
	toolbarsFlag:false,
	scrollStyle:true,
	codeStyle:'darcula'
};

