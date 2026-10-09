# Soft Garden Cabana Lounge — site institucional

Site estático, de página única, feito com HTML5, CSS3 e JavaScript puros. Não usa build, frameworks nem backend.

```
index.html        Estrutura e conteúdo
css/style.css     Identidade visual, layout responsivo e animações
js/script.js      Configuração (links, contatos, vídeo) e comportamentos:
                  menu, carrossel do hero, filtros da galeria, lightbox, vídeo
favicon.ico       Ícone da aba do navegador
img/photos/       Fotografias otimizadas usadas no site
img/icone/        Monograma "SG" e ícones (apple-touch-icon, 512 px)
img/logo/         Logo (original e versões com fundo transparente)
video/            Vídeo de apresentação (MP4)
README.md
```

---

## Como executar localmente

Escolha uma das opções:

1. **Abrir direto:** dê dois cliques em `index.html`. Tudo funciona, inclusive pelo protocolo `file://`.
2. **XAMPP:** com o Apache iniciado no painel do XAMPP, acesse `http://localhost/cabana_soft_garden/`.
3. **Qualquer servidor estático:** por exemplo, `npx serve .` ou `python -m http.server`, executados na pasta do projeto.

> Dependências externas: a tipografia (Cormorant Garamond + Manrope), do Google Fonts, e o mapa da seção Localização (Google Maps, via `<iframe>`, carregado só quando a seção se aproxima da tela). Sem internet, o site usa fontes do sistema como alternativa. Para hospedar as fontes localmente, baixe os arquivos `.woff2`, crie uma pasta `fonts/`, declare-os com `@font-face` no início de `css/style.css` e remova os três `<link>` de fontes do `<head>`.

---

## Seções da página

Na ordem em que aparecem:

| Seção | Âncora | Observações |
|---|---|---|
| Hero | `#inicio` | Carrossel automático com 3 fotos (troca a cada 6 s), título, subtítulo e botões |
| Experiência | `#experiencia` | Texto de apresentação, foto e 6 destaques |
| Vídeo | `#video` | Vídeo de apresentação (1min05) com capa e botão "Assistir ao vídeo" |
| Galeria | `#galeria` | Abas por ambiente, "Ver mais fotografias" e visualização em tela cheia |
| Arquitetura e detalhes | `#arquitetura` | Vidro, preto e branco, luz e verde |
| Informações | `#informacoes` | Comodidades, check-in, localização, regras e lista completa de comodidades |
| Localização | `#localizacao` | Mapa da região e distâncias |
| Reservas | `#reservas` | Botões do Airbnb e da Holmy; título animado |
| Avaliações | `#avaliacoes` | Nota do Airbnb, notas por categoria e depoimentos |
| Rodapé | — | Navegação, contatos e cidade |

O menu completo do cabeçalho aparece a partir de 1100 px de largura; abaixo disso, ele é acessado pelo botão "Menu".

---

## Configuração de links, contatos e vídeo

Tudo fica em um único lugar: o objeto `SITE_CONFIG`, no início de [js/script.js](js/script.js). Formato dos campos:

```js
const SITE_CONFIG = {
  airbnbUrl: '',     // https://www.airbnb.com.br/rooms/...
  holmyUrl: '',      // https://www.holmy.com.br/hospedagem/...
  instagramUrl: '',  // https://www.instagram.com/perfil/
  email: '',         // contato@dominio.com
  whatsapp: '',      // somente dígitos, com DDI e DDD
  videoUrl: '',      // YouTube, Vimeo ou 'video/arquivo.mp4'
};
```

Hoje estão preenchidos: Airbnb, Holmy, Instagram, WhatsApp e o vídeo (`video/apresentacao-gerada.mp4`). Falta só o e-mail (opcional).

Enquanto um campo estiver vazio (ou inválido), **nada é apresentado como se estivesse funcionando**:

| Elemento | Sem link configurado | Com link configurado |
|---|---|---|
| Botão "Reservar" (cabeçalho e hero) | Leva à seção Reservas | Leva à seção Reservas (onde estão Airbnb e Holmy) |
| Botão "Ver disponibilidade no Airbnb" | Aparece inativo, com o aviso "link será disponibilizado em breve" | Abre o Airbnb em nova aba |
| Botão "Reservar pela Holmy" e link no rodapé | Ficam ocultos | Abrem a Holmy em nova aba |
| Links "Ver no anúncio" e "Ler as avaliações no Airbnb" | Ficam ocultos | Abrem o anúncio do Airbnb |
| Instagram / e-mail / WhatsApp (rodapé) | Ficam ocultos; aparece "Canais de contato em breve" | Ficam visíveis |
| Seção Vídeo | Fica oculta | Aparece com capa e botão "Assistir ao vídeo" |

