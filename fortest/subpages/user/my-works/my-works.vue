<template>
  <view class="my-works-page">
    <!-- 頂部統計 -->
    <view class="stats-header">
      <view class="stat-card">
        <text class="stat-value">{{ formatNumber(stats.total) }}</text>
        <text class="stat-label">作品總數</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ formatNumber(stats.likes) }}</text>
        <text class="stat-label">獲贊總數</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ formatNumber(stats.views) }}</text>
        <text class="stat-label">瀏覽總數</text>
      </view>
    </view>

    <!-- 標籤篩選 -->
    <scroll-view class="filter-tabs" scroll-x show-scrollbar="false">
      <text 
        v-for="tab in filterTabs" 
        :key="tab.id" 
        :class="['filter-tab', { active: activeFilter === tab.id }]"
        @tap="switchFilter(tab.id)"
      >
        {{ tab.name }}
      </text>
    </scroll-view>

    <!-- 作品列表 -->
    <scroll-view class="works-list" scroll-y @scrolltolower="loadMore">
      <!-- 瀑布流佈局 -->
      <view class="waterfall-container">
        <view class="waterfall-column">
          <view 
            v-for="(item, index) in leftWorks" 
            :key="item.id" 
            class="work-card"
            @tap="handleWorkTap(item)"
          >
            <image class="work-image" :src="item.cover" mode="widthFix" />
            <view class="work-info">
              <text class="work-title text-ellipsis-2">{{ item.title }}</text>
              <view class="work-meta">
                <view class="meta-item">
                  <text class="meta-icon">❤️</text>
                  <text class="meta-text">{{ formatNumber(item.likes) }}</text>
                </view>
                <view class="meta-item">
                  <text class="meta-icon">👁️</text>
                  <text class="meta-text">{{ formatNumber(item.views) }}</text>
                </view>
              </view>
            </view>
            <!-- 狀態標籤 -->
            <view v-if="item.status !== 'published'" :class="['status-badge', item.status]">
              {{ getStatusText(item.status) }}
            </view>
          </view>
        </view>

        <view class="waterfall-column">
          <view 
            v-for="(item, index) in rightWorks" 
            :key="item.id" 
            class="work-card"
            @tap="handleWorkTap(item)"
          >
            <image class="work-image" :src="item.cover" mode="widthFix" />
            <view class="work-info">
              <text class="work-title text-ellipsis-2">{{ item.title }}</text>
              <view class="work-meta">
                <view class="meta-item">
                  <text class="meta-icon">❤️</text>
                  <text class="meta-text">{{ formatNumber(item.likes) }}</text>
                </view>
                <view class="meta-item">
                  <text class="meta-icon">👁️</text>
                  <text class="meta-text">{{ formatNumber(item.views) }}</text>
                </view>
              </view>
            </view>
            <view v-if="item.status !== 'published'" :class="['status-badge', item.status]">
              {{ getStatusText(item.status) }}
            </view>
          </view>
        </view>
      </view>

      <!-- 空狀態 -->
      <view v-if="worksList.length === 0" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">還沒有作品</text>
        <text class="empty-hint">快去創作你的第一個作品吧</text>
        <button class="create-button" @tap="handleCreate">立即創作</button>
      </view>

      <!-- 加載更多 -->
      <view v-if="hasMore && worksList.length > 0" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
      <view v-else-if="!hasMore && worksList.length > 0" class="no-more">
        <text class="no-more-text">沒有更多了</text>
      </view>
    </scroll-view>

    <!-- 浮動創作按鈕 -->
    <view class="float-button" @tap="handleCreate">
      <text class="float-icon">✏️</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { formatNumber, showToast } from '@/utils/common.js';

// 統計數據
const stats = ref({
  total: 128,
  likes: 25800,
  views: 156000
});

// 篩選標籤
const filterTabs = ref([
  { id: 'all', name: '全部' },
  { id: 'published', name: '已發布' },
  { id: 'draft', name: '草稿' },
  { id: 'reviewing', name: '審核中' },
  { id: 'rejected', name: '未通過' }
]);

const activeFilter = ref('all');

// 作品列表
const worksList = ref([]);
const hasMore = ref(true);

