<template>
  <view class="address-list-page">
    <!-- 地址列表 -->
    <view class="address-list">
      <view v-for="(address, index) in addressList" :key="address.addressId"
            :class="['address-item', { selected: selectedId === address.addressId }]"
            @tap="selectAddress(address)">
        <view class="address-content">
          <view class="address-header">
            <text class="receiver-name">{{ address.receiverName }}</text>
            <text class="receiver-phone">{{ address.receiverPhone }}</text>
            <text v-if="address.isDefault" class="default-badge">默認</text>
          </view>
          
          <view class="address-detail">
            <text class="address-icon">📍</text>
            <text class="address-text">
              {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detailedAddress }}
            </text>
          </view>
        </view>

        <view v-if="!isSelectMode" class="address-actions">
          <text class="action-icon edit" @tap.stop="editAddress(address)">✏️</text>
          <text class="action-icon delete" @tap.stop="deleteAddress(address)">🗑️</text>
        </view>

        <view v-if="isSelectMode" class="select-icon">
          <text v-if="selectedId === address.addressId">✓</text>
        </view>
      </view>

      <!-- 空狀態 -->
      <view v-if="addressList.length === 0" class="empty-state">
        <text class="empty-icon">📍</text>
        <text class="empty-text">暫無收貨地址</text>
        <text class="empty-desc">請添加收貨地址以便下單</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @tap="addAddress">
        <text class="btn-icon">+</text>
        添加新地址
      </button>
      <button v-if="isSelectMode && selectedId" class="action-btn primary" @tap="confirmSelect">
        確認選擇
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app';
import { showToast, showConfirm } from '@/utils/common.js';

const isSelectMode = ref(false);
const selectedId = ref(null);
const addressList = ref([]);

onLoad((options) => {
  if (options.mode === 'select') {
    isSelectMode.value = true;
  }
  loadAddressList();
});

const loadAddressList = () => {
  // 模擬數據
  addressList.value = [
    {
      addressId: 1,
      receiverName: '張三',
      receiverPhone: '138****8888',
      province: '廣東省',
      city: '深圳市',
      district: '南山區',
      detailedAddress: '科技園南區深圳灣科技生態園10棟A座1001室',
      postalCode: '518000',
      isDefault: true
    },
    {
      addressId: 2,
      receiverName: '李四',
      receiverPhone: '139****9999',
      province: '廣東省',
      city: '深圳市',
      district: '福田區',
      detailedAddress: '華強北路1001號深圳國際創新中心B座2002室',
      postalCode: '518000',
      isDefault: false
    }
  ];
};

const selectAddress = (address) => {
  if (isSelectMode.value) {
    selectedId.value = address.addressId;
  }
};

const confirmSelect = () => {
  if (!selectedId.value) {
    showToast('請選擇收貨地址', 'none');
    return;
  }

  const selected = addressList.value.find(a => a.addressId === selectedId.value);
  
  // 通過 eventChannel 傳遞數據
  const eventChannel = uni.getOpenerEventChannel();
  eventChannel.emit('selectAddress', selected);
  
  showToast('已選擇', 'success');
  setTimeout(() => {
    uni.navigateBack();
  }, 500);
};

const addAddress = () => {
  uni.navigateTo({
    url: '/subpages/address/address-edit/address-edit'
  });
};

const editAddress = (address) => {
  uni.navigateTo({
    url: `/subpages/address/address-edit/address-edit?addressId=${address.addressId}`
  });
};

const deleteAddress = (address) => {
  if (address.isDefault) {
    showToast('默認地址不能刪除', 'none');
    return;
  }

  showConfirm('確定要刪除此地址嗎？', '提示')
    .then(() => {
      const index = addressList.value.findIndex(a => a.addressId === address.addressId);
      addressList.value.splice(index, 1);
      showToast('刪除成功', 'success');
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.address-list-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 地址列表 */
.address-list {
  padding: $spacing-md;
}

.address-item {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  display: flex;
  align-items: center;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  
  &.selected {
    border-color: $primary-color;
    background-color: rgba(47, 124, 246, 0.05);
  }
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
}

.receiver-name {
  font-size: $font-lg;
  font-weight: bold;
  color: $text-primary;
  margin-right: $spacing-md;
}

.receiver-phone {
  font-size: $font-md;
  color: $text-secondary;
  margin-right: $spacing-md;
}

.default-badge {
  padding: 4rpx 12rpx;
  background-color: rgba(250, 173, 20, 0.1);
  color: $warning-color;
  border-radius: $radius-sm;
  font-size: $font-sm;
}

.address-detail {
  display: flex;
  align-items: flex-start;
}

.address-icon {
  font-size: $font-lg;
  margin-right: $spacing-sm;
  flex-shrink: 0;
}

.address-text {
  flex: 1;
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.6;
}

.address-actions {
  display: flex;
  gap: $spacing-lg;
  margin-left: $spacing-md;
}

.action-icon {
  font-size: 40rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: $bg-page;
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

.address-item.selected .select-icon {
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
}

.btn-icon {
  font-size: $font-xl;
  margin-right: $spacing-xs;
}
</style>

