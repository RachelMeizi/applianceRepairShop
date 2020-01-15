export default function wxPay(payData) {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: payData.appId,
			timeStamp: payData.timeStamp,
			nonceStr: payData.nonceStr,
			package: payData.package,
			signType: payData.signType,
			paySign: payData.paySign,
			success: function(res) {
				console.log('success:' + JSON.stringify(res), 'suc');
				resolve(res)
				uni.redirectTo({
					url: '/pages/tabbar/index/index.vue'
				})
			},
			fail: function(err) {
				console.log('fail:' + JSON.stringify(err), 'err');
				reject(err)
				uni.redirectTo({
					url: '/pages/tabbar/index/index.vue'
				})
			}
		});
	})
}
