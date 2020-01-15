<template>
	<view class="content">
		<!-- <view class="tab">
			<view class="tabList" v-for="(item,index) in tabList" :class="index==currentIndex?'active':''" @tap="onChangetab(index)">
				<text>{{item}}</text>
			</view>
		</view> -->
		<view class="list">
			<view class="list-view" v-for="(item,index) in list" @tap="onDetail(item)">
				<view class="top-list">
					<text>{{item.job}}</text>
					<!-- <text>订金:{{(item.price==''||item.price=='请选择')?'0':item.price}}</text> -->
				</view>
				<view class="label">
					<text class="address" v-if="item.workAddress!=''">地址:{{item.workAddress}}</text>
					<text>经验{{item.experience}}</text>
					<text>学历{{item.education}}</text>
				</view>
				<view class="label-type label">
					<view style="font-weight: bold;color: gray; margin: 5upx;font-size: 30upx;">服务类型：</view>
					<text>{{item.serveTypeArr.name}}</text>					
				</view>
				<view class="label-type label">
					<view style="font-weight: bold;color: gray; margin: 5upx;font-size: 30upx;">联系方式：</view>
					<text>{{item.phone}}</text>
				</view>
				<view class="workDesc">
					<text>{{item.workDesc}}</text>
				</view>
				<view class="userInfo">
					<view class="userInfo-left">
						<image class="headurl" :src="item.headurl" mode=""></image>
						<text class="name">{{item.name}}</text>
					</view>
					<view class="time">
						<text>距我{{item.distance}}</text>
					</view>
					<view class="time">
						<text v-if="isShop!=1">{{item.time | formatTime }}</text>
						<!-- {{item.isMoreShop=='2'?'已有人接单':'接单'}} -->
						<button v-else @tap.stop='onGetOrder(item,index)'>接单</button>
					</view>
				</view>

				<view class="line" style="background: #f2f2f2;width: 100%;height: 10upx;"></view>
			</view>
		</view>
		<view class="" v-if="list.length==0">
			<empty></empty>
		</view>

	</view>
</template>

<script>
	import empty from '@/components/empty.vue'
	import collectFormId from '@/components/collectFormId.vue'
	export default {
		components: {
			collectFormId,
			empty
		},
		data() {
			return {
				tabList: ['附近', '全部'],
				currentIndex: 0,
				page: 1,
				isShop: 1,
				btnText: '接单',

				list: [
					// {
					// 	id: 1,
					// 	job: '月嫂', //职位
					// 	name: '老李', //发布人
					// 	price: 200, //订金
					// 	serveTypeArr: [{
					// 		id: 1,
					// 		name: '月嫂'
					// 	}], //一级服务分类				
					// 	headurl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1188908585,1997808576&fm=26&gp=0.jpg', //头像
					// 	workDesc: '照顾家里的虾皮宝宝,一日三餐的喂食', //工作内容
					// 	workAddress: '山东省临沂市', //工作地址
					// 	time: '2015-06-04', //发布时间					
					// 	education: '本科', //学历
					// 	experience: '1年', //经验
					// 	distance: 20,
					// 	isMoreShop: 1, //是否有多个商家接单 1=无人接单  2=多个商家接单 

					// },

				]
			}
		},
		created() {
			this.isShop = this.$store.state.isShop
			
			console.log(this.isShop, 'isShop');
			uni.getLocation({
				type: 'wgs84',
				success: (res) => {
					this.lng = res.longitude
					this.lat = res.latitude
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					this.getDataList(this.page)
				}
			})

		},

		onReachBottom() {
			let page = this.page
			page++
			this.page = page
			this.getDataList(page)
		},
		methods: {
			getDataList(page) {
				this.$util.get('/worker/publicLists?page=' + page + '&lat=' + this.lat + '&lng=' + this.lng, ).then(
					res => {
						console.log(this.list.length, '55');
						if (this.list.length == 0 && res.data.length > 0) {
							this.list = res.data
						} else if (this.list.length > 0 && res.data.length > 0) {
							this.list.concat(res.data)
						} else if (res.data.length == 0) {
							uni.showToast({
								title: '没有更多数据了',
								icon: 'none'
							})
						}
					})
			},
			onGetOrder(item, index) {
				// 	item.phone = '182900644512'

				// 	console.log(item,'接单')
				// 	this.list[index]=item
				this.$util.get('/worker/repairAddOrder?id=' + item.orderNum, ).then(
					res => {
						if (res.data.status == 500) {
							this.$util.fail(res.data.msg)
						}					
							this.$util.success(res.data.msg)
						this.list.splice(index,1)
						// this.getDataList(1)
					})
			},
			onDetail(item) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + item.id + '&pages=userlist'
				})
			},
			onChangetab(index) {
				this.currentIndex = index
				this.list = []
				this.getDataList(1)
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

	%space-between-row {
		display: flex;
		@include justify-content(space-between !important);
		@include align-items(center);
		@include flex-flow(row);
	}


	.tab {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background: #31C8B8;
		height: 80upx;
		width: 100%;
		color: #fff;

	}


	.headurl {
		width: 100upx;
		height: 100upx;
		border-radius: 50upx;
	}

	.tabList>text {
		margin: 20upx;
	}

	.active {
		font-size: 35upx;
		font-weight: bold;
		color: #fff;
	}

	.list-view {
		width: 95%;
		padding: 20upx;
		@extend %flex-start-column;

		.top-list {
			@extend %space-between-row;
			margin: 10upx;
		}

		.top-list>text {
			font-size: 35upx;
			font-weight: bold;
		}

		.top-list>text:last-child {
			color: #1CBBB4;
		}

		.workDesc {
			margin: 10upx;
			color: gray;
			font-size: 25upx;
		}

		.label {
			margin: 10upx 0;
		}
		.address{
			  display: -webkit-box;
			    font-size:28rpx;
			    color:#000000;
			    line-height: 40rpx;
			    word-break: break-all;
			    -webkit-box-orient: vertical;
			    -webkit-line-clamp:1;
			    overflow: hidden;
			    text-overflow:ellipsis;
		}

		.label-type {
			margin: 10upx 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		.label>text {
			font-size: 25upx;
			background: #f2f2f2;
			padding: 10upx;
			border-radius: 20upx;
			margin: 10upx;
			color: gray;
		}

		.userInfo {
			margin: 20upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.userInfo-left {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.name {
				font-weight: bold;
				margin-left: 20upx;
			}

			.time {
				color: gray;
				font-size: 26upx;
			}

			.time>button {
				background: #1CBBB4;
				border-radius: 50upx;
				color: #fff;
				font-size: 25upx;
			}
		}
	}
</style>
