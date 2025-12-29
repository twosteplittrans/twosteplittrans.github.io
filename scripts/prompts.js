document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (duplicate small helper to avoid adding another file)
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

  const titleEl = document.getElementById('promptTitle');
  const bodyEl = document.getElementById('promptBody');
  const copyBtn = document.getElementById('copyBtn');
  const dlBtn = document.getElementById('downloadBtn');
  const links = Array.from(document.querySelectorAll('.prompt-link'));

  function setActiveLink(href){
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href')===href));
  }

  async function load(fileHref){
    try {
      setActiveLink(fileHref);
      const link = links.find(a => a.getAttribute('href')===fileHref);
      const src = link?.dataset.file;
      if(!src) return;
      const res = await fetch(src);
      const md = await res.text();
      const html = window.SimpleMarkdown.render(md);
      // Title from first H1 or link text fallback
      const m = /^#\s+(.+)$/m.exec(md);
      titleEl.textContent = m ? m[1].trim() : link.textContent.trim();
      bodyEl.innerHTML = html;
      // update download link
      dlBtn.href = src;
      // scroll into view on mobile
      if (window.innerWidth < 800) {
        document.querySelector('.prompts-content').scrollIntoView({behavior:'smooth'});
      }
      // Update document title
      document.title = `${titleEl.textContent} — Prompts`;
    } catch (e) {
      bodyEl.innerHTML = `<p>Failed to load prompt.</p>`;
    }
  }

  function currentFromHash(){
    const h = location.hash || '#ruler.md';
    return h;
  }

  window.addEventListener('hashchange', ()=> load(currentFromHash()));
  load(currentFromHash());

  if (copyBtn){
    copyBtn.addEventListener('click', async () => {
      const text = bodyEl.innerText;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        setTimeout(()=> copyBtn.textContent = 'Copy page', 1200);
      } catch {
        copyBtn.textContent = 'Press Ctrl/Cmd+C';
      }
    });
  }
});
