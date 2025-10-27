<template>
  <view class="settings-page">
    <!-- 賬號安全 -->
    <view class="settings-section">
      <text class="section-title">賬號安全</text>
      <view class="settings-list">
        <view class="setting-item" @tap="handleRealName">
          <view class="item-left">
            <text class="item-icon">🆔</text>
            <text class="item-label">實名認證</text>
          </view>
          <view class="item-right">
            <text :class="['status-text', { verified: userSettings.realNameVerified }]">
              {{ userSettings.realNameVerified ? '已認證' : '未認證' }}
            </text>
            <text class="item-arrow">></text>
          </view>
        </view>

        <view class="setting-item" @tap="handlePhoneVerify">
          <view class="item-left">
            <text class="item-icon">📱</text>
            <text class="item-label">手機驗證</text>
          </view>
          <view class="item-right">
            <text class="status-text verified">{{ userSettings.phone }}</text>
            <text class="item-arrow">></text>
          </view>
        </view>

        <view class="setting-item" @tap="handleChangePassword">
          <view class="item-left">
            <text class="item-icon">🔒</text>
            <text class="item-label">修改密碼</text>
          </view>
          <text class="item-arrow">></text>
        </view>

        <view class="setting-item" @tap="handleSecurityCenter">
          <view class="item-left">
            <text class="item-icon">🛡️</text>
            <text class="item-label">安全中心</text>
          </view>
          <text class="item-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 隱私設置 -->
    <view class="settings-section">
      <text class="section-title">隱私設置</text>
      <view class="settings-list">
        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">👁️</text>
            <text class="item-label">誰可以看我的作品</text>
          </view>
          <view class="item-right">
            <text class="option-text">{{ getPrivacyText(userSettings.worksPrivacy) }}</text>
            <text class="item-arrow" @tap="handleWorksPrivacy">></text>
          </view>
        </view>

        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">💬</text>
            <text class="item-label">誰可以給我發消息</text>
          </view>
          <view class="item-right">
            <text class="option-text">{{ getPrivacyText(userSettings.messagePrivacy) }}</text>
            <text class="item-arrow" @tap="handleMessagePrivacy">></text>
          </view>
        </view>

        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">🔍</text>
            <text class="item-label">允許搜索到我</text>
          </view>
          <switch 
            :checked="userSettings.allowSearch" 
            @change="handleAllowSearchChange"
            color="#2F7CF6"
          />
        </view>

        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">📍</text>
            <text class="item-label">顯示我的位置</text>
          </view>
          <switch 
            :checked="userSettings.showLocation" 
            @change="handleShowLocationChange"
            color="#2F7CF6"
          />
        </view>
      </view>
    </view>

    <!-- 通知設置 -->
    <view class="settings-section">
      <text class="section-title">通知設置</text>
      <view class="settings-list">
        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">🔔</text>
            <text class="item-label">接收通知</text>
          </view>
          <switch 
            :checked="userSettings.notification" 
            @change="handleNotificationChange"
            color="#2F7CF6"
          />
        </view>

        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">❤️</text>
            <text class="item-label">點贊通知</text>
          </view>
          <switch 
            :checked="userSettings.likeNotification" 
            @change="handleLikeNotificationChange"
            color="#2F7CF6"
            :disabled="!userSettings.notification"
          />
        </view>

        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">💬</text>
            <text class="item-label">評論通知</text>
          </view>
          <switch 
            :checked="userSettings.commentNotification" 
            @change="handleCommentNotificationChange"
            color="#2F7CF6"
            :disabled="!userSettings.notification"
          />
        </view>

        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">👤</text>
            <text class="item-label">關注通知</text>
          </view>
          <switch 
            :checked="userSettings.followNotification" 
            @change="handleFollowNotificationChange"
            color="#2F7CF6"
            :disabled="!userSettings.notification"
          />
        </view>
      </view>
    </view>

    <!-- 通用設置 -->
    <view class="settings-section">
      <text class="section-title">通用設置</text>
      <view class="settings-list">
        <view class="setting-item" @tap="handleLanguage">
          <view class="item-left">
            <text class="item-icon">🌐</text>
            <text class="item-label">語言</text>
          </view>
          <view class="item-right">
            <text class="option-text">繁體中文</text>
            <text class="item-arrow">></text>
          </view>
        </view>

        <view class="setting-item" @tap="handleClearCache">
          <view class="item-left">
            <text class="item-icon">🗑️</text>
            <text class="item-label">清除緩存</text>
          </view>
          <view class="item-right">
            <text class="cache-size">128.5 MB</text>
            <text class="item-arrow">></text>
          </view>
        </view>

        <view class="setting-item" @tap="handleAbout">
          <view class="item-left">
            <text class="item-icon">ℹ️</text>
            <text class="item-label">關於我們</text>
          </view>
          <text class="item-arrow">></text>
        </view>

        <view class="setting-item" @tap="handleCheckUpdate">
          <view class="item-left">
            <text class="item-icon">🔄</text>
            <text class="item-label">檢查更新</text>
          </view>
          <view class="item-right">
            <text class="version-text">v1.0.0</text>
            <text class="item-arrow">></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登錄 -->
    <view class="logout-section">
      <button class="logout-button" @tap="handleLogout">退出登錄</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { showToast, showConfirm } from '@/utils/common.js';