// 瀑布流分列
const leftWorks = computed(() => {
  return worksList.value.filter((_, index) => index % 2 === 0);
});

const rightWorks = computed(() => {
  return worksList.value.filter((_, index) => index % 2 === 1);
});

const getStatusText = (status) => {
  switch (status) {
    case 'draft': return '草稿';
    case 'reviewing': return '審核中';
    case 'rejected': return '未通過';
    case 'published': return '已發布';
    default: return '';
  }
};

// 模擬作品數據
const mockWorks = () => {
  const works = [];
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
  
  const statuses = ['published', 'published', 'published', 'draft', 'reviewing'];

  for (let i = 0; i < 20; i++) {
    const height = 200 + Math.random() * 200;
    works.push({
      id: i + 1,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i + 1}`,
      cover: `https://picsum.photos/350/${Math.floor(height)}?random=${i + 100}`,
      likes: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 20000),
      comments: Math.floor(Math.random() * 500),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  worksList.value = works;
};

// 切換篩選
const switchFilter = (filterId) => {
  activeFilter.value = filterId;
  showToast(`切換到${filterTabs.value.find(t => t.id === filterId).name}`, 'none');
  // 實際項目中這裡應該重新請求數據
};

// 加載更多
const loadMore = () => {
  if (!hasMore.value) return;
  setTimeout(() => {
    hasMore.value = false;
  }, 1000);
};

// 點擊作品
const handleWorkTap = (work) => {
  uni.navigateTo({
    url: `/pages/article-detail/article-detail?id=${work.id}`
  });
};

// 創作
const handleCreate = () => {
  showToast('創作功能開發中', 'none');
};

onMounted(() => {
  mockWorks();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.my-works-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 統計頭部 */
.stats-header {
  display: flex;
  padding: $spacing-lg;
  background-color: $bg-card;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-sm;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.stat-value {
  font-size: $font-xxl;
  font-weight: $font-bold;
  color: $primary-color;
}

.stat-label {
  font-size: $font-sm;
  color: $text-tertiary;
}

/* 篩選標籤 */
.filter-tabs {
  white-space: nowrap;
  padding: $spacing-md $spacing-lg;
  background-color: $bg-card;
  margin-bottom: $spacing-md;
}

.filter-tab {
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

/* 作品列表 */
.works-list {
  height: calc(100vh - 300rpx);
  padding: 0 $spacing-md;
}

/* 瀑布流佈局 */
.waterfall-container {
  display: flex;
  gap: $spacing-md;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.work-card {
  position: relative;
  background-color: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:active {
    transform: translateY(-4rpx);
    box-shadow: $shadow-md;
  }
}

.work-image {
  width: 100%;
  display: block;
}

.work-info {
  padding: $spacing-md;
}

.work-title {
  font-size: $font-md;
  color: $text-primary;
  font-weight: $font-medium;
  line-height: $line-height-md;
  margin-bottom: $spacing-sm;
  display: block;
}

.work-meta {
  display: flex;
  gap: $spacing-lg;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.meta-icon {
  font-size: $font-md;
}

.meta-text {
  font-size: $font-xs;
  color: $text-tertiary;
}

/* 狀態標籤 */
.status-badge {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  padding: 4rpx $spacing-md;
  border-radius: $radius-sm;
  font-size: $font-xs;
  color: $text-white;
  font-weight: $font-bold;
  
  &.draft {
    background-color: $text-tertiary;
  }
  &.reviewing {
    background-color: $warning-color;
  }
  &.rejected {
    background-color: $error-color;
  }
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
  margin-bottom: $spacing-xl;
}

.create-button {
  padding: $spacing-md $spacing-xxl;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-md;
  font-weight: $font-bold;
  border-radius: $radius-xl;
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

/* 浮動按鈕 */
.float-button {
  position: fixed;
  right: $spacing-xl;
  bottom: 120rpx;
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $accent-color 0%, $error-color 100%);
  border-radius: $radius-round;
  box-shadow: $shadow-xl;
  z-index: $z-index-fixed;
  
  &:active {
    transform: scale(0.95);
  }
}

.float-icon {
  font-size: 48rpx;
}
</style>

