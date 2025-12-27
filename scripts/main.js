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
