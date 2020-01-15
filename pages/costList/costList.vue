<template>
	<view>
		<view class="container" v-if="pages=='cost'">
			<view class="binner">
				<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573819128173&di=2e2548e2a88e4526e2cef378a7621a8c&imgtype=0&src=http%3A%2F%2Fp0.qhimgs4.com%2Ft01d428db0bddd0d501.jpg"></image>
			</view>
			<block>
				<view class="vip-list" v-for="item in costList">
					<view class="flex-row" style="background: transparent url('http://ayipic.ayibang.com/2f0b167ece331e74e88fcec9ec4278df.png') no-repeat scroll 2% 28%;">
						<view class="text">
							<text class="title">{{item.name}}卡,支付{{item.prcie}}元，入驻平台</text>
							<text class="sub-title">方可接单</text>
						</view>
						<view class="chongzhi" @tap="onBuyVip(item)">购买</view>
					</view>
				</view>
			</block>
		</view>
		<view v-if="pages=='daka'">
			<view>
				<uni-calendar :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'" :selected='selected' @change="changeDate" />
			</view>
		</view>
	</view>
</template>

<script>
	import uniCalendar from "@/components/uni-calendar/uni-calendar"
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				price: 5,
				selected: [{
					date: '2019-11-10',
					info: '已打卡',					
				},
				{
					date: '2019-11-11',
					info: '已打卡',					
				},				
				],
				costList: [{
						id: 1,
						name: '周',
						prcie: '10'
					},
					{
						id: 1,
						name: '月',
						prcie: '100'
					}, {
						id: 1,
						name: '季度',
						prcie: '300'
					}, {
						id: 1,
						name: '年',
						prcie: '1900'
					},
				],
			};
		},
		onLoad(options) {
			this.pages = options.pages
			this.getToday = this.getToday()
			console.log(this.getToday, '00000000')
			if(this.pages =='daka'){
				uni.setNavigationBarTitle({
					title:'打卡'
				})
			}
		},
		methods: {
			getToday() {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var day = now.getDate();
				if (month < 10) {
					month = '0' + month;
				};
				if (day < 10) {
					day = '0' + day;
				}
				return year + '-' + month + '-' + day
			},

			onBuyVip(item) {

			},
			changeDate(e) {
				
				
				for (let item of this.selected) {
						if(item.date==this.getToday){
							console.log(item.date==this.getToday,'222')
							uni.showToast({
								title:'你已经打过卡了哟~',
								icon:'none'
							})
							return 
						}
				}
				
				if (this.getToday == e.fulldate) {
					uni.showModal({
						title: '打卡提示',
						content: '确定去打卡',
						success: (res) => {
							if (res.confirm) {
								//调起打卡接口
								let json={
									date:e.fulldate,
									info:'已打卡'
								}
								
								this.selected.push(json)
							}
						}
					})
				}

				console.log(e.fulldate);
			}
		}
	}
</script>

<style lang="scss">
	.container {

		background-color: #f8f8f8;

	}

	.binner {
		width: 100%;
		height: 400rpx;
		margin-bottom: 20rpx;
	}

	.binner>image {
		width: 100%;
		height: 100%;
	}

	.vip-list {
		width: 100%;
		height: 200rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
	}

	.flex-row {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding-left: 40rpx;
		padding-right: 40rpx;
		background-size: 58rpx 58rpx !important
	}

	.text {
		flex: 1;

		box-sizing: border-box;
		padding-left: 60rpx;

	}

	.text text {
		display: block;

	}

	.text .title {

		font-size: 32rpx;

		margin-bottom: 16rpx;

	}

	.text .sub-title {

		font-size: 24rpx;

		color: #999;

	}

	.chongzhi {

		border: 1px solid #00beaf;

		background-color: #fff;

		color: #00beaf;

		padding: 12rpx 20rpx;

		border-radius: 16rpx;

	}
</style>
