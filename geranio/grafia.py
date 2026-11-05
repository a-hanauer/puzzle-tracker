# Grafia do Gerânio: o jogo lê só as letras (acento e cedilha não contam), então uma JOGADA = uma sequência de letras sem
# acento (a "chave": pais, baia, metro). Ela vale uma vez só e soma pontos uma vez só, ainda que caiba em mais de uma palavra.
# Para MOSTRAR a jogada, cada chave ganha a grafia de verdade:
#   1. entre as formas do VERO com aquela chave (pais/país, baia/baía, video/vídeo), a mais usada no fserb/pt-br (icf da
#      grafia exata) — assim vídeo, século, colônia, júri e não as versões sem acento que a internet escreve por preguiça;
#      (nas palavras do dia, sempre a grafia do verbete, que verbetes.py já escolheu: faraó, louça, jogo);
#   2. se outra grafia da mesma chave é outra palavra corrente (icf ≤ 12,3, no léxico do fserb — não verbo —, sem nome
#      próprio), as duas, com " · ", a mais usada primeiro: país · pais, março · marco, faça · faca, secretaria · secretária,
#      metro · metrô. São palavras diferentes que o jogo junta numa jogada só (vale uma vez, conta uma vez).
#   3. sem frequência conhecida: a sem acento, se o VERO tiver; senão a de menos sinais (o jogador vê a palavra bem escrita).
# Saídas: geranio/palavras.txt (as mesmas chaves, agora gravadas com a grafia; formato com prefixo comum, 0-9/A-Z = quantas
# letras repete da anterior) e os valores de geranio/verbetes.json (palavras do dia).
# Uso: python3 geranio/grafia.py <formas-com-acento.txt (dicionario.py, 3º arg)> <pasta src do fserb/pt-br>
import os, re, sys, json, unicodedata, collections
aqui = os.path.dirname(os.path.abspath(__file__))
norm = lambda s: unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
sinais = lambda w: sum(a != b for a, b in zip(w, norm(w)))

icf = {}
for l in open(os.path.join(sys.argv[2], 'icf'), encoding='utf8'):
    w, _, v = l.strip().partition(',')
    try: icf.setdefault(w, float(v))
    except ValueError: pass
OBSOLETAS = set('pára péla pélo pêlo pólo pêra côa'.split())   # grafias de antes do Acordo de 1990
formas = collections.defaultdict(set)
for w in open(sys.argv[1], encoding='utf8').read().split():
    if re.fullmatch(r'[a-zà-üç]+', w) and w not in OBSOLETAS: formas[norm(w)].add(w)

lexico = set(open(os.path.join(sys.argv[2], 'lexico'), encoding='utf8').read().split())   # palavras que não são verbo
nomes = set()
for f in ('paises', 'estados-br', 'municipios-br', 'continentes'):
    nomes |= {norm(w) for w in open(os.path.join(sys.argv[2], 'listas', f), encoding='utf8').read().split()}
for l in open(os.path.join(aqui, 'nomes-proprios.txt'), encoding='utf8'):
    if not l.startswith('#'): nomes |= {norm(w) for w in l.split()}
PTPT = set('bebé cliché comité croché puré'.split())

def grafia(k, dia=None):
    # dia = a grafia da palavra do dia (verbetes.py: o verbete como se escreve), que sempre aparece
    s = formas.get(k, set()) | ({dia} if dia else set()) or {k}
    usadas = sorted((icf[w], w) for w in s if w in icf)
    w1 = dia or (usadas[0][1] if usadas else (k if k in s else min(s, key=lambda w: (sinais(w), w))))
    # segunda grafia: outra palavra de verdade, corrente, que não seja verbo (a internet escreve "musica", "numero" sem
    # acento; o VERO aceita como conjugação de musicar, numerar — isso não é outra palavra), nome próprio ou grafia lusa
    outra = [w for v, w in usadas if w != w1 and v <= 12.3 and w in lexico and k not in nomes and w not in PTPT][:1]
    return ' · '.join(sorted([w1] + outra, key=lambda w: icf.get(w, 99)))   # a mais usada primeiro (país · pais)

# palavras.txt: lê as chaves (o filtro de estrangeirismos, nomes e 7 letras já está nele) e regrava com a grafia
P = os.path.join(aqui, 'palavras.txt'); txt = open(P, encoding='utf8').read()
chaves, prev, cur = [], '', None
for ch in txt:
    if ch.isdigit() or 'A' <= ch <= 'Z':
        if cur is not None: chaves.append(cur); prev = norm(cur)
        cur = prev[:int(ch, 36)]
    else: cur += ch
if cur: chaves.append(cur)
chaves = sorted({norm(c) for c in chaves})
saida = [g for k in chaves for g in grafia(k).split(' · ')]   # duas grafias = duas linhas seguidas, a mais usada antes
out, prev = [], ''
for w in saida:
    n = 0
    while n < min(len(w), len(prev), 35) and w[n] == prev[n]: n += 1
    out.append('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n] + w[n:]); prev = w
open(P, 'w', encoding='utf8').write(''.join(out))

V = os.path.join(aqui, 'verbetes.json'); ver = json.load(open(V, encoding='utf8'))
ver = {k: grafia(k, v.split(' · ')[0]) for k, v in ver.items()}
json.dump(ver, open(V, 'w', encoding='utf8'), ensure_ascii=False)
print(len(chaves), 'chaves;', sum(norm(w) != w for w in saida), 'com acento/ç;', len(saida) - len(chaves), 'com duas grafias')
