// Temas novos do Cordel (21/10/2026): áreas que faltavam no acervo e temas de outro feitio.
// Cada entrada: { a: área (rodízio), f: família (não repetir parecidos em dias próximos), c: [pista, CHAVE], w: palavras }.
// Palavras de 4 a 10 letras depois de tirar acentos e espaços; a chave toca dois lados opostos (6 letras ou mais).
export const NOVOS = [
  // ===================== arquitetura e design =====================
  { a: "arquitetura", f: "classica", c: ["Templo grego", "COLUNATA"], w: ["capitel", "frontão", "friso", "fuste", "arquitrave", "cornija", "dórica", "jônica", "coríntia", "pórtico", "métopa", "tríglifo", "entablamento", "base"] },
  { a: "arquitetura", f: "catedral", c: ["Catedral gótica", "VITRAIS"], w: ["rosácea", "abóbada", "nave", "transepto", "gárgula", "pináculo", "arcobotante", "ogiva", "altar", "abside", "claustro", "campanário", "cripta"] },
  { a: "arquitetura", f: "casa", c: ["Casarão colonial", "SOBRADO"], w: ["beiral", "taipa", "muxarabi", "alpendre", "varanda", "telhado", "sacada", "senzala", "capela", "pátio", "azulejo", "janela", "porão", "cumeeira"] },
  { a: "arquitetura", f: "modernismo", c: ["Concreto e curvas", "NIEMEYER"], w: ["pilotis", "rampa", "cúpula", "marquise", "pampulha", "alvorada", "planalto", "catedral", "copan", "laje", "brise", "vidro"] },
  { a: "design", f: "tipografia", c: ["Caixa alta, caixa baixa", "TIPOGRAFIA"], w: ["serifa", "kerning", "itálico", "negrito", "versalete", "ligadura", "fonte", "corpo", "entrelinha", "garamond", "helvetica", "bodoni", "futura", "glifo"] },
  { a: "design", f: "cores", c: ["Círculo cromático", "PIGMENTOS"], w: ["ocre", "siena", "carmim", "anil", "cobalto", "ciano", "magenta", "sépia", "terracota", "turquesa", "vermelhão", "marfim", "grafite"] },

  // ===================== moda, ofícios, artesanato =====================
  { a: "moda", f: "tecidos", c: ["Na loja de tecidos", "TECELAGEM"], w: ["linho", "seda", "cetim", "veludo", "tafetá", "organza", "brim", "chita", "tricoline", "cambraia", "gabardine", "tule", "flanela", "jérsei", "crepe"] },
  { a: "moda", f: "costura", c: ["Ateliê de costura", "ALFAIATE"], w: ["agulha", "dedal", "carretel", "molde", "bainha", "pesponto", "alinhavo", "tesoura", "fita métrica", "botão", "casa", "pence", "manequim", "overloque"] },
  { a: "moda", f: "roupa", c: ["Guarda-roupa de época", "ESPARTILHO"], w: ["crinolina", "anágua", "corpete", "polaina", "fraque", "cartola", "gibão", "capa", "luva", "leque", "sobrecasaca", "bengala", "monóculo", "peruca"] },
  { a: "oficios", f: "ceramica", c: ["Roda de oleiro", "CERAMICA"], w: ["argila", "barro", "forno", "esmalte", "engobe", "torno", "biscoito", "queima", "vidrado", "moringa", "porcelana", "faiança", "alguidar", "talha"] },
  { a: "oficios", f: "madeira", c: ["Na marcenaria", "MARCENEIRO"], w: ["formão", "plaina", "grosa", "serrote", "esquadro", "verniz", "encaixe", "cavilha", "torno", "lixa", "goiva", "sargento", "cupim", "ripa"] },
  { a: "oficios", f: "joias", c: ["Pedras preciosas", "LAPIDACAO"], w: ["diamante", "esmeralda", "rubi", "safira", "topázio", "ametista", "turmalina", "água-marinha", "opala", "granada", "quartzo", "ágata", "citrino", "jade"] },
  { a: "oficios", f: "perfume", c: ["Frasco de perfume", "FRAGRANCIA"], w: ["almíscar", "âmbar", "baunilha", "vetiver", "sândalo", "patchouli", "bergamota", "jasmim", "lavanda", "neroli", "cedro", "íris", "fava tonka", "mirra"] },
  { a: "oficios", f: "relogio", c: ["Relojoaria", "PONTEIROS"], w: ["mostrador", "corda", "pêndulo", "engrenagem", "rubi", "cuco", "ampulheta", "quartzo", "coroa", "pulseira", "cronógrafo", "mola", "algarismo", "sineta"] },

  // ===================== artes cênicas, dança, circo =====================
  { a: "teatro", f: "palco", c: ["Atrás da coxia", "BASTIDORES"], w: ["camarim", "proscênio", "ribalta", "cortina", "plateia", "cenário", "figurino", "ensaio", "contrarregra", "ponto", "urdimento", "refletor", "elenco", "estreia"] },
  { a: "teatro", f: "grego", c: ["Tragédia grega", "CATARSE"], w: ["coro", "máscara", "orquestra", "anfiteatro", "édipo", "antígona", "medeia", "electra", "ésquilo", "sófocles", "eurípides", "prólogo", "epílogo", "destino"] },
  { a: "teatro", f: "commedia", c: ["Commedia dell'arte", "ARLEQUIM"], w: ["colombina", "pierrô", "pantaleão", "polichinelo", "briguela", "doutor", "capitão", "zanni", "máscara", "lazzi", "improviso", "feira", "carroça"] },
  { a: "danca", f: "bale", c: ["Ponta de sapatilha", "BAILARINA"], w: ["pirouette", "plié", "jeté", "arabesque", "grand jeté", "tutu", "barra", "collant", "coreógrafo", "solista", "corps", "pas de deux", "giselle", "coppélia"] },
  { a: "danca", f: "salao", c: ["Baile de salão", "DANCARINOS"], w: ["tango", "valsa", "bolero", "salsa", "foxtrote", "zouk", "forró", "samba", "rumba", "maxixe", "lambada", "merengue", "chachachá", "gafieira"] },
  { a: "circo", f: "circo", c: ["Debaixo da lona", "PICADEIRO"], w: ["palhaço", "trapézio", "malabares", "equilibrista", "mágico", "acrobata", "contorcionista", "domador", "pirueta", "perna de pau", "lona", "rede", "mestre", "cambalhota"] },
  { a: "circo", f: "magica", c: ["Truque na manga", "ILUSIONISTA"], w: ["cartola", "varinha", "coelho", "baralho", "lenço", "levitação", "hipnose", "serrote", "algema", "fuga", "houdini", "assistente", "cortina", "pombo"] },

  // ===================== cinema, fotografia, quadrinhos =====================
  { a: "fotografia", f: "foto", c: ["Câmara escura", "FOTOGRAFIA"], w: ["obturador", "diafragma", "lente", "foco", "flash", "negativo", "revelador", "tripé", "zoom", "grão", "exposição", "retrato", "polaroide", "daguerreótipo", "slide"] },
  { a: "cinema", f: "cinemabr", c: ["Uma câmera na mão", "CINEMANOVO"], w: ["glauber", "macunaíma", "terra em transe", "vidas secas", "deus e o diabo", "nelson", "ruy guerra", "cacá", "leon", "joaquim pedro", "sertão", "favela"] },
  { a: "cinema", f: "genero", c: ["Gêneros de cinema", "BILHETERIA"], w: ["faroeste", "comédia", "musical", "terror", "suspense", "drama", "noir", "documentário", "animação", "aventura", "romance", "ficção", "épico", "chanchada"] },
  { a: "quadrinhos", f: "hq", c: ["Nona arte", "QUADRINHOS"], w: ["balão", "onomatopeia", "requadro", "sarjeta", "tirinha", "mangá", "gibi", "roteirista", "arte-final", "colorista", "splash", "almanaque", "fanzine", "charge"] },

  // ===================== música (sem repetir orquestra) =====================
  { a: "musica", f: "sopro", c: ["Quinteto de sopros", "PALHETAS"], w: ["flauta", "oboé", "clarinete", "fagote", "trompa", "saxofone", "trompete", "trombone", "tuba", "flautim", "corne", "piston", "gaita", "bocal"] },
  { a: "musica", f: "choro", c: ["Roda de choro", "CHORINHO"], w: ["pixinguinha", "cavaquinho", "bandolim", "pandeiro", "flauta", "violão", "carinhoso", "jacob", "waldir", "chiquinha", "nazareth", "maxixe", "regional", "polca"] },
  { a: "musica", f: "nordeste", c: ["Forró pé de serra", "SANFONEIRO"], w: ["zabumba", "triângulo", "xote", "baião", "xaxado", "arrasta-pé", "gonzagão", "asa branca", "fole", "chamego", "dominguinhos", "marinês", "quadrilha", "sertão"] },
  { a: "musica", f: "teoria", c: ["Aula de harmonia", "ACORDES"], w: ["tônica", "dominante", "terça", "quinta", "oitava", "acidente", "bemol", "sustenido", "escala", "arpejo", "cadência", "intervalo", "modulação", "fermata", "pausa"] },
  { a: "musica", f: "mpbcantora", c: ["Vozes do Brasil", "CANTORAS"], w: ["elis", "gal", "bethânia", "nara", "clara nunes", "marisa", "elza", "alcione", "simone", "rita lee", "dalva", "ângela", "cássia", "zizi", "maysa"] },

  // ===================== literatura =====================
  { a: "literatura", f: "portugal", c: ["Além-mar", "LUSITANOS"], w: ["camões", "pessoa", "saramago", "eça", "garrett", "bocage", "florbela", "herculano", "lobo antunes", "sophia", "cesário", "antero", "vieira", "gil vicente"] },
  { a: "literatura", f: "latino", c: ["Boom latino-americano", "REALISMO"], w: ["gabo", "cortázar", "borges", "neruda", "vargas llosa", "fuentes", "rulfo", "onetti", "allende", "macondo", "aleph", "pedro páramo", "isabel", "galeano"] },
  { a: "literatura", f: "modernismo22", c: ["Semana de 22", "ANTROPOFAGIA"], w: ["oswald", "mário", "tarsila", "anita", "menotti", "bandeira", "macunaíma", "abaporu", "manifesto", "pau-brasil", "klaxon", "villa-lobos", "municipal", "brecheret"] },
  { a: "literatura", f: "verso", c: ["Métrica e rima", "VERSIFICAR"], w: ["soneto", "quadra", "terceto", "estrofe", "redondilha", "decassílabo", "alexandrino", "haicai", "ode", "elegia", "balada", "rondó", "trova", "cordel", "glosa"] },
  { a: "literatura", f: "personagem", c: ["Personagens inesquecíveis", "PROTAGONISTA"], w: ["capitu", "bentinho", "quixote", "sancho", "hamlet", "macabéa", "riobaldo", "diadorim", "emma", "gregor", "ahab", "gatsby", "alice", "bovary", "fabiano"] },
  { a: "literatura", f: "infantojuvenil", c: ["Sítio do Picapau Amarelo", "LOBATO"], w: ["emília", "narizinho", "pedrinho", "visconde", "rabicó", "cuca", "saci", "anastácia", "benta", "quindim", "conselheiro", "marquês", "sabugo", "reinações"] },

  // ===================== pintura e escultura =====================
  { a: "artes", f: "pintorbr", c: ["Pincéis brasileiros", "PINACOTECA"], w: ["portinari", "tarsila", "anita", "di cavalcanti", "volpi", "djanira", "guignard", "segall", "pedro américo", "almeida júnior", "debret", "tomie", "ismael nery", "lygia"] },
  { a: "artes", f: "barroco", c: ["Luz e sombra", "CLAROESCURO"], w: ["caravaggio", "rembrandt", "vermeer", "rubens", "velázquez", "bernini", "borromini", "zurbarán", "ribera", "murillo", "gentileschi", "tenebrismo", "putti", "voluta"] },
  { a: "artes", f: "escultura", c: ["Bloco de mármore", "ESCULTURA"], w: ["cinzel", "malho", "bronze", "fundição", "relevo", "busto", "estátua", "pedestal", "rodin", "michelangelo", "brecheret", "camille", "giacometti", "modelagem", "argila"] },
  { a: "artes", f: "tecnica", c: ["Caixa de tintas", "AQUARELA"], w: ["guache", "têmpera", "afresco", "acrílica", "pastel", "nanquim", "carvão", "óleo", "encáustica", "xilogravura", "litografia", "gravura", "mosaico", "colagem"] },

  // ===================== ciência e natureza =====================
  { a: "ciencia", f: "botanica", c: ["Anatomia da flor", "BOTANICA"], w: ["pétala", "sépala", "estame", "pistilo", "pólen", "ovário", "antera", "estigma", "corola", "cálice", "néctar", "semente", "caule", "clorofila", "seiva"] },
  { a: "ciencia", f: "arvorebr", c: ["Árvores do Brasil", "FRONDOSAS"], w: ["pau-brasil", "ipê", "jequitibá", "araucária", "jacarandá", "peroba", "aroeira", "sapucaia", "cedro", "jatobá", "angico", "baobá", "paineira", "castanheira", "embaúba"] },
  { a: "ciencia", f: "oceano", c: ["Fundo do mar", "OCEANOGRAFIA"], w: ["coral", "plâncton", "abissal", "fossa", "dorsal", "maré", "corrente", "salinidade", "talude", "recife", "krill", "lula", "polvo", "medusa", "anêmona"] },
  { a: "ciencia", f: "clima", c: ["Previsão do tempo", "METEOROLOGIA"], w: ["frente fria", "ciclone", "anticiclone", "umidade", "pressão", "isóbara", "cúmulo", "cirro", "estrato", "orvalho", "geada", "monção", "el niño", "furacão", "tornado"] },
  { a: "ciencia", f: "minerais", c: ["Gaveta de mineralogia", "MINERAIS"], w: ["talco", "gipsita", "calcita", "fluorita", "apatita", "ortoclásio", "quartzo", "topázio", "coríndon", "diamante", "mica", "pirita", "feldspato", "galena"] },
  { a: "ciencia", f: "evolucao", c: ["A bordo do Beagle", "EVOLUCAO"], w: ["darwin", "galápagos", "tentilhões", "seleção", "adaptação", "espécie", "fóssil", "mutação", "ancestral", "wallace", "lamarck", "mendel", "nicho", "tartaruga"] },
  { a: "ciencia", f: "dinossauro", c: ["Era Mesozoica", "DINOSSAUROS"], w: ["triássico", "jurássico", "cretáceo", "tiranossauro", "velocirraptor", "estegossauro", "tricerátopo", "braquiossauro", "pterossauro", "fóssil", "meteoro", "paleontólogo", "âmbar", "garra", "ovos", "ninho", "pegada", "presa", "crista", "cauda", "réptil", "extinção"] },
  { a: "ciencia", f: "celula", c: ["Dentro da célula", "ORGANELAS"], w: ["núcleo", "membrana", "citoplasma", "ribossomo", "mitocôndria", "lisossomo", "vacúolo", "cloroplasto", "centríolo", "golgi", "retículo", "cromossomo", "parede", "flagelo"] },
  { a: "ciencia", f: "ondas", c: ["Espectro eletromagnético", "RADIACAO"], w: ["rádio", "micro-ondas", "infravermelho", "visível", "ultravioleta", "raio x", "gama", "frequência", "comprimento", "fóton", "laser", "prisma", "arco-íris", "amplitude"] },
  { a: "ciencia", f: "matematica2", c: ["Figuras no espaço", "GEOMETRIA"], w: ["cubo", "esfera", "cone", "cilindro", "pirâmide", "prisma", "tetraedro", "octaedro", "toro", "vértice", "aresta", "face", "diagonal", "poliedro", "hélice"] },
  { a: "ciencia", f: "numeros", c: ["Números famosos", "CONSTANTES"], w: ["pi", "euler", "áureo", "primo", "perfeito", "infinito", "zero", "googol", "imaginário", "fibonacci", "avogadro", "planck", "dízima", "fatorial", "raiz"] },
  { a: "ciencia", f: "medicina", c: ["Plantão no pronto-socorro", "EMERGENCIA"], w: ["sutura", "curativo", "soro", "maca", "triagem", "tomografia", "raio x", "gesso", "tala", "plantão", "bisturi", "anestesia", "pulso", "oxigênio", "sirene"] },
  { a: "ciencia", f: "vacina", c: ["Pioneiros da saúde", "VACINACAO"], w: ["jenner", "pasteur", "sabin", "salk", "fleming", "koch", "snow", "lister", "nightingale", "oswaldo", "chagas", "penicilina", "varíola", "antídoto"] },

  // ===================== espaço =====================
  { a: "espaco", f: "missoes", c: ["Corrida espacial", "ASTRONAUTA"], w: ["sputnik", "gagarin", "apollo", "armstrong", "laika", "soyuz", "vostok", "gemini", "hubble", "voyager", "módulo", "foguete", "órbita", "pontes", "tereshkova"] },
  { a: "espaco", f: "planetas", c: ["Vizinhança do Sol", "PLANETARIO"], w: ["mercúrio", "vênus", "terra", "marte", "júpiter", "saturno", "urano", "netuno", "plutão", "ceres", "anéis", "cinturão", "órbita", "eclipse", "afélio"] },

  // ===================== geografia =====================
  { a: "geografia", f: "biomas", c: ["Biomas brasileiros", "ECOSSISTEMA"], w: ["amazônia", "cerrado", "caatinga", "pantanal", "pampa", "mata atlântica", "restinga", "mangue", "vereda", "babaçu", "campina", "várzea", "igapó", "chapada"] },
  { a: "geografia", f: "desertos", c: ["Mar de areia", "DESERTOS"], w: ["saara", "atacama", "gobi", "kalahari", "namibe", "sonora", "mojave", "arábia", "taklamakan", "duna", "oásis", "caravana", "miragem", "camelo", "siroco"] },
  { a: "geografia", f: "capitaisam", c: ["Capitais das Américas", "HEMISFERIO"], w: ["lima", "quito", "bogotá", "caracas", "santiago", "assunção", "montevidéu", "la paz", "havana", "panamá", "ottawa", "manágua", "kingston", "brasília"] },
  { a: "geografia", f: "estadosbr", c: ["Capitais do Brasil", "FEDERACAO"], w: ["manaus", "belém", "macapá", "palmas", "teresina", "natal", "recife", "maceió", "aracaju", "salvador", "vitória", "goiânia", "cuiabá", "curitiba", "florianópolis"] },
  { a: "geografia", f: "litoral", c: ["Acidentes do litoral", "LITORANEO"], w: ["baía", "enseada", "golfo", "istmo", "península", "cabo", "fiorde", "restinga", "laguna", "estuário", "delta", "falésia", "recife", "atol", "estreito"] },
  { a: "geografia", f: "rioscidades", c: ["Cada rio, sua cidade", "AFLUENTES"], w: ["sena", "tâmisa", "tibre", "danúbio", "reno", "volga", "nilo", "ganges", "hudson", "prata", "tejo", "douro", "guaíba", "capibaribe", "tietê"] },
  { a: "geografia", f: "patrimonio", c: ["Patrimônio da humanidade", "TOMBAMENTO"], w: ["ouro preto", "olinda", "diamantina", "goiás", "paraty", "missões", "pelourinho", "brasília", "iguaçu", "fernando de noronha", "valongo", "congonhas", "capivara", "pampulha"] },

  // ===================== história =====================
  { a: "historia", f: "brcolonia", c: ["Brasil Colônia", "CAPITANIAS"], w: ["cabral", "jesuítas", "anchieta", "nóbrega", "engenho", "bandeirante", "quilombo", "palmares", "zumbi", "tordesilhas", "sesmaria", "ciclo do ouro", "tiradentes", "inconfidência"] },
  { a: "historia", f: "brrepublica", c: ["República Velha", "CAFECOMLEITE"], w: ["coronel", "canudos", "contestado", "vacina", "chibata", "tenentismo", "oligarquia", "voto", "cabresto", "deodoro", "floriano", "prudente", "campos sales", "rodrigues alves"] },
  { a: "historia", f: "antiguidade", c: ["Mesopotâmia", "CUNEIFORME"], w: ["suméria", "babilônia", "assíria", "hamurabi", "zigurate", "gilgamesh", "eufrates", "tigre", "ur", "nínive", "acádia", "tabuinha", "escriba", "jardins suspensos"] },
  { a: "historia", f: "grecia", c: ["Atenas clássica", "DEMOCRACIA"], w: ["ágora", "acrópole", "partenon", "péricles", "sólon", "clístenes", "pnyx", "ostracismo", "hoplita", "esparta", "maratona", "termópilas", "salamina", "trirreme"] },
  { a: "historia", f: "medieval2", c: ["Castelo medieval", "FORTALEZA"], w: ["fosso", "ameia", "torre", "muralha", "ponte levadiça", "masmorra", "barbacã", "seteira", "torreão", "catapulta", "aríete", "cavaleiro", "escudeiro", "brasão", "senhor"] },
  { a: "historia", f: "heraldica", c: ["Brasões e escudos", "HERALDICA"], w: ["blau", "goles", "sinople", "sable", "jalde", "argente", "timbre", "elmo", "divisa", "leão", "águia", "flor-de-lis", "virol", "lambrequim"] },
  { a: "historia", f: "aztecas", c: ["Mesoamérica", "PIRAMIDES"], w: ["astecas", "maias", "olmecas", "toltecas", "tenochtitlán", "teotihuacán", "chichén itzá", "palenque", "quetzalcóatl", "cacau", "códice", "calendário", "jaguar", "milho"] },
  { a: "historia", f: "incas", c: ["Império dos Andes", "INCAICO"], w: ["cusco", "machu picchu", "quéchua", "lhama", "quipo", "atahualpa", "pachacuti", "inti", "titicaca", "socalcos", "sacsayhuamán", "pizarro", "batata", "alpaca"] },
  { a: "historia", f: "industrial", c: ["Revolução Industrial", "MAQUINAVAPOR"], w: ["carvão", "tear", "fábrica", "ferrovia", "locomotiva", "watt", "manchester", "operário", "ludismo", "chaminé", "fuligem", "algodão", "caldeira", "turno"] },
  { a: "historia", f: "invencoes", c: ["Grandes inventos", "INVENCOES"], w: ["imprensa", "bússola", "pólvora", "telégrafo", "telefone", "lâmpada", "rádio", "avião", "penicilina", "transistor", "papel", "roda", "óculos", "relógio", "fonógrafo"] },
  { a: "historia", f: "navegacao2", c: ["Instrumentos de bordo", "NAVEGACAO"], w: ["astrolábio", "sextante", "bússola", "quadrante", "balestilha", "carta", "leme", "âncora", "mastro", "vela", "bujarrona", "proa", "popa", "bombordo", "estibordo"] },
  { a: "historia", f: "aviacao", c: ["Mais leve, mais pesado", "AVIACAO"], w: ["santos dumont", "demoiselle", "dirigível", "balão", "hélice", "asa", "leme", "cockpit", "hangar", "piloto", "planador", "zepelim", "biplano", "jato", "turbina"] },
  { a: "historia", f: "arqueologia2", c: ["Escavação", "ESCAVACAO"], w: ["sítio", "estrato", "pincel", "trena", "colher", "peneira", "ânfora", "fóssil", "carbono", "tumba", "múmia", "papiro", "ruína", "artefato", "cerâmica"] },

  // ===================== sociedade, economia, direito, línguas =====================
  { a: "economia", f: "bolsa", c: ["Pregão da bolsa", "INVESTIDOR"], w: ["ação", "dividendo", "índice", "corretora", "alta", "baixa", "touro", "urso", "carteira", "liquidez", "volatilidade", "juros", "bolha", "ativo", "renda"] },
  { a: "economia", f: "moedas", c: ["Câmbio pelo mundo", "MOEDAS"], w: ["real", "dólar", "euro", "libra", "iene", "peso", "rublo", "rúpia", "franco", "coroa", "lira", "rand", "yuan", "dinar", "cruzeiro"] },
  { a: "direito", f: "tribunal", c: ["No tribunal", "JULGAMENTO"], w: ["juiz", "réu", "jurado", "promotor", "advogado", "sentença", "recurso", "testemunha", "habeas", "toga", "martelo", "audiência", "petição", "acórdão", "liminar"] },
  { a: "linguas", f: "gramatica", c: ["Figuras de linguagem", "METAFORAS"], w: ["metonímia", "hipérbole", "ironia", "antítese", "paradoxo", "eufemismo", "aliteração", "assonância", "elipse", "pleonasmo", "catacrese", "anáfora", "prosopopeia", "sinestesia"] },
  { a: "linguas", f: "idiomas", c: ["Torre de Babel", "IDIOMAS"], w: ["inglês", "francês", "alemão", "italiano", "espanhol", "russo", "árabe", "hebraico", "grego", "latim", "tupi", "guarani", "quéchua", "suaíli", "mandarim"] },
  { a: "linguas", f: "tupi", c: ["Herança tupi", "TUPINISMO"], w: ["jabuticaba", "pipoca", "mingau", "peteca", "capivara", "jacaré", "caju", "mandioca", "pindaíba", "cutucar", "perereca", "sabiá", "ipanema", "carioca", "tatu"] },
  { a: "filosofia", f: "psicologia", c: ["No divã", "PSICANALISE"], w: ["freud", "jung", "lacan", "inconsciente", "ego", "superego", "sonho", "recalque", "transferência", "libido", "complexo", "édipo", "ato falho", "pulsão", "sintoma"] },
  { a: "filosofia", f: "logica", c: ["Lógica formal", "SILOGISMO"], w: ["premissa", "conclusão", "falácia", "dedução", "indução", "axioma", "paradoxo", "tautologia", "contradição", "aristóteles", "argumento", "verdade", "negação", "sofisma"] },
  { a: "filosofia", f: "religioes", c: ["Templos do mundo", "SANTUARIOS"], w: ["catedral", "mesquita", "sinagoga", "pagode", "terreiro", "basílica", "capela", "mosteiro", "stupa", "minarete", "ermida", "abadia", "convento", "panteão"] },

  // ===================== cozinha e bebidas =====================
  { a: "cozinha", f: "queijos", c: ["Tábua de queijos", "QUEIJARIA"], w: ["brie", "camembert", "gorgonzola", "parmesão", "gouda", "emmental", "pecorino", "roquefort", "cheddar", "mussarela", "canastra", "coalho", "minas", "provolone", "gruyère"] },
  { a: "cozinha", f: "padaria", c: ["Fornada da madrugada", "PANIFICACAO"], w: ["fermento", "massa", "baguete", "brioche", "croissant", "ciabatta", "focaccia", "sovar", "farinha", "forno", "levain", "bisnaga", "sonho", "broa", "miolo"] },
  { a: "cozinha", f: "mundo", c: ["Volta ao mundo no prato", "IGUARIAS"], w: ["paella", "ceviche", "goulash", "moussaka", "falafel", "kimchi", "risoto", "fondue", "tacos", "curry", "pad thai", "borscht", "tagine", "pierogi", "haggis"] },
  { a: "cozinha", f: "nordestina", c: ["Cozinha nordestina", "TAPIOQUEIRA"], w: ["acarajé", "vatapá", "moqueca", "baião", "carne de sol", "buchada", "sarapatel", "cuscuz", "macaxeira", "rapadura", "queijo coalho", "manteiga", "caruru", "abará"] },
  { a: "cozinha", f: "cha", c: ["Hora do chá", "INFUSOES"], w: ["camomila", "hortelã", "erva-doce", "cidreira", "boldo", "hibisco", "gengibre", "matcha", "oolong", "earl grey", "rooibos", "chaleira", "bule", "xícara", "mate"] },
  { a: "cozinha", f: "chimarrao", c: ["Roda de chimarrão", "ERVAMATE"], w: ["cuia", "bomba", "garrafa", "térmica", "cevador", "cancha", "chaleira", "galpão", "mateada", "amargo", "tereré", "fogo de chão", "prosa", "guaiaca"] },
  { a: "cozinha", f: "doces", c: ["Doceria portuguesa", "CONVENTUAL"], w: ["pastel de nata", "ovos moles", "toucinho do céu", "papo de anjo", "pão de ló", "fios de ovos", "queijada", "barriga de freira", "suspiro", "marmelada", "sonho", "rabanada", "trouxa", "bolinho"] },

  // ===================== esporte e jogos =====================
  { a: "esporte", f: "atletismo", c: ["Pista e campo", "ATLETISMO"], w: ["maratona", "revezamento", "barreiras", "salto", "vara", "dardo", "disco", "martelo", "peso", "decatlo", "heptatlo", "largada", "bastão", "sprint", "marcha"] },
  { a: "esporte", f: "aquaticos", c: ["Na piscina olímpica", "NATACAO"], w: ["crawl", "costas", "peito", "borboleta", "medley", "virada", "raia", "touca", "óculos", "saltos", "polo", "trampolim", "plataforma", "nado", "sincronizado"] },
  { a: "esporte", f: "lutas", c: ["Artes marciais", "TATAME"], w: ["judô", "caratê", "jiu-jítsu", "capoeira", "taekwondo", "kung fu", "aikidô", "sumô", "kendô", "muay thai", "faixa", "quimono", "dojô", "golpe", "sensei"] },
  { a: "esporte", f: "volei", c: ["Ponto de vôlei", "LEVANTADOR"], w: ["saque", "manchete", "toque", "cortada", "bloqueio", "líbero", "rede", "rodízio", "ace", "peixinho", "ponteiro", "oposto", "central", "tie-break", "set"] },
  { a: "jogos", f: "tabuleiro", c: ["Noite de jogos", "TABULEIRO"], w: ["damas", "gamão", "ludo", "dominó", "trilha", "go", "mancala", "batalha naval", "detetive", "war", "banco imobiliário", "dados", "peão", "carta", "roleta"] },
  { a: "jogos", f: "baralho", c: ["Mesa de carteado", "BARALHO"], w: ["truco", "canastra", "buraco", "pôquer", "paciência", "copas", "espadas", "ouros", "paus", "valete", "dama", "coringa", "naipe", "rei", "ás"] },

  // ===================== festas e cultura popular =====================
  { a: "festas", f: "carnaval", c: ["Sambódromo", "ESCOLADESAMBA"], w: ["comissão", "porta-bandeira", "mestre-sala", "bateria", "alegoria", "carro", "samba-enredo", "harmonia", "baiana", "destaque", "passista", "evolução", "quesito", "dispersão", "ala"] },
  { a: "festas", f: "folclore", c: ["Festas do Brasil", "FOLGUEDOS"], w: ["bumba-meu-boi", "maracatu", "congada", "reisado", "cavalhada", "frevo", "parintins", "ciranda", "jongo", "folia de reis", "carimbó", "fandango", "pastoril", "marujada"] },
  { a: "festas", f: "gaucho", c: ["Tradição gaúcha", "PILCHADOS"], w: ["bombacha", "pala", "lenço", "guaiaca", "chilena", "laço", "boleadeira", "rodeio", "invernada", "fandango", "vanerão", "chula", "churrasco", "galpão", "chapéu"] },
]
