<template>
    <div class="space-launch">
		<div class="l-sidenav">
			<ul class="sidenav-list">
				<li class="sidenav-item" @click="curType='article';curCom='draft'">文章</li>
				<li class="sidenav-item" @click="curType='note';curCom='draft'">笔记</li>
				<li class="sidenav-item">管理</li>
			</ul>
		</div>
		<component class="l-main" :is="curCom" :type="curType"></component>
	</div>
</template>

<script>
	import SpaceLaunchDraft from '@/components/SpaceLaunchDraft'
    export default {
        name: "SpaceLaunch",
		created(){

		},
		data(){
        	return{
				curCom:'draft',
				curType:'article'
			}
		},
		components:{
        	draft:SpaceLaunchDraft
		}

    }
</script>

<style scoped>
	.space-launch {
		margin: 0 auto;
		max-width: 12rem;
		background: white;
		border-radius: .05rem;
		box-shadow: 0 0 0 .01rem #eee;
		overflow: hidden;/**/
	}
	.l-sidenav{
		width: 2rem;
		float: left;
		font-size: .14rem;
	}
		.sidenav-list{list-style-type: none;margin: .1rem 0}
			.sidenav-list .sidenav-item{
				text-align: left;
				line-height: .4rem;
				padding-left: .3rem;
				transition: .5s ease;
				cursor: pointer;
			}
			.sidenav-list .sidenav-item:hover{
				background-color: #f4f5f7;
				color: #00a1d6;
			}
			.sidenav-list .sidenav-item.cur{
				background-color: #00a1d6;
				color: white;
			}
	.l-main {
		width: calc(100% - 2rem);
		float: left;
		padding: .2rem;
		border-left: .01rem solid #eaeaea;
	}

</style>
