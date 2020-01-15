<template>
	<view>
		<view class="popup" catchtouchmove="true" :class="specClass" @touchmove.stop.prevent="moveHandle">
			<view class="mask"></view>
			<view class="layer attr-content">
				<view class="specification-wrapper">
					<scroll-view class="specification-wrapper-content" scroll-y="true">
						<view class="specification-header">
							<view class="specification-left">
								<image class="product-img" :src='goodImg'></image>
							</view>
							<view class="specification-right">
								<view class="price-content">
									<text class="sign">¥</text>
									<text class="price">{{ selectshop.price / 100 || 0 }}</text>
								</view>
								<!-- <view class="inventory">库存:{{ selectshop.stock || 0 }}</view> -->
								<view class="choose">已选:{{ selectArr.join(' ') }}</view>
							</view>
						</view>
						<view class="specification-content">
							<view class="specification-item" v-for="(item, index1) in specifications" :key="index1">
								<view class="item-title">{{ item.name }}</view>
								<view class="item-wrapper">
									<view class="item-content" @tap.stop="skuClick(item_value, index1, $event, index2  )" v-for="(item_value, index2) in item.selected"
									 :key="index2" :class="[item_value.ishow==false ? 'noactived' : '', subIndex[index1] == index2 ? 'actived' : '']">
										{{ item_value.name }}
									</view>
								</view>
							</view>
							<view class="specification-item">
								<view class="item-title">数量</view>
								<view class="item-wrapper">
									<uni-number-box class="step" @eventChange="changeNum" :min="1"></uni-number-box>
									<!-- <stepper size="small" :min="1" :max="selectshop.stock" :defaultValue="selectNum" :display="canCount" @change="changeNum"></stepper> -->
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="close" @tap="closeSf">
						<image class="close-item" src="/static/close.png"></image>
					</view>
				</view>
				<view class="btn-wrapper"><button class="sure" @click="getGoodsSpec">确定</button></view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'

	export default {

		components: {
			uniNumberBox
		},
		props: {
			specClass: {
				type: String,
				default: 'none'
			},
			specifications: { //渲染数组
				type: Array,
			},
			difference: { //比对数组
				type: Array,
			},
			goodImg: {
				type: String
			}
		},
		data() {
			return {
				// specifications: specList.specifications, //spu规格列表
				// difference: skuList.differenceList, //sku列表 {"id": "23","price": 500,"stock": 48,"difference": ["100","绿色","X","豪华"]}
				shopItemInfo: {}, //存放要和选中的值进行匹配的数据
				selectArr: [], //存放被选中的值
				subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
				selectshop: {}, //存放最后选中的商品
				selectNum: 1 //选中数量
			};
		},

		watch: {
			difference: function(val) {
				this.difference = val
				console.log(this.difference, val, 'watch')
			}
		},
		computed: {
			canCount() {
				return this.subIndex.some(item => item === -1);
			}
		},
		created() {
		    this.specifications.map(item => {
				
				this.selectArr.push('');
				this.subIndex.push(-1);
				
			});
		
			this.changeData(this.difference)
			this.checkItem(); //计算sku里面规格形成路径
			this.checkInpath(-1); //传-1是为了不跳过循环
		},
		methods: {
			getGoodsSpec() {
				let arr = []
				if(JSON.stringify(this.selectshop)!=='{}'){
					arr.push(this.selectshop)
				}
				this.$emit('ongSelectedSpecData', arr)
				console.log(arr, '最后选择的规格数组')
				this.closeSf()//关闭遮罩
			},
			changeData(differenceList) { //处理后台返回的比对数据格式

				for (let item of differenceList) {
					let nowOneCompound = []
					for (let oneCompound of item.compound) {
						nowOneCompound.push(oneCompound.value)
					}
					item.difference = nowOneCompound
					item.num = 1
				}
				console.log(differenceList, 'difference--changdata')

			},


			skuClick(value, index1, event, index2) {
				console.table("2222", value)
			
				if (value.ishow) {
					if (this.selectArr[index1] != value.name) {
						this.$set(this.selectArr, index1, value.name);
						this.$set(this.subIndex, index1, index2);
						console.table(this.selectArr[index1])
						console.table(this.subIndex[index1])
					} else {
						this.$set(this.selectArr, index1, '');
						this.$set(this.subIndex, index1, -1);
					}
					this.checkInpath(index1);
					//如果全部选完
					if (this.selectArr.every(item => item != '')) {
						this.selectshop = this.shopItemInfo[this.selectArr];
						this.selectNum = 1;
					}
				}
			},
			checkInpath(clickIndex) {
				// console.time('筛选可选路径需要的时间是');
				//循环所有属性判断哪些属性可选
				//当前选中的兄弟节点和已选中属性不需要循环

				for (let i = 0, len = this.specifications.length; i < len; i++) {
					if (i == clickIndex) {
						continue;
					}
					let len2 = this.specifications[i].selected.length;
					for (let j = 0; j < len2; j++) {
						if (this.subIndex[i] != -1 && j == this.subIndex[i]) {
							continue;
						}
						let choosed_copy = [...this.selectArr];
						this.$set(choosed_copy, i, this.specifications[i].selected[j].name);
						console.log(choosed_copy, 'choosed_copy')
						let choosed_copy2 = choosed_copy.filter(item => item !== '' && typeof item !== 'undefined');
						console.log(choosed_copy2, this.shopItemInfo, this.shopItemInfo.hasOwnProperty(choosed_copy2), 'choosed_copy2')
						if (this.shopItemInfo.hasOwnProperty(choosed_copy2)) {
							this.$set(this.specifications[i].selected[j], 'ishow', true);
						} else {
							this.$set(this.specifications[i].selected[j], 'ishow', false);
						}
						console.log(this.specifications, '11111');
					}
				}
				// console.log(this.specifications)
				// console.timeEnd('筛选可选路径需要的时间是');
			},
			checkItem() {
				// console.time('计算有多小种可选路径需要的时间是');
				//计算有多小种可选路径
				let result = this.difference.reduce(
					(arrs, items) => {
						return arrs.concat(
							items.difference.reduce(
								(arr, item) => {
									return arr.concat(
										arr.map(item2 => {
											//利用对象属性的唯一性实现二维数组去重
											if (!this.shopItemInfo.hasOwnProperty([...item2, item])) {
												this.shopItemInfo[[...item2, item]] = items;
											}
											return [...item2, item];
										})
									);
								},
								[
									[]
								]
							)
						);
					},
					[
						[]
					]
				);
				// console.timeEnd('计算有多小种可选路径需要的时间是');
			},

			//规格弹窗开关
			// toggleSpec() {
			// 	this.specClass = 'show';
			// },
			moveHandle() {
				//禁止父元素滑动
			},
			closeSf() {
				this.$emit('closeMask',this.specClass)
				// this.specClass = 'hide';
				// setTimeout(() => {
				// 	this.specClass = 'none';
				// }, 250);
			},
			changeNum(val) {
				const newNum = parseInt(val.number)
				if(newNum==0) return
				this.selectNum = newNum;
				this.selectshop.num = this.selectNum
			}

		}
	}
