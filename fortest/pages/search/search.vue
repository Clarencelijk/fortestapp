<template>
  <view class="search-page">
    <!-- 搜索欄 -->
    <view class="search-header">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="搜索感興趣的內容"
          confirm-type="search"
          @confirm="handleSearch"
          @input="handleInput"
          focus
        />
        <text v-if="searchKeyword" class="clear-icon" @tap="clearSearch">✕</text>
      </view>
      <text class="cancel-button" @tap="handleCancel">取消</text>
    </view>

    <!-- 搜索歷史 -->
    <view v-if="!searchKeyword && searchHistory.length > 0" class="search-history">
      <view class="history-header">
        <text class="history-title">搜索歷史</text>
        <text class="clear-history" @tap="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <text 
          v-for="(item, index) in searchHistory" 
          :key="index" 
          class="history-tag"
          @tap="selectHistory(item)"
        >
          {{ item }}
        </text>
      </view>
    </view>

    <!-- 熱門搜索 -->
    <view v-if="!searchKeyword" class="hot-search">
      <view class="hot-header">
        <text class="hot-title">🔥 熱門搜索</text>
      </view>
      <view class="hot-list">
        <view 
          v-for="(item, index) in hotSearchList" 
          :key="item.id" 
          class="hot-item"
          @tap="selectHotSearch(item)"
        >
          <text :class="['hot-rank', { 'top-three': index < 3 }]">{{ index + 1 }}</text>
          <text class="hot-keyword">{{ item.keyword }}</text>
          <text v-if="item.hot" class="hot-badge">熱</text>
          <text v-if="item.new" class="new-badge">新</text>
        </view>
      </view>
    </view>

    <!-- 搜索結果 -->
    <view v-if="searchKeyword && hasSearched" class="search-results">
      <view class="result-tabs">
        <text 
          v-for="tab in resultTabs" 
          :key="tab.id" 
          :class="['result-tab', { active: activeTab === tab.id }]"
          @tap="switchTab(tab.id)"
        >
          {{ tab.name }}
        </text>
      </view>

      <scroll-view class="result-list" scroll-y @scrolltolower="loadMore">
        <!-- 綜合結果 -->
        <view v-if="activeTab === 'all'">
          <view 
            v-for="item in searchResults" 
            :key="item.id" 
            class="result-item"
            @tap="handleResultTap(item)"
          >
            <image class="result-image" :src="item.image" mode="aspectFill" />
            <view class="result-content">
              <text class="result-title" v-html="highlightKeyword(item.title)"></text>
              <text class="result-desc">{{ item.desc }}</text>
              <view class="result-meta">
                <text class="meta-item">👤 {{ item.author }}</text>
                <text class="meta-item">❤️ {{ formatNumber(item.likes) }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 用戶結果 -->
        <view v-if="activeTab === 'user'">
          <view 
            v-for="user in userResults" 
            :key="user.id" 
            class="user-item"
            @tap="handleUserTap(user)"
          >
            <image class="user-avatar" :src="user.avatar" mode="aspectFill" />
            <view class="user-info">
              <text class="user-name">{{ user.name }}</text>
              <text class="user-bio">{{ user.bio }}</text>
            </view>
            <button class="follow-button">{{ user.isFollowed ? '已關注' : '+ 關注' }}</button>
          </view>
        </view>

        <!-- 空狀態 -->
        <view v-if="searchResults.length === 0 && hasSearched" class="empty-state">
          <text class="empty-icon">🔍</text>
          <text class="empty-text">未找到相關內容</text>
          <text class="empty-hint">試試其他關鍵詞吧</text>
        </view>

        <!-- 加載更多 -->
        <view v-if="hasMore && searchResults.length > 0" class="loading-more">
          <text class="loading-text">加載中...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatNumber, storage, showToast } from '@/utils/common.js';

const searchKeyword = ref('');
const hasSearched = ref(false);
const activeTab = ref('all');
const hasMore = ref(true);

// 搜索歷史
const searchHistory = ref([]);

// 熱門搜索
const hotSearchList = ref([
  { id: 1, keyword: 'uni-app 開發教程', hot: true },
  { id: 2, keyword: '最新數碼產品', hot: true },
  { id: 3, keyword: '旅行攻略', new: true },
  { id: 4, keyword: '美食推薦' },
  { id: 5, keyword: '攝影技巧' },
  { id: 6, keyword: '健身計劃', new: true },
  { id: 7, keyword: '時尚穿搭' },
  { id: 8, keyword: '遊戲攻略' },
]);

// 結果標籤
const resultTabs = ref([
  { id: 'all', name: '綜合' },
  { id: 'user', name: '用戶' },
  { id: 'article', name: '文章' },
  { id: 'video', name: '視頻' },
]);

// 搜索結果
const searchResults = ref([]);
const userResults = ref([]);

// 輸入事件
const handleInput = (e) => {
  // 可以在這裡實現實時搜索建議
};

// 搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    showToast('請輸入搜索關鍵詞', 'none');
    return;
  }

  hasSearched.value = true;
  
  // 添加到搜索歷史
  addToHistory(searchKeyword.value);
  
  // 模擬搜索結果
  mockSearchResults();
};

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = '';
  hasSearched.value = false;
  searchResults.value = [];
};

// 取消
const handleCancel = () => {
  uni.navigateBack();
};

// 選擇歷史
const selectHistory = (keyword) => {
  searchKeyword.value = keyword;
  handleSearch();
};

// 清空歷史
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '確定要清空搜索歷史嗎？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = [];
        storage.set('searchHistory', []);
        showToast('已清空', 'success');
      }
    }
  });
};

