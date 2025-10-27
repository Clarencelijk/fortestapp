<template>
  <view class="review-page">
    <!-- 商品信息 -->
    <view class="product-section">
      <image class="product-image" :src="productInfo.image" mode="aspectFill" />
      <view class="product-info">
        <text class="product-name">{{ productInfo.name }}</text>
        <text v-if="productInfo.spec" class="product-spec">{{ productInfo.spec }}</text>
      </view>
    </view>

    <!-- 評分區域 -->
    <view class="rating-section">
      <view class="section-title">商品評分</view>
      <view class="rating-stars">
        <text v-for="n in 5" :key="n"
              :class="['star', { active: n <= rating }]"
              @tap="setRating(n)">
          {{ n <= rating ? '★' : '☆' }}
        </text>
      </view>
      <text class="rating-text">{{ getRatingText() }}</text>
    </view>

    <!-- 評價內容 -->
    <view class="content-section">
      <view class="section-title">
        <text>評價內容</text>
        <text class="char-count">{{ reviewContent.length }}/500</text>
      </view>
      <textarea class="review-textarea" v-model="reviewContent" 
                placeholder="說說您的使用感受吧，幫助其他買家做出選擇~" 
                maxlength="500" :show-confirm-bar="false" />
    </view>

    <!-- 圖片上傳 -->
    <view class="image-section">
      <view class="section-title">上傳圖片（選填）</view>
      <view class="image-upload">
        <view v-for="(img, index) in reviewImages" :key="index" class="image-item">
          <image :src="img" mode="aspectFill" @tap="previewImage(index)" />
          <text class="delete-icon" @tap="deleteImage(index)">✕</text>
        </view>
        <view v-if="reviewImages.length < 9" class="upload-btn" @tap="chooseImage">
          <text class="upload-icon">+</text>
          <text class="upload-text">添加圖片</text>
          <text class="upload-count">{{ reviewImages.length }}/9</text>
        </view>
      </view>
    </view>

    <!-- 匿名評價 -->
    <view class="anonymous-section">
      <view class="anonymous-item">
        <text class="anonymous-label">匿名評價</text>
        <switch :checked="isAnonymous" @change="toggleAnonymous" color="#2F7CF6" />
      </view>
      <text class="anonymous-desc">開啟後，評價將不顯示您的用戶名和頭像</text>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="submit-btn" @tap="submitReview">提交評價</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app';
import { showToast } from '@/utils/common.js';

const orderId = ref(null);
const orderType = ref(null);
const productInfo = ref({});
const rating = ref(5);
const reviewContent = ref('');
const reviewImages = ref([]);
const isAnonymous = ref(false);

onLoad((options) => {
  orderId.value = options.orderId;
  orderType.value = options.orderType;
  loadProductInfo();
});

const loadProductInfo = () => {
  // 模擬數據
  productInfo.value = {
    productId: 1,
    name: '高端商務筆記本電腦 15.6英寸',
    spec: '銀色 | 16GB+512GB',
    image: 'https://via.placeholder.com/200'
  };
};

const setRating = (value) => {
  rating.value = value;
};

const getRatingText = () => {
  const texts = {
    1: '非常不滿意',
    2: '不滿意',
    3: '一般',
    4: '滿意',
    5: '非常滿意'
  };
  return texts[rating.value] || '';
};

const chooseImage = () => {
  const maxCount = 9 - reviewImages.value.length;
  
  uni.chooseImage({
    count: maxCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      reviewImages.value = [...reviewImages.value, ...res.tempFilePaths];
    }
  });
};

const previewImage = (index) => {
  uni.previewImage({
    urls: reviewImages.value,
    current: index
  });
};

const deleteImage = (index) => {
  reviewImages.value.splice(index, 1);
};

const toggleAnonymous = (e) => {
  isAnonymous.value = e.detail.value;
};

const submitReview = () => {
  if (!reviewContent.value.trim()) {
    showToast('請填寫評價內容', 'none');
    return;
  }

  if (reviewContent.value.trim().length < 10) {
    showToast('評價內容至少10個字符', 'none');
    return;
  }

  showToast('正在提交...', 'loading');

  // 模擬提交
  setTimeout(() => {
    showToast('評價成功', 'success');
    
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  }, 1500);
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.review-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 商品信息 */
.product-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
}

.product-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: $radius-md;
  margin-right: $spacing-md;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: $font-md;
  color: $text-primary;
  margin-bottom: $spacing-xs;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-spec {
  font-size: $font-sm;
  color: $text-secondary;
}

/* 評分區域 */
.rating-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: $font-sm;
  color: $text-disabled;
  font-weight: normal;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
}

.star {
  font-size: 60rpx;
  color: $border-color;
  transition: all 0.3s ease;
  
  &.active {
    color: #FAAD14;
  }
}

.rating-text {
  display: block;
  text-align: center;
  font-size: $font-md;
  color: $text-secondary;
}

/* 評價內容 */
.content-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.review-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
}

/* 圖片上傳 */
.image-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.image-upload {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.image-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: $radius-md;
  overflow: hidden;
}

.image-item image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.delete-icon {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.6);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-lg;
}

.upload-btn {
  width: 100%;
  padding-bottom: 100%;
  background-color: $bg-page;
  border-radius: $radius-md;
  border: 2rpx dashed $border-color;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%);
  font-size: 60rpx;
  color: $text-disabled;
}

.upload-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 20%);
  font-size: $font-sm;
  color: $text-disabled;
}

.upload-count {
  position: absolute;
  bottom: 16rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: $font-sm;
  color: $text-disabled;
}

/* 匿名評價 */
.anonymous-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.anonymous-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.anonymous-label {
  font-size: $font-md;
  color: $text-primary;
}

.anonymous-desc {
  font-size: $font-sm;
  color: $text-secondary;
  line-height: 1.5;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $bg-card;
  padding: $spacing-md;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: $primary-color;
  color: #FFFFFF;
  border-radius: $radius-md;
  font-size: $font-md;
  border: none;
}
</style>

