<template>
	<view>
		<view class="background">
			<image :src="introduceList.img" class="back-image"></image>
			<view class="content-name">{{introduceList.name}}</view>
			<view class="content-inculde">
				<!-- <view class="content-price">￥{{introduceList.price}}</view> -->
				<view class="content-people">距我:{{introduceList.distance}}km</view>
				<view class="content-people">已成交:{{introduceList.finishOrderNum}}单</view>
				<view class="content-people">好评率:{{introduceList.commentDegree}}%</view>
			</view>
		</view>
		<view class="">
			<view class="introduce">{{introduceList.name}}项目介绍</view>
			<view class="typeInduce" v-for="(item,index) in introduceList.serveOneArr">
				<view class="serveOne" >
					<text>服务类型{{index+1}}:{{item.name}}</text>
					<text class="content-price">{{item.price==0?'无订金':"￥"+ item.price}}</text>
				</view>
				<text class="serveTwo" v-for="it in item.serveTwoArr">{{it.text}}</text>
			</view>
			<view class="text">{{introduceList.shopDesc}}</view>
			<image :src="introduceList.img" class="image"></image>
		</view>
		<view class="fonter">
			<view class="">咨询:{{introduceList.phone}}</view>
			<view class="right" @click="apply">立即申请</view>
		</view>
		<!-- <uni-poupop :show="middle" type="middle" mode="fixed" @hidePopup="middle = false">
			<view class="content">
				<view class="apply">申请加盟</view>
				<view class="head-name">
					<input type="text" value="" placeholder="姓名" v-model="tissue.name">
				</view>
				<view class="head-name">
					<input type="text" value="" v-model="tissue.phone" placeholder="联系电话" />
				</view>
				<view class="head-name">
					<input type="text" value="" v-model="tissue.wxCode" placeholder="微信号" />
				</view>
				<view class="summary">
					<input type="text" value="" v-model="tissue.note" class="input-code" placeholder="短信验证码" />
					<view class="getcode">
						<view class="" @click="solicit" :class="{active:lively==true}">{{getCode}}</view>
					</view>
				</view>
				<button type="primary" class="ensure" @tap="applyBrand">立即申请</button>
			</view>
		</uni-poupop> -->
	</view>
</template>

<script>
	// import uniPoupop from "@/components/uni-popup/uni-popup.vue"
	export default {
		// components: {
		// 	uniPoupop
		// },
		data() {
			return {
				middle: false,
				tissue: {
					name: "",
					phone: "18296094627",
					wxCode: "",
					note: "",
				},
				getCode: "获取验证码",
				lively: false,
				introduceList: {
					img: 'https://dwz.cn/vE9dczRF', //商铺照片
					id: 1,
					name: "家政服务公司", //商家名称
					phone: "18296894527", //商家联系人电话
					finishOrderNum: 30, //已成交单量
					distance: '30', //单位km 离当前用户的距离
					commentDegree: '5', //单位% 好评率
					img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573639616510&di=b2b21228fcb7f765d7fa3f257cf380a4&imgtype=0&src=http%3A%2F%2Ftxt15-2.book118.com%2F2018%2F0502%2Fbook164310%2F164309617.jpg',
					serveOneArr: [ //一级服务分类
						{
							id: 1,
							name: '月嫂',
							price: 300, //订金
							serveTwoArr: [{
								id: 12,
								text: '宝宝月嫂',
							}, {
								id: 22,
								text: '成人月嫂',
							}]

						}, {
							id: 1,
							name: '家政',
							price: 0, //订金
							serveTwoArr: [{
								id: 12,
								text: '别墅清扫'
							}, {
								id: 2,
								text: '楼层清扫'
							}]
						},
					],
					shopDesc: "广州乐欣母婴用品有限公司旗下的可爱可亲成立于2008年，是集母婴加盟连锁、专属品牌研发销售、网上购物商城、综合育儿服务、产后护理、会员及大数据营销服务为一体的新型母婴服务机构，是中国高端母婴生活馆品牌。总部设立于广州地标——广州周大福金融中心，办公面积多达3000平方米，现有员工1000多名，旗下有华南、西南、华东、华北四大分公司，拥有6000多家加盟连锁店，发展会员约900万人，覆盖全国所有行政区域。可爱可亲是国家商务部首批特许经营母婴连锁品牌，先后荣获国家商务部“企业信用AAA级诚信企业”、“国家高新技术企业”、“中国品牌500强”、“广东省著名商标",
				}

			}
		},
		onLoad(options) {
			this.shopId = options.id
			// this.$util.post("/brands/detail", {
			// 	id: parseInt(options.id)
			// }).then(res => {
			// 	this.introduceList = res.data
			// })
			// this.$util.post("/member/setReaderBrandsMessage?id=" + options.id)

		},
		methods: {
			apply() {
				this.middle = true

			},
			applyBrand() {
				let json = {
					...this.tissue,
					id: parseInt(this.brandId),
				}
				this.$util.post("/applicationToJoin/set", JSON.stringify(json)).then(res => {
					this.$util.success(res.data.msg)
					this.middle = false
				})
			},
			solicit() {
				if (this.lively) return
				this.lively = true
				let time = 60
				this.getCode = time + "s"
				this.time = setInterval(() => {
						if (time == 0) {
							clearInterval(this.time)
							this.lively = false
							this.getCode = "获取验证码"
							this.time = null
						} else {
							time--
							this.getCode = time + "s"
						}
					},
					1000)

				//获取验证码
				this.$util.post("/login/getSms", {
					phone: this.tissue.phone
				}).then(res => {
					if (res.data.status == 200) {
						uni.showToast({
							title: '发送成功',
						})
					} else this.$util.fail(res.data.msg)
				})
			},
		}
	}
