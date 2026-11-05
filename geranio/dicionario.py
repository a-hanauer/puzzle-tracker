# Dicionário do Girassol: expande o hunspell pt-BR do LibreOffice (VERO, https://github.com/wooorm/dictionaries,
# pasta dictionaries/pt, licença LGPL/MPL) em todas as formas: plurais, femininos, conjugações, prefixos.
# Fica só o que serve ao jogo: palavras simples em minúsculas (sem nomes próprios nem siglas), 4+ letras, sem acento.
# Uso: python3 geranio/dicionario.py <pasta com index.aff e index.dic> formas.txt [formas-com-acento.txt flexoes.txt]
#      depois, no node, filtrar até 7 letras diferentes e gravar geranio/palavras.txt no formato com prefixo comum
#      (cada palavra começa com um caractere 0-9/A-Z = quantas letras repete da anterior), como o cordel/palavras.txt.
import re, sys, unicodedata
D=sys.argv[1].rstrip('/')+'/'
aff=open(D+'index.aff',encoding='utf8').read().splitlines()
R={}  # flag -> (tipo, cross, [(strip, add, contflags, regex)])
i=0
while i<len(aff):
    p=aff[i].split()
    if len(p)==4 and p[0] in('SFX','PFX') and p[2] in('Y','N') and p[3].isdigit():
        t,f,cross,n=p[0],p[1],p[2]=='Y',int(p[3]); rules=[]
        for j in range(n):
            q=aff[i+1+j].split()
            strip='' if q[2]=='0' else q[2]
            add,_,cf=q[3].partition('/'); add='' if add=='0' else add
            cond=q[4] if len(q)>4 else '.'
            rx=re.compile((cond+'$') if t=='SFX' else ('^'+cond))
            rules.append((strip,add,cf,rx))
        R[f]=(t,cross,rules); i+=n+1
    else: i+=1
FORB='ý'; NOSUG='Ý'
def sfx(w,flags,depth=0):
    out=[]
    for f in flags:
        r=R.get(f)
        if not r or r[0]!='SFX': continue
        for strip,add,cf,rx in r[2]:
            if not rx.search(w): continue
            if strip and not w.endswith(strip): continue
            nw=(w[:-len(strip)] if strip else w)+add
            out.append((nw,f))
            if cf and depth==0: out+= [(x,f) for x,_ in sfx(nw,cf,1)]
    return out
def pfx(w,flags):
    out=[]
    for f in flags:
        r=R.get(f)
        if not r or r[0]!='PFX': continue
        for strip,add,cf,rx in r[2]:
            if not rx.search(w): continue
            if strip and not w.startswith(strip): continue
            out.append((add+(w[len(strip):] if strip else w),r[1]))
    return out
# fora: estrangeirismos (k/w/y, consoantes dobradas que o português não usa, sh/th/ph/gh/ck, "s" + consoante no começo,
# final em consoante estranha) e nomes próprios que o VERO traz em minúsculas (países e nomes de gente); os que também
# são palavras comuns ficam (rocha, oliveira, carvalho, vitória, marcos, deus, peru, natal…)
ESTR=re.compile(r'[kwy]|^s[^aeiouáéíóúâêôãõ]|ll|tt|pp|ff|mm|nn|dd|gg|zz|bb|sh|th|ph|gh|ck|[bcdfghjkpqtvw]$')
NOMES=set("""angola antônio barém benim brasil cabreúva cacá cachoeirinha celão chile comercinho cracolândia emílio frança gabão
gâmbia guiana guiné guiratinga irlanda israel jamaica japão judeia lesoto madagáscar mangueirinha maurícia moçambique monserrate
nepal panamá piraquera politefe portland ruanda senegal sudão turquia vaticano zezinho zoilo ícaro édipo mali catar equador
maria joão aná antônio francisco paúlo luís mateus leandro ricardo márcio jorge roberto vítor manuel miguel benedito
sebastião camila letícia luciana vanessa raquel sílvia isabel sofia souza almeida cristo jesus""".split())
# estrangeirismos que passam pelas regras acima (achados cruzando com o dicionário de inglês do mesmo repositório)
ESTRANG=set("""apartheid atelier backup bang beguine blog boar break brie bureau caddie chat chip clear clearance cocoa copyleft
copyright croissant croupier curie curry deadline dealer diesel diet doping dossier download ecstasy entourage escargot flash
funk gear glamour golf gourde gourmet hippie hobby iceberg jeans jeep ketchup laptop layout light lingerie link lobby logout
lounge mainstream marketing marquise merchandising milieu nerd netbook notebook outdoor outdoors ouzo peal pear plateau
playboy playground plush premier punk quark quire ranking roadie roadster rock rouge round router royalties royalty rush sapiens
sexy shop shopping short show skinhead soul souvenir split spray step stout surf tease telemarketing terrier tomahawk trousseau
viking voucher yang yuppie zombie mouse design online site game mail email internet videogame""".split())
fora=lambda w: bool(ESTR.search(w)) or w in NOMES or w in ESTRANG
forms=set()
dic=open(D+'index.dic',encoding='utf8').read().splitlines()[1:]
for line in dic:
    w,_,fl=line.partition('/')
    fl=fl.split()[0] if fl else ''
    if FORB in fl or NOSUG in fl: continue
    if not w or not w[0].islower() or fora(w): continue   # nomes próprios e siglas começam com maiúscula
    base=[w]+[x for x,_ in sfx(w,fl) if not ESTR.search(x)]
    for b in list(base):
        pass
    forms.update(base)
    for pw,cross in pfx(w,fl):
        if ESTR.search(pw): continue
        forms.add(pw)
        if cross:
            for x,f in sfx(pw,fl):
                if R[f][1] and not ESTR.search(x): forms.add(x)
# flexões de cada palavra pelas regras dela mesma (só sufixos, um nível): para o plural e o feminino das palavras do dia
flex={}
for line in dic:
    w,_,fl=line.partition('/')
    fl=fl.split()[0] if fl else ''
    if FORB in fl or NOSUG in fl or not w or not w[0].islower() or fora(w): continue
    fs=sorted({x for x,_ in sfx(w,fl) if re.fullmatch(r'[a-zà-üç]+',x)})
    if fs: flex.setdefault(w,set()).update(fs)
norm=lambda s: unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower()
out=sorted({norm(f) for f in forms if re.fullmatch(r'[a-zà-üç]+',f) and len(f)>=4})
open(sys.argv[2],'w').write('\n'.join(out))
if len(sys.argv)>4: open(sys.argv[4],'w').write('\n'.join(w+' '+' '.join(sorted(v)) for w,v in sorted(flex.items())))
if len(sys.argv)>3: open(sys.argv[3],'w').write('\n'.join(sorted(f for f in forms if re.fullmatch(r'[a-zà-üç]+',f) and len(f)>=4)))   # com acento (para as palavras do dia)
print(len(forms),len(out))
