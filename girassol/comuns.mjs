// palavras do dia do Girassol: as respostas curadas do Cordel + as flexões comuns delas (plural, feminino, conjugações)
// Uso: node girassol/comuns.mjs <pasta src do fserb/pt-br> girassol/base.json <formas com acento do VERO, de dicionario.py>
//      (depois: node girassol/gerador.mjs)
import fs from 'fs';
const S=process.argv[2]+'/';const rd=f=>fs.readFileSync(S+f,'utf8').split('\n').map(s=>s.trim()).filter(Boolean);
const norm=w=>w.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const txt=fs.readFileSync(new URL('../cordel/',import.meta.url).pathname+'palavras.txt','utf8');
const dic=new Set();let prev='',cur=null;
for(const ch of txt){ if(ch>='a'&&ch<='z'){cur+=ch;continue;} if(cur!==null){dic.add(cur);prev=cur;} cur=prev.slice(0,parseInt(ch,36)); } if(cur)dic.add(cur);
const conj=new Set(rd('conjugações').map(norm)), neg=new Set(rd('listas/negativas').map(norm));
const icf=new Map(), acento=new Map();
for(const l of rd('icf')){const [w,v]=l.split(',');const n=norm(w);if(!icf.has(n)||icf.get(n)>+v){icf.set(n,+v);acento.set(n,w);}}
const FORA=new Set(['tour','shampoo','marte','douro','volvo','dance','carinha']);
// nomes próprios, estrangeirismos, gírias e formas de Portugal que aparecem no léxico entre as palavras frequentes
const STOP=new Set(`brasil deus site blog internet jesus maria joao post mail cristo parana america catarina lula franca roberto pereira china light
shopping bruno luis goias santana rodrigo israel alexandre africa game almeida rafael argentina japao porno login mega vieira barbosa aluguer
micro braga junior star vasco paraiba andrade sousa alberto chico flash maranhao mateus resort moreira bernardo india angola mariana vicente
trailer registo maia paul canada cesar foda monteiro live nunes tablet status caetano jeans puta isabel moura mouse santiago piaui chile porra
infra drive juliana caxias celso merda fashion standard ferreira oliveira contacto facto hein tava grid design paulista carioca acordao natal
salvador augusto gama recife pinheiro carvalho machado batista ribeiro marinho santos silva souza lima costa rocha nogueira paulo pedro jose
ana carlos lucas gabriel daniel marcos felipe joana julia laura beatriz renata patricia fernanda luiza camila sandra regina rita ines nina
vitoria clara rosa`.split(/\s+/));
const R=JSON.parse(fs.readFileSync(new URL('../cordel/',import.meta.url).pathname+'respostas.json','utf8'));
const base=new Map(); for(const w of Object.values(R)){const n=norm(w); if(!FORA.has(n)&&!neg.has(n)) base.set(n,w);}
// mais as palavras frequentes do léxico que faltam na lista do Cordel (terra, cidade, mundo…), sem nomes nem estrangeirismos
const lex=new Set(rd('lexico'));
for(const l of rd('icf')){const [w,v]=l.split(',');if(+v>10.8)break;const n=norm(w);
  if(w.length<4||!lex.has(w)||base.has(n)||STOP.has(n)||neg.has(n)||/[kwy]/.test(n)||!/^[a-zà-üç]+$/.test(w)) continue;
  if(conj.has(w)&&!/(ar|er|ir|or)$/.test(w)) continue;          // forma verbal: entra pelas flexões
  base.set(n,w);}
const verbos=[...base.keys()].filter(n=>/(ar|er|ir|or)$/.test(n)&&conj.has(n));
const stems=new Map(); for(const v of verbos){const s=v.slice(0,-2); if(s.length>=2) stems.set(s,v);}
const nominal=w=>{ const c=[w.replace(/oes$/,'ao'),w.replace(/aes$/,'ao'),w.replace(/ns$/,'m'),w.replace(/is$/,'l'),w.replace(/eis$/,'el'),w.replace(/es$/,''),w.replace(/s$/,''),w.replace(/as$/,'o'),w.replace(/a$/,'o'),w.replace(/ora$/,'or'),w.replace(/oras$/,'or')];
  return c.some(x=>x!==w&&base.has(x)); };
const verbal=w=>{ if(!conj.has(w)) return false; for(let k=Math.min(w.length-1,12);k>=2;k--){ if(stems.has(w.slice(0,k))) return true; } return false; };
const out={};
for(const [n,w] of base) if(n.length>=4&&new Set(n).size<=7) out[n]=w;
for(const [n,f] of icf){
  if(out[n]||STOP.has(n)||n.length<4||!/^[a-z]+$/.test(n)||new Set(n).size>7||f>12.5||neg.has(n)||!dic.has(n)) continue;
  if(!(nominal(n)||verbal(n))) continue;
  const a=acento.get(n); if(!/^[a-zà-üç]+$/.test(a)) continue;
  out[n]=a;
}
// plural e feminino de toda palavra-base que o VERO dá pelas regras da própria palavra (eterno -> eterna, eternos,
// eternas; ação -> ações): entram sempre, sem olhar a frequência. Só terminações de número e gênero (nada de -mente, -inho…).
if(process.argv[4]){
  const flex=new Map(); for(const l of fs.readFileSync(process.argv[4],'utf8').split('\n')){const [w,...fs2]=l.split(' '); if(w) flex.set(w,fs2);}
  const nominal2=(b,x)=>{const B=norm(b),X=norm(x); return [B+'s',B+'es',B.replace(/o$/,'a'),B.replace(/o$/,'os'),B.replace(/o$/,'as'),B.replace(/ao$/,'oes'),B.replace(/ao$/,'aes'),
    B.replace(/ao$/,'aos'),B.replace(/l$/,'is'),B.replace(/m$/,'ns'),B.replace(/or$/,'ora'),B.replace(/or$/,'oras'),B.replace(/or$/,'ores'),B.replace(/es$/,'esa'),B.replace(/es$/,'esas'),
    B.replace(/eu$/,'eia'),B.replace(/eu$/,'eias'),B.replace(/ao$/,'a'),B.replace(/ao$/,'as')].some(c=>c!==B&&c===X);};
  for(const [n,w] of [...base]){
    if(conj.has(n)&&/(ar|er|ir)$/.test(n)) continue;          // verbo: as conjugações já entram pela frequência
    for(const x of flex.get(w)||[]){ const k=norm(x);
      if(out[k]||STOP.has(k)||neg.has(k)||k.length<4||new Set(k).size>7||!nominal2(w,x)) continue; out[k]=x; }
  }
}
fs.writeFileSync(process.argv[3],JSON.stringify({comuns:out,bloq:[...neg].filter(n=>/^[a-z]{4,}$/.test(n)).sort()}));
const ex=Object.keys(out).filter(n=>!base.has(n));
console.log('total',Object.keys(out).length,'flexoes',ex.length);console.log(ex.sort(()=>Math.random()-.5).slice(0,200).map(n=>out[n]).join(' '));
