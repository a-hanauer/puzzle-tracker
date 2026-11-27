# Palavras do dia do Gerânio: só VOCÁBULOS de dicionário — verbo no infinitivo, substantivo e adjetivo na forma de
# dicionário (masculino singular, sem grau), advérbio, preposição etc. — e só os de uso corrente no Brasil.
# Nada de plural, feminino flexionado, diminutivo, aumentativo, superlativo, particípio que não é adjetivo nem conjugação:
# essas formas continuam VALENDO no jogo (palavras.txt), como raras.
#
# O que é vocábulo (revisto em 26/11/2026):
#   - lema do DELAS PB (dicionário de lemas do português do Brasil do NILC/USP, distribuído com o Unitex:
#     github.com/UnitexGramLab/unitex-lingua, pt-BR/Dela/DELAS_PB_2018.dic), menos nomes próprios (+Pr); ou
#   - verbo no infinitivo; ou
#   - a lista vocabulos-manter.txt, revista à mão: substantivos que o DELAS só traz como flexão de outro (lógica, editora,
#     chamada, calcinha) e palavras correntes que ele não tem (sozinho, riacho, clicar, meme).
#   O DELAS só tem o lema (gordo, vendedor, carro), então gorda, vendedora, carrinho e os plurais ficam de fora sozinhos.
#   Conjugação só vale se também é substantivo/adjetivo (busca, volta, olho); particípio só se é substantivo ou se usa
#   mais como adjetivo que o verbo (cansado sim, comprado não); vocabulos-fora.txt tira as formas em que o substantivo
#   do DELAS é raro e o uso é o do verbo (passa, empurra, tento).
#
# O que é uso corrente: nota = mediana da frequência (zipf) em três ou quatro fontes de português, para nenhuma puxar
# sozinha (cada uma tem um viés):
#   - legendas pt-BR de filmes e séries (OpenSubtitles 2018, github.com/hermitdave/FrequencyWords, pt_br_full.txt): a fala;
#   - wordfreq (github.com/rspeer/wordfreq, large_pt: Wikipédia, legendas, notícias, web, Twitter, Reddit, até 2021);
#   - icf do fserb/pt-br (texto da internet, atualizado em 2025);
#   - brWaC (corpus da web brasileira, 2,7 bi de palavras; github.com/Superar/Portuguese-Ngram-Frequencies), quando a
#     palavra está nas 10 mil mais frequentes.
#   Nenhuma é só do Brasil contemporâneo (legendas e wordfreq misturam Portugal), por isso as grafias e palavras de
#   Portugal que passam (gajo, autocarro, telemóvel) ficam em nomes-proprios.txt, revistas à mão.
#
# Uso: python3 geranio/verbetes.py <pasta do VERO com index.dic> <pasta src do fserb/pt-br> geranio/verbetes.json
#        <formas-com-acento.txt> <pt_br_full.txt> <wordfreq pt (json palavra → zipf)> <DELAS_PB_2018.dic> <brWaC 1gram.csv>
#      (grava também uso.json) e depois python3 geranio/grafia.py (segunda grafia corrente, metro · metrô, e a grafia das
#      raras em palavras.txt) e node geranio/gerador.mjs
import re, sys, json, unicodedata, os, math, csv
norm = lambda s: unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
aqui = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(aqui, 'dicionario.py'), encoding='utf8').read()
ns = {'re': re}; exec(src[src.index('ESTR=re.compile'):src.index('forms=set()')], ns); fora = ns['fora']
STOP = set("""aragao nago nanga einstein tete nara date tate tata iate itati faco nonsense seccao dodo corner relax bessa natura consta resulta finda topa valeu obriga nino basto veda polia soluco""".split())
# grafias anteriores ao Acordo de 1990 que o VERO ainda traz como verbete
OBSOLETAS = set("pára péla pélo pêlo pólo pêra côa".split())
# corte da nota de uso (zipf; 3 ≈ uma vez a cada milhão de palavras)
CORTE = float(os.environ.get('CORTE', '2.6'))

