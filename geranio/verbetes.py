# Palavras do dia do Gerânio (versão de 5 pétalas, desde 06/11/2026): só VERBETES de dicionário — verbo no infinitivo,
# substantivo e adjetivo na forma de dicionário (sem plural, feminino flexionado ou conjugação) — e só os de uso corrente:
# frequência conhecida no fserb/pt-br (icf ≤ 14) ou presentes na lista curada do Cordel.
# Fora: estrangeirismos e nomes próprios (as mesmas regras de dicionario.py), palavrões (negativas do fserb) e a lista STOP.
# Plurais, femininos e conjugações continuam VALENDO no jogo (palavras.txt), como raras (pontos em dobro).
# Uso: python3 geranio/verbetes.py <pasta do VERO com index.dic> <pasta src do fserb/pt-br> geranio/verbetes.json
#      depois python3 geranio/grafia.py (segunda grafia corrente, metro · metrô, e a grafia das raras em palavras.txt)
import re, sys, json, unicodedata, os
norm = lambda s: unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
aqui = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(aqui, 'dicionario.py'), encoding='utf8').read()
ns = {'re': re}; exec(src[src.index('ESTR=re.compile'):src.index('forms=set()')], ns); fora = ns['fora']
STOP = set("""aragao nago nanga einstein tete nara date tate tata iate itati faco nonsense seccao dodo corner relax bessa natura""".split())
# grafias anteriores ao Acordo de 1990 que o VERO ainda traz como verbete
OBSOLETAS = set("pára péla pélo pêlo pólo pêra côa".split())
icf = {}
for l in open(os.path.join(sys.argv[2], 'icf'), encoding='utf8'):
    w, _, v = l.strip().partition(',')
    try: icf.setdefault(norm(w), float(v))
    except ValueError: pass
# nomes de lugar (países, estados, municípios do Brasil) que o VERO também traz como verbete, com a mesma grafia (paraná,
# itaparica, santana): fora, salvo se o Cordel usa ou se a palavra é muito usada (cruz, vitória); "para" ≠ "Pará" fica
lugares = set()
for f in ('paises', 'estados-br', 'municipios-br', 'continentes'):
    lugares |= {w.strip().lower() for w in open(os.path.join(sys.argv[2], 'listas', f), encoding='utf8').read().splitlines() if w.strip()}
icfx = {}
for l in open(os.path.join(sys.argv[2], 'icf'), encoding='utf8'):
    w, _, v = l.strip().partition(',')
    try: icfx.setdefault(w, float(v))
    except ValueError: pass
neg = {norm(w) for w in open(os.path.join(sys.argv[2], 'listas', 'negativas'), encoding='utf8').read().split()}
respw = {w.lower() for w in json.load(open(os.path.join(aqui, '..', 'cordel', 'respostas.json'), encoding='utf8')).values()}
resp = {norm(w) for w in respw}
# nomes de pessoas, sobrenomes e lugares que também são verbete (nomes-proprios.txt): fora, salvo se o Cordel usa
for l in open(os.path.join(aqui, 'nomes-proprios.txt'), encoding='utf8'):
    if not l.startswith('#'): STOP |= {norm(w) for w in l.split()}
out = {}; cand = {}
for l in open(os.path.join(sys.argv[1], 'index.dic'), encoding='utf8').read().splitlines()[1:]:
    w = l.split('/')[0]
    if not w or not w[0].islower() or not re.fullmatch(r'[a-zà-üç]+', w) or len(w) < 4 or fora(w) or w in OBSOLETAS: continue
    n = norm(w)
    if n in neg or (n in STOP and n not in resp) or len(set(n)) > 7 or (w in lugares and n not in resp): continue
    # vale a grafia exata: o verbete de uso (icf ≤ 14) ou a palavra como o Cordel a escreve (jogo, não o verbete jogó)
    if icfx.get(w, 99) <= 14: cand.setdefault(n, set()).add(w)
    elif n in resp: cand.setdefault(n, set()).update(r for r in respw if norm(r) == n)
# O VERO não traz como verbete muitas palavras de base que ele gera por regra (corda, faca, carne, dedo, roda, casa, sono):
# entram também as do léxico do fserb (palavras que não são conjugação, mais os infinitivos), com o mesmo filtro e
# o mesmo uso (icf ≤ 14), menos os plurais (cordas, amigos, tantas). Desde 07/11/2026.
lexico = set(open(os.path.join(sys.argv[2], 'lexico'), encoding='utf8').read().split())
def plural(w):
    if not w.endswith('s'): return False
    for a, b in (('ões', 'ão'), ('ães', 'ão'), ('ãos', 'ão'), ('éis', 'el'), ('eis', 'el'), ('óis', 'ol'), ('ais', 'al'),
                 ('is', 'il'), ('ns', 'm'), ('as', 'o'), ('as', 'a'), ('os', 'o'), ('es', ''), ('s', '')):
        if w.endswith(a) and w[:len(w) - len(a)] + b in lexico: return True
    return False
# conjugação que o léxico também traz (fico, toma, anda, tento): fora o gerúndio e a forma que é bem menos usada que o
# próprio verbo — sinal de que é só o verbo. Fica a que o uso mostra ser outra palavra (cedo ≫ ceder, entre ≫ entrar,
# casa ≫ casar, nada ≫ nadar, tarde ≫ tardar).
conj = set(open(os.path.join(sys.argv[2], 'conjugações'), encoding='utf8').read().split())
verbos = set(open(os.path.join(sys.argv[2], 'listas', 'verbos'), encoding='utf8').read().split())
def so_conjugacao(w):
    if w not in conj or w in verbos: return False
    if w.endswith('ndo'): return True
    infs = [w[:-k] + t for k in (1, 2) for t in ('ar', 'er', 'ir') if w[:-k] + t in verbos]
    if not infs: return False
    return icfx.get(w, 99) > min(icfx.get(i, 99) for i in infs) - 1.0
for w in lexico:
    if not re.fullmatch(r'[a-zà-üç]+', w) or len(w) < 4 or fora(w) or w in OBSOLETAS or so_conjugacao(w): continue
    n = norm(w)
    if n in neg or n in STOP or len(set(n)) > 7 or w in lugares or icfx.get(w, 99) > 14: continue
    cand.setdefault(n, set()).add(w)
# nenhum plural entre as palavras do dia (o VERO traz alguns como verbete: carros, amigos)
for n in list(cand):
    cand[n] = {w for w in cand[n] if not plural(w)}
    if not cand[n] and n not in resp: del cand[n]
    elif not cand[n]: cand[n] = {r for r in respw if norm(r) == n}
# grafia: a mais usada das que valeram; a segunda grafia corrente (metro · metrô) entra depois, em grafia.py
for n, ws in cand.items(): out[n] = min(ws, key=lambda w: (icfx.get(w, 99), w))
json.dump(out, open(sys.argv[3], 'w', encoding='utf8'), ensure_ascii=False)
print(len(out))
