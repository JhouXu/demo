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
    multiple: 100,
    resolution: 1,

    // 函数内部变量
    _distRatio: 4,
    _timeRatio: 0.05,
    _tween: null, // 动画对象
    _state: false, // 动画执行状态
    _direction: [], // top / bottom
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

  let dist = -((obj.designH * obj.multiple) / 2);
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
    let BgTilingSprite = new PIXI.TilingSprite(BgTexture, designW, obj.designH * obj.multiple);
    BgTilingSprite.position.y = -((obj.designH * obj.multiple) / 2);
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
    };

    // 滑动方向处理
    obj._direction.push(pointer.diff.y > 0 ? "bottom" : "top");

    if (!obj._state) {
      // console.log(dist, dist + pointer.diff.y * obj._distRatio, pointer.diff.timestamp * obj._timeRatio);
      obj._state = true;

      // 根据 _distRatio 和 _timeRatio 系数比例，动态计算当前背景平铺精灵需要位移距离和位移所需时间
      dist = dist + pointer.diff.y * obj._distRatio;
      duration = pointer.diff.timestamp * obj._timeRatio;
      obj._tween = gsap.to(BgTilingSprite, {
        duration: duration,
        y: dist,
        ease: "power1.out",
        onComplete: () => {
          // 动画执行完成，修改状态
          obj._state = false;
          obj._direction.length = 0;
        },
      });
    } else {
      const { _direction } = obj;
      const multiple = getMultipleDirection(_direction);
      obj._tween.timeScale(whetherDirection(_direction) ? 1 + multiple : 1 - multiple / 10);

      // console.group("分组");
      // console.log(obj._tween);
      // console.log(obj._tween.vars.y);
      // dist = dist + pointer.diff.y * obj._distRatio;
      // obj._tween.vars.y = dist;
      // console.log(obj._tween.vars.y);
      // console.log(obj._tween);
      // console.groupEnd();
    }
  }

  // 判断运动方向是否相同
  function whetherDirection(arr) {
    return arr.slice(-2)[0] === arr.slice(-2)[1];
  }

  // 统计方向数组最后连续出现的次数，作为速度倍数
  function getMultipleDirection(arr) {
    const { length } = arr;
    const key = arr[length - 1];
    let total = 0;

    for (let i = length; i--; i === 0) {
      if (arr[i] === key) {
        total++;
      } else break;
    }

    return total;
  }

  function getTimestamp() {
    return new Date().getTime();
  }

  function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
  }
}
