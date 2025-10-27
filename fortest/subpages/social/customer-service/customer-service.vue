<template>
  <view class="customer-service-page">
    <!-- 頂部卡片 -->
    <view class="service-header">
      <text class="header-title">客服中心</text>
      <text class="header-subtitle">我們隨時為您服務</text>
    </view>

    <!-- 聯繫方式 -->
    <view class="contact-section">
      <text class="section-title">聯繫我們</text>
      <view class="contact-list">
        <view class="contact-item" @tap="handleOnlineService">
          <view class="item-left">
            <text class="item-icon">💬</text>
            <view class="item-info">
              <text class="item-title">在線客服</text>
              <text class="item-desc">工作時間：9:00-21:00</text>
            </view>
          </view>
          <text class="item-arrow">></text>
        </view>

        <view class="contact-item" @tap="handlePhone">
          <view class="item-left">
            <text class="item-icon">📞</text>
            <view class="item-info">
              <text class="item-title">電話客服</text>
              <text class="item-desc">400-888-8888</text>
            </view>
          </view>
          <text class="item-arrow">></text>
        </view>

        <view class="contact-item" @tap="handleEmail">
          <view class="item-left">
            <text class="item-icon">✉️</text>
            <view class="item-info">
              <text class="item-title">郵件客服</text>
              <text class="item-desc">support@example.com</text>
            </view>
          </view>
          <text class="item-arrow">></text>
        </view>

        <view class="contact-item" @tap="handleWechat">
          <view class="item-left">
            <text class="item-icon">💚</text>
            <view class="item-info">
              <text class="item-title">微信客服</text>
              <text class="item-desc">長按複製微信號</text>
            </view>
          </view>
          <text class="item-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 常見問題 -->
    <view class="faq-section">
      <text class="section-title">常見問題</text>
      <view class="faq-list">
        <view 
          v-for="faq in faqList" 
          :key="faq.id" 
          class="faq-item"
          @tap="handleFaqTap(faq)"
        >
          <view class="faq-header">
            <text class="faq-question">{{ faq.question }}</text>
            <text :class="['faq-arrow', { expanded: faq.expanded }]">▼</text>
          </view>
          <view v-if="faq.expanded" class="faq-answer">
            <text class="answer-text">{{ faq.answer }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 意見反饋 -->
    <view class="feedback-section">
      <text class="section-title">意見反饋</text>
      <view class="feedback-card">
        <textarea 
          class="feedback-textarea" 
          v-model="feedbackText"
          placeholder="請輸入您的意見或建議..."
          :maxlength="500"
        />
        <view class="feedback-footer">
          <text class="char-count">{{ feedbackText.length }}/500</text>
          <button class="submit-button" @tap="handleSubmitFeedback">提交反饋</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { showToast, showConfirm } from '@/utils/common.js';

// 常見問題列表
const faqList = ref([
  {
    id: 1,
    question: '如何註冊賬號？',
    answer: '點擊登錄頁面的「註冊」按鈕，填寫手機號碼並獲取驗證碼，設置密碼後即可完成註冊。',
    expanded: false
  },
  {
    id: 2,
    question: '忘記密碼怎麼辦？',
    answer: '在登錄頁面點擊「忘記密碼」，通過手機驗證碼重置密碼。',
    expanded: false
  },
  {
    id: 3,
    question: '如何修改個人信息？',
    answer: '進入「我的」頁面，點擊「個人信息」即可修改頭像、昵稱等信息。',
    expanded: false
  },
  {
    id: 4,
    question: '積分如何獲得和使用？',
    answer: '通過簽到、發布內容、邀請好友等方式獲得積分，可在積分商城兌換商品或優惠券。',
    expanded: false
  },
  {
    id: 5,
    question: '如何聯繫客服？',
    answer: '可以通過在線客服、電話、郵件或微信等多種方式聯繫我們，我們會及時為您解答。',
    expanded: false
  }
]);

// 反饋內容
const feedbackText = ref('');

// 在線客服
const handleOnlineService = () => {
  uni.navigateTo({
    url: '/subpages/chat/chat'
  });
};

// 電話客服
const handlePhone = () => {
  uni.showModal({
    title: '電話客服',
    content: '400-888-8888',
    confirmText: '撥打',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: '4008888888'
        });
      }
    }
  });
};

// 郵件客服
const handleEmail = () => {
  uni.setClipboardData({
    data: 'support@example.com',
    success: () => {
      showToast('郵箱地址已複製', 'success');
    }
  });
};

// 微信客服
const handleWechat = () => {
  uni.setClipboardData({
    data: 'customer_service_wx',
    success: () => {
      showToast('微信號已複製', 'success');
    }
  });
};

// 點擊問題
const handleFaqTap = (faq) => {
  faq.expanded = !faq.expanded;
};

// 提交反饋
const handleSubmitFeedback = () => {
  if (!feedbackText.value.trim()) {
    showToast('請輸入反饋內容', 'none');
    return;
  }

  showToast('提交成功，感謝您的反饋', 'success');
  feedbackText.value = '';
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.customer-service-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 頂部卡片 */
.service-header {
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  padding: $spacing-xxl $spacing-lg;
  text-align: center;
  margin-bottom: $spacing-lg;
}

.header-title {
  display: block;
  font-size: $font-xxl;
  color: $text-white;
  font-weight: $font-bold;
  margin-bottom: $spacing-sm;
}

.header-subtitle {
  display: block;
  font-size: $font-md;
  color: rgba(255, 255, 255, 0.9);
}

/* 聯繫方式 */
.contact-section,
.faq-section,
.feedback-section {
  padding: $spacing-lg;
}

.section-title {
  font-size: $font-xl;
  color: $text-primary;
  font-weight: $font-bold;
  margin-bottom: $spacing-lg;
  display: block;
}

.contact-list {
  background-color: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1rpx solid $border-light;
  transition: all $transition-base;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: $bg-hover;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.item-icon {
  font-size: 48rpx;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.item-title {
  font-size: $font-lg;
  color: $text-primary;
  font-weight: $font-medium;
}

.item-desc {
  font-size: $font-sm;
  color: $text-tertiary;
}

.item-arrow {
  font-size: $font-lg;
  color: $text-tertiary;
}

/* 常見問題 */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.faq-item {
  background-color: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.faq-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  transition: all $transition-base;
  
  &:active {
    background-color: $bg-hover;
  }
}

.faq-question {
  flex: 1;
  font-size: $font-md;
  color: $text-primary;
  font-weight: $font-medium;
}

.faq-arrow {
  font-size: $font-sm;
  color: $text-tertiary;
  transition: transform $transition-base;
  
  &.expanded {
    transform: rotate(180deg);
  }
}

.faq-answer {
  padding: 0 $spacing-lg $spacing-lg;
  border-top: 1rpx solid $border-light;
  animation: slideDown $transition-base;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.answer-text {
  font-size: $font-sm;
  color: $text-secondary;
  line-height: $line-height-lg;
  display: block;
  padding-top: $spacing-md;
}

/* 意見反饋 */
.feedback-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
}

.feedback-textarea {
  width: 100%;
  min-height: 300rpx;
  padding: $spacing-md;
  background-color: $bg-page;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
  line-height: $line-height-lg;
  margin-bottom: $spacing-md;
}

.feedback-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.char-count {
  font-size: $font-xs;
  color: $text-tertiary;
}

.submit-button {
  padding: $spacing-sm $spacing-xxl;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-md;
  font-weight: $font-bold;
  border-radius: $radius-xl;
}
</style>

