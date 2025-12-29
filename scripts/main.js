// Small helpers for the paper page
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const copyBtn = document.getElementById('copyBibtex');
  const bib = document.getElementById('bibcode');
  if (copyBtn && bib) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(bib.innerText.trim());
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy BibTeX'), 1500);
      } catch (e) {
        copyBtn.textContent = 'Press Ctrl/Cmd+C to copy';
        const range = document.createRange();
        range.selectNode(bib);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    });
  }

  // Mobile nav toggle
  const nav = document.querySelector('.top-nav');
  const toggle = document.querySelector('.nav-toggle');
  const linksWrap = document.getElementById('site-menu');
  if (toggle && nav && linksWrap){
    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      document.body.classList.remove('menu-open');
    };
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    linksWrap.addEventListener('click', (e) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'A') closeMenu();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // Active nav highlight on scroll
  const sections = document.querySelectorAll('main section[id]');
  const links = Array.from(document.querySelectorAll('.top-nav .nav-links a'));
  const linkFor = (id) => links.find(a => a.getAttribute('href') === `#${id}`);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = linkFor(id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px', threshold: [0, 1] });
  sections.forEach(s => io.observe(s));
});