Todos os links externos recebem automaticamente `target="_blank"`, `rel="noopener noreferrer"` e um aviso "(abre em nova aba)" para leitores de tela. Por segurança, o link do Airbnb só é aceito se for HTTPS de um domínio do Airbnb (`airbnb.*` ou `abnb.me`); o da Holmy, se for HTTPS em `holmy.com.br`.

---

## Fotografias

Todas as fotos usadas no site ficam em `img/photos/`, em JPG (ou WebP/AVIF), já otimizadas.

**Recomendações para novas fotos**

- Até 2400 px no lado maior (hero) e 1600 px nas demais, idealmente abaixo de 400 KB cada.
- Informe sempre `width` e `height` com as dimensões reais, para evitar saltos no layout.
- Escreva `alt` descrevendo o conteúdo real da foto (ex.: "Quarto com iluminação vermelha no teto, à noite").

### Carregamento e desempenho

Para o site abrir rápido e as animações aparecerem com as fotos já carregadas:

- **Duas versões de cada foto:** além do original (até 1600 px), cada foto tem uma versão reduzida com o sufixo `-800` (ex.: `galeria-cozinha-800.jpg`). O atributo `srcset` deixa o navegador escolher o tamanho certo para a tela; a versão de 800 px pesa cerca de metade.
- **Hero:** a primeira foto é pré-carregada no `<head>` (`<link rel="preload">`) e tem uma versão de 1280 px para celular (`foto-paisagem-1-1280.jpg`). As fotos 2 e 3 do carrossel usam `data-src`/`data-srcset` e só são baixadas depois que a primeira aparece; o carrossel só começa a girar nesse momento.
- **Espera elegante:** cada quadro de foto tem `style="--ph: #rrggbb"` com a cor média da própria foto. Enquanto ela baixa, o quadro mostra essa cor com um brilho suave passando; quando chega, a foto surge com fade.
- **Animação de entrada:** a "cortina" das fotos só abre quando a foto já carregou (com limite de 2,5 s, para nunca travar).
- **Fotos fora da tela** usam `loading="lazy"` e só são baixadas quando o visitante se aproxima delas.

**Ao adicionar uma foto nova**, para manter esse comportamento:

1. Salve o original em `img/photos/` (até 1600 px no lado maior) e uma versão com 800 px de largura com o sufixo `-800`.
2. Na `<img>`, use `srcset="img/photos/nome-800.jpg 800w, img/photos/nome.jpg LARGURAw"` e um `sizes` igual ao das outras fotos do mesmo lugar (copie de uma foto vizinha).
3. No `<figure>`, inclua `style="--ph: #rrggbb"` com um tom próximo da cor predominante da foto (se faltar, o quadro usa um cinza escuro).
### Hero (carrossel)

As fotos do fundo ficam dentro de `<div class="hero__media" data-hero-slides>` em `index.html`. Para trocar ou acrescentar uma foto, edite ou copie uma das `<img>`. A primeira deve manter as classes `is-active is-intro` (ela entra com o zoom lento quando termina de carregar), `fetchpriority="high"` e `src`/`srcset` normais — e o `<link rel="preload">` do `<head>` precisa apontar para ela. As demais usam `data-src` (e `data-srcset`/`data-sizes`, se houver) no lugar de `src`, para só serem baixadas depois da primeira. O intervalo entre as fotos é a constante `INTERVAL` em `initHeroSlides` ([js/script.js](js/script.js)), em milissegundos.

### Galeria

A galeria tem abas por ambiente: Todas, Cozinha, Quintal, Banheiro, Quarto, Hidro, Exterior e Camping.

- Cada foto é um `<figure class="media gallery__item …">` com o ambiente no atributo `data-category` (`cozinha`, `quintal`, `banheiro`, `quarto`, `hidro`, `exterior` ou `camping`).
- Na aba **Todas**, as primeiras 9 fotos aparecem direto; as que têm o atributo `data-gallery-more` só aparecem (e só são baixadas) depois do clique em **"Ver mais fotografias"**.
- Nas demais abas, todas as fotos daquele ambiente aparecem em grade uniforme. Abas sem nenhuma foto somem sozinhas.
- A visualização em tela cheia (lightbox) navega apenas pelas fotos visíveis no momento. Opcionalmente, use `data-full="img/photos/foto-grande.jpg"` na `<img>` para mostrar uma versão maior.
- Para incluir mais fotos, copie um `<figure>` existente e ajuste `src`, `alt`, `width`, `height` e `data-category`.

