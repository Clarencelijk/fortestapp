<template>
  <view class="points-mall-page">
    <!-- 積分頭部 -->
    <view class="points-header">
      <view class="points-card">
        <text class="points-label">我的積分</text>
        <text class="points-value">{{ userPoints }}</text>
      </view>
      <view class="points-actions">
        <view class="action-item" @tap="handleSignIn">
          <text class="action-icon">📅</text>
          <text class="action-text">簽到</text>
        </view>
        <view class="action-item" @tap="handlePointsRecord">
          <text class="action-icon">📋</text>
          <text class="action-text">明細</text>
        </view>
        <view class="action-item" @tap="handlePointsRule">
          <text class="action-icon">❓</text>
          <text class="action-text">規則</text>
        </view>
      </view>
    </view>

    <!-- 分類標籤 -->
    <scroll-view class="category-tabs" scroll-x show-scrollbar="false">
      <text 
        v-for="tab in categoryTabs" 
        :key="tab.id" 
        :class="['category-tab', { active: activeCategory === tab.id }]"
        @tap="switchCategory(tab.id)"
      >
        {{ tab.name }}
      </text>
    </scroll-view>

    <!-- 商品列表 -->
    <scroll-view class="goods-list" scroll-y @scrolltolower="loadMore">
      <view class="goods-grid">
        <view 
          v-for="goods in goodsList" 
          :key="goods.id" 
          class="goods-card"
          @tap="handleGoodsTap(goods)"
        >
          <image class="goods-image" :src="goods.image" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name text-ellipsis-2">{{ goods.name }}</text>
            <view class="goods-footer">
              <view class="goods-points">
                <text class="points-value">{{ goods.points }}</text>
                <text class="points-unit">積分</text>
              </view>
              <text v-if="goods.stock > 0" class="goods-stock">剩餘{{ goods.stock }}</text>
              <text v-else class="goods-soldout">已兌完</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加載更多 -->
      <view v-if="hasMore" class="loading-more">
        <text class="loading-text">加載中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatNumber, showToast } from '@/utils/common.js';

// 用戶積分
const userPoints = ref(8888);

// 分類標籤
const categoryTabs = ref([
  { id: 'all', name: '全部' },
  { id: 'coupon', name: '優惠券' },
  { id: 'goods', name: '實物商品' },
  { id: 'vip', name: '會員權益' },
  { id: 'course', name: '課程' }
]);

const activeCategory = ref('all');

// 商品列表
const goodsList = ref([]);
const hasMore = ref(true);

// 模擬商品數據
const mockGoods = () => {
  const goods = [];
  const names = [
    '10元優惠券',
    '20元優惠券',
    '50元優惠券',
    '會員月卡',
    '會員季卡',
    '會員年卡',
    '精美筆記本',
    '定制馬克杯',
    '品牌T恤',
    '無線耳機',
    '移動電源',
    '藍牙音箱',
    '前端開發課程',
    'UI設計課程',
    'Python入門課程'
  ];

  for (let i = 0; i < 20; i++) {
    goods.push({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      image: `https://picsum.photos/300/300?random=${i + 500}`,
      points: [100, 200, 500, 1000, 2000, 5000][Math.floor(Math.random() * 6)],
      stock: Math.floor(Math.random() * 100)
    });
  }
  goodsList.value = goods;
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

// 簽到
const handleSignIn = () => {
  showToast('簽到成功，獲得10積分', 'success');
  userPoints.value += 10;
};

// 積分明細
const handlePointsRecord = () => {
  showToast('積分明細功能開發中', 'none');
};

// 積分規則
const handlePointsRule = () => {
  uni.showModal({
    title: '積分規則',
    content: '1. 每日簽到可獲得10積分\n2. 發布內容可獲得20積分\n3. 邀請好友可獲得50積分\n4. 完成任務可獲得額外積分',
    showCancel: false
  });
};

// 點擊商品
const handleGoodsTap = (goods) => {
  if (goods.stock === 0) {
    showToast('商品已兌完', 'none');
    return;
  }
  
  if (userPoints.value < goods.points) {
    showToast('積分不足', 'none');
    return;
  }
  
  uni.showModal({
    title: '確認兌換',
    content: `確定要用 ${goods.points} 積分兌換「${goods.name}」嗎？`,
    success: (res) => {
      if (res.confirm) {
        userPoints.value -= goods.points;
        goods.stock -= 1;
        showToast('兌換成功', 'success');
      }
    }
  });
};

onMounted(() => {
  mockGoods();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.points-mall-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 積分頭部 */
.points-header {
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  padding: $spacing-xl $spacing-lg;
  margin-bottom: $spacing-md;
}

.points-card {
  text-align: center;
  margin-bottom: $spacing-lg;
}

.points-label {
  display: block;
  font-size: $font-md;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: $spacing-sm;
}

.points-value {
  font-size: 80rpx;
  color: $text-white;
  font-weight: $font-bold;
}

.points-actions {
  display: flex;
  justify-content: space-around;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.action-icon {
  font-size: 48rpx;
}

.action-text {
  font-size: $font-sm;
  color: $text-white;
}

/* 分類標籤 */
.category-tabs {
  white-space: nowrap;
  padding: $spacing-md $spacing-lg;
  background-color: $bg-card;
  margin-bottom: $spacing-md;
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

/* 商品列表 */
.goods-list {
  height: calc(100vh - 400rpx);
  padding: 0 $spacing-md;
}

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.goods-card {
  width: calc(50% - 8rpx);
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

.goods-image {
  width: 100%;
  height: 300rpx;
}

.goods-info {
  padding: $spacing-md;
}

.goods-name {
  font-size: $font-md;
  color: $text-primary;
  font-weight: $font-medium;
  line-height: $line-height-md;
  margin-bottom: $spacing-sm;
  min-height: 80rpx;
}

.goods-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods-points {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.points-value {
  font-size: $font-xl;
  color: $error-color;
  font-weight: $font-bold;
}

.points-unit {
  font-size: $font-xs;
  color: $error-color;
}

.goods-stock {
  font-size: $font-xs;
  color: $text-tertiary;
}

.goods-soldout {
  font-size: $font-xs;
  color: $error-color;
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

