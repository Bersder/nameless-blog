<template>
    <div class="space-launch">
		<div class="l-sidenav">
			<ul class="sidenav-list">
				<li class="sidenav-item" :class="{cur:curIndex===0}" @click="curType='article';curCom='draft';curIndex=0">文章</li>
				<li class="sidenav-item" :class="{cur:curIndex===1}" @click="curType='note';curCom='draft';curIndex=1">笔记</li>
				<li class="sidenav-item" :class="{cur:curIndex===2}" @click="curCom='admin';curIndex=2">内容管理</li>
			</ul>
		</div>
		<component class="l-main" :is="curCom" :type="curType"></component>
	</div>
</template>

<script>
	import SpaceLaunchDraft from '@/components/SpaceLaunchDraft'
	import SpaceLaunchAdmin from '@/components/SpaceLaunchAdmin'

    export default {
        name: "SpaceLaunch",
		created(){

		},
		data(){
        	return{
				curCom:'draft',
				curType:'article',
				curIndex:0,
			}
		},
		components:{
        	draft:SpaceLaunchDraft,
			admin:SpaceLaunchAdmin
		}

    }
</script>

<style>
</style>
