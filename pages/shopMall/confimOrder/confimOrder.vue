<template>
	<view>
		<!-- 地址 -->
		<defaul-address :addressData='addressData'></defaul-address>

		<view class="goods-section">

			<!-- 商品列表 -->
			<view class="g-item" v-for="item in info.goods">
				<image :src="item.img[0].url"></image>
				<view class="right">
					<text class="title clamp">{{item.title}}</text>
					<text class="spec">{{item.difference.join(',')}}</text>
					<view class="price-box">
						<text class="price">￥{{item.spec[0].price / 100}}</text>
						<text class="number">x {{item.spec[0].num}}</text>
						<text class="number diaRate" v-if="item.discount"> {{item.discount * 10}}折</text>
					</view>
				</view>
			</view>

		</view>

		<!-- 优惠明细 -->
		<view class="yt-list">

			<view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					减
				</view>
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{info.goodsTotalPrice / 100}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-{{info.disRatePrice / 100}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">扣除积分</text>
				<text class="cell-tip red">-{{info.integral}}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip red">+{{info.freight}}</text>
			</view> -->
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" v-model="orderDesc" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{info.totalprice / 100}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
	</view>
</template>

<script>
	import defaulAddress from '@/components/address/defaulAddress.vue'
	export default {
		components: {
			defaulAddress
		},
		data() {
			return {
				maskState: 0, //优惠券面板显示状态
				orderDesc: '', //备注
				payType: 1, //1微信 2支付宝
				info: {
					goodsTotalPrice: 300, //商品总价
					disRatePrice: 30, //优惠金额
					freight: 10, //运费
					integral:0,
					totalprice: 280, //商品合计=商品总价-优惠金额+运费
					goods: [{
							img: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3086935266,3185877599&fm=26&gp=0.jpg', //商品照片
							name: '古黛妃 短袖t恤女夏装2019新款', //商品名称
							spec: 'xs 白色', //规格
							price: 500, //商品价格
							num: 1, //数量
							disRate: 0.4, //折扣比率
						},
						{
							img: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3086935266,3185877599&fm=26&gp=0.jpg', //商品照片
							name: '古黛妃 短袖t恤女夏装2019新款', //商品名称
							spec: 'xs 白色', //规格
							price: 500, //商品价格
							num: 1, //数量
							disRate: 1, //折扣比率
						},

					],
				},
				addressData: {
					id: 0,
					// name: '许小星',
					// mobile: '13853989563', //手机号
					// address: '山东省济南市历城区', //定位地址
					// detailAddress: '金九大道B区', //详细地址			
					// isDefault: 1, //是否是默认地址
				}
			}
		},
		onLoad(option) {
			//商品数据
			//let data = JSON.parse(option.data);
			//console.log(data);
			// 获取默认地址
			this.$util.get('/login/addressDefault').then(res => { //获取默认地址
				this.addressData = res.data.data
			})
			this.info.goods = uni.getStorageSync('selectedGoods')

			this.sumGetTotalPrice(this.info.goods[0].spec, this.info.goods[0].discount) //计算价格
			
			this.info.integral = this.info.goods.reduce((total,cur)=>total+=cur.spec[0].num * cur.integral,0)

			uni.$on('changeAddress',(address)=>{
				this.addressData = address
			})
		},
		methods: {
			
			sumGetTotalPrice(spec, discount) {
				let sum = 0,
					sumDis = 0;
				for (let i = 0; i < spec.length; i++) {
					sumDis += spec[i].num * spec[i].price; //折后价之和
					sum += spec[i].num * (spec[i].price / (discount || 1)); //原价总和
				}                                                                                                                                                 
				this.info.goodsTotalPrice = sum.toFixed(2) //原价之和
				this.info.disRatePrice = (sum - sumDis).toFixed(2) //优惠金额=原价之和-折后价之和
				this.info.totalprice = parseFloat((this.info.goodsTotalPrice - this.info.disRatePrice).toFixed(2)) //商品合计=商品总价-优惠金额+运费
				console.log(sumDis, sum, '..22')
			},
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			submit() {
				let json = {
					address: this.addressData, //地址信息
					orderDesc: this.orderDesc, //订单描述
					orderInfo: this.info.goods.map(item=>{
						const newItem = {
							_id:item._id,
							integral:item.integral,
							typeId:item.typeId,
							price:item.spec[0].price,
							num:item.spec[0].num,
							compound:item.compound,
							title:item.title,
							img:item.img,
						}
						newItem.allPrice = newItem.price * newItem.num
						return newItem
					}),
					allprice: this.info.totalprice,
					integral:this.info.integral
				}
				if(json.address.id==0){
					this.$util.fail('请填写收货地址')
					return 
				}
				//生成订单调起支付
				this.$util.post('/shop/createOrder', JSON.stringify(json)).then(async res => {
					if (res.data.status == 200) {
						//调起支付
						const orderNum = res.data.orderNum
						const {
							data: payData
						} = await
						this.$util.get('/pay/PayOrder?orderNum=' + orderNum)
						if (payData.status == 500) return this.$util.fail(payData.msg)
						await uni.requestPayment(payData)
					}
				})
			},
			stopPrevent() {}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
				display: flex;
				flex-direction: column;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}

				.diaRate {
					background: orange;
					padding: 5upx;
					border-radius: 10upx;
					color: #fff;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}
</style>
