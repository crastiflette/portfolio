(() => {
  // Métadonnées des sections — sert au curseur de la dorsale et à la nav active
  const sectionsMeta = [
    { id: 'haut',         label: 'En tête'     },
    { id: 'apropos',      label: 'À propos'    },
    { id: 'projets',      label: 'Projets'     },
    { id: 'competences',  label: 'Compétences' },
    { id: 'contact',      label: 'Contact'     }
  ];

  const root        = document.documentElement;
  const curSection  = document.querySelector('.curseur .cur-section');
  const navLinks    = document.querySelectorAll('nav.top ul a[data-section]');
  const ticks       = document.querySelectorAll('.dorsale .tick');

  // Position de chaque tick sur la dorsale, proportionnelle à l'offset de sa section
  function placeTicks(){
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    ticks.forEach(t => {
      const el = document.getElementById(t.dataset.section);
      if (!el) return;
      const pct = Math.min(1, Math.max(0, el.offsetTop / maxScroll));
      t.style.setProperty('--pos-pct', pct);
    });
  }

  function currentSectionId(){
    const trigger = window.innerHeight * 0.35;
    let current = sectionsMeta[0].id;
    for (const s of sectionsMeta) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top - trigger <= 0) {
        current = s.id;
      }
    }
    return current;
  }

  let ticking = false;
  function update(){
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    root.style.setProperty('--scroll-pct', pct);

    const cur = currentSectionId();
    const curIdx = sectionsMeta.findIndex(s => s.id === cur);
    const meta = sectionsMeta[curIdx];

    if (curSection.textContent !== meta.label) curSection.textContent = meta.label;

    ticks.forEach((t, i) => {
      t.classList.toggle('passe', i <= curIdx);
    });
    navLinks.forEach(a => {
      a.classList.toggle('actif', a.dataset.section === cur);
    });

    ticking = false;
  }

  function onScroll(){
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { placeTicks(); update(); });
  window.addEventListener('load',   () => { placeTicks(); update(); });
  placeTicks();
  update();

  // Révélation au défilement
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); }
    });
  }, { threshold:.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
