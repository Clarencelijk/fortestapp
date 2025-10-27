<template>
  <view class="chat-page">
    <!-- 商品信息卡片（可選） -->
    <view v-if="productInfo" class="product-card" @tap="viewProduct">
      <image class="product-image" :src="productInfo.productImage" mode="aspectFill" />
      <view class="product-info">
        <text class="product-name">{{ productInfo.productName }}</text>
        <text class="product-price">¥{{ productInfo.price.toFixed(2) }}</text>
      </view>
      <text class="view-btn">查看</text>
    </view>

    <!-- 消息列表 -->
    <scroll-view scroll-y :scroll-into-view="scrollToView" 
                 class="message-list" @scrolltoupper="loadMore">
      <view v-for="msg in messageList" :key="msg.messageId" 
            :id="'msg-' + msg.messageId"
            :class="['message-item', msg.senderType === 1 ? 'right' : 'left']">
        
        <!-- 頭像 -->
        <image class="avatar" :src="getAvatar(msg.senderType)" mode="aspectFill" />
        
        <!-- 消息內容 -->
        <view class="message-content">
          <!-- 文本消息 -->
          <view v-if="msg.messageType === 1" class="text-message">
            {{ msg.messageContent }}
          </view>
          
          <!-- 圖片消息 -->
          <image v-if="msg.messageType === 2" 
                 class="image-message" 
                 :src="msg.mediaUrl" 
                 mode="aspectFill"
                 @tap="previewImage(msg.mediaUrl)" />
          
          <!-- 商品卡片消息 -->
          <view v-if="msg.messageType === 4" class="product-message" @tap="viewProduct">
            <image :src="productInfo.productImage" mode="aspectFill" />
            <view class="product-detail">
              <text class="name">{{ productInfo.productName }}</text>
              <text class="price">¥{{ productInfo.price.toFixed(2) }}</text>
            </view>
          </view>
          
          <!-- 時間戳 -->
          <text class="message-time">{{ msg.createdAt }}</text>
        </view>
      </view>

      <!-- 加載更多 -->
      <view v-if="loadingMore" class="loading-more">
        <text>加載中...</text>
      </view>
    </scroll-view>

    <!-- 輸入欄 -->
    <view class="input-bar">
      <text class="icon-btn" @tap="showMoreActions">+</text>
      <input v-model="inputText" 
             class="input-field" 
             placeholder="輸入消息..."
             confirm-type="send"
             @confirm="sendMessage"
             @focus="onInputFocus" />
      <button class="send-btn" @tap="sendMessage">發送</button>
    </view>

    <!-- 更多操作面板 -->
    <view v-if="showActions" class="actions-panel">
      <view class="actions-grid">
        <view class="action-item" @tap="chooseImage">
          <text class="action-icon">📷</text>
          <text class="action-text">圖片</text>
        </view>
        <view class="action-item" @tap="sendProductCard">
          <text class="action-icon">🛍️</text>
          <text class="action-text">商品</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick, onLoad } from '@dcloudio/uni-app';
import { showToast } from '@/utils/common.js';

const sessionId = ref(null);
const sellerId = ref(null);
const sellerInfo = ref({});
const productInfo = ref(null);

const messageList = ref([]);
const inputText = ref('');
const scrollToView = ref('');
const loadingMore = ref(false);
const showActions = ref(false);

onLoad((options) => {
  sessionId.value = options.sessionId;
  sellerId.value = options.sellerId;
  
  if (options.productId) {
    loadProductInfo(options.productId);
  }
  
  loadSellerInfo();
  loadMessageList();
});

const loadSellerInfo = () => {
  sellerInfo.value = {
    sellerId: 1,
    sellerName: '深圳旗艦店',
    sellerAvatar: 'https://via.placeholder.com/100'
  };
  
  // 設置導航欄標題
  uni.setNavigationBarTitle({
    title: sellerInfo.value.sellerName
  });
};

const loadProductInfo = (productId) => {
  productInfo.value = {
    productId: 1,
    productName: '高端商務筆記本電腦 15.6英寸',
    productImage: 'https://via.placeholder.com/200',
    price: 15999.00
  };
};

const loadMessageList = () => {
  // 模擬數據
  messageList.value = [
    {
      messageId: 1,
      senderType: 2,
      messageType: 1,
      messageContent: '您好，有什麼可以幫助您的嗎？',
      isRead: true,
      createdAt: '10:30'
    },
    {
      messageId: 2,
      senderType: 1,
      messageType: 1,
      messageContent: '這款電腦有現貨嗎？',
      isRead: true,
      createdAt: '10:31'
    },
    {
      messageId: 3,
      senderType: 2,
      messageType: 1,
      messageContent: '有現貨的，您需要什麼配置呢？',
      isRead: true,
      createdAt: '10:32'
    }
  ];
  
  scrollToBottom();
};

const loadMore = () => {
  if (loadingMore.value) return;
  
  loadingMore.value = true;
  
  // 模擬加載更多
  setTimeout(() => {
    loadingMore.value = false;
  }, 1000);
};

