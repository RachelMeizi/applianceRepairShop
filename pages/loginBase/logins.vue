<template>
	<view>
		<view class="logo">
			<view class="img">
				<image style="width: 200upx;height: 200upx;" mode="widthFix" src="/static/logo.png"></image>
			</view>
		</view>
		<view class="form">
			<view class="username">
				<view class="get-code" :style="{ color: getCodeBtnColor }" @click.stop="getCode()">{{ getCodeText }}</view>
				<input placeholder="请输入手机号" v-model="phoneNumber" placeholder-style="color: rgba(255,255,255,0.8);" />
			</view>
			<view class="code"><input placeholder="请输入验证码" v-model="code" placeholder-style="color: rgba(255,255,255,0.8);" /></view>
			<view class="code"><input placeholder="请输入推荐码(选填)" v-model="recommendCode" placeholder-style="color: rgba(255,255,255,0.8);" /></view>
			<view class="btn" @tap="doReg">登录</view>
			<!-- <view class="btn" @tap="cancelLogin">暂不登陆</view> -->
		</view>
		<view class="comad">
			<text>翼速网络提供技术支持</text>
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

				phoneNumber: '',
				code: '',
				recommendCode: '', //推荐码
				getCodeText: '获取验证码',
				getCodeBtnColor: '#ffffff',
				getCodeisWaiting: false,
				Code: ''
			};
		},
		onLoad(options) {
			let token = uni.getStorageSync('CODE')
			let userId = uni.getStorageSync('userId')
			this.openId = options.openId
			console.log(uni.getStorageSync('CODE'), this.$store.state, token != '' && userId != '', '555');
			if (token != '' && userId != '') { //登陸了就跳轉
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				})
			} else if (token != '') {
				uni.navigateTo({
					url: '/pages/loginBase/chooseIdentity/chooseIdentity'
				})
			}

		},
		methods: {
			...mapMutations(['login']),

			cancelLogin() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			// 获取经纬度
			getLocation() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						this.$store.state.longitude = res.longitude
						this.$store.state.latitude = res.latitude
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
					}
				});
			},
			// 获取验证码
			getCode() {
				uni.hideKeyboard();
				if (this.getCodeisWaiting) {
					return;
				}
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber) && this.phoneNumber != 'admin') {
					uni.showToast({
						title: '请填写正确手机号码',
						icon: 'none'
					});
					return false;
				}
				this.getCodeText = '发送中...';
				this.getCodeisWaiting = true;
				this.getCodeBtnColor = 'rgba(255,255,255,0.5)';
				console.log(this.phoneNumber, '手机号');
				this.$util
					.post('/login/getSms', {
						phone: this.phoneNumber
					})
					.then(res => {
						uni.showToast({
							title: '验证码已发送',
							icon: 'none'
						});
						this.setTimer();
					});
			},
			setTimer() {
				let holdTime = 60;
				this.getCodeText = '重新获取(60)';
				this.Timer = setInterval(() => {
					if (holdTime <= 0) {
						this.getCodeisWaiting = false;
						this.getCodeBtnColor = '#ffffff';
						this.getCodeText = '获取验证码';
						clearInterval(this.Timer);
						return;
					}
					this.getCodeText = '重新获取(' + holdTime + ')';
					holdTime--;
				}, 1000);
			},
			// 登录
			doReg() {

				uni.hideKeyboard();
				//模板示例部分验证规则
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber) && this.phoneNumber != 'admin') {
					uni.showToast({
						title: '请填写正确手机号码',
						icon: 'none'
					});
					return false;
				}
				//示例验证码，实际使用中应为请求服务器比对验证码是否正确。
				if (this.code == '') {
					uni.showToast({
						title: '验证码不正确',
						icon: 'none'
					});
					return false;
				}
				uni.showLoading({
					title: '提交中...'
				});


				this.$util.post('/login/smsLogin', {
						phone: this.phoneNumber,
						code: this.code, //驗證碼
						recommendCode: this.recommendCode, //推荐嘛
						open_id: this.openId
					})
					.then(res => {
						// let that=this
						console.log(res, 'adminLogin');
						uni.hideLoading()
						if (res.data.status == 500) {
							uni.showToast({
								title: res.data.msg,
								duration: 2000
							});
						}
						if (res.data.status == 200) {
							console.log(res.data.token, '登陆');
							this.login(res.data.token);
							uni.setStorageSync('CODE', res.data.token)

							return this.$util.get('/xf/PersonalDetails?token=' + res.data.token)
						} else {
							uni.navigateTo({
								url: ''
							})
						}
					})
					.then(res => {
						const isShop = res.data.isShop
						this.$store.state.isShop = isShop
						this.$store.commit('setUserInfo',res.data)
						uni.navigateTo({
							url: '/pages/loginBase/chooseIdentity/chooseIdentity'
						})
						setTimeout(() => {
							let CODE = uni.getStorageSync('CODE')
							this.getLocation()
						}, 300);
					})


				/*
					* 
					
				ymPoi0vW8uUeZCn7DQd3HrTOBKMgtEAhbFJc
			
				 
					* 
					* */
			}
		}
	};
</script>

