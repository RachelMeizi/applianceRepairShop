<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in goods.img" :key="index">
					<view class="image-wrapper">
						<image :src="item.url" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{goods.title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{goods.price / 100 || 0}}</text>
				<text class="m-price" v-if="goods.oldPrice">{{goods.oldPrice}}</text>
				<text class="coupon-tip" v-if="goods.discount"> {{goods.discount * 10}} 折</text>
				<view class="score" v-if="goods.integral"> <text style="font-size: 36rpx;">{{goods.integral}}</text>积分</view>
			</view>
			<view class="bot-row">
				<text>销量:{{goods.sellNum || 0}}</text>
				<!-- <text>库存:{{goods.stockNum}}</text> -->
				<text>浏览量:{{goods.visit || 0}}</text>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.value}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>

		</view>

		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{goods.comment.commentNum || 0}})</text>
				<text class="tip">好评率 {{goods.comment.commentDegree || 0}}%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box" v-if="goods.comment">
				<image class="portrait" :src="goods.comment.headurl" mode="aspectFill"></image>
				<view class="right" >
					<text class="name">{{goods.comment.name}}</text>
					<text class="con">{{goods.comment.concent}}</text>
					<view class="bot">
						<text class="attr">购买类型：{{goods.comment.buySpec}}</text>
						<text class="time">{{goods.comment.time}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<view style="padding: 20rpx;">
				<rich-text :nodes="goods.detail"></rich-text>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/shopMall/shopCar/shopCar" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy(1)">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="buy(2)">加入购物车</button>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<good-spec-sku :specClass="specClass" :specifications="goods.typeSpec[0].data" :difference="goods.spec" :goodImg='goods.img[0].url'
		 @ongSelectedSpecData='ongSelectedSpecData' @closeMask="toggleSpec" v-if="goods.spec"></good-spec-sku>

	</view>
</template>

<script>
	import goodSpecSku from '@/components/goodSpecSku.vue';
	// import share from '@/components/share';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {

		components: {
			goodSpecSku,
			uniNumberBox
		},
		data() {
			return {
				specClass: 'none',
				specSelected: [],
				favorite: true,
				shareList: [],
				goodsSelected: [],
				differenceList: [],
				payType: 1,
				goods:{},
				// goods: {
				// 	_id: 10,
				// 	shopId: 10,
				// 	typeId: 111,
				// 	title: '恒源祥2019春季长袖白色t恤 新款春装',
				// 	price: 234.1, //现价
				// 	oldPrice: 400, //原价
				// 	discount: 0.7, //折扣
				// 	sellNum: 100, //销量
				// 	visit: 455, //浏览量
				// 	img: [ //商品照片数组
				// 		{
				// 			url: 'https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg',
				// 		}, {
				// 			url: 'https://gd3.alicdn.com/imgextra/i3/TB1RPFPPFXXXXcNXpXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg',
				// 		}
				// 	],
				// 	// 商品描述
				// 	detail: `
				// 		<div style="width:95%;margin:0 auto;">
				// 		<span>好衣服,好漂亮</span>
				// 			<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
				// 			<img style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
				// 			<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
				// 			<img style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
				// 			<img style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
				// 		</div>
				// 	`,
				// 	comment: {
				// 		commentNum: 50, //商品的评价数量
				// 		commentDegree: 10, //商品的好评率,单位%
				// 		//以下商品的最新一条评论
				// 		name: '小王', //评论人
				// 		headurl: 'http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg', //评论人头像
				// 		concent: '商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢', //评论内容				
				// 		buySpec: 'XL 红色',
				// 		time: '2019-04-01 19:21' //评论时间
				// 	},
				// 	typeSpec: [{ //该分类 拥有的规格
				// 		name: "颜色",
				// 		selected: [{
				// 			name: "红色"
				// 		}, {
				// 			name: "白色"
				// 		}, {
				// 			name: "黑色"
				// 		}]
				// 	}, {
				// 		name: "尺寸",
				// 		selected: [{
				// 			name: "15"
				// 		}, {
				// 			name: "17"
				// 		}, {
				// 			name: "12"
				// 		}]
				// 	}],
				// 	spec: [{ //渲染数据
				// 			"id": "19",
				// 			"price": 200,
				// 			num: 1,
				// 			"compound": [{
				// 				"name": "颜色",
				// 				"value": "红色"
				// 			}, {
				// 				"name": "尺寸",
				// 				"value": "12"
				// 			}]

				// 		}, {
				// 			"id": "21",
				// 			"price": 300,
				// 			num: 1,
				// 			"compound": [{
				// 				"name": "颜色",
				// 				"value": "白色"
				// 			}, {
				// 				"name": "尺寸",
				// 				"value": "17"
				// 			}]
				// 		},
				// 		{
				// 			"id": "21",
				// 			"price": 300,
				// 			num: 1,
				// 			"compound": [{
				// 				"name": "颜色",
				// 				"value": "黑色"
				// 			}, {
				// 				"name": "尺寸",
				// 				"value": "17"
				// 			}]
				// 		}
				// 	]
				// },

			};
		},
		onLoad(options) {

			//接收传值,id里面放的是标题，因为测试数据并没写id 
			let id = options.id;
			console.log(options, '4444')
			if (id) {
				this.$util.get('/shop/getGoods?goodsId=' + id).then(res => {
					res.data.data[0].oldPrice = parseFloat((res.data.data[0].price) / parseInt(res.data.data[0].discount))
				this.goods = res.data.data[0]

				})
			}


		},
		methods: {

			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);

				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}

			},
			ongSelectedSpecData(arr) { //获取选中的规格数据
				if(!this.$util.checkLogin()) return
				this.goods.spec = arr
				if (arr.length > 0) {
					this.goods.compound = arr[0].compound
					this.goods.price = arr[0].price
					this.goods.num = arr[0].num
					this.goods.difference = arr[0].difference
				}else{
					this.$util.fail('请先选择商品规格')
					return 
				}
				console.log(this.goods, '5555555')
				//请求提交订单,然后跳转确认订单接口
				let arrB = []
				arrB.push(this.goods)
				if (this.payType == 1) { //立即购买
					uni.setStorageSync("selectedGoods", arrB)
					uni.navigateTo({
						url: `/pages/shopMall/confimOrder/confimOrder`
					})
				} else { //调起加入购物车接口  
					this.$util.post('/shop/setGoodsCar', JSON.stringify(this.goods)).then(res => {
						if (res.data.status == 200) {
							uni.showToast({
								title: '添加购物车成功'
							})
						}
					})
				}

			},

			buy(type) { //1=立即购买  2=加入购物车
				this.toggleSpec() //先选择商品规格
				this.payType = type
			},
			stopPrevent() {}
		},

	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.numChange {
		width: 80%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-flow: row !important;
		font-size: 28upx;
		color: gray;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
			position: relative;
			.score{
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				color: orange;
				font-size: 24rpx;
			}
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx) translateX(10rpx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	/* 	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
 */

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>
