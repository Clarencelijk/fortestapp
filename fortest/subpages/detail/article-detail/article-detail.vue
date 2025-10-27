<template>
  <view class="article-detail-page">
    <!-- 視頻/圖片區域 -->
    <view class="media-container">
      <video
        v-if="article.type === 'video'"
        class="article-video"
        :src="article.videoUrl"
        :poster="article.posterUrl"
        :controls="true"
        :show-center-play-btn="true"
        object-fit="cover"
      ></video>
      <swiper v-else-if="article.images && article.images.length > 0" class="image-swiper" indicator-dots>
        <swiper-item v-for="(img, idx) in article.images" :key="idx">
          <image class="article-image" :src="img" mode="aspectFill" @tap="previewImage(idx)" />
        </swiper-item>
      </swiper>
    </view>

    <!-- 內容區域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 文章信息 -->
      <view class="article-info">
        <text class="article-title">{{ article.title }}</text>
        
        <!-- 標籤 -->
        <view class="tags-row">
          <view :class="['originality-tag', article.originality]">
            {{ getOriginalityText(article.originality) }}
          </view>
          <view v-for="tag in article.tags" :key="tag" class="content-tag">
            #{{ tag }}
          </view>
        </view>

        <!-- 作者信息 -->
        <view class="author-section">
          <view class="author-info" @tap="handleAuthorTap">
            <image class="author-avatar" :src="article.authorAvatar" mode="aspectFill" />
            <view class="author-details">
              <text class="author-name">{{ article.author }}</text>
              <text class="publish-info">{{ article.publishTime }} · {{ article.readCount }}次閱讀</text>
            </view>
          </view>
          <button class="follow-button" @tap="handleFollow">
            {{ article.isFollowed ? '已關注' : '+ 關注' }}
          </button>
        </view>

        <!-- 文章內容 -->
        <view class="article-content">
          <text class="content-text">{{ article.content }}</text>
        </view>

        <!-- 統計信息 -->
        <view class="stats-bar">
          <view class="stat-item">
            <text class="stat-icon">👁️</text>
            <text class="stat-text">{{ formatNumber(article.readCount) }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">❤️</text>
            <text class="stat-text">{{ formatNumber(article.likes) }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">💬</text>
            <text class="stat-text">{{ formatNumber(article.comments) }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">⭐</text>
            <text class="stat-text">{{ formatNumber(article.collects) }}</text>
          </view>
        </view>
      </view>

      <!-- 評論區 -->
      <view class="comment-section">
        <view class="comment-header">
          <text class="comment-title">評論 {{ formatNumber(commentList.length) }}</text>
          <view class="sort-buttons">
            <text 
              :class="['sort-button', { active: sortType === 'hot' }]"
              @tap="switchSort('hot')"
            >
              熱門
            </text>
            <text 
              :class="['sort-button', { active: sortType === 'time' }]"
              @tap="switchSort('time')"
            >
              最新
            </text>
          </view>
        </view>

        <!-- 評論列表 -->
        <view class="comment-list">
          <view v-for="comment in commentList" :key="comment.id" class="comment-item">
            <image class="comment-avatar" :src="comment.avatar" mode="aspectFill" @tap="handleUserTap(comment)" />
            <view class="comment-content">
              <view class="comment-header-info">
                <text class="comment-username">{{ comment.username }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              
              <!-- 回復 -->
              <view v-if="comment.replies && comment.replies.length > 0" class="reply-list">
                <view v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                  <text class="reply-username">{{ reply.username }}</text>
                  <text class="reply-text">：{{ reply.content }}</text>
                </view>
                <text v-if="comment.replyCount > comment.replies.length" class="more-reply" @tap="handleMoreReply(comment)">
                  查看全部 {{ comment.replyCount }} 條回復 >
                </text>
              </view>

              <!-- 操作按鈕 -->
              <view class="comment-actions">
                <view class="action-button" @tap="handleCommentLike(comment)">
                  <text :class="['action-icon', { active: comment.isLiked }]">
                    {{ comment.isLiked ? '❤️' : '🤍' }}
                  </text>
                  <text class="action-text">{{ comment.likeCount || '點讚' }}</text>
                </view>
                <view class="action-button" @tap="handleReply(comment)">
                  <text class="action-icon">💬</text>
                  <text class="action-text">回復</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 加載更多 -->
          <view v-if="hasMoreComments" class="load-more" @tap="loadMoreComments">
            <text class="load-more-text">查看更多評論</text>
          </view>
        </view>
      </view>

      <!-- 相關推薦 -->
      <view class="recommend-section">
        <view class="section-title">相關推薦</view>
        <view class="recommend-list">
          <view 
            v-for="item in recommendList" 
            :key="item.id" 
            class="recommend-item"
            @tap="handleRecommendTap(item)"
          >
            <image class="recommend-image" :src="item.image" mode="aspectFill" />
            <view class="recommend-info">
              <text class="recommend-title text-ellipsis-2">{{ item.title }}</text>
              <view class="recommend-meta">
                <text class="meta-text">{{ item.author }}</text>
                <text class="meta-text">{{ formatNumber(item.likes) }}贊</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作欄 -->
    <view class="bottom-bar">
      <view class="input-wrapper" @tap="handleCommentInput">
        <text class="input-placeholder">說點什麼...</text>
      </view>
      <view class="action-buttons">
        <view class="action-btn" @tap="handleLike">
          <text :class="['btn-icon', { active: article.isLiked }]">
            {{ article.isLiked ? '❤️' : '🤍' }}
          </text>
          <text class="btn-text">{{ formatNumber(article.likes) }}</text>
        </view>
        <view class="action-btn" @tap="handleCollect">
          <text :class="['btn-icon', { active: article.isCollected }]">
            {{ article.isCollected ? '⭐' : '☆' }}
          </text>
          <text class="btn-text">{{ formatNumber(article.collects) }}</text>
        </view>
        <view class="action-btn" @tap="handleShare">
          <text class="btn-icon">📤</text>
          <text class="btn-text">分享</text>
        </view>
      </view>
    </view>

    <!-- 評論輸入彈窗 -->
    <view v-if="showCommentInput" class="comment-input-modal" @tap="closeCommentInput">
      <view class="comment-input-wrapper" @tap.stop="">
        <textarea 
          class="comment-textarea" 
          v-model="commentText" 
          placeholder="發表你的評論..."
          :focus="true"
          :maxlength="500"
        />
        <view class="input-actions">
          <text class="char-count">{{ commentText.length }}/500</text>
          <button class="send-button" @tap="sendComment">發送</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatNumber, formatRelativeTime, showToast } from '@/utils/common.js';

// 文章數據
const article = ref({
  id: 1,
  type: 'video', // video 或 image
  title: '探索 Uni-app 開發的無限可能',
  content: `Uni-app 是一個使用 Vue.js 開發所有前端應用的框架，開發者編寫一套代碼，可發布到iOS、Android、Web（響應式）、以及各種小程序（微信/支付寶/百度/頭條/飛書/QQ/快手/釘釘/淘寶）、快應用等多個平台。

在這個快速發展的移動互聯網時代，跨平台開發已經成為了開發者的首選。Uni-app 憑藉其強大的功能和靈活的架構，成為了眾多開發者的不二之選。

本文將深入探討 Uni-app 的核心特性、最佳實踐以及實戰技巧，幫助你快速掌握這個強大的框架。無論你是初學者還是有經驗的開發者，都能從中獲得寶貴的知識和經驗。

讓我們一起開啟 Uni-app 的學習之旅吧！`,
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  posterUrl: 'https://picsum.photos/750/420?random=1',
  images: [],
  tags: ['技術', 'uni-app', '前端開發'],
  originality: 'original',
  author: '技術大牛',
  authorAvatar: 'https://picsum.photos/100/100?random=50',
  publishTime: '2小時前',
  readCount: 15600,
  likes: 2580,
  comments: 368,
  collects: 1240,
  shares: 156,
  isLiked: false,
  isCollected: false,
  isFollowed: false,
});

// 評論數據
const commentList = ref([]);
const sortType = ref('hot'); // hot 或 time
const hasMoreComments = ref(true);

// 推薦列表
const recommendList = ref([]);

// 評論輸入
const showCommentInput = ref(false);
const commentText = ref('');
const replyTo = ref(null);

const getOriginalityText = (originality) => {
  switch (originality) {
    case 'original': return '原創';
    case 'non-original': return '轉載';
    case 'plagiarized': return '疑似抄襲';
    default: return '';
  }
};

// 模擬評論數據
const mockComments = () => {
  const comments = [];
  const usernames = ['小明', '小紅', '張三', '李四', '王五', '趙六', '錢七', '孫八'];
  const contents = [
    '寫得太好了，學到很多！',
    '感謝分享，非常實用',
    '期待更多這樣的內容',
    '講解得很清楚，贊！',
    '收藏了，慢慢學習',
    '有沒有完整的源碼？',
    '這個方法確實不錯',
    '已經關注了，繼續加油'
  ];

  for (let i = 0; i < 10; i++) {
    const hasReplies = Math.random() > 0.5;
    comments.push({
      id: i + 1,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      avatar: `https://picsum.photos/80/80?random=${i + 100}`,
      content: contents[Math.floor(Math.random() * contents.length)],
      time: formatRelativeTime(new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)),
      likeCount: Math.floor(Math.random() * 100),
      isLiked: false,
      replyCount: hasReplies ? Math.floor(Math.random() * 10) + 2 : 0,
      replies: hasReplies ? [
        {
          id: `${i}-1`,
          username: usernames[Math.floor(Math.random() * usernames.length)],
          content: '說得對！'
        },
        {
          id: `${i}-2`,
          username: usernames[Math.floor(Math.random() * usernames.length)],
          content: '同意你的觀點'
        }
      ] : []
    });
  }
  commentList.value = comments;
};

// 模擬推薦數據
const mockRecommend = () => {
  const list = [];
  for (let i = 0; i < 6; i++) {
    list.push({
      id: i + 1,
      title: `推薦內容 ${i + 1}：關於前端開發的最佳實踐`,
      image: `https://picsum.photos/200/150?random=${i + 200}`,
      author: `作者${i + 1}`,
      likes: Math.floor(Math.random() * 10000)
    });
  }
  recommendList.value = list;
};

// 圖片預覽
const previewImage = (index) => {
  uni.previewImage({
    urls: article.value.images,
    current: index
  });
};

// 切換排序
const switchSort = (type) => {
  sortType.value = type;
  showToast(`切換到${type === 'hot' ? '熱門' : '最新'}排序`, 'none');
};

// 加載更多評論
const loadMoreComments = () => {
  showToast('加載更多評論', 'none');
  setTimeout(() => {
    hasMoreComments.value = false;
  }, 1000);
};

// 點擊作者
const handleAuthorTap = () => {
  showToast('查看作者主頁', 'none');
};

// 關注
const handleFollow = () => {
  article.value.isFollowed = !article.value.isFollowed;
  showToast(article.value.isFollowed ? '已關注' : '已取消關注', 'success');
};

// 點讚
const handleLike = () => {
  article.value.isLiked = !article.value.isLiked;
  article.value.likes += article.value.isLiked ? 1 : -1;
  showToast(article.value.isLiked ? '已點讚' : '已取消點讚', 'success');
};

// 收藏
const handleCollect = () => {
  article.value.isCollected = !article.value.isCollected;
  article.value.collects += article.value.isCollected ? 1 : -1;
  showToast(article.value.isCollected ? '已收藏' : '已取消收藏', 'success');
};

// 分享
const handleShare = () => {
  uni.showActionSheet({
    itemList: ['分享到微信', '分享到朋友圈', '複製鏈接'],
    success: (res) => {
      showToast(`選擇了第 ${res.tapIndex + 1} 個選項`, 'none');
    }
  });
};

// 評論點讚
const handleCommentLike = (comment) => {
  comment.isLiked = !comment.isLiked;
  comment.likeCount = (comment.likeCount || 0) + (comment.isLiked ? 1 : -1);
};

// 回復評論
const handleReply = (comment) => {
  replyTo.value = comment;
  showCommentInput.value = true;
};

// 查看更多回復
const handleMoreReply = (comment) => {
  showToast('查看全部回復', 'none');
};

// 點擊用戶
const handleUserTap = (user) => {
  showToast(`查看 ${user.username} 的主頁`, 'none');
};

// 打開評論輸入
const handleCommentInput = () => {
  replyTo.value = null;
  showCommentInput.value = true;
};

// 關閉評論輸入
const closeCommentInput = () => {
  showCommentInput.value = false;
  commentText.value = '';
  replyTo.value = null;
};

// 發送評論
const sendComment = () => {
  if (!commentText.value.trim()) {
    showToast('請輸入評論內容', 'none');
    return;
  }

  showToast('評論成功', 'success');
  article.value.comments += 1;
  
  // 添加到評論列表
  commentList.value.unshift({
    id: Date.now(),
    username: '我',
    avatar: 'https://picsum.photos/80/80?random=999',
    content: commentText.value,
    time: '剛剛',
    likeCount: 0,
    isLiked: false,
    replyCount: 0,
    replies: []
  });

  closeCommentInput();
};

// 點擊推薦
const handleRecommendTap = (item) => {
  showToast(`查看：${item.title}`, 'none');
};

onMounted(() => {
  mockComments();
  mockRecommend();
  
  // 從路由參數獲取文章ID（實際項目中）
  // const articleId = getCurrentInstance().proxy.$route.query.id;
});
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.article-detail-page {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 120rpx;
}

/* 媒體容器 */
.media-container {
  width: 100%;
  background-color: #000;
}

.article-video {
  width: 100%;
  height: 420rpx;
}

.image-swiper {
  width: 100%;
  height: 420rpx;
}

.article-image {
  width: 100%;
  height: 100%;
}

/* 內容滾動區 */
.content-scroll {
  height: calc(100vh - 420rpx - 120rpx);
}

/* 文章信息 */
.article-info {
  padding: $spacing-lg;
  background-color: $bg-card;
  margin-bottom: $spacing-md;
}

.article-title {
  font-size: $font-xxl;
  font-weight: $font-bold;
  color: $text-primary;
  line-height: $line-height-md;
  display: block;
  margin-bottom: $spacing-md;
}

.tags-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
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
}

.content-tag {
  padding: 8rpx $spacing-md;
  background-color: rgba($primary-color, 0.1);
  color: $primary-color;
  border-radius: $radius-xl;
  font-size: $font-xs;
}

/* 作者區域 */
.author-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: $spacing-lg;
  border-bottom: 1rpx solid $border-light;
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
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.author-name {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
}

.publish-info {
  font-size: $font-xs;
  color: $text-tertiary;
}

.follow-button {
  padding: $spacing-sm $spacing-xl;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-sm;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}

/* 文章內容 */
.article-content {
  margin-bottom: $spacing-lg;
}

.content-text {
  font-size: $font-md;
  color: $text-primary;
  line-height: $line-height-lg;
  display: block;
}

/* 統計欄 */
.stats-bar {
  display: flex;
  justify-content: space-around;
  padding: $spacing-lg 0;
  border-top: 1rpx solid $border-light;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.stat-icon {
  font-size: $font-lg;
}

.stat-text {
  font-size: $font-sm;
  color: $text-secondary;
}

/* 評論區 */
.comment-section {
  background-color: $bg-card;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.comment-title {
  font-size: $font-xl;
  font-weight: $font-bold;
  color: $text-primary;
}

.sort-buttons {
  display: flex;
  gap: $spacing-md;
}

.sort-button {
  font-size: $font-sm;
  color: $text-tertiary;
  padding: $spacing-xs $spacing-md;
  
  &.active {
    color: $primary-color;
    font-weight: $font-bold;
  }
}

/* 評論列表 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.comment-item {
  display: flex;
  gap: $spacing-md;
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: $radius-round;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xs;
}

.comment-username {
  font-size: $font-sm;
  color: $text-secondary;
  font-weight: $font-bold;
}

.comment-time {
  font-size: $font-xs;
  color: $text-tertiary;
}

.comment-text {
  font-size: $font-md;
  color: $text-primary;
  line-height: $line-height-md;
  display: block;
  margin-bottom: $spacing-sm;
}

/* 回復列表 */
.reply-list {
  background-color: $bg-page;
  padding: $spacing-sm;
  border-radius: $radius-sm;
  margin-bottom: $spacing-sm;
}

.reply-item {
  font-size: $font-sm;
  color: $text-secondary;
  line-height: $line-height-md;
  margin-bottom: $spacing-xs;
}

.reply-username {
  color: $primary-color;
  font-weight: $font-bold;
}

.more-reply {
  font-size: $font-xs;
  color: $primary-color;
  display: block;
  margin-top: $spacing-xs;
}

/* 評論操作 */
.comment-actions {
  display: flex;
  gap: $spacing-xl;
}

.action-button {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.action-icon {
  font-size: $font-lg;
  
  &.active {
    transform: scale(1.2);
  }
}

.action-text {
  font-size: $font-xs;
  color: $text-tertiary;
}

/* 加載更多 */
.load-more {
  text-align: center;
  padding: $spacing-lg 0;
}

.load-more-text {
  font-size: $font-sm;
  color: $primary-color;
}

/* 推薦區域 */
.recommend-section {
  background-color: $bg-card;
  padding: $spacing-lg;
}

.section-title {
  font-size: $font-xl;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.recommend-item {
  display: flex;
  gap: $spacing-md;
}

.recommend-image {
  width: 200rpx;
  height: 150rpx;
  border-radius: $radius-md;
  flex-shrink: 0;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recommend-title {
  font-size: $font-md;
  color: $text-primary;
  line-height: $line-height-md;
}

.recommend-meta {
  display: flex;
  gap: $spacing-lg;
}

.meta-text {
  font-size: $font-xs;
  color: $text-tertiary;
}

/* 底部操作欄 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background-color: $bg-card;
  border-top: 1rpx solid $border-light;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  z-index: $z-index-fixed;
}

.input-wrapper {
  flex: 1;
  height: 64rpx;
  display: flex;
  align-items: center;
  padding: 0 $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-xl;
}

.input-placeholder {
  font-size: $font-sm;
  color: $text-tertiary;
}

.action-buttons {
  display: flex;
  gap: $spacing-lg;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.btn-icon {
  font-size: 40rpx;
  
  &.active {
    transform: scale(1.2);
  }
}

.btn-text {
  font-size: $font-xs;
  color: $text-tertiary;
}

/* 評論輸入彈窗 */
.comment-input-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $bg-mask;
  display: flex;
  align-items: flex-end;
  z-index: $z-index-modal;
}

.comment-input-wrapper {
  width: 100%;
  background-color: $bg-card;
  border-radius: $radius-xl $radius-xl 0 0;
  padding: $spacing-lg;
}

.comment-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.char-count {
  font-size: $font-xs;
  color: $text-tertiary;
}

.send-button {
  padding: $spacing-sm $spacing-xl;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-md;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}
</style>

