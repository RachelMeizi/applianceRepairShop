<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text @click="chooseLocation" class="input">
				{{addressData.address}}
			</text>
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.detailAddress" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.isDefault==1?true:false" color="#1CBBB4" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressData: {
					name: '',
					phone: '',
					address: '在地图选择',
					detailAddress: '',
					isDefault:1,
					id:0
				},
				pages:''
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			console.log(option,'option')
			if(option.type==='edit'){
				title = '编辑收货地址'
				
				this.addressData = JSON.parse(option.data)
				console.log(this.addressData ,'8')
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e){
				if(e.detail.value) {
					this.addressData.isDefault= 1//默认地址
				}
				else {
					this.addressData.isDefault= 2;
				}
				
			},
			
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						console.log(data,'44444444')
						this.addressData.address = data.address+data.name;
						this.addressData.lat = data.latitude;
						this.addressData.lng = data.longitude;
					}
				})
			},
			
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.name){
					this.$util.fail('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					this.$util.fail('请输入正确的手机号码');
					return;
				}
				if(!data.address){
					this.$util.fail('请在地图选择所在位置');
					return;
				}
				if(!data.detailAddress){
					this.$util.fail('请填写门牌号信息');
					return;
				}
				console.log(data, this.manageType)
				// if(data.default){
				// 	data.isDefault= 1
				// }
				// else{
				// 	data.isDefault= 2
				// }
			
				let url ='/login/addressAddEdit'
	
				this.$util.post(url,JSON.stringify(data))
				.then(res=>{
					if(res.data.status==200){
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
					}else{
						this.$util.fail(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background:rgb(248, 248, 248);
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
		}
		.input{
			flex: 1;
			font-size: 30upx;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: gray;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: 30upx;
		color: #fff;
		background-color: $base_color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
