<template>
  <div class="index-view">
    <CanvasComp></CanvasComp>
  </div>
</template>

<script>
import CanvasComp from '@/components/Canvas.vue'

export default {
  name: 'IndexView',
  components: {
    CanvasComp,
  },

  data() {
    return {}
  },

  created() {},

  mounted() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.index-view {
  // width: 100vw;
  // height: 100vh;
}
</style>
