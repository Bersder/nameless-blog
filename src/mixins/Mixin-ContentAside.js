export default {
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
}
