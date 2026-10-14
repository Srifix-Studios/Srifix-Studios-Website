(function () {
  'use strict';

  const ICON = '<i data-lucide="arrow-up-right" aria-hidden="true">➜</i>';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function makeTestimonialCard(data) {
    const card = el('article', 'testimonial-card');
    const head = el('div', 'card-head');

    const flag = el('img', 'flag');
    flag.src = data.country;
    flag.alt = data.name + ' flag';

    const info = el('div');
    info.appendChild(el('h4', 'name', data.name));
    info.appendChild(el('p', 'role', data.role));

    head.appendChild(flag);
    head.appendChild(info);

    card.appendChild(head);
    card.appendChild(el('div', 'stars', '★★★★★'));
    card.appendChild(el('p', 'quote', data.text));
    return card;
  }

  function makePricingCard(plan) {
    const card = el('div', plan.featured ? 'pricing-card featured card' : 'pricing-card card');
    if (plan.featured){
const glow = el('div', 'glow');

  glow.innerHTML = `
    <div class="wave wave1"></div>
    <div class="wave wave2"></div>
  `;

  card.appendChild(glow);
    } 

    card.appendChild(el('p', 'title', plan.title));
    card.appendChild(el('h2', 'price', plan.price));
    card.appendChild(el('span', 'tag', plan.tag));

    const list = el('ul', 'features');
    plan.features.forEach((feature) => {
      const li = el('li');
      li.appendChild(el('span', 'bar'));
      li.appendChild(el('span', null, feature));
      list.appendChild(li);
    });
    card.appendChild(list);

    const btn = el('button', 'btn');
    btn.type = 'button';
    btn.innerHTML = 'View Details ' + ICON;

    const wrap = el('div', 'btn-wrap');
    wrap.appendChild(btn);
    card.appendChild(wrap);

    return card;
  }

 
  const pricingGrid = document.getElementById('pricing-grid');
  if (pricingGrid && typeof pricingPlans !== 'undefined') {
    pricingPlans.forEach((plan) => pricingGrid.appendChild(makePricingCard(plan)));
  }

  function makeQuestionCard(faq) {
    const item = el('article', 'question-item');

    const q = el('button', 'question-q');
    q.type = 'button';
    q.setAttribute('aria-expanded', 'false');
    q.appendChild(el('span', null, faq.q));

    const chevron = el('span', 'question-chevron');
    chevron.innerHTML = '<i data-lucide="chevron-down" aria-hidden="true"></i>';
    q.appendChild(chevron);

    const a = el('div', 'question-a');
    a.appendChild(el('p', null, faq.a));

    item.appendChild(q);
    item.appendChild(a);
    return item;
  }

  const questionList = document.getElementById('question-list');
  if (questionList && typeof faqs !== 'undefined') {
    faqs.forEach((faq) => questionList.appendChild(makeQuestionCard(faq)));

    // Accordion: clicking a question opens it smoothly and closes the others.
    questionList.addEventListener('click', (event) => {
      const item = event.target.closest('.question-item');
      if (!item) return;

      const willOpen = !item.classList.contains('open');
      questionList.querySelectorAll('.question-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        const btn = openItem.querySelector('.question-q');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.classList.add('open');
        const btn = item.querySelector('.question-q');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }



})();


  // ---- Mouse trail:(cyan → blue → violet → purple → orange → gold) ----
  const trailColors = ['cyan', 'blue', 'violet', 'purple', 'orange', 'gold'];

  trailColors.forEach((name) => {
    const el = document.createElement('div');
    el.className = 'light light--' + name;
    document.body.appendChild(el);
  });

  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.light').forEach((el) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  });

