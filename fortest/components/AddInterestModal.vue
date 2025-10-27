<template>
  <view class="modal-mask" v-if="show" @touchmove.stop.prevent="" @tap="closeModal">
    <view class="modal-content" @tap.stop="">
      <view class="modal-header">
        <text class="modal-title">✨ 新增興趣</text>
        <text class="modal-close" @tap="closeModal">✕</text>
      </view>

      <view class="modal-body">
        <view class="input-group">
          <text class="input-label">興趣名稱</text>
          <input 
            class="modal-input" 
            v-model="newInterestName" 
            placeholder="例如：攝影、美食、旅行" 
            placeholder-class="input-placeholder"
          />
        </view>

        <view class="input-group">
          <text class="input-label">興趣標識 (ID)</text>
          <input 
            class="modal-input" 
            v-model="newInterestId" 
            placeholder="英文小寫，例如：photography" 
            placeholder-class="input-placeholder"
          />
          <text class="input-hint">用於系統識別，建議使用英文</text>
        </view>

        <!-- 快捷選擇（可選） -->
        <view class="quick-select">
          <text class="quick-title">快捷選擇</text>
          <view class="quick-tags">
            <text 
              v-for="tag in quickTags" 
              :key="tag.id" 
              class="quick-tag"
              @tap="selectQuickTag(tag)"
            >
              {{ tag.icon }} {{ tag.name }}
            </text>
          </view>
        </view>
      </view>

      <view class="modal-footer">
        <button class="modal-button cancel-button" @tap="closeModal">取消</button>
        <button class="modal-button confirm-button" @tap="confirmAdd">確認添加</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['close', 'add-interest']);

const newInterestName = ref('');
const newInterestId = ref('');

// 快捷標籤
const quickTags = ref([
  { id: 'music', name: '音樂', icon: '🎵' },
  { id: 'movie', name: '電影', icon: '🎬' },
  { id: 'food', name: '美食', icon: '🍔' },
  { id: 'travel', name: '旅行', icon: '✈️' },
  { id: 'sports', name: '運動', icon: '⚽' },
  { id: 'reading', name: '閱讀', icon: '📚' },
  { id: 'photography', name: '攝影', icon: '📷' },
  { id: 'gaming', name: '遊戲', icon: '🎮' },
]);

const closeModal = () => {
  newInterestName.value = '';
  newInterestId.value = '';
  emit('close');
};

const selectQuickTag = (tag) => {
  newInterestName.value = tag.icon + ' ' + tag.name;
  newInterestId.value = tag.id;
};

const confirmAdd = () => {
  if (!newInterestName.value.trim()) {
    uni.showToast({
      title: '請輸入興趣名稱',
      icon: 'none',
    });
    return;
  }
  
  if (!newInterestId.value.trim()) {
    uni.showToast({
      title: '請輸入興趣標識',
      icon: 'none',
    });
    return;
  }

  // 驗證 ID 格式（只允許小寫字母）
  if (!/^[a-z]+$/.test(newInterestId.value)) {
    uni.showToast({
      title: '興趣標識只能包含小寫英文字母',
      icon: 'none',
    });
    return;
  }

  emit('add-interest', { 
    id: newInterestId.value.toLowerCase(), 
    name: newInterestName.value 
  });
  closeModal();
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $bg-mask;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: $z-index-modal;
  animation: fadeIn $transition-base;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: $bg-card;
  border-radius: $radius-xl;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: $shadow-xl;
  animation: slideUp $transition-base;
}

@keyframes slideUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 頭部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xl $spacing-lg;
  border-bottom: 1rpx solid $border-light;
}

.modal-title {
  font-size: $font-xl;
  font-weight: $font-bold;
  color: $text-primary;
}

.modal-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-xxl;
  color: $text-tertiary;
  border-radius: $radius-round;
  transition: all $transition-base;
  
  &:active {
    background-color: $bg-hover;
  }
}

/* 主體 */
.modal-body {
  padding: $spacing-xl $spacing-lg;
  max-height: 60vh;
  overflow-y: auto;
}

.input-group {
  margin-bottom: $spacing-xl;
}

.input-label {
  display: block;
  font-size: $font-md;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.modal-input {
  width: 100%;
  height: 88rpx;
  padding: 0 $spacing-lg;
  background-color: $bg-page;
  border: 2rpx solid $border-light;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
  transition: all $transition-base;
  
  &:focus {
    border-color: $primary-color;
    background-color: $bg-card;
  }
}

.input-placeholder {
  color: $text-tertiary;
}

.input-hint {
  display: block;
  font-size: $font-xs;
  color: $text-tertiary;
  margin-top: $spacing-xs;
}

/* 快捷選擇 */
.quick-select {
  margin-top: $spacing-xl;
}

.quick-title {
  display: block;
  font-size: $font-md;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.quick-tag {
  padding: $spacing-sm $spacing-lg;
  background-color: $bg-page;
  border: 2rpx solid $border-light;
  border-radius: $radius-xl;
  font-size: $font-sm;
  color: $text-secondary;
  transition: all $transition-base;
  
  &:active {
    background-color: $primary-color;
    border-color: $primary-color;
    color: $text-white;
    transform: scale(0.95);
  }
}

/* 底部 */
.modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1rpx solid $border-light;
}

.modal-button {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  font-size: $font-lg;
  font-weight: $font-bold;
  transition: all $transition-base;
  
  &:active {
    transform: scale(0.98);
  }
}

.cancel-button {
  background-color: $bg-page;
  color: $text-secondary;
  border: 2rpx solid $border-color;
}

.confirm-button {
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  box-shadow: $shadow-md;
}
</style>

