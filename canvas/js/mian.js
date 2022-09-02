"use strict";

const colors = {
  black: "#000000",
  power: "#f1809a",
  red: "#df241d",
  origin: "#ff9027",
  yellow: "#ffcd0b",
  green: "#0ec754",
  blue: "#5391f8",
  purple: "#9727ff",
};

/**
 *
 * @param {HTMLElementDOM} canvas dom节点
 * @param {String} drawColor 绘制画笔颜色
 */
class Canvas {
  constructor(data) {
    this.ctx;
    this.ratio = 5;
    this.drawColor = "#000000"; // 默认颜色
    this.drawWidth = 5 * this.ratio; // 默认线宽
    this.finished = false;
    this.touchCoordsArr = []; // 记录触控时每次的坐标
    this.touchImgArr = []; // 记录每次绘制结束导出图片
    this.create(data);
  }

  // 初始化参数
  create(d) {
    const { canvas } = d;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * this.ratio;
    canvas.height = height * this.ratio;

    Object.entries(d).forEach((item) => {
      this[item[0]] = item[1];
    });
  }

  init() {
    let { canvas } = this;
    this.ctx = canvas.getContext("2d");

    // 绑定事件监听
    canvas.addEventListener("touchstart", (e) => {
      this.getCoords.bind(this)(e, canvas);
    });
    canvas.addEventListener("touchmove", (e) => {
      this.getCoords.bind(this)(e, canvas);
      this.drawPath.bind(this)();
    });
    canvas.addEventListener("touchend", (e) => {
      this.getCoords.bind(this)(e, canvas);
      this.touchImgArr.push(
        canvas.toDataURL({ format: "image/png", quality: 1, width: canvas.width, height: canvas.height })
      );
    });
  }

  getCoords(e, canvas) {
    const { touchCoordsArr, ratio } = this;
    let { clientX, clientY } = e.changedTouches[0]; // 触控坐标（浏览器窗口的坐标）
    let { left, top } = canvas.getBoundingClientRect();

    touchCoordsArr.push({
      x: (clientX - left) * ratio,
      y: (clientY - top) * ratio,
    });
  }

  drawPath() {
    let { ctx, touchCoordsArr, drawColor, drawWidth } = this;
    let len = touchCoordsArr.length - 1;
    ctx.beginPath();
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = "butt"; // butt, round and square
    ctx.lineJoin = "miter"; // round, bevel and miter
    ctx.moveTo(touchCoordsArr[len - 1].x, touchCoordsArr[len - 1].y);
    ctx.lineTo(touchCoordsArr[len].x, touchCoordsArr[len].y);
    ctx.stroke();
  }

  back() {
    const { canvas, ctx, touchImgArr, clear } = this;
    const { length } = touchImgArr;

    if (length <= 1) {
      this.touchImgArr = [];
      clear.bind(this)();
      return;
    }

    const { width, height } = canvas;
    const img = new Image();
    img.src = touchImgArr[length - 2];
    img.onload = () => {
      clear.bind(this)();
      ctx.drawImage(img, 0, 0, width, height);
      this.touchImgArr.pop();
    };
  }

  // 清空画板
  clear() {
    let { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // 重置画板 - 恢复至初始状态
  reset() {
    this.clear();
    this.touchCoordsArr = [];
    this.touchImgArr = [];
  }

  setDrawColor(color) {
    this.drawColor = color;
  }
}

const Pen = new Canvas({ canvas: document.querySelector(".canvas") });
Pen.init();

// 渲染控制器面板
controllerRender(colors, "data-color", (color) => {
  Pen.setDrawColor(color);
});
function controllerRender(colors, attribute, callback) {
  let str = ``;
  Object.entries(colors).forEach((item, index) => {
    if (index === 0) {
      str += `<div class="item item-active" ${attribute}="${item[1]}" style="background: ${item[1]}"></div>`;
    } else {
      str += `<div class="item" ${attribute}="${item[1]}" style="background: ${item[1]}"></div>`;
    }
  });
  document.querySelector(".colors").innerHTML = str;

  const items = document.querySelectorAll(".colors .item");
  let itemActiveIndex = 0;

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      callback(item.getAttribute(attribute));

      items[itemActiveIndex].classList.remove("item-active");
      item.classList.add("item-active");
      itemActiveIndex = index;
    });
  });
}

// 清空画板
document.querySelector(".reset").addEventListener("click", () => {
  if (window.confirm("画板正在执行清空操作，清空完成后将无法找回！")) {
    document.querySelector(".img").src = "";
    Pen.reset();
  }
});

// 返回
document.querySelector(".back").addEventListener("click", () => {
  Pen.back();
});

// 完成
document.querySelector(".finish").addEventListener("click", () => {
  document.querySelector(".img").src = Pen.canvas.toDataURL({
    format: "image/png",
    quality: 1,
    width: Pen.canvas.width * 2,
    height: Pen.canvas.height * 2,
  });
  Pen.reset();
});

// 阻止页面下拉回弹
(() => {
  document.body.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    },
    { passive: false }
  ); //passive 参数不能省略，用来兼容ios和android
})();

// iphone 首次进入 touchstart touchmove touchend 一次触控完成中 touchmove 只执行两次
window.load = Pen.ctx.clearRect(0, 0, Pen.canvas.width, Pen.canvas.height);
