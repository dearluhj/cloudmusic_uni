<template>
	<view class="container">
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="text" @input="donotcare" v-model="phone" placeholder="请输入手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="text" @input="donotcare" v-model="password" password placeholder="请输入密码" />
				</view>
			</view>
			<button class="confirm-btn" @tap="loginVerify">登录</button>
			<view class="forget-section">
				忘记密码?
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text>马上注册</text>
		</view>
		<view class="qr-login">
			<navigator open-type="navigate" url="/pages/login/qrlogin/qrlogin" hover-class="none">扫码登录</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: "",
				password: ""
			};
		},
		methods: {
			loginVerify() {
				let {
					phone,
					password
				} = this;
				if (!phone) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'error',
						duration: 2000
					})
					return;
				}
				if (!password) {
					uni.showToast({
						title: '密码不能为空',
						icon: 'error',
						duration: 2000
					})
					return;
				}
				let reg = /^1[3-9]\d{9}$/;
				if (!reg.test(phone)) {
					uni.showToast({
						title: '手机号格式有误',
						icon: 'error',
						duration: 2000
					})
					return;
				}
				uni.showToast({
					title: '验证成功',
					icon: 'success',
					duration: 2000
				})

			},
			//空回调
			donotcare() {}
		}
	}
</script>

<style lang="scss" scoped>
	/* pages/login/login.wxss */
	.wrapper {
		position: relative;
		z-index: 90;
		padding-bottom: 40rpx;
	}

	.left-top-sign {
		font-size: 120rpx;
		color: #f8f8f8;
		position: relative;
		left: -16rpx;
	}

	.welcome {
		position: relative;
		left: 50rpx;
		top: -90rpx;
		font-size: 46rpx;
		color: #555;
	}


	.input-content {
		padding: 0 60rpx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30rpx;
		background: #f8f6fc;
		height: 120rpx;
		border-radius: 4px;
		margin-bottom: 50rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50rpx;
			line-height: 56rpx;
			font-size: 30rpx;
			color: #606266;
		}

		input {
			height: 60rpx;
			font-size: 30rpx;
			color: #303133;
			width: 100%;
		}

	}

	.confirm-btn {
		width: 630rpx !important;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50rpx;
		margin-top: 70rpx;
		background: #d43c33;
		color: #fff;
		font-size: 32rpx;
		padding: 0;
	}

	.confirm-btn2 {
		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: 28rpx;
		color: #4399fc;
		text-align: center;
		margin-top: 40rpx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50rpx;
		width: 100%;
		font-size: 28rpx;
		color: #606266;
		text-align: center;

		text {
			color: #4399fc;
			margin-left: 10rpx;
		}
	}

	.qr-login {
		position: absolute;
		left: 0;
		bottom: 100rpx;
		width: 100%;
		font-size: 32rpx;
		color: #4399fc;
		text-align: center;
	}
</style>