</script>

<style lang="less">
	
	.content-price {
		font-size: 32upx;
		color: red;
	
	}
	.background {
		padding-bottom: 10upx;
		border-bottom: 1px solid #f2f2f2;

		.back-image {
			width: 100%;
			height: 400upx;

		}

		.content-name {
			font-size: 32upx;
			font-weight: bold;
			margin-left: 20upx;
		}

		.content-inculde {
			display: flex;
			justify-content: space-between;
			margin: 20upx;


			.content-people {
				font-size: 24upx;
				color: #999999;

			}
		}
	}


	.content {
		// border: 1px solid red;
		margin: 5upx;
		padding: 5upx;
		border-radius: 20upx;

		.apply {
			text-align: center;
			font-size: 32upx;
			font-weight: bold;
			padding: 10upx;
		}

		.head-name {
			border: 1px solid #f2f2f2;
			border-radius: 50upx;
			font-size: 28upx;
			padding: 16upx;
			margin-top: 40upx;
			width: 500upx;
		}

		.summary {
			display: flex;
			align-items: center;

			border: 1px solid #f2f2f2;
			border-radius: 50upx;
			font-size: 23upx;
			padding-left: 20upx;
			margin-top: 20upx;
			padding: 5upx;

			input {
				width: 330upx;
			}
		}

		.active {
			padding: 14upx 50upx 14upx 50upx;
		}

		.getcode {
			// margin-left: 50upx;
			text-align: center;
			background: rgb(255, 87, 51);
			color: #FFFFFF;
			font-size: 20upx;
			border-top-right-radius: 50upx;
			border-bottom-right-radius: 50upx;
			padding: 19upx;

		}

		.ensure {
			margin-top: 20upx;
			background: rgb(255, 87, 51);
			padding: 0;
			width: 50%;
			border-radius: 50upx;
			font-size: 25upx;
		}
	}
	.typeInduce{
			padding: 20upx;
			.serveOne{
				font-size: 30upx;
				font-weight: bold;
				margin: 10upx;
				display: flex;
				justify-content: space-between;
				
			}
			.serveTwo{
				font-size: 25upx;
				color: gray;
				background: #f2f2f2;
				padding: 10upx;
				margin: 20upx;
				border-radius: 20upx;
			}
		}
	.introduce {
		font-size: 32upx;
		text-align: center;
		font-weight: bold;
		border-bottom: 1px solid #f2f2f2;
		padding: 20upx;
	
		
	}

	.text {
		font-size: 28upx;
		margin: 20upx;
		border-bottom: 1px solid #f2f2f2;
		padding-bottom: 10upx;
	}

	.image {
		width: 700upx;
		height: 400upx;
		margin: 0upx 20upx 0upx 20upx;

	}

	.fonter {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		padding: 0 30upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28upx;
		background: #FFFFFF;

		.right {
			// background: red;
			background: rgb(255, 87, 51);
			color: #FFFFFF;
			padding: 20upx;
			text-align: center;
		}
	}
</style>
