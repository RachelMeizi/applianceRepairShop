<template>
	<view>
		<view class="topTabBar" :style="{position:headerPosition,top:headerTop}">
			<view class="grid" v-for="(grid,tbIndex) in tabList" :key="tbIndex" @tap="showType(tbIndex)">
				<view class="text" :class="[tbIndex==tabbarIndex?'on':'']">{{grid}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['tabList', 'headerTop'],
		data() {
			return {
				tabbarIndex: 0,
				headerPosition: "",
			}
		},
		methods: {
			showType(tbIndex) {
				console.log('4a5s4ad点击事件');
				this.tabbarIndex = tbIndex;
				console.log('tbIndex', tbIndex);
				console.log(tbIndex, '子组件')
				this.$emit('onChang', tbIndex);
			},
		}

	}
</script>

<style lang="scss">
	.topTabBar {
		width: 100%;
		// position: fixed;
		// top: 0;
		// z-index: 10;
		background-color: #f8f8f8;
		height: 90upx;
		display: flex;
		justify-content: space-around;

		.grid {
			width: 20%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #444;
			font-size: 28upx;

			.text {
				height: 76upx;
				display: flex;
				align-items: center;

				&.on {
					color: #f06c7a;
					border-bottom: solid 4upx #f06c7a;
				}
			}

		}
	}
</style>
