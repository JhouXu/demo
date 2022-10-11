"use strict";
import { scenes } from "./scenes.data.js";

var container = document.getElementById("container");
let condition = { preview: "value", panorama: "value", cubeMap: "array" }; // 包含图片的关键字段
let imgs = getImages(scenes, condition);
let progress = 0;

let viewer = null;

// 初始化 container，以及实时根据可视区域设定 container 显示区域
window.onload = () => {
  initRegion(container);
  imagePreload(imgs)
    .then(
      (res) => {
        // 隐藏遮罩
        console.table(res);

        $(".loading").fadeOut();
        viewer = initScene();
      },
      (err) => {
        // 保持遮罩
        console.error({ message: "error" });

        alert("当前网络不顺畅，请刷新网页重试");
      }
    )
    .finally(() => {
      console.log({ message: "finally" });
    });
};
window.onresize = () => {
  initRegion(container);

  viewer.setHfov(isMobile() ? 50 : 120);
};

function initRegion(dom) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  dom.style.width = `${width}px`;
  dom.style.height = `${height}px`;
}

// 图片预加载函数封装
function imagePreload(arr) {
  let promises = [];
  let imgs = [];

  for (let i = 0; i < arr.length; i++) {
    promises[i] = new Promise((resolve, reject) => {
      imgs[i] = new Image();
      imgs[i].src = arr[i];

      imgs[i].addEventListener("load", () => {
        progress = parseFloat((i / arr.length).toFixed(2)); // 图片资源加载进度，保留小数点后两位

        resolve({ message: "success", progress });
      });
    });
  }

  return Promise.all(promises);
}

/**
 * 将 pannellum 场景配置数据，根据用户自定义的图片所在字段，获取其中所包含的图片地址数据
 * @param {Object} data pannellum 场景配置数据
 * @param {Object} condition 图片字段信息 { imgFieIdName: imgFieIdType }
 * @returns {Array} 所获取的图片地址数据
 */
function getImages(data, condition) {
  const imgs = [];

  for (const cKey in condition) {
    if (Object.hasOwnProperty.call(condition, cKey)) {
      const cElem = condition[cKey];

      for (const dKey in data) {
        if (Object.hasOwnProperty.call(data, dKey)) {
          const dElem = data[dKey];

          if (dElem[cKey] && cElem === "value") {
            imgs.push(dElem[cKey]);
          } else if (dElem[cKey] && cElem === "array") {
            imgs.push(...dElem[cKey]);
          }
        }
      }
    }
  }

  return imgs.filter((item, index) => imgs.indexOf(item) === index);
}

// 初始化渲染场景
function initScene() {
  var hfov = isMobile() ? 50 : 120;
  var firstScene = "hotelScene";
  var duration = 800;
  var step = 10;

  var viewer = pannellum.viewer("container", {
    default: {
      firstScene,
      sceneFadeDuration: duration,
      hotSpotDebug: false,
      showControls: false,
      // 由于在加载监听函数和场景切换函数中进行了 (hfov - 10) 操作，所以需要在全局的时候配置 hfov: viewer.getHov() + 需偏移距离
      hfov: hfov + step, // 起始水平视野，hfov 默认值为 100

      // orientationOnByDefault: true,
      autoLoad: true,

      // yaw: 290, // 根据场景一 hotelScene + 180
      // pitch: 90,
    },
    scenes,
  });

  viewer.on("load", (id) => {
    viewer.setHfov(hfov - step, duration);
  });

  viewer.on("scenechange", (id) => {
    console.warn(`正在切换至 ${id} 场景`);
    // viewer.setHfov(hfov - step, duration);
  });

  return viewer;
}

function isMobile() {
  // return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const { innerWidth, innerHeight } = window;

  return innerWidth < innerHeight;
}
