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
        url: "../images/bg.jpg",
      },
    ],
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

  function onAssetsLoaded(loader, resource) {
    let BgContainer = new PIXI.Container();
    let BgTexture = resource["bg"].texture;
    console.log(BgTexture);
    let BgTilingSprite = new PIXI.TilingSprite(BgTexture, designW, designH);
    BgTilingSprite.tileScale.set(0.5, 0.5);

    BgContainer.addChild(BgTilingSprite);
    app.stage.addChild(BgContainer);
  }
}
