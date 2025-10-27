<template>
  <view class="article-page">
    <swiper
      class="article-swiper"
      :current="currentIndex"
      @change="swiperChange"
      :duration="300"
      :vertical="true"
    >
      <swiper-item v-for="(article, index) in articles" :key="article.id">
        <view class="article-card" @tap="handleCardTap(article)">
          <!-- 視頻容器 -->
          <view class="video-container">
            <video
              v-if="index === currentIndex"
              :id="'video-' + article.id"
              class="article-video"
              :src="article.videoUrl"
              :autoplay="false"
              :loop="false"
              :controls="true"
              :show-center-play-btn="true"
              :show-fullscreen-btn="true"
              :enable-progress-gesture="true"
              object-fit="cover"
              @ended="videoEnded"
              @play="handleVideoPlay"
              @pause="handleVideoPause"
            ></video>
            <image 
              v-else 
              class="video-placeholder" 
              :src="article.posterUrl" 
              mode="aspectFill" 
            />
            
            <!-- 視頻遮罩層（顯示信息） -->
            <view class="video-overlay" v-if="!isPlaying">
              <view class="play-button" @tap="togglePlay">
                <text class="play-icon">▶️</text>
              </view>
            </view>
          </view>

          <!-- 文章內容 -->
          <view class="article-content">
            <!-- 作者信息欄 -->
            <view class="author-bar">
              <view class="author-info">
                <image class="author-avatar" :src="article.authorAvatar" mode="aspectFill" />
                <view class="author-details">
                  <text class="author-name">{{ article.author }}</text>
                  <text class="publish-time">{{ article.publishTime }}</text>
                </view>
              </view>
              <view class="follow-button" @tap="handleFollow(article)">
                <text class="follow-text">{{ article.isFollowed ? '已關注' : '+ 關注' }}</text>
              </view>
            </view>

            <!-- 文章標題和內容 -->
            <view class="article-main">
              <text class="article-title">{{ article.title }}</text>
              
              <!-- 原創性標籤 -->
              <view class="tags-row">
                <view :class="['originality-tag', article.originality]">
                  {{ getOriginalityText(article.originality) }}
                </view>
                <view v-for="tag in article.tags" :key="tag" class="content-tag">
                  #{{ tag }}
                </view>
              </view>

              <text class="article-text">{{ article.text }}</text>
            </view>

            <!-- 互動按鈕欄 -->
            <view class="action-bar">
              <view class="action-item" @tap="handleLike(article)">
                <text :class="['action-icon', { active: article.isLiked }]">
                  {{ article.isLiked ? '❤️' : '🤍' }}
                </text>
                <text class="action-text">{{ formatNumber(article.likes) }}</text>
              </view>

              <view class="action-item" @tap="handleComment(article)">
                <text class="action-icon">💬</text>
                <text class="action-text">{{ formatNumber(article.comments) }}</text>
              </view>

              <view class="action-item" @tap="handleCollect(article)">
                <text :class="['action-icon', { active: article.isCollected }]">
                  {{ article.isCollected ? '⭐' : '☆' }}
                </text>
                <text class="action-text">{{ formatNumber(article.collects) }}</text>
              </view>

              <view class="action-item" @tap="handleShare(article)">
                <text class="action-icon">📤</text>
                <text class="action-text">分享</text>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 側邊快捷操作欄 -->
    <view class="side-actions">
      <view class="side-action-item" @tap="handleSideLike">
        <text class="side-icon">❤️</text>
        <text class="side-text">{{ formatNumber(currentArticle?.likes || 0) }}</text>
      </view>
      <view class="side-action-item" @tap="handleSideComment">
        <text class="side-icon">💬</text>
        <text class="side-text">{{ formatNumber(currentArticle?.comments || 0) }}</text>
      </view>
      <view class="side-action-item" @tap="handleSideShare">
        <text class="side-icon">📤</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { formatNumber, formatRelativeTime } from '@/utils/common.js';

const articles = ref([]);
const currentIndex = ref(0);
const isPlaying = ref(false);

const currentArticle = computed(() => articles.value[currentIndex.value]);

