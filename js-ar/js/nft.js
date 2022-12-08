window.isPlay = false;

// aframe 绑定处理程序
AFRAME.registerComponent("markerhandler", {
  init: function () {
    let { sceneEl } = this.el; // this.el === <a-nft></a-nft>>
    let dom = document.querySelector(".entity"); // dom === <a-entity></a-entity>
    this.dom = dom;

    // sceneEl.addEventListener("click", () => {
    //   console.log("click");
    // });

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

    const eEntity = this.el.querySelectorAll(".entity");
    console.log(eEntity);
  },
});

AFRAME.registerComponent("event", {
  init: function () {
    const { el } = this;
    this.onClick = this.onClick.bind(this);
    el.addEventListener("click", this.onClick);
  },

  onClick: function () {
    alert("click");
    // console.log("click");
  },
});

window.onload = function () {
  // start-ios-wechat-camer click 事件
  document.querySelector("#start-ios-wechat-camer").addEventListener("click", (e) => {
    alert("open camera");
  });

  document.querySelector("#play-pause-handler").addEventListener("click", (e) => animController(".e-entity", "isPlay"));

  document.querySelector("#get-position").addEventListener("click", (e) => {
    getPosition()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

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

setTimeout(() => {
  var sceneEl = document.querySelector("a-scene");
  var entity = sceneEl.querySelector("a-entity");
  entity.setAttribute("position", { x: 120, y: 0, z: -210 });
  entity.setAttribute("rotation", { x: -90, y: 0, z: 0 });
  entity.setAttribute("scale", { x: 100, y: 100, z: 100 });

  console.log("重置样式");
}, 10000);
