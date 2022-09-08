<template>
  <view class="index">
    <view class="head">
      <image src="../../static/logo.png" mode=""></image>
    </view>
    <view class="content">
      <view class="content-item" v-for="(item, key) in routes" :key="key" @click="toRoute(item.path)">
        {{ item.title }}
      </view>
    </view>
    <button type="default" @click="clickHandler">测试</button>
  </view>
</template>

<script>
import { routes } from "./../../assets/data/public.data.js";

export default {
  data() {
    return {
      routes,
      
      beforeData: {
        url: ''
      }
    };
  },
  onLoad() {},

  methods: {
    toRoute(path) {
      uni.navigateTo({ url: path });
    },
    
    clickHandler() {
      const _this = this
      uni.request({
        url: 'https://api.digilinkcn.com/api/Speech/TextTransformvoice',
        method: "POST",
        data: {
          text: "这是转换文案测试，你们觉得好吗？",
          voiceName: "zh-CN-XiaohanNeural"
        },
        success: (res) => {
          const { result } = res.data
          console.log(result)
          
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.index {
  min-width: 100vw;
  min-height: 100vh;
  background: $color-theme;

  .head {
    display: flex;
    justify-content: center;
    padding: 10vw 0;

    image {
      width: 20vw;
      height: 20vw;
    }
  }

  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 3vw 0;
    padding: 0 10vw;

    &-item {
      padding: 5vw 0;
      width: calc(100% / 2 - 2vw);
      font-size: $uni-font-size-base;
      color: $uni-text-color-inverse;
      text-align: center;
      border: 1px solid $color-white-50;
      border-radius: 5px;
    }
  }
}
</style>
