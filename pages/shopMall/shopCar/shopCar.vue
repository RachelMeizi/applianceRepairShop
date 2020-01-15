<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="/pages/index/index" >随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="item.img[0].url" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)"></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.title}}</text>
							<text class="attr">{{item.spec[0].compound.map(item=>item.value).join(',')}}</text>
							<text class="price">¥{{item.price / 100}}</text>
							<uni-number-box class="step" :min="1" :value="item.num"
							  :isMin="item.num===1" :index="index" @eventChange="numberChange"></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked?'/static/selected.png':'/static/select.png'" mode="aspectFit" @click="check('all')"></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total / 100}}</text>
					<text class="coupon">
						已优惠
						<text>0</text>
						元
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				// cartList: [{
				// 	      car_id: 1,//购物车列表id
				// 	        goods_id:100,//商品id
				// 	        attr_val: "春装款 L",//商品规格 = 二级规格值+'空格 '+二级规格值
				// 	        image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574139364727&di=96355913d56cf3f09683a6ee4a3781ce&imgtype=0&src=http%3A%2F%2Fimg0.pconline.com.cn%2Fpconline%2F1702%2F12%2F8823860_13_thumb.jpg",//商品照片
				// 	        number: 1, //商品数量
				// 	        price: 278 , //商品规格对应的商品价格
				// 	        stock: 15, //商品库存
				// 			disRate:0.5,//折扣比率
				// 	        title: "OVBE 长袖风衣",//商品名称
				// 			specList:[{id:1,pid:2},{id:5,pid:8}],
				// },
				// {
				// 	      id: 54,//购物车列表id
				// 	        goods_id:855,//商品id
				// 	        attr_val: "xs 白色",
				// 	        image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2758194880,3262364285&fm=26&gp=0.jpg",//商品照片
				// 	        number: 7, //商品数量
				// 	        price: 30 , //商品规格对应的商品价格
				// 	        stock: 10, //商品库存
				// 			disRate:0.5,//折扣比率
				// 	        title: "OVBE 长袖风衣",//商品名称
				// 			specList:[{id:22,pid:7},{id:15,pid:10}],
				// },],
			};
		},
		onLoad() {
			this.loadData();
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
				console.log(e.length, this.empty, 'e.length ')
			}
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			//请求数据
			async loadData() {
				// let list = await this.$api.json('cartList'); 
				const res = await this.$util.get('/shop/getGoodsCar')

				let cartList = res.data
				cartList = cartList.map(item => {
					item.checked = true;
					return item;
				});
				this.cartList = cartList;
				console.log(cartList, 'cartList')
				this.calcTotal(); //计算总价

			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				console.log(data);
				this.cartList[data.index].num = data.number;
				this.calcTotal();
			},
			//删除
			deleteCartItem(index) {
				let list = this.cartList;
				let row = list[index];
				let id = row._id;

				this.cartList.splice(index, 1);
				this.calcTotal();
				uni.hideLoading();
			},
			//清空
			clearCart() {
				uni.showModal({
					content: '清空购物车？',
					success: (e) => {
						if (e.confirm) {
							this.cartList = [];
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.price * item.num;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder() {
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item => {
					if (item.checked) {
						item.spec[0].num = item.num
						goodsData.push(item)
						console.log(goodsData, 'goodsData')
					}
				})
				if(goodsData.length==0){
					return this.$util.fail('请先勾选商品')
				}
				//调起生成订单的接口,然生成订单id,传goodsData参数
				uni.setStorageSync('selectedGoods',goodsData)
				uni.navigateTo({
					url: `/pages/shopMall/confimOrder/confimOrder`
				})
				// this.$api.msg('跳转下一页 sendData');
			}
		}
	}
</script>

<style lang='scss'>
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		justify-content: space-between;
		/* align-items: center; */
		/* position:relative; */
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
				width: 230upx;
				height: 230upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 1upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 640upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: .2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			width: 95%;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}
</style>
