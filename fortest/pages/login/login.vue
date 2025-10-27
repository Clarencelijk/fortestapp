<template>
  <view class="login-page">
    <!-- 背景裝飾 -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>

    <!-- Logo 和標題 -->
    <view class="login-header">
      <image class="app-logo" src="/static/logo.png" mode="aspectFit" />
      <text class="app-name">ForTest</text>
      <text class="welcome-text">歡迎回來</text>
    </view>

    <!-- 登錄表單 -->
    <view class="login-form">
      <!-- 登錄方式切換 -->
      <view class="login-tabs">
        <text 
          :class="['login-tab', { active: loginType === 'password' }]"
          @tap="switchLoginType('password')"
        >
          密碼登錄
        </text>
        <text 
          :class="['login-tab', { active: loginType === 'sms' }]"
          @tap="switchLoginType('sms')"
        >
          驗證碼登錄
        </text>
      </view>

      <!-- 密碼登錄 -->
      <view v-if="loginType === 'password'" class="form-content">
        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">📱</text>
            <input 
              class="form-input" 
              v-model="formData.phone"
              type="number"
              placeholder="請輸入手機號碼"
              maxlength="11"
            />
          </view>
        </view>

        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">🔒</text>
            <input 
              class="form-input" 
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="請輸入密碼"
              maxlength="20"
            />
            <text class="eye-icon" @tap="togglePassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </text>
          </view>
        </view>

        <view class="form-options">
          <label class="remember-checkbox">
            <checkbox :checked="rememberMe" @change="handleRememberChange" />
            <text class="checkbox-text">記住密碼</text>
          </label>
          <text class="forgot-password" @tap="handleForgotPassword">忘記密碼？</text>
        </view>
      </view>

      <!-- 驗證碼登錄 -->
      <view v-if="loginType === 'sms'" class="form-content">
        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">📱</text>
            <input 
              class="form-input" 
              v-model="formData.phone"
              type="number"
              placeholder="請輸入手機號碼"
              maxlength="11"
            />
          </view>
        </view>

        <view class="form-item">
          <view class="input-wrapper">
            <text class="input-icon">💬</text>
            <input 
              class="form-input sms-input" 
              v-model="formData.smsCode"
              type="number"
              placeholder="請輸入驗證碼"
              maxlength="6"
            />
            <button 
              class="sms-button" 
              :disabled="smsCountdown > 0"
              @tap="handleSendSms"
            >
              {{ smsCountdown > 0 ? `${smsCountdown}s` : '獲取驗證碼' }}
            </button>
          </view>
        </view>
      </view>

      <!-- 登錄按鈕 -->
      <button class="login-button" @tap="handleLogin">
        <text class="button-text">登錄</text>
      </button>

      <!-- 快捷註冊 -->
      <view class="register-tip">
        <text class="tip-text">還沒有賬號？</text>
        <text class="register-link" @tap="handleRegister">立即註冊</text>
      </view>
    </view>

    <!-- 第三方登錄 -->
    <view class="social-login">
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他登錄方式</text>
        <view class="divider-line"></view>
      </view>

      <view class="social-buttons">
        <view class="social-button wechat" @tap="handleWechatLogin">
          <text class="social-icon">💚</text>
          <text class="social-name">微信</text>
        </view>
        <view class="social-button qq" @tap="handleQQLogin">
          <text class="social-icon">🐧</text>
          <text class="social-name">QQ</text>
        </view>
        <view class="social-button weibo" @tap="handleWeiboLogin">
          <text class="social-icon">🔴</text>
          <text class="social-name">微博</text>
        </view>
      </view>
    </view>

    <!-- 用戶協議 -->
    <view class="agreement">
      <label class="agreement-checkbox">
        <checkbox :checked="agreeTerms" @change="handleAgreeChange" />
        <text class="agreement-text">
          我已閱讀並同意
          <text class="link" @tap="handleUserAgreement">《用戶協議》</text>
          和
          <text class="link" @tap="handlePrivacyPolicy">《隱私政策》</text>
        </text>
      </label>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { showToast } from '@/utils/common.js';

// 登錄類型
const loginType = ref('password'); // password 或 sms

// 表單數據
const formData = ref({
  phone: '',
  password: '',
  smsCode: ''
});

// 其他狀態
const showPassword = ref(false);
const rememberMe = ref(false);
const agreeTerms = ref(false);
const smsCountdown = ref(0);

// 切換登錄類型
const switchLoginType = (type) => {
  loginType.value = type;
  formData.value = {
    phone: formData.value.phone,
    password: '',
    smsCode: ''
  };
};

// 切換密碼顯示
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 記住密碼
const handleRememberChange = (e) => {
  rememberMe.value = e.detail.value[0] === true;
};

// 同意協議
const handleAgreeChange = (e) => {
  agreeTerms.value = e.detail.value[0] === true;
};

// 忘記密碼
const handleForgotPassword = () => {
  showToast('忘記密碼功能開發中', 'none');
};

