export default {
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
}
