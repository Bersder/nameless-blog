<template>
    <div>
		wwww
	</div>
</template>

<script>
	import {post} from "../util/http";
	import {post_form} from "../util/http";
	import {mapState} from 'vuex'
	export default {
        name: "SpaceSetting",
		data(){
			return{

			}
		},
		methods:{

		},
		computed:{
			...mapState({
				token:state=>state.account.token,
			})
		},
    }
</script>

<style scoped>

</style>