// 發送驗證碼
const handleSendSms = () => {
  if (!formData.value.phone) {
    showToast('請輸入手機號碼', 'none');
    return;
  }

  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    showToast('手機號碼格式不正確', 'none');
    return;
  }

  showToast('驗證碼已發送', 'success');
  smsCountdown.value = 60;

  const timer = setInterval(() => {
    smsCountdown.value--;
    if (smsCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 登錄
const handleLogin = () => {
  if (!agreeTerms.value) {
    showToast('請先同意用戶協議和隱私政策', 'none');
    return;
  }

  if (!formData.value.phone) {
    showToast('請輸入手機號碼', 'none');
    return;
  }

  if (loginType.value === 'password') {
    if (!formData.value.password) {
      showToast('請輸入密碼', 'none');
      return;
    }
  } else {
    if (!formData.value.smsCode) {
      showToast('請輸入驗證碼', 'none');
      return;
    }
  }

  showToast('登錄成功', 'success');
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/index/index'
    });
  }, 1000);
};

// 註冊
const handleRegister = () => {
  showToast('註冊功能開發中', 'none');
};

// 第三方登錄
const handleWechatLogin = () => {
  if (!agreeTerms.value) {
    showToast('請先同意用戶協議和隱私政策', 'none');
    return;
  }
  showToast('微信登錄功能開發中', 'none');
};

const handleQQLogin = () => {
  if (!agreeTerms.value) {
    showToast('請先同意用戶協議和隱私政策', 'none');
    return;
  }
  showToast('QQ登錄功能開發中', 'none');
};

const handleWeiboLogin = () => {
  if (!agreeTerms.value) {
    showToast('請先同意用戶協議和隱私政策', 'none');
    return;
  }
  showToast('微博登錄功能開發中', 'none');
};

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

.login-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  padding: $spacing-xxl $spacing-lg;
  overflow: hidden;
}

/* 背景裝飾 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: $radius-round;
  background-color: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 400rpx;
  height: 400rpx;
  top: -100rpx;
  right: -100rpx;
}

.circle-2 {
  width: 300rpx;
  height: 300rpx;
  bottom: 100rpx;
  left: -100rpx;
}

.circle-3 {
  width: 200rpx;
  height: 200rpx;
  top: 50%;
  right: 50rpx;
}

/* Logo 和標題 */
.login-header {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: $spacing-xxl;
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
  margin-bottom: $spacing-sm;
}

.welcome-text {
  font-size: $font-lg;
  color: rgba(255, 255, 255, 0.9);
}

/* 登錄表單 */
.login-form {
  position: relative;
  z-index: 1;
  background-color: $bg-card;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-xl;
  margin-bottom: $spacing-xl;
}

.login-tabs {
  display: flex;
  margin-bottom: $spacing-xl;
}

.login-tab {
  flex: 1;
  text-align: center;
  padding: $spacing-md 0;
  font-size: $font-lg;
  color: $text-tertiary;
  position: relative;
  transition: all $transition-base;
  
  &.active {
    color: $primary-color;
    font-weight: $font-bold;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background-color: $primary-color;
      border-radius: $radius-sm;
    }
  }
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 $spacing-lg;
  background-color: $bg-page;
  border-radius: $radius-md;
  border: 2rpx solid transparent;
  transition: all $transition-base;
  
  &:focus-within {
    border-color: $primary-color;
    background-color: $bg-card;
  }
}

.input-icon {
  font-size: $font-xl;
  margin-right: $spacing-md;
}

.form-input {
  flex: 1;
  font-size: $font-md;
  color: $text-primary;
  
  &.sms-input {
    margin-right: $spacing-md;
  }
}

.eye-icon {
  font-size: $font-xl;
  padding: $spacing-sm;
}

.sms-button {
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  color: $text-white;
  font-size: $font-sm;
  font-weight: $font-bold;
  border-radius: $radius-md;
  
  &[disabled] {
    background: $bg-hover;
    color: $text-tertiary;
  }
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.checkbox-text {
  font-size: $font-sm;
  color: $text-secondary;
}

.forgot-password {
  font-size: $font-sm;
  color: $primary-color;
}

.login-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, $primary-color 0%, $info-color 100%);
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  margin-top: $spacing-lg;
}

.button-text {
  font-size: $font-lg;
  color: $text-white;
  font-weight: $font-bold;
}

.register-tip {
  text-align: center;
  margin-top: $spacing-lg;
}

.tip-text {
  font-size: $font-sm;
  color: $text-tertiary;
}

.register-link {
  font-size: $font-sm;
  color: $primary-color;
  font-weight: $font-bold;
  margin-left: $spacing-xs;
}

/* 第三方登錄 */
.social-login {
  position: relative;
  z-index: 1;
  margin-bottom: $spacing-xl;
}

.divider {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

.divider-text {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.8);
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: $spacing-xxl;
}

.social-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
}

.social-icon {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: $radius-round;
  transition: all $transition-base;
  
  &:active {
    transform: scale(0.95);
  }
}

.social-name {
  font-size: $font-sm;
  color: $text-white;
}

/* 用戶協議 */
.agreement {
  position: relative;
  z-index: 1;
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
}

.agreement-text {
  flex: 1;
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.8);
  line-height: $line-height-md;
}

.link {
  color: $text-white;
  font-weight: $font-bold;
  text-decoration: underline;
}
</style>

