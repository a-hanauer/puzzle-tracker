# Formas comuns que também são palavras do dia do Gerânio (geranio/formas.json), desde 24/11/2026.
# As palavras do dia eram só verbetes (verbetes.json: infinitivo, masculino singular). Assim "pode", "perde", "coloca", "faria",
# "própria", "limpa", "dias" caíam como raras — frustrante para quem joga. Aqui entra qualquer forma do dicionário do jogo
# (palavras.txt: plurais, femininos, conjugações) que seja de uso comum por si só:
#   icf ≤ 12,5 e ≥ 100 ocorrências nas legendas pt-BR (OpenSubtitles), ou icf ≤ 13,5 e ≥ 500, ou ≥ 1500 nas legendas.
# Fora: nomes e lugares que coincidem com uma forma (Rita, Nina, Adelaide, Miami), grafias de Portugal e estrangeirismos —
# achados por terem maiúscula no VERO ou no hunspell de inglês, ou por não serem flexão reconhecível, e revistos à mão
# (MANTER = palavras de verdade que essa busca pegou; FORA = o resto). Palavrões (bloq) e negativas do fserb também ficam fora.
# Uso: python3 geranio/formas.py <pasta src do fserb/pt-br> <pt_br_full.txt> <index.dic do VERO pt-BR> <index.dic do hunspell en>
#      (depois de verbetes.py e grafia.py; antes de uso.py e gerador.mjs)
import sys, os, json, unicodedata
norm = lambda s: unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
aqui = os.path.dirname(os.path.abspath(__file__))
src, legf, vero, en = sys.argv[1:5]

MANTER = set("""acre agudo alecrim alvorada arame armazem aurora baixos barao capim caracol cacador chacara colina colinas condor confins
consolacao dali delta diamante dias esmeralda esmeraldas estancia europeia faro figueira fortuna franca franco fenix gavião gaviao gentil gloria
granito granja guerra imaculada inocencia jardim lagarto laje leme lula malta mascote messias mirante moreno palmeira passos pavao peru
pinheiro piranhas platina prado raposa realeza redencao regeneracao rios rocha sombrio tais telha tiros tubarao valente vinhedo cascavel gama""".split())
FORA = set("""adao alonso aragao augusto autocarro blazer boom bridge buda caetano caracter celso center constantino curriculum detective didi
ecra eletro excepto excepcao facto freezer fuhrer gajo game gangster gomes hamster here homo lopes lorque manager maple marcela martini milorde
modus moreira napoleao oque poodle porreiro single sicilia trailer upgrade xena miss mister master aids pole
alicia andes angus anita australia bali cairo canada caracas castro china cristina cuba curtis dana dane deli delia erica gore greta juliana
laura lego londrina lucia macau montana nina orlando paris pedro petra rita santana sara silas silva siria trevor vargas vera vernon volvo
cora core ride""".split())

# dicionário do jogo (palavras.txt, mesmo formato que a página lê)
txt = open(os.path.join(aqui, 'palavras.txt'), encoding='utf8').read()
D, prev, cur = {}, '', None
for ch in txt:
    c = ord(ch)
    if 97 <= c <= 122 or c >= 0xe0: cur += ch; continue
    if cur is not None: D.setdefault(norm(cur), cur); prev = cur
    cur = prev[:int(ch, 36)]
if cur: D.setdefault(norm(cur), cur)

verb = json.load(open(os.path.join(aqui, 'verbetes.json'), encoding='utf8'))
bloq = set(json.load(open(os.path.join(aqui, 'desafios.json'), encoding='utf8'))['bloq'])
icf = {}
for l in open(os.path.join(src, 'icf'), encoding='utf8'):
    w, _, x = l.strip().partition(',')
    try: icf.setdefault(norm(w), float(x))
    except ValueError: pass
leg = {}
for l in open(legf, encoding='utf8'):
    w, _, n = l.strip().partition(' ')
    k = norm(w); leg[k] = leg.get(k, 0) + int(n or 0)
lista = lambda f: {norm(x.strip()) for x in open(f, encoding='utf8') if x.strip() and not x.startswith('#')}
neg = lista(os.path.join(src, 'listas', 'negativas'))
lug = set().union(*(lista(os.path.join(src, 'listas', f)) for f in ('paises', 'estados-br', 'continentes', 'municipios-br')))
nomes = lista(os.path.join(aqui, 'nomes-proprios.txt'))
cap = set()
for f in (vero, en):
    for l in open(f, encoding='utf8', errors='ignore'):
        w = l.split('/')[0].split('\t')[0].strip()
        if w[:1].isupper(): cap.add(norm(w))
lex = {norm(l.strip()) for l in open(os.path.join(src, 'lexico'), encoding='utf8')}
cj = set()
for l in open(os.path.join(src, 'conjugações'), encoding='utf8'):
    cj.update(norm(w) for w in l.replace(',', ' ').split())

def comum(k):
    x, n = icf.get(k, 99), leg.get(k, 0)
    return (x <= 12.5 and n >= 100) or (x <= 13.5 and n >= 500) or n >= 1500
def flexao(k, base):   # conjugação, ou plural/feminino de uma palavra conhecida
    if k in cj: return True
    for b in (k[:-1], k[:-2], k[:-2] + 'l', k[:-3] + 'ao', k[:-1] + 'o' if k.endswith('a') else None, k[:-2] + 'o' if k.endswith('as') else None,
              k[:-2] + 'm' if k.endswith('ns') else None, k[:-3] + 'l' if k[-3:] in ('eis', 'ais', 'ois') else None):
        if b and b in base: return True
    return False

out = {}
for k, w in D.items():
    if len(k) < 4 or len(set(k)) > 7 or k in verb or k in bloq or k in neg or k in FORA or not comum(k): continue
    if k not in MANTER:
        if (k in cap or k in lug or k in nomes) and not flexao(k, verb): continue      # parece nome ou lugar
        if not flexao(k, set(verb) | lex) and k not in lex: continue                    # nem flexão nem palavra conhecida
    out[k] = w
json.dump(dict(sorted(out.items())), open(os.path.join(aqui, 'formas.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'formas comuns entram nas palavras do dia')
