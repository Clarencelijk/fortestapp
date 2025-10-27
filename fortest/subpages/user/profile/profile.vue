<template>
  <view class="profile-page">
    <!-- 頭像 -->
    <view class="avatar-section">
      <text class="section-label">頭像</text>
      <view class="section-content" @tap="handleChangeAvatar">
        <image class="avatar-image" :src="userInfo.avatar" mode="aspectFill" />
        <text class="section-arrow">></text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="info-section">
      <view class="info-item" @tap="handleEditNickname">
        <text class="item-label">昵稱</text>
        <view class="item-content">
          <text class="item-value">{{ userInfo.nickname }}</text>
          <text class="item-arrow">></text>
        </view>
      </view>

      <view class="info-item">
        <text class="item-label">用戶ID</text>
        <view class="item-content">
          <text class="item-value">{{ userInfo.userId }}</text>
          <button class="copy-button" @tap="handleCopyId">複製</button>
        </view>
      </view>

      <view class="info-item" @tap="handleEditGender">
        <text class="item-label">性別</text>
        <view class="item-content">
          <text class="item-value">{{ getGenderText(userInfo.gender) }}</text>
          <text class="item-arrow">></text>
        </view>
      </view>

      <view class="info-item" @tap="handleEditBirthday">
        <text class="item-label">生日</text>
        <view class="item-content">
          <text class="item-value">{{ userInfo.birthday || '未設置' }}</text>
          <text class="item-arrow">></text>
        </view>
      </view>

      <view class="info-item" @tap="handleEditRegion">
        <text class="item-label">地區</text>
        <view class="item-content">
          <text class="item-value">{{ userInfo.region || '未設置' }}</text>
          <text class="item-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 個人簡介 -->
    <view class="bio-section">
      <text class="section-label">個人簡介</text>
      <textarea 
        class="bio-textarea" 
        v-model="userInfo.bio"
        placeholder="介紹一下自己吧..."
        :maxlength="200"
        @blur="handleSaveBio"
      />
      <text class="char-count">{{ userInfo.bio.length }}/200</text>
    </view>

    <!-- 社交賬號 -->
    <view class="social-section">
      <text class="section-title">社交賬號</text>
      
      <view class="social-item" @tap="handleBindWechat">
        <view class="item-left">
          <text class="social-icon">💚</text>
          <text class="social-name">微信</text>
        </view>
        <view class="item-right">
          <text v-if="userInfo.wechat" class="bind-status">已綁定</text>
          <text v-else class="unbind-status">未綁定</text>
          <text class="item-arrow">></text>
        </view>
      </view>

      <view class="social-item" @tap="handleBindQQ">
        <view class="item-left">
          <text class="social-icon">🐧</text>
          <text class="social-name">QQ</text>
        </view>
        <view class="item-right">
          <text v-if="userInfo.qq" class="bind-status">已綁定</text>
          <text v-else class="unbind-status">未綁定</text>
          <text class="item-arrow">></text>
        </view>
      </view>

      <view class="social-item" @tap="handleBindWeibo">
        <view class="item-left">
          <text class="social-icon">🔴</text>
          <text class="social-name">微博</text>
        </view>
        <view class="item-right">
          <text v-if="userInfo.weibo" class="bind-status">已綁定</text>
          <text v-else class="unbind-status">未綁定</text>
          <text class="item-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 保存按鈕 -->
    <view class="save-section">
      <button class="save-button" @tap="handleSave">保存修改</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { showToast, showConfirm } from '@/utils/common.js';

// 用戶信息
const userInfo = ref({
  avatar: 'https://picsum.photos/200/200?random=999',
  nickname: '夏蓮先生',
  userId: '10086',
  gender: 'male',
  birthday: '1990-01-01',
  region: '廣東省 深圳市',
  bio: '這是一段個人簡介，介紹一下自己的興趣愛好和特長。',
  wechat: true,
  qq: false,
  weibo: false
});

const getGenderText = (gender) => {
  switch (gender) {
    case 'male': return '男';
    case 'female': return '女';
    default: return '保密';
  }
};

// 更換頭像
const handleChangeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0];
      showToast('頭像已更換', 'success');
    }
  });
};

