<template>
	<view>
		<defaul-address :addressData='addressData'></defaul-address>
		<view class="userInfo-view">
			<view>
				<text class="titleTop">发布职位</text>
				<text class="title_desc">职位名称.职位类型和工作城市发布后不可修改</text>
			</view>

			<form @submit="formSumbit" report-submit='true'>
				<view class="cell">
					<view class="title">职位名称</view>
					<input placeholder="请输入职位(必填)" name='job'></input>
				</view>
				<view class="cell" @tap="onShowServe">
					<view class="title">服务类型</view>
					<input :value="serveType" placeholder="请选择服务类型(必填)" disabled="true" style="text-align: right;"></input>
					<text class="yticon icon-you"></text>
				</view>

				<view class="picker-wrpg">
					<view class="picker-view">
						<view>
							<view>
								<text class="title">经验要求</text>
								<picker @change="changeExperience" :value="index" :range="experienceArr">
									<view class="picker">
										{{index>-1?experienceArr[index]:'不限'}}
									</view>
								</picker>
							</view>
							<view>
								<text class="title">最低学历</text>
								<picker @change="changeEducation" :value="index1" :range="educationArr">
									<view class="picker">
										{{index1>-1?educationArr[index1]:'不限'}}
									</view>
								</picker>
							</view>

						</view>
					</view>
				</view>
				<view class="cell">
					<view class="title">描述</view>
					<textarea style="background:#f2f2f2" value="" placeholder="服务内容" placeholder-style="margin:10upx" name='workDesc' />
					</view>					
					<view class="botom-btn">						
						<button class="submitBtn" form-type="submit">发布</button>
						<button class="submitBtn" form-type="reset">取消</button>
					</view>
			</form>
		</view>
		
		</view>
	</view>
</template>

<script>
	import defaulAddress from '@/components/address/defaulAddress.vue'
	export default {
		components:{
			defaulAddress
		},
		data() {
			return {
				index: 0,
				index1: 0,
				serveType:'',
				experience: '不限',
				bookPrice:0,
				price: '请选择',
				education:'不限',
				experienceArr: ['不限', '1年', '2年', '3-5年', '5年以上', '10年以上'],
				educationArr: ['不限', '本科', '大专', '硕士', '博士'],		
				address:'请选择地址',
				shopInfo:null,
				addressData: {
					id:10,
					name: '许小星',
					mobile: '13853989563',
					address: '山东省济南市历城区',
					detailAddress: '金九大道149号',
					isDefault: 1,
				}
			};
		},
		onLoad(options) {
			if(options.pages!='serveList'){				
	        uni.removeStorageSync('selectlist')
			}
			this.$util.get('/xf/AddressDefault').then(res=>{//获取默认地址
				this.addressData=res.data
			})
			console.log(this.$store.state.isMaster, '4');		
		},
		onShow() {
			this.serveType=''
			let price=0
			this.shopInfo=uni.getStorageSync('shopInfo') //当前用户选择的商家信息
			console.log(this.shopInfo,'this.shopInfo');
			let serveTypeArr=uni.getStorageSync('selectlist')
			if(serveTypeArr){
				this.selectlist=serveTypeArr
				let arrName = serveTypeArr.map(item => {
					return item.name
				})
			serveTypeArr.forEach(item => {//计算定金
					price=parseFloat(price) + parseFloat(item.price)
					this.bookPrice=price 
					if(this.bookPrice==0){
						this.bookPrice='不需要订金'
					}
					console.log(item.price,'item.price')				
					console.log(price,this.bookPrice,'price--bookPrice')
				})				
				let typeStr = arrName.join(',')
				this.serveType=typeStr
				console.log(this.serveType,this.bookPrice,'this.serveType')
			}	
					
			
		},
		methods: {
		
			onShowServe(){
				uni.navigateTo({
					url:'/pages/shopServe/shopServe?pages=user'
				})
			},
			getMapAddress(){
				uni.chooseLocation({
					success: (res) => {
						this.address = res.name
						this.lat= res.latitude
						this.lng = res.longitude
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			changeExperience(e) {
				this.index = e.detail.value
				this.experience = this.experienceArr[this.index]
				console.log(e.detail.value, '44444');
			},
			changeEducation(e) {
				this.index1 = e.detail.value
				this.education = this.educationArr[this.index1]
			},	
			
			formSumbit(e) {
				this.formValue = e.detail.value
				console.log(e)
				let json = {
					...e.detail.value,
					addressId:this.addressData.id,
					experience: this.experience,
					education: this.education,				
					lat:this.lat,
					lng:this.lng,
					workAddress:this.address,
					serveTypeArr:this.selectlist,
				}
				console.log(json, '555555')
				// uni.switchTab({
				// 	url: '/pages/tabbar/index/index'
				// })
				this.$util.post("/xf/PublishOr", JSON.stringify(json)).then(res => {
					if (res.data.status == 200) {
						uni.showToast({
							title: '发布成功',
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
					} else this.$util.fail(res.data.msg)
				})
			},
		},
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

	%space-between-column {
		display: flex;
		@include justify-content(center);
		@include align-items(center);
		@include flex-flow(column);
	}

	%space-between-row {
		display: flex;
		@include justify-content(space-between !important);
		@include align-items(center);
		@include flex-flow(row);
	}

	.form {
		min-width: calc(7em + 15px);
		height: 100%;
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
	.title {
		font-size: 30upx;
		font-weight: normal;
	}

	.picker-wrpg {
		margin-top: 20upx;
		border-bottom: 1upx solid #f2f2f2;
		border-bottom: 1upx solid #f2f2f2;
		padding: 12upx;
		margin-bottom: 10upx;
	}

	.picker-view {
		width: 80%;

		margin: 0 auto;
		@extend %space-between-column;

	}

	.picker-view>view {
		@extend %space-between-row;

	}

	.picker-view>view:last-child {
		font-size: 30upx;
		font-weight: bold;
	}


	.cu-form-group .title {
		width: calc(8em + 15px);
	}

	.bg-gray {
		color: gray;
	}

	.bg-green {
		background: rgb(255, 87, 51);
		color: #fff;
	}

	.userInfo-view,
	.userInfo-view>view {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-flow: column nowrap;
		margin: 10upx;
		padding: 10upx;
	}

	.title_desc {
		color: gray;
		margin: 5upx 0;
	}

	.titleTop {
		font-size: 40upx;
		font-weight: bold;
	}
.botom-btn{
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-flow: row;
}
	.submitBtn {
		background: $base-color;
		color: #fff;
		width: 40%;
		margin: 10upx;
		border-radius: 50upx;
		margin-top: 100upx;
	}
	
</style>
