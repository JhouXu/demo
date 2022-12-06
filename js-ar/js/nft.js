window.isPlay = false;

// aframe 绑定处理程序
AFRAME.registerComponent("markerhandler", {
  init: function () {
    let { sceneEl } = this.el; // this.el === <a-nft></a-nft>>
    let dom = document.querySelector(".e-entity"); // dom === <a-entity></a-entity>

    // 图像出现在视野时，播放模型骨骼动画
    sceneEl.addEventListener("markerFound", () => {
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
  },
});

AFRAME.registerComponent("event", {
  init: function () {
    let { el } = this;

    el.addEventListener("click", () => {
      console.log("click");
    });
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

  // 尝试侦听模型渲染位置的事件
  // const EntityDOM = document.querySelector(".e-entity");
  // console.log(EntityDOM);
  // EntityDOM.addEventListener("click", (e) => animController(".e-entity", "isPlay"));
  document.querySelector("#e-entity").emit("fade");
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
