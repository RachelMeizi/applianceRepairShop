<template>
	<view>
		<collect-form-id>
			<view>
				<image class="hezuoImg" src="/static/bg.png" mode="aspectFit"></image>
				<view class="bottomBtn">
					<button @tap="onUserInfo(1)">我找商家</button>
					<button @tap="onUserInfo(2)">我是商家</button>
				</view>
			</view>
		</collect-form-id>
		<!-- <view v-if="pages=='userInfo'" class="userInfo">
			<view class="">
				<text class="title">填写基本信息</text>
				<text>向boss介绍一下自己</text>
			</view>
			<view class="">
				<text class="title">头像</text>
				<text>上传求职照片被boss回复的几率翻倍</text>
			</view>
			<view class="">
				<text class="title">性别</text>

			</view>
			<view class="">
				<text class="title">姓名</text>
				<input type="text" value="" placeholder="请输入自己姓名" />
			</view>
		</view> -->
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

			};
		},
		onLoad(options) {
			this.pages = options.pages
			let userId = uni.getStorageSync('userId')
			// if(this.$store.state.token && userId ){
			// 	uni.switchTab({
			// 		url:'/pages/tabbar/index/index'
			// 	})

			// }
			// else{
			// 	uni.redirectTo({
			// 		url:'/pages/loginBase/logins'
			// 	})
			// }
			console.log(this.$store.state.token, userId, options.pages, 'options.pages');
		},
		methods: {
		
			onUserInfo(type) {
				this.$store.state.isMaster = type
				if (type == 1) { //type==1 用户 type=2 商家
					uni.navigateTo({
						url: '/pages/index/index'
					})
				} else {
					uni.navigateTo({
						url: '/pages/loginBase/writeUserInfo/writeUserInfo?pages=' + type
					})
				}

			},
		}
	}
</script>

<style lang="scss">
	

	.bottomBtn {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-flow: column;
	}

	.bottomBtn>button {
		background:  $uni-color-btn;
		color: #fff;
		margin: 20upx;
		width: 80%;
	}

	.bottomBtn>button:last-child {
		background: #FFFFFF;
		color: $uni-color-btn;
		border: 1px solid  $uni-color-btn;
	}

	.hezuoImg {
		width: 100%;
		height: 900upx;
	}

	.userInfo {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-flow: column;

	}
</style>
