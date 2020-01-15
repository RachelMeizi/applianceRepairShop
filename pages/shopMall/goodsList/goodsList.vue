<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.img[0].url" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<view class="price-box">
					<text class="price">{{item.price / 100}}</text>
					<text>已售 {{item.sellNum || 0}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>

		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.title}}</view>
						<view v-for="tItem in item.list" :key="tItem.id" class="cate-item b-b" :class="{active: tItem.id==cateId}" @click="changeCate(tItem)">
							{{tItem.title}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>


	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList:[],
				// cateList: [{
				// 	id: 1,
				// 	title: '家用电器',
				// 	banner: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1275117093,2668160548&fm=26&gp=0.jpg',
				// 	list: [{
				// 			id: 2,
				// 			title: '冰箱',
				// 			img: '1.jpg'
				// 		},
				// 		{
				// 			id: 3,
				// 			title: '电视',
				// 			img: '2.jpg'
				// 		},

				// 	]
				// }, ],
				goodsList:[],
				// goodsList: [{
				// 		_id: "1",
				// 		img:[{url :"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg",}],
				// 		price: 100,
				// 		sellNum: 61,
				// 		title: "古黛妃 短袖t恤女夏装2019新款韩版宽松",
				// 	},
				// 	{
				// 		_id: "15",
				// 		img:[{url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg",}],
				// 		price: 179,
				// 		sellNum: 61,
				// 		title: "古黛妃 短袖t恤女夏装2019新款韩版宽松",
				// 	},
				// ]
			};
		},

		onLoad(options) {
			// // #ifdef H5
			// this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			// // #endif
			this.cateId = options.sid; //二级分类id
			// this.loadCateList(options.fid,options.sid);
			// this.loadData();
			console.log("dddddd")
			this.goodsDataList(this.cateId)
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			//加载分类
			//  loadCateList(fid, sid){
			// 	let list = await this.$api.json('cateList');
			// 	let cateList = list.filter(item=>item.pid == fid);

			// 	cateList.forEach(item=>{
			// 		let tempList = list.filter(val=>val.pid == item.id);
			// 		item.child = tempList;
			// 	})
			// 	this.cateList = cateList;
			// },
			//加载商品 ，带下拉刷新和上滑加载
			// async loadData(type='add', loading) {
			// 	//没有更多直接返回
			// 	if(type === 'add'){
			// 		if(this.loadingType === 'nomore'){
			// 			return;
			// 		}
			// 		this.loadingType = 'loading';
			// 	}else{
			// 		this.loadingType = 'more'
			// 	}

			// 	let goodsList = await this.$api.json('goodsList');
			// 	if(type === 'refresh'){
			// 		this.goodsList = [];
			// 	}
			// 	//筛选，测试数据直接前端筛选了
			// 	if(this.filterIndex === 1){
			// 		goodsList.sort((a,b)=>b.sales - a.sales)
			// 	}
			// 	if(this.filterIndex === 2){
			// 		goodsList.sort((a,b)=>{
			// 			if(this.priceOrder == 1){
			// 				return a.price - b.price;
			// 			}
			// 			return b.price - a.price;
			// 		})
			// 	}

			// 	this.goodsList = this.goodsList.concat(goodsList);

			// 	//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
			// 	this.loadingType  = this.goodsList.length > 20 ? 'nomore' : 'more';
			// 	if(type === 'refresh'){
			// 		if(loading == 1){
			// 			uni.hideLoading()
			// 		}else{
			// 			uni.stopPullDownRefresh();
			// 		}
			// 	}
			// },
			goodsDataList(type_id) {
				this.$util.get('/login/sgetNav?types=goods').then(res => {
					this.cateList = res.data
				})
				this.$util.get('/shop/getGoods?typeId=' + type_id).then(res => {
					this.goodsList = res.data.data
				})
				console.log('?');
			},

			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				
				if (index === 2) {
					const order =  this.priceOrder === 1 ? 2 : 1
					switch(order){
						case 1:
						//价格升序
						this.goodsList.sort(function(x,y){
							return x.price - y.price
						})
						break
						case 2:
						//价格降序
						this.goodsList.sort(function(x,y){
							return y.price - x.price
						})
					}

					
					this.priceOrder = order;
				} else {
					this.priceOrder = 0;
				}
				//按销量排序
				if(index==1){
					this.goodsList.sort(function(x,y){
						return x.num - y.num
					})
				}
				
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item) {
				console.log(item, '分类点击')
				this.cateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				// this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				console.log(id, item, '00000000')
				let id = item._id;
				uni.navigateTo({
					url: `/pages/shopMall/goodsDetail/goodsDetail?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
			display: -webkit-box;
			font-size: 28rpx;
			color: #000000;
			line-height: 40rpx;
			word-break: break-all;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
</style>
