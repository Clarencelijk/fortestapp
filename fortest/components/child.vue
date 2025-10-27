<template>
	<view>
		<text class="red">我是组件</text>
		<view>{{msg}}</view>
		<view>
			<button @click="sayHelloToFather">按钮</button>
		</view>
	</view>
</template>

<script>
	export default {
		//接收父组件信息
		props:['msg'],
		data() {
			return {
				
			};
		},
		methods:{
			sayHelloToFather(){
				this.$emit('childEvent','蜡笔小新')
				
				uni.$emit('getmyInfo', '樱桃小丸子')
			}
		}
	}
</script>

<style scoped>
	.red{
		color: red;
	}
</style>
