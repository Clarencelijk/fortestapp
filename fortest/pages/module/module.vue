<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
<template>
  <view class="module-page">
    <!-- 顶部 tabs -->
    <view class="sub-tabs">
      <text
        v-for="t in subTabs"
        :key="t.key"
        :class="['sub-tab', {active: subActive===t.key}]"
        @tap="subActive = t.key">
        {{ t.name }}
      </text>
    </view>

    <!-- 动态组件 / 或者简单的 v-if 都可以 -->
    <ModuleProduct v-if="subActive==='product'"  :moduleId="moduleId"/>
    <ModuleService v-if="subActive==='service'"  :moduleId="moduleId"/>
    <ModuleLive   v-if="subActive==='live'"      :moduleId="moduleId"/>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app'
import ModuleProduct from '@/components/module/ModuleProduct.vue'
import ModuleService from '@/components/module/ModuleService.vue'
import ModuleLive   from '@/components/module/ModuleLive.vue'

const subTabs = [
  {key:'product', name:'产品'},
  {key:'service', name:'服务'},
  {key:'live',    name:'直播'}
]
const subActive = ref('product')   // 默认先展示产品
let moduleId = ''                  // 相机/家具/食物...

onLoad((query)=>{
  moduleId = query.id              // 从 navigator 带过来的板块 id
  uni.setNavigationBarTitle({ title: query.name })
})
</script>

<style scoped>
.sub-tabs{display:flex;height:80rpx;line-height:80rpx;background:#fff;}
.sub-tab{flex:1;text-align:center;color:#333;position:relative;}
.sub-tab.active{color:#FFD400;}
.sub-tab.active::after{content:'';position:absolute;left:30%;right:30%;bottom:0;height:4rpx;background:#FFD400;}
.module-page{min-height:100vh;background:#F5F7FA;}
</style>