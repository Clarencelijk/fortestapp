<template>
  <view class="aftersales-page">
    <!-- 訂單信息 -->
    <view class="order-section">
      <view class="section-title">訂單信息</view>
      <view class="order-card">
        <image class="product-image" :src="orderInfo.productImage" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ orderInfo.productName }}</text>
          <text class="order-no">訂單編號：{{ orderInfo.orderNo }}</text>
          <text class="order-amount">¥{{ orderInfo.orderAmount.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 售後類型 -->
    <view class="type-section">
      <view class="section-title">售後類型</view>
      <view class="type-grid">
        <view v-for="type in aftersaleTypes" :key="type.value"
              :class="['type-item', { active: formData.aftersaleType === type.value }]"
              @tap="selectType(type.value)">
          <text class="type-icon">{{ type.icon }}</text>
          <text class="type-name">{{ type.name }}</text>
        </view>
      </view>
    </view>

    <!-- 售後原因 -->
    <view class="reason-section">
      <view class="section-title">售後原因</view>
      <view class="reason-list">
        <view v-for="(reason, index) in reasonList" :key="index"
              :class="['reason-item', { active: formData.aftersaleReason === reason }]"
              @tap="selectReason(reason)">
          <text class="reason-text">{{ reason }}</text>
          <text v-if="formData.aftersaleReason === reason" class="check-icon">✓</text>
        </view>
      </view>
    </view>

    <!-- 問題描述 -->
    <view class="description-section">
      <view class="section-title">
        <text>問題描述</text>
        <text class="char-count">{{ formData.aftersaleDescription.length }}/500</text>
      </view>
      <textarea class="description-textarea" v-model="formData.aftersaleDescription" 
                placeholder="請詳細描述您遇到的問題，以便我們更好地為您服務" 
                maxlength="500" :show-confirm-bar="false" />
    </view>

    <!-- 憑證上傳 -->
    <view class="evidence-section">
      <view class="section-title">上傳憑證（選填）</view>
      <view class="image-upload">
        <view v-for="(img, index) in formData.evidenceImages" :key="index" class="image-item">
          <image :src="img" mode="aspectFill" @tap="previewImage(index)" />
          <text class="delete-icon" @tap="deleteImage(index)">✕</text>
        </view>
        <view v-if="formData.evidenceImages.length < 9" class="upload-btn" @tap="chooseImage">
          <text class="upload-icon">+</text>
          <text class="upload-text">添加圖片</text>
          <text class="upload-count">{{ formData.evidenceImages.length }}/9</text>
        </view>
      </view>
    </view>

    <!-- 退款金額 -->
    <view v-if="formData.aftersaleType === 1 || formData.aftersaleType === 2" class="refund-section">
      <view class="section-title">退款金額</view>
      <view class="refund-card">
        <text class="refund-label">退款金額</text>
        <view class="refund-amount">
          <text class="currency">¥</text>
          <input class="amount-input" v-model="formData.refundAmount" 
                 type="digit" placeholder="0.00" />
        </view>
      </view>
      <text class="refund-tip">最多可退 ¥{{ orderInfo.orderAmount.toFixed(2) }}</text>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="submit-btn" @tap="submitAftersales">提交申請</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app';
import { showToast } from '@/utils/common.js';

const orderId = ref(null);
const orderType = ref(null);
const orderInfo = ref({});

const formData = ref({
  aftersaleType: 1,
  aftersaleReason: '',
  aftersaleDescription: '',
  evidenceImages: [],
  refundAmount: ''
});

const aftersaleTypes = [
  { value: 1, name: '僅退款', icon: '💰' },
  { value: 2, name: '退貨退款', icon: '📦' },
  { value: 3, name: '換貨', icon: '🔄' },
  { value: 4, name: '維修', icon: '🔧' }
];

const reasonList = ref([]);

onLoad((options) => {
  orderId.value = options.orderId;
  orderType.value = options.orderType;
  loadOrderInfo();
  loadReasonList();
});

const loadOrderInfo = () => {
  // 模擬數據
  orderInfo.value = {
    orderNo: 'MC202510220001',
    productName: '高端商務筆記本電腦 15.6英寸',
    productImage: 'https://via.placeholder.com/200',
    orderAmount: 15999.00
  };
  
  formData.value.refundAmount = orderInfo.value.orderAmount.toFixed(2);
};

const loadReasonList = () => {
  reasonList.value = [
    '商品質量問題',
    '商品與描述不符',
    '收到商品破損',
    '商品缺件/少件',
    '商品過期/臨期',
    '不想要了',
    '其他原因'
  ];
};

const selectType = (value) => {
  formData.value.aftersaleType = value;
};

const selectReason = (reason) => {
  formData.value.aftersaleReason = reason;
};

const chooseImage = () => {
  const maxCount = 9 - formData.value.evidenceImages.length;
  
  uni.chooseImage({
    count: maxCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.evidenceImages = [...formData.value.evidenceImages, ...res.tempFilePaths];
    }
  });
};

const previewImage = (index) => {
  uni.previewImage({
    urls: formData.value.evidenceImages,
    current: index
  });
};

const deleteImage = (index) => {
  formData.value.evidenceImages.splice(index, 1);
};

const submitAftersales = () => {
  if (!formData.value.aftersaleReason) {
    showToast('請選擇售後原因', 'none');
    return;
  }

  if (!formData.value.aftersaleDescription.trim()) {
    showToast('請填寫問題描述', 'none');
    return;
  }

  if (formData.value.aftersaleDescription.trim().length < 10) {
    showToast('問題描述至少10個字符', 'none');
    return;
  }

  if ((formData.value.aftersaleType === 1 || formData.value.aftersaleType === 2) && !formData.value.refundAmount) {
    showToast('請輸入退款金額', 'none');
    return;
  }

  showToast('正在提交...', 'loading');

  // 模擬提交
  setTimeout(() => {
    showToast('申請成功', 'success');
    
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  }, 1500);
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.aftersales-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 訂單信息 */
.order-section {
  padding: $spacing-md;
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

.order-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
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
  justify-content: space-between;
}

.product-name {
  font-size: $font-md;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.order-no {
  font-size: $font-sm;
  color: $text-secondary;
}

.order-amount {
  font-size: $font-lg;
  font-weight: bold;
  color: $danger-color;
}

/* 售後類型 */
.type-section {
  padding: 0 $spacing-md $spacing-md;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
}

.type-item {
  background-color: $bg-card;
  border-radius: $radius-md;
  padding: $spacing-lg $spacing-sm;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  
  &.active {
    border-color: $primary-color;
    background-color: rgba(47, 124, 246, 0.05);
  }
}

.type-icon {
  font-size: 40rpx;
  margin-bottom: $spacing-sm;
}

.type-name {
  font-size: $font-sm;
  color: $text-primary;
}

/* 售後原因 */
.reason-section {
  padding: 0 $spacing-md $spacing-md;
}

.reason-list {
  background-color: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
}

.reason-item {
  padding: $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid $border-color;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    background-color: rgba(47, 124, 246, 0.05);
    
    .reason-text {
      color: $primary-color;
      font-weight: bold;
    }
  }
}

.reason-text {
  font-size: $font-md;
  color: $text-primary;
}

.check-icon {
  font-size: $font-lg;
  color: $primary-color;
}

/* 問題描述 */
.description-section {
  padding: 0 $spacing-md $spacing-md;
}

.description-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: $spacing-md;
  background-color: $bg-card;
  border-radius: $radius-lg;
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
}

/* 憑證上傳 */
.evidence-section {
  padding: 0 $spacing-md $spacing-md;
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
  background-color: $bg-card;
  border-radius: $radius-md;
  border: 2rpx dashed $border-color;
  position: relative;
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

/* 退款金額 */
.refund-section {
  padding: 0 $spacing-md $spacing-md;
}

.refund-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.refund-label {
  font-size: $font-md;
  color: $text-primary;
}

.refund-amount {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: $font-lg;
  color: $danger-color;
  margin-right: $spacing-xs;
}

.amount-input {
  font-size: $font-xl;
  font-weight: bold;
  color: $danger-color;
  text-align: right;
  width: 200rpx;
}

.refund-tip {
  font-size: $font-sm;
  color: $text-secondary;
  padding-left: $spacing-md;
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

