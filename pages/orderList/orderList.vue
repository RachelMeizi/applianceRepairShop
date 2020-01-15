<template>
	<view class="content">
		<view class="tab">
			<view class="tabList" v-for="(item,index) in tabList" :class="index==currentIndex?'active':''" @tap="onChangetab(index)">
				<text>{{item}}</text>
			</view>
		</view>

		<view class="list">
			<view class="" v-if="list.length==0">
				<empty></empty>
			</view>
			<view class="list-view" v-for="(item,index) in list" @tap="onDetail(item)">
				<!-- <view class="label">
					<text>订单号:{{item.orderNum}}</text>
				</view> -->
				<view class="top-list">
					<text>{{item.job}}</text>
					<text>{{item.price}}</text>
				</view>

				<view class="label">
					<text>{{item.workAddress}}</text>
					<text>{{item.experience}}</text>
					<text>{{item.education}}</text>
				</view>
				<view class="label-type label">
					<view style="font-weight: bold;color: gray; margin: 5upx;">服务类型：</view>
					<text>{{item.serveTypeArr.name}}</text>
				</view>
				<view class="label-type label">
					<view style="font-weight: bold;color: gray; margin: 5upx;">联系方式：</view>
					<text>{{item.phone}}</text>
				</view>
				<view class="workDesc">
					<text>{{item.workDesc}}</text>
				</view>
				<view class="label-type label">
					<view style="font-weight: bold;color: gray; margin: 5upx;">是否挂账：</view>
					<text>{{item.isSettle==2?'已挂账':'未挂账'}}</text>
				</view>
				<view class="label-type label">
					<view style="font-weight: bold;color: gray; margin: 5upx;">是否支付：</view>
					<text>{{item.isPay==2?'已支付':'未支付'}}</text>
				</view>
				<view class="label-type label">
					<view style="font-weight: bold;color: gray; margin: 5upx;">发布时间：</view>
					<text>{{item.time | formatTime}}</text>
				</view>

				<view class="userInfo" v-if="currentIndex==0 && pages=='user'">
					<view class="userInfo-left">
						<image class="headurl" :src="item.headurl"></image>
						<text class="name">{{item.name}}</text>
					</view>
					<view class="time">
						<text>{{item.time | formatTime}}</text>
					</view>
					<view class="time">
						匹配接单中...
					</view>
				</view>

				<view class="select" v-if="pages=='user'&&currentIndex==2">
					<text style="font-weight: bold;color: gray; margin: 5upx;">接单商家:</text>
					<text style="font-weight: bold;color: gray; margin: 5upx;">{{item.shopName}}</text>
					<view class="cu-avatar-group">
						<image class="cu-avatar round lg" :src="item.shopImg"></image>
					</view>
					<view class="btns">
						<view class="pay" @tap.stop='onComment(item)'>去评价</view>
						<view class="pay" @tap.stop='onApplyTicket(item)'>开发票</view>
					</view>
				</view>

				<view class="eva-section" v-if="(pages=='user'&&currentIndex==3)">
					<view class="e-header">
						<text class="tit">我的评价</text>
					</view>
					<view class="eva-box">
						<image class="portrait" :src="item.commentList.headurl" mode="aspectFill"></image>
						<view class="right">
							<view class="bot">
								<text class="name">{{item.commentList.name}}</text>
								<text class="time">{{item.commentList.time | formatTime}}</text>
							</view>
							<text class="con">{{item.commentList.content}}</text>
						</view>
					</view>
				</view>
				<view class="btns">
					<block v-if="pages=='shop'&&currentIndex==0">
						<view class="default" @tap.stop='onShopCancelOrder(item,index)'>取消订单</view>
						<view class="pay" @tap.stop='onSubmitOrder(item)'>修改订单价格</view>
						<view class="pay" @tap.stop='onFinishOrder(item,index)'>订单完成</view>

					</block>
					<block v-if="pages=='user'&&currentIndex==0">
						<view class="default" @tap.stop='onUserCancelOrder(item,index)'>取消订单</view>
					</block>
					<block v-if="pages=='user'&&currentIndex==1">
						<view class="default" @tap.stop='onApplyOrder(item)' v-if="item.isSettle==1">申请挂账</view>
						<view class="pay" @tap.stop='onPayOrder(item,index)' v-if="item.isPay==1">立即支付</view>
					</block>
				</view>

				<view style="height: 3upx;width: 100%;background: #f2f2f2;"> </view>
			</view>


			<neil-modal :show="showPop" @close="closeModal" title="标题" @cancel="bindBtn('cancel')" @confirm="bindBtn('confirm')">
				<view class="orderPrice">
					<text>请输入价格:</text>
					<input type="text" value="" v-model="orderPrice" />
				</view>
			</neil-modal>

			<view class="mask" v-if="showPopFinish==true">
				<view class="whitedrawView" style="border: 4upx dashed #fff;">
					<text>请上传完成服务内容的照片材料及工时量</text>
					<view class="text">
						<textarea placeholder="请输入正文内容..." maxlength="255" placeholder-style="font-size:22upx" cp @input="getContent" />
						<view class="chart">
						<!-- 上传的图片 -->
							<view class="image-inculde">
								 <view class="" v-for="(item,index) in photoList" :key="index">
									<image :src="item.src" class="image"></image>
									<image src="/static/del.png" mode=""class="delImg" @tap="delImg(index)"></image>
								 </view>
							  <image src="/static/zhaopian.png" v-if="photoList.length<6" class="photo"@click="photo"></image>
							</view>
						</view>			
					</view>		
					<button class="publish" @tap='onContentOrder'>确定</button>						
				</view>
			</view>
			</view>
			<view class="mask" v-if="showPopApply==true">
				<view class="whitedrawView">
					<text>请在虚线内完成电子签字</text>
					<view>
						<white-draw @drawChange='drawChange'></white-draw>
					</view>
				</view>
				<button class="applyBtn" @tap="applyBtnOrder">确定</button>
			</view>
			<view class="mask" v-if="showPopApplyTicket==true">
				
				<form @submit="formSumbitTicket" @reset="">
					<view class="cell">
						<view class="title">公司名称</view>
						<input  placeholder="请输入公司名称(必填)" name='comName'></input>
					</view>
					<view class="cell">
						<view class="title">税号</view>
						<input  placeholder="请输入税号(必填)" name='taxNum'></input>
					</view>					
					<view class="cell" @tap="onOpenAddress">
						<view class="title">单位地址</view>
						<view style="padding: 10rpx;">
							<input :value="ticketAddress" placeholder="请选择单位地址(必填)" disabled="true"></input>
						</view>
					</view>
					<view class="cell">
						<view class="title">电话号码</view>
						<input  placeholder="请输入联系电话(必填)" name='phone'></input>
					</view>
					<view class="cell">
						<view class="title">开户银行</view>
						<input  placeholder="请输入开户银行(必填)" name='bank'></input>
					</view>
					<view class="cell">
						<view class="title">银行账户</view>
						<input  placeholder="请输入银行账户(必填)" name='bankNum'></input>
					</view>
					<button class="applyBtn" form-type="submit">确定</button>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	import empty from '@/components/empty.vue'
	import whiteDraw from '@/components/whiteDraw.vue';
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: {
			whiteDraw,
			neilModal,
			empty
		},

		data() {
			return {
				tabList: [],
				showPop: false,
				showPopApply: false,
				showPopFinish: false,
				showPopApplyTicket:false,
				ticketAddress:'',
				photoList:[],
				content:'',
				currentIndex: 0,
				orderPrice: 10,
				page: 1,
				isShop: 1,
				btnText: '接单',
				pages: 'user',
				list: [
					// {
					// 	id: 1,
					// 	orderNum: '21545323', //订单号
					// 	job: '月嫂', //职位
					// 	name: '老李', //发布人
					// 	price: 200, //订单费用
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
					    // isPay:1,//是否支付						
					// 	shopName: '小强维修', //接单商家名称
					// 	shopImg: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1188908585,1997808576&fm=26&gp=0.jpg',
					// 	commentList: [{ //当前用户对这个商家评价,只要一条
					// 		name: '小王', //评论人
					// 		headurl: 'http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg', //评论人头像
					// 		concent: '商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢', //评论内容				
					// 		buySpec: 'XL 红色',
					// 		time: '2019-04-01 19:21' //评论时间
					// 	}],
					// },

				]
			}
		},
		onLoad(options) {
			this.isShop = this.$store.state.isShop
			this.pages = options.pages
			console.log(options, 'options')
			if (options.pages == 'user') {
				this.tabList = ['待接单', '已接单', '已完成', '已评价', '已挂账','已取消']
			} else {
				this.tabList = ['已接单', '已完成', '已评价', '已取消','已挂账']
			}

		},
		onShow() {
             this.list=[]
			console.log('当前位置的经度');
			uni.getLocation({
				type: 'wgs84',
				success: (res) => {
					this.lng = res.longitude
					this.lat = res.latitude
					this.getDataList(1)
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);

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
			onOpenAddress(){
			uni.chooseLocation({
			    success:  (res)=> {
			        console.log('位置名称：' + res.name);
			        console.log('详细地址：' + res.address);
			        console.log('纬度：' + res.latitude);
			        console.log('经度：' + res.longitude);
					this.ticketAddress=res.address+'-'+res.name
					this.ticketAddressInfo=res
			    }
			});
			},
			formSumbitTicket(e){
			let json={
				...e.detail.value,
				orderNum:this.OrderItem.orderNum,
				address:this.ticketAddress,
				lat:this.ticketAddressInfo.latitude,
				lng:this.ticketAddressInfo.longitude,
			}
			console.log(json,'json')
			this.$util.post('/xf/invoiceApply',JSON.stringify(json)).then(res=>{
					if(res.data.status==200){
						this.$util.success(res.data.msg)
					}
					else this.$util.fail(res.data.msg)
					this.showPopApplyTicket=false
			})
			},
			onComment(item) {
				uni.navigateTo({
					url: '/pages/shopList/shopList?pages=publish'+'&orderNum='+item.orderNum
				})
			},
			onApplyTicket(item){
				this.showPopApplyTicket=true
				this.OrderItem=item
			},

			getDataList(page) {
				// 用户:1是抢单，下单，
				// 2,用户选择商家
				// 3商家确认订单，成单
				// 4订单完成
				// 5评价完成
				// 6是取消订单
				let url = ''
				if (this.pages == 'shop') { //商家的订单列表
				
					url = '/worker/orderList?page=' + page + '&status=' + (this.currentIndex + 3)
				} else { //用户的订单			
					url = '/xf/UserOrders?page=' + page + '&status=' + (this.currentIndex + 1)
				}
				this.$util.get(url).then(
					res => {
						console.log(this.list.length, res.data.length, 'this.list.length');
						if(this.pages=='shop'){
							let commentList= {name: "", headurl: "", content: "", rate: 0, time: "0001-01-01T00:00:00Z"}
							res.data.forEach(item=>{
								item.commentList=commentList
							})
						}
						if (this.list.length == 0 && res.data.length > 0) {
							this.list = res.data
						} else if (this.list.length > 0 && res.data.length > 0) {
							this.list = [...this.list, ...res.data]
						} else if (res.data.length <= 0) {
							uni.showToast({
								title: '没有更多数据了',
								icon: 'none'
							})
						}
					})
			},
			onSubmitOrder(item) {
				this.showPop = true
				this.OrderItem = item
				console.log(item.orderNum, this.showPop, 'onSubmitOrder');
			},
			onApplyOrder(item) {
				this.showPopApply = true
				this.OrderItem = item
				console.log(item.orderNum, this.showPopApply, 'onApplyOrder');
			},
			drawChange(e) {
				this.signArr = e
			},
			onPayOrder(item,index){
				let that=this
				that.$util.get('/xf/OrderPay?orderNum='+item.orderNum).then(ress=>{
					if(ress.data.status==500) return that.$util.fail(ress.data.msg)
					that.$util.get('/pay/PayOrder?orderNum='+ress.data.orderNum).then(res=>{
						
					   that.$wxPay(res.data)					
						  this.getDataList(1) 
					})
				})
			},
			applyBtnOrder() {
				let json = {
					orderNum: this.OrderItem.orderNum,
					signArr:JSON.stringify(this.signArr)
				}
				console.log(json)
				if(json.orderNum=='' ||json.signArr==undefined){
					uni.showToast({
						title:'订单号和签名必填信息不能为空',
						duration:1500,
						icon:'none',
						success: () => {
							this.showPopApply = false
						}
					})
					return					
				}
				//调起挂账接口				
				this.$util.post('/xf/ChargeToTheRoom',json).then(res=>{
					if(res.data.status==200){
						this.$util.success(res.data.msg)	
						this.getDataList(1)
					}else{
						this.$util.fail(res.data.msg)
					}
				})				
				this.showPopApply = false
				console.log(json, '需要挂账提交的数据')
			},
			onFinishOrder(item,index) {				
				uni.showModal({
					title:'提示',
					content:'是否上传服务内容照片及工时量或者材料等描述?',
					success: (res) => {
						if(res.confirm){
							this.showPopFinish = true
							this.photoList=[]
							this.OrderItem = item	
							this.OrderItem.index=index
						}
						else{
							let json={
								orderNum:item.orderNum,
								type:2,//取消订单 2=完成订单
								content:'',
								imgList:[],				
							}
							//调起完成订单接口
							this.funFinshOrder(json,index)
						}
					}
				})
			},
			
			onContentOrder(){	
				let json={
					orderId:this.OrderItem.id,//订单id
					orderNum:this.OrderItem.orderNum,
					type:2,//取消订单 2=完成订单
					content:this.content,
					imgList:this.photoList||[]
				}
			
					this.funFinshOrder(json,this.OrderItem.index)
					this.showPopFinish = false				
				
				},
				funFinshOrder(json,index){				
					this.$util.post('/xf/ActionOrder',JSON.stringify(json)).then(res=>{
						if(res.data.status==200) {
							this.$util.success(res.data.msg)
							this.list.splice(index,1)								
						}else{
							this.$util.fail(res.data.msg)
						}
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
									obj = JSON.parse(url)
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
				onUserCancelOrder(item,index){//用户取消订单
				let that=this
					let url = '/worker/userRemoveOrder?orderNum=' + item.orderNum
					uni.showModal({
							title:'提示',
							content:'确定要取消吗?',
							success: (ress) => {
								if(ress.confirm){
									that.$util.get(url).then(res => {
										if (res.data.status == 200) {
											that.$util.success(res.data.msg)
											that.list.splice(index, 1)
										} else {
											that.$util.fail(res.data.msg)
										}
									})
								}						
								
							}
								
							})
					
				},
			onShopCancelOrder(item,index) {
				let that=this
				console.log('onCancelOrder');
				let json={
					orderNum:item.orderNum,
					type:1//取消订单 2=完成订单
				}
					uni.showModal({
							title:'提示',
							content:'确定要取消吗?',
							success: (ress) => {
								if(ress.confirm){
									that.$util.post('/xf/ActionOrder',JSON.stringify(json)).then(res=>{
										if(res.data.status==200) {
											that.$util.success(res.data.msg)
											that.list.splice(index,1)
											
										}else{
											this.$util.fail(res.data.msg)
										}
									})
								}
							}
						})
				
			},
			closeModal(e) {
				this.showPop = false
			},
			bindBtn(type) {
				if (type == 'confirm') {
					console.log(this.orderPrice, this.OrderItem.orderNum, '订单价格+订单号'); //请求修改订单价格接口
					this.$util.get('/worker/upOrderPrice?orderNum=' + this.OrderItem.orderNum + '&price=' + this.orderPrice).then(res => {
						if (res.data.status == 200) {
							this.$util.success(res.data.msg)
							this.list = []
							this.OrderItem.price = this.orderPrice
							this.getDataList(1)
						} else {
							this.$util.fail(res.data.msg)
						}
					})
				}
				this.showPop = false
			},
			onDetail(item) {
				let type = ''
				if (this.pages == 'shop') {
					type = 'shop'
				} else {
					type = 'user'
				}
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + item.id + '&pages=' + type + '&orderNum=' + item.orderNum+'&status='+this.currentIndex
				})
			},
			onChangetab(index) {
				this.currentIndex = index
				console.log(this.currentIndex, 'index');
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

.cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-flow: row;
		font-size: 30upx;
		margin: 10upx;
		padding: 10upx;
		min-height: 100upx;
		border-bottom: 1upx solid #F2F2F2;


	}
	.content {
		font-size: 30upx;
	}

	.orderPrice {
		display: flex;
		justify-content: flex;
		flex-direction: row;
		padding: 10upx;

		&>input {
			color: red;
		}

		&>text {
			font-size: 30upx;
			font-weight: bold;
		}
	}
	.text{
			border-bottom: 1px solid #f2f2f2;
			margin: 20upx;
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
			background: $base-color;
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
			margin-top: 20upx;
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
	

	.btns {
		height: 80upx;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		view {
			min-width: 120upx;
			height: 50upx;
			padding: 0 20upx;
			border-radius: 50upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-left: 20upx;
		}

		.default {
			border: solid 1upx #ccc;
			color: #666;
		}

		.pay {
			border: solid 1upx #ec652f;
			color: #ec652f;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.cu-avatar {
		width: 100upx;
		height: 100upx;
		border-radius: 50upx;
	}


	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	.mask {
		position: fixed;
		width: 100%;
		min-height: 100vh;
		left: 0;
		bottom: 0;
		z-index: 10;
		background: rgb(255, 255, 255);

		.applyBtn {
			background: $base-color;
			color: #fff;
			width: 50%;
			border-radius: 50upx;
			margin: 0 auto;
		}

		.whitedrawView {
			width: 95%;
			height: 1000upx;
			border: 4upx dashed #1CBBB4;
			margin: 0 auto;

			.whitedrawView>view {
				width: 100%;
				height: 100%;
				background: rgba(255, 255, 255, 0.8);
			}

		}
	}


	.tab {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f2f2f2;
		height: 80upx;
		width: 100%;
		// color: #fff;
		font-size: 30upx;


	}

	.select {
		display: flex;
		align-items: center;
	}

	.select>view {
		flex: 1;
		text-align: center;
		margin: 20upx 10upx;
		border-radius: 0;
		line-height: 2.2;
	}

	.cancelBtn {
		border: 1px solid #f2f2f2;
	}

	.submitBtn {
		background: #4dbac1;
		color: #fff;
	}

	.headurl {
		width: 100upx;
		height: 100upx;
		border-radius: 50upx;
	}

	.tabList>text {
		margin: 14upx;
	}

	.active {
		font-size: 35upx;
		font-weight: bold;
		color: #31C8B8;
		padding: 13upx;
		// border-radius: 20upx;
		border-bottom: 2px solid #31C8B8;
	}

	.list-view {
		width: 96%;
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
				font-size: 30upx;
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
