<template>
  <view class="address-edit-page">
    <view class="form-section">
      <!-- 收貨人 -->
      <view class="form-item">
        <text class="form-label required">收貨人</text>
        <input class="form-input" v-model="formData.receiverName" 
               placeholder="請輸入收貨人姓名" maxlength="20" />
      </view>

      <!-- 手機號碼 -->
      <view class="form-item">
        <text class="form-label required">手機號碼</text>
        <input class="form-input" v-model="formData.receiverPhone" 
               type="number" placeholder="請輸入手機號" maxlength="11" />
      </view>

      <!-- 所在地區 -->
      <view class="form-item" @tap="showRegionPicker">
        <text class="form-label required">所在地區</text>
        <view class="form-picker">
          <text :class="['picker-text', { placeholder: !regionText }]">
            {{ regionText || '請選擇省市區' }}
          </text>
          <text class="picker-arrow">›</text>
        </view>
      </view>

      <!-- 詳細地址 -->
      <view class="form-item textarea-item">
        <text class="form-label required">詳細地址</text>
        <textarea class="form-textarea" v-model="formData.detailedAddress" 
                  placeholder="街道、樓牌號等詳細信息" maxlength="200" 
                  :show-confirm-bar="false" />
        <text class="char-count">{{ formData.detailedAddress.length }}/200</text>
      </view>

      <!-- 郵政編碼 -->
      <view class="form-item">
        <text class="form-label">郵政編碼</text>
        <input class="form-input" v-model="formData.postalCode" 
               type="number" placeholder="選填" maxlength="6" />
      </view>

      <!-- 設為默認地址 -->
      <view class="form-item switch-item">
        <text class="form-label">設為默認地址</text>
        <switch :checked="formData.isDefault" @change="toggleDefault" 
                color="#2F7CF6" />
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="save-btn" @tap="saveAddress">保存</button>
    </view>

    <!-- 地區選擇器 -->
    <picker mode="region" :value="regionValue" @change="onRegionChange">
      <view ref="regionPickerTrigger"></view>
    </picker>
  </view>
</template>

<script setup>
import { ref, computed, onLoad } from '@dcloudio/uni-app';
import { showToast } from '@/utils/common.js';

const addressId = ref(null);
const formData = ref({
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailedAddress: '',
  postalCode: '',
  isDefault: false
});

const regionValue = ref([]);
const regionText = computed(() => {
  if (formData.value.province && formData.value.city && formData.value.district) {
    return `${formData.value.province} ${formData.value.city} ${formData.value.district}`;
  }
  return '';
});

onLoad((options) => {
  if (options.addressId) {
    addressId.value = options.addressId;
    loadAddressDetail(options.addressId);
  }
});

const loadAddressDetail = (id) => {
  // 模擬數據
  formData.value = {
    receiverName: '張三',
    receiverPhone: '13800138000',
    province: '廣東省',
    city: '深圳市',
    district: '南山區',
    detailedAddress: '科技園南區深圳灣科技生態園10棟A座1001室',
    postalCode: '518000',
    isDefault: true
  };
  
  regionValue.value = [
    formData.value.province,
    formData.value.city,
    formData.value.district
  ];
};

const showRegionPicker = () => {
  // 觸發 picker 點擊
  const picker = document.querySelector('picker');
  if (picker) {
    picker.click();
  }
};

const onRegionChange = (e) => {
  const region = e.detail.value;
  formData.value.province = region[0];
  formData.value.city = region[1];
  formData.value.district = region[2];
  regionValue.value = region;
};

const toggleDefault = (e) => {
  formData.value.isDefault = e.detail.value;
};

const validateForm = () => {
  if (!formData.value.receiverName.trim()) {
    showToast('請輸入收貨人姓名', 'none');
    return false;
  }

  if (!formData.value.receiverPhone.trim()) {
    showToast('請輸入手機號碼', 'none');
    return false;
  }

  // 驗證手機號格式
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!phoneReg.test(formData.value.receiverPhone)) {
    showToast('請輸入正確的手機號碼', 'none');
    return false;
  }

  if (!formData.value.province || !formData.value.city || !formData.value.district) {
    showToast('請選擇所在地區', 'none');
    return false;
  }

  if (!formData.value.detailedAddress.trim()) {
    showToast('請輸入詳細地址', 'none');
    return false;
  }

  if (formData.value.detailedAddress.trim().length < 5) {
    showToast('詳細地址至少5個字符', 'none');
    return false;
  }

  return true;
};

const saveAddress = () => {
  if (!validateForm()) {
    return;
  }

  showToast('正在保存...', 'loading');

  // 模擬保存
  setTimeout(() => {
    showToast('保存成功', 'success');
    
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  }, 1000);
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.address-edit-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 表單區域 */
.form-section {
  background-color: $bg-card;
  padding: $spacing-lg $spacing-xl;
}

.form-item {
  margin-bottom: $spacing-xl;
  
  &:last-child {
    margin-bottom: 0;
  }
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

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
}

.form-picker {
  width: 100%;
  height: 80rpx;
  padding: 0 $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-text {
  flex: 1;
  font-size: $font-md;
  color: $text-primary;
  
  &.placeholder {
    color: $text-disabled;
  }
}

.picker-arrow {
  font-size: $font-xl;
  color: $text-disabled;
  transform: rotate(90deg);
}

.textarea-item {
  position: relative;
}

.form-textarea {
  width: 100%;
  min-height: 160rpx;
  padding: $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
}

.char-count {
  position: absolute;
  right: $spacing-md;
  bottom: $spacing-sm;
  font-size: $font-sm;
  color: $text-disabled;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .form-label {
    margin-bottom: 0;
  }
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

.save-btn {
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

