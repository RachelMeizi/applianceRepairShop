<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.isDefault==1" class="tag">默认</text>
					<text class="address">{{item.address}} {{item.detailAddress}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{item.phone}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
		</view>
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：需要先新增地址以后才能选择地址,不设置地址默认第一条地址是默认地址
		</text>		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
				addressList:[],
				// addressList: [
				// 	{
				// 		id:1,
				// 		name: '刘晓晓',
				// 		mobile: '18666666666',
				// 		address: '北京市东城区龙回1区12号楼',
				// 		detailAddress: 'B区',
				// 		isDefault:1,
				// 		lat:12.222,
				// 		lng:25.333						
				// 	}
				// ]
			}
		},
		onLoad(option){
			console.log(option.source);
			this.source = option.source;
			
		},
		onShow() {
			this.$util.get('/login/addressList').then(res=>{//获取默认地址
				this.addressList=res.data.data
			})
		},
		methods: {
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					// this.$api.prePage().addressData = item;
					
					
					uni.$emit('changeAddress',item)
					
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
				
				console.log(data, type);
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
		font-size: 30upx;
	}
	.content{
		position: relative;
		font-size: 28upx;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
		border-bottom:1upx solid #f2f2f2;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			line-height: 1;
			color:#ffb4c7 ;
			width: 100rpx;
			padding: 10rpx;

		}
		.address{
		}
	}
	.u-box{
		font-size: 28upx;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base_color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
