<template>
  <view class="my-page">
    <!-- 用戶信息卡片 -->
    <view class="user-card">
      <image class="bg-image" src="https://picsum.photos/750/400?random=bg" mode="aspectFill" />
      <view class="user-info">
        <view class="avatar-wrapper" @tap="changeAvatar">
          <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill" />
          <view class="avatar-edit-icon">
            <text class="edit-text">📷</text>
          </view>
        </view>
        <view class="user-details">
          <text class="user-name">{{ userInfo.name }}</text>
          <text class="user-id">ID：{{ userInfo.id }}</text>
          <text class="user-bio">{{ userInfo.bio }}</text>
        </view>
      </view>

      <!-- 用戶統計 -->
      <view class="user-stats">
        <view class="stat-item" @tap="handleStatTap('follow')">
          <text class="stat-value">{{ formatNumber(userInfo.followCount) }}</text>
          <text class="stat-label">關注</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @tap="handleStatTap('fans')">
          <text class="stat-value">{{ formatNumber(userInfo.fansCount) }}</text>
          <text class="stat-label">粉絲</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @tap="handleStatTap('likes')">
          <text class="stat-value">{{ formatNumber(userInfo.likesCount) }}</text>
          <text class="stat-label">獲贊</text>
        </view>
      </view>
    </view>

    <!-- 功能菜單 -->
    <view class="menu-section">
      <view class="menu-title">我的服務</view>
      <view class="menu-grid">
        <view 
          v-for="item in menuItems" 
          :key="item.id" 
          class="menu-item"
          @tap="handleMenuTap(item)"
        >
          <view class="menu-icon-wrapper" :style="{ background: item.color }">
            <text class="menu-icon">{{ item.icon }}</text>
          </view>
          <text class="menu-name">{{ item.name }}</text>
          <view v-if="item.badge" class="menu-badge">
            <text class="badge-text">{{ item.badge }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 設置列表 -->
    <view class="settings-section">
      <view class="settings-title">賬號與設置</view>
      <view class="settings-list">
        <view 
          v-for="item in settingItems" 
          :key="item.id" 
          class="setting-item"
          @tap="handleSettingTap(item)"
        >
          <view class="setting-left">
            <text class="setting-icon">{{ item.icon }}</text>
            <text class="setting-name">{{ item.name }}</text>
          </view>
          <view class="setting-right">
            <text v-if="item.value" class="setting-value">{{ item.value }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 登錄/登出按鈕 -->
    <view class="action-section">
      <button 
        v-if="!isLoggedIn" 
        class="login-button" 
        @tap="handleLogin"
      >
        登錄
      </button>
      <button 
        v-else 
        class="logout-button" 
        @tap="handleLogout"
      >
        退出登錄
      </button>
    </view>

    <!-- Vuex 測試（可選） -->
    <view v-if="false" class="debug-section">
      <text>Vuex userName: {{ userName }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { formatNumber, showToast, showConfirm } from '@/utils/common.js';

const store = useStore();

// 用戶信息
const userInfo = ref({
  name: '我的',
  id: '12345678',
  bio: '這個人很懶，什麼都沒有留下~',
  avatar: 'https://picsum.photos/200/200?random=avatar',
  followCount: 128,
  fansCount: 2580,
  likesCount: 15600,
});

// 是否登錄
const isLoggedIn = ref(false);

// Vuex 狀態
const userName = computed(() => store.state.userName);

// 功能菜單
const menuItems = ref([
  { id: 1, name: '我的作品', icon: '📝', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: '我的收藏', icon: '⭐', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, name: '瀏覽歷史', icon: '🕒', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, name: '我的訂單', icon: '📦', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', badge: '3' },
  { id: 5, name: '優惠券', icon: '🎫', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', badge: '5' },
  { id: 6, name: '積分商城', icon: '💎', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { id: 7, name: '邀請好友', icon: '👥', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 8, name: '客服中心', icon: '💬', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
]);

// 設置列表
const settingItems = ref([
  { id: 1, name: '個人信息', icon: '👤', value: '' },
  { id: 2, name: '實名認證', icon: '🆔', value: '未認證' },
  { id: 3, name: '手機驗證', icon: '📱', value: '已綁定' },
  { id: 4, name: '安全中心', icon: '🔒', value: '' },
  { id: 5, name: '隱私設置', icon: '🛡️', value: '' },
  { id: 6, name: '通知設置', icon: '🔔', value: '' },
  { id: 7, name: '清除緩存', icon: '🗑️', value: '32.5MB' },
  { id: 8, name: '關於我們', icon: 'ℹ️', value: 'v1.0.0' },
]);

// 更換頭像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0];
      showToast('頭像更換成功', 'success');
    },
    fail: () => {
      showToast('頭像更換失敗', 'error');
    }
  });
};

// 統計數據點擊
const handleStatTap = (type) => {
  const titles = {
    follow: '我的關注',
    fans: '我的粉絲',
    likes: '獲贊列表'
  };
  showToast(`查看${titles[type]}`, 'none');
};

// 菜單點擊
const handleMenuTap = (item) => {
  const routes = {
    1: '/subpages/user/my-works/my-works',
    2: '/subpages/user/my-collection/my-collection',
    3: '/subpages/user/browse-history/browse-history',
    4: '/subpages/transaction/my-orders/my-orders',
    5: '/subpages/transaction/coupons/coupons',
    6: '/subpages/transaction/points-mall/points-mall',
    7: '/subpages/social/invite/invite',
    8: '/subpages/social/customer-service/customer-service'
  };
  
  if (routes[item.id]) {
    uni.navigateTo({
      url: routes[item.id]
    });
  } else {
    showToast(`${item.name}功能開發中`, 'none');
  }
};

// 設置點擊
const handleSettingTap = (item) => {
  const routes = {
    1: '/subpages/user/profile/profile',
    2: '/subpages/user/settings/settings',  // 實名認證在設置頁
    3: '/subpages/user/settings/settings',  // 手機驗證在設置頁
    4: '/subpages/user/settings/settings',  // 安全中心在設置頁
    5: '/subpages/user/settings/settings',  // 隱私設置在設置頁
    6: '/subpages/user/settings/settings',  // 通知設置在設置頁
    8: '/subpages/user/about/about'
  };
  
  if (item.id === 7) {
    // 清除緩存
    showConfirm('確定要清除緩存嗎？', '提示')
      .then(() => {
        showToast('緩存清除成功', 'success');
        item.value = '0MB';
      })
      .catch(() => {});
  } else if (routes[item.id]) {
    uni.navigateTo({
      url: routes[item.id]
    });
  } else {
    showToast(`${item.name}功能開發中`, 'none');
  }
};

// 登錄
const handleLogin = () => {
  // 使用 Vuex action
  store.dispatch('login', '用戶名');
  isLoggedIn.value = true;
  userInfo.value.name = '蠟筆小心';
  showToast('登錄成功', 'success');
};

// 登出
const handleLogout = () => {
  showConfirm('確定要退出登錄嗎？', '提示')
    .then(() => {
      store.dispatch('logout');
      isLoggedIn.value = false;
      userInfo.value.name = '我的';
      showToast('已退出登錄', 'success');
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.my-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: $spacing-xxl;
}

/* 用戶信息卡片 */
.user-card {
  position: relative;
  background-color: $bg-card;
  border-radius: 0 0 $radius-xl $radius-xl;
  overflow: hidden;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-md;
}

.bg-image {
  width: 100%;
  height: 300rpx;
  opacity: 0.3;
}

.user-info {
  position: absolute;
  top: $spacing-xl;
  left: $spacing-lg;
  right: $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.avatar-wrapper {
  position: relative;
}

.user-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: $radius-round;
  border: 6rpx solid rgba(255, 255, 255, 0.9);
  box-shadow: $shadow-lg;
}

.avatar-edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $primary-color;
  border-radius: $radius-round;
  border: 4rpx solid $bg-card;
}

.edit-text {
  font-size: $font-md;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.user-name {
  font-size: $font-xxl;
  font-weight: $font-bold;
  color: $text-primary;
}

.user-id {
  font-size: $font-sm;
  color: $text-tertiary;
}

.user-bio {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
}

/* 用戶統計 */
.user-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: $spacing-xl $spacing-lg;
  margin-top: 120rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.stat-value {
  font-size: $font-xxl;
  font-weight: $font-bold;
  color: $text-primary;
}

.stat-label {
  font-size: $font-sm;
  color: $text-tertiary;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background-color: $border-light;
}

/* 功能菜單 */
.menu-section {
  margin: 0 $spacing-lg $spacing-lg;
}

.menu-title {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  padding: $spacing-lg;
  background-color: $bg-card;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.menu-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
}

.menu-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  transition: all $transition-base;
  
  &:active {
    transform: scale(0.95);
  }
}

.menu-icon {
  font-size: 48rpx;
}

.menu-name {
  font-size: $font-xs;
  color: $text-secondary;
  text-align: center;
}

.menu-badge {
  position: absolute;
  top: -8rpx;
  right: 8rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $error-color;
  border-radius: $radius-round;
  border: 3rpx solid $bg-card;
}

.badge-text {
  font-size: $font-xs;
  color: $text-white;
  font-weight: $font-bold;
}

/* 設置列表 */
.settings-section {
  margin: 0 $spacing-lg $spacing-lg;
}

.settings-title {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.settings-list {
  background-color: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
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

.setting-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.setting-icon {
  font-size: $font-xl;
}

.setting-name {
  font-size: $font-md;
  color: $text-primary;
}

.setting-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.setting-value {
  font-size: $font-sm;
  color: $text-tertiary;
}

.setting-arrow {
  font-size: $font-xxl;
  color: $text-disabled;
  font-weight: $font-normal;
}

/* 操作按鈕 */
.action-section {
  margin: $spacing-xl $spacing-lg;
}

.login-button,
.logout-button {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-white;
  box-shadow: $shadow-md;
  transition: all $transition-base;
  
  &:active {
    transform: scale(0.98);
  }
}

.login-button {
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
}

.logout-button {
  background: linear-gradient(135deg, $text-tertiary 0%, $text-secondary 100%);
}

/* 調試區域 */
.debug-section {
  margin: $spacing-lg;
  padding: $spacing-md;
  background-color: $bg-card;
  border-radius: $radius-md;
  font-size: $font-sm;
  color: $text-tertiary;
}
</style>

