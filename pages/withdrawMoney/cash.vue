<template>
	<div class="page">
		<div class='yuE'>¥ {{allPrice}}</div>
		<div class='zhangHu'>账户余额</div>
		<div class="inputPrice">
			<input class='shuRu' v-model="price" type="number" placeholder="请输入金额">
		</div>
		<div class='tiXian' @click='quanBu' v-if="isWithdrawMoney">全部提现</div>
		<button class='withdraw' @click="sendMessage" v-if="isWithdrawMoney">确认提现</button>
		<button class='no-withdraw' @click="getPayPrice" v-else>确认充值</button>
		<!-- <div v-if="isWithdrawMoney">
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
    </div> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				price: '',
				allPrice: 0,
				isWithdrawMoney: true,
				withdrawMoneyList: [],
				page: 0
			}
		},
		onLoad() {
			this.getInitPrice()
		},
		methods: {
			getInitPrice(){
				this.$util.get('/worker/getUserPrice').then(res => {
					this.allPrice = res.data.price
				})
			},
			// 提现
			geFetchPrice() {
				getRecharge(this.price).then((res) => {
					Toast(res.data.msg)
					this.getAllPrice()
					this.getRechargeList()
				})
			},
			// 获取账户余额
			getAllPrice() {
				getBalance().then(res => {
					this.allPrice = res.data
				})
			},
			// 历史记录
			getRechargeList() {
				this.page++
				getRechargeList(this.page).then(res => {
					this.withdrawMoneyList = [...this.withdrawMoneyList, ...res.data]
				})
			},
			quanBu(e) {
				this.price = this.allPrice
			},
			sendMessage() {
				let price = this.price
				if (price <= 0 || !price) {
					this.$util.fail('金额必须大于0元~~')
					return
				}
				if (price > this.allPrice) {
					this.$util.fail('提现金额不能大于账户余额~~')
					return
				}
				this.$util.get('/login/addWithdraw?price=' + price).then(res => {
					if (res.data.status == 200) {
						this.$util.success(res.data.msg)
						this.price=''
						this.getInitPrice()
					} else {
						console.log(res.data.status, 'res.data.status');
						this.$util.fail(res.data.msg)
					}
				})
				// this.geFetchPrice()
			},
			// 充值
			getPayPrice() {
				wx.showModal({
					title: '确认支付',
					content: '支付总价：' + this.price + "元",
					success: ((res) => {
						if (res.confirm) {
							pay(app.host + '/wxPay', (res) => {
								console.log(res)
							}, (err) => {
								console.log(err)
								return
							}, {
								total_fee: this.price,
							})
						} else {
							return
						}
					})
				})
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
