<template>
  <view class="my-orders-page">
    <!-- 訂單狀態標籤 -->
    <scroll-view class="status-tabs" scroll-x show-scrollbar="false">
      <view 
        v-for="tab in statusTabs" 
        :key="tab.id" 
        :class="['status-tab', { active: activeStatus === tab.id }]"
        @tap="switchStatus(tab.id)"
      >
        <text class="tab-text">{{ tab.name }}</text>
        <view v-if="tab.badge" class="tab-badge">{{ tab.badge }}</view>
      </view>
    </scroll-view>

    <!-- 訂單列表 -->
    <scroll-view class="orders-list" scroll-y @scrolltolower="loadMore">
      <view v-for="order in ordersList" :key="order.id" class="order-card">
        <!-- 訂單頭部 -->
        <view class="order-header">
          <text class="order-number">訂單號：{{ order.orderNo }}</text>
          <text :class="['order-status', order.status]">{{ getStatusText(order.status) }}</text>
        </view>

        <!-- 商品列表 -->
        <view class="goods-list">
          <view 
            v-for="goods in order.goods" 
            :key="goods.id" 
            class="goods-item"
            @tap="handleGoodsTap(goods)"
          >
            <image class="goods-image" :src="goods.image" mode="aspectFill" />
            <view class="goods-info">
              <text class="goods-name text-ellipsis-2">{{ goods.name }}</text>
              <text class="goods-spec">{{ goods.spec }}</text>
              <view class="goods-price-row">
                <text class="goods-price">¥{{ goods.price }}</text>
                <text class="goods-quantity">x{{ goods.quantity }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 訂單信息 -->
        <view class="order-info">
          <text class="info-item">下單時間：{{ order.createTime }}</text>
          <view class="total-row">
            <text class="total-label">實付款：</text>
            <text class="total-price">¥{{ order.totalPrice }}</text>
          </view>
        </view>

        <!-- 訂單操作 -->
        <view class="order-actions">
          <button 
            v-if="order.status === 'pending_payment'" 
            class="action-button secondary"
            @tap="handleCancel(order)"
          >
            取消訂單
          </button>
          <button 
            v-if="order.status === 'pending_payment'" 
            class="action-button primary"
            @tap="handlePay(order)"
          >
            立即支付
          </button>
          <button 
            v-if="order.status === 'pending_receive'" 
            class="action-button secondary"
            @tap="handleLogistics(order)"
          >
            查看物流
          </button>
          <button 
            v-if="order.status === 'pending_receive'" 
            class="action-button primary"
            @tap="handleConfirm(order)"
          >
            確認收貨
          </button>
          <button 
            v-if="order.status === 'completed'" 
            class="action-button secondary"
            @tap="handleReview(order)"
          >
            評價
          </button>
          <button 
            v-if="order.status === 'completed'" 
            class="action-button primary"
            @tap="handleRepurchase(order)"
          >
            再次購買
          </button>
        </view>
      </view>

      <!-- 空狀態 -->
      <view v-if="ordersList.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暫無訂單</text>
        <text class="empty-hint">快去選購心儀的商品吧</text>
      </view>

      <!-- 加載更多 -->
      <view v-if="hasMore && ordersList.length > 0" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatDate, showToast, showConfirm } from '@/utils/common.js';

// 狀態標籤
const statusTabs = ref([
  { id: 'all', name: '全部', badge: null },
  { id: 'pending_payment', name: '待付款', badge: 2 },
  { id: 'pending_shipment', name: '待發貨', badge: null },
  { id: 'pending_receive', name: '待收貨', badge: 1 },
  { id: 'completed', name: '已完成', badge: null }
]);

const activeStatus = ref('all');

// 訂單列表
const ordersList = ref([]);
const hasMore = ref(true);

const getStatusText = (status) => {
  switch (status) {
    case 'pending_payment': return '待付款';
    case 'pending_shipment': return '待發貨';
    case 'pending_receive': return '待收貨';
    case 'completed': return '已完成';
    case 'cancelled': return '已取消';
    case 'refunding': return '退款中';
    default: return '';
  }
};

