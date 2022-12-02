let isPlay = false;

// aframe 绑定处理程序
AFRAME.registerComponent("markerhandler", {
  init: function () {
    let { sceneEl } = this.el;
    let dom = document.querySelector(".e-entity");
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

window.onload = function () {
  // start-ios-wechat-camer click 事件
  document.querySelector("#start-ios-wechat-camer").addEventListener("click", (e) => {
    alert("open camera");
  });

  document.querySelector("#play-pause-handler").addEventListener("click", (e) => {
    if (isPlay) {
      isPlay = false;
      document.querySelector(".e-entity").setAttribute("animation-mixer", { timeScale: 0 });
    } else {
      document.querySelector(".e-entity").setAttribute("animation-mixer", { timeScale: 1, loop: "repeat" });
      isPlay = true;
    }
  });

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