Proporções disponíveis (classe do `<figure>`):

| Local | Classe | Proporção |
|---|---|---|
| Galeria | `gallery__item--large` | 3:2 (8 colunas) |
| Galeria | `gallery__item--tall` | 4:5 (4 colunas) |
| Galeria | `gallery__item--square` | 1:1 (4 colunas) |
| Galeria | `gallery__item--panorama` | 21:9 (largura total) |
| Experiência / Arquitetura | `media--landscape` · `media--portrait` · `media--tall` · `media--square` | 3:2 · 4:5 · 3:4 · 1:1 |

Na aba Todas, a grade usa 12 colunas no desktop: combine os itens para que cada linha some 12 (por exemplo, large + tall, três itens entre tall e square, ou um panorama).

---

## Informações e comodidades

Os cartões da seção Informações usam a lista `<ul class="info-card__list">`. A lista completa de comodidades fica no bloco `<details class="amenities">`, aberto pelo link "Ver todas" do cartão Comodidades ou pelo botão "Ver todas as comodidades". O grupo "Não disponível" aparece riscado, como no anúncio.

---

## Localização

Fica entre Informações e Reservas (`#localizacao`). O mapa aponta a **rua de referência** (Alameda Pica-Pau, Jardim Paraíso da Usina, Atibaia – SP), com o mesmo nível de precisão do mapa do anúncio no Airbnb; o número exato é compartilhado só após a confirmação da reserva. Para mudar o enquadramento, edite o `src` do `<iframe>` em `index.html`. O mapa aparece em tons de cinza e ganha cor ao passar o mouse.

As distâncias (cerca de 65 km de São Paulo pela Fernão Dias e de Campinas pela Dom Pedro I) são aproximadas; ajuste o texto se quiser outra referência.

---

## Vídeo de apresentação

A seção **Vídeo** fica entre Experiência e Galeria e permanece **oculta enquanto `SITE_CONFIG.videoUrl` estiver vazio**. Para publicar o vídeo, preencha esse campo em [js/script.js](js/script.js) com uma destas opções:

- link do YouTube (`https://www.youtube.com/watch?v=...` ou `https://youtu.be/...`), exibido pelo modo de privacidade aprimorada (`youtube-nocookie.com`);
- link do Vimeo (`https://vimeo.com/123456789`);
- arquivo do próprio projeto, por exemplo `video/apresentacao.mp4` (crie a pasta `video/`; prefira MP4 em H.264, de até 1080p).

A seção mostra uma capa com o botão "Assistir ao vídeo"; o player só é carregado depois do clique, para não pesar na abertura da página. Para trocar a capa, altere o `src` da imagem `.video-frame__poster` em `index.html`.

**Vídeo atual:** `video/apresentacao-gerada.mp4`, montado com as fotos do site: 13 cenas, legendas na tipografia do site, abertura e encerramento com a logo. Formato: 1920×1080, 64,6 s, H.264 (3,5 Mbps) + AAC (192 kbps), cerca de 30 MB, já otimizado para web (os metadados ficam no início do arquivo, então ele começa a tocar antes de terminar de baixar).

**Trilha sonora:** Frédéric Chopin, *Noturno em mi bemol maior, Op. 9 nº 2*, gravação do acervo Musopen sob licença **CC0** (domínio público). Pode ser usada inclusive comercialmente e não exige crédito. Fonte: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Nocturne_Op._9_no._2_in_E_flat_major.mp3). O vídeo termina junto com o fim da primeira grande frase da peça, com fade-out de 3 s. Como o arquivo só é baixado depois do clique, ele não pesa na abertura da página. Ao publicar o site, envie a pasta `video/` junto; se a hospedagem limitar o tamanho dos arquivos ou o consumo de banda, prefira publicar o vídeo no YouTube (pode ser como "não listado") e usar o link no `videoUrl`.

---

## Avaliações

A seção **Avaliações** (`#avaliacoes`) fica no final da página, antes do rodapé. Ela mostra:

