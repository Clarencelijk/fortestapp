<template>
  <view class="invoice-header-page">
    <!-- 頁面標題 -->
    <view class="page-header">
      <text class="page-title">{{ isSelectMode ? '選擇發票抬頭' : '發票抬頭管理' }}</text>
      <text v-if="!isSelectMode" class="page-desc">用於開具發票，請確保信息準確</text>
    </view>

    <!-- 發票抬頭列表 -->
    <view class="header-list">
      <view v-for="(header, index) in headerList" :key="header.id"
            :class="['header-item', { selected: selectedId === header.id }]"
            @tap="selectHeader(header)">
        <view class="header-content">
          <view class="header-top">
            <view class="header-type-tag" :class="header.type === 1 ? 'personal' : 'company'">
              {{ header.type === 1 ? '個人' : '企業' }}
            </view>
            <text class="header-name">{{ header.name }}</text>
            <text v-if="header.isDefault" class="default-badge">默認</text>
          </view>
          
          <view v-if="header.type === 2" class="header-details">
            <view class="detail-row">
              <text class="detail-label">稅號：</text>
              <text class="detail-value">{{ header.taxNumber }}</text>
            </view>
            <view v-if="header.address" class="detail-row">
              <text class="detail-label">地址：</text>
              <text class="detail-value">{{ header.address }}</text>
            </view>
            <view v-if="header.phone" class="detail-row">
              <text class="detail-label">電話：</text>
              <text class="detail-value">{{ header.phone }}</text>
            </view>
            <view v-if="header.bankName" class="detail-row">
              <text class="detail-label">開戶行：</text>
              <text class="detail-value">{{ header.bankName }}</text>
            </view>
            <view v-if="header.bankAccount" class="detail-row">
              <text class="detail-label">賬號：</text>
              <text class="detail-value">{{ header.bankAccount }}</text>
            </view>
          </view>
        </view>

        <view v-if="!isSelectMode" class="header-actions">
          <text class="action-btn" @tap.stop="editHeader(header)">編輯</text>
          <text class="action-btn delete" @tap.stop="deleteHeader(header)">刪除</text>
        </view>

        <view v-if="isSelectMode" class="select-icon">
          <text v-if="selectedId === header.id">✓</text>
        </view>
      </view>

      <!-- 空狀態 -->
      <view v-if="headerList.length === 0" class="empty-state">
        <text class="empty-icon">📄</text>
        <text class="empty-text">暫無發票抬頭</text>
        <text class="empty-desc">請添加發票抬頭以便開具發票</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @tap="addHeader">
        <text class="btn-icon">+</text>
        添加發票抬頭
      </button>
      <button v-if="isSelectMode && selectedId" class="action-btn primary" @tap="confirmSelect">
        確認選擇
      </button>
    </view>

    <!-- 編輯彈窗 -->
    <uni-popup ref="editPopup" type="bottom">
      <view class="edit-form">
        <view class="form-header">
          <text class="form-title">{{ editingHeader.id ? '編輯' : '添加' }}發票抬頭</text>
          <text class="close-btn" @tap="closeEdit">✕</text>
        </view>

        <view class="form-content">
          <!-- 抬頭類型 -->
          <view class="form-item">
            <text class="form-label">抬頭類型</text>
            <view class="type-tabs">
              <view :class="['type-tab', { active: editingHeader.type === 1 }]" 
                    @tap="editingHeader.type = 1">
                個人
              </view>
              <view :class="['type-tab', { active: editingHeader.type === 2 }]" 
                    @tap="editingHeader.type = 2">
                企業
              </view>
            </view>
          </view>

          <!-- 抬頭名稱 -->
          <view class="form-item">
            <text class="form-label required">{{ editingHeader.type === 1 ? '姓名' : '企業名稱' }}</text>
            <input class="form-input" v-model="editingHeader.name" 
                   :placeholder="editingHeader.type === 1 ? '請輸入姓名' : '請輸入企業名稱'" />
          </view>

          <!-- 企業信息 -->
          <template v-if="editingHeader.type === 2">
            <view class="form-item">
              <text class="form-label required">稅號</text>
              <input class="form-input" v-model="editingHeader.taxNumber" 
                     placeholder="請輸入納稅人識別號" />
            </view>

            <view class="form-item">
              <text class="form-label">企業地址</text>
              <input class="form-input" v-model="editingHeader.address" 
                     placeholder="請輸入企業註冊地址" />
            </view>

            <view class="form-item">
              <text class="form-label">企業電話</text>
              <input class="form-input" v-model="editingHeader.phone" 
                     type="number" placeholder="請輸入企業電話" />
            </view>

            <view class="form-item">
              <text class="form-label">開戶銀行</text>
              <input class="form-input" v-model="editingHeader.bankName" 
                     placeholder="請輸入開戶銀行名稱" />
            </view>

            <view class="form-item">
              <text class="form-label">銀行賬號</text>
              <input class="form-input" v-model="editingHeader.bankAccount" 
                     type="number" placeholder="請輸入銀行賬號" />
            </view>
          </template>

          <!-- 設為默認 -->
          <view class="form-item checkbox-item">
            <text class="form-label">設為默認</text>
            <switch :checked="editingHeader.isDefault" @change="toggleDefault" />
          </view>
        </view>

        <view class="form-footer">
          <button class="form-btn cancel" @tap="closeEdit">取消</button>
          <button class="form-btn confirm" @tap="saveHeader">保存</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app';
