// Jogos do Dia na nuvem (Firebase, projeto "Puzzle Tracker"), desde 09/11/2026.
// - Conta: anônima, criada na hora (sem cadastro); pode ganhar e-mail e senha para entrar em outro aparelho.
// - Progresso: cada chave dos jogos salva no aparelho (os mesmos prefixos do backup) tem uma cópia em
//   users/{uid}/prog/{chave}. Envia o que mudou; recebe o que mudou em outro aparelho e junta sem perder nada.
// - Ranking: grupos de amigos por código de convite (grupos/{cod}); cada resultado do dia vai para
//   grupos/{cod}/res/{dia_jogo_uid}. As regras do banco (firestore.rules) garantem que cada um só grava o seu.
// O painel (index.html) fala com este módulo por window.nuvem; sem internet, nada quebra: tudo continua local.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, EmailAuthProvider, linkWithCredential,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, writeBatch,
  arrayUnion, arrayRemove, deleteField } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyDgguzFL-6FtOwaKo0x0r5OBI5uhsrG2qA",
  authDomain: "puzzle-tracker-c683a.firebaseapp.com",
  projectId: "puzzle-tracker-c683a",
  storageBucket: "puzzle-tracker-c683a.firebasestorage.app",
  messagingSenderId: "737948537482",
  appId: "1:737948537482:web:ec0e6648c063809ea85373",
});
const auth = getAuth(app), db = getFirestore(app);
auth.languageCode = "pt-BR";   // e-mails do Firebase (recuperar a senha) em português

const LS = "jogosDoDia.nuvem";   // { uid, apelido, grupos: [{cod, nome}], env: {chave: hash}, pull: ms, res: {id: hash} }
const ler = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } };
const gravar = s => { try { localStorage.setItem(LS, JSON.stringify(s)); } catch {} };
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36) + s.length; };
const idChave = k => encodeURIComponent(k).replace(/\./g, "%2E");
const ouvintes = new Set();
const avisa = () => ouvintes.forEach(f => { try { f(); } catch {} });

let user = null, prefixos = [], fundir = null, sincronizando = null, ultimaSync = 0, erro = "";
const pronto = new Promise(res => onAuthStateChanged(auth, u => { user = u; res(); avisa(); }));

// ---------- progresso ----------
function chavesLocais() {
  const out = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k !== LS && !/^jogosDoDia\.(fora|grupo|rankVisto|reentrar)$/.test(k) && prefixos.some(p => k.startsWith(p))) out[k] = localStorage.getItem(k);
  }
  return out;
}
// junta duas versões da mesma chave quando as duas mudaram (o painel ensina a juntar as suas; senão, fica a "maior")
function junta(k, local, remoto) {
  if (fundir) { try { const r = fundir(k, local, remoto); if (r != null) return r; } catch {} }
  try {
    const a = JSON.parse(local), b = JSON.parse(remoto);
    if (a && b && typeof a === "object" && typeof b === "object") {
      if (!!a.done !== !!b.done) return a.done ? local : remoto;     // partida terminada vale mais
      if (Array.isArray(a.found) && Array.isArray(b.found)) {         // Gerânio: soma as achadas
        const m = { ...b, ...a, found: [...new Set([...b.found, ...a.found])], raras: [...new Set([...(b.raras || []), ...(a.raras || [])])] };
        return JSON.stringify(m);
      }
    }
  } catch {}
  return local.length >= remoto.length ? local : remoto;
}
async function sincroniza() {
  if (!user || !navigator.onLine) return;
  const s = ler(); s.env ||= {};
  const col = collection(db, "users", user.uid, "prog");
  // 1) recebe o que mudou desde a última vez
  const desde = s.pull || 0, agora = Date.now();
  const snap = await getDocs(desde ? query(col, where("t", ">", desde - 60000)) : col);
  snap.forEach(d => {
    const { k, v } = d.data(); if (!k || v == null) return;
    const local = localStorage.getItem(k), env = s.env[k];
    if (local === v) { s.env[k] = hash(v); return; }
    if (local == null || hash(local) === env) { localStorage.setItem(k, v); s.env[k] = hash(v); }   // aqui não mudou: fica a de lá
    else { const m = junta(k, local, v); localStorage.setItem(k, m); if (m === v) s.env[k] = hash(v); }   // mudou dos dois lados
  });
  s.pull = agora;
  // 2) envia o que mudou aqui (em lotes de até 400)
  const locais = chavesLocais(), mudou = Object.entries(locais).filter(([k, v]) => s.env[k] !== hash(v));
  for (let i = 0; i < mudou.length; i += 400) {
    const b = writeBatch(db);
    for (const [k, v] of mudou.slice(i, i + 400)) {
      if (v.length > 190000) continue;
      b.set(doc(col, idChave(k)), { k, v, t: Date.now() });
    }
    await b.commit();
    for (const [k, v] of mudou.slice(i, i + 400)) s.env[k] = hash(v);
  }
  gravar(s);
  ultimaSync = Date.now();
  return snap.size;
}

