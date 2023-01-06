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

      const image = base64Data.split("base64,")[1];

      // 云图库的Client-end URL
      const clientendUrl = "https://396191d0bc46776a332f68a7c10d913d.cn1.crs.easyar.com:8443/search";
      // 云图库的Cloud Token
      // 到期时间：2023-03-07 03:17:23
      const token =
        "ci+MFQsIHrWy8jLWBEz3gyd11jgzIxKjT/ueDLftytsrBtol4vCxO4xFNNZPZVh98NPJ9ph0qPHMxvtiVBBo6zl3DRTXsCl/uywADbNpV0aqJ9UlhRVG6nGpCR1vmCmbYFwsj2z9uwQgTPGAJxJwlrJsBTpkURby9l6UBdpW1osb8sl33VpHlriO2/I6g/VhFIMxSRUW0UH8MT/yFElS57hsgFiZcEyi82HhCw7Ckp05Zcwlif6P3xMioMsskxLkxL2hiw4vn8O/jwNzgbkcOoNjNhnl9GICeOiMtxA6TtJRTMDHN0HkqsnwCWR+1nN3ALXG8d3MBLiLp51eUzrUcjoGJRHev6Yi9oxAXPA6trS/zpijYq8i6/iBcg/qdKPAm7IdoQe05Zj4wSTnj/tfJk9dczYCooqzRgvIfBh0YAEMsg7EbF9U7JsihaU4a2PLp2Ap8MhvnWxHB6g8CTViXMoGXBIQeb22WC1lcJ9016FKFIon2jnghBKQnONzaWRftl/EHJX59sxOwL15d8ISpcQGLITu0A1u4qeHeA628AAiQaoX1oIO+vYU1DyY2bTgr6lfYk1ScSzB/PDIpuvlwzT50ndeMdyLlt0GolK4i8FctbZ9Xg3AWEPH+jCmKsNH";
      // 云图库的CRS AppId
      const appId = "b22a733c9d0916019976d9cbaa80a069";

      axios
        .post(
          clientendUrl,
          {
            image,
            appId,
          },
          {
            headers: {
              "Content-Type": "application/json;Charset=UTF-8",
              Authorization: token,
            },
          }
        )
        .then((res) => {
          // https://您云图库的Client-end URL/search 在未识到目标时，HTTP状态码为404。
          console.log(res.data.result.target);
        })
        .catch((err) => {
          console.log("当前图像无法识别，请重试");
          console.log(err);
        });
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
  // alert(innerWidth + "-" + innerHeight + "-" + devicePixelRatio);

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
