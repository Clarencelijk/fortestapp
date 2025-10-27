/**
 * 通用工具函數
 */

/**
 * 防抖函數
 * @param {Function} func 要執行的函數
 * @param {Number} wait 等待時間（毫秒）
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
	let timeout;
	return function(...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
}

/**
 * 節流函數
 * @param {Function} func 要執行的函數
 * @param {Number} wait 等待時間（毫秒）
 * @returns {Function}
 */
export function throttle(func, wait = 300) {
	let previous = 0;
	return function(...args) {
		const now = Date.now();
		const context = this;
		if (now - previous > wait) {
			func.apply(context, args);
			previous = now;
		}
	};
}

/**
 * 格式化時間
 * @param {Date|String|Number} date 日期對象或時間戳
 * @param {String} format 格式化模板
 * @returns {String}
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
	if (!date) return '';
	
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const hour = String(d.getHours()).padStart(2, '0');
	const minute = String(d.getMinutes()).padStart(2, '0');
	const second = String(d.getSeconds()).padStart(2, '0');
	
	return format
		.replace('YYYY', year)
		.replace('MM', month)
		.replace('DD', day)
		.replace('HH', hour)
		.replace('mm', minute)
		.replace('ss', second);
}

/**
 * 格式化相對時間（如：剛剛、5分鐘前）
 * @param {Date|String|Number} date 日期對象或時間戳
 * @returns {String}
 */
export function formatRelativeTime(date) {
	if (!date) return '';
	
	const d = new Date(date);
	const now = new Date();
	const diff = now - d;
	
	const minute = 60 * 1000;
	const hour = 60 * minute;
	const day = 24 * hour;
	const month = 30 * day;
	const year = 12 * month;
	
	if (diff < minute) {
		return '剛剛';
	} else if (diff < hour) {
		return Math.floor(diff / minute) + '分鐘前';
	} else if (diff < day) {
		return Math.floor(diff / hour) + '小時前';
	} else if (diff < month) {
		return Math.floor(diff / day) + '天前';
	} else if (diff < year) {
		return Math.floor(diff / month) + '個月前';
	} else {
		return Math.floor(diff / year) + '年前';
	}
}

/**
 * 格式化數字（如：1000 -> 1k）
 * @param {Number} num 數字
 * @returns {String}
 */
export function formatNumber(num) {
	if (num < 1000) {
		return String(num);
	} else if (num < 10000) {
		return (num / 1000).toFixed(1) + 'k';
	} else if (num < 100000000) {
		return (num / 10000).toFixed(1) + 'w';
	} else {
		return (num / 100000000).toFixed(1) + '億';
	}
}

/**
 * 深拷貝
 * @param {Any} obj 要拷貝的對象
 * @returns {Any}
 */
export function deepClone(obj) {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}
	
	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}
	
	if (obj instanceof Array) {
		return obj.map(item => deepClone(item));
	}
	
	if (obj instanceof Object) {
		const clonedObj = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				clonedObj[key] = deepClone(obj[key]);
			}
		}
		return clonedObj;
	}
}

/**
 * 生成隨機 ID
 * @param {Number} length ID 長度
 * @returns {String}
 */
export function generateId(length = 8) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

/**
 * 獲取圖片信息
 * @param {String} src 圖片路徑
 * @returns {Promise}
 */
export function getImageInfo(src) {
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src,
			success: resolve,
			fail: reject
		});
	});
}

/**
 * 顯示 Toast
 * @param {String} title 提示文字
 * @param {String} icon 圖標類型
 * @param {Number} duration 持續時間
 */
export function showToast(title, icon = 'none', duration = 2000) {
	uni.showToast({
		title,
		icon,
		duration
	});
}

/**
 * 顯示 Loading
 * @param {String} title 提示文字
 */
export function showLoading(title = '加載中...') {
	uni.showLoading({
		title,
		mask: true
	});
}

/**
 * 隱藏 Loading
 */
export function hideLoading() {
	uni.hideLoading();
}

/**
 * 確認對話框
 * @param {String} content 內容
 * @param {String} title 標題
 * @returns {Promise}
 */
export function showConfirm(content, title = '提示') {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title,
			content,
			success: (res) => {
				if (res.confirm) {
					resolve();
				} else {
					reject();
				}
			},
			fail: reject
		});
	});
}

/**
 * 本地存儲
 */
export const storage = {
	set(key, value) {
		try {
			uni.setStorageSync(key, JSON.stringify(value));
		} catch (e) {
			console.error('存儲失敗', e);
		}
	},
	get(key) {
		try {
			const value = uni.getStorageSync(key);
			return value ? JSON.parse(value) : null;
		} catch (e) {
			console.error('讀取失敗', e);
			return null;
		}
	},
	remove(key) {
		try {
			uni.removeStorageSync(key);
		} catch (e) {
			console.error('刪除失敗', e);
		}
	},
	clear() {
		try {
			uni.clearStorageSync();
		} catch (e) {
			console.error('清空失敗', e);
		}
	}
};

