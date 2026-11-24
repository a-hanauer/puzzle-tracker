# Frequência de uso de cada palavra do dia do Gerânio (geranio/uso.json), para o gerador medir o vocabulário de cada flor:
# segunda = flores de palavras muito usadas … domingo = flores com mais palavras menos usadas (todas ainda de uso corrente).
# Valor = icf do fserb/pt-br (quanto maior, menos usada; ≈ 6 para "casa", ≈ 13 para "anta"); sem dado = 14.
# Uso: python3 geranio/uso.py <arquivo icf do fserb/pt-br> (depois de verbetes.py; o gerador lê uso.json)
import sys, json, os, unicodedata
norm = lambda s: unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
aqui = os.path.dirname(os.path.abspath(__file__))
v = json.load(open(os.path.join(aqui, 'verbetes.json'), encoding='utf8'))
icf = {}
for l in open(sys.argv[1], encoding='utf8'):
    w, _, x = l.strip().partition(',')
    try: icf.setdefault(norm(w), float(x))
    except ValueError: pass
uso = {k: round(min(icf.get(k, 14), 14), 1) for k in v}
json.dump(uso, open(os.path.join(aqui, 'uso.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print(len(uso), 'palavras;', sum(1 for k in v if k not in icf), 'sem frequência (contam como 14)')
