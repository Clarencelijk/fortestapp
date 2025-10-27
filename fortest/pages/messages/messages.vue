<template>
  <view class="messages-page">
    <!-- 頂部搜索欄 -->
    <view class="search-bar">
      <view class="search-input" @tap="handleSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索聊天記錄...</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y @scrolltolower="loadMore">
      <view 
        v-for="msg in messageList" 
        :key="msg.id" 
        class="message-item"
        @tap="handleMessageTap(msg)"
      >
        <view class="avatar-wrapper">
          <image class="message-avatar" :src="msg.avatar" mode="aspectFill" />
          <view v-if="msg.unread > 0" class="unread-badge">
            <text class="unread-text">{{ msg.unread > 99 ? '99+' : msg.unread }}</text>
          </view>
          <view v-if="msg.online" class="online-dot"></view>
        </view>

        <view class="message-content">
          <view class="message-header">
            <text class="message-name">{{ msg.name }}</text>
            <text class="message-time">{{ msg.time }}</text>
          </view>
          <view class="message-preview">
            <text v-if="msg.type === 'text'" class="preview-text text-ellipsis">{{ msg.lastMessage }}</text>
            <text v-else-if="msg.type === 'image'" class="preview-text">[圖片]</text>
            <text v-else-if="msg.type === 'video'" class="preview-text">[視頻]</text>
            <text v-else-if="msg.type === 'voice'" class="preview-text">[語音]</text>
            <text v-else class="preview-text">{{ msg.lastMessage }}</text>
            <view v-if="msg.muted" class="mute-icon">
              <text>🔕</text>
            </view>
          </view>
        </view>

        <view v-if="msg.pinned" class="pin-icon">
          <text>📌</text>
        </view>
      </view>

      <!-- 空狀態 -->
      <view v-if="messageList.length === 0" class="empty-state">
        <text class="empty-icon">💬</text>
        <text class="empty-text">暫無消息</text>
        <text class="empty-hint">快去和好友聊天吧</text>
      </view>

      <!-- 加載更多 -->
      <view v-if="hasMore && messageList.length > 0" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
      <view v-else-if="!hasMore && messageList.length > 0" class="no-more">
        <text class="no-more-text">沒有更多了</text>
      </view>
    </scroll-view>

    <!-- 底部快捷操作（可選） -->
    <view class="quick-actions">
      <view class="action-button" @tap="handleNewChat">
        <text class="action-icon">✉️</text>
        <text class="action-text">新建聊天</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatRelativeTime, showToast } from '@/utils/common.js';

// 消息列表
const messageList = ref([]);

// 是否有更多
const hasMore = ref(true);

// 模擬消息數據
const mockMessages = () => {
  const names = ['夏蓮先生', 'CCA', '小明', '小紅', '張三', '李四', '王五', '趙六'];
  const messages = [
    '今天在線',
    '[分享視頻]',
    '你好呀！',
    '晚上一起吃飯嗎？',
    '收到，謝謝！',
    '明天見~',
    '哈哈哈哈',
    '好的好的'
  ];
  const types = ['text', 'image', 'video', 'voice'];

  const data = [];
  for (let i = 0; i < names.length; i++) {
    const lastMessageTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    data.push({
      id: i + 1,
      name: names[i],
      avatar: `https://picsum.photos/100/100?random=${i + 200}`,
      lastMessage: messages[i],
      time: formatRelativeTime(lastMessageTime),
      type: i === 1 ? 'video' : types[Math.floor(Math.random() * types.length)],
      unread: i < 2 ? Math.floor(Math.random() * 10) : 0,
      online: i === 0,
      pinned: i === 0,
      muted: i === 3,
    });
  }
  messageList.value = data;
};

// 搜索
const handleSearch = () => {
  showToast('搜索功能開發中', 'none');
};

// 點擊消息
const handleMessageTap = (msg) => {
  if (msg.id === 1) {
    // 跳轉到聊天頁面
    uni.navigateTo({
      url: '/subpages/chat/chat'
    });
  } else {
    showToast(`打開與 ${msg.name} 的聊天`, 'none');
  }
  
  // 清除未讀
  msg.unread = 0;
};

// 加載更多
const loadMore = () => {
  setTimeout(() => {
    hasMore.value = false;
  }, 1000);
};

// 新建聊天
const handleNewChat = () => {
  showToast('新建聊天功能開發中', 'none');
};

onMounted(() => {
  mockMessages();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.messages-page {
  min-height: 100vh;
  background-color: $bg-page;
  display: flex;
  flex-direction: column;
}

/* 搜索欄 */
.search-bar {
  padding: $spacing-md;
  background-color: $bg-card;
  box-shadow: $shadow-sm;
}

.search-input {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding: 0 $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-xl;
}

.search-icon {
  font-size: $font-lg;
  margin-right: $spacing-sm;
}

.search-placeholder {
  font-size: $font-md;
  color: $text-tertiary;
}

/* 消息列表 */
.message-list {
  flex: 1;
  height: calc(100vh - 200rpx);
}

.message-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background-color: $bg-card;
  border-bottom: 1rpx solid $border-light;
  transition: all $transition-base;
  
  &:active {
    background-color: $bg-hover;
  }
}

/* 頭像 */
.avatar-wrapper {
  position: relative;
  margin-right: $spacing-md;
  flex-shrink: 0;
}

.message-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: $radius-md;
}

.unread-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $error-color;
  border-radius: $radius-round;
  border: 3rpx solid $bg-card;
  box-shadow: $shadow-sm;
}

.unread-text {
  font-size: $font-xs;
  color: $text-white;
  font-weight: $font-bold;
}

.online-dot {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 20rpx;
  height: 20rpx;
  background-color: $success-color;
  border-radius: $radius-round;
  border: 3rpx solid $bg-card;
}

/* 消息內容 */
.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  overflow: hidden;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.message-name {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
}

.message-time {
  font-size: $font-xs;
  color: $text-tertiary;
  flex-shrink: 0;
  margin-left: $spacing-sm;
}

.message-preview {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.preview-text {
  flex: 1;
  font-size: $font-md;
  color: $text-secondary;
  overflow: hidden;
}

.mute-icon {
  font-size: $font-md;
  flex-shrink: 0;
}

/* 置頂圖標 */
.pin-icon {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  font-size: $font-sm;
}

/* 空狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xxl 0;
  min-height: 400rpx;
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
.loading-more,
.no-more {
  text-align: center;
  padding: $spacing-lg 0;
}

.loading-text,
.no-more-text {
  font-size: $font-sm;
  color: $text-tertiary;
}

/* 快捷操作 */
.quick-actions {
  position: fixed;
  bottom: 120rpx;
  right: $spacing-lg;
  z-index: $z-index-fixed;
}

.action-button {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  transition: all $transition-base;
  
  &:active {
    transform: scale(0.95);
  }
}

.action-icon {
  font-size: $font-xl;
}

.action-text {
  font-size: $font-md;
  color: $text-white;
  font-weight: $font-bold;
}
</style>

