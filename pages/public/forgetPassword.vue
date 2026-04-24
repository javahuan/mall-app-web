<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">RESET</view>
			<view class="welcome">
				重置密码
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号</text>
					<input type="number" v-model="telephone" placeholder="请输入手机号" maxlength="11"/>
				</view>
				<view class="input-item verification-item">
					<text class="tit">验证码</text>
					<view class="verification-box">
						<input type="number" v-model="authCode" placeholder="请输入验证码" maxlength="6"/>
						<button class="get-code-btn" @click="getVerificationCode" :disabled="countdown > 0">
							{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
						</button>
					</view>
				</view>
				<view class="input-item">
					<text class="tit">新密码</text>
					<input type="password" v-model="newPassword" placeholder="8-18位数字、字母组合" placeholder-class="input-empty" maxlength="18"/>
				</view>
				<view class="input-item">
					<text class="tit">确认新密码</text>
					<input type="password" v-model="confirmPassword" placeholder="请再次输入新密码" placeholder-class="input-empty" maxlength="18"/>
				</view>
			</view>
			<button class="confirm-btn" @click="toResetPassword" :disabled="reseting">重置密码</button>
			<view class="login-section">
				想起密码了?
				<text @click="toLogin">立即登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { updatePassword, getAuthCode } from '@/api/login.js';
	
	export default {
		data() {
			return {
				telephone: '',
				authCode: '',
				newPassword: '',
				confirmPassword: '',
				reseting: false,
				countdown: 0,
				timer: null
			}
		},
		onUnload() {
			if (this.timer) {
				clearInterval(this.timer);
			}
		},
		methods: {
			navBack() {
				uni.navigateBack();
			},
			toLogin() {
				uni.redirectTo({url:'/pages/public/login'});
			},
			getVerificationCode() {
				// 验证手机号
				if (!this.telephone || this.telephone.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				
				getAuthCode(this.telephone).then(response => {
					console.log('获取验证码结果:', response);
					uni.showToast({
						title: '验证码已发送',
						icon: 'success'
					});
					
					// 开始倒计时
					this.countdown = 60;
					this.timer = setInterval(() => {
						this.countdown--;
						if (this.countdown <= 0) {
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000);
				}).catch(err => {
					console.error('获取验证码失败:', err);
					uni.showToast({
						title: '获取验证码失败',
						icon: 'none'
					});
				});
			},
			toResetPassword() {
				// 表单验证
				if (!this.telephone || this.telephone.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				
				if (!this.authCode || this.authCode.length !== 6) {
					uni.showToast({
						title: '请输入6位验证码',
						icon: 'none'
					});
					return;
				}
				
				if (!this.newPassword || this.newPassword.length < 8) {
					uni.showToast({
						title: '密码长度不能少于8位',
						icon: 'none'
					});
					return;
				}
				
				if (this.newPassword !== this.confirmPassword) {
					uni.showToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					});
					return;
				}
				
				this.reseting = true;
				
				// 调用重置密码接口
				updatePassword({
					telephone: this.telephone,
					password: this.newPassword,
					authCode: this.authCode
				}).then(response => {
					uni.showToast({
						title: '密码重置成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.redirectTo({url:'/pages/public/login'});
					}, 1500);
				}).catch(err => {
					console.error('重置密码失败:', err);
					this.reseting = false;
				});
			},
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
		margin-top: 40upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}
	
	.verification-item {
		height: 140upx;
		
		.verification-box {
			display: flex;
			align-items: center;
			width: 100%;
			
			input {
				flex: 1;
				margin-right: 20upx;
			}
			
			.get-code-btn {
				width: 200upx;
				height: 60upx;
				line-height: 60upx;
				font-size: $font-sm;
				color: $uni-color-primary;
				background: #fff;
				border: 1px solid $uni-color-primary;
				border-radius: 30upx;
				padding: 0;
				
				&[disabled] {
					color: #999;
					border-color: #ddd;
					background: #f5f5f5;
				}
				
				&::after {
					border: none;
				}
			}
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 50upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.login-section {
		width: 100%;
		padding: 30upx 0;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
