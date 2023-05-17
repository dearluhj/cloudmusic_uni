<template>
	<view class="prev">
		<navigator target="self" hover-class="none" open-type="redirect" url="/pages/login/passwordlogin/passwordlogin">返回账号密码登录
		</navigator>
	</view>
	<view class="imagebox">
		<view>
			<text>请使用手机版网易云音乐扫码</text>
		</view>
		<image v-if="currentqrStatus" @tap="getqrimage" :src="imageUrl" mode="" />
		<image v-if="!currentqrStatus" src="/static/image/waiting.png" mode="" />
		<view class="updateqrimg">
			<text>{{qrstatueMsg}}</text>
		</view>
	</view>
</template>

<script>
	import request from "../../../utils/request"
	export default {
		data() {
			return {
				imageUrl: "",
				currentqrStatus: true,
				qrstatueMsg: ""
			}
		},
		methods: {
			getcurrentTime() {
				return Date.now()
			},
			//获取二维码图片
			async getqrimage() {
				let key = await request("/login/qr/key", {
					timestamp: this.getcurrentTime()
				}, {});
				key = key.data.unikey;
				let qrimgbase = await request("/login/qr/create", {
					key,
					qrimg: true,
					timestamp: this.getcurrentTime()
				}, {});
				qrimgbase = qrimgbase.data.qrimg;

				this.imageUrl = qrimgbase

				if (this.timer) {
					clearInterval(this.timer)
				}
				this.checkqrStatus(key);
			},
			//二维码轮询
			checkqrStatus(key) {
				this.timer = setInterval(async () => {
					let res = await request("/login/qr/check", {
						key,
						timestamp: this.getcurrentTime(),
						isLogin: true
					}, {});

					if (res.code == 802) {

						this.qrstatueMsg = "扫码成功，请在手机上确认"
						this.currentqrStatus = false

					} else if (res.code == 800) {
						clearInterval(this.timer);

						this.qrstatueMsg = "二维码已过期，请点击二维码刷新"
						this.imageUrl = "/static/image/waiting.png"
						this.currentqrStatus = true

					} else if (res.code == 803) {
						clearInterval(this.timer);

						this.qrstatueMsg = "授权登录成功"
						this.currentqrStatus = false


						let statusres = await request("/login/status", {
							timestamp: this.getcurrentTime()
						}, {}, "post");
						uni.setStorage({
							key: "userInfo",
							data: JSON.stringify(statusres.data.profile),
							encrypt: true,
							success() {
								uni.showToast({
									title: '页面即将跳转',
									icon: 'success'
								}, 2000);
							}
						})
						let redirectTime = setTimeout(() => {
							clearTimeout(redirectTime);
							uni.reLaunch({
								url: '/pages/personal/personal',
							})
						}, 2000);
					}
				}, 1000);
			},

		},
		onLoad() {
			this.getqrimage();
		},
		onUnload() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang="scss" scoped>
	.prev {
		padding: 20rpx;
		color: #4399fc;
	}

	.imagebox {
		width: 100%;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		image {
			width: 400rpx;
			height: 400rpx;
		}

		.updateqrimg {
			color: #4399fc;
		}
	}
</style>