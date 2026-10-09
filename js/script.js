/* ==========================================================================
   Soft Garden Cabana Lounge — script.js
   JavaScript puro, sem dependências.
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIGURAÇÃO DO SITE
     Campos vazios ('') ou inválidos mantêm o recurso oculto
     ------------------------------------------------------------------------ */
  const SITE_CONFIG = {
    // URL do anúncio oficial no Airbnb
    airbnbUrl: 'https://www.airbnb.com.br/rooms/1764765065313956107',

    // URL da hospedagem na Holmy
    holmyUrl: 'https://www.holmy.com.br/hospedagem/soft-garden-cabana-lounge/',

    // URL do perfil no Instagram
    instagramUrl: 'https://www.instagram.com/soft_garden_cabana_lauge/',

    // PENDENTE: e-mail de contato
    email: '',

    // WhatsApp
    whatsapp: '5511989328924',

    // Vídeo de apresentação (seção "Vídeo", entre Experiência e Galeria)
    // Aceita link do YouTube ou do Vimeo, ou um arquivo do projeto (ex.: 'video/apresentacao.mp4').
    // Enquanto estiver vazio, a seção fica oculta.
    videoUrl: 'video/apresentacao-gerada.mp4',
  };

  /* Utilitários
------------------------------------------------------------------------ */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isHttpsUrlOnHost = (value, hostPattern) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && hostPattern.test(url.hostname);
    } catch {
      return false;
    }
  };

  const AIRBNB_HOST = /(^|\.)(airbnb\.[a-z.]+|abnb\.me)$/i;
  const INSTAGRAM_HOST = /(^|\.)instagram\.com$/i;
  const HOLMY_HOST = /(^|\.)holmy\.com\.br$/i;

  /** Marca um link como externo: nova aba, rel seguro e aviso para leitores de tela. */
  const markExternal = (link) => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (!$('.visually-hidden', link)) {
      const hint = document.createElement('span');
      hint.className = 'visually-hidden';
      hint.textContent = ' (abre em nova aba)';
      link.append(hint);
    }
  };

  const bookingUrl = isHttpsUrlOnHost(SITE_CONFIG.airbnbUrl, AIRBNB_HOST) ? SITE_CONFIG.airbnbUrl : '';
  const holmyUrl = isHttpsUrlOnHost(SITE_CONFIG.holmyUrl, HOLMY_HOST) ? SITE_CONFIG.holmyUrl : '';

  /* Cabeçalho: fundo sólido após rolagem
     ------------------------------------------------------------------------ */
  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;

    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* Menu móvel
     ------------------------------------------------------------------------ */
  function initMobileMenu() {
    const toggle = $('[data-nav-toggle]');
    const nav = $('#site-nav');
    if (!toggle || !nav) return;

    const label = $('[data-nav-toggle-label]', toggle);
    const background = [$('main'), $('.site-footer')].filter(Boolean);
    const desktop = window.matchMedia('(min-width: 1100px)');

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Fechar' : 'Menu';
      document.body.classList.toggle('nav-open', open);
      // Impede que o foco alcance o conteúdo coberto pelo menu
      background.forEach((el) => { el.inert = open; });
    };

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    $$('a', nav).forEach((link) => {
      link.addEventListener('click', () => { if (isOpen()) setOpen(false); });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    desktop.addEventListener('change', (event) => {
      if (event.matches && isOpen()) setOpen(false);
    });
  }

  /* Navegação ativa conforme a seção visível
     ------------------------------------------------------------------------ */
  function initActiveNav() {
    const links = $$('.site-nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        } else if (link.getAttribute('aria-current')) {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* Links de reserva (Airbnb)
     data-booking="nav"     → sem link: mantém âncora #reservas
     data-booking="primary" → sem link: botão inativo + aviso "em breve"
     data-booking="inline"  → sem link: oculto
     ------------------------------------------------------------------------ */
  function initBookingLinks() {
    $$('[data-booking]').forEach((link) => {
      if (bookingUrl) {
        link.href = bookingUrl;
        markExternal(link);
        return;
      }

      switch (link.dataset.booking) {
        case 'primary':
          link.removeAttribute('href');
          link.setAttribute('role', 'link');
          link.setAttribute('aria-disabled', 'true');
          link.classList.add('is-pending');
          break;
        case 'inline':
          link.hidden = true;
          break;
        default:
          break; // 'nav': continua levando à seção de reservas
      }
    });

    // Botão da Holmy: aparece somente quando configurado
    $$('[data-holmy]').forEach((link) => {
      if (!holmyUrl) return;
      link.href = holmyUrl;
      markExternal(link);
      link.hidden = false;
    });

    $$('[data-booking-note]').forEach((el) => { el.hidden = !bookingUrl; });
    $$('[data-booking-pending]').forEach((el) => { el.hidden = Boolean(bookingUrl); });
  }

  /* Contatos do rodapé — exibidos somente quando configurados
     ------------------------------------------------------------------------ */
  function initContactLinks() {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SITE_CONFIG.email) ? SITE_CONFIG.email : '';
    const whatsapp = /^\d{10,15}$/.test(SITE_CONFIG.whatsapp) ? SITE_CONFIG.whatsapp : '';

    const contacts = {
      booking: { href: bookingUrl, external: true },
      holmy: { href: holmyUrl, external: true },
      instagram: {
        href: isHttpsUrlOnHost(SITE_CONFIG.instagramUrl, INSTAGRAM_HOST) ? SITE_CONFIG.instagramUrl : '',
        external: true,
      },
      email: { href: email && `mailto:${email}`, text: email },
      whatsapp: { href: whatsapp && `https://wa.me/${whatsapp}`, external: true },
    };

    let socialOrContactVisible = false;

    $$('[data-contact]').forEach((link) => {
      const type = link.dataset.contact;
      const contact = contacts[type];
      const item = link.closest('li') || link;

      if (!contact || !contact.href) {
        item.hidden = true;
        return;
      }

      link.href = contact.href;
      if (contact.text) link.textContent = contact.text;
      if (contact.external) markExternal(link);
      item.hidden = false;
      if (type !== 'booking') socialOrContactVisible = true;
    });

    $$('[data-contact-fallback]').forEach((el) => { el.hidden = socialOrContactVisible; });
  }

  /* Hero: carrossel automático das fotos de fundo
     Troca a cada 6 s com transição suave. Pausa com a aba em segundo plano.
     Com "reduzir movimento" ativado, não troca sozinho (só pelos indicadores).
     ------------------------------------------------------------------------ */
  /* Carregamento das fotos
     Marca cada foto com .is-loaded (e o quadro .media com .is-loaded) quando ela
     termina de baixar. O CSS usa isso para mostrar a cor de espera com um brilho
     leve e depois fazer a foto surgir suavemente.
     ------------------------------------------------------------------------ */
  const isLoaded = (img) => img.complete && img.naturalWidth > 0 && !img.dataset.src;

  /** Chama `callback` quando a foto terminar de carregar (ou falhar). */
  const whenLoaded = (img, callback) => {
    if (!img || isLoaded(img)) { callback(); return; }
    const done = () => {
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
      callback();
    };
    img.addEventListener('load', done);
    img.addEventListener('error', done);
  };

  function initImageLoading() {
    $$('.media > img, .hero__media > img, .video-frame__poster').forEach((img) => {
      whenLoaded(img, () => {
        img.classList.add('is-loaded');
        img.closest('.media')?.classList.add('is-loaded');
      });
    });
  }

  /** Troca data-src/data-srcset/data-sizes pelos atributos reais (inicia o download). */
  const loadDeferred = (img) => {
    if (!img.dataset.src) return;
    if (img.dataset.sizes) img.sizes = img.dataset.sizes;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.src;
    delete img.dataset.srcset;
    delete img.dataset.sizes;
    whenLoaded(img, () => img.classList.add('is-loaded'));
  };

  function initHeroSlides() {
    const slides = $$('[data-hero-slides] > img');
    const dotsWrap = $('[data-hero-dots]');
    if (slides.length < 2) {
      slides.forEach(loadDeferred);
      return;
    }

    const INTERVAL = 6000;
    const dots = dotsWrap ? $$('button', dotsWrap) : [];
    let current = 0;
    let timer = null;

    // A primeira foto entra com a animação original (classe is-intro). Na primeira
    // troca, congela o zoom no ponto atual para a transição seguir dali, sem salto.
    const endIntro = () => {
      const intro = slides.find((img) => img.classList.contains('is-intro'));
      if (!intro) return;
      intro.style.transform = getComputedStyle(intro).transform;
      intro.classList.remove('is-intro');
      void intro.offsetWidth; // aplica o valor congelado antes de liberar a transição
      intro.style.transform = '';
    };

    const show = (index) => {
      endIntro();
      current = (index + slides.length) % slides.length;
      slides.forEach((img, i) => img.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    };

    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      if (prefersReducedMotion || timer || !ready) return;
      timer = setInterval(() => {
        // se a próxima foto ainda não chegou, espera o próximo ciclo em vez de mostrar um quadro vazio
        const next = slides[(current + 1) % slides.length];
        if (isLoaded(next)) show(current + 1);
      }, INTERVAL);
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      stop();
      loadDeferred(slides[i]);
      show(i);
      start();
    }));
    if (dotsWrap) dotsWrap.hidden = false;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    // A primeira foto tem prioridade total. Só depois que ela aparece o carrossel
    // começa a girar e as demais fotos são baixadas (sem disputar a conexão com ela).
    let ready = false;
    whenLoaded(slides[0], () => {
      ready = true;
      slides.slice(1).forEach(loadDeferred);
      start();
    });
  }

  /* Vídeo de apresentação
     Lê SITE_CONFIG.videoUrl: YouTube, Vimeo ou arquivo de vídeo do projeto.
     Vazio ou não reconhecido → a seção continua oculta.
     O player só é carregado quando o visitante clica em "Assistir".
     ------------------------------------------------------------------------ */
  function getVideoEmbed(value) {
    if (!value) return null;
    try {
      const url = new URL(value, window.location.href);
      const host = url.hostname.replace(/^www\./, '');

      if (/^(youtube\.com|m\.youtube\.com|youtu\.be)$/.test(host)) {
        const id = host === 'youtu.be'
          ? url.pathname.slice(1)
          : url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
        if (!/^[\w-]{6,}$/.test(id || '')) return null;
        return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` };
      }

      if (/^(vimeo\.com|player\.vimeo\.com)$/.test(host)) {
        const id = url.pathname.split('/').filter(Boolean).pop();
        if (!/^\d+$/.test(id || '')) return null;
        return { type: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
      }

      if (/\.(mp4|webm|mov)$/i.test(url.pathname)) {
        return { type: 'file', src: value };
      }
    } catch {
      // URL inválida: a seção continua oculta
    }
    return null;
  }

  function initVideo() {
    const section = $('[data-video-section]');
    const frame = $('[data-video-frame]');
    const play = $('[data-video-play]');
    const embed = getVideoEmbed(SITE_CONFIG.videoUrl);
    if (!section || !frame || !play || !embed) return;

    section.hidden = false;

    play.addEventListener('click', () => {
      let player;
      if (embed.type === 'iframe') {
        player = document.createElement('iframe');
        player.src = embed.src;
        player.title = 'Vídeo de apresentação da Soft Garden Cabana Lounge';
        player.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        player.allowFullscreen = true;
      } else {
        player = document.createElement('video');
        player.src = embed.src;
        player.controls = true;
        player.autoplay = true;
        player.playsInline = true;
      }
      player.className = 'video-frame__player';
      frame.replaceChildren(player);
      frame.classList.add('is-playing');
      player.focus();
    });
  }

  /* Comodidades: o link "Ver todas" do cartão abre a lista completa
     ------------------------------------------------------------------------ */
  function initAmenities() {
    const details = $('[data-amenities]');
    if (!details) return;

    $$('[data-amenities-open]').forEach((link) => {
      link.addEventListener('click', () => { details.open = true; });
    });
    if (window.location.hash === `#${details.id}`) details.open = true;
  }

  /* Animações de entrada
     ------------------------------------------------------------------------ */
  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('has-reveal');

    // Fotos: a "cortina" só abre quando a foto já chegou, para a animação ser vista
    // com a imagem (e não abrir um quadro vazio). Limite de espera: 2,5 s.
    const reveal = (el) => {
      const img = el.dataset.reveal === 'media' ? $('img', el) : null;
      if (!img) { el.classList.add('is-visible'); return; }
      let shown = false;
      const show = () => { if (!shown) { shown = true; el.classList.add('is-visible'); } };
      whenLoaded(img, show);
      setTimeout(show, 2500);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    items.forEach((item) => observer.observe(item));
  }

  /* Galeria: filtro por ambiente + "Ver mais fotografias"
     - "Todas": mostra a seleção principal; itens com data-gallery-more ficam
       ocultos até o clique em "Ver mais".
     - Demais abas: mostram todas as fotos com o data-category correspondente,
       em grade uniforme.
     Sem JavaScript, todas as fotos aparecem e o filtro fica oculto.
     ------------------------------------------------------------------------ */
  function initGallery() {
    const grid = $('[data-gallery]');
    if (!grid) return;

    const items = $$('.gallery__item', grid);
    const filterBar = $('[data-gallery-filter]');
    const filterButtons = filterBar ? $$('[data-filter]', filterBar) : [];
    const moreWrap = $('[data-gallery-more-wrap]');
    const moreButton = $('[data-gallery-more-btn]');
    const extras = items.filter((item) => item.hasAttribute('data-gallery-more'));

    let filter = 'todas';
    let expanded = false;

    const apply = () => {
      const all = filter === 'todas';
      items.forEach((item) => {
        item.hidden = all
          ? item.hasAttribute('data-gallery-more') && !expanded
          : item.dataset.category !== filter;
      });
      grid.classList.toggle('gallery--filtered', !all);
      if (moreWrap) moreWrap.hidden = !all || expanded || !extras.length;
      filterButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter)));
    };

    // Quantidade de fotos em cada aba
    filterButtons.forEach((btn) => {
      const count = btn.dataset.filter === 'todas'
        ? items.length
        : items.filter((item) => item.dataset.category === btn.dataset.filter).length;
      if (!count) { btn.hidden = true; return; }
      const badge = document.createElement('span');
      badge.className = 'gallery-filter__count';
      badge.textContent = count;
      btn.append(badge);
      btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        apply();
      });
    });
    if (filterBar) filterBar.hidden = false;

    if (moreButton && extras.length) {
      $('[data-gallery-more-count]', moreButton).textContent = `(+${extras.length})`;
      moreButton.addEventListener('click', () => {
        expanded = true;
        moreButton.setAttribute('aria-expanded', 'true');
        apply();
        // Leva o foco para a primeira foto nova (o lightbox a torna focável)
        extras[0].focus({ preventScroll: true });
      });
    }

    apply();
  }
  /* Lightbox da galeria
     Ativa-se apenas para itens que já contêm uma <img> real e navega somente
     pelas fotos visíveis no momento (respeita o filtro e o "Ver mais").
     Opcional: data-full="img/photos/arquivo-grande.jpg" na <img> para a versão ampliada.
     ------------------------------------------------------------------------ */
  function initLightbox() {
    const dialog = $('[data-lightbox]');
    const images = $$('[data-gallery] img');
    if (!dialog || !images.length || typeof dialog.showModal !== 'function') return;

    const frame = $('[data-lightbox-frame]', dialog);
    const caption = $('[data-lightbox-caption]', dialog);
    const counter = $('[data-lightbox-counter]', dialog);
    const prev = $('[data-lightbox-prev]', dialog);
    const next = $('[data-lightbox-next]', dialog);
    let list = images;
    let current = 0;

    const visibleImages = () => images.filter((img) => !img.closest('.gallery__item').hidden);

    const show = (index) => {
      current = (index + list.length) % list.length;
      const source = list[current];
      const img = document.createElement('img');
      img.src = source.dataset.full || source.currentSrc || source.src;
      img.alt = source.alt;
      frame.replaceChildren(img);
      caption.textContent = source.alt;
      counter.textContent = `${current + 1} / ${list.length}`;
    };

    const open = (source) => {
      list = visibleImages();
      const single = list.length < 2;
      prev.hidden = single;
      next.hidden = single;
      show(Math.max(0, list.indexOf(source)));
      dialog.showModal();
    };

    images.forEach((img, index) => {
      const figure = img.closest('.gallery__item');
      if (!figure) return;
      figure.classList.add('is-zoomable');
      figure.tabIndex = 0;
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', `Ampliar fotografia: ${img.alt || `galeria ${index + 1}`}`);
      figure.addEventListener('click', () => open(img));
      figure.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(img);
        }
      });
    });

    prev.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    $('[data-lightbox-close]', dialog).addEventListener('click', () => dialog.close());

    dialog.addEventListener('keydown', (event) => {
      if (list.length < 2) return;
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });

    // Clique fora da imagem (no fundo do diálogo) fecha
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog || event.target === frame) dialog.close();
    });

    dialog.addEventListener('close', () => frame.replaceChildren());
  }
  /* Ano atual no rodapé
     ------------------------------------------------------------------------ */
  function initYear() {
    const year = String(new Date().getFullYear());
    $$('[data-year]').forEach((el) => { el.textContent = year; });
  }

  /* Inicialização
     ------------------------------------------------------------------------ */
  initHeader();
  initMobileMenu();
  initActiveNav();
  initBookingLinks();
  initContactLinks();
  initImageLoading();
  initHeroSlides();
  initAmenities();
  initVideo();
  initReveal();
  initGallery();
  initLightbox();
  initYear();
})();
