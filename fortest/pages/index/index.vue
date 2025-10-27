<template>
  <view class="home">
    <!-- 頂部搜索欄 -->
    <view class="search-bar">
      <view class="search-input" @tap="handleSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索感興趣的內容...</text>
      </view>
    </view>

    <!-- 興趣選擇欄 -->
    <scroll-view 
      class="interest-scroll-bar" 
      scroll-x 
      enable-flex 
      :scroll-into-view="'tab-' + activeTabId" 
      scroll-with-animation
      show-scrollbar="false"
    >
      <view class="interest-tabs-container">
        <!-- 左側興趣選項卡 -->
        <text
          v-for="tab in leftInterestTabs"
          :key="tab.id"
          :id="'tab-' + tab.id"
          :class="['interest-tab', { active: activeTabId === tab.id }]"
          @tap="selectTab(tab.id)"
        >
          {{ tab.name }}
        </text>

        <!-- 主頁選項卡 -->
        <text
          id="tab-home"
          :class="['interest-tab', 'home-tab', { active: activeTabId === 'home' }]"
          @tap="selectTab('home')"
        >
          🏠 主頁
        </text>

        <!-- 右側興趣選項卡 -->
        <text
          v-for="tab in rightInterestTabs"
          :key="tab.id"
          :id="'tab-' + tab.id"
          :class="['interest-tab', { active: activeTabId === tab.id }]"
          @tap="selectTab(tab.id)"
        >
          {{ tab.name }}
        </text>

        <!-- 添加興趣按鈕 -->
        <text class="interest-tab add-button" @tap="showAddInterestModal = true">
          <text class="add-icon">+</text>
        </text>
      </view>
    </scroll-view>

    <!-- 內容區域 -->
    <scroll-view class="content-area" scroll-y @scrolltolower="loadMore">
      <template v-if="activeTabId === 'home'">
        <!-- 主頁內容 -->
        <!-- 輪播圖 -->
        <swiper 
          class="banner-swiper" 
          indicator-dots 
          indicator-active-color="#FFD400" 
          circular
          autoplay
          interval="3000"
        >
          <swiper-item v-for="(img, idx) in banners" :key="idx">
            <image class="banner-img" :src="img" mode="aspectFill" />
          </swiper-item>
        </swiper>

        <!-- 快捷入口 -->
        <view class="quick-entry">
          <view 
            v-for="entry in quickEntries" 
            :key="entry.id" 
            class="entry-item"
            @tap="handleEntryTap(entry)"
          >
            <view class="entry-icon-wrapper">
              <text class="entry-icon">{{ entry.icon }}</text>
            </view>
            <text class="entry-name">{{ entry.name }}</text>
          </view>
        </view>

        <!-- 推薦產品 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">🔥 熱門推薦</text>
            <text class="section-more" @tap="handleMoreTap">更多 ></text>
          </view>
          <view class="product-grid">
            <view 
              v-for="p in products" 
              :key="p.id" 
              class="product-card"
              @tap="handleProductTap(p)"
            >
              <image class="product-img" :src="p.pic" mode="aspectFill" />
              <view class="product-info">
                <text class="product-name text-ellipsis-2">{{ p.name }}</text>
                <view class="product-meta">
                  <text class="product-price">¥{{ p.price }}</text>
                  <text class="product-sales">{{ formatNumber(p.sales) }}人付款</text>
                </view>
                <view class="product-tags">
                  <text v-for="tag in p.tags" :key="tag" class="product-tag">{{ tag }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 排行榜 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">📊 熱門排行</text>
          </view>
          <scroll-view class="rank-scroll" scroll-x enable-flex show-scrollbar="false">
            <view v-for="rank in rankList" :key="rank.id" class="rank-panel">
              <view class="rank-header">
                <text class="rank-title">{{ rank.category }}</text>
                <text class="rank-subtitle">{{ rank.subtitle }}</text>
              </view>
              <view class="rank-list">
                <view 
                  v-for="(item, idx) in rank.list" 
                  :key="idx" 
                  class="rank-row"
                  @tap="handleRankItemTap(item)"
                >
                  <view class="rank-left">
                    <text :class="['rank-number', { 'top-three': idx < 3 }]">
                      {{ idx + 1 }}
                    </text>
                    <text class="rank-emoji">{{ item.emoji }}</text>
                  </view>
                  <view class="rank-content">
                    <text class="rank-name text-ellipsis">{{ item.name }}</text>
                    <text class="rank-desc">{{ item.desc }}</text>
                  </view>
                  <text class="rank-trend" v-if="item.trend">{{ item.trend }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </template>
      
      <template v-else>
        <!-- 興趣內容 -->
        <view class="interest-content">
          <view class="interest-header">
            <text class="interest-title">{{ activeTabName }}</text>
            <text class="interest-subtitle">為你精選的優質內容</text>
          </view>
          
          <!-- 篩選內容的產品 -->
          <view class="product-grid">
            <view 
              v-for="p in filteredProducts" 
              :key="p.id" 
              class="product-card"
              @tap="handleProductTap(p)"
            >
              <image class="product-img" :src="p.pic" mode="aspectFill" />
              <view class="product-info">
                <text class="product-name text-ellipsis-2">{{ p.name }}</text>
                <view class="product-meta">
                  <text class="product-price">¥{{ p.price }}</text>
                  <text class="product-sales">{{ formatNumber(p.sales) }}人付款</text>
                </view>
                <view class="product-tags">
                  <text v-for="tag in p.tags" :key="tag" class="product-tag">{{ tag }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 空狀態 -->
          <view v-if="filteredProducts.length === 0" class="empty-state">
            <text class="empty-icon">📦</text>
            <text class="empty-text">暫無相關內容</text>
            <text class="empty-hint">試試其他分類吧</text>
          </view>
        </view>
      </template>

      <!-- 加載更多 -->
      <view v-if="hasMore" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
      <view v-else class="no-more">
        <text class="no-more-text">沒有更多了</text>
      </view>
    </scroll-view>

    <!-- 新增興趣彈窗 -->
    <AddInterestModal 
      :show="showAddInterestModal" 
      @close="showAddInterestModal = false" 
      @add-interest="addInterest" 
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddInterestModal from '@/components/AddInterestModal.vue'
import { formatNumber } from '@/utils/common.js'

// 興趣標籤
const userInterests = ref([
  { id: 'camera', name: '📷 相機' },
  { id: 'furniture', name: '🪑 家具' },
  { id: 'toy', name: '🧸 玩具' },
  { id: 'lipstick', name: '💄 口紅' },
  { id: 'computer', name: '💻 電腦' },
]);

const activeTabId = ref('home');

const leftInterestTabs = computed(() => {
  const homeIndex = userInterests.value.findIndex(item => item.id === 'home');
  if (homeIndex !== -1) {
    return userInterests.value.slice(0, homeIndex);
  } else {
    return userInterests.value.slice(0, Math.floor(userInterests.value.length / 2));
  }
});

const rightInterestTabs = computed(() => {
  const homeIndex = userInterests.value.findIndex(item => item.id === 'home');
  if (homeIndex !== -1) {
    return userInterests.value.slice(homeIndex + 1);
  } else {
    return userInterests.value.slice(Math.floor(userInterests.value.length / 2));
  }
});

const activeTabName = computed(() => {
  if (activeTabId.value === 'home') {
    return '主頁';
  } else {
    const tab = userInterests.value.find(t => t.id === activeTabId.value);
    return tab ? tab.name : '';
  }
});

const selectTab = (id) => {
  activeTabId.value = id;
};

// 輪播圖
const banners = ref(
  Array.from({ length: 5 }, (_, i) => `https://picsum.photos/750/320?random=${i}`)
);

// 快捷入口
const quickEntries = ref([
  { id: 1, name: '新聞', icon: '📰' },
  { id: 2, name: '話題', icon: '💬' },
  { id: 3, name: '直播', icon: '📺' },
  { id: 4, name: '活動', icon: '🎉' },
]);

// 產品數據
const allProducts = ref([
  { id: 1, name: '索尼微單相機 A7M4 全畫幅專業攝影', category: 'camera', pic: `https://picsum.photos/300/300?random=101`, price: 15999, sales: 2580, tags: ['熱賣', '包郵'] },
  { id: 2, name: '人體工學電競椅 辦公椅舒適久坐', category: 'furniture', pic: `https://picsum.photos/300/300?random=102`, price: 1299, sales: 8920, tags: ['推薦'] },
  { id: 3, name: '智能護眼台燈 學生宿舍臥室床頭燈', category: 'furniture', pic: `https://picsum.photos/300/300?random=103`, price: 299, sales: 15600, tags: ['熱賣'] },
  { id: 4, name: 'VR 虛擬現實眼鏡 3D 遊戲設備', category: 'tech', pic: `https://picsum.photos/300/300?random=104`, price: 2999, sales: 3420, tags: ['新品'] },
  { id: 5, name: '富士拍立得相機 一次成像復古膠片', category: 'camera', pic: `https://picsum.photos/300/300?random=105`, price: 599, sales: 12300, tags: ['包郵'] },
  { id: 6, name: 'Xbox 無線遊戲手柄 藍牙連接', category: 'game', pic: `https://picsum.photos/300/300?random=106`, price: 399, sales: 6780, tags: ['熱賣'] },
  { id: 7, name: '機械鍵盤青軸茶軸紅軸電競遊戲', category: 'computer', pic: `https://picsum.photos/300/300?random=107`, price: 499, sales: 9540, tags: ['推薦'] },
  { id: 8, name: '專業化妝刷套裝 美妝工具全套', category: 'lipstick', pic: `https://picsum.photos/300/300?random=108`, price: 199, sales: 18900, tags: ['熱賣', '包郵'] },
  { id: 9, name: '樂高積木成人高難度建築系列', category: 'toy', pic: `https://picsum.photos/300/300?random=109`, price: 899, sales: 4560, tags: ['新品'] },
  { id: 10, name: '北歐布藝沙發小戶型客廳家具', category: 'furniture', pic: `https://picsum.photos/300/300?random=110`, price: 3299, sales: 2340, tags: ['推薦'] },
]);

const products = computed(() => {
  return allProducts.value.slice(0, 6);
});

const filteredProducts = computed(() => {
  if (activeTabId.value === 'home') {
    return products.value;
  } else {
    return allProducts.value.filter(p => p.category === activeTabId.value);
  }
});

// 排行榜
const rankList = ref([
  {
    category: '📷 相機排行',
    subtitle: '攝影愛好者的選擇',
    id: 'camera',
    list: [
      { emoji: '📷', name: '索尼 A7M4', desc: '全畫幅微單', trend: '🔥' },
      { emoji: '📸', name: '佳能 R6', desc: '專業攝影', trend: '↑' },
      { emoji: '🎞️', name: '富士 X-T5', desc: '復古風格', trend: '↑' },
      { emoji: '📹', name: '尼康 Z9', desc: '旗艦機型', trend: '→' },
      { emoji: '🥽', name: 'GoPro 12', desc: '運動相機', trend: '↓' },
    ]
  },
  {
    category: '🎮 遊戲排行',
    subtitle: '最受歡迎的遊戲',
    id: 'game',
    list: [
      { emoji: '🎮', name: '塞爾達王國之淚', desc: '開放世界', trend: '🔥' },
      { emoji: '🕹️', name: '艾爾登法環', desc: '魂系遊戲', trend: '↑' },
      { emoji: '🎯', name: 'Apex 英雄', desc: '射擊競技', trend: '→' },
      { emoji: '🏆', name: '英雄聯盟', desc: 'MOBA', trend: '↑' },
      { emoji: '⚔️', name: '原神', desc: '二次元', trend: '🔥' },
    ]
  },
  {
    category: '🪑 家具排行',
    subtitle: '打造舒適家居',
    id: 'furniture',
    list: [
      { emoji: '🪑', name: 'Herman Miller Aeron', desc: '人體工學椅', trend: '🔥' },
      { emoji: '🛋️', name: '宜家 SÖDERHAMN', desc: '布藝沙發', trend: '↑' },
      { emoji: '🛏️', name: '源氏木語實木床', desc: '日式風格', trend: '→' },
      { emoji: '🪴', name: '北歐風茶几', desc: '簡約設計', trend: '↑' },
      { emoji: '💡', name: 'Yeelight 吸頂燈', desc: '智能照明', trend: '🔥' },
    ]
  }
]);

// 新增興趣彈窗
const showAddInterestModal = ref(false);

const addInterest = (newInterest) => {
  if (!userInterests.value.some(item => item.id === newInterest.id)) {
    userInterests.value.push(newInterest);
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    });
  }
  showAddInterestModal.value = false;
};

// 加載更多
const hasMore = ref(true);

const loadMore = () => {
  // 模擬加載更多
  setTimeout(() => {
    hasMore.value = false;
  }, 1000);
};

// 事件處理
const handleSearch = () => {
  uni.navigateTo({
    url: '/pages/search/search'
  });
};

const handleEntryTap = (entry) => {
  if (entry.id === 1) {
    uni.navigateTo({ url: '/subpages/news/news' });
  } else if (entry.id === 2) {
    uni.navigateTo({ url: '/subpages/topic/topic' });
  } else {
    uni.showToast({
      title: entry.name + '功能開發中',
      icon: 'none'
    });
  }
};

const handleMoreTap = () => {
  uni.showToast({
    title: '更多功能開發中',
    icon: 'none'
  });
};

const handleProductTap = (product) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${product.id}`
  });
};

const handleRankItemTap = (item) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${item.id || 1}`
  });
};

