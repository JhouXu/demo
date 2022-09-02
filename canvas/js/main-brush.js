const { innerWidth, innerHeight } = window;

var canvas = new fabric.Canvas("dome");
// canvas.setDimensions({ innerWidth, innerHeight });
canvas.setWidth(innerWidth);
canvas.setHeight(innerHeight);

// 开启画布自由绘画模式
canvas.isDrawingMode = true;
// 设置自由绘画模式画笔类型为 铅笔类型
canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
// 设置自由绘画模式 画笔颜色与画笔线条大小
canvas.freeDrawingBrush.color = "#000000";
canvas.freeDrawingBrush.width = 1;

// 笔触操作
const BrushArr = [
  // PencilBrush 笔刷由 fabric 内置
  // {
  //   type: "PencilBrush",
  //   name: "铅笔",
  // },
  {
    type: "CrayonBrush",
    name: "蜡笔",
  },
  {
    type: "InkBrush",
    name: "墨笔",
  },
  {
    type: "MarkerBrush",
    name: "马克笔",
  },
  {
    type: "SprayBrush",
    name: "喷雾颜料",
  },
  // {
  //   type: "EraserBrush",
  //   name: "橡皮擦",
  // },
  {
    type: "clear",
    name: "清除画板",
  },
];
const controllerDOM = document.querySelector(".controller");
let str = "";
BrushArr.forEach((item) => {
  str += `<button class="item ${item.type}" data-brush-type="${item.type}">${item.name}</button>`;
});
controllerDOM.innerHTML = str;
const controllerButtons = document.querySelectorAll(".controller .item");
controllerButtons.forEach((item) => {
  item.addEventListener("click", () => {
    const attribute = item.getAttribute("data-brush-type");

    const content = item.innerText;

    if (content === "橡皮檫") {
      canvas.freeDrawingBrush = new fabric[attribute](canvas);
      return true;
    }

    if (content === "清除画板") {
      canvas.clear();
      return true;
    }

    canvas.freeDrawingBrush = new fabric[attribute](canvas, {
      width: 20,
      opacity: 0.6,
    });
  });
});
// init brush
canvas.freeDrawingBrush = new fabric[BrushArr[0].type](canvas, {
  width: 100,
  opacity: 0.6,
});

// 色盘操作
const Colors = {
  black: "#000000",
  power: "#f1809a",
  red: "#df241d",
  origin: "#ff9027",
  yellow: "#ffcd0b",
  green: "#0ec754",
  blue: "#5391f8",
  purple: "#9727ff",
};
const ColorDOM = document.querySelector(".color");
const ColorEntries = Object.entries(Colors);
let ColorInnerHtmlStr = ``;
ColorEntries.forEach((item) => {
  ColorInnerHtmlStr += `<button class="${item[0]} item" style="background: ${item[1]}" data-color="${item[1]}">${item[0]}</button>`;
});
ColorDOM.innerHTML = ColorInnerHtmlStr;

const ColorItemDOM = document.querySelectorAll(".color .item");
ColorItemDOM.forEach((item) => {
  item.addEventListener("click", () => {
    canvas.freeDrawingBrush.color = item.getAttribute("data-color");
  });
});
// init color
canvas.freeDrawingBrush.color = Colors[Object.keys(Colors)[0]];

console.log(canvas);

canvas.freeDrawingBrush.width = 5;
