/*!
 * Access Counter Custom components v1.1
 * (c) 2026 zyn.f5.si
 * Licensed under MIT
 * github.com/kons10/Nizi-Counter
 */

class CountDB extends HTMLElement {
  static countCache = new Map(); // key: `${db}|${domain}` → value: Promise<string>

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const db = this.getAttribute("db");
    const domain = this.getAttribute("domain");
    const imgPath = this.getAttribute("img") || "/count_img/";
    const imgType = this.getAttribute("img-type") || "webp";
    const left = this.hasAttribute("left");
    const right = this.hasAttribute("right");

    const widthAttr = this.getAttribute("width");
    const heightAttr = this.getAttribute("height");

    if (!db || !domain) {
      console.error("<count-db> requires db and domain attributes.");
      return;
    }

    const digitWidth = widthAttr ? Number(widthAttr) : 16;
    const digitHeight = heightAttr ? Number(heightAttr) : 24;

    const key = `${db}|${domain}`;
    let countPromise = CountDB.countCache.get(key);
    if (!countPromise) {
      const url = `https://${db}/?domain=${encodeURIComponent(domain)}`;
      countPromise = fetch(url, { cache: "force-cache" })
        .then((res) => res.text())
        .then((t) => t.trim())
        .catch((e) => {
          console.error("<count-db> fetch error:", e);
          return "0";
        });
      CountDB.countCache.set(key, countPromise);
    }

    const count = await countPromise;

    // Shadow DOM 初期化
    this.shadowRoot.innerHTML = "";

    const frag = document.createDocumentFragment();

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
      }
      .wrapper {
        display: inline-flex;
        align-items: center;
      }
      .digit {
        display: inline-block;
        width: var(--digit-width);
        height: var(--digit-height);
        background-image: url("${imgPath}/digits.${imgType}");
        background-repeat: no-repeat;
        background-size: calc(10 * var(--digit-width)) var(--digit-height);
      }
      .decor {
        display: inline-block;
        width: var(--digit-width);
        height: var(--digit-height);
        object-fit: contain;
      }
    `;

    const wrapper = document.createElement("span");
    wrapper.className = "wrapper";

    // CSS カスタムプロパティでサイズ共有
    wrapper.style.setProperty("--digit-width", `${digitWidth}px`);
    wrapper.style.setProperty("--digit-height", `${digitHeight}px`);

    // 左装飾（必要なら）
    if (left) {
      const l = document.createElement("img");
      l.className = "decor";
      l.src = `${imgPath}/left.${imgType}`;
      l.decoding = "async";
      l.loading = "lazy";
      wrapper.appendChild(l);
    }

    // 数字スプライト
    for (const c of count) {
      if (!/^[0-9]$/.test(c)) continue;
      const n = Number(c);
      const span = document.createElement("span");
      span.className = "digit";
      span.style.backgroundPositionX = `${-n * digitWidth}px`;
      wrapper.appendChild(span);
    }

    // 右装飾（必要なら）
    if (right) {
      const r = document.createElement("img");
      r.className = "decor";
      r.src = `${imgPath}/right.${imgType}`;
      r.decoding = "async";
      r.loading = "lazy";
      wrapper.appendChild(r);
    }

    frag.appendChild(style);
    frag.appendChild(wrapper);
    this.shadowRoot.appendChild(frag);
  }
}

customElements.define("count-db", CountDB);
