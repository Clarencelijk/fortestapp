<template>
  <view class="order-detail-page">
    <!-- 訂單狀態卡片 -->
    <view class="status-card">
      <view class="status-icon-wrapper">
        <text class="status-icon">{{ getStatusIcon() }}</text>
      </view>
      <view class="status-info">
        <text class="status-text">{{ getStatusText() }}</text>
        <text class="status-desc">{{ getStatusDesc() }}</text>
      </view>
    </view>

    <!-- 物流信息（僅實體商品） -->
    <view v-if="orderInfo.orderType === 1 && orderInfo.logistics" class="logistics-card" @tap="viewLogistics">
      <view class="logistics-header">
        <text class="logistics-title">物流信息</text>
        <text class="logistics-arrow">›</text>
      </view>
      <view class="logistics-content">
        <text class="logistics-company">{{ orderInfo.logistics.company }}</text>
        <text class="logistics-number">{{ orderInfo.logistics.trackingNumber }}</text>
      </view>
      <view class="logistics-latest">
        <text class="logistics-time">{{ orderInfo.logistics.latestTime }}</text>
        <text class="logistics-desc">{{ orderInfo.logistics.latestDesc }}</text>
      </view>
    </view>

    <!-- 收貨地址（僅實體商品） -->
    <view v-if="orderInfo.orderType === 1 && orderInfo.address" class="address-card">
      <view class="address-header">
        <text class="address-icon">📍</text>
        <text class="address-title">收貨地址</text>
      </view>
      <view class="address-content">
        <view class="address-row">
          <text class="receiver-name">{{ orderInfo.address.receiverName }}</text>
          <text class="receiver-phone">{{ orderInfo.address.receiverPhone }}</text>
        </view>
        <text class="address-detail">{{ orderInfo.address.fullAddress }}</text>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="product-card">
      <view class="product-header">
        <text class="product-title">商品信息</text>
        <text class="product-type-tag">{{ getOrderTypeText() }}</text>
      </view>
      <view class="product-item" @tap="viewProduct">
        <image class="product-image" :src="orderInfo.productImage" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ orderInfo.productName }}</text>
          <text class="product-desc">{{ orderInfo.productDesc }}</text>
          <view class="product-price-row">
            <text class="product-price">¥{{ orderInfo.unitPrice }}</text>
            <text class="product-quantity">x{{ orderInfo.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 訂單信息 -->
    <view class="order-info-card">
      <view class="info-row">
        <text class="info-label">訂單編號</text>
        <view class="info-value-row">
          <text class="info-value">{{ orderInfo.orderNo }}</text>
          <text class="copy-btn" @tap="copyOrderNo">複製</text>
        </view>
      </view>
      <view class="info-row">
        <text class="info-label">下單時間</text>
        <text class="info-value">{{ orderInfo.createTime }}</text>
      </view>
      <view class="info-row" v-if="orderInfo.paymentTime">
        <text class="info-label">支付時間</text>
        <text class="info-value">{{ orderInfo.paymentTime }}</text>
      </view>
      <view class="info-row" v-if="orderInfo.paymentMethod">
        <text class="info-label">支付方式</text>
        <text class="info-value">{{ orderInfo.paymentMethod }}</text>
      </view>
      <view class="info-row" v-if="orderInfo.buyerMessage">
        <text class="info-label">買家留言</text>
        <text class="info-value">{{ orderInfo.buyerMessage }}</text>
      </view>
    </view>

    <!-- 費用明細 -->
    <view class="price-card">
      <view class="price-row">
        <text class="price-label">商品金額</text>
        <text class="price-value">¥{{ orderInfo.productAmount }}</text>
      </view>
      <view class="price-row" v-if="orderInfo.shippingFee">
        <text class="price-label">運費</text>
        <text class="price-value">¥{{ orderInfo.shippingFee }}</text>
      </view>
      <view class="price-row total">
        <text class="price-label">實付款</text>
        <text class="price-value highlight">¥{{ orderInfo.totalAmount }}</text>
      </view>
    </view>

    <!-- 發票信息 -->
    <view class="invoice-card">
      <view class="invoice-header">
        <text class="invoice-title">發票信息</text>
      </view>
      <view v-if="orderInfo.invoice" class="invoice-content" @tap="viewInvoice">
        <view class="invoice-row">
          <text class="invoice-label">發票抬頭</text>
          <text class="invoice-value">{{ orderInfo.invoice.headerName }}</text>
        </view>
        <view class="invoice-row">
          <text class="invoice-label">發票狀態</text>
          <text :class="['invoice-status', getInvoiceStatusClass()]">
            {{ getInvoiceStatusText() }}
          </text>
        </view>
        <button v-if="orderInfo.invoice.status === 1" class="download-invoice-btn" @tap.stop="downloadInvoice">
          下載發票
        </button>
      </view>
      <view v-else class="no-invoice">
        <text class="no-invoice-text">無發票</text>
        <button v-if="canApplyInvoice()" class="apply-invoice-btn" @tap="applyInvoice">
          申請發票
        </button>
      </view>
    </view>

    <!-- 底部操作欄 -->
    <view class="bottom-actions">
      <button v-if="canCancel()" class="action-btn secondary" @tap="cancelOrder">取消訂單</button>
      <button v-if="canPay()" class="action-btn primary" @tap="payOrder">立即支付</button>
      <button v-if="canConfirm()" class="action-btn primary" @tap="confirmReceipt">確認收貨</button>
      <button v-if="canReview()" class="action-btn primary" @tap="reviewOrder">評價</button>
      <button v-if="canAftersale()" class="action-btn secondary" @tap="applyAftersale">申請售後</button>
      <button v-if="canDelete()" class="action-btn secondary" @tap="deleteOrder">刪除訂單</button>
      <button class="action-btn secondary" @tap="contactSeller">聯繫賣家</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app';
import { showToast, showConfirm, formatTime } from '@/utils/common.js';

const orderInfo = ref({});

onLoad((options) => {
  const orderId = options.id;
  const orderType = options.type || '1'; // 1實體，2虛擬，3服務
  loadOrderDetail(orderId, orderType);
});

// 加載訂單詳情
const loadOrderDetail = (orderId, orderType) => {
  // 模擬數據
  orderInfo.value = {
    orderId: orderId,
    orderNo: 'MC202510220001',
    orderType: parseInt(orderType),
    status: 2, // 0未付款，1已付款，2運送中，3已完成，4已取消
    productName: '索尼微單相機 A7M4 全畫幅專業攝影',
    productDesc: '顏色：黑色  規格：單機身',
    productImage: 'https://picsum.photos/200/200?random=1',
    unitPrice: 15999.00,
    quantity: 1,
    productAmount: 15999.00,
    shippingFee: orderType === '1' ? 0 : null,
    totalAmount: 15999.00,
    createTime: '2025-10-20 14:30:25',
    paymentTime: '2025-10-20 14:35:10',
    paymentMethod: '微信支付',
    buyerMessage: '請盡快發貨，謝謝！',
    address: orderType === '1' ? {
      receiverName: '張三',
      receiverPhone: '138****8888',
      fullAddress: '廣東省 深圳市 南山區 科技園南區 深圳灣科技生態園 10棟A座'
    } : null,
    logistics: orderType === '1' ? {
      company: '順豐速運',
      trackingNumber: 'SF1234567890',
      latestTime: '2025-10-21 10:30',
      latestDesc: '【深圳市】快件已到達【深圳南山集散中心】'
    } : null,
    invoice: null // 暫無發票
  };
};

// 狀態相關
const getStatusIcon = () => {
  const icons = {
    0: '💳',
    1: '📦',
    2: '🚚',
    3: '✅',
    4: '❌'
  };
  return icons[orderInfo.value.status] || '📋';
};

const getStatusText = () => {
  const texts = {
    0: '待付款',
    1: '待發貨',
    2: '運送中',
    3: '已完成',
    4: '已取消'
  };
  return texts[orderInfo.value.status] || '未知狀態';
};

const getStatusDesc = () => {
  const descs = {
    0: '請盡快完成支付',
    1: '商家正在準備發貨',
    2: '商品正在配送中，請耐心等待',
    3: '訂單已完成，感謝您的購買',
    4: '訂單已取消'
  };
  return descs[orderInfo.value.status] || '';
};

const getOrderTypeText = () => {
  const types = {
    1: '實體商品',
    2: '虛擬商品',
    3: '服務商品'
  };
  return types[orderInfo.value.orderType] || '';
};

// 發票相關
const getInvoiceStatusText = () => {
  if (!orderInfo.value.invoice) return '';
  const texts = {
    0: '待開具',
    1: '已開具',
    2: '已作廢'
  };
  return texts[orderInfo.value.invoice.status] || '';
};

const getInvoiceStatusClass = () => {
  if (!orderInfo.value.invoice) return '';
  const classes = {
    0: 'pending',
    1: 'issued',
    2: 'cancelled'
  };
  return classes[orderInfo.value.invoice.status] || '';
};

const canApplyInvoice = () => {
  return orderInfo.value.status === 3 && !orderInfo.value.invoice;
};

const applyInvoice = () => {
  uni.navigateTo({
    url: `/subpages/transaction/invoice-header/invoice-header?orderId=${orderInfo.value.orderId}&orderType=${orderInfo.value.orderType}`
  });
};

const viewInvoice = () => {
  if (orderInfo.value.invoice) {
    uni.navigateTo({
      url: `/subpages/transaction/invoice-detail/invoice-detail?id=${orderInfo.value.invoice.id}`
    });
  }
};

const downloadInvoice = () => {
  showToast('正在下載發票...', 'loading');
  setTimeout(() => {
    showToast('發票下載成功', 'success');
  }, 1500);
};

// 操作判斷
const canCancel = () => orderInfo.value.status === 0;
const canPay = () => orderInfo.value.status === 0;
const canConfirm = () => orderInfo.value.status === 2;
const canReview = () => orderInfo.value.status === 3 && !orderInfo.value.reviewed;
const canAftersale = () => [1, 2, 3].includes(orderInfo.value.status);
const canDelete = () => [3, 4].includes(orderInfo.value.status);

// 操作方法
const cancelOrder = () => {
  showConfirm('確定要取消訂單嗎？', '提示')
    .then(() => {
      showToast('訂單已取消', 'success');
      orderInfo.value.status = 4;
    })
    .catch(() => {});
};

const payOrder = () => {
  showToast('跳轉支付頁面...', 'none');
};

const confirmReceipt = () => {
  showConfirm('確認已收到商品嗎？', '提示')
    .then(() => {
      showToast('確認收貨成功', 'success');
      orderInfo.value.status = 3;
    })
    .catch(() => {});
};

const reviewOrder = () => {
  uni.navigateTo({
    url: `/subpages/transaction/review/review?orderId=${orderInfo.value.orderId}&orderType=${orderInfo.value.orderType}`
  });
};

const applyAftersale = () => {
  uni.navigateTo({
    url: `/subpages/transaction/aftersales/aftersales?orderId=${orderInfo.value.orderId}&orderType=${orderInfo.value.orderType}`
  });
};

const deleteOrder = () => {
  showConfirm('確定要刪除訂單嗎？', '提示')
    .then(() => {
      showToast('訂單已刪除', 'success');
      setTimeout(() => {
        uni.navigateBack();
      }, 1000);
    })
    .catch(() => {});
};

const contactSeller = () => {
  uni.navigateTo({
    url: `/subpages/chat/chat?sellerId=${orderInfo.value.sellerId}`
  });
};

const viewLogistics = () => {
  uni.navigateTo({
    url: `/subpages/transaction/logistics/logistics?orderId=${orderInfo.value.orderId}`
  });
};

const viewProduct = () => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${orderInfo.value.productId}`
  });
};

const copyOrderNo = () => {
  uni.setClipboardData({
    data: orderInfo.value.orderNo,
    success: () => {
      showToast('訂單號已複製', 'success');
    }
  });
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.order-detail-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 狀態卡片 */
.status-card {
  background: linear-gradient(135deg, $primary-color 0%, #1890FF 100%);
  padding: $spacing-xl;
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
}

.status-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-lg;
}

.status-icon {
  font-size: 50rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-text {
  font-size: $font-xl;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: $spacing-xs;
}

.status-desc {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.9);
}

/* 物流卡片 */
.logistics-card {
  background-color: $bg-card;
  margin: 0 $spacing-md $spacing-md;
  padding: $spacing-lg;
  border-radius: $radius-lg;
}

.logistics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.logistics-title {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
}

.logistics-arrow {
  font-size: $font-xl;
  color: $text-secondary;
}

.logistics-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
}

.logistics-company {
  font-size: $font-md;
  color: $text-primary;
}

.logistics-number {
  font-size: $font-md;
  color: $text-secondary;
}

.logistics-latest {
  padding: $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  border-left: 4rpx solid $primary-color;
}

.logistics-time {
  font-size: $font-sm;
  color: $text-secondary;
  margin-right: $spacing-md;
}

.logistics-desc {
  font-size: $font-md;
  color: $text-primary;
}

/* 地址卡片 */
.address-card {
  background-color: $bg-card;
  margin: 0 $spacing-md $spacing-md;
  padding: $spacing-lg;
  border-radius: $radius-lg;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
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

.address-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
}

.receiver-name {
  font-size: $font-md;
  font-weight: bold;
  color: $text-primary;
}

.receiver-phone {
  font-size: $font-md;
  color: $text-secondary;
}

.address-detail {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.6;
}

/* 商品卡片 */
.product-card {
  background-color: $bg-card;
  margin: 0 $spacing-md $spacing-md;
  padding: $spacing-lg;
  border-radius: $radius-lg;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.product-title {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
}

.product-type-tag {
  font-size: $font-sm;
  color: $primary-color;
  padding: 4rpx 12rpx;
  background-color: rgba(47, 124, 246, 0.1);
  border-radius: $radius-sm;
}

.product-item {
  display: flex;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
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
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.product-desc {
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: $font-lg;
  font-weight: bold;
  color: $danger-color;
}

.product-quantity {
  font-size: $font-md;
  color: $text-secondary;
}

/* 訂單信息卡片 */
.order-info-card,
.price-card,
.invoice-card {
  background-color: $bg-card;
  margin: 0 $spacing-md $spacing-md;
  padding: $spacing-lg;
  border-radius: $radius-lg;
}

.info-row,
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1rpx solid $border-color;
}

.info-row:last-child,
.price-row:last-child {
  border-bottom: none;
}

.info-label,
.price-label {
  font-size: $font-md;
  color: $text-secondary;
}

.info-value,
.price-value {
  font-size: $font-md;
  color: $text-primary;
}

.info-value-row {
  display: flex;
  align-items: center;
}

.copy-btn {
  font-size: $font-sm;
  color: $primary-color;
  margin-left: $spacing-md;
  padding: 4rpx 12rpx;
  background-color: rgba(47, 124, 246, 0.1);
  border-radius: $radius-sm;
}

.price-row.total {
  padding-top: $spacing-lg;
  border-top: 2rpx solid $border-color;
}

.price-value.highlight {
  font-size: $font-xl;
  font-weight: bold;
  color: $danger-color;
}

/* 發票卡片 */
.invoice-header {
  margin-bottom: $spacing-md;
}

.invoice-title {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
}

.invoice-row {
  display: flex;
  justify-content: space-between;
  padding: $spacing-sm 0;
}

.invoice-label {
  font-size: $font-md;
  color: $text-secondary;
}

.invoice-value {
  font-size: $font-md;
  color: $text-primary;
}

.invoice-status {
  font-size: $font-md;
  
  &.pending {
    color: $warning-color;
  }
  
  &.issued {
    color: $success-color;
  }
  
  &.cancelled {
    color: $text-disabled;
  }
}

.download-invoice-btn {
  margin-top: $spacing-md;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: $primary-color;
  color: #FFFFFF;
  border-radius: $radius-md;
  font-size: $font-md;
  border: none;
}

.no-invoice {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-invoice-text {
  font-size: $font-md;
  color: $text-secondary;
}

.apply-invoice-btn {
  padding: 8rpx 24rpx;
  background-color: rgba(47, 124, 246, 0.1);
  color: $primary-color;
  border-radius: $radius-md;
  font-size: $font-sm;
  border: none;
}

/* 底部操作欄 */
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

