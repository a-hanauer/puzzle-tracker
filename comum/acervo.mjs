// Acervo de conhecimentos gerais (out/2026), compartilhado pela Panelinha e pelo Cordel.
// Mais denso que o banco antigo: história, artes, literatura, música, ciência, filosofia,
// geografia, mitologia, cozinha do mundo, esporte, economia, tecnologia e jogos de palavras.
//
// Cada entrada: { n, a, l, w, c? }
//   n — nome do grupo na Panelinha
//   a — área (o gerador não repete a mesma área em dias seguidos)
//   l — nível na Panelinha: 1 amarelo (reconhece rápido) … 4 roxo (pegadinha esperta)
//   w — palavras (quanto mais, melhor: é assim que o gerador acha as armadilhas)
//   c — opcional: [pista, palavra-chave] para virar tema do Cordel
// Escreva com acento; os jogos tiram o que precisam. Uma palavra pode estar em várias entradas
// de propósito (Marte planeta e deus, Otelo peça e ópera, Lua linguagem e satélite…).
export const ACERVO = [
  // ===================== mitologia =====================
  { n: "Deuses gregos", f: "gregos", a: "mitologia", l: 1, w: ["zeus", "hera", "atena", "apolo", "ares", "hermes", "hades", "poseidon", "ártemis", "afrodite", "dionísio", "hefesto", "deméter", "héstia", "eros"], c: ["No alto do Olimpo", "OLIMPIANOS"] },
  { n: "Deuses romanos", f: "planetadeus", a: "mitologia", l: 2, w: ["júpiter", "marte", "vênus", "mercúrio", "netuno", "plutão", "saturno", "juno", "minerva", "vesta", "diana", "ceres", "baco", "vulcano", "cupido", "jano"], c: ["Panteão de Roma", "CAPITOLINO"] },
  { n: "Deuses nórdicos", a: "mitologia", l: 2, w: ["odin", "thor", "loki", "freya", "frigg", "balder", "heimdall", "tyr", "njord", "hel", "skadi"], c: ["Lá em Asgard", "VALQUIRIAS"] },
  { n: "Musas gregas", f: "gregos", a: "mitologia", l: 4, w: ["calíope", "clio", "erato", "euterpe", "melpômene", "polímnia", "tália", "terpsícore", "urânia"] },
  { n: "Titãs gregos", f: "gregos", a: "mitologia", l: 3, w: ["cronos", "reia", "oceano", "atlas", "prometeu", "hipérion", "têmis", "mnemósine", "jápeto", "epimeteu", "febe", "tétis"] },
  { n: "Heróis gregos", a: "mitologia", l: 2, w: ["aquiles", "heitor", "ulisses", "perseu", "teseu", "jasão", "hércules", "páris", "eneias", "belerofonte", "orfeu", "ájax"], c: ["Guerra de Troia", "CAVALODEPAU"] },
  { n: "Criaturas mitológicas", a: "mitologia", l: 1, w: ["minotauro", "medusa", "quimera", "hidra", "ciclope", "centauro", "pégaso", "fênix", "grifo", "esfinge", "sereia", "harpia", "cérbero", "kraken"], c: ["Bestiário fantástico", "MITOLOGIA"] },
  { n: "Orixás", a: "mitologia", l: 2, w: ["iemanjá", "oxum", "xangô", "ogum", "iansã", "oxóssi", "oxalá", "exu", "nanã", "omolu", "ossain", "obá", "logunedé"], c: ["Candomblé", "ORIXAS"] },
  { n: "Deuses egípcios", a: "mitologia", l: 2, w: ["rá", "osíris", "ísis", "hórus", "anúbis", "set", "toth", "bastet", "ptah", "amon", "hator", "sekhmet"], c: ["Às margens do Nilo", "HIEROGLIFO"] },
  { n: "Ninfas e personagens de mitos", a: "mitologia", l: 3, w: ["eco", "narciso", "jacinto", "dafne", "midas", "pandora", "europa", "io", "ganimedes", "calisto", "ícaro", "dédalo", "tântalo", "sísifo"] },
  { n: "Lendas do folclore brasileiro", a: "mitologia", l: 1, w: ["saci", "curupira", "boitatá", "iara", "boto", "cuca", "caipora", "mapinguari", "negrinho", "mula sem cabeça", "lobisomem", "matinta"] },

  // ===================== astronomia e ciência =====================
  { n: "Luas do Sistema Solar", f: "luas", a: "ciencia", l: 3, w: ["io", "europa", "ganimedes", "calisto", "titã", "tritão", "encélado", "fobos", "deimos", "caronte", "oberon", "miranda", "titânia", "reia"], c: ["Satélites naturais", "GALILEANAS"] },
  { n: "Constelações", a: "ciencia", l: 2, w: ["órion", "cassiopeia", "andrômeda", "pégaso", "perseu", "lira", "cisne", "dragão", "cruzeiro", "escorpião", "centauro", "fênix", "hércules", "ursa maior"], c: ["Mapa do céu", "CONSTELACAO"] },
  { n: "Objetos do céu profundo", a: "ciencia", l: 2, w: ["galáxia", "nebulosa", "quasar", "pulsar", "supernova", "buraco negro", "cometa", "asteroide", "anã branca", "aglomerado", "magnetar"], c: ["Céu profundo", "ASTRONOMIA"] },
  { n: "Partículas subatômicas", a: "ciencia", l: 2, w: ["elétron", "próton", "nêutron", "quark", "fóton", "neutrino", "múon", "bóson", "glúon", "pósitron", "méson", "píon"], c: ["Dentro do átomo", "PARTICULAS"] },
  { n: "Unidades com nome de cientista", a: "ciencia", l: 3, w: ["newton", "joule", "watt", "volt", "ampere", "ohm", "pascal", "kelvin", "hertz", "tesla", "coulomb", "faraday", "henry", "weber"], c: ["Sistema Internacional", "GRANDEZAS"] },
  { n: "Elementos batizados com astros", f: "quimica", a: "ciencia", l: 4, w: ["urânio", "netúnio", "plutônio", "hélio", "selênio", "cério", "telúrio", "paládio"] },
  { n: "Gases nobres", f: "quimica", a: "ciencia", l: 2, w: ["hélio", "neônio", "argônio", "criptônio", "xenônio", "radônio"] },
  { n: "Elementos químicos", f: "quimica", a: "ciencia", l: 1, w: ["carbono", "oxigênio", "hidrogênio", "sódio", "potássio", "cálcio", "ferro", "cobre", "zinco", "prata", "ouro", "iodo", "cloro", "enxofre", "fósforo", "mercúrio", "chumbo", "estanho"], c: ["Tabela periódica", "ELEMENTOS"] },
  { n: "Cientistas", f: "cientistas", a: "ciencia", l: 1, w: ["darwin", "newton", "curie", "einstein", "galileu", "pasteur", "mendel", "tesla", "kepler", "copérnico", "faraday", "bohr", "planck", "turing", "lavoisier", "hawking"], c: ["Gênios da ciência", "DESCOBERTA"] },
  { n: "Cientistas brasileiros", f: "cientistas", a: "ciencia", l: 3, w: ["santos dumont", "carlos chagas", "oswaldo cruz", "césar lattes", "vital brazil", "adolpho lutz", "landell", "graziela", "bertha lutz"] },
  { n: "Doenças com nome de médico", a: "ciencia", l: 3, w: ["alzheimer", "parkinson", "chagas", "down", "hodgkin", "crohn", "tourette", "asperger", "huntington", "basedow"] },
  { n: "Órgãos do corpo", a: "ciencia", l: 1, w: ["fígado", "pâncreas", "baço", "rim", "pulmão", "estômago", "tireoide", "vesícula", "coração", "intestino", "bexiga", "cérebro"] },
  { n: "Sistema nervoso", a: "ciencia", l: 2, w: ["neurônio", "axônio", "dendrito", "sinapse", "cerebelo", "medula", "córtex", "tálamo", "hipocampo", "mielina", "amígdala", "bulbo"], c: ["Massa cinzenta", "NEUROCIENCIA"] },
  { n: "Genética", a: "ciencia", l: 2, w: ["gene", "alelo", "genoma", "mutação", "mendel", "ervilha", "hélice", "códon", "proteína", "ribossomo", "cromossomo", "clone", "dna"], c: ["Herança biológica", "GENETICA"] },
  { n: "Ramos da matemática", a: "ciencia", l: 2, w: ["álgebra", "geometria", "cálculo", "topologia", "estatística", "aritmética", "combinatória", "lógica", "teoria dos números", "análise"] },
  { n: "Matemáticos", f: "cientistas", a: "ciencia", l: 2, w: ["euclides", "pitágoras", "euler", "gauss", "fermat", "riemann", "leibniz", "fibonacci", "arquimedes", "hilbert", "noether", "galois", "cantor"], c: ["Teoremas e provas", "MATEMATICA"] },
  { n: "Rochas e minerais", a: "ciencia", l: 1, w: ["granito", "basalto", "mármore", "quartzo", "feldspato", "calcário", "ardósia", "arenito", "obsidiana", "pedra-pomes", "gnaisse", "mica"], c: ["Crosta terrestre", "GEOLOGIA"] },
  { n: "Eras e períodos geológicos", a: "ciencia", l: 3, w: ["jurássico", "cretáceo", "triássico", "cambriano", "devoniano", "permiano", "siluriano", "carbonífero", "quaternário", "paleozoico", "mesozoico", "holoceno"] },
  { n: "Dinossauros", a: "ciencia", l: 1, w: ["tiranossauro", "velociraptor", "triceratops", "estegossauro", "braquiossauro", "diplodoco", "anquilossauro", "espinossauro", "iguanodonte", "pterodáctilo"] },

  // ===================== história =====================
  { n: "Imperadores romanos", a: "historia", l: 2, w: ["augusto", "tibério", "calígula", "cláudio", "nero", "trajano", "adriano", "marco aurélio", "constantino", "vespasiano", "cômodo", "diocleciano"], c: ["Roma imperial", "IMPERADOR"] },
  { n: "Dinastias", a: "historia", l: 3, w: ["tudor", "bourbon", "habsburgo", "romanov", "ming", "han", "tang", "bragança", "orléans", "windsor", "médici", "stuart", "qing"], c: ["Casas reais", "MONARQUIA"] },
  { n: "Batalhas históricas", a: "historia", l: 2, w: ["waterloo", "stalingrado", "maratona", "termópilas", "hastings", "verdun", "somme", "riachuelo", "tuiuti", "guararapes", "trafalgar", "austerlitz", "lepanto"], c: ["Campo de batalha", "ESTRATEGIA"] },
  { n: "Revoltas no Brasil", a: "historia", l: 2, w: ["farroupilha", "canudos", "cabanagem", "balaiada", "sabinada", "chibata", "vacina", "contestado", "malês", "praieira", "confederação", "inconfidência"], c: ["Brasil rebelde", "REVOLTAS"] },
  { n: "Grandes navegadores", a: "historia", l: 1, w: ["cabral", "colombo", "vasco da gama", "magalhães", "vespúcio", "bartolomeu", "cook", "drake", "marco polo", "zheng he", "cabot", "cartier"], c: ["Grandes navegações", "CARAVELAS"] },
  { n: "Tratados históricos", a: "historia", l: 3, w: ["tordesilhas", "versalhes", "madri", "petrópolis", "westfália", "utrecht", "methuen", "maastricht", "viena", "paris"] },
  { n: "Egito antigo", a: "historia", l: 1, w: ["pirâmide", "esfinge", "papiro", "múmia", "ramsés", "faraó", "cleópatra", "hieróglifo", "tutancâmon", "sarcófago", "escaravelho", "obelisco", "nilo"], c: ["Terra dos faraós", "EGITOANTIGO"] },
  { n: "Roma antiga", a: "historia", l: 1, w: ["coliseu", "legião", "gladiador", "fórum", "senado", "aqueduto", "vestal", "patrício", "plebeu", "toga", "biga", "centurião", "latim"], c: ["Todos os caminhos", "LEGIONARIOS"] },
  { n: "Revolução Francesa", a: "historia", l: 2, w: ["bastilha", "jacobinos", "girondinos", "robespierre", "danton", "marat", "guilhotina", "terror", "termidor", "versalhes", "sans-culottes", "marselhesa"], c: ["1789", "REVOLUCAO"] },
  { n: "Brasil Império", a: "historia", l: 2, w: ["dom pedro", "leopoldina", "regência", "poder moderador", "abolição", "isabel", "paraguai", "café", "lei áurea", "coroa", "mauá", "petrópolis"], c: ["De 1822 a 1889", "IMPERIAL"] },
  { n: "Civilizações antigas", a: "historia", l: 1, w: ["maias", "astecas", "incas", "sumérios", "fenícios", "hititas", "persas", "etruscos", "babilônios", "assírios", "olmecas", "minoicos"], c: ["Berços da civilização", "ARQUEOLOGIA"] },
  { n: "Idade Média", a: "historia", l: 1, w: ["feudo", "vassalo", "suserano", "cruzadas", "castelo", "cavaleiro", "servo", "mosteiro", "peste", "catedral", "trovador", "alquimia"], c: ["Mil anos de história", "MEDIEVAL"] },
  { n: "Guerra Fria", a: "historia", l: 2, w: ["muro de berlim", "cortina de ferro", "otan", "pacto de varsóvia", "sputnik", "corrida espacial", "kgb", "cia", "mísseis", "détente", "perestroika", "glasnost"] },
  { n: "Moedas antigas do Brasil", a: "historia", l: 3, w: ["cruzeiro", "cruzado", "réis", "mil-réis", "vintém", "tostão", "pataca", "urv", "cruzado novo", "dobra", "conto"] },

  // ===================== geografia =====================
  { n: "Capitais da África", f: "capitais", a: "geografia", l: 2, w: ["cairo", "nairóbi", "luanda", "maputo", "dacar", "acra", "abuja", "adis abeba", "argel", "túnis", "rabat", "cartum", "kinshasa", "praia"], c: ["Capitais africanas", "CONTINENTE"] },
  { n: "Capitais da Ásia", f: "capitais", a: "geografia", l: 2, w: ["tóquio", "pequim", "seul", "bangcoc", "hanói", "nova délhi", "teerã", "bagdá", "cabul", "manila", "jacarta", "catmandu", "doha"], c: ["Capitais asiáticas", "ORIENTE"] },
  { n: "Capitais das Américas", f: "capitais", a: "geografia", l: 1, w: ["lima", "quito", "bogotá", "caracas", "santiago", "assunção", "la paz", "havana", "ottawa", "montevidéu", "buenos aires", "brasília", "manágua"] },
  { n: "Capitais da Europa", f: "capitais", a: "geografia", l: 1, w: ["paris", "roma", "madri", "lisboa", "berlim", "londres", "viena", "atenas", "praga", "oslo", "dublin", "berna", "budapeste", "varsóvia", "riga"], c: ["Volta pela Europa", "VELHOMUNDO"] },
  { n: "Países sem litoral", a: "geografia", l: 3, w: ["bolívia", "paraguai", "suíça", "áustria", "hungria", "nepal", "mongólia", "chade", "níger", "mali", "zâmbia", "laos", "uganda", "armênia"] },
  { n: "Ilhas do mundo", a: "geografia", l: 1, w: ["madagascar", "sicília", "creta", "chipre", "malta", "bali", "java", "cuba", "islândia", "tasmânia", "sardenha", "córsega", "groenlândia"], c: ["Cercadas de mar", "ARQUIPELAGO"] },
  { n: "Rios do mundo", a: "geografia", l: 1, w: ["nilo", "amazonas", "danúbio", "reno", "sena", "tâmisa", "volga", "ganges", "mekong", "tejo", "eufrates", "tigre", "mississípi", "yangtzé"], c: ["Grandes rios", "CORREDEIRA"] },
  { n: "Montanhas famosas", a: "geografia", l: 2, w: ["everest", "aconcágua", "kilimanjaro", "mont blanc", "fuji", "matterhorn", "denali", "elbrus", "olimpo", "pico da neblina", "k2", "mauna kea"], c: ["Cumes do mundo", "MONTANHISMO"] },
  { n: "Vulcões", a: "geografia", l: 2, w: ["etna", "vesúvio", "krakatoa", "fuji", "stromboli", "cotopaxi", "kilauea", "pinatubo", "hekla", "santa helena", "popocatépetl", "tambora"], c: ["Terra em erupção", "VULCANISMO"] },
  { n: "Desertos", a: "geografia", l: 1, w: ["saara", "atacama", "gobi", "kalahari", "namibe", "sonora", "mojave", "arábico", "patagônia", "taklamakan", "sírio"] },
  { n: "Biomas brasileiros", a: "geografia", l: 1, w: ["amazônia", "cerrado", "caatinga", "pantanal", "pampa", "mata atlântica", "manguezal", "restinga"] },
  { n: "Gentílicos de capitais", a: "geografia", l: 3, w: ["carioca", "paulistano", "manauara", "ludovicense", "capixaba", "potiguar", "porto-alegrense", "florianopolitano", "belo-horizontino", "curitibano", "teresinense", "macapaense"] },
  { n: "Linhas e pontos do globo", a: "geografia", l: 2, w: ["equador", "trópico", "meridiano", "paralelo", "greenwich", "círculo polar", "latitude", "longitude", "antípoda", "hemisfério", "fuso"], c: ["Coordenadas", "CARTOGRAFIA"] },
  { n: "Mares e oceanos", a: "geografia", l: 1, w: ["mediterrâneo", "báltico", "cáspio", "egeu", "adriático", "vermelho", "negro", "morto", "índico", "pacífico", "atlântico", "ártico", "caribe"] },
  { n: "Bairros do Rio", f: "bairros", a: "geografia", l: 2, w: ["copacabana", "ipanema", "leblon", "lapa", "urca", "tijuca", "botafogo", "flamengo", "gávea", "méier", "glória", "catete", "santa teresa"], c: ["Cidade maravilhosa", "CARIOCAS"] },
  { n: "Bairros de São Paulo", f: "bairros", a: "geografia", l: 3, w: ["moema", "pinheiros", "liberdade", "bexiga", "mooca", "perdizes", "jardins", "brás", "ipiranga", "consolação", "lapa", "higienópolis"] },
  { n: "Cidades gaúchas", a: "geografia", l: 2, w: ["pelotas", "caxias", "gramado", "canela", "bagé", "uruguaiana", "santa maria", "torres", "alegrete", "bento", "erechim", "passo fundo"], c: ["Rincão gaúcho", "QUERENCIA"] },

  // ===================== literatura =====================
  { n: "Personagens de Machado de Assis", a: "literatura", l: 2, w: ["capitu", "bentinho", "escobar", "brás cubas", "quincas borba", "rubião", "sofia", "virgília", "marcela", "bacamarte", "aires", "flora"], c: ["Bruxo do Cosme Velho", "MACHADIANO"] },
  { n: "Obras de Jorge Amado", a: "literatura", l: 2, w: ["gabriela", "tieta", "dona flor", "mar morto", "jubiabá", "capitães", "tereza batista", "cacau", "suor", "seara vermelha"] },
  { n: "Guimarães Rosa", a: "literatura", l: 3, w: ["riobaldo", "diadorim", "veredas", "jagunço", "buriti", "sagarana", "miguilim", "nonada", "sertão", "urucuia", "hermógenes"], c: ["Grande Sertão", "VEREDAS"] },
  { n: "Poetas brasileiros", a: "literatura", l: 1, w: ["drummond", "bandeira", "cecília", "vinicius", "quintana", "bilac", "castro alves", "gonçalves dias", "cabral", "leminski", "hilda hilst", "cora coralina", "gullar"], c: ["Versos do Brasil", "POESIA"] },
  { n: "Peças de Shakespeare", a: "literatura", l: 1, w: ["hamlet", "otelo", "macbeth", "rei lear", "a tempestade", "romeu e julieta", "coriolano", "júlio césar", "ricardo iii", "noite de reis", "falstaff"], c: ["O bardo inglês", "ELISABETANO"] },
  { n: "Detetives da ficção", a: "literatura", l: 2, w: ["sherlock", "poirot", "marple", "maigret", "columbo", "dupin", "watson", "marlowe", "spade", "espinosa", "ellery queen"], c: ["Romance policial", "INVESTIGACAO"] },
  { n: "Gêneros literários", a: "literatura", l: 1, w: ["soneto", "haicai", "epopeia", "crônica", "fábula", "novela", "conto", "ode", "elegia", "romance", "ensaio", "sátira", "epigrama"], c: ["Prateleira de letras", "LITERATURA"] },
  { n: "Literatura russa", a: "literatura", l: 3, w: ["tolstói", "dostoiévski", "tchekhov", "gógol", "púchkin", "turguêniev", "nabokov", "bulgákov", "górki", "pasternak", "karênina", "raskólnikov"], c: ["Clássicos russos", "SAMOVAR"] },
  { n: "Divina Comédia", a: "literatura", l: 3, w: ["dante", "virgílio", "beatriz", "inferno", "purgatório", "paraíso", "caronte", "minos", "lúcifer", "círculo", "florença", "limbo"] },
  { n: "Personagens de Cervantes e companhia", a: "literatura", l: 3, w: ["quixote", "sancho", "dulcineia", "rocinante", "moinho", "la mancha", "fidalgo"] },
  { n: "Prêmios", a: "literatura", l: 2, w: ["nobel", "oscar", "jabuti", "pulitzer", "grammy", "emmy", "camões", "goncourt", "booker", "tony", "cervantes", "palma de ouro", "leão de ouro"] },

  // ===================== artes visuais e arquitetura =====================
  { n: "Pintores impressionistas", f: "pintores", a: "artes", l: 2, w: ["monet", "manet", "renoir", "degas", "pissarro", "sisley", "morisot", "cassatt", "caillebotte", "bazille"], c: ["Luz ao ar livre", "IMPRESSAO"] },
  { n: "Pintores brasileiros", f: "pintores", a: "artes", l: 2, w: ["portinari", "tarsila", "anita", "di cavalcanti", "volpi", "djanira", "segall", "guignard", "pancetti", "tomie", "milhazes", "almeida júnior"], c: ["Na pinacoteca", "MODERNISMO"] },
  { n: "Movimentos artísticos", a: "artes", l: 2, w: ["cubismo", "dadaísmo", "surrealismo", "fauvismo", "futurismo", "barroco", "rococó", "gótico", "minimalismo", "concretismo", "maneirismo", "pop art", "romantismo"], c: ["Escolas da arte", "VANGUARDA"] },
  { n: "Renascimento", a: "artes", l: 1, w: ["da vinci", "rafael", "botticelli", "donatello", "michelangelo", "florença", "médici", "afresco", "tiziano", "bramante", "giotto", "perspectiva", "mona lisa"], c: ["Florença, século XV", "RENASCIMENTO"] },
  { n: "Arquitetos", a: "artes", l: 2, w: ["niemeyer", "gaudí", "le corbusier", "zaha hadid", "gropius", "wright", "siza", "mies", "foster", "lina bo bardi", "lúcio costa", "piano"], c: ["Prancheta e concreto", "ARQUITETURA"] },
  { n: "Brasília de Niemeyer", a: "artes", l: 3, w: ["alvorada", "planalto", "itamaraty", "catedral", "congresso", "pilotis", "superquadra", "eixo", "burle marx", "candangos", "lúcio costa", "athos bulcão"] },
  { n: "Museus", a: "artes", l: 2, w: ["louvre", "prado", "uffizi", "hermitage", "masp", "moma", "tate", "orsay", "guggenheim", "inhotim", "pinacoteca", "rijksmuseum"], c: ["Visita guiada", "MUSEOLOGIA"] },
  { n: "Barroco mineiro", a: "artes", l: 3, w: ["aleijadinho", "ataíde", "ouro preto", "congonhas", "profetas", "sabará", "mariana", "talha", "pedra-sabão", "tiradentes", "diamantina"], c: ["Igrejas de ouro", "ALEIJADINHO"] },
  { n: "Técnicas de pintura e gravura", a: "artes", l: 3, w: ["afresco", "têmpera", "óleo", "aquarela", "guache", "pastel", "xilogravura", "litografia", "serigrafia", "encáustica", "nanquim", "sfumato"] },

  // ===================== música =====================
  { n: "Compositores clássicos", a: "musica", l: 1, w: ["bach", "mozart", "beethoven", "chopin", "vivaldi", "brahms", "haydn", "wagner", "debussy", "ravel", "liszt", "schubert", "tchaikovsky", "villa-lobos"], c: ["Sala de concerto", "SINFONIA"] },
  { n: "Óperas", f: "opera", a: "musica", l: 2, w: ["aida", "carmen", "tosca", "traviata", "rigoletto", "nabucco", "turandot", "fidelio", "norma", "otelo", "salomé", "la bohème", "macbeth", "falstaff", "il guarany"], c: ["Noite no Municipal", "LIBRETOS"] },
  { n: "Termos musicais italianos", f: "termomus", a: "musica", l: 2, w: ["allegro", "adagio", "andante", "presto", "forte", "piano", "crescendo", "staccato", "legato", "fermata", "largo", "vivace", "dolce", "rubato"], c: ["Na partitura", "ANDAMENTOS"] },
  { n: "Bossa Nova", a: "musica", l: 2, w: ["tom jobim", "joão gilberto", "vinicius", "nara leão", "menescal", "carlos lyra", "astrud", "desafinado", "garota", "ipanema", "chega de saudade", "banquinho"], c: ["Um banquinho e um violão", "BOSSANOVA"] },
  { n: "Tropicália", a: "musica", l: 3, w: ["caetano", "gil", "gal", "tom zé", "mutantes", "rita lee", "torquato", "oiticica", "parangolé", "duprat", "capinam", "nara"], c: ["Alegria, alegria", "TROPICALIA"] },
  { n: "Cantores da MPB", a: "musica", l: 1, w: ["caetano", "gil", "chico", "milton", "djavan", "elis", "gal", "bethânia", "cazuza", "rita lee", "tim maia", "belchior", "jorge ben", "elza"] },
  { n: "Bandas de rock internacionais", a: "musica", l: 1, w: ["beatles", "queen", "nirvana", "oasis", "radiohead", "metallica", "pink floyd", "ramones", "coldplay", "the who", "led zeppelin", "u2", "rolling stones"], c: ["Rock and roll", "GUITARRAS"] },
  { n: "Canções de Chico Buarque", a: "musica", l: 3, w: ["construção", "cálice", "roda viva", "a banda", "geni", "cotidiano", "carolina", "vai passar", "o que será", "futuros amantes", "a rita", "pedaço de mim"] },
  { n: "Jazz", a: "musica", l: 2, w: ["swing", "bebop", "blues", "saxofone", "miles davis", "coltrane", "ellington", "armstrong", "ragtime", "scat", "big band", "improviso", "nova orleans"], c: ["Clube de jazz", "IMPROVISO"] },
  { n: "Instrumentos de orquestra", a: "musica", l: 1, w: ["violino", "viola", "violoncelo", "contrabaixo", "harpa", "flauta", "oboé", "clarinete", "fagote", "trompa", "trompete", "trombone", "tuba", "tímpano", "celesta"], c: ["Fosso da orquestra", "MAESTRO"] },
  { n: "Vozes e naipes", a: "musica", l: 2, w: ["soprano", "contralto", "tenor", "barítono", "baixo", "mezzo", "falsete", "coral", "cappella", "solista", "uníssono"] },

  // ===================== cinema e TV =====================
  { n: "Diretores de cinema", a: "cinema", l: 1, w: ["kubrick", "hitchcock", "fellini", "kurosawa", "bergman", "godard", "truffaut", "tarantino", "scorsese", "spielberg", "almodóvar", "glauber", "kiarostami", "nolan"], c: ["Cinema de autor", "CINEFILIA"] },
  { n: "Filmes de Hitchcock", a: "cinema", l: 3, w: ["psicose", "os pássaros", "rebecca", "interlúdio", "marnie", "frenesi", "topázio", "festim diabólico", "um corpo que cai", "janela indiscreta"] },
  { n: "Cinema Novo", a: "cinema", l: 3, w: ["glauber", "nelson pereira", "cacá diegues", "joaquim pedro", "leon hirszman", "ruy guerra", "vidas secas", "terra em transe", "barravento", "macunaíma"] },
  { n: "Personagens de Star Wars", a: "cinema", l: 1, w: ["yoda", "leia", "luke", "vader", "han solo", "chewbacca", "obi-wan", "palpatine", "padmé", "anakin", "rey", "kylo ren"], c: ["Galáxia distante", "SABREDELUZ"] },
  { n: "Filmes da Pixar", a: "cinema", l: 2, w: ["toy story", "carros", "up", "soul", "wall-e", "ratatouille", "divertida mente", "viva", "valente", "luca", "os incríveis", "elementos", "procurando nemo"] },
  { n: "Termos de cinema", a: "cinema", l: 2, w: ["plano", "close", "travelling", "corte", "roteiro", "claquete", "storyboard", "trilha", "montagem", "fade", "câmera lenta", "flashback", "cameo"], c: ["Set de filmagem", "CLAQUETE"] },

  // ===================== filosofia e ideias =====================
  { n: "Filósofos", f: "filosofos", a: "filosofia", l: 1, w: ["sócrates", "platão", "aristóteles", "kant", "hegel", "nietzsche", "descartes", "espinosa", "hume", "locke", "sartre", "foucault", "heidegger", "wittgenstein", "simone"], c: ["Amor à sabedoria", "FILOSOFIA"] },
  { n: "Pré-socráticos", f: "filosofos", a: "filosofia", l: 3, w: ["tales", "anaximandro", "anaxímenes", "heráclito", "parmênides", "zenão", "pitágoras", "empédocles", "demócrito", "leucipo", "anaxágoras"], c: ["Antes de Sócrates", "COSMOLOGIA"] },
  { n: "Escolas filosóficas", f: "filosofos", a: "filosofia", l: 2, w: ["estoicismo", "epicurismo", "cinismo", "ceticismo", "empirismo", "racionalismo", "idealismo", "positivismo", "utilitarismo", "pragmatismo", "niilismo", "iluminismo"] },
  { n: "Iluminismo", a: "filosofia", l: 2, w: ["voltaire", "rousseau", "diderot", "montesquieu", "locke", "kant", "razão", "enciclopédia", "contrato social", "despotismo", "tolerância", "d'alembert"], c: ["Século das Luzes", "ILUMINISTA"] },
  { n: "Economistas", a: "filosofia", l: 2, w: ["keynes", "adam smith", "marx", "ricardo", "friedman", "hayek", "schumpeter", "malthus", "piketty", "furtado", "amartya sen", "walras"], c: ["Mão invisível", "ECONOMIA"] },
  { n: "Termos de economia", a: "filosofia", l: 1, w: ["inflação", "juros", "câmbio", "déficit", "superávit", "pib", "selic", "dívida", "recessão", "liquidez", "spread", "dividendo", "tributo"] },

  // ===================== cozinha do mundo =====================
  { n: "Pratos japoneses", f: "pratos", a: "cozinha", l: 1, w: ["sushi", "sashimi", "tempurá", "lámen", "udon", "missô", "yakisoba", "guioza", "onigiri", "tonkatsu", "teriyaki", "temaki"], c: ["Restaurante japonês", "WASABI"] },
  { n: "Pratos italianos", f: "pratos", a: "cozinha", l: 1, w: ["risoto", "lasanha", "carbonara", "ossobuco", "polenta", "bruschetta", "tiramisù", "panna cotta", "minestrone", "nhoque", "focaccia", "carpaccio"], c: ["Cantina italiana", "TRATTORIA"] },
  { n: "Pratos franceses", f: "pratos", a: "cozinha", l: 2, w: ["ratatouille", "quiche", "crepe", "suflê", "cassoulet", "escargot", "foie gras", "croissant", "bouillabaisse", "crème brûlée", "tarte tatin", "boeuf bourguignon"], c: ["Bistrô francês", "GASTRONOMIA"] },
  { n: "Especiarias", a: "cozinha", l: 1, w: ["açafrão", "cúrcuma", "cardamomo", "cravo", "canela", "noz-moscada", "gengibre", "anis-estrelado", "zimbro", "páprica", "cominho", "sumagre"], c: ["Rota das especiarias", "TEMPEROS"] },
  { n: "Uvas de vinho", f: "vinho", a: "cozinha", l: 2, w: ["merlot", "malbec", "tannat", "cabernet", "syrah", "pinot noir", "chardonnay", "riesling", "carménère", "sangiovese", "nebbiolo", "touriga"], c: ["Na vinícola", "VINICULTURA"] },
  { n: "Termos de vinho", f: "vinho", a: "cozinha", l: 3, w: ["tanino", "safra", "terroir", "buquê", "decantar", "sommelier", "varietal", "assemblage", "rosé", "espumante", "acidez", "retrogosto"] },
  { n: "Tipos de café", a: "cozinha", l: 2, w: ["espresso", "ristretto", "lungo", "macchiato", "cappuccino", "latte", "mocha", "coado", "cortado", "affogato", "flat white", "carioca"], c: ["Barista", "CAFETERIA"] },
  { n: "Drinques", a: "cozinha", l: 1, w: ["caipirinha", "mojito", "negroni", "martíni", "margarita", "daiquiri", "cosmopolitan", "bloody mary", "aperol", "cuba libre", "gim-tônica", "manhattan"], c: ["Atrás do balcão", "COQUETEL"] },
  { n: "Pratos típicos do Brasil", f: "pratos", a: "cozinha", l: 1, w: ["feijoada", "moqueca", "acarajé", "vatapá", "tacacá", "barreado", "tutu", "carreteiro", "galinhada", "baião de dois", "pato no tucupi", "arroz de cuxá"], c: ["Mesa brasileira", "CULINARIA"] },
  { n: "Queijos do mundo", a: "cozinha", l: 2, w: ["parmesão", "brie", "camembert", "gorgonzola", "roquefort", "gouda", "emmental", "manchego", "pecorino", "feta", "gruyère", "serra da estrela", "canastra"] },

  // ===================== esporte =====================
  { n: "Pilotos de Fórmula 1", a: "esporte", l: 2, w: ["senna", "piquet", "fittipaldi", "prost", "schumacher", "hamilton", "lauda", "barrichello", "massa", "clark", "verstappen", "alonso", "vettel"], c: ["Box e bandeirada", "AUTODROMO"] },
  { n: "Clubes europeus", a: "esporte", l: 1, w: ["barcelona", "real madrid", "juventus", "milan", "ajax", "bayern", "liverpool", "arsenal", "chelsea", "benfica", "porto", "inter"] },
  { n: "Termos de tênis", a: "esporte", l: 2, w: ["ace", "break", "deuce", "lob", "voleio", "slice", "game", "set", "tie-break", "smash", "backhand", "saibro", "grand slam"], c: ["Na quadra de saibro", "WIMBLEDON"] },
  { n: "Termos de xadrez", a: "esporte", l: 2, w: ["roque", "xeque", "gambito", "en passant", "zugzwang", "promoção", "empate", "afogamento", "abertura", "siciliana", "rainha", "peão"], c: ["Sobre o tabuleiro", "XEQUEMATE"] },
  { n: "Lances de futebol", a: "esporte", l: 1, w: ["impedimento", "escanteio", "pênalti", "lateral", "tiro de meta", "carrinho", "chapéu", "caneta", "bicicleta", "drible", "cavadinha", "voleio", "gol olímpico"] },
  { n: "Provas olímpicas", a: "esporte", l: 1, w: ["maratona", "decatlo", "salto com vara", "dardo", "disco", "martelo", "esgrima", "remo", "revezamento", "pentatlo", "heptatlo", "marcha", "triatlo"], c: ["Jogos Olímpicos", "OLIMPIADA"] },
  { n: "Golpes de luta", a: "esporte", l: 3, w: ["jab", "cruzado", "upper", "gancho", "chave de braço", "mata-leão", "ippon", "kimura", "triângulo", "meia-lua", "rasteira", "armlock"] },

  // ===================== tecnologia =====================
  { n: "Linguagens de programação", f: "prog", a: "tecnologia", l: 2, w: ["python", "java", "ruby", "swift", "rust", "kotlin", "perl", "cobol", "fortran", "haskell", "go", "lua", "julia", "javascript"], c: ["Código-fonte", "ALGORITMO"] },
  { n: "Termos de internet", a: "tecnologia", l: 1, w: ["spam", "phishing", "cookie", "firewall", "malware", "bug", "backup", "link", "login", "streaming", "podcast", "meme", "hashtag", "nuvem"] },
  { n: "Pioneiros da computação", f: "cientistas", a: "tecnologia", l: 3, w: ["turing", "lovelace", "babbage", "von neumann", "hopper", "shannon", "berners-lee", "dijkstra", "knuth", "boole", "hollerith"] },

  // ===================== língua, com mais erudição (sem gramática escolar) =====================
  { n: "Palavras de origem tupi", f: "origem", a: "lingua", l: 3, w: ["abacaxi", "jabuticaba", "capivara", "pipoca", "mingau", "peteca", "jacaré", "cutucar", "catapora", "perereca", "sabiá", "tamanduá", "carioca", "ipanema"] },
  { n: "Palavras de origem árabe", f: "origem", a: "lingua", l: 3, w: ["algodão", "azeite", "alface", "açúcar", "almofada", "alfaiate", "azulejo", "xarope", "álgebra", "algarismo", "arroz", "açougue", "aldeia", "alferes"] },
  { n: "Palavras de origem africana", f: "origem", a: "lingua", l: 3, w: ["cafuné", "moleque", "caçula", "quitanda", "samba", "dengo", "cochilar", "fubá", "quilombo", "berimbau", "miçanga", "marimbondo", "camundongo", "xingar"] },
  { n: "Palavras de origem japonesa", f: "origem", a: "lingua", l: 2, w: ["karaokê", "origami", "tsunami", "emoji", "judô", "bonsai", "haicai", "quimono", "anime", "sudoku", "saquê", "samurai", "tofu", "caratê"] },
  { n: "Palavras que vieram do francês", f: "origem", a: "lingua", l: 3, w: ["abajur", "bufê", "garçom", "chofer", "toalete", "crochê", "maiô", "batom", "buquê", "purê", "sutiã", "matinê", "omelete", "boné"] },
  { n: "Epônimos: vêm de nome de gente", a: "lingua", l: 4, w: ["sanduíche", "guilhotina", "boicote", "nicotina", "silhueta", "macadame", "pasteurizar", "diesel", "saxofone", "braile", "cardigã", "daltonismo", "galvanizar", "mesmerizar"] },
  { n: "Siglas que viraram palavra", a: "lingua", l: 4, w: ["laser", "radar", "sonar", "ovni", "modem", "taser", "detran", "embrapa", "sesc", "unesco", "otan"] },

  // ===================== pegadinhas espertas (roxo) =====================
  { n: "Escondem um elemento químico", f: "esconde", a: "jogo", l: 4, w: ["episódio", "período", "ferrovia", "prataria", "clorofila", "tesouro", "besouro", "agouro", "ferroada", "louro"] },
  { n: "Escondem uma capital", f: "esconde", a: "jogo", l: 4, w: ["aroma", "romance", "clima", "limão", "taberna", "mosquito", "barriga", "sacra"] },
  { n: "Escondem um deus grego", f: "esconde", a: "jogo", l: 4, w: ["herança", "heráldica", "zeros", "erosão", "mares", "lares"] },
  { n: "Usam as cinco vogais", a: "jogo", l: 4, w: ["eucalipto", "questionário", "simultâneo", "terapêutico", "pneumático", "educativo", "ultravioleta"] },
  { n: "Óperas com nome de mulher", f: "opera", a: "jogo", l: 4, w: ["carmen", "aida", "tosca", "norma", "salomé", "manon", "lucia", "thaïs", "rusalka", "lakmé", "turandot"] },
  { n: "Também são linguagens de programação", f: "prog", a: "jogo", l: 4, w: ["python", "ruby", "swift", "rust", "lua", "julia", "java", "go", "perl", "pascal", "logo", "ada"] },
  { n: "Planetas que também são deuses", f: "planetadeus", a: "jogo", l: 4, w: ["marte", "vênus", "mercúrio", "júpiter", "saturno", "netuno", "urano", "plutão"] },
  { n: "Bairros que viraram clube", f: "bairros", a: "jogo", l: 4, w: ["botafogo", "flamengo", "olaria", "bangu", "madureira", "bonsucesso", "são cristóvão", "ipiranga"] },
  { n: "Também são termos musicais", f: "termomus", a: "jogo", l: 4, w: ["piano", "forte", "largo", "presto", "coda", "fuga", "cânone", "rondó", "suíte", "estudo", "noturno", "prelúdio"] },
  { n: "Escondem um instrumento", f: "esconde", a: "jogo", l: 4, w: ["visitar", "tubarão", "ensino", "assino", "violação"] },
  { n: "Romances com nome de mulher", f: "mulher", a: "literatura", l: 3, w: ["helena", "iracema", "lucíola", "diva", "gabriela", "tieta", "lolita", "emma", "rebecca", "senhora", "jane eyre", "olga", "carmen"] },
  { n: "Complexo de ___", a: "jogo", l: 4, w: ["édipo", "electra", "peter pan", "cinderela", "medeia", "jonas", "caim", "diana", "inferioridade", "vira-lata"] },
  { n: "Síndrome de ___ (lugares)", a: "jogo", l: 4, w: ["estocolmo", "paris", "jerusalém", "lima", "florença", "havana"] },
  { n: "Efeito ___", a: "ciencia", l: 3, w: ["borboleta", "dominó", "estufa", "placebo", "doppler", "manada", "streisand", "mandela", "rebote", "colateral", "sanfona", "cascata"] },
  { n: "Paradoxo de ___", a: "filosofia", l: 4, w: ["zenão", "fermi", "gêmeos", "avô", "teseu", "mentiroso", "russell", "simpson", "olbers", "epimênides"] },
  { n: "Lei de ___", a: "ciencia", l: 3, w: ["murphy", "moore", "newton", "ohm", "hooke", "boyle", "kepler", "parkinson", "godwin", "pareto", "gresham", "lavoisier"] },
  { n: "Escondem um rio", f: "esconde", a: "jogo", l: 4, w: ["festejo", "terreno", "sereno", "moreno", "lindo", "vindo", "renovar", "ensenada"] },
  { n: "Escondem um país", f: "esconde", a: "jogo", l: 4, w: ["malícia", "incubadora", "ganância", "engana", "congonhas", "catarata", "catarro", "romã"] },
  { n: "Editoras brasileiras", a: "literatura", l: 3, w: ["abril", "record", "rocco", "intrínseca", "planeta", "objetiva", "todavia", "zahar", "ática", "cosac naify", "sextante", "aleph"] },
  { n: "Modelos de carro que são outra palavra", a: "jogo", l: 4, w: ["gol", "polo", "golf", "passat", "toro", "argo", "ônix", "fox", "up", "uno", "kicks", "ka"] },
  { n: "Missões espaciais", a: "ciencia", l: 3, w: ["apolo", "gemini", "ártemis", "voyager", "viking", "juno", "galileu", "cassini", "rosetta", "kepler", "hubble", "sputnik", "pioneer"] },
];
