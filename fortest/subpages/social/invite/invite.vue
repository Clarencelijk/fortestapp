<template>
  <view class="invite-page">
    <!-- 頂部背景 -->
    <view class="invite-header">
      <text class="header-title">邀請好友</text>
      <text class="header-subtitle">邀請好友註冊，雙方都能獲得獎勵</text>
      
      <!-- 邀請碼 -->
      <view class="invite-code-card">
        <text class="code-label">我的邀請碼</text>
        <text class="code-value">{{ inviteCode }}</text>
        <button class="copy-button" @tap="handleCopy">複製邀請碼</button>
      </view>
    </view>

    <!-- 獎勵說明 -->
    <view class="reward-section">
      <text class="section-title">邀請獎勵</text>
      <view class="reward-cards">
        <view class="reward-card">
          <text class="reward-icon">🎁</text>
          <text class="reward-title">邀請好友</text>
          <text class="reward-desc">好友註冊成功</text>
          <text class="reward-value">+50積分</text>
        </view>
        <view class="reward-card">
          <text class="reward-icon">💰</text>
          <text class="reward-title">好友消費</text>
          <text class="reward-desc">好友首次消費</text>
          <text class="reward-value">+10元優惠券</text>
        </view>
        <view class="reward-card">
          <text class="reward-icon">👑</text>
          <text class="reward-title">累計獎勵</text>
          <text class="reward-desc">邀請滿10人</text>
          <text class="reward-value">升級VIP</text>
        </view>
      </view>
    </view>

    <!-- 邀請統計 -->
    <view class="stats-section">
      <text class="section-title">邀請統計</text>
      <view class="stats-cards">
        <view class="stat-card">
          <text class="stat-value">{{ stats.total }}</text>
          <text class="stat-label">累計邀請</text>
        </view>
        <view class="stat-card">
          <text class="stat-value">{{ stats.success }}</text>
          <text class="stat-label">註冊成功</text>
        </view>
        <view class="stat-card">
          <text class="stat-value">{{ stats.reward }}</text>
          <text class="stat-label">獲得積分</text>
        </view>
      </view>
    </view>

    <!-- 邀請記錄 -->
    <view class="record-section">
      <view class="section-header">
        <text class="section-title">邀請記錄</text>
        <text class="more-button" @tap="handleMoreRecord">查看全部 ></text>
      </view>
      
      <view class="record-list">
        <view v-for="record in recordList" :key="record.id" class="record-item">
          <image class="record-avatar" :src="record.avatar" mode="aspectFill" />
          <view class="record-info">
            <text class="record-name">{{ record.name }}</text>
            <text class="record-time">{{ record.time }}</text>
          </view>
          <text :class="['record-status', record.status]">
            {{ getStatusText(record.status) }}
          </text>
        </view>
      </view>
    </view>

    <!-- 底部分享按鈕 -->
    <view class="bottom-actions">
      <button class="share-button" @tap="handleShare">
        <text class="button-icon">📤</text>
        <text class="button-text">分享邀請鏈接</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatRelativeTime, showToast } from '@/utils/common.js';

// 邀請碼
const inviteCode = ref('ABC12345');

// 統計數據
const stats = ref({
  total: 28,
  success: 23,
  reward: 1150
});

// 邀請記錄
const recordList = ref([]);

const getStatusText = (status) => {
  switch (status) {
    case 'registered': return '已註冊';
    case 'purchased': return '已消費';
    case 'pending': return '待註冊';
    default: return '';
  }
};

// 模擬邀請記錄
const mockRecords = () => {
  const records = [];
  const names = ['小明', '小紅', '張三', '李四', '王五'];
  const statuses = ['registered', 'purchased', 'pending'];

  for (let i = 0; i < 5; i++) {
    records.push({
      id: i + 1,
      name: names[i],
      avatar: `https://picsum.photos/80/80?random=${i + 600}`,
      time: formatRelativeTime(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  recordList.value = records;
};

// 複製邀請碼
const handleCopy = () => {
  uni.setClipboardData({
    data: inviteCode.value,
    success: () => {
      showToast('邀請碼已複製', 'success');
    }
  });
};

// 分享
const handleShare = () => {
  uni.showActionSheet({
    itemList: ['分享到微信', '分享到朋友圈', '生成海報'],
    success: (res) => {
      showToast(`選擇了第 ${res.tapIndex + 1} 個選項`, 'none');
    }
  });
};

// 查看更多記錄
const handleMoreRecord = () => {
  showToast('查看全部記錄', 'none');
};

onMounted(() => {
  mockRecords();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.invite-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 160rpx;
}

/* 頂部背景 */
.invite-header {
  background: linear-gradient(135deg, $accent-color 0%, $error-color 100%);
  padding: $spacing-xxl $spacing-lg;
  text-align: center;
  margin-bottom: $spacing-lg;
}

.header-title {
  display: block;
  font-size: $font-xxl;
  color: $text-white;
  font-weight: $font-bold;
  margin-bottom: $spacing-sm;
}

.header-subtitle {
  display: block;
  font-size: $font-md;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: $spacing-xl;
}

.invite-code-card {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: $radius-xl;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.code-label {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.9);
}

.code-value {
  font-size: 64rpx;
  color: $text-white;
  font-weight: $font-bold;
  letter-spacing: 8rpx;
}

.copy-button {
  padding: $spacing-sm $spacing-xxl;
  background-color: $text-white;
  color: $accent-color;
  font-size: $font-md;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}

/* 獎勵說明 */
.reward-section,
.stats-section,
.record-section {
  padding: $spacing-lg;
}

.section-title {
  font-size: $font-xl;
  color: $text-primary;
  font-weight: $font-bold;
  margin-bottom: $spacing-lg;
  display: block;
}

.reward-cards {
  display: flex;
  gap: $spacing-md;
}

.reward-card {
  flex: 1;
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  box-shadow: $shadow-sm;
}

.reward-icon {
  font-size: 64rpx;
}

.reward-title {
  font-size: $font-md;
  color: $text-primary;
  font-weight: $font-bold;
}

.reward-desc {
  font-size: $font-xs;
  color: $text-tertiary;
}

.reward-value {
  font-size: $font-lg;
  color: $primary-color;
  font-weight: $font-bold;
}

/* 統計卡片 */
.stats-cards {
  display: flex;
  gap: $spacing-md;
}

.stat-card {
  flex: 1;
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  box-shadow: $shadow-sm;
}

.stat-value {
  font-size: 48rpx;
  color: $primary-color;
  font-weight: $font-bold;
}

.stat-label {
  font-size: $font-sm;
  color: $text-tertiary;
}

/* 邀請記錄 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.more-button {
  font-size: $font-sm;
  color: $text-tertiary;
}

.record-list {
  background-color: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.record-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-bottom: 1rpx solid $border-light;
  
  &:last-child {
    border-bottom: none;
  }
}

.record-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-round;
  flex-shrink: 0;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.record-name {
  font-size: $font-md;
  color: $text-primary;
  font-weight: $font-medium;
}

.record-time {
  font-size: $font-xs;
  color: $text-tertiary;
}

.record-status {
  font-size: $font-sm;
  font-weight: $font-bold;
  
  &.registered {
    color: $success-color;
  }
  &.purchased {
    color: $primary-color;
  }
  &.pending {
    color: $text-tertiary;
  }
}

/* 底部按鈕 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-lg;
  background-color: $bg-card;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.share-button {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
}

.button-icon {
  font-size: $font-xl;
}

.button-text {
  font-size: $font-lg;
  color: $text-white;
  font-weight: $font-bold;
}
</style>

