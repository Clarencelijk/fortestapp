<template>
  <view class="my-collection-page">
    <!-- 頂部標籤 -->
    <scroll-view class="category-tabs" scroll-x show-scrollbar="false">
      <text 
        v-for="tab in categoryTabs" 
        :key="tab.id" 
        :class="['category-tab', { active: activeCategory === tab.id }]"
        @tap="switchCategory(tab.id)"
      >
        {{ tab.name }}
        <text v-if="tab.count" class="tab-count">({{ tab.count }})</text>
      </text>
    </scroll-view>

    <!-- 收藏列表 -->
    <scroll-view class="collection-list" scroll-y @scrolltolower="loadMore">
      <view 
        v-for="item in collectionList" 
        :key="item.id" 
        class="collection-item"
        @tap="handleItemTap(item)"
      >
        <image class="item-cover" :src="item.cover" mode="aspectFill" />
        <view class="item-content">
          <text class="item-title text-ellipsis-2">{{ item.title }}</text>
          <text class="item-desc text-ellipsis">{{ item.desc }}</text>
          <view class="item-meta">
            <text class="meta-author">{{ item.author }}</text>
            <text class="meta-time">{{ item.collectTime }}</text>
          </view>
        </view>
        <view class="item-actions">
          <view class="action-button" @tap.stop="handleUncollect(item)">
            <text class="action-icon">🗑️</text>
          </view>
        </view>
      </view>

      <!-- 空狀態 -->
      <view v-if="collectionList.length === 0" class="empty-state">
        <text class="empty-icon">⭐</text>
        <text class="empty-text">還沒有收藏</text>
        <text class="empty-hint">快去收藏喜歡的內容吧</text>
      </view>

      <!-- 加載更多 -->
      <view v-if="hasMore && collectionList.length > 0" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatRelativeTime, showToast, showConfirm } from '@/utils/common.js';

// 分類標籤
const categoryTabs = ref([
  { id: 'all', name: '全部', count: 128 },
  { id: 'article', name: '文章', count: 56 },
  { id: 'video', name: '視頻', count: 42 },
  { id: 'image', name: '圖片', count: 30 }
]);

const activeCategory = ref('all');

// 收藏列表
const collectionList = ref([]);
const hasMore = ref(true);

// 模擬收藏數據
const mockCollection = () => {
  const list = [];
  const titles = [
    'Uni-app 開發實戰技巧分享',
    '前端性能優化完整指南',
    'Vue 3 Composition API 詳解',
    '移動端適配最佳實踐方案',
    '微信小程序開發心得體會',
    '跨平台開發經驗總結',
    'CSS 動畫效果實現技巧',
    'JavaScript 進階知識點',
    '響應式設計經典案例',
    'UI 設計靈感素材收集'
  ];

  for (let i = 0; i < 20; i++) {
    list.push({
      id: i + 1,
      title: titles[Math.floor(Math.random() * titles.length)],
      desc: '這是一篇非常實用的技術文章，包含了豐富的實戰經驗和技巧分享。',
      cover: `https://picsum.photos/200/150?random=${i + 300}`,
      author: `作者${i + 1}`,
      collectTime: formatRelativeTime(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
      type: ['article', 'video', 'image'][Math.floor(Math.random() * 3)]
    });
  }
  collectionList.value = list;
};

// 切換分類
const switchCategory = (categoryId) => {
  activeCategory.value = categoryId;
  showToast(`切換到${categoryTabs.value.find(t => t.id === categoryId).name}`, 'none');
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

// 取消收藏
const handleUncollect = (item) => {
  showConfirm('確定要取消收藏嗎？', '提示')
    .then(() => {
      const index = collectionList.value.findIndex(i => i.id === item.id);
      if (index > -1) {
        collectionList.value.splice(index, 1);
      }
      showToast('已取消收藏', 'success');
    })
    .catch(() => {});
};

onMounted(() => {
  mockCollection();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.my-collection-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 分類標籤 */
.category-tabs {
  white-space: nowrap;
  padding: $spacing-md $spacing-lg;
  background-color: $bg-card;
  box-shadow: $shadow-sm;
}

.category-tab {
  display: inline-block;
  padding: $spacing-sm $spacing-lg;
  margin-right: $spacing-md;
  border-radius: $radius-xl;
  font-size: $font-md;
  color: $text-secondary;
  background-color: $bg-page;
  transition: all $transition-base;
  
  &.active {
    background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
    color: $text-white;
    font-weight: $font-bold;
  }
}

.tab-count {
  font-size: $font-xs;
  margin-left: 4rpx;
}

/* 收藏列表 */
.collection-list {
  height: calc(100vh - 120rpx);
  padding: $spacing-md;
}

.collection-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $bg-card;
  border-radius: $radius-lg;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:active {
    background-color: $bg-hover;
  }
}

.item-cover {
  width: 200rpx;
  height: 150rpx;
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
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
  line-height: $line-height-md;
  margin-bottom: $spacing-xs;
}

.item-desc {
  font-size: $font-sm;
  color: $text-secondary;
  line-height: $line-height-md;
  margin-bottom: $spacing-xs;
}

.item-meta {
  display: flex;
  gap: $spacing-lg;
}

.meta-author,
.meta-time {
  font-size: $font-xs;
  color: $text-tertiary;
}

.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.action-button {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-page;
  border-radius: $radius-md;
  
  &:active {
    background-color: $bg-hover;
  }
}

.action-icon {
  font-size: $font-xl;
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