const getAvatar = (senderType) => {
  if (senderType === 1) {
    // 用戶頭像
    return 'https://via.placeholder.com/100';
  } else {
    // 商家頭像
    return sellerInfo.value.sellerAvatar;
  }
};

const sendMessage = () => {
  if (!inputText.value.trim()) return;
  
  const newMessage = {
    messageId: Date.now(),
    senderType: 1,
    messageType: 1,
    messageContent: inputText.value,
    isRead: false,
    createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };
  
  messageList.value.push(newMessage);
  inputText.value = '';
  
  scrollToBottom();
  
  // 模擬商家回覆
  setTimeout(() => {
    const reply = {
      messageId: Date.now(),
      senderType: 2,
      messageType: 1,
      messageContent: '好的，我馬上為您查詢',
      isRead: false,
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    messageList.value.push(reply);
    scrollToBottom();
  }, 1500);
};

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const newMessage = {
        messageId: Date.now(),
        senderType: 1,
        messageType: 2,
        mediaUrl: res.tempFilePaths[0],
        isRead: false,
        createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      messageList.value.push(newMessage);
      scrollToBottom();
      showActions.value = false;
    }
  });
};

const sendProductCard = () => {
  if (!productInfo.value) {
    showToast('暫無商品信息', 'none');
    return;
  }
  
  const newMessage = {
    messageId: Date.now(),
    senderType: 1,
    messageType: 4,
    messageContent: '',
    isRead: false,
    createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };
  messageList.value.push(newMessage);
  scrollToBottom();
  showActions.value = false;
};

const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    current: url
  });
};

const viewProduct = () => {
  if (!productInfo.value) return;
  
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${productInfo.value.productId}`
  });
};

const showMoreActions = () => {
  showActions.value = !showActions.value;
};

const onInputFocus = () => {
  showActions.value = false;
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value.length > 0) {
      const lastMsg = messageList.value[messageList.value.length - 1];
      scrollToView.value = 'msg-' + lastMsg.messageId;
    }
  });
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

/* 商品信息卡片 */
.product-card {
  background-color: #FFF9E6;
  padding: $spacing-md;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid $border-color;
}

.product-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-sm;
  margin-right: $spacing-md;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: $font-sm;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: $spacing-xs;
}

.product-price {
  font-size: $font-md;
  font-weight: bold;
  color: $danger-color;
}

.view-btn {
  padding: 8rpx 20rpx;
  background-color: $primary-color;
  color: #FFFFFF;
  border-radius: $radius-sm;
  font-size: $font-sm;
}

/* 消息列表 */
.message-list {
  flex: 1;
  padding: $spacing-md;
}

.message-item {
  display: flex;
  margin-bottom: $spacing-lg;
  
  &.left {
    flex-direction: row;
  }
  
  &.right {
    flex-direction: row-reverse;
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-content {
  max-width: 500rpx;
  margin: 0 $spacing-md;
  display: flex;
  flex-direction: column;
}

.message-item.left .message-content {
  align-items: flex-start;
}

.message-item.right .message-content {
  align-items: flex-end;
}

.text-message {
  padding: $spacing-md $spacing-lg;
  background-color: #FFFFFF;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-item.right .text-message {
  background-color: #95EC69;
}

.image-message {
  max-width: 400rpx;
  max-height: 400rpx;
  border-radius: $radius-md;
}

.product-message {
  background-color: #FFFFFF;
  border-radius: $radius-md;
  padding: $spacing-md;
  display: flex;
  width: 400rpx;
}

.product-message image {
  width: 100rpx;
  height: 100rpx;
  border-radius: $radius-sm;
  margin-right: $spacing-md;
}

.product-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-detail .name {
  font-size: $font-sm;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-detail .price {
  font-size: $font-md;
  font-weight: bold;
  color: $danger-color;
}

.message-time {
  font-size: $font-sm;
  color: $text-disabled;
  margin-top: $spacing-xs;
}

.loading-more {
  text-align: center;
  padding: $spacing-md 0;
  font-size: $font-sm;
  color: $text-secondary;
}

/* 輸入欄 */
.input-bar {
  background-color: $bg-card;
  padding: $spacing-md;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  border-top: 1rpx solid $border-color;
}

.icon-btn {
  width: 60rpx;
  height: 60rpx;
  background-color: $bg-page;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-xl;
  color: $text-primary;
}

.input-field {
  flex: 1;
  height: 60rpx;
  padding: 0 $spacing-md;
  background-color: $bg-page;
  border-radius: 30rpx;
  font-size: $font-md;
}

.send-btn {
  padding: 0 $spacing-xl;
  height: 60rpx;
  line-height: 60rpx;
  background-color: $primary-color;
  color: #FFFFFF;
  border-radius: 30rpx;
  font-size: $font-md;
  border: none;
}

/* 更多操作面板 */
.actions-panel {
  background-color: $bg-card;
  padding: $spacing-lg;
  border-top: 1rpx solid $border-color;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 100rpx;
  height: 100rpx;
  background-color: $bg-page;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50rpx;
  margin-bottom: $spacing-sm;
}

.action-text {
  font-size: $font-sm;
  color: $text-secondary;
}
</style>

