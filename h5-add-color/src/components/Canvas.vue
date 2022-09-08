<template>
  <div class="canvas-comp">
    <div ref="canvas-comp-container" id="canvas-comp-container"></div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { wHeight, wWidth } from '@/config.js'

export default {
  name: 'CanvasComp',
  components: {},

  data() {
    return {
      app: null,
      tint: 0x00ffff, // 色调
    }
  },

  computed: {
    getCanvasDOM() {
      return this.$refs['canvas-comp-container']
    },
  },

  created() {},

  mounted() {
    const canvasDOM = this.getCanvasDOM
    const [width, height] = [wWidth, wHeight]
    canvasDOM.width = width
    canvasDOM.height = height

    const app = new PIXI.Application({
      width,
      height,
      antialias: true, // default: false 反锯齿
      transparent: false, // default: false 透明度
      resolution: 1, // default: 1 分辨率
      backgroundAlpha: 0, // 设置背景颜色透明度   0是透明
      backgroundColor: 0x262626, // 设置背景颜色
    })

    canvasDOM.appendChild(app.view)
    this.app = app

    const texture = PIXI.Texture.from(
      require('../assets/images/jail_cell_bars.png')
    )
    console.log(texture)

    const bear1 = new PIXI.Sprite(texture)
    bear1.x = 20
    bear1.y = 100
    app.stage.addChild(bear1)
    bear1.tint = 0xff0000
    bear1.interactive = true
    bear1.on('pointerdown', () => {
      console.log('bear1')
      bear1.tint = this.tint
    })

    const bear2 = new PIXI.Sprite(texture)
    bear2.x = 100
    bear2.y = 300
    app.stage.addChild(bear2)
    bear2.tint = this.tint
    bear2.interactive = true
    bear2.on('pointerdown', () => {
      bear2.tint = 0xff0000
    })
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
.canvas-comp {
}
</style>
