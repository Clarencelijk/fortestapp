<template>
  <view class="invoice-detail-page">
    <!-- 發票狀態卡片 -->
    <view class="status-card" :class="getStatusClass()">
      <view class="status-icon">{{ getStatusIcon() }}</view>
      <view class="status-info">
        <text class="status-text">{{ getStatusText() }}</text>
        <text class="status-desc">{{ getStatusDesc() }}</text>
      </view>
    </view>

    <!-- 發票信息 -->
    <view class="invoice-section">
      <view class="section-title">發票信息</view>
      <view class="invoice-card">
        <view class="invoice-header">
          <text class="invoice-title">電子發票</text>
          <view class="invoice-type-tag" :class="invoice.invoiceType === 1 ? 'normal' : 'special'">
            {{ invoice.invoiceType === 1 ? '普通發票' : '專用發票' }}
          </view>
        </view>
        
        <view class="invoice-info">
          <view class="info-row">
            <text class="info-label">發票號碼</text>
            <text class="info-value">{{ invoice.invoiceNo }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">開具日期</text>
            <text class="info-value">{{ invoice.issueDate }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">發票代碼</text>
            <text class="info-value">{{ invoice.invoiceCode }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 發票抬頭信息 -->
    <view class="header-section">
      <view class="section-title">抬頭信息</view>
      <view class="header-card">
        <view class="header-type">
          <text class="type-badge" :class="invoice.header.type === 1 ? 'personal' : 'company'">
            {{ invoice.header.type === 1 ? '個人' : '企業' }}
          </text>
          <text class="header-name">{{ invoice.header.name }}</text>
        </view>
        
        <view v-if="invoice.header.type === 2" class="header-details">
          <view class="detail-item">
            <text class="detail-label">稅號</text>
            <text class="detail-value">{{ invoice.header.taxNumber }}</text>
          </view>
          <view v-if="invoice.header.address" class="detail-item">
            <text class="detail-label">地址</text>
            <text class="detail-value">{{ invoice.header.address }}</text>
          </view>
          <view v-if="invoice.header.phone" class="detail-item">
            <text class="detail-label">電話</text>
            <text class="detail-value">{{ invoice.header.phone }}</text>
          </view>
          <view v-if="invoice.header.bankName" class="detail-item">
            <text class="detail-label">開戶行</text>
            <text class="detail-value">{{ invoice.header.bankName }}</text>
          </view>
          <view v-if="invoice.header.bankAccount" class="detail-item">
            <text class="detail-label">賬號</text>
            <text class="detail-value">{{ invoice.header.bankAccount }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 訂單信息 -->
    <view class="order-section">
      <view class="section-title">訂單信息</view>
      <view class="order-card">
        <view class="order-row">
          <text class="order-label">訂單編號</text>
          <text class="order-value">{{ invoice.order.orderNo }}</text>
        </view>
        <view class="order-row">
          <text class="order-label">商品名稱</text>
          <text class="order-value">{{ invoice.order.productName }}</text>
        </view>
        <view class="order-row">
          <text class="order-label">訂單金額</text>
          <text class="order-value price">¥{{ invoice.order.orderAmount.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 金額明細 -->
    <view class="amount-section">
      <view class="section-title">金額明細</view>
      <view class="amount-card">
        <view class="amount-row">
          <text class="amount-label">商品金額</text>
          <text class="amount-value">¥{{ invoice.amount.productAmount.toFixed(2) }}</text>
        </view>
        <view class="amount-row">
          <text class="amount-label">稅額</text>
          <text class="amount-value">¥{{ invoice.amount.taxAmount.toFixed(2) }}</text>
        </view>
        <view class="amount-row total">
          <text class="amount-label">合計金額</text>
          <text class="amount-value">¥{{ invoice.amount.totalAmount.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button v-if="invoice.invoiceStatus === 1" class="action-btn secondary" @tap="sendToEmail">
        <text class="btn-icon">📧</text>
        發送到郵箱
      </button>
      <button v-if="invoice.invoiceStatus === 1" class="action-btn primary" @tap="downloadInvoice">
        <text class="btn-icon">📥</text>
        下載發票
      </button>
      <button v-if="invoice.invoiceStatus === 0" class="action-btn disabled" disabled>
        <text class="btn-icon">⏳</text>
        等待開具
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app';
import { showToast, showConfirm } from '@/utils/common.js';

const invoice = ref({});

onLoad((options) => {
  const invoiceId = options.invoiceId;
  loadInvoiceDetail(invoiceId);
});

const loadInvoiceDetail = (invoiceId) => {
  // 模擬數據
  invoice.value = {
    invoiceId: 1,
    invoiceNo: 'INV202510220001',
    invoiceCode: '044001900111',
    issueDate: '2025-10-22 15:30:00',
    invoiceType: 2, // 1普通，2專用
    invoiceStatus: 1, // 0待開具，1已開具，2已作廢
    invoiceUrl: 'https://example.com/invoice.pdf',
    header: {
      type: 2,
      name: '深圳市某某科技有限公司',
      taxNumber: '91440300XXXXXXXXXX',
      address: '深圳市南山區科技園南區深圳灣科技生態園10棟',
      phone: '0755-12345678',
      bankName: '中國銀行深圳分行',
      bankAccount: '6217XXXXXXXXXXXX'
    },
    order: {
      orderNo: 'MC202510220001',
      productName: '高端商務筆記本電腦 15.6英寸',
      orderAmount: 15999.00
    },
    amount: {
      productAmount: 15999.00,
      taxAmount: 159.99,
      totalAmount: 16158.99
    }
  };
};

const getStatusClass = () => {
  const classes = {
    0: 'pending',
    1: 'issued',
    2: 'cancelled'
  };
  return classes[invoice.value.invoiceStatus] || 'pending';
};

const getStatusIcon = () => {
  const icons = {
    0: '⏳',
    1: '✓',
    2: '✕'
  };
  return icons[invoice.value.invoiceStatus] || '⏳';
};

const getStatusText = () => {
  const texts = {
    0: '待開具',
    1: '已開具',
    2: '已作廢'
  };
  return texts[invoice.value.invoiceStatus] || '未知';
};

const getStatusDesc = () => {
  const descs = {
    0: '商家正在為您開具發票，請耐心等待',
    1: '發票已開具成功，可以下載查看',
    2: '該發票已作廢，如有疑問請聯繫商家'
  };
  return descs[invoice.value.invoiceStatus] || '';
};

const downloadInvoice = () => {
  showToast('正在下載發票...', 'loading');
  
  // 模擬下載
  setTimeout(() => {
    uni.downloadFile({
      url: invoice.value.invoiceUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          showToast('下載成功', 'success');
          // 打開文檔
          uni.openDocument({
            filePath: res.tempFilePath,
            fileType: 'pdf',
            success: () => {
              console.log('打開文檔成功');
            }
          });
        }
      },
      fail: () => {
        showToast('下載失敗，請稍後重試', 'error');
      }
    });
  }, 1000);
};

const sendToEmail = () => {
  showConfirm('確定要將發票發送到您的註冊郵箱嗎？', '發送發票')
    .then(() => {
      showToast('正在發送...', 'loading');
      
      setTimeout(() => {
        showToast('發送成功，請查收郵件', 'success');
      }, 1500);
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.invoice-detail-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 發票狀態卡片 */
.status-card {
  margin: $spacing-md;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  
  &.pending {
    background: linear-gradient(135deg, #FFE58F 0%, #FAAD14 100%);
  }
  
  &.issued {
    background: linear-gradient(135deg, #95DE64 0%, #52C41A 100%);
  }
  
  &.cancelled {
    background: linear-gradient(135deg, #FFA39E 0%, #F5222D 100%);
  }
}

.status-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: $spacing-lg;
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
  line-height: 1.5;
}

/* 通用區塊樣式 */
.invoice-section,
.header-section,
.order-section,
.amount-section {
  margin: 0 $spacing-md $spacing-md;
}

.section-title {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

/* 發票信息卡片 */
.invoice-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 2rpx dashed $primary-color;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $spacing-md;
  border-bottom: 1rpx solid $border-color;
  margin-bottom: $spacing-md;
}

.invoice-title {
  font-size: $font-xl;
  font-weight: bold;
  color: $text-primary;
}

.invoice-type-tag {
  padding: 6rpx 16rpx;
  border-radius: $radius-sm;
  font-size: $font-sm;
  
  &.normal {
    background-color: rgba(47, 124, 246, 0.1);
    color: $primary-color;
  }
  
  &.special {
    background-color: rgba(250, 173, 20, 0.1);
    color: $warning-color;
  }
}

.invoice-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: $font-md;
  color: $text-secondary;
}

.info-value {
  font-size: $font-md;
  color: $text-primary;
  font-weight: bold;
}

/* 抬頭信息卡片 */
.header-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.header-type {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1rpx solid $border-color;
}

.type-badge {
  padding: 4rpx 12rpx;
  border-radius: $radius-sm;
  font-size: $font-sm;
  margin-right: $spacing-sm;
  
  &.personal {
    background-color: rgba(82, 196, 26, 0.1);
    color: $success-color;
  }
  
  &.company {
    background-color: rgba(47, 124, 246, 0.1);
    color: $primary-color;
  }
}

.header-name {
  flex: 1;
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
}

.header-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.detail-item {
  display: flex;
}

.detail-label {
  font-size: $font-sm;
  color: $text-secondary;
  width: 120rpx;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  font-size: $font-sm;
  color: $text-primary;
}

/* 訂單信息卡片 */
.order-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.order-label {
  font-size: $font-md;
  color: $text-secondary;
}

.order-value {
  font-size: $font-md;
  color: $text-primary;
  
  &.price {
    color: $danger-color;
    font-weight: bold;
    font-size: $font-lg;
  }
}

/* 金額明細卡片 */
.amount-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &.total {
    padding-top: $spacing-md;
    border-top: 1rpx solid $border-color;
    margin-top: $spacing-sm;
    
    .amount-label,
    .amount-value {
      font-size: $font-lg;
      font-weight: bold;
      color: $danger-color;
    }
  }
}

.amount-label {
  font-size: $font-md;
  color: $text-secondary;
}

.amount-value {
  font-size: $font-md;
  color: $text-primary;
  font-weight: bold;
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
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.primary {
    background-color: $primary-color;
    color: #FFFFFF;
  }
  
  &.secondary {
    background-color: transparent;
    color: $text-primary;
    border: 2rpx solid $border-color;
  }
  
  &.disabled {
    background-color: $bg-page;
    color: $text-disabled;
  }
}

.btn-icon {
  font-size: $font-lg;
  margin-right: $spacing-xs;
}
</style>