// ---------- ranking ----------
const ALFA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const codigo = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => ALFA[b % ALFA.length]).join("");
async function perfil() {
  const s = ler();
  if (!user) return s;
  const d = await getDoc(doc(db, "users", user.uid));
  if (d.exists()) {
    const p = d.data();
    s.apelido = p.apelido || s.apelido;
    if (Array.isArray(p.grupos)) s.grupos = p.grupos;
  }
  s.uid = user.uid; gravar(s); avisa();
  return s;
}
async function salvaPerfil(s) { await setDoc(doc(db, "users", user.uid), { apelido: s.apelido || "", grupos: s.grupos || [] }, { merge: true }); gravar(s); avisa(); }
// Envia os resultados que ainda não foram (ou mudaram). Lotes pequenos: cada gravação confere nas regras se a pessoa é do
// grupo (um get() no grupo), e o banco recusa o lote inteiro se passar de 20 consultas — com lotes de 100, o histórico dos
// dias anteriores nunca subia. Se um lote falhar, tenta um a um, para um resultado estranho não segurar os outros.
const RES_V = 3;   // subir para reenviar tudo de todo mundo (3: 10/11/2026, para garantir o histórico antigo de todos)
async function enviaResultados(lista) {
  const s = ler(); if (!user || !s.grupos?.length || !navigator.onLine) return;
  if (s.resV !== RES_V) { s.res = {}; s.resV = RES_V; }
  s.res ||= {};
  const marca = r => hash(JSON.stringify(r) + s.apelido + s.grupos.map(g => g.cod).join());
  const ok = r => typeof r.valor === "number" && r.valor >= 0 && r.valor < 100000 && /^\d{4}-\d\d-\d\d$/.test(r.dia) && (r.jogo || "").length <= 24;
  const novos = lista.filter(r => ok(r) && s.res[`${r.dia}_${r.jogo}`] !== marca(r))
    .sort((a, b) => b.dia.localeCompare(a.dia));   // os mais recentes primeiro
  const grava = (b, r) => { for (const g of s.grupos)
    b.set(doc(db, "grupos", g.cod, "res", `${r.dia}_${r.jogo}_${user.uid}`), { ...r, dica: !!r.dica, uid: user.uid, apelido: s.apelido || "", t: Date.now() }); };
  const porLote = Math.max(1, Math.floor(8 / s.grupos.length));
  let falhas = 0;
  for (let i = 0; i < novos.length; i += porLote) {
    const parte = novos.slice(i, i + porLote);
    try { const b = writeBatch(db); parte.forEach(r => grava(b, r)); await b.commit(); parte.forEach(r => s.res[`${r.dia}_${r.jogo}`] = marca(r)); }
    catch (e) {
      for (const r of parte) {
        try { const b = writeBatch(db); grava(b, r); await b.commit(); s.res[`${r.dia}_${r.jogo}`] = marca(r); }
        catch (e2) { falhas++; console.warn("nuvem: resultado recusado", r, e2); }
      }
    }
    if (i % 80 === 0) gravar({ ...ler(), res: s.res, resV: s.resV });   // guarda o avanço no caminho
  }
  // resumo do que está na nuvem (Ajustes → Conta na nuvem): quantos dias de resultado e desde quando
  const marcados = Object.keys(s.res), desde = marcados.map(k => k.slice(0, 10)).sort()[0] || "";
  const envio = { t: Date.now(), total: marcados.length, desde, agora: novos.length - falhas, falhas };
  gravar({ ...ler(), res: s.res, resV: s.resV, envio });
  return envio;
}

