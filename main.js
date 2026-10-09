const cursor = document.querySelector('.cursor');
const header = document.querySelector('.site-header');
const projectSection = document.querySelector('.projects');
const projectCards = [...document.querySelectorAll('.project')];
const focusText = document.querySelector('.about-lead');
const hero = document.querySelector('.hero');
const portrait = document.querySelector('.portrait-placeholder');
const heroName = document.querySelector('.hero-name');
const scrollAnimatedSections = [...document.querySelectorAll('.services-visual, .skills, .contact')];
const pageLoader = document.querySelector('#page-loader');
const loaderCounter = document.querySelector('#loader-counter');
const loaderStatus = document.querySelector('#loader-status');
const loaderTerminal = document.querySelector('#loader-terminal');
const terminalOutput = document.querySelector('#terminal-output');
const loaderSheet = document.querySelector('.loader-sheet');
let portraitTarget = null;
document.body.classList.add('is-loading');

const terminalLines = [
  '$ whoami                              adrian',
  '$ uname -a                            PortfolioOS 2026 x86_64',
  '$ sudo systemctl start visual-engine  [ OK ]',
  '[auth] secure session established',
  '[boot] loading kernel modules ........ done',
  '[boot] checking permission matrix .... done',
  '[net ] handshake /localhost:4173 ..... connected',
  '[deps] resolving interface packages .. 42 modules',
  '[deps] cache warmed .................. 128 assets',
  '[ui  ] compiling motion system ....... done',
  '[ui  ] mounting scroll observers ...... done',
  '[img ] decoding profile portrait ...... 1024x1536',
  '[3d  ] initializing perspective ...... 1400px',
  '[test] checking responsive layout .... passed',
  '[test] checking interaction states .... passed',
  '[sys ] memory allocation ............. stable',
  '[sys ] thread pool ................... 08 workers',
  '[sys ] event loop .................... synchronized',
  '[db  ] opening local data channel ..... connected',
  '[db  ] indexing project metadata ....... complete',
  '[auth] token rotation ................. verified',
  '[auth] access policy ................... enforced',
  '[cache] binary stream cache ........... warm',
  '[perf] frame budget ................... 60fps',
  '[perf] layout shift ................... 0.00',
  '[perf] image decode ................... optimized',
  '[css ] responsive breakpoints .......... loaded',
  '[css ] motion preferences .............. detected',
  '[web ] semantic nodes .................. mounted',
  '[web ] navigation anchors .............. linked',
  '[3d  ] card depth layers ............... aligned',
  '[3d  ] pointer interaction ............. armed',
  '[scan] searching visual modules ...........',
  '[scan] searching profile data ............',
  '[scan] searching available routes ........',
  '[sys ] visual experience ............. ready',
  '> launching portfolio interface ...... READY',
  '> SEARCHING.....'
];

const binaryField = document.querySelector('#binary-field');
for (let column = 0; column < 30; column += 1) {
  const stream = document.createElement('span');
  stream.className = 'binary-stream';
  stream.style.setProperty('--stream-delay', `${(column % 7) * -0.7}s`);
  stream.style.setProperty('--stream-duration', `${3 + (column % 4)}s`);
  stream.textContent = Array.from({ length: 44 }, () => Math.random() > .5 ? '1' : '0').join('\n');
  binaryField.appendChild(stream);
}

