class CountDB extends HTMLElement {
  async connectedCallback() {
    const db = this.getAttribute("db");
    const domain = this.getAttribute("domain"); // ← 追加された重要ポイント
    const imgPath = this.getAttribute("img") || "/count_img/";
    const imgType = this.getAttribute("img-type") || "webp";
    const left = this.hasAttribute("left");
    const right = this.hasAttribute("right");

    if (!db || !domain) {
      console.error("<count-db> requires db and domain attributes.");
      return;
    }

    // カウント取得
    const res = await fetch(`https://${db}/?domain=${domain}`);
    const text = await res.text();
    const count = text.trim();

    // 表示領域
    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";

    // 左装飾
    if (left) {
      const l = document.createElement("img");
      l.src = `${imgPath}/left.${imgType}`;
      wrapper.appendChild(l);
    }

    // 数字を1桁ずつ画像に
    for (const c of count) {
      const img = document.createElement("img");
      img.src = `${imgPath}/${c}.${imgType}`;
      wrapper.appendChild(img);
    }

    // 右装飾
    if (right) {
      const r = document.createElement("img");
      r.src = `${imgPath}/right.${imgType}`;
      wrapper.appendChild(r);
    }

    this.appendChild(wrapper);
  }
}

customElements.define("count-db", CountDB);
