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

function renderHandle(param) {
  let obj = {
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
    resolution: window.devicePixelRatio,
  });
  renderDOM.appendChild(app.view);
  app.loader.add(imageUrls).load(onAssetsLoaded);

  obj._dist = -((obj.designH * obj.multiple) / 2);
  obj._duration = 0;

  function onAssetsLoaded(loader, resource) {
    // 创建背景容器
    let BgContainer = new PIXI.Container();
    // 创建背景纹理
    let BgTexture = resource["bg"].texture;
    // 创建平铺精灵
    let BgTilingSprite = new PIXI.TilingSprite(BgTexture, designW, obj.designH * obj.multiple);
    BgTilingSprite.position.y = -((obj.designH * obj.multiple) / 2);
    BgContainer.addChild(BgTilingSprite);
    app.stage.addChild(BgContainer);

    BgContainer.interactive = true;
    BgContainer.on("pointerdown", (e) => pointerdownHandle(e));
    BgContainer.on("pointerup", (e) => pointerupHandle(e, BgTilingSprite));
  }

  // 手势按下 - 处理函数
  function pointerdownHandle(e) {
    const { x, y } = e.data.global;
    obj._pointer.down = {
      x: parseInt(x),
      y: parseInt(y),
      timestamp: getTimestamp(),
    };
  }

  // 手势松开 - 处理函数
  function pointerupHandle(e, BgTilingSprite) {
    const { x, y } = e.data.global;
    obj._pointer.up = {
      x: parseInt(x),
      y: parseInt(y),
      timestamp: getTimestamp(),
    };

    const { down, up } = obj._pointer;
    obj._pointer.diff = {
      x: up.x - down.x,
      y: up.y - down.y,
      timestamp: up.timestamp - down.timestamp,
    };

    if (!obj._state) {
      animationHandle();
    } else {
      obj._state = false; // 修改动画状态
      obj._tween.kill(); // 销毁补间动画
      animationHandle();
    }

    function animationHandle() {
      obj._state = true;
      obj._dist = obj._dist + obj._pointer.diff.y * obj._distRatio;
      obj._duration = obj._pointer.diff.timestamp * obj._timeRatio;

      obj._tween = gsap.to(BgTilingSprite, {
        duration: obj._duration,
        y: obj._dist,
        ease: "power1.out",
        onComplete: () => {
          // 动画执行完成，修改状态
          obj._state = false;
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
