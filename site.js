// geocrowd · petits comportements du site : copie des blocs de code, onglets, sommaire.
(() => {
  // Bouton « Copier » sur chaque bloc de code.
  for (const pre of document.querySelectorAll('pre')) {
    let box = pre.closest('.code');
    if (!box) {
      box = document.createElement('div');
      box.className = 'code';
      pre.replaceWith(box);
      box.append(pre);
    }
    if (box.querySelector('.copy')) continue;
    // Barre de titre, même vide, pour que le bouton ne recouvre pas le code.
    if (!box.querySelector(':scope > .code-title')) {
      const bar = document.createElement('div');
      bar.className = 'code-title';
      box.prepend(bar);
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.textContent = 'copier';
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
        button.textContent = 'copié';
      } catch {
        button.textContent = 'échec';
      }
      setTimeout(() => { button.textContent = 'copier'; }, 1500);
    });
    box.append(button);
  }

  // Libellés de colonnes, pour l'affichage des tableaux en fiches sur téléphone.
  for (const table of document.querySelectorAll('.table-scroll table')) {
    const labels = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    for (const row of table.querySelectorAll('tbody tr')) {
      [...row.cells].forEach((cell, i) => { if (labels[i]) cell.dataset.label = labels[i]; });
    }
  }

  // Onglets (curl / JavaScript…) : sans JavaScript, tous les blocs restent visibles.
  const groups = [];
  document.querySelectorAll('.tabs').forEach((tabs, g) => {
    const panels = [...tabs.querySelectorAll(':scope > .code[data-label]')];
    if (panels.length < 2) return;
    const list = document.createElement('div');
    list.className = 'tab-list';
    list.setAttribute('role', 'tablist');
    const buttons = panels.map((panel, i) => {
      panel.id ||= `onglet-${g}-${i}`;
      panel.setAttribute('role', 'tabpanel');
      const title = panel.querySelector(':scope > .code-title');
      if (title) title.textContent = '';
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panel.id);
      button.textContent = panel.dataset.label;
      button.addEventListener('click', () => selectAll(panel.dataset.label));
      button.addEventListener('keydown', (e) => {
        const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        const next = buttons[(i + step + buttons.length) % buttons.length];
        next.focus();
        next.click();
      });
      list.append(button);
      return button;
    });
    tabs.prepend(list);
    const select = (label) => {
      if (!panels.some((p) => p.dataset.label === label)) return;
      panels.forEach((panel, i) => {
        const on = panel.dataset.label === label;
        panel.hidden = !on;
        buttons[i].setAttribute('aria-selected', String(on));
        buttons[i].tabIndex = on ? 0 : -1;
      });
    };
    select(panels[0].dataset.label);
    groups.push(select);
  });
  // Choisir un langage l'applique à toute la page.
  const selectAll = (label) => groups.forEach((select) => select(label));

  // Sommaire : replié sur petit écran, section courante surlignée.
  const toc = document.querySelector('.toc');
  if (!toc) return;
  const details = toc.querySelector('details');
  const narrow = window.matchMedia('(max-width: 1023px)');
  const sync = () => { details.open = !narrow.matches; };
  sync();
  narrow.addEventListener('change', sync);
  toc.addEventListener('click', (e) => {
    if (e.target.closest('a') && narrow.matches) details.open = false;
  });

  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const targets = links
    .map((link) => [link, document.getElementById(decodeURIComponent(link.hash.slice(1)))])
    .filter(([, el]) => el);
  let ticking = false;
  const update = () => {
    ticking = false;
    const limit = window.innerHeight * 0.25;
    let current = targets[0];
    for (const entry of targets) {
      if (entry[1].getBoundingClientRect().top - limit <= 0) current = entry;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = targets[targets.length - 1];
    }
    links.forEach((link) => link.classList.toggle('active', link === current[0]));
    // Les sections parentes restent repérables.
    const parent = current[0].closest('ol')?.closest('li')?.querySelector(':scope > a');
    if (parent) parent.classList.add('active');
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
})();