const handleRankItemTapOld = (item) => {
  uni.showToast({
    title: '查看 ' + item.name,
    icon: 'none'
  });
};

// 初始化
onMounted(() => {
  setTimeout(() => {
    activeTabId.value = 'home';
  }, 100);
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.home {
  background-color: $bg-page;
  min-height: 100vh;
}

/* 搜索欄 */
.search-bar {
  padding: $spacing-md;
  background-color: $bg-card;
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

/* 興趣標籤欄 */
.interest-scroll-bar {
  width: 100%;
  white-space: nowrap;
  background-color: $bg-card;
  box-shadow: $shadow-sm;
  position: sticky;
  top: 0;
  z-index: $z-index-sticky;
}

.interest-tabs-container {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
}

.interest-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-xl;
  background: $bg-page;
  color: $text-secondary;
  font-size: $font-md;
  transition: all $transition-base;
  margin-right: $spacing-sm;
  flex-shrink: 0;
  white-space: nowrap;

  &.active {
    background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
    color: $text-white;
    font-weight: $font-bold;
    box-shadow: $shadow-md;
  }
}

.home-tab {
  margin: 0 $spacing-sm;
}

.add-button {
  background: linear-gradient(135deg, $accent-color 0%, $warning-color 100%);
  color: $text-white;
  font-weight: $font-bolder;
  margin-left: auto;
  margin-right: 0;
  
  .add-icon {
    font-size: $font-xl;
  }
}

/* 內容區域 */
.content-area {
  height: calc(100vh - 200rpx);
  padding: $spacing-md;
}

/* 輪播圖 */
.banner-swiper {
  height: 320rpx;
  border-radius: $radius-lg;
  overflow: hidden;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-md;
}

.banner-img {
  width: 100%;
  height: 100%;
}

/* 快捷入口 */
.quick-entry {
  display: flex;
  justify-content: space-around;
  padding: $spacing-lg 0;
  margin-bottom: $spacing-lg;
  background-color: $bg-card;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
}

.entry-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($info-color, 0.1) 100%);
  border-radius: $radius-lg;
  transition: all $transition-base;
  
  &:active {
    transform: scale(0.95);
  }
}

