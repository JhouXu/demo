"use strict";

document.querySelector("#btn").addEventListener("click", () => captureHandle("#rtc", "#img"));
function captureHandle(captureId, renderId) {
  const dom = document.querySelector(captureId);
  const { devicePixelRatio } = window;
  const { offsetWidth, offsetHeight } = dom;

  html2canvas(dom, {
    useCORS: true,
    scale: devicePixelRatio,
    width: offsetWidth,
    height: offsetHeight,
  })
    .then((canvas) => {
      const base64Data = canvas.toDataURL("image/png");
      document.querySelector(renderId).setAttribute("src", base64Data);
    })
    .catch((err) => {
      console.log(`html2canvas 内部执行发生错误： ${err}`);
    });
}

initCamera("#rtc");
function initCamera(renderId) {
  // 浏览器兼容判断
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    throw new Error("enumerateDevices is not supported");
  }

  const video = document.querySelector(renderId);
  const { innerWidth, innerHeight, devicePixelRatio } = window;
  alert(innerWidth + "-" + innerHeight + "-" + devicePixelRatio);

  const constraints = {
    audio: false,
    video: {
      // width: innerWidth * devicePixelRatio,
      // height: innerHeight * devicePixelRatio,
      facingMode: { exact: "environment" },
    },
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      // srcObject 视频实时流
      video.srcObject = stream;
    })
    .catch((err) => {
      console.log(err);
    });
}

// (function () {
//   const { innerWidth, innerHeight, devicePixelRatio } = window;
//   AutoScale(document.querySelector("#rtc"), innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
// })();
