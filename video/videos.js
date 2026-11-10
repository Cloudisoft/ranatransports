/* Rana Transport & Logistics — service explainer compositions.
 *
 * Deterministic motion graphics: every frame is a pure function of time `t`
 * (seconds), so scripts/render-videos.mjs can seek frame-by-frame and encode.
 * Assets (truck SVGs, image URLs) are injected as window.ASSETS before build().
 */
(() => {
  const W = 1280;
  const H = 720;
  const stage = document.getElementById("stage");

  // ───────── timing helpers ─────────
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const E = {
    out: (t) => 1 - Math.pow(1 - t, 3),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    expo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    back: (t) => {
      const c1 = 1.5, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    lin: (t) => t,
  };
  const P = (t, a, b, e = E.out) => e(clamp((t - a) / (b - a)));
  /** 0→1 entering at a, 1→0 leaving at b */
  const WIN = (t, a, b, fi = 0.5, fo = 0.45) => Math.min(P(t, a, a + fi), 1 - P(t, b - fo, b, E.inOut));
  const lerp = (a, b, k) => a + (b - a) * k;

  // ───────── DOM helpers ─────────
  const h = (cls, html = "", parent = stage, tag = "div") => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    el.innerHTML = html;
    parent.appendChild(el);
    return el;
  };
  const css = (el, o) => Object.assign(el.style, o);
  const words = (el, text) => {
    // gradient text must live on each transformed word (background-clip breaks across layers)
    const g = el.classList.contains("grad");
    if (g) el.classList.remove("grad");
    el.innerHTML = text
      .split(/(\s+)/)
      .map((w) => (/\s+/.test(w) ? w : `<span class="word${g ? " grad" : ""}">${w}</span>`))
      .join("");
    return [...el.querySelectorAll(".word")];
  };
  /** staggered word reveal */
  const revealWords = (ws, t, start, out, stagger = 0.07) => {
    ws.forEach((w, i) => {
      const k = P(t, start + i * stagger, start + i * stagger + 0.6, E.expo);
      const o = out == null ? 1 : 1 - P(t, out, out + 0.4, E.inOut);
      w.style.opacity = String(k * o);
      w.style.transform = `translateY(${(1 - k) * 34 + (1 - o) * -16}px)`;
      w.style.filter = `blur(${(1 - k) * 8}px)`;
    });
  };
  const show = (el, k, dy = 24, dx = 0, s = 1) => {
    el.style.opacity = String(k);
    el.style.transform = `translate(${(1 - k) * dx}px, ${(1 - k) * dy}px) scale(${lerp(s, 1, k)})`;
    el.style.visibility = k <= 0.001 ? "hidden" : "visible";
  };

  // ───────── icons ─────────
  const ICON = {
    truck: '<path d="M2 6.5h11v9H2z"/><path d="M13 9.5h4.2l3.3 3.4v2.6H13z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
    factory: '<path d="M3 20.5V10l5 3V10l5 3V5h4l1 4.5V20.5z"/><path d="M7 17h2M11 17h2M15 17h2"/>',
    route: '<circle cx="6" cy="5" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M8.2 5H15a3.5 3.5 0 0 1 0 7H9a3.5 3.5 0 0 0 0 7h6.8"/>',
    network: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6 8l5 8.3M18 8l-5 8.3"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6a1.7 1.7 0 0 1 1.7 1.7V7M3 12.5h18"/>',
    sync: '<path d="M20 11a8 8 0 0 0-14.3-4.6L4 8M4 13a8 8 0 0 0 14.3 4.6L20 16"/><path d="M4 3.5V8h4.5M20 20.5V16h-4.5"/>',
    quote: '<path d="M5 3.5h10l4 4v13H5z"/><path d="M15 3.5v4h4M8.5 12h7M8.5 15.5h7M8.5 8.5h3"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    phone: '<path d="M5 3.5h3.3l1.6 4.2-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.2 1.6V19a1.7 1.7 0 0 1-1.8 1.7A16.6 16.6 0 0 1 3.3 5.3 1.7 1.7 0 0 1 5 3.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/>',
    check: '<path d="M4.5 12.5l4.5 4.5L19.5 6.5"/>',
    weight: '<path fill="currentColor" stroke="none" d="M12 3a3 3 0 0 0-2.83 4H7.6a2 2 0 0 0-1.96 1.6l-2.4 11.2A1.8 1.8 0 0 0 5 22h14a1.8 1.8 0 0 0 1.76-2.2l-2.4-11.2A2 2 0 0 0 16.4 7h-1.57A3 3 0 0 0 12 3zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z"/>',
  };
  const icon = (n, size = 26, color = "#1db3ff") =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="color:${color}">${ICON[n]}</svg>`;

  // ───────── truck art ─────────
  const A = () => window.ASSETS;
  /** spec drawing with dimensions, or bare (dimension lines/labels removed) */
  const truck = (name, bare = false) => {
    let svg = A().trucks[name];
    if (!svg) throw new Error("missing truck " + name);
    // unique gradient ids per instance
    const suffix = Math.random().toString(36).slice(2, 7);
    svg = svg.replace(/(glass|stripe)-([a-z0-9-]+?)(?=["')])/gi, (m) => m + suffix);
    const wrap = document.createElement("div");
    wrap.innerHTML = svg;
    const el = wrap.firstElementChild;
    el.removeAttribute("class");
    el.setAttribute("width", "100%");
    el.removeAttribute("height");
    if (bare) {
      el.querySelectorAll('[stroke="#9aa1ad"], text[fill="#5b6472"]').forEach((n) => n.remove());
    }
    return el;
  };
  const spinWheels = (svgEl, deg) =>
    svgEl.querySelectorAll(".wheel-spin").forEach((w) => (w.style.transform = `rotate(${deg}deg)`));
  const drawDims = (svgEl, k) =>
    svgEl.querySelectorAll('[stroke="#9aa1ad"]').forEach((p) => {
      p.setAttribute("stroke-dashoffset", String(1 - k));
    });
  const dimLabels = (svgEl, k) => svgEl.querySelectorAll('text[fill="#5b6472"]').forEach((n) => (n.style.opacity = String(k)));

  // ───────── shared chrome: brand bug, chapter tag, progress, captions ─────────
  function chrome(index, title, duration) {
    const bug = h("abs", `<div style="display:flex;align-items:center;gap:12px">
        <img src="${A().emblem}" style="width:34px;height:38px;object-fit:cover;object-position:top;border-radius:8px;box-shadow:0 0 18px -4px rgba(252,31,134,.8)">
        <div style="line-height:1"><div style="font-family:SG;font-weight:700;letter-spacing:.32em;font-size:17px">RANA</div>
        <div style="font-size:8.5px;font-weight:600;letter-spacing:.3em;color:#9aa4b6;margin-top:4px">TRANSPORT &amp; LOGISTICS</div></div></div>`);
    css(bug, { left: "44px", top: "34px" });
    const tag = h("abs", `<span style="font-family:IN;font-weight:600;font-size:12px;letter-spacing:.24em;color:#8792a6">SERVICES · <b style="color:#fff">${index}</b> / 03 &nbsp;·&nbsp; ${title}</span>`);
    css(tag, { right: "44px", top: "44px" });
    const track = h("abs", "", stage);
    css(track, { left: "0", bottom: "0", height: "3px", width: "100%", background: "rgba(255,255,255,.06)" });
    const bar = h("abs bar", "", stage);
    css(bar, { left: "0", bottom: "0", width: "0px" });
    const cap = h("abs caption", "");
    let capText = "";
    return (t, caption) => {
      const k = P(t, 0.4, 1.2);
      show(bug, k, -10);
      show(tag, k, -10);
      bar.style.width = `${(t / duration) * W}px`;
      if (caption && caption.text !== capText) {
        cap.textContent = caption.text;
        capText = caption.text;
      }
      const ck = caption ? caption.k : 0;
      cap.style.opacity = String(ck);
      cap.style.transform = `translate(-50%, ${(1 - ck) * 14}px)`;
    };
  }
  const captionAt = (t, list) => {
    for (const c of list) if (t >= c[0] && t < c[1]) return { text: c[2], k: WIN(t, c[0], c[1], 0.35, 0.3) };
    return null;
  };

  // ───────── reusable scenes ─────────
  function introScene(index, line1, line2, end) {
    const wrap = h("abs");
    css(wrap, { inset: "0", display: "grid", placeItems: "center" });
    const inner = h("", "", wrap);
    css(inner, { textAlign: "center" });
    const logo = h("", `<img src="${A().emblem}" style="width:92px;height:104px;object-fit:cover;object-position:top;border-radius:16px;box-shadow:0 0 60px -10px rgba(252,31,134,.9),0 0 120px -30px rgba(29,179,255,.9)">`, inner);
    css(logo, { display: "flex", justifyContent: "center", marginBottom: "28px" });
    const eb = h("eyebrow", `Rana Transport &amp; Logistics · Services ${index}`, inner);
    css(eb, { justifyContent: "center", marginBottom: "18px" });
    const t1 = h("display", "", inner);
    css(t1, { fontSize: "74px" });
    const w1 = words(t1, line1);
    const t2 = h("display grad", "", inner);
    css(t2, { fontSize: "74px", marginTop: "6px" });
    const w2 = words(t2, line2);
    return (t) => {
      const v = WIN(t, 0, end, 0.01, 0.5);
      wrap.style.opacity = String(v);
      wrap.style.visibility = v <= 0.001 ? "hidden" : "visible";
      const lk = P(t, 0.05, 0.9, E.back);
      logo.style.transform = `scale(${lerp(0.6, 1, lk)})`;
      logo.style.opacity = String(P(t, 0.05, 0.6));
      show(eb, P(t, 0.35, 1.0), 12);
      revealWords(w1, t, 0.55, null, 0.08);
      revealWords(w2, t, 0.95, null, 0.08);
      inner.style.transform = `scale(${lerp(1, 1.06, P(t, 0, end, E.lin))})`;
    };
  }

  function ctaScene(start, end, headline) {
    const wrap = h("abs");
    css(wrap, { inset: "0", display: "grid", placeItems: "center" });
    // neon expressway backdrop
    const road = h("abs", `<svg viewBox="0 0 1280 720" width="1280" height="720"><defs>
        <linearGradient id="cta-l" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fc1f86"/><stop offset="1" stop-color="#ffb547" stop-opacity="0"/></linearGradient>
        <linearGradient id="cta-r" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1db3ff"/><stop offset="1" stop-color="#cc2dd3" stop-opacity="0"/></linearGradient>
        <radialGradient id="cta-sun"><stop offset="0" stop-color="#ffb547"/><stop offset=".45" stop-color="#fc1f86" stop-opacity=".8"/><stop offset="1" stop-color="#fc1f86" stop-opacity="0"/></radialGradient></defs>
        <circle cx="640" cy="560" r="130" fill="url(#cta-sun)" opacity=".5"/>
        <path d="M624 560 L120 720 L80 720 L620 560Z" fill="url(#cta-l)"/><path d="M656 560 L1160 720 L1200 720 L660 560Z" fill="url(#cta-r)"/>
        <g id="cta-dash"></g></svg>`, wrap);
    css(road, { inset: "0", opacity: ".55" });
    const dashG = road.querySelector("#cta-dash");
    const dashes = Array.from({ length: 9 }, () => {
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("fill", "#e8ecf4");
      dashG.appendChild(r);
      return r;
    });
    const inner = h("", "", wrap);
    css(inner, { textAlign: "center", position: "relative", marginTop: "-90px" });
    const t1 = h("display", "", inner);
    css(t1, { fontSize: "70px" });
    const w1 = words(t1, headline[0]);
    const t2 = h("display grad", "", inner);
    css(t2, { fontSize: "70px", marginTop: "4px" });
    const w2 = words(t2, headline[1]);
    const row = h("", `
      <div class="card" style="display:flex;align-items:center;gap:14px;padding:16px 22px">${icon("phone", 26)}<div style="text-align:left"><div style="font-size:12px;color:#8792a6;letter-spacing:.14em">CALL</div><div style="font-family:MR;font-weight:800;font-size:22px">+91 83202 94127</div></div></div>
      <div class="card" style="display:flex;align-items:center;gap:14px;padding:16px 22px;background:linear-gradient(180deg,#1fae5b,#178a48);border-color:transparent">${icon("whatsapp", 26, "#fff")}<div style="text-align:left"><div style="font-size:12px;color:#d6ffe6;letter-spacing:.14em">WHATSAPP</div><div style="font-family:MR;font-weight:800;font-size:22px">+91 83202 94127</div></div></div>
      <div class="card" style="display:flex;align-items:center;gap:14px;padding:16px 22px">${icon("mail", 26, "#fc1f86")}<div style="text-align:left"><div style="font-size:12px;color:#8792a6;letter-spacing:.14em">EMAIL</div><div style="font-family:MR;font-weight:800;font-size:22px">contact@ranatransports.in</div></div></div>`, inner);
    css(row, { display: "flex", gap: "16px", justifyContent: "center", marginTop: "38px" });
    const cards = [...row.children];
    const foot = h("", `<span style="font-family:SG;font-weight:700;letter-spacing:.22em;color:#d5ae62;font-size:15px">BEYOND TRANSPORTATION. INTO TOMORROW.</span>`, inner);
    css(foot, { marginTop: "30px" });
    return (t) => {
      const v = WIN(t, start, end + 1, 0.6, 0.2);
      wrap.style.opacity = String(v);
      wrap.style.visibility = v <= 0.001 ? "hidden" : "visible";
      revealWords(w1, t, start + 0.2);
      revealWords(w2, t, start + 0.5);
      cards.forEach((c, i) => show(c, P(t, start + 1.0 + i * 0.15, start + 1.7 + i * 0.15, E.back), 24, 0, 0.9));
      show(foot, P(t, start + 1.8, start + 2.4), 10);
      // perspective lane dashes
      dashes.forEach((d, i) => {
        const z = ((t * 0.55 + i / dashes.length) % 1);
        const y = 560 + Math.pow(z, 2.2) * 160;
        const w = 2 + z * 10;
        const hgt = 3 + z * 26;
        d.setAttribute("x", String(640 - w / 2));
        d.setAttribute("y", String(y));
        d.setAttribute("width", String(w));
        d.setAttribute("height", String(hgt));
        d.setAttribute("opacity", String(Math.min(1, z * 2)));
      });
    };
  }

  /** side-on highway with a truck driving through */
  function highwayScene({ start, end, truckName, title, sub }) {
    const wrap = h("abs");
    css(wrap, { inset: "0" });
    // skyline
    const sky = h("abs", "", wrap);
    css(sky, { left: "0", right: "0", top: "250px", height: "240px", background: "linear-gradient(180deg, transparent, rgba(252,31,134,.18) 70%, rgba(255,181,71,.28))" });
    let bldg = "";
    let x = -40;
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    while (x < W * 2) {
      const bw = 40 + rnd() * 70;
      const bh = 60 + rnd() * 150;
      bldg += `<rect x="${x}" y="${240 - bh}" width="${bw}" height="${bh}" fill="#0a0f1c"/>`;
      for (let wy = 240 - bh + 12; wy < 230; wy += 16)
        for (let wx = x + 8; wx < x + bw - 8; wx += 14) if (rnd() < 0.22) bldg += `<rect x="${wx}" y="${wy}" width="5" height="7" fill="${rnd() < 0.5 ? "#ffcf8a" : "#9fdcff"}" opacity=".6"/>`;
      x += bw + 6;
    }
    const city = h("abs", `<svg width="${W * 2}" height="240" viewBox="0 0 ${W * 2} 240">${bldg}</svg>`, sky);
    css(city, { left: "0", bottom: "0" });
    // road
    const road = h("abs", "", wrap);
    css(road, {
      left: "0", right: "0", top: "490px", height: "230px",
      background: "linear-gradient(180deg,#0c1220,#05070d)",
      borderTop: "3px solid transparent",
      borderImage: "linear-gradient(90deg,#ffb547,#fc1f86,#cc2dd3,#1db3ff) 1",
    });
    const lane = h("abs", "", road);
    css(lane, { left: "0", right: "0", top: "92px", height: "5px", backgroundImage: "linear-gradient(90deg,#e8ecf4 0 60px,transparent 60px 110px)", backgroundSize: "110px 5px", opacity: ".6" });
    const gold = h("abs", "", road);
    css(gold, { left: "0", right: "0", top: "40px", height: "3px", background: "#d5ae62", opacity: ".7" });
    // truck
    const tw = h("abs", "", wrap);
    css(tw, { width: "620px", top: "322px" });
    const tsvg = truck(truckName, true);
    tw.appendChild(tsvg);
    // headline
    const head = h("abs", "", wrap);
    css(head, { left: "64px", top: "120px", width: "1150px" });
    const eb = h("eyebrow", sub, head);
    const t1 = h("display", "", head);
    css(t1, { fontSize: "60px", marginTop: "16px" });
    const w1 = words(t1, title);
    return (t) => {
      const v = WIN(t, start, end, 0.5, 0.5);
      wrap.style.opacity = String(v);
      wrap.style.visibility = v <= 0.001 ? "hidden" : "visible";
      const lt = t - start;
      const speed = 420; // px/s of road
      lane.style.backgroundPosition = `${-(lt * speed) % 110}px 0`;
      city.style.transform = `translateX(${-(lt * 40) % W}px)`;
      // truck drives in from left and cruises
      const enter = P(t, start, start + 2.2, E.out);
      tw.style.left = `${lerp(-700, 580, enter) + Math.sin(lt * 1.3) * 6}px`;
      tw.style.transform = `translateY(${Math.sin(lt * 18) * 0.8}px)`;
      spinWheels(tsvg, lt * 520);
      show(eb, P(t, start + 0.2, start + 0.8), 10);
      revealWords(w1, t, start + 0.35, null, 0.06);
    };
  }

  /** stacked list of service rows with icons */
  function listScene({ start, end, title, items, side }) {
    const wrap = h("abs");
    css(wrap, { inset: "0" });
    const head = h("abs", "", wrap);
    css(head, { left: "64px", top: "118px", width: "560px" });
    const eb = h("eyebrow", title[0], head);
    const t1 = h("display", "", head);
    css(t1, { fontSize: "52px", marginTop: "16px" });
    const w1 = words(t1, title[1]);
    const list = h("abs", "", wrap);
    css(list, { right: "64px", top: "112px", width: "560px", display: "grid", gap: "12px" });
    const rows = items.map(([ic, name, desc]) => {
      const r = h("card", `<div style="display:flex;gap:16px;align-items:center;padding:15px 18px">
        <div style="width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);flex:none">${icon(ic, 24)}</div>
        <div><div style="font-family:MR;font-weight:800;font-size:19px">${name}</div><div style="font-size:14.5px;color:#9aa4b6;margin-top:3px">${desc}</div></div>
        <div style="margin-left:auto;flex:none">${icon("check", 20, "#25c26a")}</div></div>`, list);
      return r;
    });
    let sideEl;
    if (side) {
      sideEl = h("abs", "", wrap);
      css(sideEl, { left: "64px", top: "300px", width: "500px" });
      sideEl.appendChild(side.el);
    }
    return (t) => {
      const v = WIN(t, start, end, 0.45, 0.45);
      wrap.style.opacity = String(v);
      wrap.style.visibility = v <= 0.001 ? "hidden" : "visible";
      show(eb, P(t, start + 0.1, start + 0.7), 10);
      revealWords(w1, t, start + 0.25, null, 0.06);
      rows.forEach((r, i) => show(r, P(t, start + 0.5 + i * 0.32, start + 1.2 + i * 0.32, E.expo), 0, 60));
      if (side) side.update(t - start, sideEl);
    };
  }

  // projection calibrated to the site's India map (612×696 artboard)
  const project = (lat, lng) => [(lng - 68.18) * 20.95, 838.35 - 1203.97 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))];

  function mapScene({ start, end }) {
    const wrap = h("abs");
    css(wrap, { inset: "0" });
    const box = h("abs", "", wrap);
    // zoom into the western/northern corridor
    const vb = [10, 160, 280, 330];
    const scale = 500 / vb[3];
    css(box, { left: "700px", top: "96px", width: `${vb[2] * scale}px`, height: "500px", overflow: "hidden", borderRadius: "26px", border: "1px solid rgba(255,255,255,.08)", background: "radial-gradient(circle at 30% 40%,#0d2140,#05070d 70%)" });
    const cities = [
      ["Nadiad", 22.69, 72.86, true],
      ["Ahmedabad", 23.02, 72.57],
      ["Mumbai", 19.12, 72.84],
      ["New Delhi", 28.54, 77.05],
      ["Petlad", 22.48, 72.8],
    ];
    const pts = cities.map((c) => project(c[1], c[2]));
    const route = (a, b, bend) => {
      const [x1, y1] = pts[a];
      const [x2, y2] = pts[b];
      const mx = (x1 + x2) / 2 + bend;
      const my = (y1 + y2) / 2;
      return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    };
    box.innerHTML = `<svg viewBox="${vb.join(" ")}" width="100%" height="100%">
      <defs><linearGradient id="mp-g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb547"/><stop offset=".5" stop-color="#fc1f86"/><stop offset="1" stop-color="#1db3ff"/></linearGradient></defs>
      <image href="${A().indiaMap}" x="0" y="0" width="612" height="696" opacity=".95"/>
      <path class="r" d="${route(0, 2, -30)}" fill="none" stroke="url(#mp-g)" stroke-width="2.6" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      <path class="r" d="${route(0, 3, 30)}" fill="none" stroke="url(#mp-g)" stroke-width="2.6" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      ${pts
        .map(
          ([x, y], i) => `<g class="c" transform="translate(${x},${y})"><circle r="9" fill="${cities[i][3] ? "#d5ae62" : "#1db3ff"}" opacity=".22"/><circle r="3.6" fill="${cities[i][3] ? "#d5ae62" : "#fff"}" stroke="#05070d" stroke-width="1"/>
           ${i === 4 ? "" : `<text x="${i === 1 ? -7 : 7}" y="${i === 1 ? -6 : 4}" text-anchor="${i === 1 ? "end" : "start"}" font-family="MR" font-weight="800" font-size="10" fill="#fff" style="paint-order:stroke;stroke:#05070d;stroke-width:3">${cities[i][0]}</text>`}</g>`,
        )
        .join("")}
    </svg>`;
    const routes = [...box.querySelectorAll(".r")];
    const dots = [...box.querySelectorAll(".c")];
    const head = h("abs", "", wrap);
    css(head, { left: "64px", top: "150px", width: "540px" });
    const eb = h("eyebrow", "Local · Regional · Long-distance", head);
    const t1 = h("display", "", head);
    css(t1, { fontSize: "54px", marginTop: "16px" });
    const w1 = words(t1, "Rooted in Gujarat. Connecting India.");
    const chips = h("", "", head);
    css(chips, { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "28px" });
    const chipEls = ["Nadiad HQ", "Ahmedabad", "Petlad", "Mumbai", "New Delhi"].map((c, i) => {
      const e = h("card", `<span style="display:inline-flex;gap:8px;align-items:center;padding:9px 14px;font-weight:600;font-size:15px">${i === 0 ? '<span style="width:8px;height:8px;border-radius:9px;background:#d5ae62"></span>' : '<span style="width:8px;height:8px;border-radius:9px;background:#1db3ff"></span>'}${c}</span>`, chips);
      e.style.borderRadius = "999px";
      return e;
    });
    return (t) => {
      const v = WIN(t, start, end, 0.5, 0.45);
      wrap.style.opacity = String(v);
      wrap.style.visibility = v <= 0.001 ? "hidden" : "visible";
      show(box, P(t, start, start + 0.9), 0, 40, 0.94);
      show(eb, P(t, start + 0.1, start + 0.7), 10);
      revealWords(w1, t, start + 0.3, null, 0.07);
      dots.forEach((d, i) => (d.style.opacity = String(P(t, start + 0.7 + (i === 0 ? 0 : 0.6 + i * 0.25), start + 1.2 + (i === 0 ? 0 : 0.6 + i * 0.25)))));
      routes.forEach((r, i) => r.setAttribute("stroke-dashoffset", String(1 - P(t, start + 1.2 + i * 0.5, start + 3.0 + i * 0.5, E.inOut))));
      chipEls.forEach((c, i) => show(c, P(t, start + 1.4 + i * 0.12, start + 2 + i * 0.12, E.back), 12, 0, 0.9));
    };
  }

  // ═════════════════ VIDEO 1 — Road freight & commercial transport ═════════════════
  function video1() {
    const D = 26.5;
    const ch = chrome("01", "ROAD FREIGHT", D);
    const scenes = [
      introScene("01 / 03", "Road freight &", "commercial transport", 3.2),
      highwayScene({ start: 3.0, end: 8.4, truckName: "container-20ft", title: "Moving business cargo — <br>safely, on schedule.", sub: "Road freight transportation" }),
      listScene({
        start: 8.2,
        end: 15.4,
        title: ["What we move", "Freight for every business."],
        items: [
          ["truck", "Road Freight Transportation", "Local, regional & longer-distance routes"],
          ["box", "Commercial Goods", "Retail, wholesale & packaged cargo"],
          ["factory", "Industrial Cargo", "Production materials & components"],
          ["route", "Regional & Intercity", "Gujarat and nearby business centres"],
          ["network", "Long-Distance Transport", "Between India's commercial destinations"],
        ],
        side: (() => {
          const el = document.createElement("div");
          el.className = "paper";
          el.style.padding = "6px";
          const svg = truck("lcv-14ft");
          el.appendChild(svg);
          return {
            el,
            update: (lt, host) => {
              show(host, P(lt, 0.6, 1.4), 30);
              drawDims(svg, P(lt, 1.2, 2.4, E.inOut));
              dimLabels(svg, P(lt, 2.0, 2.6));
              spinWheels(svg, lt * 60);
            },
          };
        })(),
      }),
      mapScene({ start: 15.2, end: 21.6 }),
      ctaScene(21.4, D, ["Need goods moved?", "Get a transport quote."]),
    ];
    const caps = [
      [3.4, 8.2, "Rana Transport & Logistics plans road freight around your cargo, route and timing."],
      [8.6, 15.2, "Commercial, industrial, regional and long-distance movements for businesses."],
      [15.6, 21.4, "Rooted in Nadiad — offices in Ahmedabad, Petlad, Mumbai & New Delhi."],
    ];
    return { D, seek: (t) => { scenes.forEach((s) => s(t)); ch(t, captionAt(t, caps)); } };
  }

  // ═════════════════ VIDEO 2 — Heavy trucks, tippers & bulk ═════════════════
  function video2() {
    const D = 26.5;
    const ch = chrome("02", "VEHICLES & BULK", D);
    // vehicle carousel
    const lineup = [
      ["tata-ace", "Tata Ace", "750 kg", "7 × 4.8 ft"],
      ["lcv-14ft", "14 ft LCV", "2.5–3.5 t", "14 × 6 × 6 ft"],
      ["truck-10w", "10 Wheeler Truck", "16–18 t", "24 × 8 ft"],
      ["truck-12w", "12 Wheeler Truck", "21–25 t", "28 × 8 ft"],
      ["container-32ft", "32 ft MXL Container", "15–18 t", "32 × 8 × 8 ft"],
      ["trailer-40ft", "40 ft Flatbed Trailer", "25–30 t", "40 × 8 ft"],
    ];
    const S1 = 3.0, E1 = 11.0;
    const car = h("abs");
    css(car, { inset: "0" });
    const head = h("abs", "", car);
    css(head, { left: "64px", top: "116px", width: "1150px" });
    const eb = h("eyebrow", "Small · Medium · Heavy · Long-haul", head);
    const t1 = h("display", "", head);
    css(t1, { fontSize: "56px", marginTop: "14px" });
    const w1 = words(t1, "The right vehicle for the right load.");
    const slides = lineup.map(([id, name, cap, dims]) => {
      const s = h("abs card", "", car);
      css(s, { left: "64px", top: "240px", width: "1152px", height: "340px", padding: "16px", display: "grid", gridTemplateColumns: "600px 1fr", gap: "40px", alignItems: "center" });
      const paper = h("paper", "", s);
      css(paper, { padding: "6px" });
      const svg = truck(id);
      paper.appendChild(svg);
      h("", `<div style="font-size:13px;letter-spacing:.24em;color:#1db3ff;font-weight:700">TYPICAL CLASS SPEC</div>
        <div style="font-family:MR;font-weight:800;font-size:36px;margin-top:10px">${name}</div>
        <div style="margin-top:18px"><span class="pill">${icon("weight", 18, "#0b1b33")}${cap}</span></div>
        <div style="margin-top:16px;font-size:18px;color:#9aa4b6">Cargo size <b style="color:#fff">${dims}</b></div>`, s);
      return { s, svg };
    });
    // tipper scene
    const S2 = 10.8, E2 = 17.0;
    const tip = h("abs");
    css(tip, { inset: "0" });
    const th = h("abs", "", tip);
    css(th, { left: "64px", top: "120px", width: "500px" });
    const teb = h("eyebrow", "Tippers / dumpers", th);
    const tt = h("display", "", th);
    css(tt, { fontSize: "52px", marginTop: "14px" });
    const tw = words(tt, "Bulk & construction material.");
    const tlist = h("", "", th);
    css(tlist, { display: "grid", gap: "10px", marginTop: "26px" });
    const tRows = [
      ["6 Wheeler Tipper", "9–10 t · ≈ 9 m³"],
      ["10 Wheeler Tipper", "16–20 t · ≈ 14 m³"],
      ["12 Wheeler Tipper", "20–25 t · ≈ 18 m³"],
    ].map(([a, b]) => h("card", `<div style="display:flex;justify-content:space-between;padding:13px 18px;font-size:17px"><b style="font-family:MR">${a}</b><span style="color:#ffb547;font-weight:700">${b}</span></div>`, tlist));
    const tpaper = h("abs paper", "", tip);
    css(tpaper, { left: "610px", top: "150px", width: "610px", padding: "6px", overflow: "hidden" });
    const tsvg = truck("tipper-12w");
    tpaper.appendChild(tsvg);
    const body = tsvg.querySelector(".tipper-body");
    // material grains
    const grains = Array.from({ length: 140 }, (_, i) => {
      const g = h("abs", "", tpaper);
      const sz = 4 + ((i * 37) % 5);
      css(g, { width: `${sz}px`, height: `${sz}px`, borderRadius: "40%", background: i % 3 ? "#b08850" : "#8a6a3d", left: "0", top: "0" });
      return g;
    });
    // FTL / stats scene
    const S3 = 16.8, E3 = 21.8;
    const st = h("abs");
    css(st, { inset: "0", display: "grid", placeItems: "center" });
    const sIn = h("", "", st);
    css(sIn, { textAlign: "center", width: "1100px" });
    const seb = h("eyebrow", "Full truckload · Bulk · Industrial", sIn);
    css(seb, { justifyContent: "center" });
    const stt = h("display", "", sIn);
    css(stt, { fontSize: "58px", marginTop: "16px" });
    const sw = words(stt, "One partner. Every load size.");
    const tiles = h("", "", sIn);
    css(tiles, { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "40px" });
    const tileData = [
      [16, "", "vehicle classes"],
      [500, " kg", "smallest class — 3-wheeler"],
      [30, " t", "largest typical — 40 ft trailer"],
    ];
    const tileEls = tileData.map(([n, u, l]) => {
      const e = h("card", `<div style="padding:26px"><div class="num display grad" style="font-size:64px;text-transform:none">0</div><div style="margin-top:10px;font-size:16px;color:#9aa4b6">${l}</div></div>`, tiles);
      return { e, num: e.querySelector(".num"), n, u };
    });
    const note = h("", "Typical class figures. The exact vehicle and payload are confirmed for every enquiry.", sIn);
    css(note, { marginTop: "22px", fontSize: "14px", color: "#7d889c" });

    const scenes = [
      introScene("02 / 03", "Heavy trucks,", "tippers & bulk", 3.2),
      ctaScene(21.6, D, ["Not sure which truck?", "Tell us your load."]),
    ];
    const caps = [
      [3.4, 10.8, "From a 750 kg mini truck to 25-tonne 12-wheelers and 40 ft trailers."],
      [11.2, 16.8, "Tippers for sand, soil and aggregates — sized by volume and material density."],
      [17.2, 21.6, "Full truckloads and bulk cargo, planned around lawful vehicle capacity."],
    ];
    const seek = (t) => {
      scenes.forEach((s) => s(t));
      // carousel
      let v = WIN(t, S1, E1, 0.5, 0.45);
      car.style.opacity = String(v);
      car.style.visibility = v <= 0.001 ? "hidden" : "visible";
      show(eb, P(t, S1 + 0.1, S1 + 0.7), 10);
      revealWords(w1, t, S1 + 0.25, null, 0.06);
      const per = (E1 - S1 - 1.0) / lineup.length;
      slides.forEach(({ s, svg }, i) => {
        const a = S1 + 0.8 + i * per;
        const k = P(t, a, a + 0.55, E.expo);
        const out = i === slides.length - 1 ? 0 : P(t, a + per - 0.15, a + per + 0.35, E.inOut);
        s.style.opacity = String(k * (1 - out));
        s.style.visibility = k * (1 - out) <= 0.001 ? "hidden" : "visible";
        s.style.transform = `translateX(${(1 - k) * 120 - out * 120}px)`;
        drawDims(svg, P(t, a + 0.3, a + 1.0, E.inOut));
        dimLabels(svg, P(t, a + 0.7, a + 1.0));
        spinWheels(svg, (t - a) * 90);
      });
      // tipper
      v = WIN(t, S2, E2, 0.5, 0.45);
      tip.style.opacity = String(v);
      tip.style.visibility = v <= 0.001 ? "hidden" : "visible";
      show(teb, P(t, S2 + 0.1, S2 + 0.7), 10);
      revealWords(tw, t, S2 + 0.25, null, 0.06);
      tRows.forEach((r, i) => show(r, P(t, S2 + 0.8 + i * 0.2, S2 + 1.4 + i * 0.2, E.expo), 0, -40));
      show(tpaper, P(t, S2 + 0.2, S2 + 1.0), 0, 60);
      const tilt = P(t, S2 + 1.8, S2 + 3.0, E.inOut) * (1 - P(t, S2 + 4.6, S2 + 5.6, E.inOut));
      if (body) body.style.transform = `rotate(${-20 * tilt}deg)`;
      drawDims(tsvg, P(t, S2 + 0.6, S2 + 1.4, E.inOut));
      dimLabels(tsvg, P(t, S2 + 1.0, S2 + 1.4));
      // grains pour from the tail of the body while tipped (the truck rear is at ~x 18% of the drawing)
      // material pours from the hinge at the rear of the tipping body
      const paperRect = tpaper.getBoundingClientRect();
      const svgRect = tsvg.getBoundingClientRect();
      const k2 = svgRect.width / 440;
      const [ox, oy] = (body ? body.style.transformOrigin : "0px 0px").split(" ").map(parseFloat);
      const x0 = svgRect.left - paperRect.left + ox * k2;
      const y0 = svgRect.top - paperRect.top + oy * k2;
      grains.forEach((g, i) => {
        const life = 0.9;
        const birth = S2 + 2.4 + (i / grains.length) * 2.4;
        const age = (t - birth) / life;
        if (age < 0 || age > 1 || tilt < 0.35) {
          g.style.opacity = "0";
          return;
        }
        const x = x0 - 6 - age * (10 + (i % 7) * 4);
        const y = y0 - 18 + age * age * 70 + (i % 5) * 2;
        g.style.opacity = String(1 - age * 0.4);
        g.style.transform = `translate(${x}px, ${y}px)`;
      });
      // stats
      v = WIN(t, S3, E3, 0.5, 0.45);
      st.style.opacity = String(v);
      st.style.visibility = v <= 0.001 ? "hidden" : "visible";
      show(seb, P(t, S3 + 0.1, S3 + 0.7), 10);
      revealWords(sw, t, S3 + 0.25, null, 0.07);
      tileEls.forEach((o, i) => {
        show(o.e, P(t, S3 + 0.8 + i * 0.18, S3 + 1.4 + i * 0.18, E.back), 24, 0, 0.92);
        const k = P(t, S3 + 1.0 + i * 0.18, S3 + 2.6 + i * 0.18, E.out);
        o.num.textContent = Math.round(o.n * k).toLocaleString("en-IN") + o.u;
      });
      show(note, P(t, S3 + 2.2, S3 + 2.8), 8);
      ch(t, captionAt(t, caps));
    };
    return { D, seek };
  }

  // ═════════════════ VIDEO 3 — Corporate logistics & how to get a quote ═════════════════
  function video3() {
    const D = 26.5;
    const ch = chrome("03", "CORPORATE & QUOTES", D);
    const scenes = [introScene("03 / 03", "Corporate logistics", "& quick quotations", 3.2)];
    // corporate list with orbiting network
    const net = (() => {
      const el = document.createElement("div");
      el.style.height = "250px";
      el.innerHTML = `<svg viewBox="0 0 520 250" width="520" height="250">
        <defs><linearGradient id="nt-g" x1="0" x2="1"><stop offset="0" stop-color="#ffb547"/><stop offset=".5" stop-color="#fc1f86"/><stop offset="1" stop-color="#1db3ff"/></linearGradient></defs>
        ${[[60, 190], [180, 70], [300, 170], [430, 60], [470, 200]]
          .map(([x, y], i, arr) => (i ? `<path class="ln" d="M${arr[i - 1][0]},${arr[i - 1][1]} Q${(arr[i - 1][0] + x) / 2},${Math.min(arr[i - 1][1], y) - 50} ${x},${y}" fill="none" stroke="url(#nt-g)" stroke-width="2" pathLength="1" stroke-dasharray="1 1"/>` : ""))
          .join("")}
        ${[[60, 190, "Plant"], [180, 70, "Warehouse"], [300, 170, "Distributor"], [430, 60, "Dealer"], [470, 200, "Site"]]
          .map(([x, y, l]) => `<g class="nd" transform="translate(${x},${y})"><circle r="16" fill="#1db3ff" opacity=".12"/><circle r="6" fill="#fff"/><text y="34" text-anchor="middle" font-family="MR" font-weight="700" font-size="13" fill="#9aa4b6">${l}</text></g>`)
          .join("")}
        <g class="pk"><rect x="-9" y="-7" width="18" height="14" rx="3" fill="#d5ae62"/></g></svg>`;
      const lines = [...el.querySelectorAll(".ln")];
      const nodes = [...el.querySelectorAll(".nd")];
      const pk = el.querySelector(".pk");
      return {
        el,
        update: (lt, host) => {
          show(host, P(lt, 0.5, 1.2), 20);
          nodes.forEach((n, i) => (n.style.opacity = String(P(lt, 0.8 + i * 0.25, 1.2 + i * 0.25))));
          lines.forEach((l, i) => l.setAttribute("stroke-dashoffset", String(1 - P(lt, 1.0 + i * 0.35, 1.6 + i * 0.35, E.inOut))));
          // parcel hopping along the lines (recurring dispatch)
          const seg = Math.floor(((lt * 0.9) % lines.length));
          const f = (lt * 0.9) % 1;
          const ln = lines[seg];
          if (lt > 2.6 && ln) {
            const pt = ln.getPointAtLength(ln.getTotalLength() * E.inOut(f));
            pk.setAttribute("transform", `translate(${pt.x},${pt.y})`);
            pk.style.opacity = "1";
          } else pk.style.opacity = "0";
        },
      };
    })();
    scenes.push(
      listScene({
        start: 3.0,
        end: 10.2,
        title: ["Corporate transportation", "Built for recurring business."],
        items: [
          ["calendar", "Recurring Dispatches", "Scheduled, repeat movements"],
          ["briefcase", "Contract-Based Transport", "Ongoing supply arrangements"],
          ["sync", "Fleet & Vehicle Coordination", "The right vehicle, assigned and planned"],
          ["box", "B2B Distribution Support", "Manufacturers, wholesalers, distributors"],
        ],
        side: net,
      }),
    );
    // how it works — 4 steps
    const S = 10.0, Ee = 18.6;
    const how = h("abs");
    css(how, { inset: "0" });
    const hh = h("abs", "", how);
    css(hh, { left: "64px", top: "120px", width: "1150px" });
    const heb = h("eyebrow", "How quotations work", hh);
    const ht = h("display", "", hh);
    css(ht, { fontSize: "58px", marginTop: "14px" });
    const hw = words(ht, "From requirement to movement.");
    const lineBg = h("abs", "", how);
    css(lineBg, { left: "100px", top: "362px", width: "1080px", height: "2px", background: "rgba(255,255,255,.1)" });
    const lineFg = h("abs bar", "", how);
    css(lineFg, { left: "100px", top: "361px", width: "0px", height: "4px", borderRadius: "4px", boxShadow: "0 0 18px rgba(252,31,134,.7)" });
    const steps = [
      ["quote", "Share your requirement", "Cargo, weight, loading & unloading, timing."],
      ["truck", "We review the options", "Suitable vehicle, route and availability."],
      ["briefcase", "Receive a quotation", "Requirement-based, discussed directly."],
      ["route", "Plan the movement", "Loading, dispatch and coordination confirmed."],
    ].map(([ic, a, b], i) => {
      const e = h("abs", `<div style="width:64px;height:64px;border-radius:18px;display:grid;place-items:center;background:#071426;border:1px solid rgba(255,255,255,.1);box-shadow:0 0 30px -6px rgba(29,179,255,.6);position:relative">${icon(ic, 28)}
          <span style="position:absolute;right:-9px;top:-9px;width:26px;height:26px;border-radius:99px;display:grid;place-items:center;font-size:12px;font-weight:800;background:linear-gradient(120deg,#ffb547,#fc1f86,#cc2dd3)">${i + 1}</span></div>
          <div style="font-family:MR;font-weight:800;font-size:21px;margin-top:22px">${a}</div><div style="font-size:15.5px;color:#9aa4b6;margin-top:6px;width:240px">${b}</div>`, how);
      css(e, { left: `${100 + i * 280}px`, top: "330px" });
      return e;
    });
    // legacy band
    const S4 = 18.4, E4 = 22.6;
    const leg = h("abs");
    css(leg, { inset: "0", display: "grid", placeItems: "center" });
    const lin = h("", "", leg);
    css(lin, { textAlign: "center" });
    const faces = h("", `
      <img src="${A().dinesh}" style="width:118px;height:118px;border-radius:99px;object-fit:cover;object-position:52% 28%;border:3px solid #d5ae62">
      <img src="${A().jalpesh}" style="width:118px;height:118px;border-radius:99px;object-fit:cover;object-position:50% 40%;border:3px solid #d5ae62">
      <div style="width:118px;height:118px;border-radius:99px;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#1b2a44,#071426 60%,#05070d);border:3px solid #cc2dd3"><span class="display grad" style="font-size:44px;letter-spacing:.1em">TR</span></div>`, lin);
    css(faces, { display: "flex", gap: "26px", justifyContent: "center" });
    const faceEls = [...faces.children];
    const lt1 = h("display", "", lin);
    css(lt1, { fontSize: "52px", marginTop: "34px" });
    const lw = words(lt1, "One truck. Three generations.");
    const lsub = h("", "Family transport heritage since 1998–2001 · Nadiad, Gujarat", lin);
    css(lsub, { marginTop: "14px", fontSize: "19px", color: "#d5ae62", fontFamily: "MR", fontWeight: "700" });
    scenes.push(ctaScene(22.4, D, ["Let's move your", "business forward."]));
    const caps = [
      [3.4, 10.0, "Recurring, contract-based transport for manufacturers and distributors."],
      [10.4, 18.4, "Share your requirement online, on WhatsApp or by phone — we review and quote."],
      [18.8, 22.4, "Founded by Late Shri Dinesh Vasantlal Rana · led today by CEO Tej Rana."],
    ];
    const seek = (t) => {
      scenes.forEach((s) => s(t));
      let v = WIN(t, S, Ee, 0.5, 0.45);
      how.style.opacity = String(v);
      how.style.visibility = v <= 0.001 ? "hidden" : "visible";
      show(heb, P(t, S + 0.1, S + 0.7), 10);
      revealWords(hw, t, S + 0.25, null, 0.06);
      lineFg.style.width = `${1080 * P(t, S + 0.9, S + 6.2, E.inOut)}px`;
      steps.forEach((e, i) => show(e, P(t, S + 1.0 + i * 1.3, S + 1.7 + i * 1.3, E.back), 28, 0, 0.9));
      v = WIN(t, S4, E4, 0.5, 0.45);
      leg.style.opacity = String(v);
      leg.style.visibility = v <= 0.001 ? "hidden" : "visible";
      faceEls.forEach((f, i) => {
        const k = P(t, S4 + 0.2 + i * 0.2, S4 + 0.9 + i * 0.2, E.back);
        f.style.opacity = String(k);
        f.style.transform = `scale(${lerp(0.6, 1, k)})`;
        f.style.clipPath = `circle(${k * 75}% at 50% 50%)`;
      });
      revealWords(lw, t, S4 + 0.7, null, 0.07);
      show(lsub, P(t, S4 + 1.3, S4 + 1.9), 10);
      ch(t, captionAt(t, caps));
    };
    return { D, seek };
  }

  window.build = (n) => {
    const v = [video1, video2, video3][n - 1]();
    window.seek = v.seek;
    window.DURATION = v.D;
    v.seek(0);
    return v.D;
  };
})();
