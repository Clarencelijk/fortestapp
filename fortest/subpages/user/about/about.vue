<template>
  <view class="about-page">
    <!-- Logo 和應用名稱 -->
    <view class="app-header">
      <image class="app-logo" src="/static/logo.png" mode="aspectFit" />
      <text class="app-name">ForTest</text>
      <text class="app-version">v1.0.0</text>
      <text class="app-slogan">探索無限可能</text>
    </view>

    <!-- 應用介紹 -->
    <view class="intro-section">
      <text class="intro-text">
        ForTest 是一個基於 uni-app 開發的跨平台移動應用，致力於為用戶提供優質的內容分享和社交體驗。我們相信，每個人都有獨特的故事和想法值得被分享。
      </text>
    </view>

    <!-- 功能特色 -->
    <view class="features-section">
      <text class="section-title">功能特色</text>
      <view class="features-list">
        <view class="feature-item">
          <text class="feature-icon">🎨</text>
          <view class="feature-content">
            <text class="feature-title">精美設計</text>
            <text class="feature-desc">現代化的 UI 設計，流暢的交互體驗</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📱</text>
          <view class="feature-content">
            <text class="feature-title">跨平台</text>
            <text class="feature-desc">支持 iOS、Android、小程序等多個平台</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">⚡</text>
          <view class="feature-content">
            <text class="feature-title">高性能</text>
            <text class="feature-desc">優化的代碼結構，快速響應</text>
          </view>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🔒</text>
          <view class="feature-content">
            <text class="feature-title">安全可靠</text>
            <text class="feature-desc">完善的安全機制，保護用戶隱私</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 聯繫我們 -->
    <view class="contact-section">
      <text class="section-title">聯繫我們</text>
      <view class="contact-list">
        <view class="contact-item">
          <text class="contact-label">官方網站</text>
          <text class="contact-value">www.example.com</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">客服郵箱</text>
          <text class="contact-value">support@example.com</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">客服電話</text>
          <text class="contact-value">400-888-8888</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">公司地址</text>
          <text class="contact-value">廣東省深圳市南山區科技園</text>
        </view>
      </view>
    </view>

    <!-- 法律信息 -->
    <view class="legal-section">
      <view class="legal-item" @tap="handleUserAgreement">
        <text class="legal-text">用戶協議</text>
        <text class="legal-arrow">></text>
      </view>
      <view class="legal-item" @tap="handlePrivacyPolicy">
        <text class="legal-text">隱私政策</text>
        <text class="legal-arrow">></text>
      </view>
    </view>

    <!-- 版權信息 -->
    <view class="copyright-section">
      <text class="copyright-text">© 2025 ForTest. All rights reserved.</text>
      <text class="copyright-text">Made with ❤️ by Manus</text>
    </view>
  </view>
</template>

<script setup>
import { showToast } from '@/utils/common.js';

// 用戶協議
const handleUserAgreement = () => {
  showToast('用戶協議頁面開發中', 'none');
};

// 隱私政策
const handlePrivacyPolicy = () => {
  showToast('隱私政策頁面開發中', 'none');
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.about-page {
  min-height: 100vh;
  background-color: $bg-page;
}

/* 應用頭部 */
.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xxl $spacing-lg;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
}

.app-logo {
  width: 160rpx;
  height: 160rpx;
  border-radius: $radius-xl;
  margin-bottom: $spacing-lg;
  background-color: $bg-card;
}

.app-name {
  font-size: 48rpx;
  color: $text-white;
  font-weight: $font-bold;
  margin-bottom: $spacing-xs;
}

.app-version {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: $spacing-md;
}

.app-slogan {
  font-size: $font-md;
  color: rgba(255, 255, 255, 0.9);
}

/* 應用介紹 */
.intro-section {
  padding: $spacing-xl $spacing-lg;
  background-color: $bg-card;
  margin-bottom: $spacing-md;
}

.intro-text {
  font-size: $font-md;
  color: $text-secondary;
  line-height: $line-height-lg;
  display: block;
}

/* 功能特色 */
.features-section,
.contact-section {
  padding: $spacing-lg;
  background-color: $bg-card;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-xl;
  color: $text-primary;
  font-weight: $font-bold;
  margin-bottom: $spacing-lg;
  display: block;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.feature-item {
  display: flex;
  gap: $spacing-md;
}

.feature-icon {
  font-size: 48rpx;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.feature-title {
  font-size: $font-lg;
  color: $text-primary;
  font-weight: $font-bold;
}

.feature-desc {
  font-size: $font-sm;
  color: $text-secondary;
  line-height: $line-height-md;
}

/* 聯繫我們 */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.contact-label {
  font-size: $font-sm;
  color: $text-tertiary;
}

.contact-value {
  font-size: $font-md;
  color: $text-primary;
}

/* 法律信息 */
.legal-section {
  background-color: $bg-card;
  margin-bottom: $spacing-md;
}

.legal-item {
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

.legal-text {
  font-size: $font-md;
  color: $text-primary;
}

.legal-arrow {
  font-size: $font-lg;
  color: $text-tertiary;
}

/* 版權信息 */
.copyright-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xl $spacing-lg;
}

.copyright-text {
  font-size: $font-xs;
  color: $text-tertiary;
  text-align: center;
}
</style>

