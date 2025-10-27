<template>
  <view class="browse-history-page">
    <!-- 頂部操作欄 -->
    <view class="top-bar">
      <text class="total-count">共 {{ historyList.length }} 條記錄</text>
      <text class="clear-button" @tap="handleClearAll">清空</text>
    </view>

    <!-- 歷史列表 -->
    <scroll-view class="history-list" scroll-y @scrolltolower="loadMore">
      <!-- 按日期分組 -->
      <view v-for="group in groupedHistory" :key="group.date" class="history-group">
        <view class="group-header">
          <text class="group-date">{{ group.date }}</text>
        </view>
        
        <view 
          v-for="item in group.items" 
          :key="item.id" 
          class="history-item"
          @tap="handleItemTap(item)"
        >
          <image class="item-cover" :src="item.cover" mode="aspectFill" />
          <view class="item-content">
            <text class="item-title text-ellipsis-2">{{ item.title }}</text>
            <text class="item-time">{{ item.browseTime }}</text>
          </view>
          <view class="item-actions">
            <view class="action-button" @tap.stop="handleDelete(item)">
              <text class="action-icon">✕</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空狀態 -->
      <view v-if="historyList.length === 0" class="empty-state">
        <text class="empty-icon">🕒</text>
        <text class="empty-text">暫無瀏覽記錄</text>
        <text class="empty-hint">快去瀏覽感興趣的內容吧</text>
      </view>

      <!-- 加載更多 -->
      <view v-if="hasMore && historyList.length > 0" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { formatRelativeTime, showToast, showConfirm } from '@/utils/common.js';

// 歷史列表
const historyList = ref([]);
const hasMore = ref(true);

// 按日期分組
const groupedHistory = computed(() => {
  const groups = {};
  
  historyList.value.forEach(item => {
    const date = getDateLabel(new Date(item.browseTimestamp));
    if (!groups[date]) {
      groups[date] = {
        date,
        items: []
      };
    }
    groups[date].items.push(item);
  });
  
  return Object.values(groups);
});

// 獲取日期標籤
const getDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isSameDay(date, today)) {
    return '今天';
  } else if (isSameDay(date, yesterday)) {
    return '昨天';
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }
};

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// 模擬歷史數據
const mockHistory = () => {
  const list = [];
  const titles = [
    'Uni-app 開發實戰技巧',
    '前端性能優化指南',
    'Vue 3 新特性詳解',
    '移動端適配最佳實踐',
    '微信小程序開發心得',
    '跨平台開發經驗分享',
    'CSS 動畫效果集合',
    'JavaScript 進階技巧',
    '響應式設計案例',
    'UI 設計靈感收集'
  ];

  for (let i = 0; i < 30; i++) {
    const browseTimestamp = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000;
    list.push({
      id: i + 1,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i + 1}`,
      cover: `https://picsum.photos/200/150?random=${i + 400}`,
      browseTime: formatRelativeTime(new Date(browseTimestamp)),
      browseTimestamp
    });
  }
  
  // 按時間倒序排列
  list.sort((a, b) => b.browseTimestamp - a.browseTimestamp);
  historyList.value = list;
};

// 加載更多
const loadMore = () => {
  if (!hasMore.value) return;
  setTimeout(() => {
    hasMore.value = false;
  }, 1000);
};

// 點擊項目
const handleItemTap = (item) => {
  uni.navigateTo({
    url: `/pages/article-detail/article-detail?id=${item.id}`
  });
};

// 刪除單條
const handleDelete = (item) => {
  const index = historyList.value.findIndex(i => i.id === item.id);
  if (index > -1) {
    historyList.value.splice(index, 1);
  }
  showToast('已刪除', 'success');
};

// 清空全部
const handleClearAll = () => {
  if (historyList.value.length === 0) {
    showToast('暫無記錄', 'none');
    return;
  }
  
  showConfirm('確定要清空所有瀏覽記錄嗎？', '提示')
    .then(() => {
      historyList.value = [];
      showToast('已清空', 'success');
    })
    .catch(() => {});
};

onMounted(() => {
  mockHistory();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.browse-history-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 頂部操作欄 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  background-color: $bg-card;
  box-shadow: $shadow-sm;
}

.total-count {
  font-size: $font-md;
  color: $text-secondary;
}

.clear-button {
  font-size: $font-md;
  color: $error-color;
}

/* 歷史列表 */
.history-list {
  height: calc(100vh - 100rpx);
}

.history-group {
  margin-bottom: $spacing-lg;
}

.group-header {
  padding: $spacing-md $spacing-lg;
  background-color: $bg-page;
}

.group-date {
  font-size: $font-sm;
  color: $text-tertiary;
  font-weight: $font-bold;
}

.history-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background-color: $bg-card;
  border-bottom: 1rpx solid $border-light;
  transition: all $transition-base;
  
  &:active {
    background-color: $bg-hover;
  }
}

.item-cover {
  width: 160rpx;
  height: 120rpx;
  border-radius: $radius-md;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: $font-md;
  font-weight: $font-medium;
  color: $text-primary;
  line-height: $line-height-md;
}

.item-time {
  font-size: $font-xs;
  color: $text-tertiary;
}

.item-actions {
  display: flex;
  align-items: center;
}

.action-button {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-page;
  border-radius: $radius-round;
  
  &:active {
    background-color: $bg-hover;
  }
}

.action-icon {
  font-size: $font-lg;
  color: $text-tertiary;
}

/* 空狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xxl 0;
  min-height: 400rpx;
  justify-content: center;
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
.loading-more {
  text-align: center;
  padding: $spacing-lg 0;
}

.loading-text {
  font-size: $font-sm;
  color: $text-tertiary;
}
</style>

