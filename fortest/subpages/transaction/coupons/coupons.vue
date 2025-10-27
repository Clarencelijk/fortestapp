<template>
  <view class="coupons-page">
    <!-- 頂部標籤 -->
    <view class="status-tabs">
      <text 
        v-for="tab in statusTabs" 
        :key="tab.id" 
        :class="['status-tab', { active: activeStatus === tab.id }]"
        @tap="switchStatus(tab.id)"
      >
        {{ tab.name }}
      </text>
    </view>

    <!-- 優惠券列表 -->
    <scroll-view class="coupons-list" scroll-y @scrolltolower="loadMore">
      <view 
        v-for="coupon in couponsList" 
        :key="coupon.id" 
        :class="['coupon-card', coupon.status]"
      >
        <view class="coupon-left">
          <view class="coupon-amount">
            <text class="amount-symbol">¥</text>
            <text class="amount-value">{{ coupon.amount }}</text>
          </view>
          <text class="coupon-condition">滿{{ coupon.minAmount }}可用</text>
        </view>

        <view class="coupon-right">
          <text class="coupon-name">{{ coupon.name }}</text>
          <text class="coupon-desc">{{ coupon.desc }}</text>
          <text class="coupon-time">{{ coupon.validTime }}</text>
          
          <button 
            v-if="coupon.status === 'available'" 
            class="use-button"
            @tap="handleUse(coupon)"
          >
            立即使用
          </button>
          <text v-else-if="coupon.status === 'used'" class="status-text">已使用</text>
          <text v-else-if="coupon.status === 'expired'" class="status-text">已過期</text>
        </view>

        <!-- 裝飾圓點 -->
        <view class="dot-top"></view>
        <view class="dot-bottom"></view>
      </view>

      <!-- 空狀態 -->
      <view v-if="couponsList.length === 0" class="empty-state">
        <text class="empty-icon">🎫</text>
        <text class="empty-text">暫無優惠券</text>
        <text class="empty-hint">快去領取優惠券吧</text>
        <button class="get-button" @tap="handleGetCoupons">領取優惠券</button>
      </view>

      <!-- 加載更多 -->
      <view v-if="hasMore && couponsList.length > 0" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatDate, showToast } from '@/utils/common.js';

// 狀態標籤
const statusTabs = ref([
  { id: 'available', name: '可使用' },
  { id: 'used', name: '已使用' },
  { id: 'expired', name: '已過期' }
]);

const activeStatus = ref('available');

// 優惠券列表
const couponsList = ref([]);
const hasMore = ref(true);

// 模擬優惠券數據
const mockCoupons = () => {
  const coupons = [];
  const names = [
    '新人專享券',
    '滿減優惠券',
    '會員專屬券',
    '限時特惠券',
    '生日禮券'
  ];
  const descs = [
    '全場通用',
    '指定商品可用',
    '會員專享',
    '限時優惠',
    '生日特權'
  ];
  const statuses = ['available', 'available', 'used', 'expired'];

  for (let i = 0; i < 15; i++) {
    const validDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    coupons.push({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      desc: descs[Math.floor(Math.random() * descs.length)],
      amount: [5, 10, 20, 50, 100][Math.floor(Math.random() * 5)],
      minAmount: [50, 100, 200, 500, 1000][Math.floor(Math.random() * 5)],
      validTime: `有效期至 ${formatDate(validDate, 'YYYY-MM-DD')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  couponsList.value = coupons;
};

// 切換狀態
const switchStatus = (statusId) => {
  activeStatus.value = statusId;
  showToast(`切換到${statusTabs.value.find(t => t.id === statusId).name}`, 'none');
};

// 加載更多
const loadMore = () => {
  if (!hasMore.value) return;
  setTimeout(() => {
    hasMore.value = false;
  }, 1000);
};

// 使用優惠券
const handleUse = (coupon) => {
  showToast('跳轉到商城', 'none');
};

// 領取優惠券
const handleGetCoupons = () => {
  showToast('領取優惠券功能開發中', 'none');
};

onMounted(() => {
  mockCoupons();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.coupons-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 狀態標籤 */
.status-tabs {
  display: flex;
  padding: $spacing-md $spacing-lg;
  background-color: $bg-card;
  box-shadow: $shadow-sm;
}

.status-tab {
  flex: 1;
  text-align: center;
  padding: $spacing-sm 0;
  font-size: $font-md;
  color: $text-secondary;
  position: relative;
  
  &.active {
    color: $primary-color;
    font-weight: $font-bold;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -12rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background-color: $primary-color;
      border-radius: $radius-sm;
    }
  }
}

/* 優惠券列表 */
.coupons-list {
  height: calc(100vh - 120rpx);
  padding: $spacing-md;
}

.coupon-card {
  position: relative;
  display: flex;
  height: 200rpx;
  background-color: $bg-card;
  border-radius: $radius-lg;
  margin-bottom: $spacing-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  
  &.used,
  &.expired {
    opacity: 0.5;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 240rpx;
    top: 0;
    bottom: 0;
    width: 2rpx;
    background-image: linear-gradient(to bottom, $border-light 50%, transparent 50%);
    background-size: 2rpx 16rpx;
  }
}

.coupon-left {
  width: 240rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $accent-color 0%, $error-color 100%);
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  margin-bottom: $spacing-xs;
}

.amount-symbol {
  font-size: $font-lg;
  color: $text-white;
  font-weight: $font-bold;
}

.amount-value {
  font-size: 64rpx;
  color: $text-white;
  font-weight: $font-bold;
  line-height: 1;
}

.coupon-condition {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.9);
}

.coupon-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: $spacing-md $spacing-lg;
}

.coupon-name {
  font-size: $font-lg;
  color: $text-primary;
  font-weight: $font-bold;
  margin-bottom: $spacing-xs;
}

.coupon-desc {
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}

.coupon-time {
  font-size: $font-xs;
  color: $text-tertiary;
  margin-bottom: $spacing-md;
}

.use-button {
  align-self: flex-start;
  padding: $spacing-xs $spacing-xl;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-sm;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}

.status-text {
  font-size: $font-sm;
  color: $text-tertiary;
}

/* 裝飾圓點 */
.dot-top,
.dot-bottom {
  position: absolute;
  left: 232rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: $bg-page;
  border-radius: $radius-round;
}

.dot-top {
  top: -8rpx;
}

.dot-bottom {
  bottom: -8rpx;
}

/* 空狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xxl 0;
  min-height: 400rpx;
  justify-content: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: $spacing-lg;
}

.empty-text {
  font-size: $font-lg;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.empty-hint {
  font-size: $font-sm;
  color: $text-tertiary;
  margin-bottom: $spacing-xl;
}

.get-button {
  padding: $spacing-md $spacing-xxl;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-md;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}

/* 加載更多 */
.loading-more {
  text-align: center;
  padding: $spacing-lg 0;
}

.loading-text {
  font-size: $font-sm;
  color: $text-tertiary;
}
</style>

