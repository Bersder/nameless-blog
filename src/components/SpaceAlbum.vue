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

<style scoped>
/*使用spaceLaunch样式覆盖*/
.space-launch,.space-album{
	margin: 0 auto;
	max-width: 12rem;
	background: white;
	border-radius: .05rem;
	box-shadow: 0 0 0 .01rem #eee;
	overflow: hidden;/**/
}
.l-sidenav,.a-sidenav{
	width: 2rem;
	float: left;
	font-size: .14rem;
}
.sidenav-list{list-style-type: none;margin: .1rem 0}
.sidenav-list .sidenav-item{
	text-align: left;
	line-height: .4rem;
	padding-left: .3rem;
	transition: .3s ease;
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
.l-main,.a-main{
	width: calc(100% - 2rem);
	float: left;
	padding: .2rem;
	border-left: .01rem solid #eaeaea;
}
</style>