window.nuvem = {
  pronto,
  // configura: prefixos das chaves dos jogos e, opcional, como juntar uma chave que mudou dos dois lados
  configura(opts) { prefixos = opts.prefixos || prefixos; fundir = opts.fundir || fundir; },
  ouvir(f) { ouvintes.add(f); return () => ouvintes.delete(f); },
  get estado() {
    const s = ler();
    return { conectado: !!user, anonimo: !!user?.isAnonymous, email: user?.email || "", uid: user?.uid || "",
      apelido: s.apelido || "", grupos: s.grupos || [], ultimaSync, erro, envio: s.envio || null };
  },
  // entra sem cadastro (cria a conta anônima na primeira vez) e guarda o apelido
  async entrar(apelido) {
    await pronto;
    if (!user) user = (await signInAnonymously(auth)).user;
    const s = await perfil();
    if (apelido) { s.apelido = apelido.trim().slice(0, 20); await salvaPerfil(s); }
    await this.sincroniza();
    return this.estado;
  },
  async sincroniza() {
    if (sincronizando) return sincronizando;
    sincronizando = sincroniza().then(n => { erro = ""; return n; }).catch(e => { erro = e.code || e.message || String(e); console.warn("nuvem", e); })
      .finally(() => { sincronizando = null; avisa(); });
    return sincronizando;
  },
  async criarGrupo(nome) {
    const s = ler(), cod = codigo();
    await setDoc(doc(db, "grupos", cod), { nome: (nome || "Amigos").slice(0, 40), dono: user.uid, membros: [user.uid], nomes: { [user.uid]: s.apelido || "" } });
    s.grupos = [...(s.grupos || []).filter(g => g.cod !== cod), { cod, nome: nome || "Amigos" }];
    await salvaPerfil(s);
    return cod;
  },
  async entrarGrupo(cod) {
    cod = (cod || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const ref = doc(db, "grupos", cod), d = await getDoc(ref);
    if (!d.exists()) throw new Error("Não achei um grupo com esse código.");
    const s = ler();
    await updateDoc(ref, { membros: arrayUnion(user.uid), [`nomes.${user.uid}`]: s.apelido || "" });
    s.grupos = [...(s.grupos || []).filter(g => g.cod !== cod), { cod, nome: d.data().nome || "Amigos" }];
    s.res = {};   // manda de novo os resultados, agora também para este grupo
    await salvaPerfil(s);
    return d.data().nome;
  },
  async sairGrupo(cod) {
    const s = ler();
    try { await updateDoc(doc(db, "grupos", cod), { membros: arrayRemove(user.uid), [`nomes.${user.uid}`]: deleteField() }); } catch {}
    s.grupos = (s.grupos || []).filter(g => g.cod !== cod);
    await salvaPerfil(s);
  },
  // só quem criou o grupo: muda o nome e tira pessoas (as regras do banco conferem)
  async renomearGrupo(cod, nome) {
    nome = (nome || "").trim().slice(0, 40); if (!nome) return;
    await updateDoc(doc(db, "grupos", cod), { nome });
    const s = ler(); s.grupos = (s.grupos || []).map(g => g.cod === cod ? { ...g, nome } : g); await salvaPerfil(s);
  },
  async removerMembro(cod, uid) { await updateDoc(doc(db, "grupos", cod), { membros: arrayRemove(uid), [`nomes.${uid}`]: deleteField() }); },
  // confere os grupos guardados: traz o nome novo e esquece os grupos de onde a pessoa foi removida
  async confereGrupos() {
    const s = ler(); if (!user || !s.grupos?.length || !navigator.onLine) return;
    let mudou = false; const fica = [];
    for (const g of s.grupos) {
      try {
        const d = await getDoc(doc(db, "grupos", g.cod));
        if (!d.exists() || !(d.data().membros || []).includes(user.uid)) { mudou = true; continue; }
        const nome = d.data().nome; if (nome && nome !== g.nome) { g.nome = nome; mudou = true; }
      } catch {}
      fica.push(g);
    }
    if (mudou) { s.grupos = fica; await salvaPerfil(s); }
  },
  async mudaApelido(apelido) { const s = ler(); s.apelido = apelido.trim().slice(0, 20); s.res = {}; await salvaPerfil(s); },
  enviaResultados,
  // manda de novo todo o histórico para os grupos (Ajustes → "Enviar meu histórico de novo")
  async reenviaTudo(lista) { const s = ler(); s.res = {}; gravar(s); return enviaResultados(lista); },
  // resultados do grupo entre dois dias (inclusive), já com os nomes dos membros
  async resultados(cod, de, ate) {
    const g = await getDoc(doc(db, "grupos", cod));
    const q = de === ate ? query(collection(db, "grupos", cod, "res"), where("dia", "==", de))
      : query(collection(db, "grupos", cod, "res"), where("dia", ">=", de), where("dia", "<=", ate));
    const r = await getDocs(q);
    return { grupo: g.exists() ? g.data() : null, res: r.docs.map(d => d.data()) };
  },
  // conta: liga e-mail e senha à conta anônima (para entrar em outro aparelho) ou entra numa conta que já existe
  async ligarEmail(email, senha) { await linkWithCredential(user, EmailAuthProvider.credential(email, senha)); await auth.currentUser.reload(); user = auth.currentUser; avisa(); },
  async entrarEmail(email, senha) {
    user = (await signInWithEmailAndPassword(auth, email, senha)).user;
    const s = ler(); s.env = {}; s.pull = 0; s.res = {}; gravar(s);   // aparelho novo: recebe tudo e junta com o que tem aqui
    await perfil(); await this.sincroniza(); return this.estado;
  },
  // esqueci a senha: o Firebase manda um e-mail com um link para criar uma senha nova
  async recuperarSenha(email) { await sendPasswordResetEmail(auth, (email || "").trim()); },
  async sair() { await signOut(auth); gravar({}); user = null; avisa(); },
};
window.dispatchEvent(new Event("nuvem"));
