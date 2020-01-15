<template>
	<view>
		<view class="title">
			请选择服务类型
		</view>
		<view class="example-body">
			<uni-grid :column="4" :highlight="true" :show-border="false" @change="changeNav">
				<uni-grid-item v-for="(item, index) in allServeList" :key="index">
					<image :src="item.url" class="image" mode="aspectFill" />
					<text :class="item.check==true?'activeText':'text'">{{ item.name }}</text>

				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="mask" @tap.stop="closePicker" catchtouchmove="true" v-if="showPop"></view>
		<view class="picker" :class="{'pickerShow':showPop}" catchtouchmove="true">
			<helang-checkbox ref="checkbox" @change="valueChange"></helang-checkbox>
		</view>
	</view>
</template>

<script>
	import helangCheckbox from "@/components/helang-checkbox/helang-checkbox.vue"
	import rightPopup from '@/components/x-popup/x-popup.vue'
	import uniGrid from '@/components/uni-grid/uni-grid'
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item'
	export default {
		components: {
			rightPopup,
			uniGrid,
			uniGridItem,
			"helang-checkbox": helangCheckbox
		},
		data() {
			return {
				showPop: false,
				selectOneIndex: 0,
				pages: '',
				selectlist: [],
				allServeList: [

					// {
					// 	id: 1,
					// 	name: '搬家',
					// 	price: 0,
					// 	url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
					// 	list: [{
					// 			text: '成人月嫂',
					// 			id: 23
					// 		},
					// 		{
					// 			text: '宝宝月嫂',
					// 			id: 28
					// 		},
					// 		{
					// 			text: '金牌幼儿教育',
					// 			id: 20
					// 		}
					// 	]
					// },
				],
			
			};
		},
		onLoad(options) {
			this.pages = options.pages
			console.log(options, '55555555')
			this.selectlist = []
			this.getDataList()
			// this.selectlist = uni.getStorageSync('selectlist')
		},
		methods: {
			getDataList() {
				this.$util.get('/login/sgetNav?types=service').then(res => {
					res.data.forEach(item=>{
						item.name=item.title,
						item.url=item.ico
						item.list.forEach(it=>{
							it.text=it.title,
							it.url=it.ico
						})
					})
					this.allServeList = res.data

				})
			},
			changeNav(e) {
				let {
					index
				} = e.detail
				console.log(this.pages, 'isshop');
				if (this.pages == 'user') { //普通用户指定单选一种服务类型 商家可多选
					this.allServeList.forEach(item => {
						item.check = false
					})
				}
				let item = this.allServeList[index]
				item.check = true
				this.selectOneIndex = index
				if (this.pages == 'user') { //处理选择的结果集 普通用户指定单选一种服务类型 商家可多选
					let firstArr = []
					firstArr.push(item)
					this.selectlist = firstArr
				} else { //商家
					this.selectlist.push(item)
				}

				console.log(this.selectlist, '4444444');

				this.showPop = true
				// this.$util.get('/xf/SecondList?id=' + item.id).then(res => {
					this.$refs.checkbox.set({
						type: 'checkbox', // 类型：单选框
						column: 3, // 分列
						list:item.list
					});

				// })
			},
			valueChange() {
				let data = this.$refs.checkbox.get(); // 组件返回的数据
				console.log(data); //二级服务分类
				this.selectlist = []
				this.allServeList[this.selectOneIndex].serveList = data
				this.allServeList.forEach(item => {
					if (item.check) {
						this.selectlist.push(item)
					}
				})
				console.log('二级服务', this.selectlist);
				uni.setStorageSync('selectlist', this.selectlist)

			},
			closePicker() {
				this.showPop = false;
			},
		}
	}
</script>

<style lang="scss">
	.title {
		font-size: 35upx;
		margin: 20upx;
		font-weight: bold;
	}

	.list-item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-flow: column;
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

	.example-body {
		padding: 30upx;
		margin: 5upx 0;
	}

	.image {
		width: 50upx;
		height: 50upx;
	}

	.activeText {
		font-size: 30upx;
		margin-top: 10upx;
		background: #1CBBB4;
		color: #fff;
		padding: 10upx;
	}

	.text {
		font-size: 30upx;
		margin-top: 10upx;
	}
</style>
