<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside">
			<view class="s-list">
				<view @click="navToList(item.id)" class="s-item" v-for="item in slist" :key="item.id">
					<image :src="item.icon||'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/default.png'"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		fetchProductCateList
	} from '@/api/home.js';
	export default {
		data() {
			return {
				currentId: 0,
				flist: [],
				slist: []
			}
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			async loadData() {
				fetchProductCateList(0).then(response => {
					this.flist = response.data;
					if (this.flist.length > 0) {
						this.currentId = this.flist[0].id;
						fetchProductCateList(this.currentId).then(response => {
							this.slist = response.data;
						});
					}
				})
			},
			//一级分类点击
			tabtap(item) {
				this.currentId = item.id;
				fetchProductCateList(this.currentId).then(response => {
					this.slist = response.data;
				});
			},
			navToList(sid) {
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f5f7fa;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
		box-shadow: 2upx 0 12upx rgba(99, 102, 241, 0.06);
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		transition: all 0.3s ease;

		&.active {
			color: $base-color;
			background: linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 100%);
			font-weight: 600;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 40upx;
				width: 8upx;
				background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
				border-radius: 0 8upx 8upx 0;
				opacity: 1;
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}

	.s-list {
		margin-top: 20upx;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		border-radius: 20upx 0 0 0;
		box-shadow: 0 2upx 12upx rgba(99, 102, 241, 0.06);

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.s-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		transition: all 0.3s ease;

		image {
			width: 140upx;
			height: 140upx;
			border-radius: 16upx;
			box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.08);
		}
	}
</style>
