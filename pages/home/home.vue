<template>
  <view class="container">
    <image class="avator" src="{{member.userInfo.avatarUrl}}"/>
    <view class="box1">
      <view class="setting">
        <image class="img" src=""/>
      </view>
      <text class="name">{{member.userInfo.nickName}}</text>
      <text class="phone">{{member.passport}}</text>
    </view>
    <view class="box2">
      <view class="item" wx:for="{{items}}" wx:key="tag">
        <view class="nav" bindtap="itemAction" data-tag="{{item.tag}}">
          <image class="img" mode="aspectFit" src="{{item.img}}"/>
          <text class="title">{{item.title}}</text>
          <text class="subTitle">{{item.subTitle}}</text>
        </view>
      </view>
    </view>
    <!-- <view class="box3">
      <a class="text"><image class="img" src="/img/order/icon03_10.png"/> 切换消费模式</a>
    </view> -->
  </view>
</template>

<script>
  import vco from 'vco'
  import {observer, inject} from 'utils/mobx-wechat'
  const OrderApi = 'business/orderApi'
  const MemberStore = 'wechat/member'
  var app = getApp()
  @inject(OrderApi, MemberStore)
  @observer
  export default class extends vco.page {

    state() {
      return {
        member: this.store[MemberStore].member,
        items: [
          {title: "报表", subTitle: "", img: "/img/home/chart.png", url: "/pages/stat/pay/index", tag: 0},
          {title: "订单列表", subTitle: "", img: "/img/home/list.png", url: "/pages/business/order/list", tag: 1},
          {title: "手机号绑定", subTitle: "", img: "/img/home/bind.png", url: "/pages/oauth/login", tag: 2},
        ]
      }
    }


    async onShow(options) {
      let member = this.data.member
      let items = this.data.items
      items.push({title: "微信版本统计", subTitle: "", img: "/img/home/wechatVersion.png", url: "/pages/stat/user/index", tag: 3})
      if (member.role == 1 || member.role == 2) {
        this.setData({
          items: items
        })
      }
    }

    async onLoad(options) {
      // console.log(this.store[MemberStore].member)
    }

    itemAction(event) {
      // console.log(event);
      switch (event.currentTarget.dataset.tag) {
        case 0: // 报表
          this.tapReport()
          break
        case 1: // 订单列表
          this.tapOrderList()
          break
        case 2: //手机号绑定
          wx.navigateTo({
            url: "/pages/oauth/login"
          })
          break
        case 3:
          this.tapVersion()
          break
        default:

      }
    }

    tapReport() {
      let member = this.data.member
      //0-什么都不是；1-超管；2-运营；11-门店店主；12-门店店长
      if (member.role == 1 || member.role == 2) {
        wx.navigateTo({
          url: "/pages/stat/pay/index"
        })
      } else if (member.role == 11 && member.brandId > 0) {
        wx.navigateTo({
          url: `/pages/stat/pay/brand?id=${member.brandId}`
        })
      } else if (member.role == 12 && member.storeId > 0) {
        wx.navigateTo({
          url: `/pages/stat/pay/store?id=${member.storeId}`
        })
      } else {
        wx.showToast({
          title: '只有进驻商家才能查看'
        })
      }
    }

    tapOrderList() {
      let member = this.data.member
      if (member.role == 0 || !member.isBindMobile) {
        wx.showToast({
          title: '只有进驻商家才能查看'
        })
      } else {
        wx.navigateTo({
          url: "/pages/business/order/list"
        })
      }
    }

    tapVersion() {
      let member = this.data.member
      if (member.role == 1 || member.role == 2) {
        wx.navigateTo({
          url: "/pages/stat/user/index"
        })
      } else {
        wx.showToast({
          title: '只有管理员才能查看'
        })
      }
    }


  }
</script>

<style rel="styltsheet/less">
  .container {
    display: flex;
    flex-flow: column;
  }

  .avator {
    display: relative;
    position:relative;
    margin-top: 50rpx;
    align-self: center;
    border-radius: 50%;
    width: 180rpx;
    height: 180rpx;
    z-index: 999;
  }

  .box1 {
    margin: -90rpx 20rpx 0rpx 20rpx;
    padding-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    border: 1px solid #F6F3F3;
    border-top-left-radius: 10rpx;
    border-top-right-radius: 10rpx;
    text-align: center;
    align-items: center;

    .setting {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      height: 60 rpx;
      width: 100%;
      margin-right: 30rpx;
      margin-top: 15rpx;
      .img {
        width: 60rpx;
        height: 60rpx;
      }
    }
    .name {
      margin-top: 55rpx;
      font-size: 35rpx;
      color: #333;
      line-height: 50rpx;
    }
    .phone {
      font-size: 25rpx;
      color: #999;
      line-height: 30rpx;
    }
  }

  .box2 {
    margin: -1rpx 20rpx 0rpx 20rpx;
    padding: 15rpx 30rpx;
    display: flex;
    flex-flow: row wrap;
    text-align: center;
    border: 1px solid #F6F3F3;
    border-top: 0;
    border-bottom-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;

    .item {
      padding: 20rpx 0;
      width: 33%;
      .nav {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
      }
      .img {
        margin-top: 15rpx;
        width: 80rpx;
        height: 80rpx;
      }
      .title {
        margin-top: 15rpx;
        font-size: 25rpx;
        color: #333;
        line-height: 40rpx;
      }
      .subTitle {
        font-size: 20rpx;
        color: #999;
        line-height: 30rpx;
      }
    }
  }
  .box3 {
    display: flex;
    margin-top: 50rpx;
    justify-content: center;
    .img {
      width: 40rpx;
      height: 40rpx;
    }
    .text {
      font-size: 30rpx;
      color: #888;
    }
  }
</style>
