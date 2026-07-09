window.FinYatraScroll = {
  _dotNet: null,
  _handler: null,
  _threshold: 48,

  _root() {
    return document.scrollingElement || document.documentElement;
  },

  toTop() {
    const root = this._root();
    root.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => this.refresh(), 350);
  },

  toBottom() {
    const root = this._root();
    const max = Math.max(0, root.scrollHeight - window.innerHeight);
    root.scrollTo({ top: max, behavior: "smooth" });
    window.scrollTo({ top: max, behavior: "smooth" });
    setTimeout(() => this.refresh(), 350);
  },

  getState() {
    const root = this._root();
    const y = window.scrollY || root.scrollTop || 0;
    const max = Math.max(0, root.scrollHeight - window.innerHeight);
    return {
      canScrollUp: y > this._threshold,
      canScrollDown: y < max - this._threshold,
      hasOverflow: max > this._threshold
    };
  },

  init(dotNetRef) {
    this.dispose();
    this._dotNet = dotNetRef;
    this._handler = () => this._notify();
    window.addEventListener("scroll", this._handler, { passive: true });
    window.addEventListener("resize", this._handler, { passive: true });
    // Delay first read until layout is settled.
    setTimeout(() => this._notify(), 0);
    setTimeout(() => this._notify(), 250);
  },

  dispose() {
    if (this._handler) {
      window.removeEventListener("scroll", this._handler);
      window.removeEventListener("resize", this._handler);
    }
    this._dotNet = null;
    this._handler = null;
  },

  refresh() {
    this._notify();
  },

  scrollTopFallback() {
    this.toTop();
  },

  scrollBottomFallback() {
    this.toBottom();
  },

  _notify() {
    if (!this._dotNet) return;
    const state = this.getState();
    this._dotNet
      .invokeMethodAsync(
        "OnScrollStateChanged",
        state.canScrollUp,
        state.canScrollDown,
        state.hasOverflow
      )
      .catch(() => { /* component disposed */ });
  }
};
