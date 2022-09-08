<template>
  <!-- 贷款利率：借款期限内利息数额与本金额的比例 -->
  <!-- 贷款利息=本金*实际天数*日利率 -->
  <!-- 利率：利息率= 利息 / （本金x时间）×100% -->
  <!-- 利息：利息=本金×利率×时间 -->
  <view class="loan">
    <van-tabs color="#403c57" :active="active" @change="tabsChangeHandle">
      <van-tab title="年" name="年">
        <van-cell-group class="year input">
          <van-field
            :value="amount"
            :border="false"
            type="number"
            label="贷款金额"
            placeholder="请输入贷款金额"
            input-align="right"
            @change="inputChangeHandle($event, 'amount')"
          >
            <van-text slot="button" size="small" type="text">元</van-text>
          </van-field>
          <van-field
            :value="time"
            :border="false"
            type="number"
            label="贷款年数"
            placeholder="请输入贷款年数"
            input-align="right"
            @change="inputChangeHandle($event, 'time')"
          >
            <van-text slot="button" size="small" type="text">年</van-text>
          </van-field>
          <van-field
            :value="rate"
            :border="false"
            type="number"
            label="年利率"
            placeholder="请输入年利率"
            input-align="right"
            @change="inputChangeHandle($event, 'rate')"
          >
            <van-text slot="button" size="small" type="text">%</van-text>
          </van-field>
        </van-cell-group>
      </van-tab>
      <van-tab title="月" name="月">
        <van-cell-group class="month input">
          <van-field
            :value="amount"
            :border="false"
            type="number"
            label="贷款金额"
            placeholder="请输入贷款金额"
            input-align="right"
            @change="inputChangeHandle($event, 'amount')"
          >
            <van-text slot="button" size="small" type="text">元</van-text>
          </van-field>
          <van-field
            :value="time"
            :border="false"
            type="number"
            label="贷款月数"
            placeholder="请输入贷款月数"
            input-align="right"
            @change="inputChangeHandle($event, 'time')"
          >
            <van-text slot="button" size="small" type="text">月</van-text>
          </van-field>
          <van-field
            :value="rate"
            :border="false"
            type="number"
            label="月利率"
            placeholder="请输入月利率"
            input-align="right"
            @change="inputChangeHandle($event, 'rate')"
          >
            <van-text slot="button" size="small" type="text">%</van-text>
          </van-field>
        </van-cell-group>
      </van-tab>
      <van-tab title="日" name="日">
        <van-cell-group class="day input">
          <van-field
            :value="amount"
            :border="false"
            type="number"
            label="贷款金额"
            placeholder="请输入贷款金额"
            input-align="right"
            @change="inputChangeHandle($event, 'amount')"
          >
            <van-text slot="button" size="small" type="text">元</van-text>
          </van-field>
          <van-field
            :value="time"
            :border="false"
            type="number"
            label="贷款天数"
            placeholder="请输入贷款天数"
            input-align="right"
            @change="inputChangeHandle($event, 'time')"
          >
            <van-text slot="button" size="small" type="text">天</van-text>
          </van-field>
          <van-field
            :value="rate"
            :border="false"
            type="number"
            label="日利率"
            placeholder="请输入日利率"
            input-align="right"
            @change="inputChangeHandle($event, 'rate')"
          >
            <van-text slot="button" size="small" type="text">%</van-text>
          </van-field>
        </van-cell-group>
      </van-tab>
    </van-tabs>
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

      view: "年",
      active: 0,
      map: [
        {
          title: "金额",
          name: "amount",
        },
        {
          title: "时间",
          name: "time",
        },
        {
          title: "利率",
          name: "rate",
        },
      ],
      amount: "",
      time: "",
      rate: "",
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

    tabsChangeHandle(event) {
      const view = event.detail.name;
      this.view = view;
      wx.showToast({
        title: `切换到${view}视图`,
        icon: "none",
        duration: 800,
      });
    },

    calcHandle() {
      const { map, amount, time, rate, view } = this;

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

      // 利息 = 本金 * 利率 * 时间
      const interest = amount * (rate / 100) * time;
      console.log(interest);
      // 利率、利息率 = 利息 / (本金 * 时间) * 100%
      let res = (interest / (amount * time)) * 100;
      console.log(res);
      res = res.toFixed(3);

      Dialog.alert({ message: `${view}贷款利率为: ${res}%` });
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
.loan {
  min-width: 100vw;
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
  box-sizing: border-box;

  .year {
  }

  .month {
  }

  .day {
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
