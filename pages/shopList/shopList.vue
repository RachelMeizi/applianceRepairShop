<template>
	<view>
		<view v-if="pages=='shopList'">
			<view class="top">
				<uni-search-bar placeholder="请输入你想搜索的服务商" @confirm="onSearch" />
			</view>
			<view class="shop-top">
				<view v-for="(item,index) in shopList" @tap='onChooseShop(item)'>
					<view class="shop-inculde">
						<image style="height: 30upx;width: 30upx;margin: 10upx;" src="/static/choose.png" v-if="item.check==true"></image>
						<image style="height: 30upx;width: 30upx;margin: 10upx;" src="/static/noChoose.png" v-if="item.check==false"></image>
						<image :src="item.img" class="shop-img"></image>
						<view class="shop-middem">
							<view class="shop-bottom">
								<view class="shop-name">{{item.name}}</view>
								<view class="shop-price">{{item.isCredit==1?'信誉商家':''}}</view>
							</view>
							<view class="sho-serve">
								<text v-for='it in item.serveType'>{{it.name}}</text>
							</view>
							<view class="shop-bottom">
								<view class="shop-phone" @tap.stop='onPhone(item)'>
									<image src="/static/address.png" mode=""></image>
									<text>{{item.distance}}km</text>
								</view>
								<view class="shop-people">已成交:{{item.finishOrderNum}}</view>
								<view class="shop-people">好评度:{{item.commentDegree}}%</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>

		<view class="" v-if="pages=='comment'">
			<view class="cu-list menu-avatar comment solids-top">
				<uni-evaluate :list-data="commentList" :rate='totalRate' />
				<!-- <view class="cu-item" v-for="(item,index) in commentList">

					<image class="cu-avatar round" :src="item.img" mode=""></image>
					<view class="content">
						<view class="text-grey">{{item.name}} 	<my-issue key="2" :score="item.startNum" :headPicShow='false' :headTitleShow='false'  :starsDisabled="true" :submitShow='false' :textareaShow='false'  /></view>
						<view class="text-gray text-content text-df">
							{{item.content}}
						</view>
						<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000" style="width: 300upx;height: 200upx;">
							<swiper-item v-for="it in item.urlList" style="width: 100%;height: 200upx;">
								<image :src="it" mode="" style="width: 100%;height: 200upx;"></image>
							</swiper-item>
						</swiper>
						<view class="margin-top-sm flex justify-between">
							<view class="text-gray text-df">{{item.date}}</view>
						</view>
					</view>
				</view> -->
			</view>
		</view>

		<view v-if="pages=='publish'">
			<!-- headPicValue='' -->
			<my-issue key="2" :score="3" headTitleValue='给商家评分' :submitShow='false' :textareaShow='false' @scoreChange='scoreChange' />
			<view class="text">
				<textarea placeholder="请输入正文内容..." maxlength="255" placeholder-style="font-size:22upx"  @input="getContent" />
				<view class="chart">
								<!-- 上传的图片 -->
							<view class="image-inculde">
							<view class="" v-for="(item,index) in photoList" :key="index">
								<image :src="item" class="image"></image>
								<image src="/static/del.png" mode=""class="delImg" @tap="delImg(index)"></image>
							</view>
							<image src="/static/zhaopian.png" v-if="photoList.length<6" class="photo"@click="photo"></image>
							</view>
						</view>			
					</view>		
				<button class="publish" @tap='publish'>发表</button>
			
		</view>
	</view>
</template>