# ---------- frequência ----------
icf = {}; icfx = {}
for l in open(os.path.join(sys.argv[2], 'icf'), encoding='utf8'):
    w, _, v = l.strip().partition(',')
    try: v = float(v)
    except ValueError: continue
    icf.setdefault(norm(w), v); icfx.setdefault(w, v)
leg = {}; tot = 0
for l in open(sys.argv[5], encoding='utf8'):
    w, _, c = l.strip().partition(' ')
    c = int(c or 0); tot += c; k = w.lower(); leg[k] = leg.get(k, 0) + c
LEG = {k: math.log10(c / tot * 1e9) for k, c in leg.items()}
WF = {}
for w, z in json.load(open(sys.argv[6], encoding='utf8')).items():
    k = w.lower(); WF[k] = max(WF.get(k, 0), z)
BR = {}
for row in list(csv.reader(open(sys.argv[8], encoding='utf8')))[1:]:
    BR[row[0].lower()] = math.log10(int(row[1]) / 2.68e9 * 1e9)
# a grafia exata (ariá, planta rara, não pode herdar a frequência de "ária")
def nota(w):
    n = w; i = icfx.get(w)
    # icf → zipf pela reta ajustada às palavras que estão nas duas listas (zipf ≈ 9,32 − 0,473 · icf)
    vs = sorted([LEG.get(n, 0.0), WF.get(n, 0.0), (9.32 - .4734 * i) if i else 0.0] + ([BR[n]] if n in BR else []))
    m = len(vs)
    return vs[m // 2] if m % 2 else (vs[m // 2 - 1] + vs[m // 2]) / 2
corrente = lambda w: nota(w) >= CORTE

# ---------- o que é vocábulo ----------
DELAS = {}; PROPRIO = set()
for l in open(sys.argv[7], encoding='utf8'):
    w, _, c = l.strip().partition(',')
    if '+Pr' in c: PROPRIO.add(w.lower())
    if '+Pr' in c or not re.fullmatch(r'[a-zà-üç]+', w): continue
    DELAS.setdefault(w, set()).add(c)
classe = lambda c: re.match(r'[A-Z]+', c).group()
# contrações (deste, pela, nesta) não são verbete
nominal = {w for w, cs in DELAS.items() if {classe(c) for c in cs if not classe(c).startswith('PREPX')} - {'V', 'PFX'}}
# para formas de verbo, conjunção não basta (seja, quer)
nominal_v = {w for w, cs in DELAS.items() if {classe(c) for c in cs} - {'V', 'PFX', 'CONJ'}}
infinitivos = {w for w, cs in DELAS.items() if any(classe(c) == 'V' for c in cs)}
infinitivos |= set(open(os.path.join(sys.argv[2], 'listas', 'verbos'), encoding='utf8').read().split())
vero = [l.split('/')[0] for l in open(os.path.join(sys.argv[1], 'index.dic'), encoding='utf8').read().splitlines()[1:]]
conj = set(open(os.path.join(sys.argv[2], 'conjugações'), encoding='utf8').read().split())
# substantivos que os dicionários só trazem como flexão ou particípio de outra palavra, mas que são palavras à parte
lista = lambda f: {w for l in open(os.path.join(aqui, f), encoding='utf8') for w in l.split('#')[0].split()}
MANTER = lista('vocabulos-manter.txt')
# formas de verbo que o DELAS também traz como substantivo raro (a passa, o tento): o uso é o do verbo
VERBAIS = lista('vocabulos-fora.txt')
def infs_de(w, ks=(1, 2)):
    return [w[:-k] + t for k in ks for t in ('ar', 'er', 'ir') if w[:-k] + t in infinitivos]
def vocabulo(w):
    if w in MANTER: return True
    if w in VERBAIS: return False
    if w in PROPRIO and w not in nominal: return False   # julieta, páris
    if w.endswith('ndo') and w[:-3] + 'r' in infinitivos: return False   # gerúndio (graduando, formando: na lista MANTER)
    if w in infinitivos and w.endswith(('ar', 'er', 'ir', 'or', 'ôr')): return True
    if w in conj:
        if w not in nominal_v: return False   # conjugação pura: tinha, deve, seja, sairá
        # particípio: só o que é substantivo (o feito, o ferido) ou que se usa mais como adjetivo do que o próprio verbo
        # (cansado, pesado, preocupado); comprado, gostado, entrado ficam de fora
        if w.endswith(('ado', 'ido', 'ído')):
            if any(c.startswith('N') for c in DELAS[w]): return True
            infs = [w[:-3] + t for t in ('ar', 'er', 'ir') if w[:-3] + t in infinitivos]
            return not infs or nota(w) >= max(nota(i) for i in infs) - .3
        return True                          # substantivo igual a uma forma do verbo: busca, volta, olho, começo
    return w in nominal

# ---------- filtros de sempre ----------
lugares = set()
for f in ('paises', 'estados-br', 'continentes'):
    lugares |= {w.strip().lower() for w in open(os.path.join(sys.argv[2], 'listas', f), encoding='utf8').read().splitlines() if w.strip()}
municipios = {w.strip().lower() for w in open(os.path.join(sys.argv[2], 'listas', 'municipios-br'), encoding='utf8').read().splitlines() if w.strip()}
lugar = lambda w: w in lugares or (w in municipios and nota(w) < 3.9)
neg = {norm(w) for w in open(os.path.join(sys.argv[2], 'listas', 'negativas'), encoding='utf8').read().split()}
respw = {w.lower() for w in json.load(open(os.path.join(aqui, '..', 'cordel', 'respostas.json'), encoding='utf8')).values()}
resp = {norm(w) for w in respw}
for l in open(os.path.join(aqui, 'nomes-proprios.txt'), encoding='utf8'):
    if not l.startswith('#'): STOP |= {norm(w) for w in l.split()}
# grafia brasileira: só vale o que o VERO (pt-BR) conhece com essa grafia
formas = set(open(sys.argv[4], encoding='utf8').read().split())
lexico = set(open(os.path.join(sys.argv[2], 'lexico'), encoding='utf8').read().split())
def plural(w):
    if not w.endswith('s'): return False
    for a, b in (('ões', 'ão'), ('ães', 'ão'), ('ãos', 'ão'), ('éis', 'el'), ('eis', 'el'), ('óis', 'ol'), ('ais', 'al'),
                 ('is', 'il'), ('ns', 'm'), ('as', 'o'), ('as', 'a'), ('os', 'o'), ('es', ''), ('s', '')):
        b2 = w[:len(w) - len(a)] + b
        if w.endswith(a) and (b2 in lexico or b2 in DELAS): return True
    return False

cand = {}
for w in set(vero) | set(DELAS) | MANTER:
    if not w or not re.fullmatch(r'[a-zà-üç]+', w) or len(w) < 4 or fora(w) or w in OBSOLETAS or w not in formas: continue
    n = norm(w)
    if n in neg or len(set(n)) > 7: continue
    if n in resp: cand.setdefault(n, set()).update(r for r in respw if norm(r) == n); continue
    if n in STOP or lugar(w) or plural(w) or not vocabulo(w) or not corrente(w): continue
    cand.setdefault(n, set()).add(w)
out = {n: min(ws, key=lambda w: (-nota(w), w)) for n, ws in cand.items()}
json.dump(out, open(sys.argv[3], 'w', encoding='utf8'), ensure_ascii=False)
# uso.json: a mesma nota, na escala do icf (quanto maior, menos usada; ≈ 6 "casa", ≈ 13 "verdura"), para o gerador medir o
# vocabulário de cada flor (segunda = flores de palavras mais usadas … domingo = menos usadas)
uso = {n: round(min((9.32 - nota(w)) / .4734, 14), 1) for n, w in out.items()}
json.dump(uso, open(os.path.join(aqui, 'uso.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
if os.environ.get('NOTAS'): json.dump({w: round(nota(w), 2) for w in out.values()}, open(os.environ['NOTAS'], 'w', encoding='utf8'), ensure_ascii=False)
print(len(out))
