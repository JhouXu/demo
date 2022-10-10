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
    resolution: 1,
    designW: 750,
    designH: 1438,
    imageUrls: [
      {
        name: "bg",
        url: "https://jhouxu.github.io/demo/long-scroll/images/bg.png",
      },
    ],
    multiple: 1000, // 所需的平铺高度数量

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
    _ease: "power1.out",
  };

  // 残数初始化处理
  param = Object.assign(param, initParma);
  param._dist = -((param.designH * param.multiple) / 2);
  param._duration = 0;

  const { PIXI, renderDOM, designW, designH, multiple, imageUrls } = param;

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

  // 媒体素材加载完成时触发回调
  function onAssetsLoaded(loader, resource) {
    let BgContainer = new PIXI.Container();
    let BgTexture = resource["bg"].texture;
    let BgTilingSprite = new PIXI.TilingSprite(BgTexture, designW, designH * multiple);
    BgTilingSprite.position.y = -((param.designH * param.multiple) / 2); // 初始化精灵处于垂直居中位置
    BgContainer.addChild(BgTilingSprite);
    app.stage.addChild(BgContainer);

    // 开启背景容器互动事件监听
    BgContainer.interactive = true;
    BgContainer.on("pointerdown", (e) => {
      pointerdownHandle(e);
      longPointerHandle("down", param._tween);
    });
    BgContainer.on("pointermove", (e) => longPointerHandle("move", param._tween));
    BgContainer.on("pointerup", (e) => {
      pointerupHandle(e, BgTilingSprite);
      longPointerHandle("up", param._tween);
    });
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
      animationHandle(BgTilingSprite);
    } else {
      const { y } = param._pointer.diff;

      if (y === 0) {
        param._state = false;
        param._tween.kill();
        param._dist = BgTilingSprite.position.y;
      } else {
        param._state = false; // 修改动画状态
        param._tween.kill(); // 销毁补间动画
        animationHandle(BgTilingSprite);
      }
    }
  }

  function animationHandle(sprite) {
    param._state = true;
    param._dist = param._dist + param._pointer.diff.y * param._distRatio;
    param._duration = param._pointer.diff.timestamp * param._timeRatio;

    param._tween = gsap.to(sprite, {
      duration: param._duration,
      y: param._dist,
      ease: param._ease,
      onComplete: () => {
        // 动画执行完成，修改状态
        param._state = false;
      },
    });
  }

  // 长按操作,
  function longPointerHandle(type, tween, time = 200) {
    let timeoutKey = 0;

    switch (type) {
      case "down":
        timeoutKey = setTimeout(() => {
          tween?.kill();
        }, time);
        break;
      case "move":
        clearTimeout(timeoutKey);
        break;
      case "up":
        clearTimeout(timeoutKey);
        break;
      default:
        throw new Error("错误 type");
    }
  }

  function getTimestamp() {
    return new Date().getTime();
  }

  function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
  }
}
