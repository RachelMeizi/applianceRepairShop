<template>
	<view>
		<form @submit="formSumbit" class="form">
			<view class="userInfo-view">
				<view class="">
					<text class="titleTop">填写基本信息</text>
					<text class="title_desc" v-if="pages==2">添加商家信息</text>
					<text class="title_desc" v-if="pages==1">完善资料</text>
				</view>
			</view>
			<view class="userInfo-headurl" @tap="ChooseImage">
				<view class="">
					<text class="titleTop">{{pages==1?"头像":"门店照片"}}</text>
					<text class="title_desc">上传照片</text>
				</view>
				<image style="width:100upx;height: 100upx;border-radius: 50%;" :src="headurl" mode=""></image>
			</view>

			<view class="cell">
				<text>{{pages==1?"姓名":"负责人姓名"}}</text>
				<input placeholder="请填写姓名" name="name"></input>
			</view>
			<view class="cell" v-if="pages==2">
				<view class="title">负责人联系方式</view>
				<input placeholder="请填写负责人手机号" name="phone"></input>
			</view>
			<view class="cell" v-if="pages==2">
				<view class="title">公司名称</view>
				<input placeholder="请填写公司名称" name="shopName"></input>
			</view>
			<view class="cell" v-if="pages==2" @tap="onShowPop">
				<view class="title">服务类型选择</view>
				<view class="">
					{{serveType}}
				</view>
			</view>
			<view class="cell" v-if="pages==1">
				<view class="title">性别</view>
				<view class="uni-padding-wrap">
					<radio-group @change="radioChange">
						<label class="radio">
							<radio value="1" color='#31C8B8' checked="true" /><text style="margin: 20upx;">男</text> </label>
						<label class="radio">
							<radio value="2" color='#31C8B8' /><text style="margin: 15upx;">女</text> </label>
					</radio-group>
				</view>
			</view>
			<view class="cell" v-if="pages==1">
				<view class="title">出生年月</view>
				<picker mode="date" :value="birthday" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="">
						{{birthday}}
					</view>
				</picker>
			</view>
			<view class="cell" v-if="pages==2">
				<text>所在地区</text>
				<text @tap="showMulLinkageThreePicker">{{pickerRegion}}</text>
			</view>
			<view class="cell" @tap="onGetLocation" v-if="pages==2">
				<view class="title">详细地址</view>
				<text>{{address}}</text>
			</view>
			<view class="cell" v-if="pages==2">
				<view class="title">简介</view>
				<textarea style="background:#f2f2f2" value="" placeholder="描述" placeholder-style="margin:10upx" name='shopDesc' />
				</view>
			<view  class="cell" v-if="pages==1">
				<view class="title">简介</view>
				<textarea style="background:#f2f2f2" value="" placeholder="描述" placeholder-style="margin:10upx" name='desc' />
			</view>
			<view style="width: 100%;height: 200upx;"></view>
			<button class="submitBtn" form-type="submit">确定</button>				
			<w-picker mode="region" :defaultVal="[10,0,5]" @confirm="onConfirmRegion" ref="regionPicker" themeColor="#f00"></w-picker>
		</form>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components: {
			wPicker,
		},
		data() {
			return {
				showPop:false,
				birthday: '2018-09-12',
				pages: 2,
				gender: 1,
				serveType:'请选择',
				headurl: '/static/logo.png',
				address: '定位当前位置',
				pickerRegion: '请选择位置',
			};
		},
		onLoad(options) {
			this.pages = options.pages
			console.log(this.pages,this.$store.state.isShop,'000')
			
		},
		onShow() {
			this.serveType='请选择'
			let serveTypeArr=uni.getStorageSync('selectlist')
			if(serveTypeArr){
				this.selectlist=serveTypeArr
				let arrName = serveTypeArr.map(item => {
					return item.name
				})
				this.serveType = arrName.join(',')
			}
		
			console.log(serveTypeArr,'0000000000000')
		},
		methods: {
			onShowPop(){
				uni.navigateTo({
					url:'/pages/shopServe/shopServe?pages=shop'
				})
				
			},
			onGetLocation() {
				console.log(444)
				uni.chooseLocation({
					success: (res) => {
						this.address = res.name
						this.lat = res.latitude
						this.lng = res.longitude
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			
			// 省市区三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.regionPicker.show()
			},
			onConfirmRegion(e) {
				// 字符串转数组
				console.log(e, '字符串转数组');
				this.pickerRegion = e.result
				// this.$refs.regionPicker.hide()


			},
			/* 选项标签切换事件 */
			onChange(data) {
				console.log(data);

				let arrName = data.map(item => {
					return item.text
				})
				this.labelId = data.map(item => {
					return item.id
				})
				this.priceDefault = arrName.join(',')
				console.log(this.priceDefault)
			},
			radioChange(e) {
				console.log(e.detail.value)
				this.gender = e.detail.value
			},

			showPicker() {
				setTimeout(() => {
					this.isShow = true;
				}, 100);
			},
			closePicker() {
				this.isShow = false;
			},

			formSumbit(e) {
				this.formValue = e.detail.value
				let json = {
					...e.detail.value,				
					gender: parseInt(this.gender),
					headurl: this.headurl,
					birthday: this.birthday,
					region: this.pickerRegion,
					address: this.address,
					lat: this.lat,
					lng: this.lng,
				    shopServeType:this.selectlist,
					shopImg:this.headurl
					
				}
				console.log(json, '555555')
				///xf/MerchantEnter//商家申请入驻
				let url=''
				if(this.pages==2){//商家
					 url='/xf/MerchantEnter'
					
				}else{
					url='/worker/upUser'
				}
			
				this.$util.post(url, JSON.stringify(json)).then(res => {//用户修改个人信息
					if (res.data.status == 200) {
						uni.navigateBack({
							delta:1
						})
					} else this.$util.fail(res.data.msg)
				})
			},

			DateChange(e) {
				this.birthday = e.detail.value
			},
			changeFirstDate(e) {
				this.firstDate = e.detail.value
			},

			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.$util.upload('/up/upload', res.tempFilePaths[0]).then(res => {
							console.log(JSON.parse(res.data), '444');
							this.headurl = JSON.parse(res.data).name
						})
					}
				});
			},



		}
	}
