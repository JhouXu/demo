"use strict";

document.querySelector("#btn").addEventListener("click", () => captureHandle("#rtc"));
function captureHandle(captureId) {
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
      console.log(canvas.toDataURL("image/png"));
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

  const constraints = { audio: false, video: { facingMode: { exact: "environment" } } };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      let video = document.querySelector(renderId);
      video.srcObject = stream;
    })
    .catch((err) => {
      console.log(err);
    });
}
