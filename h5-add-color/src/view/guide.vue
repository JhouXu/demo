<template>
  <div class="guide-view">
    <div class="box"></div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

import { wWidth, wHeight } from '@/config.js'

export default {
  name: 'GuideView',
  components: {},

  data() {
    return {}
  },

  created() {},

  mounted() {
    // gsap.to('.box', {
    //   position: -100,
    //   rotation: 240,
    //   repeat: -1,
    // })
    gsap
      .timeline({
        repeat: -1,
        transformOrigin: '0',
      })

      .to('.box', {
        x: wWidth / 2,
        y: wHeight / 2,
        rotate: 360,
        duration: 5,
        transformOrigin: 'center',
      })
    // .to('.box', {
    //   x: 500,
    //   y: 100,
    //   duration: 3,
    //   rotation: 720,
    //   opacity: 0,
    // })
    // .to('.box', {
    //   x: 100,
    //   y: 100,
    //   duration: 3,
    //   rotation: -720,
    //   opacity: 1,
    // })
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/theme-ui.scss';

.guide-view {
  width: inherit;
  height: inherit;
  background-color: $bg-color-mask;

  .box {
    margin-right: 0.25rem;
    padding: 0.25rem;
    width: 3rem;
    height: 3rem;
    background: $color-primary;
    // transform-origin: center center;
  }
}
</style>
