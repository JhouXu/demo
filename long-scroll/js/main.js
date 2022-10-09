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
  designW,
  designH,
});
// 初始化容器自适应
const dom = document.querySelector(".container .scene");
new AutoScale(dom, designW * window.devicePixelRatio, designH * window.devicePixelRatio);

function renderHandle(initParma) {
  let param = {
    designW: 750,
    designH: 1438,
    imageUrls: [
      {
        name: "bg",
        url: "https://jhouxu.github.io/demo/long-scroll/images/bg.png",
      },
    ],
    multiple: 1000,
    resolution: 1,

    // 函数内部变量
    _dist: 0,
    _duration: 0,
    _distRatio: 4,
    _timeRatio: 0.05,
    _tween: null, // 动画对象，重复执行时，作为销毁存储处理
    _state: false, // 动画执行状态 false or true
    _pointer: {
      down: {},
      up: {},
      diff: {},
    },
  };

  // 残数初始化处理
  param = Object.assign(param, initParma);
  const { PIXI, renderDOM, designW, designH, imageUrls } = param;

  // 初始化 pixi
  const app = new PIXI.Application({
    width: designW,
    height: designH,
    transparent: true,
    antialias: true,
    roundPixels: true,
    backgroundColor: "#ffffff",
    preserveDrawingBuffer: true,
    resolution: window.devicePixelRatio,
  });
  renderDOM.appendChild(app.view);
  app.loader.add(imageUrls).load(onAssetsLoaded);

  param._dist = -((param.designH * param.multiple) / 2);
  param._duration = 0;

  function onAssetsLoaded(loader, resource) {
    // 创建背景容器
    let BgContainer = new PIXI.Container();
    // 创建背景纹理
    let BgTexture = resource["bg"].texture;
    // 创建平铺精灵
    let BgTilingSprite = new PIXI.TilingSprite(BgTexture, designW, param.designH * param.multiple);
    BgTilingSprite.position.y = -((param.designH * param.multiple) / 2);
    BgContainer.addChild(BgTilingSprite);
    app.stage.addChild(BgContainer);

    BgContainer.interactive = true;
    BgContainer.on("pointerdown", (e) => pointerdownHandle(e));
    BgContainer.on("pointerup", (e) => pointerupHandle(e, BgTilingSprite));
  }

  // 手势按下 - 处理函数
  function pointerdownHandle(e) {
    const { x, y } = e.data.global;
    param._pointer.down = {
      x: parseInt(x),
      y: parseInt(y),
      timestamp: getTimestamp(),
    };
  }

  // 手势松开 - 处理函数
  function pointerupHandle(e, BgTilingSprite) {
    const { x, y } = e.data.global;
    param._pointer.up = {
      x: parseInt(x),
      y: parseInt(y),
      timestamp: getTimestamp(),
    };

    const { down, up } = param._pointer;
    param._pointer.diff = {
      x: up.x - down.x,
      y: up.y - down.y,
      timestamp: up.timestamp - down.timestamp,
    };

    if (!param._state) {
      animationHandle();
    } else {
      param._state = false; // 修改动画状态
      param._tween.kill(); // 销毁补间动画
      animationHandle();
    }

    function animationHandle() {
      param._state = true;
      param._dist = param._dist + param._pointer.diff.y * param._distRatio;
      param._duration = param._pointer.diff.timestamp * param._timeRatio;

      param._tween = gsap.to(BgTilingSprite, {
        duration: param._duration,
        y: param._dist,
        ease: "power1.out",
        onComplete: () => {
          // 动画执行完成，修改状态
          param._state = false;
        },
      });
    }
  }

  function getTimestamp() {
    return new Date().getTime();
  }

  function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
  }
}
