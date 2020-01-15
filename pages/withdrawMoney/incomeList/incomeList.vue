<template>
	<view>

		<tabbar :tabList='tabList' @onChang='onChang'></tabbar>
		<view class='listarr'>
			<view class='list' v-for="item in subjectList">
				<view class='time'>{{item.createTime| formatTime}}</view>
				<view class='subjectList'>
					<view>
						<image :src="tabIndex==0?'/static/chongzhi.png':'/static/canshed.png'"></image>
						<text>提现</text>
					</view>
					<view>{{item.price}}</view>
				</view>
			</view>
			<view v-if="subjectList==''" class='tips'>
				<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548659758&di=184d6b6b2f7a3639441ce5dd89164e7d&imgtype=jpg&er=1&src=http%3A%2F%2Fzzpic1.58cdn.com.cn%2Fzhuanzh%2Fn_v1bl2lwwnaqzkfqm3gn5uq.jpg"></image>
				<text>你还木有交易记录~</text>
			</view>
		</view>
	</view>
</template>

<script>
	import tabbar from '@/components/tabbar.vue'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				tabList: ['提现中', '已到账'],
				tabIndex: 0,
				page: 1,
				subjectList: [
					// {
					// 	time: "2012-5222-5", //提现时间
					// 	price: "255", //提现金额

					// },
					// {
					// 	time: "2012-5222-5",
					// 	price: "244",
					// }
				],
			}
		},
		onLoad() {
			this.getList(1, this.tabIndex)
		},
		onReachBottom() {
			let page = this.page
			page++
			this.page = page
			this.getList(page, this.tabIndex)

		},
		methods: {
			getList(page, index) {
				let type;
				if (index == 0) {
					type = 0
				} else {
					type = 1
				}
				this.$util.get('/login/getWithdrawList?status=' + type + '&page=' + page + '&limit=' + 10).then(res => {
					if (this.subjectList.length == 0) {
						this.subjectList = res.data.data.list
					} else {
						this.subjectList = [...this.subjectList, ...res.data.data.list]
					}
				})
			},
			onChang(index) {
				this.tabIndex = index
					this.subjectList=[]
				this.getList(1,this.tabIndex)
			},
		}
	}
</script>

<style>
	.listarr {
		width: 100%;
		border-bottom: 1rpx solid #f2f2f2;
	}

	.list {
		width: 95%;
		margin: 0 auto;

	}

	.time {
		color: #ccc;
		font-size: 25rpx;
		float: right;
		/* margin-right: 10rpx; */
		margin: 5rpx;
	}

	.subjectList {
		width: 98%;
		padding: 20rpx;
		display: flex;
		border-bottom: 1rpx solid #f2f2f2;
		justify-content: space-between;
		align-items: baseline;
		font-size: 30rpx;

	}

	.subjectList image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.tips {
		width: 100%;
		/* height: 100rpx; */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: column;
		font-size: 30rpx;
		font-weight: 30rpx;
	}

	.tips image {
		width: 300rpx;
		height: 250rpx;
		margin: 12rpx;
	}
</style>
