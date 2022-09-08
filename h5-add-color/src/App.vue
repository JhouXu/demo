<template>
  <div ref="app" id="app">
    <!-- 引导页 -->
    <div class="guide">
      <GuideView />
    </div>

    <!-- 首页 -->
    <div class="index">
      <IndexView />
    </div>

    <!-- 画展页 -->
    <!-- <div class="exhibition">
      <ExhibitionView />
    </div> -->

    <!-- 画作介绍页 -->
    <!-- <div class="introduce">
      <IntroduceView />
    </div> -->

    <!-- 填色游戏页 -->
    <!-- <div class="game">
      <GameView />
    </div> -->

    <!-- 填写昵称页 -->
    <!-- <div class="nickname">
      <NicknameView />
    </div> -->

    <!-- 海报生成页 -->
    <!-- <div class="poster">
      <PosterView />
    </div> -->
  </div>
</template>

<script>
import { wWidth, wHeight } from '@/config.js'
import ResponseScale from '@/assets/script/responseScale.js'

import GuideView from '@/view/guide.vue'
import IndexView from '@/view/index.vue'
// import ExhibitionView from '@/view/exhibition.vue'

export default {
  name: 'App',
  components: {
    GuideView,
    IndexView,
    // ExhibitionView,
  },

  data() {
    return {}
  },

  computed: {
    getAppContainerDOM() {
      return this.$refs['app']
    },
  },

  created() {},

  mounted() {
    const { getAppContainerDOM } = this
    new ResponseScale(getAppContainerDOM, wWidth, wHeight)
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/theme-ui.scss';

#app {
  position: relative;
  width: $design-width;
  height: $design-height;
  // font-size: 0;

  .guide,
  .index,
  .exhibition,
  .introduce,
  .game,
  .nickname,
  .poster {
    width: inherit;
    height: inherit;
    overflow: hidden;
  }

  .index,
  .exhibition,
  .introduce,
  .game,
  .nickname,
  .poster {
    position: absolute;
    top: 0;
  }
}
</style>

<style>
html,
body {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
