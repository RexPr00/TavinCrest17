(() => {
  const body = document.body;
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const burger = document.querySelector('[data-burger]');
  const closeDrawerBtn = document.querySelector('[data-close-drawer]');
  const langWraps = document.querySelectorAll('.lang-wrap');
  let activeTrap = null;

  const focusTrap = (container) => {
    const nodes = container.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])');
    if (!nodes.length) return () => {};
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    container.addEventListener('keydown', onKey);
    first.focus();
    return () => container.removeEventListener('keydown', onKey);
  };

  const closeDrawer = () => {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    body.style.overflow = '';
    if (activeTrap) activeTrap();
    activeTrap = null;
  };

  const openDrawer = () => {
    if (!drawer || !backdrop) return;
    drawer.classList.add('open');
    backdrop.classList.add('show');
    body.style.overflow = 'hidden';
    activeTrap = focusTrap(drawer);
  };

  burger?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      document.querySelectorAll('.lang-wrap.open').forEach((el) => el.classList.remove('open'));
      closeModal();
    }
  });

  langWraps.forEach((wrap) => {
    const button = wrap.querySelector('.lang-pill');
    button?.addEventListener('click', () => {
      const isOpen = wrap.classList.contains('open');
      langWraps.forEach((el) => el.classList.remove('open'));
      if (!isOpen) wrap.classList.add('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-wrap')) langWraps.forEach((el) => el.classList.remove('open'));
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.querySelector('.faq-btn')?.addEventListener('click', () => {
      faqItems.forEach((f) => { if (f !== item) f.classList.remove('active'); });
      item.classList.toggle('active');
    });
  });

  const modal = document.querySelector('[data-modal]');
  const openModalBtn = document.querySelector('[data-open-privacy]');
  const closeModalBtns = document.querySelectorAll('[data-close-privacy]');

  function openModal() {
    if (!modal) return;
    modal.classList.add('show');
    body.style.overflow = 'hidden';
    activeTrap = focusTrap(modal.querySelector('.modal'));
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    if (!drawer?.classList.contains('open')) body.style.overflow = '';
    if (activeTrap) activeTrap();
    activeTrap = null;
  }

  openModalBtn?.addEventListener('click', openModal);
  closeModalBtns.forEach((btn) => btn.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();