<script>
	import myIssue from '@/components/myIssue.vue'
	import uniEvaluate from '@/components/xiujun-evaluate/uni-evaluate.vue';
	import uniSearchBar from "@/components/uni-search-bar/uni-search-bar"
	export default {
		components: {
			myIssue,
			uniEvaluate,
			uniSearchBar,

		},
		data() {
			return {
				pages: '',
				page:1,
				photoList:[],
				orderNum:'',
				totalRate:1.3,
				startNum:1,
				commentList: [],
				shopList: [{
						id: 1,
						name: "家政服务公司",
						isCredit: 1, //是否是信誉商家
						finishOrderNum: 30,
						distance: '30', //单位km
						commentDegree: '5', //单位%
						img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573639616510&di=b2b21228fcb7f765d7fa3f257cf380a4&imgtype=0&src=http%3A%2F%2Ftxt15-2.book118.com%2F2018%2F0502%2Fbook164310%2F164309617.jpg',
						serveType: [ //一级服务分类
							{
								id: 1,
								name: '月嫂',
							}, {
								id: 1,
								name: '家政',
							},
						]
					},
					{
						id: 3,
						name: "啦啦啦月嫂公司",
						isCredit: 1, //是否是信誉商家
						finishOrderNum: 50,
						distance: 10, //单位km
						commentDegree: 3.3, //单位%
						img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573639616510&di=b2b21228fcb7f765d7fa3f257cf380a4&imgtype=0&src=http%3A%2F%2Ftxt15-2.book118.com%2F2018%2F0502%2Fbook164310%2F164309617.jpg',
						serveType: [ //一级服务分类
							{
								id: 1,
								name: '月嫂',
							}, {
								id: 1,
								name: '家政',
							},
						]
					}
				],

			};
		},
		onLoad(options) {
			this.pages = options.pages
			this.orderNum=options.orderNum
			console.log(options)
		
			if(this.pages=='comment'){
				this.getCommentList(1)
				uni.setNavigationBarTitle({
					title:'我的评论'
				})
			}
			this.shopList.forEach(item => {
				item.check = false
			})
		},
		onReachBottom() {
			let page = this.page
			page++
			this.page = page
			if(this.pages=='shopList'){				
			this.getDataList(page)
			}
			else if(this.pages=='comment'){
				this.getCommentList(page)
			}
		},
		methods: {
			getCommentList(page){
					this.$util.get('/worker/evaluateList?page='+page).then(
						res => {					
							this.totalRate=res.data.totalRate
							res.data.commentList.forEach(item=>{
								item.rate=(item.startNum)/5
							})
								console.log(res.data.commentList,'111111')
							if (this.commentList.length <= 0 && res.data.commentList.length > 0) {
								this.commentList = res.data.commentList
							} else if (this.commentList.length > 0 && res.data.commentList.length > 0) {
								this.commentList=[...this.commentList,...res.data.commentList]
							} else if (res.data.length == 0) {
								uni.showToast({
									title: '没有更多数据了',
									icon: 'none'
								})
							}
						})
			},
			scoreChange(e){
				console.log(e)
				this.startNum=e
			},
			onChooseShop(item) {
				let list = this.shopList

				list.forEach(item => {
					item.check = false
				})
				item.check = true

				this.shopList = list
				uni.setStorageSync('shopInfo', item)
				console.log(item.id, this.shopList)
			},
			
			//评价
			publish(){
				
					let json={
							orderNum:this.orderNum,
								rate:	this.startNum,
								content:this.content,
								imgList:this.photoList||[],						
				}
					console.log(json,'5555555')
					this.$util.post('/xf/CommentOrder',JSON.stringify(json)).then(res => { 
						if(res.data.status==200){
							this.$util.success(res.data.msg)
							uni.navigateBack({
								delta:1
							})
						}
						else this.$util.fail(res.data.msg)
					})
				
				},
				getContent(e){
					this.content=e.detail.value
				},
				delImg(index){
				
				this.photoList.splice(index,1)
				},
				photo() {			
					let maxLength = 4
					uni.chooseImage({
						count: 6,
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['camera',"album"], //从相册选择
						success: (res) => {
							console.log(res.tempFilePaths)
							this.photoList= this.photoList.concat(res.tempFilePaths)
							console.log(this.photoList,'this.photoList');
							
							let obj;
							// 请求上传照片接口
							let promiseList = res.tempFilePaths.map((itme, i) => {
								return this.$util.upload('/up/upload', itme)
							})
							Promise.all(promiseList).then(res => {
								this.array = res.map(item => {
									let url = JSON.parse(JSON.stringify(item.data).replace(/name/g, 'src'))
									obj = JSON.parse(url).src
									return obj
								})
								this.photoList = this.array
								console.log(this.photoList, '411111111');
							
								if(this.photoList.length>=6){
									this.photoList =this.photoList.slice(0,6)
								}
							})
						}
					});
				},
			
		}
	}
</script>

<style lang="scss">
	//评论
	.text{
			border-bottom: 1px solid #f2f2f2;
			margin: 20upx;
			padding: 20upx;
			font-size:28upx;		
			min-height: 300upx;
		}
		.head-inculde{
			margin: 20upx;
			display: flex;
			align-items: center;
			font-size: 28upx;
			border-bottom: 1px solid #f2f2f2;
			.heade-image{
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
				margin: 10upx;
			}
			
		
	}
		.publish{
			font-size: 30upx;
			color: #333333;
			border-radius: 50upx;
			// padding: 10upx 20upx 10upx 20upx;
			color: #FFFFFF;
			width: 50%;
			background: #1CBBB4;
			margin-left: 380upx;
			margin:0 auto;
		}
		.chart{
			display: flex;
		}
		.photo{
			width: 150upx;
			height: 150upx;
			opacity: 0.6;
		}
		.image-inculde{
			display: flex;
			align-items: center;
			flex-flow: row wrap;		
		}
		.image{
			width: 180upx;
			height: 180upx;
	margin: 10upx 0;		
		}
		.delImg{
			width: 40upx;
					height: 40upx;
					position: relative;
					top:-165upx;
					right: 30upx;
					
		}
	
	
	
	//商家
	.top {
		// @extend %space-between-row;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20upx;
		background: #31C8B8;
		color: #fff;
	}

	.cu-item {
		border-bottom: 1upx solid #f2f2f2;
		padding: 0;
	}

	.shop-inculde {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f2f2f2;
		box-shadow: 4upx 4upx 4upx #f2f2f;
		margin: 20upx;
		padding: 10upx;

		.shop-img {
			width: 200upx;
			height: 200upx;
		}

		.shop-bottom {
			width: 110%;
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
</style>
