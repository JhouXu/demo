"use strict";

// if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
//   navigator.mediaDevices
//     .getUserMedia({
//       audio: false,
//       video: true,
//     })
//     .then((stream) => {
//       console.log(stream);
//       var video = document.querySelector("video");
//       video.src = window.URL.createObjectURL(stream);
//       video.play();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// } else {
//   throw new Error("enumerateDevices is not supported");
// }

// // 浏览器兼容判断
// if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
//   throw new Error("enumerateDevices is not supported");
// }

// // promise 配置
// navigator.mediaDevices
//   .getUserMedia()
//   .then((devices) => {
//     console.log("devices", devices);
//   })
//   .catch((error) => {
//     throw error;
//   });

// let openCamera = (videoId) => {
//   /**
//    * 成功回调函数
//    * @param stream 视频流
//    */
//   let success = (stream) => {
//     const videoDOM = document.querySelector(videoId);
//     mediaTrack = stream.getTracks()[0];
//     console.log(stream);
//     let CompatibleURL = window.URL || window.webkitURL;
//     try {
//       videoDOM.src = CompatibleURL.createObjectURL(stream);
//       console.log(videoDOM.src);
//     } catch (e) {
//       videoDOM.srcObject = stream;
//       console.log(videoDOM.srcObject);
//     }
//     videoDOM.play();
//   };

//   let error = (error) => {
//     console.log("无法访问媒体设备", error);
//   };

//   let constraints = {
//     audio: false,
//     video: true, // 后置
//   };

//   navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
// };

// openCamera("#video");

navigator.mediaDevices
  .getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } })
  .then((stream) => {
    let video = document.querySelector("#rtc");
    video.srcObject = stream;

    setTimeout(() => {
      video.play();
      console.log("rtc 启动播放");
    }, 1000);
  })
  .catch((err) => {
    console.log(err);
  });