const revealTerminalLines = () => {
  terminalLines.forEach((line, index) => {
    window.setTimeout(() => {
      const lineElement = document.createElement('div');
      lineElement.textContent = line;
      terminalOutput.appendChild(lineElement);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, index * 135);
  });
};

let loaderProgress = 0;
const loaderStartedAt = performance.now();
const loaderTimer = window.setInterval(() => {
  loaderProgress = Math.min(100, Math.round(((performance.now() - loaderStartedAt) / 7000) * 100));
  loaderCounter.textContent = String(Math.min(loaderProgress, 100)).padStart(2, '0');
  if (loaderProgress >= 20 && !pageLoader.classList.contains('terminal-open')) {
    pageLoader.classList.add('terminal-open');
    loaderStatus.textContent = 'TERMINAL ONLINE';
    loaderTerminal.setAttribute('aria-hidden', 'false');
    revealTerminalLines();
  }
  if (loaderProgress >= 80 && !pageLoader.classList.contains('portrait-open')) {
    const bounds = portrait.getBoundingClientRect();
    portraitTarget = { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height };
    pageLoader.classList.add('portrait-open');
    hero.classList.add('is-portrait-hovered');
    portrait.classList.add('is-loader-portrait');
  }
  if (loaderProgress >= 100) {
    window.clearInterval(loaderTimer);
    loaderStatus.textContent = 'READY';
    pageLoader.classList.add('sheet-open');
    loaderSheet.setAttribute('aria-hidden', 'false');
    loaderSheet.style.height = '100vh';
    if (portraitTarget) {
      portrait.classList.add('is-loader-settling');
      portrait.style.top = `${portraitTarget.top}px`;
      portrait.style.left = `${portraitTarget.left}px`;
      portrait.style.width = `${portraitTarget.width}px`;
      portrait.style.height = `${portraitTarget.height}px`;
      portrait.style.transform = 'translate(0, 0) scale(1)';
    }
    window.setTimeout(() => pageLoader.classList.add('is-complete'), 1250);
    window.setTimeout(() => {
      pageLoader.remove();
      portrait.classList.remove('is-loader-portrait');
      portrait.classList.remove('is-loader-settling');
      portrait.style.removeProperty('top');
      portrait.style.removeProperty('left');
      portrait.style.removeProperty('width');
      portrait.style.removeProperty('height');
      portrait.style.removeProperty('transform');
      hero.classList.remove('is-portrait-hovered');
      document.body.classList.remove('is-loading');
    }, 1800);
  }
}, 34);

portrait.addEventListener('mouseenter', () => hero.classList.add('is-portrait-hovered'));
portrait.addEventListener('mouseleave', () => hero.classList.remove('is-portrait-hovered'));
heroName.addEventListener('animationend', () => heroName.classList.add('is-ready'));
window.setTimeout(() => heroName.classList.add('is-ready'), 1600);

document.querySelectorAll('.word-reveal').forEach((element) => {
  element.innerHTML = element.textContent.trim().split(/\s+/).map((word) => `<span class="word">${word}</span>`).join(' ');
});

const letterMotionTargets = document.querySelectorAll('.word-reveal, .section-index, .manifesto-bottom p, .about-copy p, .tech-heading h2, .tech-row h3, .project-info p, .contact-content > p, .contact-link');
const hoverMessages = new Map([
  ['.manifesto h1', 'MI MÉTODO: OBSERVAR · PENSAR · CREAR'],
  ['.about-lead', 'MI ENFOQUE: CLARIDAD QUE SE CONVIERTE EN IMPACTO'],
  ['.about-copy p', 'DEL BRIEF A UNA EXPERIENCIA QUE FUNCIONA'],
  ['.tech-heading h2', 'STACK / HERRAMIENTAS QUE DOMINO'],
  ['.projects-heading h2', 'SELECCIÓN / TRABAJO CON INTENCIÓN'],
  ['.contact h2', 'DISPONIBLE / HABLEMOS DE TU IDEA']
]);

hoverMessages.forEach((message, selector) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.dataset.message = message;
    element.classList.add('has-hover-message');
    if (selector === '.manifesto h1') element.classList.add('hover-editorial');
    if (selector === '.about-lead' || selector === '.about-copy p') element.classList.add('hover-process');
  });
});

document.querySelectorAll('.project-info h3').forEach((element, index) => {
  element.dataset.message = ['01 / IDENTIDAD + WEB', '02 / PRODUCTO DIGITAL', '03 / DIRECCIÓN DE ARTE'][index];
  element.classList.add('has-hover-message');
});

letterMotionTargets.forEach((element) => {
  element.classList.add('letter-motion');
  if (element.classList.contains('word-reveal')) {
    element.querySelectorAll('.word').forEach((word) => {
      word.innerHTML = [...word.textContent].map((character) => `<span class="char">${character === ' ' ? '&nbsp;' : character}</span>`).join('');
    });
  } else {
    element.innerHTML = [...element.textContent].map((character) => `<span class="char">${character === ' ' ? '&nbsp;' : character}</span>`).join('');
  }
  element.querySelectorAll('.char').forEach((character, index) => character.style.setProperty('--char-index', index));
});