</script>

<style lang="scss">
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		overflow: hidden;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.3);
		}

		.layer {
			display: flex;
			width: 100%;
			// height: 1014upx;
			flex-direction: column;
			// min-height: 40vh;
			// max-height: 1014upx;
			position: fixed;
			z-index: 99;
			bottom: 0;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.specification-wrapper {
				width: 90%;
				padding: 30upx 25upx;
				box-sizing: border-box;

				.specification-wrapper-content {
					width: 100%;
					max-height: 900upx;
					min-height: 600upx;

					&::-webkit-scrollbar {
						/*隐藏滚轮*/
						display: none;
					}

					.specification-header {
						width: 100%;
						display: flex;
						flex-direction: row;
						position: relative;
						margin-bottom: 40upx;

						.specification-left {
							width: 180upx;
							height: 180upx;
							flex: 0 0 180upx;

							.product-img {
								width: 180upx;
								height: 180upx;
								background-color: #999999;
							}
						}

						.specification-right {
							flex: 1;
							padding: 0 35upx 0 28upx;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							justify-content: flex-end;
							font-weight: 500;

							.price-content {
								color: #fe3a3a;
								margin-bottom: 20upx;

								.sign {
									font-size: 28upx;
								}

								.price {
									font-size: 48upx;
								}
							}

							.inventory {
								font-size: 24upx;
								color: #999999;
								margin-bottom: 14upx;
							}

							.choose {
								font-size: 28upx;
								color: #333333;
							}
						}
					}

					.specification-content {
						font-weight: 500;

						.specification-item {
							margin-bottom: 40upx;

							&:last-child {
								margin-bottom: 0;
							}

							.item-title {
								margin-bottom: 20upx;
								font-size: 28upx;
								color: #999999;
							}

							.item-wrapper {
								display: flex;
								flex-direction: row;
								flex-flow: wrap;

								.item-content {
									display: inline-block;
									padding: 15upx 35upx;
									border-radius: 10upx;
									background-color: #ffffff;
									color: #333333;
									font-size: 28upx;
									margin-right: 20upx;
									border: 2upx solid #f4f4f4;
									box-sizing: border-box;

									&.actived {
										border: 2upx solid #fe3a3a;
										color: #fe3a3a;
									}

									&.noactived {
										background-color: #f4f4f4;
										border-color: #f4f4f4;
									}
								}
							}
						}
					}
				}

				.close {
					position: absolute;
					top: 30upx;
					right: 26upx;
					width: 50upx;
					height: 50upx;
					text-align: center;
					line-height: 50upx;

					.close-item {
						width: 50upx;
						height: 50upx;
					}
				}
			}

			.btn-wrapper {
				display: flex;
				width: 100%;
				height: 120upx;
				flex: 0 0 120upx;
				align-items: center;
				justify-content: space-between;
				padding: 0 10upx;
				box-sizing: border-box;

				.layer-btn {
					width: 335upx;
					height: 76upx;
					border-radius: 38upx;
					color: #fff;
					line-height: 76upx;
					text-align: center;
					font-weight: 500;
					font-size: 28upx;

					&.add-cart {
						background: #ffbe46;
					}

					&.buy {
						background: #fe3a3a;
						// background: $uni-color-primary;
					}
				}

				.sure {
					width: 698upx;
					height: 76upx;
					border-radius: 38upx;
					color: #fff;
					line-height: 76upx;
					text-align: center;
					font-weight: 500;
					font-size: 28upx;
					// background: #fe3a3a;
					background: $uni-color-primary;
				}
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}
</style>
