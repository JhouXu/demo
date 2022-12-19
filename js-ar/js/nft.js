window.isPlay = false;

// aframe 绑定处理程序
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

// 事件处理
AFRAME.registerComponent("event-handler", {
  init: function () {
    // let { sceneEl } = this.el;
    // sceneEl.addEventListener("click", () => {
    //   console.log("click");
    // });
    // sceneEl.addEventListener("touchstart", () => {
    //   console.log("touchstart");
    // });
    // sceneEl.addEventListener("touchmove", () => {
    //   console.log("touchmove");
    // });
    // sceneEl.addEventListener("touchend", () => {
    //   console.log("touchend");
    // });
    // sceneEl.addEventListener("mousedown", () => {
    //   console.log("mousedown");
    // });

    const { el } = this;
    this.onClick = this.onClick.bind(this);
    this.onTouchstart = this.onTouchstart.bind(this);
    el.addEventListener("click", this.onClick);
    el.addEventListener("touchmove", this.onTouchstart);
  },

  remove: function () {
    const { el } = this;
    el.removeEventListener("click", this.onClick);
    el.removeEventListener("touchstart", this.onTouchstart);
  },

  onClick: function () {
    console.log("onClick");
  },

  onTouchstart: function () {
    console.log("onTouchstart");
  },
});

// 子辈事件处理
AFRAME.registerComponent("parent-handler", {
  init: function () {
    const { el } = this;
    const entities = el.querySelectorAll(".entity");

    for (let [key, item] of entities.entries()) {
      console.log(key, item);
      item.addEventListener("click", () => {
        console.log("entity event click");
      });

      item.addEventListener("touchstart", () => {
        console.log("entity event touchstart");
      });

      item.addEventListener("touchmove", () => {
        console.log("entity event touchmove");
      });

      item.addEventListener("touchend", () => {
        console.log("entity event touchend");
      });
    }
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

  (() => {
    setTimeout(() => {
      // 重置模型样式
      var sceneEl = document.querySelector("a-scene");
      var entity = sceneEl.querySelector("a-entity");
      entity.setAttribute("position", { x: 120, y: 0, z: -210 });
      entity.setAttribute("rotation", { x: -90, y: 0, z: 0 });
      entity.setAttribute("scale", { x: 100, y: 100, z: 100 });

      console.log("重置样式");

      // 暂停动画播放
      animController(".e-entity", "isPlay");
      // document.querySelector(".e-entity").setAttribute("animation-mixer", { timeScale: 0 });

      // document.querySelector(".mark").style.display = "flex";
    }, 10000);
  })();

  (() => {
    const MarkHead = document.querySelector(".mark .head img");
    const MarkBody = document.querySelector(".mark .body img");

    MarkHead.addEventListener("click", () => {
      alert("click head");
    });

    MarkBody.addEventListener("click", () => {
      alert("click body");
    });
  })();
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
