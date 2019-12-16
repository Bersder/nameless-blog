<template>
    <div class="space-dynamic">
		<div class="col-1">
			<div class="history-dynamic">
				<div class="dynamic-content-wrap" v-for="each in curDynamics" :key="each.id">
					<div class="dynamic-avatar"><img :src="avatar" height="40" width="40"></div>
					<div class="dynamic-meta">
						<p class="uname">{{name}}</p>
						<span>{{each.type|typeEN2CN}} · {{each.time|postTime}}</span>
					</div>
					<div class="dynamic-content"><p>{{each.content}}</p></div>
					<div class="dynamic-opt">
						<i class="iconfont icon-more"></i>
						<div class="more-opt">
							<a @click="delDynamic(each)">删除</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="col-2">
			<div class="section dynamic-launch">
				<h4>发布动态</h4>
				<textarea placeholder="要写些什么呢?" v-model="sendContent"></textarea>
				<div class="type-selector">
					<div v-for="(item,key) in typeMap" @click="sendType=key" :class="{cur:sendType===key}">{{item}}</div>
				</div>
				<button @click="launchDynamic">确认</button>
			</div>
		</div>

		<div class="popup-panel-container" v-if="popupShow">
			<div class="popup-panel">
				<h3 class="popup-title tl">删除动态</h3>
				<div class="popup-content tl">确定要删除此条动态?</div>
				<div class="popup-confirm tc">
					<button class="btn-primary" @click="delConfirm(true)">删除</button><button class="btn-secondary" @click="delConfirm(false)">手抖点错</button>
				</div>
				<a class="popup-cancel" @click="popupShow=false"><i class="iconfont icon-cancel"></i></a>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';
	import {mapState} from 'vuex';
	export default {
        name: "SpaceDynamic",
		created(){
			this.$post('/apis/auth/v6api.php').then(response=>{
				let data = response.data.data;
				data.dynamics.forEach(e=>this.curDynamics.push(e));
				this.dynamicNum = parseInt(data.dNum);
			}).catch(err=>console.warn(err))
		},
		data(){
        	return{
				curDynamics:[],
				dynamicNum:0,
				popupShow:false,
				delTarget:null, //待删目标
				sendContent:'',
				sendType:'',
				typeMap:{anime:'Anime',code:'极客',game:'游民',trivial:'随写'},
				loadWait:false
        	}
		},
		watch:{
			reachBottom(cur,pre){
				if (cur)this.loadMore();
			}
		},
		methods:{
        	launchDynamic(){
        		if (this.sendContent.replace(/^\s*|\s*$/g,'')&&this.sendType){
        			let data = {
						content:this.sendContent.replace(/^\s*|\s*$/g,''),
						type:this.sendType
					};
        			this.$post('/apis/auth/v7api.php',data).then(response=>{
						if (response.data.code<1){
							this.sendContent = '';
							this.$store.commit('infoBox/callInfoBox',{
								info:'动态发布成功',
								ok:true,
								during:2000
							});
							setTimeout(()=>location.reload(),2000)
						}
					}).catch(err=>console.warn(err))
				}
        		else{
					window.alert('请检查必要信息是否完整且正确')
				}
			},
        	delDynamic(item){
				this.delTarget = item;
				this.popupShow = true;
			},
			delConfirm(bool){
				if (bool) //确认删除
					this.$post('/apis/auth/v7api.php?delete='+this.delTarget.id).then(response=>{
						if (response.data.code<1){//删除成功，总数-1,
							this.dynamicNum--;
							this.curDynamics.splice(this.curDynamics.indexOf(this.delTarget),1);
							this.popupShow = false;
							this.$store.commit('infoBox/callInfoBox',{
								info:'动态删除成功',
								ok:true,
								during:2000
							});
						}
					}).catch(err=>console.warn(err));
				else
					this.popupShow = false
			},
        	loadMore(){
				if (this.curDynamics.length < this.dynamicNum&&!this.loadWait) {
					this.loadWait = true;
					this.$post('/apis/auth/v6api.php?more='+Math.floor(this.curDynamics.length/10)).then(response=>{
						this.loadWait = false;
						response.data.data.dynamics.forEach(e=>this.curDynamics.push(e))
					}).catch(err=>console.warn(err))
				}
			}
		},
		computed:{
			...mapGetters(['reachBottom']),
			...mapState({
				token:state=>state.account.token,
				avatar:state=>state.account.avatar,
				name:state=>state.account.name
			})
		},
		filters:{
        	typeEN2CN(type){
				if (type==='anime')return '吐槽';
				else if (type==='code')return 'Error';
				else if (type==='game')return '游言';
				else return '日常';
			},
			postTime(datetime){
				let gap = new Date().getTime() -  new Date(datetime).getTime();
				if (gap<60000)return '刚刚';
				else{
					let gap_m = Math.floor(gap/60000);
					if (gap_m<60)return gap_m + '分钟前';
					else{
						let gap_h = Math.floor(gap_m/60);
						if (gap_h<24)return gap_h + '小时前';
						else{
							let gap_d = Math.floor(gap_h/24);
							if (gap_d<30)return gap_d + '日前';
							else return datetime.substr(0,10);
						}
					}
				}
			}
		}
    }
</script>

<style>
</style>
