window.isPlay = false;
window.isFirst = true;

// aframe 绑定处理程序
// 监听 markerFound、markerLost 事件
AFRAME.registerComponent("marker-handler", {
  init: function () {
    let { sceneEl } = this.el; // this.el === <a-nft></a-nft>>
    let doms = document.querySelectorAll(".e-entity"); // dom === <a-entity></a-entity>
    this.doms = doms;

    // 图像出现在视野时
    sceneEl.addEventListener("markerFound", (evt) => {
      console.log("markerFound");

      if (window.isFirst) {
        ResetModel();
        window.isFirst = false;
      }

      setTimeout(() => {
        // 播放模型骨骼动画
        for (let d of doms) d.setAttribute("animation-mixer", { timeScale: 1, loop: "repeat" });
        isPlay = true;
      }, 500);
    });

    // 图像消失在视野时
    sceneEl.addEventListener("markerLost", () => {
      console.log("markerLost");

      setTimeout(() => {
        // 暂停模型骨骼动画
        for (let d of doms) d.setAttribute("animation-mixer", { timeScale: 0 });
        isPlay = false;
      }, 500);
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

// 子辈事件处理
AFRAME.registerComponent("parent-handler", {
  init: function () {
    const { el } = this;
    const entities = el.querySelectorAll(".e-entity");

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

  // (() => {
  //   setTimeout(() => {
  //     console.log("重置样式");

  //     // // 重置模型样式
  //     // var sceneEl = document.querySelector("a-scene");
  //     // var entity = sceneEl.querySelector("a-entity");
  //     // entity.setAttribute("position", { x: 120, y: 0, z: -210 });
  //     // entity.setAttribute("rotation", { x: -90, y: 0, z: 0 });
  //     // entity.setAttribute("scale", { x: 0, y: 0, z: 0 });

  //     // // 暂停动画播放
  //     // animController(".e-entity", "isPlay");
  //     // document.querySelector(".e-entity").setAttribute("animation-mixer", { timeScale: 0 });

  //     // document.querySelector(".mark").style.display = "flex";
  //   }, 10000);
  // })();

  (() => {
    const MarkHangtian = document.querySelector(".mark .hangtian img");
    const MarkBody = document.querySelector(".mark .body img");
    const MarkQq = document.querySelector(".mark .qq img");

    const Mark = document.querySelector(".mark");
    const Lottery = document.querySelector(".lottery");

    MarkHangtian.addEventListener("click", () => {
      console.log("click: hangtian");
      alert("点击了航天器");
    });

    MarkBody.addEventListener("click", () => {
      console.log("click: shuhua");
      window.open("https://www.yili.com/cms/rest/reception/products/show?id=15");
    });

    MarkQq.addEventListener("click", () => {
      console.log("click: qq");

      Mark.style.display = "none";
      Lottery.style.display = "flex";
    });

    Lottery.addEventListener("click", () => {
      Mark.style.display = "flex";
      Lottery.style.display = "none";
    });
  })();

  // 监听 a-assets 资源是否加载完成
  // const Assets = document.querySelector("#assets");
  // Assets.addEventListener("loaded", (e) => {
  //   console.log(e);
  // });
  // Assets.addEventListener("timeout", (e) => {
  //   console.log(e);
  // });
};

function animController(domStr, storeName) {
  if (window[storeName]) {
    // 暂停
    window[storeName] = false;
    for (let d of document.querySelectorAll(domStr)) {
      d.setAttribute("animation-mixer", { timeScale: 0 });
    }
  } else {
    // 播放
    window[storeName] = true;
    for (let d of document.querySelectorAll(domStr)) {
      d.setAttribute("animation-mixer", { timeScale: 1, loop: "repeat" });
    }
  }
}

function ResetModel() {
  // 定时，重置模型位置
  setTimeout(() => {
    console.log("重置样式");

    let sceneEl = document.querySelector("a-scene");
    let doms = sceneEl.querySelectorAll(".e-entity");
    for (let entity of doms) {
      // 隐藏所有模型
      entity.setAttribute("scale", { x: 0, y: 0, z: 0 });
      console.log(entity);
    }

    // 暂停动画播放
    // animController(".e-entity", "isPlay");
    // document.querySelector(".e-entity").setAttribute("animation-mixer", { timeScale: 0 });

    // 显示遮罩层
    document.querySelector(".mark").style.display = "flex";
  }, 10000);
}