// 模擬訂單數據
const mockOrders = () => {
  const orders = [];
  const statuses = ['pending_payment', 'pending_shipment', 'pending_receive', 'completed'];
  const goodsNames = [
    'uni-app 開發實戰課程',
    '前端性能優化指南電子書',
    'Vue 3 進階視頻教程',
    '移動端開發工具包',
    '設計素材會員年卡'
  ];

  for (let i = 0; i < 10; i++) {
    const goodsCount = Math.floor(Math.random() * 2) + 1;
    const goods = [];
    let totalPrice = 0;

    for (let j = 0; j < goodsCount; j++) {
      const price = (Math.random() * 200 + 50).toFixed(2);
      const quantity = Math.floor(Math.random() * 2) + 1;
      totalPrice += parseFloat(price) * quantity;
      
      goods.push({
        id: `${i}-${j}`,
        name: goodsNames[Math.floor(Math.random() * goodsNames.length)],
        spec: '標準版',
        image: `https://picsum.photos/150/150?random=${i * 10 + j}`,
        price: price,
        quantity: quantity
      });
    }

    orders.push({
      id: i + 1,
      orderNo: `202510${String(i + 1).padStart(8, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      goods: goods,
      totalPrice: totalPrice.toFixed(2),
      createTime: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000))
    });
  }
  ordersList.value = orders;
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

// 點擊商品
const handleGoodsTap = (goods) => {
  showToast(`查看商品：${goods.name}`, 'none');
};

// 取消訂單
const handleCancel = (order) => {
  showConfirm('確定要取消訂單嗎？', '提示')
    .then(() => {
      order.status = 'cancelled';
      showToast('訂單已取消', 'success');
    })
    .catch(() => {});
};

// 支付
const handlePay = (order) => {
  uni.showActionSheet({
    itemList: ['微信支付', '支付寶支付', '銀行卡支付'],
    success: (res) => {
      showToast('支付成功', 'success');
      order.status = 'pending_shipment';
    }
  });
};

// 查看物流
const handleLogistics = (order) => {
  showToast('查看物流信息', 'none');
};

// 確認收貨
const handleConfirm = (order) => {
  showConfirm('確認已收到貨物嗎？', '提示')
    .then(() => {
      order.status = 'completed';
      showToast('確認收貨成功', 'success');
    })
    .catch(() => {});
};

// 評價
const handleReview = (order) => {
  showToast('評價功能開發中', 'none');
};

// 再次購買
const handleRepurchase = (order) => {
  showToast('已添加到購物車', 'success');
};

onMounted(() => {
  mockOrders();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.my-orders-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 狀態標籤 */
.status-tabs {
  white-space: nowrap;
  padding: $spacing-md $spacing-lg;
  background-color: $bg-card;
  box-shadow: $shadow-sm;
}

.status-tab {
  position: relative;
  display: inline-block;
  padding: $spacing-sm $spacing-lg;
  margin-right: $spacing-lg;
  
  &.active .tab-text {
    color: $primary-color;
    font-weight: $font-bold;
    position: relative;
    
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

.tab-text {
  font-size: $font-md;
  color: $text-secondary;
}

.tab-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $error-color;
  color: $text-white;
  font-size: $font-xs;
  font-weight: $font-bold;
  border-radius: $radius-round;
}

/* 訂單列表 */
.orders-list {
  height: calc(100vh - 120rpx);
  padding: $spacing-md;
}

.order-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  margin-bottom: $spacing-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

/* 訂單頭部 */
.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-lg;
  border-bottom: 1rpx solid $border-light;
}

.order-number {
  font-size: $font-sm;
  color: $text-secondary;
}

.order-status {
  font-size: $font-sm;
  font-weight: $font-bold;
  
  &.pending_payment {
    color: $error-color;
  }
  &.pending_shipment {
    color: $warning-color;
  }
  &.pending_receive {
    color: $info-color;
  }
  &.completed {
    color: $success-color;
  }
}

/* 商品列表 */
.goods-list {
  padding: $spacing-md $spacing-lg;
}

.goods-item {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.goods-image {
  width: 150rpx;
  height: 150rpx;
  border-radius: $radius-md;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-name {
  font-size: $font-md;
  color: $text-primary;
  line-height: $line-height-md;
}

.goods-spec {
  font-size: $font-xs;
  color: $text-tertiary;
}

.goods-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods-price {
  font-size: $font-lg;
  color: $error-color;
  font-weight: $font-bold;
}

.goods-quantity {
  font-size: $font-sm;
  color: $text-tertiary;
}

/* 訂單信息 */
.order-info {
  padding: $spacing-md $spacing-lg;
  border-top: 1rpx solid $border-light;
  border-bottom: 1rpx solid $border-light;
}

.info-item {
  font-size: $font-xs;
  color: $text-tertiary;
  display: block;
  margin-bottom: $spacing-xs;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: $spacing-sm;
}

.total-label {
  font-size: $font-md;
  color: $text-secondary;
}

.total-price {
  font-size: $font-xl;
  color: $error-color;
  font-weight: $font-bold;
}

/* 訂單操作 */
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
}

.action-button {
  padding: $spacing-sm $spacing-xl;
  font-size: $font-sm;
  border-radius: $radius-md;
  
  &.secondary {
    background-color: $bg-page;
    color: $text-secondary;
    border: 1rpx solid $border-color;
  }
  
  &.primary {
    background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
    color: $text-white;
    font-weight: $font-bold;
  }
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

