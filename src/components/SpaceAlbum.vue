<template>
    <div class="space-album">
		<div class="a-sidenav">
			<ul>
				<ul class="sidenav-list">
					<li class="sidenav-item" :class="{cur:curIndex===0}" @click="curCom='album';curIndex=0">我的相簿</li>
					<li class="sidenav-item" :class="{cur:curIndex===1}" @click="curCom='albumU';curIndex=1">上传图片</li>
				</ul>
			</ul>
		</div>

		<component :is="curCom" class="a-main"></component>
	</div>
</template>

<script>
	import SpaceAlbumAlbum from '@/components/SpaceAlbumAlbum'
	import SpaceAlbumAlbumU from '@/components/SpaceAlbumAlbumU'
    export default {
        name: "SpaceAlbum",
		created(){

		},
		data(){
        	return{
				curCom:'album',
				curIndex:0
			}
		},
		components:{
        	album:SpaceAlbumAlbum,
			albumU:SpaceAlbumAlbumU
		}

    }
</script>

<style>
</style>
