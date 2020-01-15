<template>
	<view class="content">
		<homePage v-if="page_code=='home'"></homePage>
		<pageTwo v-if="page_code=='my'"></pageTwo>
		<pageThree v-if="page_code=='task_list'"></pageThree>
		<pageFour v-if="page_code=='goods_type_select'"></pageFour>
		<footerNav :bgColor="bgColor"></footerNav>
	</view>
</template>

<script>
	import homePage from "@/pages/tabbar/index/index.vue";
	import pageTwo from "@/pages/tabbar/home/home.vue";
	import pageThree from "@/pages/tabbar/master/master.vue";
	import pageFour from "@/pages/shopMall/category/category.vue";
	import footerNav from "@/components/footer/footer_nav.vue";
	export default {
		data() {
			return {
				bgColor:''
			}
		},
		components: {
			homePage,
			pageTwo,
			pageThree,
			pageFour,
			footerNav
		},
		
		computed: {
			page_code() {
				return this.$store.state.footer_store.footer_nav[this.$store.state.footer_store.now_page_index].name_code;
			},
			isShop(){
				return this.$store.state.isShop
			}
		},
		onLoad() {
			console.log('index onload')
			if(this.isShop==2){//用户
				this.bgColor = '#F97C1A'
				this.$store.footer_store.dispatch('shopperMenu')
			}
		},
		
	}
</script>

<style scoped>
	 
	.content {
		text-align: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
