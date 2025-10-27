<template>
  <view class="logistics-page">
    <!-- 物流公司信息 -->
    <view class="logistics-header">
      <view class="company-info">
        <text class="company-name">{{ logisticsInfo.company }}</text>
        <text class="tracking-number">{{ logisticsInfo.trackingNumber }}</text>
      </view>
      <view class="status-badge" :class="getStatusClass()">
        {{ getStatusText() }}
      </view>
    </view>

    <!-- 物流進度 -->
    <view class="progress-section">
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: getProgressWidth() }"></view>
      </view>
      <view class="progress-steps">
        <view v-for="(step, index) in progressSteps" :key="index" 
              :class="['step-item', { active: step.active, completed: step.completed }]">
          <view class="step-icon">
            <text v-if="step.completed">✓</text>
            <text v-else>{{ index + 1 }}</text>
          </view>
          <text class="step-label">{{ step.label }}</text>
        </view>
      </view>
    </view>

    <!-- 物流軌跡 -->
    <view class="trace-section">
      <view class="section-title">物流軌跡</view>
      <view class="trace-list">
        <view v-for="(trace, index) in traceList" :key="index" 
              :class="['trace-item', { first: index === 0 }]">
          <view class="trace-timeline">
            <view class="trace-dot"></view>
            <view v-if="index < traceList.length - 1" class="trace-line"></view>
          </view>
          <view class="trace-content">
            <view class="trace-time">{{ trace.time }}</view>
            <view class="trace-desc">{{ trace.description }}</view>
            <view v-if="trace.location" class="trace-location">
              <text class="location-icon">📍</text>
              <text>{{ trace.location }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 收發貨信息 -->
    <view class="address-section">
      <view class="address-card">
        <view class="address-header">
          <text class="address-icon">📤</text>
          <text class="address-title">發貨信息</text>
        </view>
        <view class="address-content">
          <text class="address-name">{{ logisticsInfo.sender.name }}</text>
          <text class="address-phone">{{ logisticsInfo.sender.phone }}</text>
          <text class="address-detail">{{ logisticsInfo.sender.address }}</text>
        </view>
      </view>

      <view class="address-card">
        <view class="address-header">
          <text class="address-icon">📥</text>
          <text class="address-title">收貨信息</text>
        </view>
        <view class="address-content">
          <text class="address-name">{{ logisticsInfo.receiver.name }}</text>
          <text class="address-phone">{{ logisticsInfo.receiver.phone }}</text>
          <text class="address-detail">{{ logisticsInfo.receiver.address }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @tap="copyTrackingNumber">複製單號</button>
      <button class="action-btn secondary" @tap="callPhone">聯繫快遞</button>
      <button class="action-btn primary" @tap="backToOrder">返回訂單</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onLoad } from '@dcloudio/uni-app';
import { showToast } from '@/utils/common.js';

const logisticsInfo = ref({});
const traceList = ref([]);

const progressSteps = computed(() => {
  const status = logisticsInfo.value.status || 1;
  return [
    { label: '待發貨', active: status >= 1, completed: status > 1 },
    { label: '已發貨', active: status >= 2, completed: status > 2 },
    { label: '運輸中', active: status >= 3, completed: status > 3 },
    { label: '派送中', active: status >= 4, completed: status > 4 },
    { label: '已簽收', active: status >= 5, completed: status >= 5 }
  ];
});

onLoad((options) => {
  const orderId = options.orderId;
  loadLogisticsInfo(orderId);
});

const loadLogisticsInfo = (orderId) => {
  // 模擬數據
  logisticsInfo.value = {
    company: '順豐速運',
    trackingNumber: 'SF1234567890123',
    status: 3, // 1待發貨，2已發貨，3運輸中，4派送中，5已簽收
    sender: {
      name: '深圳旗艦店',
      phone: '0755-12345678',
      address: '廣東省深圳市南山區科技園南區深圳灣科技生態園'
    },
    receiver: {
      name: '張三',
      phone: '138****8888',
      address: '廣東省深圳市福田區華強北路1001號'
    }
  };

  traceList.value = [
    {
      time: '2025-10-22 10:30:25',
      description: '快件已到達【深圳福田華強北營業點】，正在派送中',
      location: '深圳市福田區'
    },
    {
      time: '2025-10-22 08:15:10',
      description: '快件已到達【深圳福田集散中心】',
      location: '深圳市福田區'
    },
    {
      time: '2025-10-22 03:20:45',
      description: '快件在【深圳轉運中心】完成分揀，準備發往下一站',
      location: '深圳市'
    },
    {
      time: '2025-10-21 22:10:30',
      description: '快件已到達【深圳轉運中心】',
      location: '深圳市'
    },
    {
      time: '2025-10-21 20:05:15',
      description: '快件已從【深圳南山集散中心】發出',
      location: '深圳市南山區'
    },
    {
      time: '2025-10-21 18:30:00',
      description: '快件已到達【深圳南山集散中心】',
      location: '深圳市南山區'
    },
    {
      time: '2025-10-21 16:00:00',
      description: '【深圳旗艦店】已發貨，快遞員：李師傅，電話：138****1234',
      location: '深圳市南山區'
    },
    {
      time: '2025-10-21 15:30:00',
      description: '商家正在準備發貨',
      location: ''
    }
  ];
};

const getStatusText = () => {
  const texts = {
    1: '待發貨',
    2: '已發貨',
    3: '運輸中',
    4: '派送中',
    5: '已簽收'
  };
  return texts[logisticsInfo.value.status] || '未知';
};

const getStatusClass = () => {
  const classes = {
    1: 'pending',
    2: 'shipped',
    3: 'transit',
    4: 'delivering',
    5: 'delivered'
  };
  return classes[logisticsInfo.value.status] || '';
};

const getProgressWidth = () => {
  const status = logisticsInfo.value.status || 1;
  return `${(status - 1) * 25}%`;
};

const copyTrackingNumber = () => {
  uni.setClipboardData({
    data: logisticsInfo.value.trackingNumber,
    success: () => {
      showToast('單號已複製', 'success');
    }
  });
};

const callPhone = () => {
  uni.makePhoneCall({
    phoneNumber: '95338' // 順豐客服
  });
};

const backToOrder = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.logistics-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 物流公司信息 */
.logistics-header {
  background: linear-gradient(135deg, $primary-color 0%, #1890FF 100%);
  padding: $spacing-xl;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: $font-xl;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: $spacing-xs;
}

.tracking-number {
  font-size: $font-md;
  color: rgba(255, 255, 255, 0.9);
}

.status-badge {
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: $font-sm;
  font-weight: bold;
  
  &.pending { background-color: #FFE58F; color: #D48806; }
  &.shipped { background-color: #B7EB8F; color: #389E0D; }
  &.transit { background-color: #91D5FF; color: #096DD9; }
  &.delivering { background-color: #FFD591; color: #D46B08; }
  &.delivered { background-color: #95DE64; color: #237804; }
}

/* 物流進度 */
.progress-section {
  background-color: $bg-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-md;
}

.progress-bar {
  height: 8rpx;
  background-color: $border-color;
  border-radius: 4rpx;
  margin-bottom: $spacing-lg;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary-color 0%, $success-color 100%);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
}

.step-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: $bg-page;
  border: 4rpx solid $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-md;
  color: $text-disabled;
  margin-bottom: $spacing-sm;
  transition: all 0.3s ease;
}

.step-item.active .step-icon {
  border-color: $primary-color;
  color: $primary-color;
}

.step-item.completed .step-icon {
  background-color: $success-color;
  border-color: $success-color;
  color: #FFFFFF;
}

.step-label {
  font-size: $font-sm;
  color: $text-secondary;
  text-align: center;
}

.step-item.active .step-label {
  color: $primary-color;
  font-weight: bold;
}

/* 物流軌跡 */
.trace-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.trace-list {
  position: relative;
}

.trace-item {
  display: flex;
  padding-bottom: $spacing-lg;
  
  &.first .trace-content {
    .trace-time,
    .trace-desc {
      color: $primary-color;
      font-weight: bold;
    }
  }
}

.trace-timeline {
  width: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: $spacing-md;
}

.trace-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: $border-color;
  border: 4rpx solid $bg-card;
  box-shadow: 0 0 0 4rpx $border-color;
  flex-shrink: 0;
}

.trace-item.first .trace-dot {
  background-color: $primary-color;
  box-shadow: 0 0 0 4rpx rgba(47, 124, 246, 0.2);
}

.trace-line {
  flex: 1;
  width: 2rpx;
  background-color: $border-color;
  margin-top: 8rpx;
}

.trace-content {
  flex: 1;
  padding-bottom: $spacing-md;
}

.trace-time {
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}

.trace-desc {
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
  margin-bottom: $spacing-xs;
}

.trace-location {
  display: flex;
  align-items: center;
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
}

.location-icon {
  margin-right: $spacing-xs;
}

/* 收發貨信息 */
.address-section {
  padding: 0 $spacing-md;
  margin-bottom: $spacing-md;
}

.address-card {
  background-color: $bg-card;
  padding: $spacing-lg;
  border-radius: $radius-lg;
  margin-bottom: $spacing-md;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1rpx solid $border-color;
}

.address-icon {
  font-size: $font-xl;
  margin-right: $spacing-sm;
}

.address-title {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
}

.address-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.address-name {
  font-size: $font-md;
  font-weight: bold;
  color: $text-primary;
}

.address-phone {
  font-size: $font-md;
  color: $text-secondary;
}

.address-detail {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.6;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $bg-card;
  padding: $spacing-md;
  display: flex;
  gap: $spacing-md;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.action-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: $radius-md;
  font-size: $font-md;
  border: none;
  
  &.primary {
    background-color: $primary-color;
    color: #FFFFFF;
  }
  
  &.secondary {
    background-color: transparent;
    color: $text-primary;
    border: 2rpx solid $border-color;
  }
}
</style>