.entry-icon {
  font-size: 48rpx;
}

.entry-name {
  font-size: $font-sm;
  color: $text-secondary;
}

/* 區塊 */
.section {
  margin-bottom: $spacing-xl;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-xl;
  font-weight: $font-bold;
  color: $text-primary;
}

.section-more {
  font-size: $font-sm;
  color: $text-tertiary;
}

/* 產品網格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.product-card {
  background: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:active {
    transform: translateY(-4rpx);
    box-shadow: $shadow-md;
  }
}

.product-img {
  width: 100%;
  height: 320rpx;
  background-color: $bg-page;
}

.product-info {
  padding: $spacing-md;
}

.product-name {
  font-size: $font-md;
  color: $text-primary;
  font-weight: $font-medium;
  line-height: $line-height-md;
  height: 80rpx;
  margin-bottom: $spacing-sm;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
}

.product-price {
  font-size: $font-lg;
  color: $error-color;
  font-weight: $font-bold;
}

.product-sales {
  font-size: $font-xs;
  color: $text-tertiary;
}

.product-tags {
  display: flex;
  gap: $spacing-xs;
}

.product-tag {
  padding: 4rpx $spacing-sm;
  background-color: rgba($primary-color, 0.1);
  color: $primary-color;
  font-size: $font-xs;
  border-radius: $radius-sm;
}

/* 排行榜 */
.rank-scroll {
  white-space: nowrap;
}

