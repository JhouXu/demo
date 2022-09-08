<template>
  <view class="irr">
    <van-cell-group class="input">
      <van-field
        :value="amount"
        :border="false"
        type="number"
        label="初始金额"
        placeholder="请输入初始投入金额"
        input-align="right"
        @change="inputChangeHandle($event, 'amount')"
      >
        <van-text slot="button" size="small" type="text">元</van-text>
      </van-field>
      <van-field
        :value="profit"
        :border="false"
        type="number"
        label="现金收益"
        placeholder="请输入现金收益"
        input-align="right"
        @change="inputChangeHandle($event, 'profit')"
      >
        <van-text slot="button" size="small" type="text">元</van-text>
      </van-field>
    </van-cell-group>
    <van-cell-group class="button">
      <van-button class="button-clear" color="#403c57" type="primary" size="small" plain @click="clearHandle">
        清空
      </van-button>
      <van-button
        class="button-calc"
        color="#403c57"
        type="primary"
        size="small"
        :disabled="isDisabled"
        @click="calcHandle"
      >
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
          title: "金额",
          name: "amount",
        },
        {
          title: "收益",
          name: "profit",
        },
      ],
      amount: "",
      profit: "",
    };
  },
  onLoad() {
    const routes = getCurrentPages();
    const curRoute = routes[routes.length - 1].route;
    uni.setNavigationBarTitle({ title: getRouteTitle(this.routes, curRoute) });
  },

  methods: {
    inputChangeHandle(e, str) {
      this.isDisabled = false;
      this[str] = e.detail;
    },

    calcHandle() {
      const { map, amount, profit } = this;

      try {
        map.forEach((item) => {
          if (this[item.name] === "") {
            throw new Error(item.title);
          }
        });
      } catch (err) {
        Notify({ type: "warning", message: `请输入${err.message}` });
        return;
      }

      let res = amount / profit;
      res = res.toFixed(3);

      Dialog.alert({ message: `内部收益率为: ${res}%` });
    },

    clearHandle() {
      const { map } = this;
      map.forEach((item) => (this[item.name] = ""));
      this.isDisabled = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.irr {
  padding: 2vw 5vw;
  min-width: 100vw;
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
  box-sizing: border-box;

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
