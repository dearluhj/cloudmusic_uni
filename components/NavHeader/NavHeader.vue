<template>
	<view class="header">
		<text class="title">{{title}}</text>
		<view>
			<text>{{content}}</text>
			<text class="more">查看更多</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			title: {
				type: String,
				value: 'default'
			},
			content: {
				type: String,
				value: 'default'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		.title {
			font-size: 26rpx;
			line-height: 60rpx;
			color: #666;
		}
	}

	.header {
		.more {
			border: 2rpx solid #333;
			border-radius: 20rpx;
			font-size: 26rpx;
			padding: 5rpx 20rpx;
			float: right;
		}
	}
</style>