window.addEventListener('pointermove', (event) => {
  cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
});

document.querySelectorAll('a, .media-placeholder').forEach((element) => {
  element.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
  element.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
});

document.querySelectorAll('.project').forEach((card) => {
  card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
  card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    card.dataset.tiltX = String(y * -2.2);
    card.dataset.tiltY = String(x * 2.8);
    updateScrollMotion();
  });
  card.addEventListener('pointerleave', () => {
    card.dataset.tiltX = '0';
    card.dataset.tiltY = '0';
    updateScrollMotion();
  });
});

const updateFocusShadow = () => {
  if (!focusText) return;
  const words = [...focusText.querySelectorAll('.word')];
  const focusLine = window.innerHeight * 0.48;
  const focusRange = Math.max(180, window.innerHeight * 0.46);
  words.forEach((word, index) => {
    const bounds = word.getBoundingClientRect();
    const distance = Math.abs((bounds.top + bounds.height / 2) - focusLine);
    const intensity = Math.max(0, Math.min(1, 1 - distance / focusRange));
    const red = Math.round(78 + intensity * 170);
    const green = Math.round(78 + intensity * 170);
    const blue = Math.round(78 + intensity * 170);
    word.style.color = `rgb(${red}, ${green}, ${blue})`;
    word.style.opacity = String(0.52 + intensity * 0.48);
    word.style.filter = `blur(${(1 - intensity) * 1.4}px)`;
    word.style.textShadow = intensity > 0.72 ? `0 0 ${Math.round(intensity * 20)}px rgba(255,255,255,${(intensity * 0.16).toFixed(2)})` : 'none';
    word.style.setProperty('--focus-delay', `${index * 25}ms`);
  });
  focusText.style.setProperty('--focus-progress', `${Math.max(0, Math.min(1, (focusLine - focusText.getBoundingClientRect().top) / Math.max(1, focusText.offsetHeight)) )}`);
};

const updateScrollMotion = () => {
  const scrollTop = window.scrollY;
  const projectTop = projectSection.offsetTop;
  const projectProgress = Math.max(0, Math.min(1, (scrollTop - projectTop + window.innerHeight * 0.55) / (window.innerHeight * 2.1)));
  const darkSections = [...document.querySelectorAll('.dark-section')];
  const onDark = darkSections.some((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top < window.innerHeight * 0.45 && bounds.bottom > window.innerHeight * 0.45;
  });
  header.classList.toggle('is-on-dark', onDark);
  document.querySelectorAll('.section-rule').forEach((section) => {
    const bounds = section.getBoundingClientRect();
    const isInView = bounds.top < window.innerHeight * 0.82 && bounds.bottom > window.innerHeight * 0.18;
    section.classList.toggle('is-visible', isInView);
    section.querySelectorAll('.word-reveal').forEach((reveal) => reveal.classList.toggle('is-visible', isInView));
    const distanceFromCenter = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight;
    section.style.setProperty('--scroll-drift', `${Math.max(-1, Math.min(1, distanceFromCenter))}`);
  });
  scrollAnimatedSections.forEach((section) => {
    const bounds = section.getBoundingClientRect();
    const isInView = bounds.top < window.innerHeight * 0.86 && bounds.bottom > window.innerHeight * 0.14;
    section.classList.toggle('is-scroll-visible', isInView);
  });
  updateFocusShadow();
  projectCards.forEach((card, index) => {
    const cardProgress = Math.max(0, Math.min(1, projectProgress * projectCards.length - index));
    const scale = 1 - Math.min(cardProgress, 1) * (0.15 + index * 0.025);
    const offset = index * 18 - cardProgress * 18;
    const rotateX = cardProgress * -5 + Number(card.dataset.tiltX || 0);
    const rotateY = Number(card.dataset.tiltY || 0);
    const rotateZ = (index - 1) * 0.7;
    const depth = index * 24;
    card.style.transform = `translateY(${offset}px) translateZ(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
    card.style.zIndex = String(index + 1);
  });
};

window.addEventListener('scroll', updateScrollMotion, { passive: true });
updateScrollMotion();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
    entry.target.querySelectorAll('.word-reveal').forEach((reveal) => reveal.classList.toggle('is-visible', entry.isIntersecting));
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-rule').forEach((element) => revealObserver.observe(element));
