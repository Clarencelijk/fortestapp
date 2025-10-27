<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	onPageNotFound() {
		uni.navigateTo({
			url: '/pages/404/404'
		})
	},
	onShareAppMessage() {
		console.log('頁面已分享')
	}
}
</script>

<style lang="scss">
/* 全局公共樣式 */
@import '@/uni.scss';

/* 重置默認樣式 */
page {
	background-color: $bg-page;
	color: $text-primary;
	font-size: $font-md;
	line-height: $line-height-md;
}

/* 全局滾動條樣式（H5） */
::-webkit-scrollbar {
	width: 8rpx;
	height: 8rpx;
}

::-webkit-scrollbar-track {
	background-color: $bg-page;
}

::-webkit-scrollbar-thumb {
	background-color: $border-color;
	border-radius: $radius-round;
}

::-webkit-scrollbar-thumb:hover {
	background-color: $border-dark;
}

/* 全局按鈕樣式重置 */
button {
	border: none;
	outline: none;
	background: none;
	padding: 0;
	margin: 0;
	font-size: inherit;
	line-height: inherit;
}

button::after {
	border: none;
}

/* 全局輸入框樣式重置 */
input,
textarea {
	border: none;
	outline: none;
	background: none;
	padding: 0;
	margin: 0;
	font-size: inherit;
	line-height: inherit;
}

/* 全局圖片樣式 */
image {
	display: block;
	width: 100%;
	height: auto;
}

/* 全局文本選擇樣式 */
::selection {
	background-color: rgba($primary-color, 0.2);
	color: $text-primary;
}

/* 全局動畫類 */
.fade-enter-active,
.fade-leave-active {
	transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
	transition: transform $transition-base;
}

.slide-up-enter-from {
	transform: translateY(100%);
}

.slide-up-leave-to {
	transform: translateY(100%);
}

/* 全局工具類 */
.flex {
	display: flex;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.flex-column {
	display: flex;
	flex-direction: column;
}

.text-center {
	text-align: center;
}

.text-right {
	text-align: right;
}

.text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.text-ellipsis-2 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
}

.text-ellipsis-3 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 全局間距工具類 */
.mt-xs { margin-top: $spacing-xs; }
.mt-sm { margin-top: $spacing-sm; }
.mt-md { margin-top: $spacing-md; }
.mt-lg { margin-top: $spacing-lg; }
.mt-xl { margin-top: $spacing-xl; }

.mb-xs { margin-bottom: $spacing-xs; }
.mb-sm { margin-bottom: $spacing-sm; }
.mb-md { margin-bottom: $spacing-md; }
.mb-lg { margin-bottom: $spacing-lg; }
.mb-xl { margin-bottom: $spacing-xl; }

.pt-xs { padding-top: $spacing-xs; }
.pt-sm { padding-top: $spacing-sm; }
.pt-md { padding-top: $spacing-md; }
.pt-lg { padding-top: $spacing-lg; }
.pt-xl { padding-top: $spacing-xl; }

.pb-xs { padding-bottom: $spacing-xs; }
.pb-sm { padding-bottom: $spacing-sm; }
.pb-md { padding-bottom: $spacing-md; }
.pb-lg { padding-bottom: $spacing-lg; }
.pb-xl { padding-bottom: $spacing-xl; }
</style>