import { showToast, showConfirm } from '@/utils/common.js';

const isSelectMode = ref(false);
const selectedId = ref(null);
const orderId = ref(null);
const orderType = ref(null);

const headerList = ref([]);
const editingHeader = ref({});
const editPopup = ref(null);

onLoad((options) => {
  if (options.orderId) {
    isSelectMode.value = true;
    orderId.value = options.orderId;
    orderType.value = options.orderType;
  }
  loadHeaderList();
});

const loadHeaderList = () => {
  // 模擬數據
  headerList.value = [
    {
      id: 1,
      type: 1,
      name: '張三',
      isDefault: true
    },
    {
      id: 2,
      type: 2,
      name: '深圳市某某科技有限公司',
      taxNumber: '91440300XXXXXXXXXX',
      address: '深圳市南山區科技園南區深圳灣科技生態園10棟',
      phone: '0755-12345678',
      bankName: '中國銀行深圳分行',
      bankAccount: '6217XXXXXXXXXXXX',
      isDefault: false
    }
  ];
};

const selectHeader = (header) => {
  if (isSelectMode.value) {
    selectedId.value = header.id;
  }
};

const confirmSelect = () => {
  if (!selectedId.value) {
    showToast('請選擇發票抬頭', 'none');
    return;
  }

  const selected = headerList.value.find(h => h.id === selectedId.value);
  showToast('正在申請發票...', 'loading');
  
  setTimeout(() => {
    showToast('發票申請成功', 'success');
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  }, 1500);
};

const addHeader = () => {
  editingHeader.value = {
    type: 1,
    name: '',
    taxNumber: '',
    address: '',
    phone: '',
    bankName: '',
    bankAccount: '',
    isDefault: false
  };
  editPopup.value.open();
};

const editHeader = (header) => {
  editingHeader.value = { ...header };
  editPopup.value.open();
};

const closeEdit = () => {
  editPopup.value.close();
};

const toggleDefault = (e) => {
  editingHeader.value.isDefault = e.detail.value;
};

