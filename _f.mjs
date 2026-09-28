import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { readFileSync } from "node:fs";
const S = "/tmp/claude-0/-home-user-puzzle-tracker/1df714af-27e0-5eb5-983d-f8ce0473f04f/scratchpad/";
const R = "/home/user/puzzle-tracker/";
const J = f => JSON.parse(readFileSync(R + f));
const sc = process.argv[2] || "light";
const ecl = J("eclipse/desafios.json"), nov = J("novelo/desafios.json"), ret = J("retalhos/desafios.json"), pin = J("pingado/desafios.json");
const pre = {
  eclipse: { "eclipse:viu-regras": true, [`eclipse:dia:2`]: { pid: ecl.puzzles[1].r + "|" + ecl.puzzles[1].g, cells: "", elapsed: 201, done: true, time: 201, started: true } },
  novelo: { "novelo:viu-regras": true, "novelo:dia:1": { pid: nov.puzzles[0].k + "|" + nov.puzzles[0].w, elapsed: 75, done: true, time: 75, started: true, prog: [36, 36] } },
  retalhos: { "retalhos:viu-regras": true, "retalhos:dia:1": { pid: ret.puzzles[0].e, patches: "", elapsed: 88, done: true, time: 88, started: true, prog: [9, 9] } },
  pingado: { "pingado:viu-regras": true, "pingado:dia:1": { pid: pin.puzzles[0].g + "|" + pin.puzzles[0].z, cells: pin.puzzles[0].g, elapsed: 94, done: true, time: 94, prog: [26, 26] } },
};
const b = await chromium.launch();
const out = [];
for (const g of ["sanduba", "quinhentos", "eclipse", "novelo", "retalhos", "pingado"]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: sc });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", e => errs.push(e.message));
  if (pre[g]) await p.addInitScript(o => { for (const [k, v] of Object.entries(o)) localStorage.setItem(k, JSON.stringify(v)); }, pre[g]);
  await p.goto(`http://localhost:8765/${g === "sanduba" ? "misto" : g}/`); await p.waitForTimeout(1200);
  if (g === "sanduba" || g === "quinhentos") {
    await p.evaluate(() => document.querySelectorAll(".overlay.open").forEach(o => o.classList.remove("open")));
    const find = () => p.evaluate(g => { for (const k of Object.keys(localStorage)) { try { const v = JSON.parse(localStorage.getItem(k)); if (v && v.secret && (g === "sanduba" ? k.startsWith("sanduba-daily") : k.startsWith("quinhentao:game"))) return v.secret; } catch {} } }, g);
    const type = async w => { for (const ch of w) await p.keyboard.press(ch); await p.keyboard.press("Enter"); await p.waitForTimeout(1400); };
    let s = await find(); if (!s) { await type("carta"); s = await find(); }
    if (s !== "carta") await type(s);
    await p.waitForTimeout(800);
    await p.reload(); await p.waitForTimeout(1500);                        // reabrir o jogo já feito
  }
  await p.waitForTimeout(1400);
  const aberta = await p.evaluate(() => !!document.querySelector(".overlay.open"));
  await p.screenshot({ path: S + `f-${g}-A-${sc}.png` });
  await p.click(".fim-row .done-bar, .fim-row .gh-fim-bar"); await p.waitForTimeout(700);
  await p.screenshot({ path: S + `f-${g}-B-${sc}.png` });
  await p.click(".modal.fim .fim-free .fx"); await p.waitForTimeout(1500);
  const livre = await p.evaluate(() => ({ dia: !document.querySelector(".gh-dia")?.hidden, info: document.querySelector(".gh-meta")?.innerText.replace(/\s+/g, " ") }));
  await p.screenshot({ path: S + `f-${g}-C-${sc}.png` });
  await p.click(".gh-dia"); await p.waitForTimeout(1200);
  const volta = await p.evaluate(() => ({ dia: !document.querySelector(".gh-dia")?.hidden, fim: !!document.querySelector("#controls.done, .gh-fim.on") }));
  console.log(g, { abriuSozinha: aberta, livre, volta, errs });
  await ctx.close();
}
await b.close();
let h = `<body style="margin:0;background:#8f8a82;font:700 15px system-ui;color:#fff;padding:12px"><div style="display:grid;grid-template-columns:repeat(6,300px);gap:12px">`;
for (const k of ["A", "B", "C"]) for (const g of ["sanduba", "quinhentos", "eclipse", "novelo", "retalhos", "pingado"])
  h += `<div><div style="margin:0 0 4px">${g} · ${k}</div><img style="width:300px;display:block;border-radius:16px" src="data:image/png;base64,${readFileSync(S + `f-${g}-${k}-${sc}.png`).toString("base64")}"></div>`;
const b2 = await chromium.launch(); const p2 = await b2.newPage({ viewport: { width: 1900, height: 1000 } });
await p2.setContent(h + "</div></body>"); await p2.waitForTimeout(400); await p2.screenshot({ path: S + `fluxo-${sc}.png`, fullPage: true }); await b2.close();
