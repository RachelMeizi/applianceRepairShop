<!-- <template>
  <div class="page">
    <div class='yuE'>¥ {{allPrice}}</div>
    <div class='zhangHu'>账户余额</div>
    <div class="inputPrice">
      <input class='shuRu'
             v-model="price"
             type="number"
             placeholder="请输入金额">
    </div>
    <div class='tiXian'
         @click='quanBu'
         v-if="isWithdrawMoney">全部提现</div>
    <button class='withdraw'
            @click="sendMessage"
            v-if="isWithdrawMoney">确认提现</button>
    <button class='no-withdraw'
            @click="getPayPrice"
            v-else>确认充值</button>
    <div v-if="isWithdrawMoney">
      <div class='qingBao'>
        <img src='/static/center/pingjia.png'>
        <div>钱包记录</div>
      </div>
      <div class='jiLu'
           v-for="item in withdrawMoneyList"
           :key="item.id">
        <img src='/static/center/dingdan.png'>
        <div>
          <div v-if="item.status==1">提现成功</div>
          <div v-if="item.status==0">审核中</div>
          <div v-if="item.status==-1">提现失败</div>
          <div>{{item.up_time}}</div>
        </div>
        <div class='price'>{{item.point}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      price: '',
      allPrice: 0,
      isWithdrawMoney: true,
      withdrawMoneyList: [],
      page: 0
    }
  },
  onLoad () {

  },
  methods: {
    // 提现
    geFetchPrice () {
      getRecharge(this.price).then((res) => {
        Toast(res.data.msg)
        this.getAllPrice()
        this.getRechargeList()
      })
    },
    // 获取账户余额
    getAllPrice () {
      getBalance().then(res => {
        this.allPrice = res.data
      })
    },
    // 历史记录
    getRechargeList () {
      this.page++
      getRechargeList(this.page).then(res => {
        this.withdrawMoneyList = [...this.withdrawMoneyList, ...res.data]
      })
    },
    quanBu (e) {
      this.price = this.allPrice
    },
    sendMessage () {
      let price = this.price
      if (price <= 0 || !price) {
        Toast('金额必须大于0元~~')
        return
      }
      if (this.isWithdrawMoney && price > this.allPrice) {
        Toast('提现金额不能大于账户余额~~')
        return
      }
      this.geFetchPrice()
    },
    // 充值
    getPayPrice () {
      // wx.showModal({
      //   title: '确认支付',
      //   content: '支付总价：' + this.price + "元",
      //   success: ((res) => {
      //     if (res.confirm) {
      //       pay(app.host + '/wxPay', (res) => {
      //         console.log(res)
      //       }, (err) => {
      //         console.log(err)
      //         return
      //       }, {
      //           total_fee: this.price,
      //         })
      //     } else {
      //       return
      //     }
      //   })
      // })
    }
  }
}
</script>

<style>
.page {
  box-sizing: border-box;
  background: #f2f2f2;
  height: 100%;
	width: 100%;
}

.yuE {
  text-align: center;
  font-size: 25px;
  padding-top: 90px;
}

.zhangHu {
  text-align: center;
  color: #bbb;
  font-size: 15px;
  padding: 10px 0;
}
.inputPrice {
  position: relative;
}
.shuRu {
  background-color: #fff;
	padding: 12upx;
	height: auto;
  font-size: 15px;
  border-radius: 5px;
  position: relative;
  width: 90%;
  box-sizing: border-box;
  margin: 20px;
}

.yuan {
  font-size: 15px;
  position: absolute;
  right: 30px;
  top: 40px;
}

.tiXian {
  margin: 10px 22px;
  font-size: 14px;
	color: #0081FF;
}

.withdraw {
  background-color: #ea0502;
  margin-top: 100px;
  color: #fff;
  opacity: 0.7;
  font-size: 15px;
  border-radius: 5px;
  width: 90%;
  box-sizing: border-box;
  margin: 20px;
}

.no-withdraw {
  background-color: #1ecfa7;
  margin-top: 100px;
  color: #fff;
  opacity: 0.7;
  padding: 15px 30px 15px 15px;
  font-size: 15px;
  border-radius: 5px;
  width: 90%;
  box-sizing: border-box;
  margin: 20px;
}

.qingBao {
  display: flex;
  padding: 10px;
  background-color: #fff;
  margin-top: 15px;
  align-items: center;
}

.qingBao img {
  margin-top: 5px;
  height: 30px;
  width: 30px;
}

.qingBao div {
  margin: 5px;
  font-size: 15px;
}

.jiLu {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #eee;
  font-size: 15px;
  color: #666;
  justify-content: space-between;
  align-items: center;
}

.jiLu img {
  margin: 5px 10px 0 0;
  height: 30px;
  width: 30px;
}

