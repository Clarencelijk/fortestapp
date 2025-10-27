<template>
  <view class="aftersales-list-page">
    <!-- 狀態標籤 -->
    <view class="status-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view v-for="tab in statusTabs" :key="tab.value"
              :class="['tab-item', { active: currentStatus === tab.value }]"
              @tap="switchStatus(tab.value)">
          {{ tab.label }}
        </view>
      </scroll-view>
    </view>

    <!-- 售後列表 -->
    <scroll-view scroll-y class="aftersales-list" @scrolltolower="loadMore">
      <view v-for="item in aftersalesList" :key="item.aftersaleId"
            class="aftersales-item" @tap="viewDetail(item)">
        <view class="item-header">
          <text class="aftersale-no">售後單號：{{ item.aftersaleNo }}</text>
          <view class="status-badge" :class="getStatusClass(item.aftersaleStatus)">
            {{ getStatusText(item.aftersaleStatus) }}
          </view>
        </view>

        <view class="item-content">
          <image class="product-image" :src="item.productImage" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ item.productName }}</text>
            <text class="aftersale-type">{{ getTypeText(item.aftersaleType) }}</text>
            <text v-if="item.refundAmount" class="refund-amount">
              退款金額：¥{{ item.refundAmount.toFixed(2) }}
            </text>
          </view>
        </view>

        <view class="item-footer">
          <text class="create-time">{{ item.createdAt }}</text>
          <view class="footer-actions">
            <button v-if="item.aftersaleStatus === 1" class="action-btn" @tap.stop="cancelAftersales(item)">
              撤銷申請
            </button>
            <button class="action-btn primary" @tap.stop="viewDetail(item)">
              查看詳情
            </button>
          </view>
        </view>
      </view>

      <!-- 加載狀態 -->
      <view v-if="loading" class="loading-state">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加載中...</text>
      </view>

      <!-- 空狀態 -->
      <view v-if="!loading && aftersalesList.length === 0" class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暫無售後記錄</text>
        <text class="empty-desc">您還沒有申請過售後服務</text>
      </view>

      <!-- 沒有更多 -->
      <view v-if="!loading && aftersalesList.length > 0 && noMore" class="no-more">
        <text>沒有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app';
import { showToast, showConfirm } from '@/utils/common.js';

const currentStatus = ref(0);
const aftersalesList = ref([]);
const loading = ref(false);
const noMore = ref(false);

const statusTabs = [
  { value: 0, label: '全部' },
  { value: 1, label: '待審核' },
  { value: 2, label: '已同意' },
  { value: 3, label: '已拒絕' },
  { value: 4, label: '處理中' },
  { value: 5, label: '已完成' }
];

onLoad(() => {
  loadAftersalesList();
});

const loadAftersalesList = () => {
  loading.value = true;

  // 模擬數據
  setTimeout(() => {
    aftersalesList.value = [
      {
        aftersaleId: 1,
        aftersaleNo: 'AS202510220001',
        orderNo: 'MC202510220001',
        productName: '高端商務筆記本電腦 15.6英寸',
        productImage: 'https://via.placeholder.com/200',
        aftersaleType: 1,
        aftersaleStatus: 1,
        refundAmount: 15999.00,
        createdAt: '2025-10-22 15:30:00'
      },
      {
        aftersaleId: 2,
        aftersaleNo: 'AS202510210001',
        orderNo: 'MC202510210001',
        productName: '無線藍牙耳機 降噪版',
        productImage: 'https://via.placeholder.com/200',
        aftersaleType: 2,
        aftersaleStatus: 2,
        refundAmount: 599.00,
        createdAt: '2025-10-21 10:20:00'
      },
      {
        aftersaleId: 3,
        aftersaleNo: 'AS202510200001',
        orderNo: 'MC202510200001',
        productName: '智能手錶 運動版',
        productImage: 'https://via.placeholder.com/200',
        aftersaleType: 3,
        aftersaleStatus: 5,
        refundAmount: null,
        createdAt: '2025-10-20 14:15:00'
      }
    ];

    loading.value = false;
  }, 1000);
};

const switchStatus = (status) => {
  currentStatus.value = status;
  aftersalesList.value = [];
  noMore.value = false;
  loadAftersalesList();
};

