
## next-cropper --当选项过多时，使用下拉菜单展示并选择内容

> 遇到问题或有建议可以加入QQ群(<font color=#f00>455948571</font>)反馈  
> 如果觉得组件不错，<font color=#f00>给五星鼓励鼓励</font>咯！


## 注意
	
### 作者不介意你对组件源码进行改造使用，为了开源更加高效，谢谢你的配合；为了节省不必要的沟通浪费，以下情况请不要再反馈给作者，请自行解决；
### 在这感各位的理解，我支持开源，但是作者时间有限；谢谢各位的配合；在这里期望我写的小小插件能为你提供便捷；
	
 >  1.如果你对源码进行了修改使用，请不需要对作者做任何的反馈，作者确实没有空陪你做技术分析解答；  
 >  2.如果你引入插件，连插件是否有正常被uniapp框架识别解析都不清楚，请你换个插件使用；  
 >  3.如果你引入插件，针对自己项目进行功能改造的，请自行仔细阅读源码并了解其原理，自行改造；这里作者不愿意浪费过多时间进行技术解答；  
 >  4.理论上作者不再解决由于本地开发环境问题所导致的插件使用问题，请自行到uniapp官网学习解决；

### 如果有使用问题请加群

注意：如果插件问题，请务必给一个完整的复现demo，谢谢配合；
[点击链接加入群聊前端开发（uniapp插件）】](https://qm.qq.com/q/S1bJzQfJAG)

## 使用

>[从uniapp插件市场导入](https://ext.dcloud.net.cn/plugin?name=next-cropper)

### vue3 + ts 使用

```ts
<template>
	<view style="font-size: 14px;color: #999;padding: 8px;background-color: #fff;margin-bottom: 6px"><text>1、默认使用方式</text></view>
	<next-cropper 
		:avatarSrc="imgurl1" 
		:aspectRatio="1" 
		:quality="1"
		selWidth="300rpx"
		selHeight="300rpx"
		expHeight="300rpx"
		expWidth="300rpx"
		:avatarStyle="{width: '300rpx', height: '300rpx'}"
		@upload="myUpload"
	/>
	<view style="font-size: 14px;color: #999;padding: 8px;background-color: #fff;margin-bottom: 6px"><text>2、自定义使用方式</text></view>
	<view style="padding: 0 20rpx;display: flex;">
		<next-cropper
			:aspectRatio="1" 
			:quality="1"
			selWidth="300rpx"
			selHeight="300rpx"
			expHeight="300rpx"
			expWidth="300rpx"
			@upload="myUpload2"
		>
			<view class="upload-btn"><text>添加图片</text></view>
		</next-cropper>
		<view style="width: 20rpx"></view>
		<image v-if="imgurl2" mode="aspectFill" :src="imgurl2" style="width: 300rpx;height: 300rpx;"  />
	</view>
	
</template>
<script setup lang="ts">
	import { ref, onMounted } from "vue";
	const imgurl1 = ref("https://n.sinaimg.cn/sinakd20116/524/w662h662/20240323/f976-72df1b4969a54b98722af12d17d4c5e7.jpg");
	const imgurl2 = ref("");
	function myUpload(rsp) {
		imgurl1.value = rsp.path; //更新头像方式一
	}
	function myUpload2(rsp) {
		imgurl2.value = rsp.path; //更新头像方式二
	}
</script>
<style lang="scss">
	page {
	  background: #f0f0f0;
	}
	.upload-btn {
		border: 1rpx solid #999999;
		width: 200rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;
		color: #ccc;
	}
</style>
```

### vue2 同样可以使用，这里不再写demo



### 预览
### 
***

|                 						功能预览               				   		          	  |
| :---------------------------------------------------------------------------: |
| ![](https://lixueshiaa.github.io/webtest/www/static/next-cropper.gif)   |



		