<style lang="scss">
	@import '@/static/css/style.scss';

	@font-face {
		font-family: 'HMfont-login';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVwAAsAAAAACiwAAAUhAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqHTIY+ATYCJAMUCwwABCAFhG0HRhvICBEVpCGR/UgwbhrPeq6LhESdqBKaSN/kw79n/bk3aCYZKO1yZCbTFZBZqLv71CzRPvkPQPDEzrPbAAEEdy/nHLBRL1RJVpMf+cAnKX4Do/NzekpNyAm5/zlmunw+sPy2tUt22QBHAx5Q5EUGHvAdnfOh3DK8OuQd0OlAAIiIQw5IS1uPAgEstFUEAFmxdPFcCDE92AIcgaDigV1ZkBvBQaCH6csAbnB/nnyDIiIAFBwDbePAotYFaAjIY0OMFtTMsBEQdGcFwOwFMAByALAAWQfaV4Dx4zlgIEpRFg2A/DsBFDQgB2oDc8eGgkGQeEFKUZejCznt9o/HQ5OHYmxDggUCskkBBgjUUoAAgbkUoMDYkPDCyDliuQhABkgJQK6yyhT38BIY8CBxYSRMEkkMSSATwkJdISFRxmEK1/vOnrTzXjViHzwz8aKlGEYs2iibpmp+5ratsgWGNWLbfrapGoZCpmU/tfdypWk3P2UpyrXbL9yT7r9NuzXF7fWdOOu/rp+KJfM9J10u24o94tV0yTZj7Q1k2sNGbKz3FE7fJrlO6jZTvS8u0ZhJun8isa0RspKxyKuEe2NZXZZOEuakK+yhNyZTXZI887RY8YQzlSXpoBHeCI5wo155sye1OndEW2qmqrgfekbypF8gtj1yfSpZR24fvUPxWVJPRLG2DHcxzf7n0tWR1+x5R0CV6j3Gds3IOfkK9MdFr5Un3mk4rSddo6/Jd1vEsCbatsu6R7YZUv2mevIuRf9nThs/zvYVz49u+Zw5nLqge+KujIq2hXHLc265lFGtRqxMdB4ZW7GDGxWkhRXLMpfNnaPMmLeT8S2mw3TIt3Ynv5P1TWOGGMW3c6cDCdUbnElHp9An2M7UvfFrl9Se3Mpl2OsC/OPrLn+Z/t+8OYMbyc7EULKrYRH0H8RvBcrsPjrZH/r9uO9DFSlsbnuo+4UQU/18N/9U41O/hEONfOLyA79rcYXtbq65rDorfijy9epSZFw8fEWNBN4peoL0Ll7SS4QBfh0/4Jnj+Jabk3XpkHSMdxxyuKysOZ4BfiuXySHl2UXydcnnx30kioxf/vShfUSnz/oZraNzc1Nu0tJttfyZxEhcTaOb/Ofrls75Pu/7/A/zPvxwpc/TJ34YSpffeeM2qlH/jVhDV9gcvNONnb7ZJePd7ubF++dFqYkkt2sh8dkoHjBpXMs3De/mt/y3dmCZ8424T5Y6B9aQf4r8dxu+imujrYtcywuiBztmF7Bt/yXK7wSmVlUEpshvJ/7HthUAHPDGBa7l2AIACD6yMPolEHyG+Y62A8EXmZ8Xf8adtzCtX+sirIn7vGB2RM1vgnSbRt7WD193ec251eT45BSoLPg221gAwV8Wxoo0A8eK3SZfLOSwDxLwhIWfYccX6Y7Gh90o5crFAIEAOQQKByYDAwEpSBabAxwktBLgCepBlK3eWxLDWSILAZDljYCI9AEq3GPAiPRFstgfcJz+wItsCaKRYg4pSas5NDtkASXwFzSCRmWYwsErPaK+9cxFRS7+is43IUijJJmqcUTXxRb+rrMQFChHA1TobNj3BJOjFkWITAhTHscKeqFI0DA7aOYgJkAS4F5AQyAjZQ8PDqnvP0LaTY9xBT0l9ivkeM34IBVJKiBr+Vip51SqvTstE4ioAhRTTAagIqyo1+METPC8FhKCiGkQneRiYpCqKo+GVw7nWPBn9NWuwEUJQ1jCER7cseG02dIwGppNhOPnjIu1djYDAAAA') format('woff2');
	}

	input {
		width: 60% !important;

	}


	.comad {
		display: flex;
		justify-content: center;
		font-size: 26upx;
		color: #f2f2f2;
	}

	.comad>text {
		position: fixed;
		bottom: 100upx;
	}

	.icon {
		font-family: 'HMfont-login' !important;

		font-style: normal;
		color: #ffffff;

		&.weixin {
			&:before {
				content: '\e615';
			}
		}

		&.qq {
			&:before {
				content: '\e752';
			}
		}

		&.weibo {
			&:before {
				content: '\e63d';
			}
		}

		&.xiaomi {
			&:before {
				content: '\e661';
			}
		}
	}

	.form {
		.username {
			position: relative;

			.get-code {
				position: absolute;
				height: 90upx;
				display: flex;
				align-items: center;
				justify-content: center;
				right: 0;
				padding: 0 40upx;
				// border-left: solid 1upx #fff;
				z-index: 33;

				&:after {
					content: ' ';
					width: 1upx;
					height: 50upx;
					background-color: #fff;
					position: absolute;
					z-index: 3;
					margin-right: 100%;
					left: 0;
					top: 20upx;
				}

			}
		}

		.res {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100upx;
			color: rgba($color: #ffffff, $alpha: 0.8);
		}
	}
</style>
