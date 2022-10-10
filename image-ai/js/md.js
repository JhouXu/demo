"use strict";

// 浏览器兼容判断
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  throw new Error("enumerateDevices is not supported");
}

const constraints = { audio: false, video: { facingMode: { exact: "environment" } } };
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    let video = document.querySelector("#rtc");
    video.srcObject = stream;
  })
  .catch((err) => {
    console.log(err);
  });
