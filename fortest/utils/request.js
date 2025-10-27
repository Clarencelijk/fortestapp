/**
 * 網絡請求封裝
 */

// API 基礎地址
const BASE_URL = 'https://api.example.com'; // 請替換為實際的 API 地址

// 請求超時時間
const TIMEOUT = 10000;

/**
 * 發起網絡請求
 * @param {Object} options 請求配置
 * @returns {Promise}
 */
function request(options) {
	return new Promise((resolve, reject) => {
		// 顯示加載提示
		if (options.loading !== false) {
			uni.showLoading({
				title: options.loadingText || '加載中...',
				mask: true
			});
		}

		// 獲取 token
		const token = uni.getStorageSync('token');

		// 發起請求
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'Content-Type': 'application/json',
				'Authorization': token ? `Bearer ${token}` : '',
				...options.header
			},
			timeout: options.timeout || TIMEOUT,
			success: (res) => {
				// 隱藏加載提示
				if (options.loading !== false) {
					uni.hideLoading();
				}

				// 處理響應
				if (res.statusCode === 200) {
					const data = res.data;
					
					// 根據業務邏輯判斷請求是否成功
					if (data.code === 0 || data.code === 200) {
						resolve(data.data || data);
					} else {
						// 業務錯誤
						const errorMsg = data.message || data.msg || '請求失敗';
						
						if (options.showError !== false) {
							uni.showToast({
								title: errorMsg,
								icon: 'none',
								duration: 2000
							});
						}
						
						reject(new Error(errorMsg));
					}
				} else if (res.statusCode === 401) {
					// 未授權，跳轉到登錄頁
					uni.showToast({
						title: '請先登錄',
						icon: 'none',
						duration: 2000
					});
					
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 2000);
					
					reject(new Error('未授權'));
				} else {
					// HTTP 錯誤
					const errorMsg = `請求失敗 (${res.statusCode})`;
					
					if (options.showError !== false) {
						uni.showToast({
							title: errorMsg,
							icon: 'none',
							duration: 2000
						});
					}
					
					reject(new Error(errorMsg));
				}
			},
			fail: (err) => {
				// 隱藏加載提示
				if (options.loading !== false) {
					uni.hideLoading();
				}

				// 網絡錯誤
				const errorMsg = err.errMsg || '網絡錯誤，請檢查網絡連接';
				
				if (options.showError !== false) {
					uni.showToast({
						title: errorMsg,
						icon: 'none',
						duration: 2000
					});
				}
				
				reject(err);
			}
		});
	});
}

/**
 * GET 請求
 */
export function get(url, data = {}, options = {}) {
	return request({
		url,
		method: 'GET',
		data,
		...options
	});
}

/**
 * POST 請求
 */
export function post(url, data = {}, options = {}) {
	return request({
		url,
		method: 'POST',
		data,
		...options
	});
}

/**
 * PUT 請求
 */
export function put(url, data = {}, options = {}) {
	return request({
		url,
		method: 'PUT',
		data,
		...options
	});
}

/**
 * DELETE 請求
 */
export function del(url, data = {}, options = {}) {
	return request({
		url,
		method: 'DELETE',
		data,
		...options
	});
}

/**
 * 上傳文件
 */
export function upload(url, filePath, options = {}) {
	return new Promise((resolve, reject) => {
		// 顯示加載提示
		uni.showLoading({
			title: options.loadingText || '上傳中...',
			mask: true
		});

		// 獲取 token
		const token = uni.getStorageSync('token');

		// 上傳文件
		uni.uploadFile({
			url: BASE_URL + url,
			filePath,
			name: options.name || 'file',
			formData: options.formData || {},
			header: {
				'Authorization': token ? `Bearer ${token}` : '',
				...options.header
			},
			success: (res) => {
				uni.hideLoading();

				if (res.statusCode === 200) {
					const data = JSON.parse(res.data);
					
					if (data.code === 0 || data.code === 200) {
						resolve(data.data || data);
					} else {
						const errorMsg = data.message || data.msg || '上傳失敗';
						uni.showToast({
							title: errorMsg,
							icon: 'none',
							duration: 2000
						});
						reject(new Error(errorMsg));
					}
				} else {
					const errorMsg = `上傳失敗 (${res.statusCode})`;
					uni.showToast({
						title: errorMsg,
						icon: 'none',
						duration: 2000
					});
					reject(new Error(errorMsg));
				}
			},
			fail: (err) => {
				uni.hideLoading();
				
				const errorMsg = err.errMsg || '上傳失敗';
				uni.showToast({
					title: errorMsg,
					icon: 'none',
					duration: 2000
				});
				reject(err);
			}
		});
	});
}

export default request;