const saveHeader = () => {
  if (!editingHeader.value.name) {
    showToast('請輸入抬頭名稱', 'none');
    return;
  }

  if (editingHeader.value.type === 2 && !editingHeader.value.taxNumber) {
    showToast('請輸入稅號', 'none');
    return;
  }

  showToast('保存成功', 'success');
  
  if (editingHeader.value.id) {
    const index = headerList.value.findIndex(h => h.id === editingHeader.value.id);
    headerList.value[index] = { ...editingHeader.value };
  } else {
    editingHeader.value.id = Date.now();
    headerList.value.push({ ...editingHeader.value });
  }

  if (editingHeader.value.isDefault) {
    headerList.value.forEach(h => {
      if (h.id !== editingHeader.value.id) {
        h.isDefault = false;
      }
    });
  }

  closeEdit();
};

const deleteHeader = (header) => {
  showConfirm('確定要刪除此發票抬頭嗎？', '提示')
    .then(() => {
      const index = headerList.value.findIndex(h => h.id === header.id);
      headerList.value.splice(index, 1);
      showToast('刪除成功', 'success');
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.invoice-header-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 頁面標題 */
.page-header {
  background-color: $bg-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-md;
}

.page-title {
  font-size: $font-xl;
  font-weight: bold;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-xs;
}

.page-desc {
  font-size: $font-sm;
  color: $text-secondary;
  display: block;
}

/* 發票抬頭列表 */
.header-list {
  padding: 0 $spacing-md;
}

.header-item {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  
  &.selected {
    border-color: $primary-color;
    background-color: rgba(47, 124, 246, 0.05);
  }
}

.header-content {
  flex: 1;
}

.header-top {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
}

.header-type-tag {
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

.default-badge {
  padding: 4rpx 12rpx;
  background-color: rgba(250, 173, 20, 0.1);
  color: $warning-color;
  border-radius: $radius-sm;
  font-size: $font-sm;
}

.header-details {
  padding-left: $spacing-md;
  border-left: 4rpx solid $border-color;
}

.detail-row {
  display: flex;
  margin-bottom: $spacing-sm;
  
  &:last-child {
    margin-bottom: 0;
  }
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

.header-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1rpx solid $border-color;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 12rpx 0;
  background-color: rgba(47, 124, 246, 0.1);
  color: $primary-color;
  border-radius: $radius-md;
  font-size: $font-sm;
  
  &.delete {
    background-color: rgba(245, 34, 45, 0.1);
    color: $danger-color;
  }
}

.select-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  border: 2rpx solid $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-xl;
  color: #FFFFFF;
  margin-left: $spacing-md;
}

.header-item.selected .select-icon {
  background-color: $primary-color;
  border-color: $primary-color;
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

.bottom-actions .action-btn {
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
}

.btn-icon {
  font-size: $font-xl;
  margin-right: $spacing-xs;
}

/* 編輯表單 */
.edit-form {
  background-color: $bg-card;
  border-radius: $radius-lg $radius-lg 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg $spacing-xl;
  border-bottom: 1rpx solid $border-color;
}

.form-title {
  font-size: $font-xl;
  font-weight: bold;
  color: $text-primary;
}

.close-btn {
  font-size: $font-xxl;
  color: $text-secondary;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-lg $spacing-xl;
}

.form-item {
  margin-bottom: $spacing-lg;
}

.form-label {
  font-size: $font-md;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-sm;
  
  &.required::before {
    content: '* ';
    color: $danger-color;
  }
}

.type-tabs {
  display: flex;
  gap: $spacing-md;
}

.type-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-secondary;
  border: 2rpx solid transparent;
  
  &.active {
    background-color: rgba(47, 124, 246, 0.1);
    color: $primary-color;
    border-color: $primary-color;
    font-weight: bold;
  }
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
}

.checkbox-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg $spacing-xl;
  border-top: 1rpx solid $border-color;
}

.form-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: $radius-md;
  font-size: $font-md;
  border: none;
  
  &.cancel {
    background-color: $bg-page;
    color: $text-primary;
  }
  
  &.confirm {
    background-color: $primary-color;
    color: #FFFFFF;
  }
}
</style>