.rank-panel {
  width: 90vw;
  padding: $spacing-lg;
  background-color: $bg-card;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  display: inline-flex;
  flex-direction: column;
  margin-right: $spacing-md;
}

.rank-header {
  margin-bottom: $spacing-md;
}

.rank-title {
  font-size: $font-xl;
  font-weight: $font-bold;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-xs;
}

.rank-subtitle {
  font-size: $font-sm;
  color: $text-tertiary;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.rank-row {
  display: flex;
  align-items: center;
  padding: $spacing-md;
  background: $bg-page;
  border-radius: $radius-md;
  transition: all $transition-base;
  
  &:active {
    background: $bg-hover;
  }
}

.rank-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  min-width: 120rpx;
}

.rank-number {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-sm;
  font-weight: $font-bold;
  color: $text-tertiary;
  background-color: $bg-card;
  border-radius: $radius-sm;
  
  &.top-three {
    background: linear-gradient(135deg, $warning-color 0%, $secondary-color 100%);
    color: $text-white;
  }
}

.rank-emoji {
  font-size: $font-xl;
}

.rank-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.rank-name {
  font-size: $font-md;
  color: $text-primary;
  font-weight: $font-medium;
}

.rank-desc {
  font-size: $font-xs;
  color: $text-tertiary;
}

.rank-trend {
  font-size: $font-lg;
  margin-left: $spacing-sm;
}

/* 興趣內容 */
.interest-content {
  min-height: 600rpx;
}

.interest-header {
  text-align: center;
  padding: $spacing-xl 0;
}

.interest-title {
  font-size: $font-xxl;
  font-weight: $font-bold;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.interest-subtitle {
  font-size: $font-md;
  color: $text-tertiary;
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
</style>

