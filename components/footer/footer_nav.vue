<template>
	<view>
		<view class="place"></view>
		<view class="footer" :style="{backgroundColor:bgColor}">
			<view :class="'footer_item ' + (item.size=='big'?'big_item':'')  " :style="'width:'+item_width" @click="change_nav(index)"
			 v-for="(item,index) in footer_nav" :key="index">
				<image :src="index==now_index?item.select_icon:item.icon" mode=""></image>
				<view>{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bgColor: {
				type: String,
				default: '#1abc9c'
			}
		},
		data() {
			return {

			};
		},
		methods: {
			change_nav(index) {
				this.$store.commit("change_page", index)
			}
		},
		computed: {
			item_width() {
				let length = this.$store.state.footer_store.footer_nav.length;
				switch (length) {
					case 1:
						return '100%'
						break;
					case 2:
						return '50%'
						break;
					case 3:
						return '33.3%'
						break;
					case 4:
						return '25%'
						break;
					case 5:
						return '20%'
						break;
					default:
						break;
				}
			},
			footer_nav() {
				console.log(this.$store.state.footer_store.footer_nav)
				return this.$store.state.footer_store.footer_nav
			},
			now_index() {
				return this.$store.state.footer_store.now_page_index;
			}
		}
	}
</script>

<style scoped>
	.place {
		height: 120rpx;
	}

	.footer {
		height: 110upx;
		position: fixed;
		bottom: 5upx;
		left: 0;
		width: 100%;
		background-color: #f2f2f2;
		color: #000;

	}

	.footer_item {
		float: left;
		width: 33.3%;
		text-align: center;
		font-size: 28upx;
		height: 120upx;
		padding: 10rpx 0;
	}

	.footer_item image {
		width: 60upx;
		height: 60upx;
	}

	.footer_item.big_item {
		position: relative;
		top: -40upx;
	}

	.footer_item.big_item image {
		width: 100upx;
		height: 100upx;
	}
</style>