const loadMore = () => {
  if (loading.value || noMore.value) return;
  
  // 加載更多數據
  noMore.value = true;
};

const getTypeText = (type) => {
  const types = {
    1: '僅退款',
    2: '退貨退款',
    3: '換貨',
    4: '維修'
  };
  return types[type] || '未知';
};

const getStatusText = (status) => {
  const texts = {
    1: '待審核',
    2: '已同意',
    3: '已拒絕',
    4: '處理中',
    5: '已完成'
  };
  return texts[status] || '未知';
};

const getStatusClass = (status) => {
  const classes = {
    1: 'pending',
    2: 'approved',
    3: 'rejected',
    4: 'processing',
    5: 'completed'
  };
  return classes[status] || '';
};

const viewDetail = (item) => {
  // 跳轉到售後詳情頁（待創建）
  showToast('售後詳情頁面待開發', 'none');
};

const cancelAftersales = (item) => {
  showConfirm('確定要撤銷此售後申請嗎？', '提示')
    .then(() => {
      showToast('正在撤銷...', 'loading');
      
      setTimeout(() => {
        showToast('撤銷成功', 'success');
        loadAftersalesList();
      }, 1000);
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.aftersales-list-page {
  min-height: 100vh;
  background-color: $bg-page;
  display: flex;
  flex-direction: column;
}

/* 狀態標籤 */
.status-tabs {
  background-color: $bg-card;
  border-bottom: 1rpx solid $border-color;
}

.tabs-scroll {
  white-space: nowrap;
  padding: $spacing-md 0;
}

.tab-item {
  display: inline-block;
  padding: $spacing-sm $spacing-lg;
  margin: 0 $spacing-sm;
  font-size: $font-md;
  color: $text-secondary;
  border-radius: $radius-md;
  transition: all 0.3s ease;
  
  &.active {
    background-color: rgba(47, 124, 246, 0.1);
    color: $primary-color;
    font-weight: bold;
  }
}

/* 售後列表 */
.aftersales-list {
  flex: 1;
  padding: $spacing-md;
}

.aftersales-item {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $spacing-md;
  border-bottom: 1rpx solid $border-color;
  margin-bottom: $spacing-md;
}

.aftersale-no {
  font-size: $font-sm;
  color: $text-secondary;
}

.status-badge {
  padding: 4rpx 12rpx;
  border-radius: $radius-sm;
  font-size: $font-sm;
  
  &.pending { background-color: rgba(250, 173, 20, 0.1); color: $warning-color; }
  &.approved { background-color: rgba(82, 196, 26, 0.1); color: $success-color; }
  &.rejected { background-color: rgba(245, 34, 45, 0.1); color: $danger-color; }
  &.processing { background-color: rgba(47, 124, 246, 0.1); color: $primary-color; }
  &.completed { background-color: rgba(0, 0, 0, 0.1); color: $text-secondary; }
}

.item-content {
  display: flex;
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

.aftersale-type {
  font-size: $font-sm;
  color: $text-secondary;
}

.refund-amount {
  font-size: $font-md;
  font-weight: bold;
  color: $danger-color;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: $spacing-md;
  border-top: 1rpx solid $border-color;
}

.create-time {
  font-size: $font-sm;
  color: $text-disabled;
}

.footer-actions {
  display: flex;
  gap: $spacing-md;
}

.action-btn {
  padding: 8rpx 24rpx;
  background-color: transparent;
  color: $text-primary;
  border: 2rpx solid $border-color;
  border-radius: $radius-md;
  font-size: $font-sm;
  
  &.primary {
    background-color: $primary-color;
    color: #FFFFFF;
    border-color: $primary-color;
  }
}

/* 加載狀態 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl 0;
}

.loading-icon {
  font-size: 60rpx;
  margin-bottom: $spacing-sm;
}

.loading-text {
  font-size: $font-sm;
  color: $text-secondary;
}

/* 空狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
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

.empty-desc {
  font-size: $font-sm;
  color: $text-disabled;
}

/* 沒有更多 */
.no-more {
  text-align: center;
  padding: $spacing-lg 0;
  font-size: $font-sm;
  color: $text-disabled;
}
</style>