const generateRandomColor = () => {
  const colors = ['#FF6B9D', '#2F7CF6', '#FFD400', '#52C41A', '#9C27B0'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getOriginalityText = (originality) => {
  switch (originality) {
    case 'original':
      return '原創';
    case 'non-original':
      return '轉載';
    case 'plagiarized':
      return '疑似抄襲';
    default:
      return '';
  }
};

const mockArticles = () => {
  const data = [];
  const originalityTypes = ['original', 'non-original', 'plagiarized'];
  const authors = ['張三', '李四', '王五', '趙六', '錢七', '小明', '小紅', '小華'];
  const tagsList = [
    ['科技', '數碼'],
    ['生活', '美食'],
    ['旅行', '攝影'],
    ['時尚', '穿搭'],
    ['運動', '健身']
  ];

  for (let i = 0; i < 10; i++) {
    const publishDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    data.push({
      id: i,
      videoUrl: `https://www.w3schools.com/html/mov_bbb.mp4?id=${i}`,
      posterUrl: `https://picsum.photos/720/480?random=${i}`,
      title: `精彩內容 ${i + 1}：探索 Uni-app 開發的無限可能`,
      text: `這是一篇關於 Uni-app 開發的精彩文章。Uni-app 是一個強大的跨平台框架，讓開發者能夠使用一套代碼，同時發布到多個平台，包括 iOS、Android、H5 和各種小程序。這極大地提高了開發效率和降低了維護成本。在當今快速變化的移動互聯網環境中，掌握 Uni-app 技術對於前端開發者來說至關重要。本篇文章將深入探討 Uni-app 的核心特性、最佳實踐以及未來發展方向，幫助你成為一名優秀的跨平台開發者。`,
      borderColor: generateRandomColor(),
      originality: originalityTypes[Math.floor(Math.random() * originalityTypes.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      authorAvatar: `https://picsum.photos/100/100?random=${i + 100}`,
      publishTime: formatRelativeTime(publishDate),
      tags: tagsList[Math.floor(Math.random() * tagsList.length)],
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 1000),
      collects: Math.floor(Math.random() * 5000),
      shares: Math.floor(Math.random() * 500),
      isLiked: false,
      isCollected: false,
      isFollowed: false,
    });
  }
  articles.value = data;
};

// 視頻控制
const playCurrentVideo = () => {
  nextTick(() => {
    const videoContext = uni.createVideoContext(`video-${articles.value[currentIndex.value].id}`);
    videoContext.play();
    isPlaying.value = true;
  });
};

const pauseCurrentVideo = () => {
  nextTick(() => {
    const videoContext = uni.createVideoContext(`video-${articles.value[currentIndex.value].id}`);
    videoContext.pause();
    isPlaying.value = false;
  });
};

const togglePlay = () => {
  if (isPlaying.value) {
    pauseCurrentVideo();
  } else {
    playCurrentVideo();
  }
};

const handleVideoPlay = () => {
  isPlaying.value = true;
};

const handleVideoPause = () => {
  isPlaying.value = false;
};

// Swiper 滑動事件
const swiperChange = (e) => {
  pauseCurrentVideo();
  currentIndex.value = e.detail.current;
  isPlaying.value = false;
};

const videoEnded = () => {
  isPlaying.value = false;
};

// 互動功能
const handleFollow = (article) => {
  article.isFollowed = !article.isFollowed;
  uni.showToast({
    title: article.isFollowed ? '已關注' : '已取消關注',
    icon: 'success'
  });
};

const handleLike = (article) => {
  article.isLiked = !article.isLiked;
  article.likes += article.isLiked ? 1 : -1;
  uni.showToast({
    title: article.isLiked ? '已點讚' : '已取消點讚',
    icon: 'success'
  });
};

const handleComment = (article) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${article.id}`
  });
};

const handleCardTap = (article) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${article.id}`
  });
};

const handleCollect = (article) => {
  article.isCollected = !article.isCollected;
  article.collects += article.isCollected ? 1 : -1;
  uni.showToast({
    title: article.isCollected ? '已收藏' : '已取消收藏',
    icon: 'success'
  });
};

const handleShare = (article) => {
  uni.showToast({
    title: '分享功能開發中',
    icon: 'none'
  });
};

// 側邊欄操作
const handleSideLike = () => {
  if (currentArticle.value) {
    handleLike(currentArticle.value);
  }
};

const handleSideComment = () => {
  if (currentArticle.value) {
    handleComment(currentArticle.value);
  }
};

const handleSideShare = () => {
  if (currentArticle.value) {
    handleShare(currentArticle.value);
  }
};

onMounted(() => {
  mockArticles();
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.article-page {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  position: relative;
}

.article-swiper {
  width: 100%;
  height: 100%;
}

.article-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000;
}

/* 視頻容器 */
.video-container {
  width: 100%;
  flex: 1;
  position: relative;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.article-video,
.video-placeholder {
  width: 100%;
  height: 100%;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.play-button {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: $radius-round;
  box-shadow: $shadow-lg;
}

.play-icon {
  font-size: 60rpx;
}

/* 文章內容 */
.article-content {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
  padding: $spacing-xl $spacing-lg;
  max-height: 50vh;
  overflow-y: auto;
}

/* 作者信息欄 */
.author-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.author-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-round;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.author-name {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-white;
}

.publish-time {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.7);
}

.follow-button {
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(135deg, $accent-color 0%, $error-color 100%);
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
}

.follow-text {
  font-size: $font-sm;
  color: $text-white;
  font-weight: $font-bold;
}

/* 文章主體 */
.article-main {
  margin-bottom: $spacing-lg;
}

.article-title {
  font-size: $font-xl;
  font-weight: $font-bold;
  color: $text-white;
  line-height: $line-height-md;
  margin-bottom: $spacing-md;
  display: block;
}

.tags-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;
}

.originality-tag {
  padding: 8rpx $spacing-md;
  border-radius: $radius-xl;
  font-size: $font-xs;
  color: $text-white;
  font-weight: $font-bold;

  &.original {
    background: linear-gradient(135deg, $info-color 0%, $primary-color 100%);
  }
  &.non-original {
    background: linear-gradient(135deg, #999 0%, #666 100%);
  }
  &.plagiarized {
    background: linear-gradient(135deg, $error-color 0%, #D32F2F 100%);
  }
}

.content-tag {
  padding: 8rpx $spacing-md;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: $radius-xl;
  font-size: $font-xs;
  color: $text-white;
}

.article-text {
  font-size: $font-md;
  color: rgba(255, 255, 255, 0.9);
  line-height: $line-height-lg;
  display: block;
}

/* 互動按鈕欄 */
.action-bar {
  display: flex;
  justify-content: space-around;
  padding: $spacing-md 0;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.action-icon {
  font-size: 48rpx;
  transition: all $transition-base;
  
  &.active {
    transform: scale(1.2);
  }
}

.action-text {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.8);
}

/* 側邊快捷操作欄 */
.side-actions {
  position: fixed;
  right: $spacing-lg;
  bottom: 200rpx;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
  z-index: $z-index-fixed;
}

.side-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.side-icon {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: $radius-round;
  backdrop-filter: blur(10rpx);
}

.side-text {
  font-size: $font-xs;
  color: $text-white;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
}
</style>

