<template>
	<view class='jdraw' :class="{'change':!onCanvas}">
		<!-- <view class='tool'>
			<image :class="brushState=='p'?'selected':''" src='/static/image/jd_pencil.png' data-state='p' @tap='switchBrush'></image>
			<image :class="brushState=='c'?'selected':''" src='/static/image/jd_eraser.png' data-state='c' @tap='switchBrush'></image>
			<image src='/static/image/jd_clear.png' @tap='drawClear'></image>
			<image src='/static/image/jd_back.png' @tap='drawBack'></image>
		</view>
		<view>
			<scroll-view scroll-x="true" scroll-left="0" class='tinct-list'>
				<view v-for='(item,index) in tinctList' :key='index' :style="'background-color:'+item" @tap='tinColorChange(index)'
				 class="tinct-item" :class="tinctCurr==index?'tinct-curr':''"></view>
			</scroll-view>
		</view>
		<view class="page-section page-section-gap">
			<view class="body-view">
				<slider :value="tinctSize" min="1" max="10" @change="tinSizechange" show-value />
			</view>
		</view> -->
		<canvas class="canvas" canvas-id="palette" @touchstart='touchstart' @touchmove='touchMove' @touchend='touchEnd'
		 :disable-scroll='true'></canvas>
	</view>
</template>
<script>
	var context = null
	export default {
		props: {
			// 隐藏画板 适应小程序
			onCanvas: {
				type: Boolean,
				default: true
			},
			point: {
				type: Array,
				default () {
					return [{
						point: [{
							x: 134,
							y: 24
						}, {
							x: 134,
							y: 26
						}],
						tinct: '#000000',
						lineWidth: '5'
					}]
				}
			}
		},
		data() {
			return {
				points: [],
				brushState: 'p', //'p'-画笔；'c'-橡皮檫
				tinctList: ['#000000', '#362c23', '#715e4f', '#643d5c', '#677e3a', '#953c38', '#314d59', '#a7b47f', '#c58d8e',
					'#658e9f', '#229daf', '#7d790e', '#ebd669', '#2a1706', '#623919', '#ba8559', '#a33a65', '#fcac7b', '#fbe8c5',
					'#414141', '#828282', '#aaaaaa', '#dbdbdb', '#f7f7f7', '#ffcc59', '#cbcc57', '#e2513c', '#69b4d3', '#c72267',
					'#8dae21', '#1a386a', '#1f76bb', '#2fb7f5', '#a070bc', '#fb9e3f', '#ffd778'
				],
				tinctCurr: 0, //当前画笔颜色
				tinctSize: 5, //画笔尺寸
			}
		},
		watch: {
			point(value) {
				console.log(value,'444444444')
				this.points = value
			}
		},
		mounted() {
			context = uni.createCanvasContext('palette', this);
		},
		methods: {
			// 触摸开始
			touchstart() {
				let tinct, lineWidth;
				if (this.brushState == 'p') {
					tinct = this.tinctList[this.tinctCurr];
					lineWidth = this.tinctSize;
				} else {
					tinct = "#ffffff";
					lineWidth = 20;
					context.setLineCap('round'); //设置线条端点的样式
					context.setLineJoin('round'); //设置两线相交处的样式
				}
				console.log(tinct, lineWidth, 'tinct3');
				context.setStrokeStyle(tinct); //设置描边颜色
				context.setLineWidth(lineWidth); //设置线条宽度
				// context.beginPath();
				this.points.push({
					point: [],
					tinct: tinct,
					lineWidth: lineWidth
				});
				console.log('开始绘画', JSON.stringify(this.points));
			},
			// 触摸中
			touchMove(e) {
				// console.log('绘画中', JSON.stringify(this.points));
				let pos = e.touches[0]
				let po = this.points[this.points.length - 1].point;
				po.push({
					x: pos.x,
					y: pos.y
				});
				this.bindDraw(po);
			},
			// 触摸结束
			touchEnd(e) {
				console.log('结束绘画', JSON.stringify(this.points));
				this.$emit('drawChange', this.points)
			},
			//绘制
			bindDraw(point) {
				context.moveTo(point[0].x, point[0].y);
				point.forEach(item => context.lineTo(item.x, item.y))
				context.stroke();
				context.draw(true);
			},
			//切换成画笔/橡皮檫
			switchBrush(e) {
				this.brushState = e.currentTarget.dataset.state
			},
			//绘制回退
			drawBack() {
				if (this.points.length == 0) return false;
				context.clearRect(0, 0, 400, 500);
				context.draw();
				this.points.pop();
				console.log(JSON.stringify(this.points));
				let po = this.points;
				po.forEach(item => {
					context.setStrokeStyle(item.tinct); //设置描边颜色
					context.setLineWidth(item.lineWidth); //设置线条宽度
					// context.beginPath();
					this.bindDraw(item.point);
				})
				this.$emit('drawChange', this.points)
			},
			//清空画布
			drawClear() {
				context.clearRect(0, 0, 400, 500);
				context.draw();
				this.points = []
				this.$emit('drawChange', this.points)
			},
			//更改画笔颜色
			tinColorChange(index) {
				this.tinctCurr = index
			},
			//画笔大小
			tinSizechange(e) {
				this.tinctSize = e.detail.value
			},
			// 用来组件 收到信息绘制
			draw() {
				let po = this.points;
				console.log(po)
				if (po.length) {
					po.forEach(item => {
						context.setStrokeStyle(item.tinct); //设置描边颜色
						context.setLineWidth(item.lineWidth); //设置线条宽度
						// context.beginPath();
						if (item.point) this.bindDraw(item.point);
					})
				} else {
					context.clearRect(0, 0, 400, 500);
					context.draw();
				}
			},

		}
	}
</script>
<style>
	.jdraw {
		background-color: #fff;
		position: relative;
	}

	.change {
		height: 0;
		overflow: hidden;
	}

	.jdraw .tool {
		display: flex;
		align-content: center;
		justify-content: space-between;
		padding: 20upx;
	}

	.jdraw .tool image {
		width: 60upx;
		height: 60upx;
	}

	.jdraw .selected {
		background-color: #f7efe0;
	}

	.jdraw .tinct-list {
		overflow: hidden;
		white-space: nowrap;
		padding: 20upx;
		/* border: 1upx solid #F2F2F2; */
	}

	.jdraw .tinct-item {
		display: inline-block;
		width: 40upx;
		height: 40upx;
		border-radius: 100%;
		margin: 0 20upx;
	}

	.jdraw .tinct-curr::after {
		content: '';
		display: block;
		border: 1px solid #864242;
		width: 44upx;
		height: 44upx;
		border-radius: 100%;
		margin-top: -4upx;
		margin-left: -4upx;
	}

	.canvas {
		height: 463px;
		width: 750upx;
		overflow: hidden;
		/* background: #f2f2f2; */
	}

	
</style>
