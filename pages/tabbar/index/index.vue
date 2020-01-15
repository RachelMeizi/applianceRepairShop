<template>
	<view class="content">
		<view class="top">
			<view class="">
				<image style="width: 40upx;height: 40upx;" src="/static/add.png" mode=""></image>
				{{area}}
			</view>
			<uni-search-bar placeholder="请输入你想搜索的服务商" @confirm="onSearch" />
			<image style="width: 40upx;height: 40upx;" src="/static/date.png" mode=""></image>
		</view>
		<swiper class="swiper-box" autoplay="true" duration="1500" interval="1500" indicator-dots="false">
			<swiper-item v-for="(item ,index) in swiperImg" :key="index">
				<view class="swiper-item">
					<image :src="item.img" mode="aspectFit"></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- <view class="example-body">
			<uni-grid :column="4" :highlight="true" :show-border="false">
				<uni-grid-item v-for="(item, index) in navList" :key="index" @tap='changeNav(item)'>
					<image :src="item.url" class="image" mode="aspectFill" />
					<text class="text">{{ item.name }}</text>
				</uni-grid-item>
				<uni-grid-item @tap='clickAllServe'>
					<image src="/static/fumou-center-template/10.png" class="image" mode="aspectFill" />
					<text class="text">全部服务</text>
				</uni-grid-item>
			</uni-grid>
		</view> -->
		<view class="shopAdd" @tap="shopAdd">
			师傅入驻
		</view>

		<flixed-add :addlistdata='addlistdata' :backgroundColor="'#F97C1A'" @addlisttap='onPublish'></flixed-add>
		<!-- <view class="serveshop">
			热门商品
		</view> -->
		<view class="guess-section">
			<view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetail(item)">
				<view class="image-wrapper">
					<image :src="item.img" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.name}}</text>
				<text class="price">￥{{item.price}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	import flixedAdd from '@/components/xiaosikaifa-flixedadd/xiaosikaifa-flixedadd'
	import uniGrid from '@/components/uni-grid/uni-grid'
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item'
	import uniSearchBar from "@/components/uni-search-bar/uni-search-bar"
	export default {
		components: {
			flixedAdd,
			uniSearchBar,
			uniGrid,
			uniGridItem,
		},
		data() {
			return {
				area: '',
				current: 0,
				mode: 'round',
				goodsList: [{
					id: 20,
					img: 'http://images.jaadee.com/images/201702/goods_img/30150_d85aed83521.jpg',
					name: '手镯',
					price: 201,
				}, {
					id: 20,
					img: 'http://images.jaadee.com/images/201702/goods_img/30150_d85aed83521.jpg',
					name: '手镯手镯手镯手镯手镯手镯',
					price: 201,
				}],
				addlistdata: [{
					title: '发布需求',
					src: '/static/publish.png'
				}],
				//轮播
				swiperImg: [],
				navList: [
					// {
					// 	id: 1,
					// 	url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
					// 	name: '新浪'
					// },
					// {
					// 	id: 2,
					// 	url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
					// 	name: '新浪'
					// },
					// {
					// 	id: 1,
					// 	url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
					// 	name: '新浪'
					// },
				]

			}
		},
		onReady() {

		},
		created() {
			this.$util.get('/login/getJson?key_name=banner_type').then(res => {
				this.swiperImg = res.data
			})
			this.getNavList()
			uni.getLocation({
				type: 'wgs84',
				success: (res) => {
					console.log(res, '555')
					this.lng = res.longitude
					this.lat = res.latitude
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					let key = '1535a8df5b40b9db79e4ebedfa93b3c2'
					// this.getDataList(this.page)
					this.$util.reverseAddress(res.longitude, res.latitude, key).then(res => {
						this.area = res.data.regeocode.addressComponent.city
						console.log(this.area, '城市');
					})
				}
			})
		},
		onShow() {
			console.log(555555);

		},

		onReachBottom() {
			let page = this.page
			page++
			this.page = page
			this.getDataList(page)
		},
		methods: {
			onPublish(index) {
				console.log(index)
				uni.navigateTo({
					url: '/pages/publish/publish'
				})
			},
			clickAllServe() {
				uni.navigateTo({
					// 服务分类
					url: "/pages/serveList/serveList"
				})
			},
			shopAdd() {
				uni.navigateTo({
					url: "/pages/loginBase/writeUserInfo/writeUserInfo?pages=2"
				})
			},
			onSearch(e) {
				console.log(e.value) //搜索的值
			},
			navToDetail(item) {
				uni.navigateTo({//商品id
					url: '/pages/shopMall/goodsDetail/goodsDetail?id=' + item.id
				})
			},
			getNavList(page) {

				this.$util.get('/xf/LabelTypeList').then(
					res => {
						this.navList = res.data
						// if (this.navList.length <= 0 && res.data.length > 0) {
						// 	this.list = res.data
						// } else if (this.list.length > 0 && res.data.length > 0) {
						// 	this.list.concat(res.data)
						// } else if (res.data.length <= 0) {
						// 	uni.showToast({
						// 		title: '没有更多数据了',
						// 		icon: 'none'
						// 	})
						// }
					})
			},
			onDetail(item) {
				uni.navigateTo({
					url: '/pages/shopDetail/shopDetail?id=' + item.id
				})
			},
			onGoPublish() {
				uni.navigateTo({
					url: '/pages/publish/publish'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@mixin justify-content($justify-content) {
		//混合
		justify-content: $justify-content;
	}

	@mixin align-items($align-items) {
		//混合
		justify-content: $align-items;
	}

	@mixin flex-flow($flex-flow) {
		//混合
		flex-flow: $flex-flow;
	}

	%flex-start-column {
		display: flex;
		@include justify-content(flex-start);
		@include align-items(center);
		@include flex-flow(column);
	}

	%flex-start-row {
		display: flex;
		@include justify-content(flex-start);
		@include align-items(center);
		@include flex-flow(row);
	}

	%space-between-row {
		display: flex;
		@include justify-content(space-between !important);
		@include align-items(center !important);
		@include flex-flow(row);
	}

	.serveshop {
		font-size: 40upx;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
		// border-bottom: 10upx solid #f2f2f2;
		padding: 10upx;
		background: #F8F8F8;

	}

	.shopAdd {
		font-size: 40upx;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10upx;
		color: #fff;
		width: 80%;
		margin: 20upx auto;
		border-radius: 50upx;
		background: linear-gradient(rgb(153, 200, 254), rgb(119, 182, 253), rgb(95, 169, 250));
	}
	.swiper-item-img{
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}
	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
			display: -webkit-box;
			font-size: 28rpx;
			color: #000000;
			line-height: 40rpx;
			word-break: break-all;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}


	.top {
		// @extend %space-between-row;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
		background: $uni-color-btn;
		color: #fff;
	}

	.swiper-item {
		width: 100%;
		height: 400rpx;
		border-radius: 16rpx;
	}

	.example-body {
		padding: 30upx;
		margin: 5upx 0;
		// border-top: 10upx solid #f2f2f2;
		// border-bottom: 10upx solid #f2f2f2;
	}

	.image {
		width: 50upx;
		height: 50upx;
	}

	.text {
		font-size: 26upx;
		margin-top: 10upx;
	}
</style>
