<template>
	<view>
		<view class="top">
			<view class="top-list">
				<text>{{info.name}}</text>
				<image class="headurl" :src="info.headurl" mode=""></image>
			</view>
			<view class="job-view">
				<view class="jobInfo">
					<text>{{info.job}}</text>
					<!-- <text>{{info.price}}</text> -->
				</view>
				<view class="label">
					<view class="label-item">
						<image class="icon" src="/static/address.png" mode=""></image>
						<text>{{info.workAddress}}</text>
					</view>
					<view class="label-item">
						<image class="icon" src="/static/edu.png" mode=""></image>
						<text>{{info.education}}</text>
					</view>
					<view class="label-item">
						<image class="icon" src="/static/expre.png" mode=""></image>
						<text>{{info.experience}}</text>
					</view>
				</view>
			</view>
			<view class="desc">
				<text>联系方式</text>
				<text>{{info.phone}}</text>
			</view>
			<view class="typeInduce" v-for="(item,index) in info.serveOneArr">
				<view class="serveOne">
					<text>服务类型{{index+1}}:{{item.name}}</text>
					<!-- <text class="content-price">{{item.price==0?'无订金':"￥"+ item.price}}</text> -->
				</view>
				<text class="serveTwo" v-if="item.serveTwoArr" v-for="it in item.serveTwoArr">{{it.name}}</text>
			</view>
			<view class="desc">
				<text>工作内容</text>
				<text>{{info.workDesc}}</text>
			</view>
			<view class="desc">
				<text>发布时间</text>
				<text>{{info.time |formatTime}}</text>
			</view>
			
			<view class="desc">
				<text>其他商家</text>
				<!-- <view v-for="(item,index) in info.shopList" @tap='onDetail(item)'> -->
					<view class="shop-inculde">
						<image :src="info.shopInfo.headurl" class="shop-img"></image>
						<!-- <view class="shop-middem"> -->
						<view class="shop-bottom">
							<view class="shop-name">{{info.shopInfo.nickname}}</view>
							<view class="shop-people">好评率:{{info.shopInfo.commentDegree}}%</view>						
						</view><!-- </view> -->
					</view>
				<!-- </view> -->
				<!-- <view class="" v-else>
					暂无商家接单 v-if='info.shopList.length>0'
				</view> -->

			</view>
			<view class="desc" v-if="(status!=0&&pages=='user')||(pages=='shop')">
				<text>商家订单描述</text>
				<text>{{info.content}}</text>
			</view>
			<view class="desc" v-if="(status!=0&&pages=='user')||(pages=='shop')">
				<text>商家完成时的照片</text>
				<view class="shopFinishImgView">
					
				<image :src="item" v-for="item in info.imgList" mode="" class="shopFinishImg" @tap="priveImg(item)"></image>
				</view>
			</view>
			<view class="desc" v-if="(status!=0&&pages=='user')||(pages=='shop')">
				<text>用户挂账电子签名</text>
				<white-draw :point='info.signArr' ref='draw'></white-draw>
			</view>
			<!-- <button class="contactBtn"  v-if="pages!='list'">接单</button> -->
		</view>

	</view>
</template>

<script>
	import whiteDraw from '@/components/whiteDraw.vue';
	export default {
		components: {
			whiteDraw
		},
		data() {
			return {
				status: 0,
				pages: '',
				info: {
					// id: 1,
					// job: '家政人员', //职位
					// name: '小王', //发布人姓名
					// headurl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573106704342&di=b4bb285b33cf1f9b266b3083d8b34290&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01172b59b9ed5da80120753462e835.jpg%401280w_1l_2o_100sh.jpg',
					// workDesc: '安装一下家里的玻璃把,小型窗户的开衫窗户,', //工作描述
					// phone: '15466635744', //联系人电话
					// workAddress: '山东省临沂市', //工作地址
					// time: '2015-06-04', //发布时间
					// price: '1100', //订金总和
					// education: '本科', //学历
					// experience: '1年', //经验
					// isMoreShop:1,//是否有多个商家接单 1=无人接单  2=多个/单个已商家接单
					// distance: 5, //距我的距离 单位km
					// shopList: [{//好评倒序排序
					// 		img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573106704342&di=b4bb285b33cf1f9b266b3083d8b34290&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01172b59b9ed5da80120753462e835.jpg%401280w_1l_2o_100sh.jpg',
					// 		name: '小强家政', //商家名称
					// 		id: 20, //商家id
					// 		commentDegree: 55,//好评率
					// 		time:'2013-12-15'
					// 	}, {
					// 		name: '帮帮家政', //商家名称
					// 		img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573106704342&di=b4bb285b33cf1f9b266b3083d8b34290&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01172b59b9ed5da80120753462e835.jpg%401280w_1l_2o_100sh.jpg',
					// 		id: 28, //商家id
					// 		commentDegree: 50,//好评率
					// 		time:'2013-12-15'
					// 	}

					// ],
					// serveOneArr: [ //一级服务分类
					// 	{
					// 		id: 1,
					// 		name: '月嫂',
					// 		price: 300, //订金
					// 		serveTwoArr: [{
					// 			id: 12,
					// 			text: '宝宝月嫂',
					// 		}, {
					// 			id: 22,
					// 			text: '成人月嫂',
					// 		}]

					// 	}, {
					// 		id: 1,
					// 		name: '家政',
					// 		price: 800, //订金
					// 		serveTwoArr: [{
					// 			id: 12,
					// 			text: '别墅清扫'
					// 		}, {
					// 			id: 2,
					// 			text: '楼层清扫'
					// 		}]
					// 	},
					// ],
				}

			};
		},
		onLoad(options) {
			this.pages = options.pages
			this.status = options.status
			console.log(options,this.status!=0, 'detail')
			let id = options.id || options.orderNum
			let url = ''
			if (this.pages == 'userlist') { //调起详情接口
				url = '/worker/publicDetail?id=' + options.id
			} else if (this.pages == 'shop') {
				url = '/worker/shopOrderDetail?id=' + options.orderNum
			} else {
				url = '/worker/userOrderDetail?id=' + options.orderNum
				// if (options.status == 1) {
				// 	url = '/worker/userOrderDetailStatus?id=' + options.id
				// } else {
				// 	url = '/worker/userOrderDetail?id=' + options.orderNum
				// }
			}
			this.$util.get(url).then(res => {
				this.info = res.data
				setTimeout(()=>{					
				this.$refs.draw.draw()
				},30)
				console.log(res.data.signArr,'5444444444')
				console.log(options.pages == 'userOrder' && options.status == '1' && this.info.isChooseShop == 2, "5444444444444");
			})
		},
		methods: {
			priveImg(item) {
				uni.previewImage({
					urls: item,
				})
			},
		}
	}