// 選擇熱門搜索
const selectHotSearch = (item) => {
  searchKeyword.value = item.keyword;
  handleSearch();
};

// 切換標籤
const switchTab = (tabId) => {
  activeTab.value = tabId;
  
  if (tabId === 'user') {
    mockUserResults();
  }
};

// 高亮關鍵詞
const highlightKeyword = (text) => {
  if (!searchKeyword.value) return text;
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi');
  return text.replace(regex, '<span style="color: #FF6B9D; font-weight: bold;">$1</span>');
};

// 添加到歷史
const addToHistory = (keyword) => {
  // 移除重複項
  const index = searchHistory.value.indexOf(keyword);
  if (index > -1) {
    searchHistory.value.splice(index, 1);
  }
  
  // 添加到開頭
  searchHistory.value.unshift(keyword);
  
  // 最多保留10條
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10);
  }
  
  // 保存到本地
  storage.set('searchHistory', searchHistory.value);
};

// 模擬搜索結果
const mockSearchResults = () => {
  const results = [];
  for (let i = 0; i < 10; i++) {
    results.push({
      id: i + 1,
      title: `${searchKeyword.value}相關內容 ${i + 1}`,
      desc: `這是關於${searchKeyword.value}的精彩內容描述，包含了豐富的信息和實用的技巧。`,
      image: `https://picsum.photos/200/200?random=${i + 300}`,
      author: `作者${i + 1}`,
      likes: Math.floor(Math.random() * 10000),
    });
  }
  searchResults.value = results;
};

// 模擬用戶結果
const mockUserResults = () => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      id: i + 1,
      name: `用戶${i + 1}`,
      bio: `這是用戶${i + 1}的個人簡介`,
      avatar: `https://picsum.photos/100/100?random=${i + 400}`,
      isFollowed: false,
    });
  }
  userResults.value = users;
};

// 加載更多
const loadMore = () => {
  setTimeout(() => {
    hasMore.value = false;
  }, 1000);
};

// 點擊結果
const handleResultTap = (item) => {
  showToast(`查看：${item.title}`, 'none');
};

// 點擊用戶
const handleUserTap = (user) => {
  showToast(`查看用戶：${user.name}`, 'none');
};

onMounted(() => {
  // 加載搜索歷史
  const history = storage.get('searchHistory');
  if (history) {
    searchHistory.value = history;
  }
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.search-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 搜索頭部 */
.search-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $bg-card;
  box-shadow: $shadow-sm;
}

.search-box {
  flex: 1;
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

.search-input {
  flex: 1;
  font-size: $font-md;
  color: $text-primary;
}

.clear-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-md;
  color: $text-tertiary;
  background-color: $bg-hover;
  border-radius: $radius-round;
}

.cancel-button {
  font-size: $font-md;
  color: $text-secondary;
}

/* 搜索歷史 */
.search-history {
  padding: $spacing-lg;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.history-title {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
}

.clear-history {
  font-size: $font-sm;
  color: $text-tertiary;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.history-tag {
  padding: $spacing-sm $spacing-lg;
  background-color: $bg-card;
  border-radius: $radius-xl;
  font-size: $font-sm;
  color: $text-secondary;
}

/* 熱門搜索 */
.hot-search {
  padding: $spacing-lg;
}

.hot-header {
  margin-bottom: $spacing-md;
}

.hot-title {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
}

.hot-list {
  background-color: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1rpx solid $border-light;
  
  &:last-child {
    border-bottom: none;
  }
}

.hot-rank {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-sm;
  font-weight: $font-bold;
  color: $text-tertiary;
  background-color: $bg-page;
  border-radius: $radius-sm;
  margin-right: $spacing-md;
  
  &.top-three {
    background: linear-gradient(135deg, $warning-color 0%, $secondary-color 100%);
    color: $text-white;
  }
}

.hot-keyword {
  flex: 1;
  font-size: $font-md;
  color: $text-primary;
}

.hot-badge,
.new-badge {
  padding: 4rpx $spacing-sm;
  font-size: $font-xs;
  color: $text-white;
  border-radius: $radius-sm;
  margin-left: $spacing-sm;
}

.hot-badge {
  background-color: $error-color;
}

.new-badge {
  background-color: $primary-color;
}

/* 搜索結果 */
.search-results {
  height: calc(100vh - 120rpx);
  display: flex;
  flex-direction: column;
}

.result-tabs {
  display: flex;
  background-color: $bg-card;
  padding: $spacing-sm $spacing-lg;
  box-shadow: $shadow-sm;
}

.result-tab {
  padding: $spacing-sm $spacing-lg;
  font-size: $font-md;
  color: $text-secondary;
  margin-right: $spacing-lg;
  transition: all $transition-base;
  
  &.active {
    color: $primary-color;
    font-weight: $font-bold;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background-color: $primary-color;
      border-radius: $radius-sm;
    }
  }
}

.result-list {
  flex: 1;
  padding: $spacing-md;
}

.result-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $bg-card;
  border-radius: $radius-lg;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-sm;
}

.result-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: $radius-md;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.result-title {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
  line-height: $line-height-md;
}

.result-desc {
  font-size: $font-sm;
  color: $text-secondary;
  line-height: $line-height-md;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-meta {
  display: flex;
  gap: $spacing-lg;
  margin-top: auto;
}

.meta-item {
  font-size: $font-xs;
  color: $text-tertiary;
}

/* 用戶結果 */
.user-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  background-color: $bg-card;
  border-radius: $radius-lg;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-sm;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: $radius-round;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.user-name {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
}

.user-bio {
  font-size: $font-sm;
  color: $text-secondary;
}

.follow-button {
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-sm;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}

/* 空狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xxl 0;
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

