<template>
	<view v-if="pageCloak">
		<view class="modal-view" @touchmove.stop.prevent @tap='tagModal' :class="[{show: hide}, 'modal-view-' + position]"
		 :style="popupStyle">
			<view class="modal-container" @tap.stop.prevent :class="'modal-' + position">
				<view class="modal-row modal-submit modal-border-bottom" v-if="!noBotton && position === 'bottom'">
					<view class="modal-cancel" v-if="!noCancel" :style="cancelStyle" @tap="cancel">
						{{cancelText}}
					</view>
					<view class="modal-col">
						{{title || ""}}
					</view>
					<view class="modal-confirm" :style="confirmStyle" @tap="confirm">
						{{confirmText}}
					</view>
				</view>
				<scroll-view :scroll-y='!disable'  class="scroll backRight-view" :style="!noBotton && (position === 'left' || position === 'right') ? 'bottom: 44px;' : (!noBotton && position === 'bottom' ? 'top: 36px;' : '')">
					<slot />
				
				</scroll-view>
				<cover-view class="modal-row modal-border-top backRight-view " v-if="!noBotton && (position === 'left' || position === 'right')">
					
					<!-- 	<view class="modal-col" v-if="!noCancel" :style="cancelStyle" @tap="cancel">
						{{cancelText}}
					</view>
					<view class="modal-col modal-btn" :style="confirmStyle" @tap="confirm">
						{{confirmText}}
					</view> -->
				</cover-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			popupStyle: null,
			disable: {
				type: Boolean,
				default: false
			},
			hidden: {
				type: Boolean,
				default: false
			},
			position: {
				type: String,
				default: 'bottom'
			},
			noCancel: {
				type: Boolean,
				default: false
			},
			noBotton: {
				type: Boolean,
				default: false
			},
			cancelStyle: null,
			confirmStyle: null,
			title: null,
			cancelText: {
				type: String,
				default: '取消'
			},
			confirmText: {
				type: String,
				default: '确定'
			}
		},
		data() {
			return {
				pageCloak: false, // 小程序端初始化时，组件闪烁
				hide: this.hidden
			};
		},
		watch: {
			hidden(nVal, oVal) {
				this.hide = nVal
			},
			hide(nVal, oVal) {
				this.$emit('update:hidden', nVal)
			}

		},
		mounted() {
			this.pageCloak = true
		},
		methods: {
			tagModal() {
				this.hide = !this.hide
			},
			cancel(e) {
				// this.tagModal()
				// 内部关闭弹窗
				this.$emit('cancel', e)
			},
			confirm(e) {
				// this.tagModal()
				// 内部关闭弹窗
				this.$emit('confirm', e)
			}
		}
	}
</script>

<style lang="scss">
	.modal-view {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
		background: rgba(0, 0, 0, .5);
		display: flex;
		transition: all .2s linear;
		visibility: hidden;
		opacity: 0;

		

		.modal-container {
			background: #fff;
			transition: transform .2s linear;
			position: relative;
			.backRight-view {
				background: rgb(35, 37, 47);
			}
		}

		.scroll {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}

		.modal-row {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			position: absolute !important;
			left: 0;
			right: 0;
			bottom: 0;
			height: 44px;
			line-height: 44px;
			text-align: center;
			font-size: 16px;
			color: rgb(3, 3, 3);
		}

		.modal-col {
			-ms-flex-preferred-size: 0;
			flex-basis: 0;
			-webkit-box-flex: 1;
			-ms-flex-positive: 1;
			flex-grow: 1;
			max-width: 100%;
			position: relative;
			transition: all .1s;
		}

		.modal-border-top::after,
		.modal-border-bottom::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			height: 1px;
			// border-top: 1px solid #d5d5d5;
			transform: scaleY(.36) translateY(-1px);
		}

		.modal-border-bottom::after {
			top: 100%;
			left: 15px;
			right: 15px;
		}

		.modal-btn {
			background: #FE5430;
			color: #fff;
		}

		.modal-submit {
			top: 0;
			height: 36px;
			line-height: 36px;

			.modal-cancel,
			.modal-confirm {
				padding: 0 15px;
			}

			.modal-confirm {
				color: rgb(0, 122, 255);
			}
		}
	}

	.modal-view.show {
		opacity: 1;
		visibility: visible;

		.modal-container {
			transform: translate3d(0, 0, 0) !important;
		}
	}

	.modal-view-top {
		align-items: flex-start;

		.modal-container {
			width: 100%;
			height: 60vh;
			transform: translate3d(0, -100%, 0);
		}
	}

	.modal-view-right {
		justify-content: flex-end;

		.modal-container {
			width: 70%;
			height: 100vh;
			transform: translate3d(100%, 0, 0);
		}
	}

	.modal-view-bottom {
		align-items: flex-end;

		.modal-container {
			width: 100%;
			min-height: 36vh;
			transform: translate3d(0, 100%, 0);
		}
	}

	.modal-view-left {
		justify-content: flex-start;

		.modal-container {
			width: 70%;
			height: 100vh;
			transform: translate3d(-100%, 0, 0);
		}
	}
</style>
