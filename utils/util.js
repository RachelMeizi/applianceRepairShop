// #ifdef H5
const host = '/api'
// #endif
// #ifndef H5
// const host = 'https://jiadian.9zk.com'
const host='http://192.168.10.10:8008'

// #endif

import store from '../store/index.js'

export default {
	// webHost: 'https://glass.zez.cn',
	shopId: 3,
	get(url, tips = true) {
		return new Promise((resolve, reject) => {
			// if (tips) {
			// 	uni.showLoading({
			// 		title: '数据加载中xx',
			// 		mask: false
			// 	});
			// }
			console.log(host + url, 'get请求接口')
			uni.request({
				url: host + url,
				method: 'GET',
				header: {
					'token': uni.getStorageSync('CODE'), //自定义请求头信息
					// 'token':'hhhh',
					'shopId': this.shopId,
					'serviceNum': '1014' //维修
				},
				success: res => {

					console.log(JSON.stringify(res.data), 'get数据');
					res.statusCode == 200 && resolve(res)
				},
				fail: (err) => reject(err),
				complete: () => {
					uni.hideLoading()
					console.log("fdsfsffdsfds")
				}
			});
		})
	},
	//post区别:会自动对发送的数据进行 JSON 序列化
	post(url, data, Tips = true) {
		return new Promise((resolve, reject) => {
			if (Tips) {
				uni.showLoading({
					title: '数据加载中',
					mask: true
				});
			}
			console.log(host + url, 'post请求接口')
			uni.request({
				url: host + url,
				method: 'POST',
				header: {
					'token':  uni.getStorageSync('CODE'), //自定义请求头信息
					'shopId': this.shopId,
					// 'token':'hhhh',
					'serviceNum': '1014'
				},
				data: data,
				success: res => {
					console.log(JSON.stringify(res.data), 'post数据');
					resolve(res)
				},
				fail: (err) => reject(err),
				complete: () => {
					uni.hideLoading()
				}
			});
		})
	},
	success(title) {
		return new Promise(resolve => {
			uni.showToast({
				title,
				success: resolve()
			})
		})
	},
	fail(title) {
		uni.showToast({
			title,
			icon: 'none'
		});
	},
	upload(
		url,
		file,

	) {
		uni.showLoading({
			title: '上传中...',
			mask: true,
		});
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: host + url,
				filePath: file,
				header: {
					'token':  uni.getStorageSync('CODE'), //自定义请求头信息
					'shopId': this.shopId
				},
				name: 'file',
				success: res => resolve(res),
				fail: err => reject(err),
				complete: () => {
					uni.hideLoading()
				}
			})
		})
	},
	uploadImage(url, filePaths, i = 0, callback) {
		const length = filePaths.length
		uni.showLoading({
			title: '上传中..',
			mask: true
		})
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				header: {
					'token': store.state.userInfo ? store.state.userInfo.msg : '', //自定义请求头信息
					'shopId': this.shopId
				},
				url: host + url,
				filePath: filePaths[i],
				name: 'file',
				success: res => {
					resolve(res),
						callback && callback(res)
					i++
					if (i < length) {
						this.uploadImage(url, filePaths, i, callback)
					} else {
						uni.hideLoading()
						uni.showToast({
							title: '上传完成!',
						})
					}
				},
				fail: err => {
					reject(err),
						callback && callback(err)
					uni.hideLoading()
					uni.showToast({
						title: '上传失败!',
						icon: 'none'
					})
				}
			})
		})
	},
	hidePhoneNum(phone) {
		let result = "";
		if (phone != null && phone != "") {
			if (phone) { //substring(start,end) 返回从start位置开始到end位置的子串（不包含end）
				result = phone.substring(0, 3) + "****" + phone.substring(7);
			}
		}
		return result;

	},

	week() {
		let data = [];
		let week = new Date().getDay() - 1
		let arr = ['一', '二', '三', '四', '五', '六', '日']
		for (let i = 0; i < 7; i++) {
			if (i == 0) {
				data.push(`星期${arr[week]}(今天)`)
			} else if (i == 1) {
				data.push(`星期${arr[week+1]}(明天)`)
			} else if (i == 2) {
				data.push(`星期${arr[week+2]}(后天)`)
			} else {
				if (week + i >= arr.length) {
					data.push(`星期${arr[week+i-arr.length]}`)
				} else {
					data.push(`星期${arr[week+i]}`)
				}

			}
		}
		return data
	},


	times() {
		let arr = [];
		let val;
		for (let i = 0; i < 24; i = i + 0.5) {
			if (i == parseInt(i)) {
				let f = i.toString();
				if (f.length < 2) {
					f = "0" + f;
				}
				val = f + ":00:00";
			} else {
				let f = (i - 0.5).toString();
				if (f.length < 2) {
					f = "0" + f;
				}
				val = f + ":30:00";
			}
			arr.push(val);
		}
		return arr;
	},
	//调用高德web Api逆地址解析
	reverseAddress(lng, lat, key) {
		return new Promise((resolve, reject) => {
			let url =
				`https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=${lng},${lat}&key=${key}&radius=2000&extensions=base`
			uni.request({
				url: url,
				method: 'get',
				dataType: 'json',
				success: res => resolve(res),
				fail: (err) => reject(err),
			});
		})
	},
	checkPhone(phone) {
		let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (myreg.test(phone)) {
			return true
		} else {
			return false
		}
	},

	checkLogin() {
		const userInfo = store.state.userInfo
		const code = uni.getStorageSync('CODE')
		console.log(code, userInfo, 'checkLogin');
		//未通过检测
		if (!userInfo) {
			setTimeout(() => {
				uni.showModal({
					title: '温馨提示',
					content: '您还没有登录，请先登录',
					success: res => {
						if (res.confirm) {
							uni.redirectTo({
								url: '/pages/loginBase/logins'
							});
						}
					}
				});

			}, 1000)

			return false
		} else {
			console.log(userInfo, '45444444444444');
		}
		//通过检测
		return true
	}
}
