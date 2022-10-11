/* 自适应 */
export class AutoScale {
  constructor(dom, designW = 750, designH = 1438) {
    // Object.access(this, obj);
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
    let w = (innerW / designW).toFixed(3) * 1;
    let h = (innerH / designH).toFixed(3) * 1;
    // return w < h ? h : w;
    return w;
    // return h;
  }

  setScaleDom(dom, scale) {
    return (dom.style.transform = `scale(${scale})`);
  }

  onResize() {
    window.addEventListener("resize", (e) => {
      this.init();
    });
  }
}
