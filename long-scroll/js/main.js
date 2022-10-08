import { PixiPlugin } from "../utils/pixi-plugin.js";
import gsapCore, { gsap, TweenMax, TimelineMax, _colorStringFilter } from "../utils/gsap-core.js";
import { AutoScale } from "../js/auto-scale.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const designW = 750; // 设计稿宽度高度基准
const designH = 1438;

renderHandle({
  PIXI: window.PIXI,
  renderDOM: document.querySelector(".container .scene"),
});

// 初始化容器自适应
const dom = document.querySelector(".container .scene");
new AutoScale(dom, designW, designH);

function renderHandle(param) {
  let obj = {
    designW: 750,
    designH: 1438,
    imageUrls: [
      {
        name: "bg",
        url: "https://jhouxu.github.io/demo/long-scroll/images/bg.jpg",
      },
    ],
    multiple: 1000,
    distRatio: 1.25,
    timeRatio: 0.08,
  };

  // 残数初始化处理
  obj = Object.assign(obj, param);
  const { PIXI, renderDOM, designW, designH, imageUrls } = obj;

  // 初始化 pixi
  const app = new PIXI.Application({
    width: designW,
    height: designH,
    transparent: true,
    antialias: true,
    roundPixels: true,
    backgroundColor: "#ffffff",
    preserveDrawingBuffer: true,
  });
  renderDOM.appendChild(app.view);
  app.loader.add(imageUrls).load(onAssetsLoaded);

  let dist = 0;
  let duration = 0;

  // 获取点坐标 start
  const pointer = {
    down: {},
    up: {},
    diff: {},
  };

  function onAssetsLoaded(loader, resource) {
    // 创建背景容器
    let BgContainer = new PIXI.Container();
    // 创建背景纹理
    let BgTexture = resource["bg"].texture;
    // 创建平铺精灵
    let BgTilingSprite = new PIXI.TilingSprite(BgTexture, designW, designH * obj.multiple);
    BgContainer.addChild(BgTilingSprite);
    app.stage.addChild(BgContainer);

    BgContainer.interactive = true;
    BgContainer.on("pointerdown", (e) => pointerdownHandle(e));
    BgContainer.on("pointerup", (e) => pointerupHandle(e, BgTilingSprite));
    // 获取点坐标 end

    // 执行动画 start
    // 执行动画 end
  }

  // 手势按下 - 处理函数
  function pointerdownHandle(e) {
    const { x, y } = e.data.global;
    pointer.down = {
      x: parseInt(x),
      y: parseInt(y),
      timestamp: getTimestamp(),
    };
  }

  // 手势松开 - 处理函数
  function pointerupHandle(e, BgTilingSprite) {
    const { x, y } = e.data.global;
    pointer.up = {
      x: parseInt(x),
      y: parseInt(y),
      timestamp: getTimestamp(),
    };

    const { down, up } = pointer;
    pointer.diff = {
      x: up.x - down.x,
      y: up.y - down.y,
      timestamp: up.timestamp - down.timestamp,
      dist: y - x,
    };

    // 根据 distRatio 和 timeRatio 系数比例，动态计算当前背景平铺精灵需要位移距离和位移所需时间
    dist = dist + pointer.diff.y * obj.distRatio;
    duration = pointer.diff.timestamp * obj.timeRatio;
    console.log(dist, duration);

    // 手势方向判断 向上滑动
    if (pointer.diff.dist < 0) {
      gsap.to(BgTilingSprite, { duration: duration, y: dist, ease: "expo.out" }); // 动画执行
    }
  }

  function getTimestamp() {
    return new Date().getTime();
  }

  function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
  }
}
