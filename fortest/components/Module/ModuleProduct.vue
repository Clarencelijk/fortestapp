<template>
  <view class="module-product">
    <view v-for="p in list" :key="p.id" class="card">
      <image :src="p.pic" mode="aspectFill"/>
      <text>{{ p.name }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
const props = defineProps({ moduleId: String })
const list = ref([])

// 每当外壳切换到这个组件，或者板块 id 变化，就重新拉数据
watchEffect(async ()=>{
  const res = await uni.request({
    url: '/api/module/products',
    data: { moduleId: props.moduleId }   // 后端根据板块 id 给对应商品
  })
  list.value = res.data
})
</script>

<style scoped>
.card{background:#fff;margin:20rpx;padding:20rpx;border-radius:12rpx;}
.card image{width:100%;height:200rpx;}
</style>