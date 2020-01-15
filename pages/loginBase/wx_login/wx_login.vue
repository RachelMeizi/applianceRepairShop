<template>
	<view>
		<view wx:if="canIUse">
			<view class='header'>
				<image src='/static/logo.png'></image>
			</view>
			<view class='content'>
				<view>申请获取以下权限</view>
				<text>获得你的公开信息(昵称，头像等)</text>
			</view>
			<button class='bottom' open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfo" :disabled="disabledBtn">
				授权登录
			</button>
		</view>
		<view class="comad">
			<text>本程序由翼速网络提供</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				disabledBtn: false,
				canIUse: uni.canIUse('button.open-type.getUserInfo'),
			}
		},
		onReady() {

		},
		onLoad(e) {
			var that = this;
			// 查看是否授权
			if (e.code) {
				uni.setStorageSync('CODE', e)
			}
			console.log(this.$store.state.hasPhone, '444')
			this.$store.state.userInfo.msg = uni.getStorageSync('CODE')


			// uni.getSetting({
			// 	success: (res) => {
			// 		console.log(res.authSetting, '44')
			// 		if (res.authSetting['scope.userInfo']) {
			// 			uni.getUserInfo({
			// 				success: (res) => {
			// 					//从数据库获取用户信息
			// 					that.queryUsreInfo();
			// 					//用户已经授权过
			// 					// uni.navigateTo({
			// 					// 	url: './logins'
			// 					// })

			// 				}
			// 			});
			// 		}
			// 	}
			// })

		},
		methods: {
			...mapMutations(['login']),
			getUserInfo(e) {
				console.log(e, '点击')
				this.disabledBtn = true
				uni.showLoading({
					title: '加载中',
				})
				uni.login({
					success: (res) => {
						console.log(e.detail.userInfo, 'e.detail.userInfo');
						if (e.detail.userInfo) {
							// uni.setStorageSync('CODE', res.code)
							//用户按了允许授权按钮
							var that = this;
							let code = res.code, //token
								nickName = e.detail.userInfo.nickName,
								headUrl = e.detail.userInfo.avatarUrl

							//插入登录的用户的相关信息到数据库
							that.$util.post('/login/wxLogin?code=' + res.code).then(res => {
								if (res.data.status == 200) {
									this.login(res.data.token);
									uni.setStorageSync('CODE', res.data.token)
									this.$util.get('/xf/PersonalDetails?token=' + res.data.token)
										.then(res => {
											const isShop = res.data.isShop
											this.$store.state.isShop = isShop
											this.$store.commit('setUserInfo', res.data)
											uni.navigateTo({
												url: '/pages/index/index' //普通用户首页
											})
											uni.hideLoading()
										})
								} else if (res.data.status == 401) { //open_id
									uni.hideLoading()
									res.data.nickname = nickName
									res.data.headurl = headUrl
									uni.setStorageSync('loginData', res.data)
									uni.redirectTo({
										url: '/pages/loginBase/logins?openId=' + res.data.open_id + '&nickName=' + nickName + '&headUrl=' +
											headUrl
									})
								} else {
									uni.hideLoading()
									this.$util.fail(res.data.msg)
								}
								

							})

						} else {
							//用户按了拒绝按钮
							uni.showModal({
								title: '警告',
								content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
								showCancel: false,
								confirmText: '返回授权',
								success: (res) => {
									uni.hideLoading()
									this.disabledBtn = false
									if (res.confirm) {
										console.log('用户点击了“返回授权”')
									}
								}
							})
						}
					}
				})
			},
			queryUsreInfo() { //getUserInfo
				this.$util.get('/member/getMeMessage').then(res => {
					this.$store.state.userInfo = res.data
				})
			},
		}
	}
</script>

<style>
	.header {
		margin: 90upx 0 90upx 50upx;
		text-align: center;
		width: 650upx;
		height: 300upx;
		line-height: 450upx;
	}

	.header image {
		width: 200upx;
		height: 200upx;
	}

	.content {
		margin-left: 50upx;
		margin-bottom: 90upx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40upx;
	}

	.bottom {
		border-radius: 80upx;
		margin: 70upx 50upx;
		font-size: 35upx;
		background: #F97C1A;
		color: white;
	}

	.comad {
		display: flex;
		justify-content: center;
		font-size: 26upx;
		color: gray;
	}

	.comad>text {
		position: fixed;
		bottom: 100upx;
	}
</style>
