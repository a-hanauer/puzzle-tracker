// Banco de palavras com pista da Cruzadinha: "PALAVRA|pista". A palavra vai sem acento
// (é assim que ela entra na grade); a pista é escrita do jeito que se lê.
// Palavras de 3 a 5 letras, do dia a dia, sem nome próprio de pessoa.
const TXT = `
ABA|Parte do boné que protege do sol
ACO|Metal da panela inox
ALA|Lado de um prédio ou de uma escola de samba
ALHO|Dente que vai no refogado
ALI|Lá, mas mais perto
AMA|Gosta muito, de coração
AMOR|Sentimento de coração
ANEL|Vai no dedo, às vezes de noivado
ANO|Doze meses
ANTA|Bicho grande do Pantanal, e xingamento de bobo
ARCO|Junto com a flecha
AREIA|Tem na praia e na ampulheta
ARMA|Revólver ou espada
ARROZ|Par do feijão
ASA|O que o avião e a xícara têm
ATO|Parte de uma peça de teatro
AULA|Hora de aprender na escola
AVE|Bicho de penas
AVO|Pai ou mãe do seu pai (com acento agudo)
AZUL|Cor do céu sem nuvens
BAR|Lugar do chope
BALA|Doce de papel colorido
BANCO|Onde se senta na praça, ou onde se guarda dinheiro
BANHO|Hora do sabonete
BARCO|Navega no rio
BEBE|Recém-nascido
BEM|O contrário do mal
BICO|Boca de passarinho
BOCA|Por onde a comida entra
BOI|Puxa o carro de boi
BOLA|Redonda, do futebol
BOLO|Doce de aniversário
BOM|Ótimo, mas um pouco menos
BOTA|Calçado que sobe pela perna
BRAVO|Zangado, irritado
BRISA|Vento leve do fim de tarde
CABO|Fio de carregar o celular
CAFE|Cafezinho, pingado, expresso
CAIXA|Embalagem de papelão
CALDO|Sopa rala, de cana ou de feijão
CAMA|Lugar de dormir
CAMPO|Onde se joga futebol
CANA|Dá garapa e cachaça
CANTO|Esquina de dentro da sala
CAPA|Proteção do livro ou do celular
CARA|Rosto, ou o "sujeito" na gíria
CARO|Que custa muito
CARRO|Tem quatro rodas e volante
CARTA|Vai no envelope
CASA|Lar, doce lar
CASO|Pode ser de polícia ou de amor
CAVA|Abre buraco na terra
CEDO|Antes da hora
CENA|Parte do filme
CERCA|Divide o pasto do vizinho
CEU|Onde ficam as nuvens
CHA|De camomila ou de boldo
CHAVE|Abre a porta
CHUVA|Água que cai das nuvens
CINCO|Dedos de uma mão
CINTO|Segura a calça
CIRCO|Lona, palhaço e trapézio
COCO|Dá água e cocada
COLA|Gruda papel
COPO|Onde se põe o suco
COR|Vermelho, azul ou verde
CORDA|De pular ou de varal
CORPO|Cabeça, tronco e membros
COSTA|Litoral
COURO|Pele de boi que vira sapato
CRUZ|Sinal de mais deitado de lado
CUBO|Dado, por exemplo
CUIA|Onde se toma chimarrão
DADO|Tem seis faces numeradas
DAMA|Rainha do baralho
DEDO|São dez nas mãos
DENTE|Vai ao dentista
DIA|Tem vinte e quatro horas
DOCE|Contrário de salgado
DONO|Proprietário
DOR|Sentida no dedo martelado
DUNA|Morro de areia
ECO|Repete o seu grito
ELO|Argola de uma corrente
ERA|Tempo longo da história
ERVA|Vai na cuia do chimarrão
ESSA|Não é esta nem aquela
FACA|Corta o pão
FADA|Tem varinha de condão
FALA|Diz em voz alta
FARO|Olfato do cão
FATO|Coisa que aconteceu de verdade
FAVO|Casinha de mel da colmeia
FEIRA|Tem pastel e caldo de cana
FERRO|Metal que enferruja
FESTA|Comemoração com bolo e música
FIGO|Fruta de doce em calda
FILA|Espera no banco
FIM|O último capítulo
FIO|Linha de costura
FITA|Laço de presente
FLOR|Rosa, margarida ou girassol
FOCA|Bicho do mar que equilibra bola
FOGO|Queima a lenha
FOLHA|Cai da árvore no outono
FORNO|Assa o pão
FOTO|Selfie, por exemplo
FRIO|Época de cachecol
FUMO|Fumaça, ou tabaco
GALO|Canta de manhã
GATO|Mia e caça rato
GELO|Água bem gelada, em cubos
GIZ|Escreve no quadro-negro
GOL|Grito da torcida
GOTA|Pingo d'água
GRAMA|Tapete verde do campo
GRANA|Dinheiro, na gíria
GRITO|Voz bem alta
GURI|Menino, no Sul
HORA|Sessenta minutos
HINO|Canta-se de pé no estádio
IDA|O contrário da volta
ILHA|Terra cercada de água
IRMA|Filha dos mesmos pais (com til)
ISCA|Vai no anzol
JACA|Fruta enorme de cheiro forte
JOGO|Partida
JUIZ|Apita o futebol
LAGO|Água parada entre as margens
LAMA|Barro molhado
LANCHE|Merenda
LATA|De refrigerante
LEAO|Rei da selva (com til)
LEITE|Vem da vaca
LEVE|Pesa pouco
LIMA|Lixa de unha, ou fruta parente do limão
LINHA|Fio de costura
LISO|Sem ondas no cabelo
LIVRO|Tem capa e páginas
LIXO|Vai para a lixeira
LOBO|Uiva para a lua
LOJA|Onde se compra
LONGE|Distante
LOUCO|Maluco
LUA|Brilha à noite
LUVA|Esquenta a mão
LUZ|Acende com o interruptor
MALA|Vai na viagem
MANGA|Fruta, ou parte da camisa
MAO|Tem cinco dedos (com til)
MAPA|Mostra o caminho
MAR|Água salgada sem fim
MATO|Vegetação sem cuidado
MEIA|Vai dentro do sapato
MEL|Doce das abelhas
MESA|Lugar do almoço
METRO|Trem subterrâneo, ou cem centímetros
MILHO|Vira pipoca
MODA|Tendência de roupa
MOLA|Faz o colchão pular
MOTO|Duas rodas e motor
MURO|Parede do quintal
NADA|Zero coisa
NARIZ|Fica no meio do rosto
NAVE|Viaja pelo espaço
NEVE|Gelo que cai do céu
NINHO|Casa do passarinho
NOITE|Depois da tarde
NOME|Como você se chama
NOTA|Dez na prova, ou dó-ré-mi
NOVE|Um a menos que dez
NOVO|Recém-saído da loja
NUVEM|Fica no céu e traz chuva
OCA|Casa indígena
OLHO|Por onde se vê
ONDA|O surfista pega
ONCA|Pintada do Pantanal (com cedilha)
ONZE|Jogadores de um time
OSSO|O cachorro enterra
OURO|Medalha de campeão
OVO|A galinha bota
PADRE|Celebra a missa
PALCO|Onde o cantor se apresenta
PALHA|Chapéu de festa junina
PANO|Tecido, ou de prato
PAPEL|Folha de escrever
PAR|Dois iguais
PARTE|Pedaço
PASTA|De dente ou de documentos
PATO|Faz quá-quá
PAZ|Pomba branca
PEDRA|Rocha pequena
PEIXE|Nada no aquário
PELE|Cobre o corpo
PENA|Pluma de ave
PERA|Fruta em forma de gota
PERNA|Junto com o pé
PESO|Mede-se na balança
PIA|Lugar de lavar a louça
PIPA|Voa presa na linha
PISTA|Onde o avião pousa
POÇO|Buraco de tirar água
PONTE|Atravessa o rio
PORCO|Vive na lama do chiqueiro
PORTA|Abre e fecha a casa
POTE|Recipiente com tampa
POVO|Gente de um país
PRAIA|Areia e mar
PRATO|Onde se serve a comida
PRETO|Cor da noite sem lua
PULO|Salto
RABO|Cachorro abana
RAIO|Faísca da tempestade
RAMO|Galho de árvore
RATO|O gato persegue
REDE|De dormir ou de pescar
REI|Usa coroa
RIO|Água que corre até o mar
RISO|Gargalhada
ROCHA|Pedra grande
RODA|Gira no carro
ROSA|Flor com espinhos
ROUPA|Vai no guarda-roupa
RUA|Tem calçada dos dois lados
SACO|De pão ou de lixo
SAIA|Roupa de baixo das meninas
SAL|Tempero que salga
SALA|Tem sofá e televisão
SAPO|Pula e coaxa
SEDE|Vontade de beber água
SELO|Vai na carta
SERRA|Montanhas em fila, ou ferramenta
SETE|Dias da semana
SINO|Toca na igreja
SOL|Estrela do nosso dia
SOM|O que o ouvido escuta
SONO|Vontade de dormir
SOPA|Comida de colher no inverno
SUCO|De laranja ou de uva
TACO|Pedaço de madeira do chão, ou de sinuca
TAMPA|Fecha a panela
TATU|Bicho de casca que cava buraco
TECLA|Aperta-se no piano
TELA|Do celular ou do pintor
TEMPO|Clima, ou relógio
TERRA|Nosso planeta
TETO|Fica acima da cabeça
TIA|Irmã da mãe
TIO|Irmão do pai
TINTA|Pinta a parede
TOCA|Casa do coelho
TORTA|Bolo recheado, ou entortada
TOURO|Bicho de chifres da arena
TREM|Anda nos trilhos (e em Minas é qualquer coisa)
TRIGO|Vira farinha
TUBO|Cano
UVA|Vira vinho
VACA|Dá leite
VALE|Entre duas montanhas
VARA|De pescar
VASO|Guarda a planta
VELA|Apaga-se no aniversário
VENTO|Ar em movimento
VERDE|Cor da esperança
VIDA|Do nascimento ao fim
VIDRO|Da janela
VINHO|Feito de uva
VOO|Viagem de avião
ZERO|Nada, em número
ABRIR|Contrário de fechar
ACASO|Coincidência
AGUA|Mata a sede (com acento)
ALTO|Contrário de baixo
AMIGO|Companheiro
ANDAR|Caminhar
ANJO|Tem asas e auréola
APITO|Instrumento do juiz
ARARA|Ave colorida que fala
ASSAR|Cozinhar no forno
ATLAS|Livro de mapas
BAILE|Festa de dança
BAIXO|Contrário de alto
BALDE|De praia ou de faxina
BEIJO|Carinho com os lábios
BICHO|Animal
BOLSA|Carrega a carteira
BRASA|Carvão em chamas do churrasco
BURRO|Animal de carga, ou quem não estuda
CALMA|Paciência, tranquilidade
CALOR|Época de ventilador
CANTA|Solta a voz
CARNE|Vai na churrasqueira
CASCA|Fica fora da fruta
CERTO|Correto
CHEFE|Quem manda no trabalho
CHUTE|Dado com o pé
CINZA|Cor do céu nublado
CLIMA|Tempo da região
COBRA|Rasteja e dá o bote
COLAR|Vai no pescoço
COMER|Almoçar ou jantar
CONTA|Chega no fim do mês
COSER|Costurar
CRAVO|Flor que brigou com a rosa
CREME|Hidratante
CUECA|Roupa de baixo
CULPA|Responsabilidade do erro
DANCA|Samba, forró ou frevo (com cedilha)
DEDAL|Protege o dedo da agulha
DOIDO|Maluco
DORMIR|Ir para a cama
ENTRE|Diga com a porta aberta
ESQUI|Desliza na neve
FALSO|Contrário de verdadeiro
FARDA|Uniforme
FEIJAO|Vai com o arroz (com til)
FERA|Bicho selvagem
FILHO|Neto do avô
FINO|Contrário de grosso
FIRME|Que não balança
FORTE|Musculoso
FRASE|Começa com maiúscula e termina em ponto
FRUTA|Banana, maçã ou uva
FUNDO|Lá embaixo
GARFO|Junto com a faca
GORDO|Contrário de magro
GRAVE|Sério, ou som de baixo
GRUPO|Turma
HOTEL|Hospedagem com recepção
IGUAL|Idêntico
JANTA|Refeição da noite
JOVEM|Moço
JUNTO|Lado a lado
LARGO|Contrário de estreito
LEGAL|Bacana
LENTO|Devagar
LETRA|A, B ou C
LIMPO|Sem sujeira
LINDO|Muito bonito
LOUSA|Quadro-negro
MAGRO|Contrário de gordo
MANSO|Calmo, que não morde
MARCA|Logotipo
MASSA|Macarrão
MEDO|Sentimento do filme de terror
MENOS|Sinal de subtração
MOEDA|Dinheiro de metal
MORRO|Elevação de terra
MUNDO|O planeta inteiro
MUSGO|Cresce na pedra úmida
NADAR|Mover-se na piscina
NEGRO|Preto
NIVEL|Grau, ou régua de pedreiro
NORTE|Para onde aponta a bússola
OBRA|Construção, ou trabalho de artista
OLHAR|Ver com atenção
ORDEM|Arrumação
PADEIRO|Faz o pão
PAGAR|Quitar a conta
PALMA|Da mão
PAPA|Mora no Vaticano
PEIXE|Vive na água
PIANO|Tem teclas pretas e brancas
PINGO|Gota
PIRES|Vai embaixo da xícara
PLANO|Projeto, ou chato
POBRE|Sem dinheiro
PORTO|Onde o navio atraca
POUCO|Contrário de muito
PRAÇA|Tem banco e pipoqueiro
PRAZO|Data de entrega
PRIMO|Filho do tio
PULGA|Coça o cachorro
QUEDA|Tombo
QUEIJO|Vai no pão de queijo
RAMPA|Subida para cadeira de rodas
RAPAZ|Moço
RAIZ|Fica embaixo da terra
RELVA|Grama
RENDA|Salário, ou tecido furadinho
RISCO|Perigo, ou traço
RITMO|Batida da música
RONCO|Barulho de quem dorme
ROSTO|Cara
SAFRA|Colheita do ano
SALTO|Pulo, ou parte do sapato
SAMBA|Dança do carnaval
SANTO|Tem auréola
SECO|Sem água
SERVO|Criado
SINAL|Semáforo
SOBRA|Resto
SOGRA|Mãe do cônjuge
SONHO|Doce de padaria ou história da noite
SORTE|Trevo de quatro folhas
SUJO|Cheio de lama
TALCO|Pó do bebê
TANGO|Dança argentina
TARDE|Depois do almoço
TEXTO|Redação
TIGRE|Gato listrado gigante
TOLO|Bobo
TOSSE|Sintoma de gripe
TRAVE|O chute bate nela
TROCA|Escambo
TURMA|Grupo de amigos
URSO|Bicho que hiberna
VAGA|Lugar para estacionar
VALSA|Dança dos quinze anos
VELHO|Antigo
VERAO|Estação do calor (com til)
VIOLA|Instrumento caipira
VIRAR|Dar a volta
VISTA|Paisagem
VIVO|Contrário de morto
VOCAL|Do cantor
VOTO|Vai na urna
ZEBRA|Listrada, e surpresa no futebol
ANTES|Contrário de depois
ARTE|Pintura, música e dança
ASAS|Do avião
ATRAS|Contrário de na frente
BALAO|Sobe com gás (com til)
BARRO|Terra molhada
BOCAS|Do fogão
CAMA|Tem lençol e travesseiro
CANOA|Barco de remo
CERA|Da vela e do ouvido
CIMA|Lá no alto
COELHO|Dá ovos de chocolate na Páscoa
COLINA|Morrinho
CORAL|Cantores, ou bicho do recife
DIETA|Regime
DUELO|Briga de dois
ESTRELA|Brilha no céu
FAROL|Luz para os navios
GENTE|Pessoas
IDADE|Anos de vida
ILHAS|Fernando de Noronha tem várias
LAPIS|Escreve e apaga
LIMAO|Fruta azeda (com til)
LOTE|Terreno
MALHA|Tecido de blusa de frio
MENTE|Cabeça, pensamento
MOLHO|De tomate na massa
NINAR|Fazer o bebê dormir
OLEO|Vai na frigideira
ORLA|Beira da praia
PALITO|De dente ou de fósforo
PERTO|Contrário de longe
PISO|Chão
POEMA|Tem versos e rimas
RAPIDO|Ligeiro
SABAO|Faz espuma (com til)
SAUDE|Bem-estar do corpo
SENHA|Abre o celular
SERRA|Corta madeira
SIRI|Caranguejo da praia
SOFA|Tem almofadas na sala
TATO|Sentido das mãos
TORRE|Peça de xadrez
TRAMA|Enredo da novela
TRILHA|Caminho no mato
VIAGEM|Tem mala e passagem
VOLTA|O contrário da ida
ABALO|Tremor de terra, ou susto forte
ABATE|Desconto no preço
ABRE|Faz a chave na fechadura
ABUSO|Exagero que passa do limite
AÇÃO|Filme de tiro e perseguição
ÁCARO|Bichinho do pó que dá alergia
ÁCIDO|Sabor do limão
ACIMA|Em cima, mais alto
ACRE|Estado de Rio Branco
AÇUDE|Represa do sertão
ADÃO|O primeiro homem, na Bíblia
ADEGA|Onde se guardam os vinhos
ADIAR|Deixar para depois
ADIDO|Funcionário de embaixada
AÉREO|Que vai pelo ar
AFETO|Carinho
AFIM|Com vontade, a fim
AFORA|Mundo ___: por aí
ÁGAPE|Banquete entre amigos
ÁGATA|Pedra das bolinhas de gude
AGIR|Fazer, tomar uma atitude
AGUDO|Som fino, ou ângulo menor que 90°
AIPIM|Mandioca, no Sul e no Rio
AJUDA|Mão amiga
ALADO|Que tem asas
ÁLAMO|Árvore alta, choupo
ÁLBUM|Livro de figurinhas ou de fotos
ALIAR|Unir forças
ALIÁS|Por falar nisso
ÁLIBI|Prova de quem estava em outro lugar
ALMA|Espírito
ALTA|Dia em que o paciente vai para casa
ALTAR|Onde o casal diz "sim"
AMADA|Querida
AMADO|Querido
ÂMAGO|O centro, a essência
AMAR|Querer muito bem
AMARO|Amargo, nome de licor
AMEBA|Ser de uma célula só
AMÉM|Fim da oração
AMENO|Clima nem quente nem frio
AMIGA|Companheira de todas as horas
AMO|Patrão, senhor
ANDA|"___ logo!", diz quem tem pressa
ANIME|Desenho animado japonês
ÂNIMO|Disposição, vontade
ANOS|Faz ___: aniversaria
ANTE|Diante de
ANTRO|Covil
ANUAL|Que acontece uma vez por ano
AONDE|Para que lugar?
APARA|Corta as pontas
APEGO|Carinho que não larga
APELO|Pedido insistente
ÁPICE|O ponto mais alto
APURO|Sufoco, aperto
ÁRABE|Língua do Marrocos e do Egito
ARADO|Puxado pelo boi na roça
ARCAR|___ com as despesas
ARDIL|Truque, armadilha
ARDOR|Calor, paixão
ÁREA|Grande ___: onde se marca pênalti
AREAL|Terreno de areia
ARENA|Estádio moderno
ARFAR|Respirar ofegante
ARO|O redondo da bicicleta
AROMA|Cheiro bom de café
ARTES|Aula de pintura e desenho, na escola
ASILO|Abrigo, refúgio
ASSIM|Deste jeito
ATA|Registro da reunião
ATADO|Amarrado
ATEAR|___ fogo
ATIVA|Vida ___: cheia de coisas para fazer
ATIVO|Que não para quieto
ÁTOMO|Partícula da matéria
ÁTONO|Sem acento tônico
ATOR|Trabalha em novela
ATUA|Faz papel na novela
ATUAR|Representar um papel
AUTOR|Quem escreveu o livro
AUTOS|Processo no fórum
AVARO|Pão-duro
AVIAR|Preparar a receita, na farmácia
AVISO|Recado no mural
AXILA|Sovaco
BANCA|Onde se compra jornal
BANIR|Expulsar para sempre
BASE|Maquiagem que vai antes de tudo
BATA|Blusa larga e leve
BATE|O coração ___ forte
BATER|Fazer o bolo na batedeira
BATOM|Vai nos lábios
BEATO|Muito de igreja
BEBER|Matar a sede
BENS|Casa, carro e outros patrimônios
BERÇO|Cama de bebê
BERRO|Grito alto
BESTA|Bobo, ou animal de carga
BIT|Menor unidade de informação
BOATE|Lugar para dançar à noite
BORDO|A ___: dentro do avião
BORRA|O que sobra no fundo da xícara de café
BOTAR|Pôr
BRAÇO|Vai do ombro à mão
BREGA|Cafona
BRIGA|Discussão feia
BRUMA|Névoa
BUCAL|Da boca: higiene ___
BURLA|Fraude, golpe
CABAL|Completo, perfeito
CABER|Entrar no espaço
CABRA|Mãe do cabrito
CADÊ|Onde está?
CAIR|Levar um tombo
CANIL|Casa de cachorros
CÃO|Cachorro
CAOS|Bagunça total
CARMA|Destino feito pelas ações
CEDRO|Árvore da bandeira do Líbano
CEM|Dez vezes dez
CENTO|Cem unidades, como de salgadinhos
CERNE|O miolo da madeira
CERTA|Correta
CESTO|Cesta de roupa suja
CETRO|Bastão do rei
CISÃO|Divisão, racha
CITA|Menciona
CITAR|Mencionar a fonte
COISA|Troço, negócio
COMA|Sono profundo do hospital
COMUM|Normal, corriqueiro
CORJA|Bando de gente ruim
COROA|Vai na cabeça do rei
CRIME|Caso de polícia
CRISE|Momento difícil
CROMO|Metal brilhante do para-choque antigo
CUPOM|Código de desconto
CURA|O fim da doença
DEMÃO|Cada camada de tinta
DITAR|Ler em voz alta para alguém escrever
EIXO|Liga as rodas do carro
ELITE|Os de cima
ENFIM|Finalmente!
ENTÃO|E aí?
ÉPOCA|Tempo, era
ERRAR|Cometer um engano
ERRO|Engano
ESTAR|Ficar, permanecer
ÉTICA|Conduta correta
ÉTICO|Que age certo
ETNIA|Povo, grupo de origem comum
EXATO|Preciso, certinho
FALIR|Quebrar a empresa
FATOR|Cada número da multiplicação
FECHO|Zíper
FÊMEA|A vaca, para o boi
FITAR|Olhar fixo
FOFA|Macia, ou fofinha
FOR|Se ___ chover, fico em casa
FORÇA|O que o halterofilista tem
FORMA|Assadeira de bolo
FÚTIL|Sem importância
GALHO|Braço de árvore
GANSO|Ave que guarda quintal
GERA|Produz
GRIFO|Bicho mitológico, meio águia, meio leão
HARÉM|Mulheres do sultão
ÍCONE|Desenho do aplicativo na tela
IMUNE|Protegido pela vacina
INATO|De nascença
INOX|Aço da pia
INVÉS|Ao ___ de: em lugar de
IRADO|Muito bravo, ou muito legal (gíria)
ITEM|Cada coisa da lista
LADO|Esquerdo ou direito
LAGOA|Pequeno lago
LAR|Doce ___
LATIM|Língua dos romanos
LEAL|Fiel
LEBRE|Parente do coelho
LER|Passar os olhos no livro
LIAME|Ligação, vínculo
LIÇÃO|Dever de casa
LIDAR|Saber ___ com o problema
LIGAR|Telefonar
LINDA|Muito bonita
LOCAL|Lugar, ponto
LUGAR|Espaço, posto
LUTA|Briga de ringue
LUTAR|Batalhar
MACA|Cama de ambulância
MÃE|Quem te deu à luz
MÁGOA|Tristeza guardada
MAIOR|O contrário de menor
MAJOR|Patente acima do capitão
MAL|O contrário do bem
MAMÃO|Fruta laranja do café da manhã
MANCO|Que puxa da perna
MANDA|Quem ___ aqui sou eu
MATAR|___ a saudade
MATE|Chá do Sul, ou xeque do xadrez
MAU|Vilão
MENU|Cardápio
MERA|___ coincidência
MERO|Simples, ou peixe grande do litoral
METER|Enfiar
MEUS|Não são seus, são ___
MIRAR|Fazer pontaria
MIRRA|Presente dos Reis Magos, com ouro e incenso
MOITA|Arbusto onde alguém se esconde
MORA|Fruta preta do mato
MORAL|A lição da fábula
MORAR|Viver numa casa
MOTIM|Rebelião
MÓVEL|Mesa, cadeira ou armário
MOVER|Tirar do lugar
MURRO|Soco
NENÉM|Bebê
NERD|Estudioso, CDF
NOEL|Papai ___
NOVOS|O contrário de velhos
OÁSIS|Água no meio do deserto
ÓBITO|Morte, no atestado
OBTER|Conseguir
OCASO|Pôr do sol
ÓDIO|O contrário do amor
OITO|Sete mais um
OLHA|"___ só!", diz quem se espanta
ÔMEGA|Última letra grega
ONTEM|O dia antes de hoje
OPACO|Que não deixa passar luz
OPALA|Pedra preciosa e carro antigo da Chevrolet
ÓPERA|Teatro todo cantado
ORAL|Prova falada
ORAR|Rezar
ORIXÁ|Divindade do candomblé
ORNAR|Enfeitar
OSSOS|Formam o esqueleto
ÓTICA|Loja de óculos
ÓTICO|Nervo do olho
ÓTIMO|Muito bom
OTITE|Dor de ouvido
OUTRO|Mais um, diferente
OXALÁ|Tomara!
PAI|Dia dos ___: agosto
PAÍS|Brasil, Chile ou Japão
PAJEM|Menino que leva as alianças
PÃO|Francês, de forma ou de queijo
PEÇA|Parte do quebra-cabeça
PECAR|Cometer um pecado
PEDIR|Fazer um pedido
PELAR|Tirar a pele do tomate
PENAL|Código ___: o das leis criminais
PERU|Ave do Natal
PICHE|Asfalto preto e grudento
PILAR|Coluna que sustenta
PINHO|Madeira do pinheiro
PLUMA|Pena leve
POP|Música de paradas
PORÉM|Mas, contudo
POTRO|Filhote de cavalo
PRESA|Bicho caçado
PRETA|Cor da noite
PROL|Em ___ de: a favor de
PROLE|Os filhos
PURA|Água ___: sem mistura
RAÇA|Vira-lata não tem
RACHA|Fenda, ou pelada de fim de semana
RADAR|Pardal da estrada
RAIVA|Fúria
RALAR|Passar o queijo no ralador
RAMAL|Número interno do telefone
RAP|Música falada com rima
RARO|Difícil de achar
REAL|Moeda do Brasil
RECÉM|___-nascido
RECUO|Passo para trás
REGER|Comandar a orquestra
REIS|Dia de ___: 6 de janeiro
RELER|Ler de novo
RENAL|Do rim
RENTE|Bem junto, colado
RESMA|Pacote de 500 folhas
RETER|Segurar, prender
REVER|Ver de novo
RICA|Cheia de dinheiro
RICO|Milionário
RIMAR|Combinar o som do fim dos versos
RÍMEL|Maquiagem dos cílios
RIR|Achar graça
RIVAL|Adversário
ROÇAR|Encostar de leve
ROGAR|Suplicar
ROLA|A bola ___ no gramado
ROLO|Confusão, ou de macarrão
RONDA|Volta do vigia
ROSCA|Pão doce em forma de anel
RUIM|O contrário de bom
RUÍNA|O que sobrou do castelo
RUSSO|Língua de Moscou
SABER|Conhecer
SABOR|Gosto
SABRE|Espada curva
SAGA|História longa de família
SAÍDA|Porta para fora
SAIR|Ir para a rua
SANTA|Santa Catarina, ou ___ Ceia
SARA|Cicatriza
SARAR|Ficar bom
SARRO|Tirar ___: zoar
SEARA|Plantação, campo
SECA|Falta de chuva
SECAR|Tirar a água
SEDA|Tecido fino dos chineses
SEGAR|Ceifar
SELIM|Banco da bicicleta
SENA|Mega-___: loteria
SENÃO|Caso contrário
SENIL|Da velhice
SENSO|Bom ___
SEPTO|Separa as narinas
SESTA|Soneca depois do almoço
SIFÃO|Cano curvo da pia
SOGRO|Pai da esposa
SOLO|Terra, chão
SOLTO|Livre
SOMA|Resultado da adição
SOMAR|Fazer a conta de mais
SONSO|Que se faz de bobo
SUÍÇA|País do chocolate e dos relógios
SUÍNO|Porco
SUL|Onde fica Porto Alegre
SUOR|Molha a camiseta no calor
SURRA|Goleada, ou sova
SUTIÃ|Peça íntima feminina
TAÇA|Copo de vinho
TAIGA|Floresta fria do norte
TAL|Que ___?
TAPIR|Anta
TASCA|Boteco português
TÁTIL|Do toque
TAXA|Tarifa
TELHA|Cobre a casa
TEOR|Conteúdo, porcentagem
TERÇA|Dia depois da segunda
TERMO|Palavra, vocábulo
TESE|Trabalho de doutorado
TIMÃO|O Corinthians, para a torcida
TOA|À ___: sem rumo
TOCAR|Encostar, ou fazer música
TOPO|O alto da montanha
TOTAL|Soma final
TURNÊ|Série de shows pelo país
ÚNICO|Só ele
UNIDO|Junto
UNIR|Juntar
URDIR|Tramar
URUBU|Ave preta que é mascote do Flamengo
USAR|Utilizar
USO|De ___ pessoal
USURA|Juros abusivos
ÚTIL|Que serve
VÃO|Espaço vazio
VARAR|Atravessar, como a noite em claro
VARIA|Muda, oscila
VEIO|Chegou, ou filão de ouro
VIGOR|Força, energia
VILA|Pequeno povoado
VIRIL|Másculo
VISAR|Ter como alvo
VITAL|Essencial à vida
VOAR|O que o passarinho faz
UNHA|Pinta-se na manicure
ZOO|Lugar dos bichos na cidade
VOZ|O que o cantor usa
NOZ|Fruto seco do Natal
OLÁ|Oi, mais formal
OBA|"___! Que bom!"
ALÔ|Primeira palavra ao telefone
ATÉ|"___ logo!"
BOA|Cobra grande, ou coisa ___
BIS|"Mais um!", depois do show
BUM|Barulho de explosão
CAL|Pó branco da caiação
CAI|A folha ___ no outono
COM|Café ___ leite
DAR|Presentear
DEU|"___ certo!"
DEZ|Nota máxima na escola
DOM|Talento de nascença
DUO|Dupla que canta junto
EGO|O eu, que às vezes infla
ELA|Pronome da moça
FEZ|Chapéu turco
FAX|Mandava papel pelo telefone
GÁS|Vem no botijão
ÍMÃ|Gruda na porta da geladeira
LEI|Regra que todo mundo deve seguir
MAS|Porém
MEU|Não é seu, é ___
MIL|Dez vezes cem
MÊS|Trinta dias, mais ou menos
NEM|"___ pensar!"
NÓS|Eu e você
ODE|Poema de louvor
ORA|"___ bolas!"
PAU|Pedaço de madeira
PIO|Som do pintinho
POR|"___ favor"
RÉU|Acusado no tribunal
ROL|Lista, relação
RUM|Bebida dos piratas
SAI|Entra e ___
SEM|Café ___ açúcar
SER|Ser ou não ___
SEU|Não é meu, é ___
SUA|Transpira no calor
TOM|Altura da nota musical
TRÊS|Número do trevo de folhas
UNO|Jogo de cartas coloridas
VAI|___ e volta
VER|Enxergar
VEZ|Era uma ___
VIA|Caminho, rua
XIS|Sanduíche gaúcho
ZAP|WhatsApp, para os íntimos
ZEN|Calmo, tranquilo
EMA|Ave grande do cerrado
IRA|Fúria
NAU|Navio antigo
SIM|O contrário de não
NÃO|O contrário de sim
LIS|Flor-de-___
OLÉ|Grito da torcida no drible
TCHAU|Até logo, informal
ARO|Argola, anel
ARO|Pneu de bicicleta vai nele
MÃO|Tem cinco dedos
MÃO|___ de tinta: cada camada
ALA|Parte do hospital: ___ infantil
PÃO|O de queijo é mineiro
PÃO|Vem da padaria quentinho
SOL|Estrela do nosso dia
SOL|Nota musical depois do fá
LAR|Casa, onde mora a família
ASA|Alça da xícara
RAP|Hip-hop falado
MAR|Água salgada sem fim
MAR|Onde o rio deságua
PAR|Dupla, como de sapatos
PAR|Número que se divide por dois
ANO|Tem 365 dias
ANO|Passa no réveillon
ATO|Ação, gesto
ELO|Argola da corrente
ERA|Época, tempo
ERA|"___ uma vez..."
FIO|De cabelo, ou de luz
IDA|A ___ e a volta
LUA|Cheia, nova ou minguante
LUZ|Acende com o interruptor
MEL|Feito pelas abelhas
OVO|A galinha bota
PAZ|O contrário de guerra
PIA|Lugar de lavar a louça
REI|Peça mais importante do xadrez
RIO|Corre para o mar
RUA|Endereço tem nome dela
SAL|Tempero da comida
SOM|O que o ouvido escuta
TIA|Irmã da mãe
TIO|Irmão do pai
UVA|Fruta do vinho
VOO|Viagem de avião
DIA|Vinte e quatro horas
COR|Azul, verde ou amarelo
DOR|Sinal de que algo machuca
CÉU|Onde ficam as nuvens
CHÁ|Bebida de saquinho
GOL|Grito da torcida
GIZ|Escreve no quadro-negro
BOI|Puxa o carro de boi
BEM|O contrário de mal
ECO|O som que volta
FIM|O ponto final da história
OCA|Casa indígena
AVE|Tem penas e bico
AVÓ|Mãe da mãe
ABA|Borda do chapéu
ALI|Naquele lugar
AMA|Babá de antigamente
AÇO|Ferro bem forte
BAR|Boteco
BOM|O contrário de ruim
`;

const norm = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "").toUpperCase();
// uma palavra pode ter mais de uma pista (linhas repetidas); o gerador sorteia uma por dia
export const PISTAS = new Map();
for (const l of TXT.trim().split("\n")) {
  const [w, p] = l.split("|");
  const k = norm(w);
  if (k.length < 3 || k.length > 5 || !p) continue;
  const txt = p.replace(/\s*\(com [^)]*\)/, "").trim();
  if (!PISTAS.has(k)) PISTAS.set(k, []);
  if (!PISTAS.get(k).includes(txt)) PISTAS.get(k).push(txt);
}
