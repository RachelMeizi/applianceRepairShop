<template>
	<view>
		<view class='appoint-time'>下单时间：{{orderTime}}</view>

		<view class='out'>
			<view v-for="item in goods" wx:key="" class='goods'>
				<view class='goods-cont'>
					<image :src='item.goodsImg'></image>
					<view class='allinfomation'>
						<view>
							<text>{{item.goodsName}} </text>
							<text>规格:{{item.spec}} </text>
							<text style="text-decoration: line-through;color:gray;font-size: 28upx;">￥{{item.goodsPrice}}</text>
						</view>
						<view>
							<text>x{{item.goodsNum}} <text class="disRate" >{{item.disRate>=1?'无':(item.disRate)*10}}折</text></text>
							<text style="color:red;font-size: 30upx;">￥{{item.disRatePrice}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class='all-price'>
				<view>共
					<text>{{goods.length}}</text> 件商品
				</view>
				<view>运费：
					<text>￥{{freight}}</text>
				</view>
				<view>优惠：
					<text>￥{{diaRatePrice}}</text>
				</view>
				<view>实付：
					<text>￥{{allPrice}}</text>
				</view>
			</view>
		</view>

		<view class='detail'>
			<view class='detail-cont'>
				<view>订单号：</view>
				<view>{{orderNum}}</view>
			</view>		
			<view class='detail-cont'>
				<view>收货人：</view>
				<view>{{userName}}</view>
			</view>
			<view class='detail-cont'>
				<view>手机号：</view>
				<view>{{userPhone}}</view>
			</view>
			<view class='detail-cont'>
				<view>地址：</view>
				<view>{{address}}</view>
			</view>
			<view class='detail-cont'>
				<view>订单描述：</view>
				<view>{{desc==null?'无':desc}}</view>
			</view>

		</view>

		<view class='pay' v-if='status==0' bindtap='gopay'>立即支付</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderNum: '252412323', //订单号
				orderTime: "2012-21-22 16:12:20", //生成订单时间
				userName: "Rachel", //收货用户
				userPhone: '13254156', //电话
				freight: 10, //运费
				address: "山东临沂", //收货地址=省市区+详细地址
				desc: '麻溜快送', //订单备注
				status: 0, //0=未支付  1=已支付
				allPrice: 100, //订单总计=每个商品总计之和
				diaRatePrice: 10,//折后价
				goods: [{
						goodsImg: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574158694516&di=059b5165e4352528c81d7a527bde7df8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fpeople%2F201308%2F07%2F20130807210004_uTeZM.png",
						goodsName: "蒸汽洗车",
						goodsNum: 1,
						goodsPrice: 5, 
						spec: 'xs 白色',
						disRatePrice:35,//商品折后价=商品原价*商品数量*折扣比率
						disRate: 0.5 //折扣比率
					},
					{
						goodsImg: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574158694516&di=059b5165e4352528c81d7a527bde7df8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fpeople%2F201308%2F07%2F20130807210004_uTeZM.png",
						goodsName: "羽绒服",
						spec: 'xxxL 红色',
						goodsNum: 1, //商品数量
						goodsPrice: 35, //商品原价
						disRatePrice:35,//商品折后价=商品原价*商品数量*折扣比率
						disRate: 1, //折扣比率
					},
				]
			};
		},
		onLoad(options) {
			this.status = options.status
			this.orderNum = options.orderNum
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	page {
		font-size: 30upx;
		padding-bottom: 120upx;
	}

	.disRate {
		font-size: 25upx;
		background: orange;
		padding: 2upx;
		border-radius: 10upx;
		color: #fff;
		margin-left: 10upx;
	}

	.allinfomation {
		width: 70%;
		float: right;
		margin-left: 10upx;
	}

	.allinfomation view {
		margin-top: 10upx;
		width: 500upx;
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.allinfomation>view:first-child {
		font-size: 30upx;
		color: #000;
	}

	.allinfomation view {
		font-size: 27upx;
		color: gray;
	}

	.price-firstText {
		color: rgb(163, 117, 117) !important;
		text-decoration: line-through;
	}

	.appoint-time {
		padding: 20upx;
		border-top: 30upx solid #f2f2f2;
		color: #666;
	}

	.out {
		border-top: 30upx solid #f2f2f2;
	}

	.goods {
		display: flex;
		justify-content: space-between;
		padding: 20upx;
		align-items: center;
	}

	radio {
		font-size: 25upx;
		color: gray
	}

	.goods-cont {
		display: flex;
		align-items: center
	}

	.goods image {
		/* background: #666; */
		height: 120upx;
		width: 120upx;
		margin-right: 30upx;
		border-radius: 10upx;
	}

	.goods-name view {
		line-height: 60upx
	}

	.goods-name>view:first-child {
		width: 80%;
		display: -webkit-box;
		color: #000000;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.all-price {
		border-top: 1upx solid #f2f2f2;
		display: flex;
		padding: 20upx;
		justify-content: space-between
	}

	.all-price>view:first-child {
		color: #666
	}

	.all-price text {
		color: red;
		font-size: 30upx;
		font-weight: bold;
	}

	.detail {
		border-top: 30upx solid #f2f2f2;

	}

	.detail-cont {
		display: flex;
		padding: 20upx;
		border-bottom: 1upx solid #f2f2f2;
		color: #666
	}

	.detail-cont>view:first-child {
		width: 150upx;
	}

	.pay {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		line-height: 100upx;
		background: $base-color;
		color: #fff;
		text-align: center;
		font-size: 40upx;
	}

	.black {
		width: 500upx;
		font-size: 25upx;
		color: gray;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.singleprice {
		margin-left: 200upx;
	}
</style>
