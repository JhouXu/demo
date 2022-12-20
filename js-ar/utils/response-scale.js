/**
 * 根据设计稿的宽高度，自动获取浏览器窗口大小，通过 transform:scale 属性实现缩放响应。
 * @param {HTMLElement} dom 需要缩放的 HTMLElement
 * @param {Number} designW 设计稿宽度
 * @param {Number} designH 设计稿高度
 */
class ResponseScale {
  constructor(dom, designW = 750, designH = 1448) {
    this.dom = dom;
    this.inner;
    this.scale;
    this.designW = designW;
    this.designH = designH;

    this.init();
    this.onResize();
  }

  init() {
    this.inner = this.getInner();
    this.scale = this.getScale(this.inner.w, this.inner.h, this.designW, this.designH);
    this.setScaleDom(this.dom, this.scale);
  }

  getInner() {
    return {
      w: window.innerWidth,
      h: window.innerHeight,
    };
  }

  getScale(innerW, innerH, designW, designH) {
    let w = +(innerW / designW).toFixed(3);
    let h = +(innerH / designH).toFixed(3);
    // if (innerW < innerH) return w;
    // else return h;
    return w < h ? h : w;
  }

  setScaleDom(dom, scale) {
    return (dom.style.transform = `scale(${scale})`);
  }

  onResize() {
    window.addEventListener("resize", () => this.init());
  }
}

export default ResponseScale;