</script>

<style lang="scss">
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

	.content-class {
		width: 90%;
		margin: 20upx auto;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;

		.item {
			width: 30%;
			height: 60upx;
			font-size: 28upx;
			line-height: 60upx;
			border-radius: 30upx;
			margin-bottom: 20upx;
			text-align: center;
			box-sizing: border-box;
			border: 1upx solid #3f82e7;

			checkbox {
				display: none;
			}
		}

		.on {
			border: none;
			background-color: #3f82e7;
			color: #fff;
		}
	}

	.mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}


	.picek-view {
		width: 800upx;
		display: flex;
		justify-content: space-between;

	}

	.picker {
		transition: all .3s ease;
		transform: translateY(100%);

		&.pickerShow {
			transform: translateY(0);
		}

		position: fixed;
		z-index: 1000;
		right: 0;
		left: 0;
		bottom: 0;
		background: #fff;
		color:#666;

		.title {
			display: flex;
			justify-content: space-between;
			border-bottom: solid 1px #efefef;
			padding: 0upx 20upx;
			line-height: 70upx;
			font-size: 28upx;
			font-weight: bold;

			//确定按钮颜色
			.ok {
				color: blue;
			}
		}

		.list {
			padding: 0upx 10upx;
			margin: 20upx 0upx;
			display: flex;
			flex-flow: wrap;

			//列表元素样式
			view {
				background: #efefef;
				text-align: center;
				margin: 10upx;
				padding: 6upx 20upx;
				border-radius: 6upx;
				color: #777;
			}

			//列表元素选中的样式
			.active {
				background: #1CBBB4;
				color: #fff;
			}
		}

		.mess {
			padding: 0upx 20upx;
			margin-bottom: 20upx;
			text-align: left;
		}
	}

	.submitBtn {
		background: $base-color;
		color: #fff;
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;


		// width: 50%;
		// border-radius: 50upx;
		// margin-top: 100upx;
	}

	.cu-form-group .title {
		min-width: calc(4em + 15px);
		display: flex;
		// border-bottom: 1upx solid #f2f2f2;

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
	}
input{
	text-align: right;
}
	.title_desc {
		color: gray;
		margin: 5upx 0;
	}

	.titleTop {
		font-size: 35upx;
		font-weight: bold;
	}

	.userInfo-headurl {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10upx;
	}

	.userInfo-headurl>view {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-flow: column;
		margin: 10upx;
	}

	.radio {
		margin: 30upx;
	}
</style>
