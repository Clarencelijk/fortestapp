<template>
  <view class="splash-page">
    <text>欢迎使用，正在进入应用...</text>
  </view>
</template>

<script>
export default {
  name: "SplashPage",
  mounted() {
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' })
    }, 1500)
  }
}
</script>

<style scoped>
.splash-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;
  font-size: 36rpx;
}
</style>