.price {
  font-weight: 900;
}
input {
  border: 1px solid #ccc;
  outline: none;
}
button {
  border: none
}
</style>
 -->
 
 <template>
 	<view>
 		<!-- 用户信息 -->
 		<view class="top">
 			<view class='makecoulmn'>
 				<view>
 					<view>总收入(元)</view>
 					<view class='money'>{{totalincome}}</view>
 				</view>
 				<view class="paycode" @tap='onChangeCode'>
 					<image :src="codeImg" mode=""></image>
 					<text>点击更换收款码</text>
 				</view>
 			</view>
 			<view class='moneytips'>
 				<text>今日收入(元)：{{todayIncome}}</text>
 				<text>总收益（元）：{{totalincome}}</text>
 				<!-- <text>你的钱包余额</text> -->
 			</view>
 		</view>
 		<!-- 店铺列表 -->
 		<view class="shoplist">
 			<view class="shopInfo" v-for='item in shopList'>
 				<view class="paycode">
 					<image :src="item.img" mode=""></image>
 				</view>
 				<view class="shopInfo-Center">
 					<text>{{item.shopName}}</text>
 					<text>余额:{{item.shopCashPrice}}</text>
 					<text>提现金额大于{{item.condition}}元可提现</text>
 				</view>
 				<view class="shopInfo-right">
 					<button :type="item.is_cash==0?'default':'warn'" size="mini" @tap="onGoCash(item)">提现</button>
 					<text @tap='lookDeatil'>查阅明细>></text>
 				</view>
 			</view>
 		</view>
 
 
 
 
 	</view>
 </template>
 <script>
 	export default {
 		data() {
 			return {
 				todayIncome: 300, //今日收入
 				totalincome: 600, //总收入，
 				codeImg: 'https://dwz.cn/qaOweppX', //用户收款码
 				shopList: [{
 					// img: 'https://dwz.cn/qaOweppX', //店铺招牌
 					// shopName: '猪肉店铺',
 					// shopCashPrice: 6454, //用户在本店铺可提现金额
 					// condition: '8', //满足提现条件金额
 					// is_cash: 0, //不可提现 1=可提现
 				}, ],
 			}
 		},
 		onLoad() {
 		
 			this.$util.get('/pointInfoList').then(res => {
 				this.todayIncome = res.data.todayIncome
 				this.totalincome = res.data.totalIncome
 				this.codeImg = res.data.codeImg
 				this.shopList = res.data.shopList
 			})
 		},
 		methods: {
 			uploadurl(){
 				this.$util.post('/changeUrl?url=' + this.codeImg ).then((resD) => {
 					if (resD.data.status == 200) {
 						uni.showToast({
 							title: '添加成功',
 				
 						})
 					} else {
 						uni.showToast({
 							title: '添加失败',
 				
 						})
 					}
 				})
 			},
 			onChangeCode() {
 				uni.chooseImage({
 					count: 1, //默认9
 					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
 					sourceType: ['album'], //从相册选择
 					success: (res) => {
 						console.log(res.tempFilePaths[0], '55')
 						this.$util.upload("/uploadFile", res.tempFilePaths[0])
 							.then((res1) => {
 								let url = JSON.parse(res1.data)
 								this.codeImg = url.path //前端展示
 								this.codeImage = url.img //传给后台
 								this.uploadurl()
 							})
 
 					}
 				});
 			},
 			onGoCash(item) { //提现
 				if (item.is_cash == 0) { //不可提现
 					uni.showToast({
 						title: '不可提现',
 						icon: 'none'
 					})
 				} else {
 					uni.showModal({
 						title: '可提现' + item.shopCashPrice + '确定全部提现吗？',
 						success: (res) => {
 							if (res.confirm) {
 								// 用户提现申请接口  addPointsCash?shop_id= ,price=@梅子 
 								this.$util.post('/addPointsCash?shop_id=' + item.shop_id + '&&price=' + item.shopCashPrice).then(res => {
 									if (res.data.status == 200) {
 										uni.showToast({
 											title: '提现成功'
 										})
 									} else {
 										uni.showToast({
 											title: '提现失败',
 											icon: 'none'
 										})
 									}
 								})
 							}
 						}
 					})
 				}
 
 			},
 			lookDeatil() {
 				uni.navigateTo({
 					url: '/pages/incomeList/incomeList'
 				})
 			},
 		}
 	}
 </script>
 <style>
 	page {
 		font-size: 30upx;
 	}
 
 	.top {
 		width: 95%;
 		/* height: 260upx; */
 		background: rgb(229, 84, 84);
 		border-radius: 20upx;
 		margin: 20upx auto;
 		display: flex;
 		justify-content: space-around;
 		flex-flow: column;
 		color: white;
 		font-size: 28upx;
 	}
 
 	.makecoulmn {
 		margin: 35upx;
 		display: flex;
 		justify-content: space-around;
 		align-items: center;
 	}
 
 	.paycode {
 		display: flex;
 		justify-content: center;
 		align-items: center;
 		flex-flow: column;
 	}
 
 	.paycode>image {
 		width: 130upx;
 		height: 130upx;
 		/* margin: 10upx; */
 	}
 
 	.money {
 		font-size: 50upx;
 		font-weight: bold;
 	}
 
 	.moneytips {
 		background: rgba(0, 0, 0, 0.2);
 		padding: 15upx;
 		border-radius: 10upx;
 	}
 
 	.moneytips text {
 		margin: 10upx;
 	}
 
 	.cash {
 		width: 130upx;
 		height: 40upx;
 		background: #fff;
 		padding: 10upx;
 		color: red;
 		border-radius: 50upx;
 	}
 
 
 	.shoplist {
 		width: 90%;
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		flex-flow: column;
 		padding: 10upx;
 		margin: 0 auto;
 		border: 1upx solid #F2F2F2;
 		border-radius: 20upx;
 		box-shadow: 5upx 8upx 8upx #F2F2F2;
 	}
 
 	.shopInfo>view {
 		margin: 10upx;
 	}
 
 	.shopInfo {
 		display: flex;
 		justify-content: space-around;
 		align-items: center;
 		flex-flow: row;
 		border-bottom: 1upx solid #F2F2F2;
 
 	}
 
 	.shopInfo-Center>text,
 	.shopInfo-right>text {
 		display: block;
 		margin: 5upx;
 	}
 
 	.shopInfo-Center>text:nth-child(1) {
 		font-weight: bold;
 		font-size: 28upx;
 	}
 
 	.shopInfo-Center>text:nth-child(3) {
 		color: gray;
 		font-size: 25upx;
 	}
 
 	.normal {
 		background: white;
 	}
 
 	.Active {
 		background: #0081FF;
 		color: white;
 	}
 </style>
 