// 用戶設置
const userSettings = ref({
  realNameVerified: false,
  phone: '138****8888',
  worksPrivacy: 'public',
  messagePrivacy: 'all',
  allowSearch: true,
  showLocation: false,
  notification: true,
  likeNotification: true,
  commentNotification: true,
  followNotification: true
});

const getPrivacyText = (privacy) => {
  switch (privacy) {
    case 'public': return '所有人';
    case 'friends': return '好友';
    case 'private': return '僅自己';
    default: return '';
  }
};

// 實名認證
const handleRealName = () => {
  showToast('實名認證功能開發中', 'none');
};

// 手機驗證
const handlePhoneVerify = () => {
  showToast('手機驗證功能開發中', 'none');
};

// 修改密碼
const handleChangePassword = () => {
  showToast('修改密碼功能開發中', 'none');
};

// 安全中心
const handleSecurityCenter = () => {
  showToast('安全中心功能開發中', 'none');
};

// 作品隱私
const handleWorksPrivacy = () => {
  uni.showActionSheet({
    itemList: ['所有人', '好友', '僅自己'],
    success: (res) => {
      const privacies = ['public', 'friends', 'private'];
      userSettings.value.worksPrivacy = privacies[res.tapIndex];
      showToast('設置已更新', 'success');
    }
  });
};

// 消息隱私
const handleMessagePrivacy = () => {
  uni.showActionSheet({
    itemList: ['所有人', '好友', '僅自己'],
    success: (res) => {
      const privacies = ['public', 'friends', 'private'];
      userSettings.value.messagePrivacy = privacies[res.tapIndex];
      showToast('設置已更新', 'success');
    }
  });
};

// 允許搜索
const handleAllowSearchChange = (e) => {
  userSettings.value.allowSearch = e.detail.value;
  showToast(e.detail.value ? '已開啟' : '已關閉', 'success');
};

// 顯示位置
const handleShowLocationChange = (e) => {
  userSettings.value.showLocation = e.detail.value;
  showToast(e.detail.value ? '已開啟' : '已關閉', 'success');
};

// 通知開關
const handleNotificationChange = (e) => {
  userSettings.value.notification = e.detail.value;
  if (!e.detail.value) {
    userSettings.value.likeNotification = false;
    userSettings.value.commentNotification = false;
    userSettings.value.followNotification = false;
  }
  showToast(e.detail.value ? '已開啟通知' : '已關閉通知', 'success');
};

const handleLikeNotificationChange = (e) => {
  userSettings.value.likeNotification = e.detail.value;
};

const handleCommentNotificationChange = (e) => {
  userSettings.value.commentNotification = e.detail.value;
};

const handleFollowNotificationChange = (e) => {
  userSettings.value.followNotification = e.detail.value;
};

// 語言設置
const handleLanguage = () => {
  showToast('語言設置功能開發中', 'none');
};

// 清除緩存
const handleClearCache = () => {
  showConfirm('確定要清除緩存嗎？', '提示')
    .then(() => {
      showToast('緩存已清除', 'success');
    })
    .catch(() => {});
};

// 關於我們
const handleAbout = () => {
  uni.navigateTo({
    url: '/pages/about/about'
  });
};

// 檢查更新
const handleCheckUpdate = () => {
  showToast('已是最新版本', 'success');
};

// 退出登錄
const handleLogout = () => {
  showConfirm('確定要退出登錄嗎？', '提示')
    .then(() => {
      showToast('已退出登錄', 'success');
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }, 1000);
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.settings-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: $spacing-lg;
}

/* 設置區塊 */
.settings-section {
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-sm;
  color: $text-tertiary;
  padding: $spacing-md $spacing-lg;
  display: block;
}

.settings-list {
  background-color: $bg-card;
}

.setting-item {
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

.item-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.item-icon {
  font-size: 40rpx;
}

.item-label {
  font-size: $font-md;
  color: $text-primary;
}

.item-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.status-text {
  font-size: $font-sm;
  color: $text-tertiary;
  
  &.verified {
    color: $success-color;
  }
}

.option-text,
.cache-size,
.version-text {
  font-size: $font-sm;
  color: $text-tertiary;
}

.item-arrow {
  font-size: $font-lg;
  color: $text-tertiary;
}

/* 退出登錄 */
.logout-section {
  padding: $spacing-lg;
}

.logout-button {
  width: 100%;
  height: 88rpx;
  background-color: $bg-card;
  color: $error-color;
  font-size: $font-lg;
  font-weight: $font-bold;
  border-radius: $radius-xl;
  border: 2rpx solid $error-color;
}
</style>

