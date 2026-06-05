class CountDB extends HTMLElement {
  async connectedCallback() {
    const db = this.getAttribute("db");
    const domain = this.getAttribute("domain");
    const imgPath = this.getAttribute("img") || "/count_img/";
    const imgType = this.getAttribute("img-type") || "webp";
    const left = this.hasAttribute("left");
    const right = this.hasAttribute("right");

    // ★ width / height のみ使用
    const width = this.getAttribute("width");
    const height = this.getAttribute("height");

    if (!db || !domain) {
      console.error("<count-db> requires db and domain attributes.");
      return;
    }

    const res = await fetch(`https://${db}/?domain=${domain}`);
    const text = await res.text();
    const count = text.trim();

    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";

    // 共通：画像サイズ適用
    const applySize = (img) => {
      if (width) img.style.width = `${width}px`;
      if (height) img.style.height = `${height}px`;
    };

    // 左装飾
    if (left) {
      const l = document.createElement("img");
      l.src = `${imgPath}/left.${imgType}`;
      applySize(l);
      wrapper.appendChild(l);
    }

    // 数字
    for (const c of count) {
      const img = document.createElement("img");
      img.src = `${imgPath}/${c}.${imgType}`;
      applySize(img);
      wrapper.appendChild(img);
    }

    // 右装飾
    if (right) {
      const r = document.createElement("img");
      r.src = `${imgPath}/right.${imgType}`;
      applySize(r);
      wrapper.appendChild(r);
    }

    this.appendChild(wrapper);
  }
}

customElements.define("count-db", CountDB);
