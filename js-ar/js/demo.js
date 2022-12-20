"use strict";

import ResponseScale from "../utils/response-scale.js";

window.isPlay = false;

// aFrame 注册组件
AFRAME.registerComponent("marker-handler", {
  init: function () {
    let { sceneEl } = this.el; // this.el === <a-nft></a-nft>>
    let dom = document.querySelector(".entity"); // dom === <a-entity></a-entity>
    this.dom = dom;

    // 图像出现在视野时，播放模型骨骼动画
    sceneEl.addEventListener("markerFound", (evt) => {
      setTimeout(() => {
        dom.setAttribute("animation-mixer", { timeScale: 1, loop: "repeat" });
        isPlay = true;
      }, 500);
    });

    // 图像消失在视野时，暂停模型骨骼动画
    sceneEl.addEventListener("markerLost", () => {
      setTimeout(() => dom.setAttribute("animation-mixer", { timeScale: 0 }), 500);
      isPlay = false;
    });

    // a-frame and arjs 点击事件绑定
    const animatedMarker = document.querySelector("#animated-marker");
    const aEntity = document.querySelector("#animated-model");
    animatedMarker.addEventListener("click", (e, target) => {
      const intersectedElement = e && e.detail && e.detail.intersectedEl;
      if (aEntity && intersectedElement === aEntity) {
        const scale = aEntity.getAttribute("scale");
        Object.keys(scale).forEach((key) => (scale[key] = scale[key] + 1));
        aEntity.setAttribute("scale", scale);
      }
    });
  },
});
AFRAME.registerComponent("event-handler", {
  onClick: null,
  onClickFun: function () {
    console.log("onClick");
  },

  onTouchstart: null,
  onTouchstartFun: function () {
    console.log("onTouchstart");
  },

  init: function () {
    // const { el } = this;
    this.onClick = this.onClickFun.bind(this);
    this.onTouchstart = this.onTouchstartFun.bind(this);
    this.el.addEventListener("click", this.onClick);
    this.el.addEventListener("touchstart", this.onTouchstart);
  },

  remove: function () {
    // const { el } = this;
    this.el.removeEventListener("click", this.onClick);
    this.el.removeEventListener("touchstart", this.onTouchstart);
  },
});

window.onload = () => {
  // 高度自适应
  const MainDOM = document.querySelector(".main");
  setInnerHeight(MainDOM);
  window.onresize = () => setInnerHeight(MainDOM);

  // 缩放自适应
  new ResponseScale(document.querySelector(".main .main-container"), 750, 1334);

  // aframe and arjs
  setTimeout(() => {
    // 定时执行，重置模型样式并且隐藏模型
    var sceneEl = document.querySelector("a-scene");
    var entity = sceneEl.querySelector("a-entity");
    entity.setAttribute("position", { x: 120, y: 0, z: -210 });
    entity.setAttribute("rotation", { x: -90, y: 0, z: 0 });
    entity.setAttribute("scale", { x: 0, y: 0, z: 0 });

    // 暂停动画播放
    animController(".entity", "isPlay");
    document.querySelector(".entity").setAttribute("animation-mixer", { timeScale: 0 });

    // document.querySelector(".mark").style.display = "flex";
  }, 10000);

  // 事件绑定处
};

function setInnerHeight(dom) {
  dom.style.height = `${window.innerHeight}px`;
}

function animController(domStr, storeName) {
  if (window[storeName]) {
    // 暂停
    window[storeName] = false;
    document.querySelector(domStr).setAttribute("animation-mixer", { timeScale: 0 });
  } else {
    // 播放
    window[storeName] = true;
    document.querySelector(domStr).setAttribute("animation-mixer", { timeScale: 1, loop: "repeat" });
  }
}
