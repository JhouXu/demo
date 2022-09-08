<template>
  <!-- 日利率(0/000)=年利率(%)/360=月利率(%.)/30 -->
  <!-- 月利率(%.)=年利率(%)/12 -->
  <view class="day">
    <van-cell-group class="input">
      <van-field
        :value="yRate"
        :border="false"
        type="number"
        label="年利率"
        placeholder="请输入年利率"
        input-align="right"
        @change="inputChangeHandle($event, 'yRate')"
      >
        <van-text slot="button" size="small" type="text">%</van-text>
      </van-field>
      <van-field
        :value="mRate"
        :border="false"
        type="number"
        label="月利率"
        placeholder="请输入月利率"
        input-align="right"
        @change="inputChangeHandle($event, 'mRate')"
      >
        <van-text slot="button" size="small" type="text">%</van-text>
      </van-field>
    </van-cell-group>
    <van-cell-group class="button">
      <van-button class="button-clear" color="#403c57" type="primary" size="small" plain @click="clearHandle">
        清空
      </van-button>
      <van-button class="button-calc" color="#403c57" type="primary" size="small" @click="calcHandle">
        计算
      </van-button>
    </van-cell-group>

    <van-dialog confirm-button-color="#403c57" id="van-dialog" />

    <van-notify id="van-notify" />
  </view>
</template>

<script>
import Dialog from "./../../wxcomponents/vant/dialog/dialog";
import Notify from "./../../wxcomponents/vant/notify/notify";

import { routes } from "./../../assets/data/public.data.js";
import { getRouteTitle } from "./../../assets/function/tool.js";

export default {
  data() {
    return {
      routes,

      map: [
        {
          title: "年利率",
          name: "yRate",
          divisor: 360,
        },
        { title: "月利率", name: "mRate", divisor: 30 },
      ],
      yRate: "",
      mRate: "",
    };
  },

  onLoad() {
    const routes = getCurrentPages();
    const curRoute = routes[routes.length - 1].route;
    uni.setNavigationBarTitle({ title: getRouteTitle(this.routes, curRoute) });
  },

  methods: {
    inputChangeHandle(e, str) {
      this[str] = e.detail;

      // 数据输入时，数据反向清空
      const { map } = this;
      const arr = map.filter((item) => item.name !== str);
      arr.forEach((item) => {
        this[item.name] = "";
      });
    },

    calcHandle() {
      const { map } = this;
      const arr = map.filter((item) => this[item.name] !== "");

      if (arr.length === 0) {
        Notify({ type: "warning", message: `请输入年利率或月利率` });
        return;
      }

      const { title, name, divisor } = arr[0];
      let res = this[name] / divisor;
      res = res.toFixed(3);

      Dialog.alert({ message: `${title}转化日利率为: ${res}%` });
    },

    clearHandle() {
      const { map } = this;
      map.forEach((item) => (this[item.name] = ""));
    },
  },
};
</script>

<style lang="scss" scoped>
.day {
  padding: 2vw 5vw;
  min-width: 100vw;
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
  box-sizing: border-box;

  .input {
  }

  .button {
    margin-top: 2vw;
    display: flex;
    justify-content: flex-end;

    &-clear {
    }

    &-calc {
      width: 100%;
      flex: 1;
    }

    /deep/.van-button {
      margin-right: 2vw;
    }
  }
}
</style>