- a **nota média** e o **total de avaliações** do anúncio no Airbnb;
- as **notas por categoria** (limpeza, exatidão do anúncio, check-in, comunicação, localização e custo-benefício);
- os **depoimentos** dos hóspedes, quando houver;
- o link "Ler as avaliações no Airbnb".

Os números foram copiados do anúncio em 09/10/2026 (nota 5,0 em 3 avaliações) e **não se atualizam sozinhos**: quando mudarem no Airbnb, edite-os em `index.html` (procure por `reviews__number`, `reviews__count` e `reviews__category`).

Para adicionar depoimentos, copie o modelo que está no comentário logo acima da seção para dentro de `<ul class="reviews__list">`. A lista só aparece quando tiver pelo menos um depoimento. Use sempre o texto exato publicado pelo hóspede, com o primeiro nome e o mês/ano da estadia.

---

## Logo e ícones

| Arquivo | Uso |
|---|---|
| `img/logo/simbolo-branco-cabecalho.png` | Símbolo da logo (casa e árvore, sem o texto) no cabeçalho, à esquerda da linha vermelha |
| `favicon.ico` | Ícone da aba do navegador (16, 32 e 48 px), feito com o monograma "SG" |
| `img/icone/icon-512.png` | Ícone em alta resolução para navegadores modernos |
| `img/icone/apple-touch-icon.png` | Ícone ao salvar o site na tela inicial do celular (180 px) |

Regra de uso: o **monograma "SG"** (`img/icone/`) é o ícone oficial para tamanhos pequenos (aba, atalhos, foto de perfil); a **logo** (`img/logo/`) é usada em espaços maiores, como o cabeçalho. Os ícones trazem o monograma branco sobre o fundo escuro do site, para aparecer bem em abas claras e escuras.

Arquivos de origem e versões extras:

- `img/icone/icone3.png`: monograma original; `icone-branco.png` e `icone-preto.png` são versões com fundo transparente.
- `img/logo/logo_nova.png`: logo original (símbolo + "SOFT GARDEN / CABANA LOUNGE", fundo branco).
- `img/logo/simbolo-branco.png` e `simbolo-preto.png`: só o desenho, com fundo transparente.
- `img/logo/logo-completa-branca.png` e `logo-completa-preta.png`: desenho + nome, com fundo transparente, para usos grandes (redes sociais, materiais impressos, assinatura de e-mail).

No cabeçalho usa-se só o símbolo, porque o nome já aparece em texto ao lado da linha vermelha.

---

## Informações pendentes

No código, cada item pendente está marcado com o comentário `PENDENTE` (procure por essa palavra).

**Links e contatos** (`js/script.js`)
- [x] URL do anúncio oficial no Airbnb
- [x] URL da hospedagem na Holmy
- [x] Perfil do Instagram
- [x] WhatsApp de contato
- [ ] E-mail de contato (opcional)
- [x] Vídeo de apresentação (`videoUrl`)

**Conteúdo** (`index.html`)
- [x] Fotografias (hero, Experiência, galeria e Arquitetura)
- [x] Lista de comodidades
- [x] Horários de check-in/checkout e regras da hospedagem
- [x] Localização (Jardim Paraíso da Usina, Atibaia – SP)
- [x] Textos da seção Experiência
- [ ] Depoimentos dos hóspedes na seção Avaliações
- [ ] Confirmar que a pesca no lago é permitida (citada em Experiência)
- [ ] Informações complementares do rodapé (ex.: razão social, CNPJ)
- [ ] Revisão final dos textos da seção Arquitetura

**SEO / publicação** (`<head>` de `index.html`)
- [ ] Domínio definitivo (`canonical`, `og:url`)
- [ ] Imagem de compartilhamento (`og:image`, idealmente 1200×630)
- [ ] Revisão do título e da descrição provisórios

---

## Acessibilidade e comportamento

- Estrutura semântica (`header`, `nav`, `main`, `section`, `article`, `footer`), com um único `h1`.
- Link "Pular para o conteúdo", foco visível em todos os elementos interativos e menu móvel com `aria-expanded`. Com o menu aberto, a tecla Esc o fecha e o conteúdo ao fundo fica inacessível ao foco (`inert`).
- As animações (carrossel, entrada das seções, título de Reservas) respeitam `prefers-reduced-motion`: quando o visitante prefere menos movimento, o conteúdo aparece sem transições e o carrossel não troca sozinho.
- Sem JavaScript, todo o conteúdo continua visível e navegável: todas as fotos da galeria aparecem e o hero mostra a primeira foto.