// 編輯昵稱
const handleEditNickname = () => {
  uni.showModal({
    title: '修改昵稱',
    editable: true,
    placeholderText: '請輸入昵稱',
    content: userInfo.value.nickname,
    success: (res) => {
      if (res.confirm && res.content) {
        userInfo.value.nickname = res.content;
        showToast('昵稱已修改', 'success');
      }
    }
  });
};

// 複製ID
const handleCopyId = () => {
  uni.setClipboardData({
    data: userInfo.value.userId,
    success: () => {
      showToast('用戶ID已複製', 'success');
    }
  });
};

// 編輯性別
const handleEditGender = () => {
  uni.showActionSheet({
    itemList: ['男', '女', '保密'],
    success: (res) => {
      const genders = ['male', 'female', 'secret'];
      userInfo.value.gender = genders[res.tapIndex];
      showToast('性別已修改', 'success');
    }
  });
};

// 編輯生日
const handleEditBirthday = () => {
  // 實際項目中應該使用日期選擇器
  showToast('日期選擇功能開發中', 'none');
};

// 編輯地區
const handleEditRegion = () => {
  // 實際項目中應該使用地區選擇器
  showToast('地區選擇功能開發中', 'none');
};

// 保存簡介
const handleSaveBio = () => {
  showToast('簡介已保存', 'success');
};

// 綁定微信
const handleBindWechat = () => {
  if (userInfo.value.wechat) {
    showConfirm('確定要解綁微信嗎？', '提示')
      .then(() => {
        userInfo.value.wechat = false;
        showToast('已解綁微信', 'success');
      })
      .catch(() => {});
  } else {
    showToast('綁定微信功能開發中', 'none');
  }
};

// 綁定QQ
const handleBindQQ = () => {
  showToast('綁定QQ功能開發中', 'none');
};

// 綁定微博
const handleBindWeibo = () => {
  showToast('綁定微博功能開發中', 'none');
};

// 保存修改
const handleSave = () => {
  showToast('保存成功', 'success');
  setTimeout(() => {
    uni.navigateBack();
  }, 1000);
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.profile-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 160rpx;
}

/* 頭像區域 */
.avatar-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.section-label {
  font-size: $font-md;
  color: $text-secondary;
  display: block;
  margin-bottom: $spacing-md;
}

.section-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar-image {
  width: 128rpx;
  height: 128rpx;
  border-radius: $radius-round;
}

.section-arrow {
  font-size: $font-lg;
  color: $text-tertiary;
}

/* 基本信息 */
.info-section {
  background-color: $bg-card;
  margin-bottom: $spacing-md;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1rpx solid $border-light;
  transition: all $transition-base;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: $bg-hover;
  }
}

.item-label {
  font-size: $font-md;
  color: $text-secondary;
}

.item-content {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.item-value {
  font-size: $font-md;
  color: $text-primary;
}

.item-arrow {
  font-size: $font-lg;
  color: $text-tertiary;
}

.copy-button {
  padding: 4rpx $spacing-md;
  background-color: $bg-page;
  color: $primary-color;
  font-size: $font-xs;
  border-radius: $radius-sm;
}

/* 個人簡介 */
.bio-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.bio-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
  line-height: $line-height-lg;
  margin-top: $spacing-md;
  margin-bottom: $spacing-sm;
}

.char-count {
  font-size: $font-xs;
  color: $text-tertiary;
  text-align: right;
  display: block;
}

/* 社交賬號 */
.social-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-md;
  color: $text-secondary;
  display: block;
  margin-bottom: $spacing-md;
}

.social-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md 0;
  border-bottom: 1rpx solid $border-light;
  transition: all $transition-base;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    opacity: 0.7;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.social-icon {
  font-size: 40rpx;
}

.social-name {
  font-size: $font-md;
  color: $text-primary;
}

.item-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.bind-status {
  font-size: $font-sm;
  color: $success-color;
}

.unbind-status {
  font-size: $font-sm;
  color: $text-tertiary;
}

/* 保存按鈕 */
.save-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-lg;
  background-color: $bg-card;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.save-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-lg;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}
</style>

