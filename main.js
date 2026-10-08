const cursor = document.querySelector('.cursor');
const header = document.querySelector('.site-header');
const projectSection = document.querySelector('.projects');
const projectCards = [...document.querySelectorAll('.project')];
const focusText = document.querySelector('.about-lead');

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
