<template>
	<view class="center">
		<!-- :style="{background:backgroundImg}" -->
		<view class="center_top">
			<view class="mask"></view>
		</view>
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view class="profily_header">
						<image :src="userInfo.headUrl" mode=""></image>
					</view>
					<view class="">
						<view class="">
							<text>{{userInfo.name}} {{userInfo.phone}}</text>
							<image class="longin" src="/static/fumou-center-template/setting.png" mode="" @tap="longin"></image>
						</view>
						<text style="font-size: 25upx;color: gray;">{{userInfo.desc}}</text>
					</view>

				</view>
				<view class="order_status">
					<view class="status" @tap="switchPage(1)">
						<text class="num">{{userInfo.waitOrderNum}}</text>
						<text>待接单</text>
					</view>
					<view class="status" @tap="switchPage(2)">
						<text class="num">{{userInfo.receiptOrderNum}}</text>
						<text>已接单</text>
					</view>
					<view class="status" @tap="switchPage(3)">
						<text class="num">{{userInfo.finishOrderNum}}</text>
						<text>已完成</text>
					</view>
					<view class="status" @tap="onShowBalance">
						<text class="num">{{balance}}</text>
						<text>余额</text>
					</view>
				</view>
			</view>
			<view class="baiban">

			</view>
			<view class="center_menu">
				<view class="menu_item" v-for="item in menus" @tap="onMenu(item)">
					<view class="">
						<image :src="item.icon" mode="aspectFill"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
				<!-- 商家信息 -->
				<view class="menu_item" v-for="item in shopMenu" @click="onMenu(item)" v-if="userInfo.isShop!=2">
					<view class="">
						<image :src="item.icon" mode="aspectFill"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import collectFormId from '@/components/collectFormId.vue'
	export default {
		components: {
			collectFormId
		},
		data() {
			return {
				balance: 0,
				userInfo: {
					name: '小王',
					phone: '1564565456',
					gender: 1, //1=男  2=女
					desc: '用户待接单数量按时到静安寺', //个人描述
					headUrl: "/static/fumou-center-template/header.jpg",
					waitOrderNum: 10, //用户待接单数量
					receiptOrderNum: 15, //骑手已接单数量
					finishOrderNum: 66, //已完成订单
					isShop: 1, //是否是商家 1=商家  2=普通用户

				},
				status: [{
						key: 1,
						name: "我的发布",
						// icon: '/static/fumou-center-template/one.png',
						url: "../myhome/myAnounce/myAnounce?pages=1"
					},
					{
						key: 4,
						name: "我的足迹",
						// icon: '/static/fumou-center-template/4.png',
						url: "../myhome/myAnounce/myAnounce?pages=3"
					}
				],
				menus: [{
						name: '提现记录',
						icon: '/static/fumou-center-template/10.png',
						key: 5,
						url: '/pages/withdrawMoney/incomeList/incomeList'
					},
					{
						name: '我的购物车',
						icon: '/static/fumou-center-template/10.png',
						key: 5,
						url: '/pages/shopMall/shopCar/shopCar'
					},
					{
						name: '商品订单',
						icon: '/static/fumou-center-template/10.png',
						key: 5,
						url: '/pages/shopMall/orderList/orderList'
					},

					{
						name: '我的地址',
						icon: '/static/fumou-center-template/10.png',
						key: 3,
						url: '/pages/address/address'
					},
					{
						name: '师傅入驻',
						icon: '/static/fumou-center-template/10.png',
						key: 4,
						url: '/pages/loginBase/writeUserInfo/writeUserInfo?pages=2'
					},
					{
						name: '修改个人信息',
						icon: '/static/fumou-center-template/10.png',
						key: 3,
						url: '/pages/loginBase/writeUserInfo/writeUserInfo?pages=1'
					},

					{
						name: '退出登陆',
						icon: '/static/fumou-center-template/10.png',
						key: 6,
						url: '/pages/loginBase/logins'
					}
				],
				shopMenu: [{
						name: '任务列表',
						icon: '/static/tabbar/master.png',
						key: 18,
						url: '/pages/tabbar/master/master',
					},
					{
						name: '师傅的订单',
						icon: '/static/fumou-center-template/10.png',
						key: 1,
						url: '/pages/orderList/orderList?pages=shop'
					},
					{
						name: '师傅评价',
						icon: '/static/fumou-center-template/10.png',
						key: 2,
						url: '/pages/shopList/shopList?pages=comment'
					},
				]
			};
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfoDetail
			}
		},
		created() {
			this.$util.get('/worker/getUserPrice').then(res => {
				this.balance = res.data.price
			})
	
		},
		methods: {
			onMenu(item) {
				console.log(this.$store.state);
				if (this.$util.checkLogin()) {
					if (item.key == 6) {
						console.log(item.key, '444')
						uni.showModal({
							title: '提示',
							content: '你要退出登录么?',
							success: (res) => {
								if (res.confirm) {
									uni.removeStorageSync('CODE')
									this.$store.state.userInfo.msg = ''
									uni.navigateTo({
										url: '/pages/loginBase/wx_login/wx_login'
									})
								}
							}
						})

					} else {
						uni.navigateTo({
							url: item.url
						})
					}
				}
			},
			switchPage() {
				if (this.$util.checkLogin()) {
					uni.navigateTo({
						url: '/pages/orderList/orderList?pages=user'
					})
				}
			},
			onShowBalance() {
				uni.navigateTo({
					url: '/pages/withdrawMoney/cash'
				})
			},
			longin() {
				uni.showModal({
					title: '提示',
					content: '你要退出登录么?',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('CODE')
							this.$store.state.userInfo.msg = ''
							uni.navigateTo({
								url: '/pages/loginBase/wx_login/wx_login'
							})
						}
					}
				})
			},
		},
		computed: {

		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.num {
		font-size: 40upx;
		font-weight: bold;
		color: #31C8B8;
	}

	.profily,
	.profily_header {
		border-radius: 8px;
	}


	.center {
		height: 100%;

		&_top {
			height: 18%;
			// background: url('../../../static/fumou-center-template/header.jpg') no-repeat 0% 50%;
			// background-size: cover;
			background: rgb(49, 200, 184);

			// background: #E6E6E6;
			.mask {
				background: $base-color;
				height: 100%;
			}
		}

		&_box_bg {
			background: #F9F9F9;
			position: relative;

			.profily {
				position: absolute;
				width: 90%;
				// border:1px solid #F7F7F7;
				margin: 0 auto;
				left: 5%;
				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}

	.base {
		display: flex;
		align-items: center;
		border-bottom: 2px solid #F6F6F6;
		padding-bottom: 35upx;
		position: relative;

		.profily_header {
			height: 120upx;
			width: 120upx;

			image {
				height: 100%;
				width: 100%;
				border-radius: 20upx;
			}
		}

		text {
			margin-left: 20px;
			font-size: 30upx;
		}

		.longin {
			position: absolute;
			height: 40upx;
			width: 40upx;
			right: 0px;
			top: 0px;
		}
	}

	.order_status {
		display: flex;
		justify-content: space-between;
		margin-top: 35upx;

		.status {
			width: 140upx;
			font-size: 24upx;
			text-align: center;
			letter-spacing: .5px;
			display: flex;
			flex-direction: column;

			.icon {
				width: 50upx;
				height: 50upx;
				margin: 0 auto;
				margin-bottom: 5px;

			}
		}
	}

	.baiban {
		background: #FEFEFE;
		height: 400upx;
	}

	.center_menu {
		width: 100%;
		display: inline-block;

		.menu_item {
			font-size: 28upx;
			letter-spacing: 1px;
			padding: 14px 5%;
			background: #FEFEFE;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			position: relative;
			border-bottom: 1px solid #EFEFEF;

			&:hover {
				background: #F6F6F6 !important;
			}

			&::after {
				content: '';
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 5%;
				background: url('../../../static/fumou-center-template/right.png') no-repeat;
				background-size: 100%;
			}

			text:nth-of-type(1) {
				margin-left: 10px;
			}

			image {
				width: 40upx;
				height: 40upx;
			}

			&:nth-of-type(4) {
				margin-top: 10px;
			}
		}
	}
</style>
