<template>
		<flixedadd :backgroundColor="backgroundColor" :selectbackgroundColor="selectbackgroundColor" :color="color" :selectcolor="selectcolor" :addlistdata="addlistdata" @addlisttap="addlisttap"></flixedadd>
	</view>
</template>
<script>
	import flixedadd from "../../components/xiaosikaifa-flixedadd/xiaosikaifa-flixedadd.vue"
	export default {
		components:{
			flixedadd
		},
		data() {
			return {
				backgroundColor:"#228B22",
				selectbackgroundColor:"#FFB233",
				color:"#FFB233",
				selectcolor:"#228B22",
				addlistdata:[
					{
						title:"第一个",
						src:"/static/logo.png"
					},
					{
						title:"第二个",
						src:"/static/qq.png"
					}
				]
			};
		},
		methods:{
			addlisttap:function(index){/*第一个序列为0,第二个为1,以此类推;当值为-1代表点击的是遮慕层*/
				uni.showToast({
					title: "点击的序列为"+index,
					duration: 1000
				});
			}
		}
	}
</script>

<style>
</style>