</script>

<style lang="scss">
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

	%flex-start-row {
		display: flex;
		@include justify-content(flex-start !important);
		@include align-items(center);
		@include flex-flow(row);
	}

	%center-row {
		display: flex;
		@include justify-content(center);
		@include align-items(center);
		@include flex-flow(row);
	}

	

	.shop-img {
		width: 130upx !important;
		height: 100upx !important;
		border-radius: 10upx;
	}
	.shopFinishImgView{
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-flow:row wrap;
	}
	.shopFinishImg {
		width: 150upx;
		height: 150upx;
		margin: 10upx;
	}

	.shop-inculde {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f2f2f2;
		box-shadow: 4upx 4upx 4upx #f2f2f;
		margin: 20upx !important;
		padding: 20upx !important;



		.shop-bottom {
			width: 130%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 10upx;
		}

		.sho-serve {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			&>text {
				font-size: 25upx;
				background: #f2f2f2;
				color: gray;
				padding: 8upx;
				margin: 5upx;
				border-radius: 13upx;
			}
		}

		.shop-middem {
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			// align-items: center;
			min-height: 200upx;
			margin-left: 20upx;
		}

		.shop-people {
			font-size: 24upx;
			color: #999999;
			margin-bottom: 10upx;
		}

		.shop-describe {
			font-size: 28upx;
			color: #999999;
			margin-bottom: 10upx;
		}

		.shop-price {
			color: #ff8200;
			font-size: 28upx;
		}

		.shop-phone {

			font-size: 26upx;
			color: #999999;
			margin: 10upx;
			// line-height: 30upx;

			image {
				width: 30upx;
				height: 30upx;
			}
		}

		.shop-name {
			font-size: 30upx;
			font-weight: bold;
		}
	}


	.typeInduce {
		padding: 20upx;

		.serveOne {
			font-size: 30upx;
			font-weight: bold;
			margin: 10upx;
			display: flex;
			justify-content: space-between;

		}

		.serveTwo {
			font-size: 25upx;
			color: gray;
			background: #f2f2f2;
			padding: 10upx;
			margin: 20upx;
			border-radius: 20upx;
		}
	}

	.content-price {
		font-size: 32upx;
		color: red;

	}

	.contactBtn {
		width: 100%;
		color: #fff;
		background: #31C8B8;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.desc {
		@extend %flex-start-column;
		padding: 20upx;
	}

	.desc>text:first-child {
		font-size: 35upx;
		font-weight: bold;
		margin: 10upx 0;
	}

	.desc>text:nth-child(2) {
		font-size: 26upx;
		color: gray;
	}



	.desc-type {
		margin: 10upx 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.desc-type>text {
		font-size: 25upx;
		background: #f2f2f2;
		padding: 10upx;
		border-radius: 20upx;
		margin: 10upx;
		color: gray;
	}

	.label {
		width: 100%;
		@extend %flex-start-row;
		border-bottom: 1px solid #f2f2f2;

	}

	.label-item {
		@extend %center-row;
		font-size: 25upx;
		background: #f2f2f2;
		padding: 10upx;
		border-radius: 20upx;
		margin: 10upx;
		color: gray;

	}

	.job-view {
		@extend %flex-start-column;
	}

	.jobInfo {
		padding: 20upx;
		@extend %space-between-row;
	}



	.page {
		width: 96%;
		height: 100%;
		margin: 0 auto;
	}

	.headurl {
		width: 100upx;
		height: 100upx;
		border-radius: 50upx;
	}

	.icon {
		width: 40upx;
		height: 40upx;
	}

	.tab {
		width: 100%;
		background: #007AFF;
		@extend %flex-start-column;

	}

	.top-list {
		padding: 20upx;
		@extend %space-between-row;
		border-bottom: 1upx solid #f2f2f2;
	}

	.top-list>text,
	.jobInfo>text {
		font-size: 35upx;
		font-weight: bold;
	}

	.top-list>text:last-child,
	.jobInfo>text:last-child {
		color: #1CBBB4;
	}
</style>
