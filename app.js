(() => {
  const STORAGE_KEY = 'sonalzaSongDraftV2';
  const FEEDBACK_KEY = 'sonalzaExitFeedbackV2';
  const page = document.body.dataset.page;
  const CURRENCY_KEY = 'sonalzaCurrencyV3';
  const PRICING = {
    song: { USD: 39, MXN: 659 },
    premium: { USD: 29, MXN: 549 },
    rush: { USD: 19, MXN: 349 },
    video: { USD: 29, MXN: 549 },
    second: { USD: 25, MXN: 449 }
  };
  const LIST_PRICING = {
    song: { USD: 59, MXN: 999 }
  };

  let currentCurrency = localStorage.getItem(CURRENCY_KEY) === 'MXN' ? 'MXN' : 'USD';

  const formatMoney = (amount, currency = currentCurrency) => {
    const value = Number(amount || 0).toLocaleString(currency === 'MXN' ? 'es-MX' : 'en-US', { maximumFractionDigits: 0 });
    return currency === 'MXN' ? `MX$${value}` : `US$${value}`;
  };

  function applyCurrencyDisplay() {
    document.documentElement.dataset.currency = currentCurrency;
    document.querySelectorAll('.currency-btn').forEach(btn => {
      const active = btn.dataset.currency === currentCurrency;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    document.querySelectorAll('.price-value, .compare-price, .savings-value').forEach(el => {
      const raw = currentCurrency === 'MXN' ? el.dataset.mxn : el.dataset.usd;
      if (raw) el.textContent = formatMoney(raw);
    });
    document.querySelectorAll('.price-code').forEach(el => { el.textContent = currentCurrency; });
  }

  function setupCurrencySwitch() {
    document.querySelectorAll('.currency-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.currency === 'MXN' ? 'MXN' : 'USD';
        if (next === currentCurrency) return;
        currentCurrency = next;
        localStorage.setItem(CURRENCY_KEY, currentCurrency);
        applyCurrencyDisplay();
        window.dispatchEvent(new CustomEvent('sonalza:currencychange', { detail: { currency: currentCurrency } }));
      });
    });
    applyCurrencyDisplay();
  }

  const defaultData = {
    paraQuien: '',
    nombre: '',
    ocasion: '',
    genero: '',
    voz: '',
    idioma: 'Español',
    cualidades: '',
    recuerdo: '',
    frase: '',
    emocion: '',
    email: '',
    telefono: ''
  };

  const load = () => {
    try { return { ...defaultData, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) }; }
    catch { return { ...defaultData }; }
  };
  const save = data => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  function setupExitIntent() {
    const modal = document.getElementById('exitModal');
    if (!modal) return;
    const close = document.getElementById('closeModal');
    let shown = false;
    const open = () => {
      if (shown) return;
      shown = true;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };
    const hide = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };
    document.addEventListener('mouseout', e => {
      if (e.clientY <= 0 && !e.relatedTarget) open();
    });
    close?.addEventListener('click', hide);
    modal.addEventListener('click', e => { if (e.target === modal) hide(); });
    modal.querySelectorAll('.reason').forEach(btn => {
      btn.addEventListener('click', () => {
        const payload = { reason: btn.dataset.reason, page: location.pathname, at: new Date().toISOString() };
        const previous = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
        previous.push(payload);
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(previous));
        hide();
      });
    });
  }

  if (page === 'home') {
    const sticky = document.querySelector('.mobile-sticky-cta');
    if (sticky) {
      const syncSticky = () => {
        sticky.classList.toggle('is-visible', window.scrollY > 520);
      };
      window.addEventListener('scroll', syncSticky, { passive: true });
      syncSticky();
    }
  }

  if (page === 'create') {
    const data = load();
    let step = 0;
    const question = document.getElementById('question');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const stepLabel = document.getElementById('stepLabel');
    const pctLabel = document.getElementById('pctLabel');
    const bar = document.getElementById('bar');

    const optionButtons = (items, selected, key) => `
      <div class="option-grid">
        ${items.map(item => `<button type="button" class="option ${selected === item ? 'selected' : ''}" data-key="${key}" data-value="${item}">${item}</button>`).join('')}
      </div>`;

    const steps = [
      () => `
        <div class="smallcaps">Paso 1</div>
        <h1>¿Para quién es esta canción?</h1>
        <p class="sub">Elige a la persona que recibirá esta historia.</p>
        ${optionButtons(['Esposo','Esposa','Pareja','Novio','Novia','Papá','Mamá','Hijo','Hija','Abuelo/a','Hermano/a','Amigo/a','Para mí','Otro'], data.paraQuien, 'paraQuien')}`,
      () => `
        <div class="smallcaps">Paso 2</div>
        <h1>¿Cómo se llama?</h1>
        <p class="sub">Escribe su primer nombre o el nombre que quieres escuchar en la canción.</p>
        <div class="form-box"><label for="nombre">Nombre</label><input id="nombre" maxlength="60" placeholder="Ejemplo: Julián" value="${escapeHtml(data.nombre)}"></div>`,
      () => `
        <div class="smallcaps">Paso 3</div>
        <h1>¿Cuál es la ocasión?</h1>
        <p class="sub">Dinos qué momento estamos convirtiendo en canción.</p>
        ${optionButtons(['Porque sí','Te amo','Cumpleaños','Aniversario','Te extraño','Gracias','Perdón','Boda','Amistad','En memoria','Logro especial','Propuesta','Jubilación','Graduación','Otra ocasión'], data.ocasion, 'ocasion')}`,
      () => `
        <div class="smallcaps">Paso 4</div>
        <h1>Elige el estilo de la canción</h1>
        <p class="sub">Selecciona un género, una voz y el idioma de la canción.</p>
        ${optionButtons(['Corrido','Banda','Norteño','Cumbia','Mariachi','Duranguense','Huapango','Sierreño','Pop Latino','Reguetón','Balada','Sorpréndeme'], data.genero, 'genero')}
        <div class="dual-grid">
          <div><div class="helper" style="text-align:center;margin-bottom:10px">Voz</div>${optionButtons(['Masculina','Femenina','Sorpréndeme'], data.voz, 'voz')}</div>
          <div><div class="helper" style="text-align:center;margin-bottom:10px">Idioma de la canción</div>${optionButtons(['Español','Inglés','Bilingüe'], data.idioma, 'idioma')}</div>
        </div>`,
      () => `
        <div class="smallcaps">Paso 5</div>
        <h1>¿Qué hace especial a ${escapeHtml(data.nombre) || 'esta persona'}?</h1>
        <p class="sub">Descríbela con tus propias palabras. Una o dos frases claras suelen dar mejores resultados.</p>
        <div class="form-box"><label for="cualidades">Sus mejores cualidades</label><textarea id="cualidades" placeholder="Ejemplo: Siempre ha cuidado de nuestra familia, tiene un gran sentido del humor y nunca deja que nadie se rinda.">${escapeHtml(data.cualidades)}</textarea><div class="helper">Incluye personalidad, valores, forma de ser y lo que más admiras.</div></div>`,
      () => `
        <div class="smallcaps">Paso 6</div>
        <h1>Comparte un recuerdo inolvidable</h1>
        <p class="sub">Los detalles específicos hacen que la canción se sienta verdaderamente personal.</p>
        <div class="form-box"><label for="recuerdo">Momento especial</label><textarea id="recuerdo" placeholder="¿Cómo se conocieron? ¿Qué momento nunca olvidarán? ¿Hay alguna anécdota, viaje, lugar o frase que siempre recuerden?">${escapeHtml(data.recuerdo)}</textarea></div>`,
      () => `
        <div class="smallcaps">Paso 7</div>
        <h1>¿Qué quieres que sienta al escucharla?</h1>
        <p class="sub">Dinos el mensaje que debe quedar en el corazón de quien la reciba.</p>
        <div class="dual-grid">
          <div class="form-box"><label for="frase">Frase que te gustaría escuchar <span class="helper">(opcional)</span></label><textarea id="frase" placeholder="Ejemplo: Gracias por cruzar fronteras por nosotros.">${escapeHtml(data.frase)}</textarea></div>
          <div class="form-box"><label for="emocion">Mensaje principal</label><textarea id="emocion" placeholder="¿Qué quieres que sepa, sienta o recuerde cuando termine la canción?">${escapeHtml(data.emocion)}</textarea></div>
        </div>`,
      () => `
        <div class="smallcaps">Paso final</div>
        <h1>¿A dónde enviamos tu canción?</h1>
        <p class="sub">Revisa que tus datos estén correctos para que la canción llegue al lugar indicado.</p>
        <div class="dual-grid">
          <div class="form-box"><label for="email">Correo electrónico</label><input type="email" id="email" placeholder="tu@correo.com" value="${escapeHtml(data.email)}"></div>
          <div class="form-box"><label for="telefono">Teléfono <span class="helper">(opcional)</span></label><input id="telefono" inputmode="tel" placeholder="(555) 555-5555" value="${escapeHtml(data.telefono)}"><div class="helper">Más adelante podremos usarlo para avisos de entrega por mensaje de texto.</div></div>
        </div>`
    ];

    function escapeHtml(value='') {
      return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    }

    function bindOptions() {
      question.querySelectorAll('.option').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          data[key] = btn.dataset.value;
          save(data);
          render();
        });
      });
    }

    function collectInputs() {
      const ids = ['nombre','cualidades','recuerdo','frase','emocion','email','telefono'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) data[id] = el.value.trim();
      });
      save(data);
    }

    function isValid() {
      collectInputs();
      const required = [
        () => !!data.paraQuien,
        () => data.nombre.length >= 2,
        () => !!data.ocasion,
        () => !!data.genero && !!data.voz && !!data.idioma,
        () => data.cualidades.length >= 10,
        () => data.recuerdo.length >= 10,
        () => data.emocion.length >= 8,
        () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
      ];
      return required[step]();
    }

    function showError() {
      question.querySelector('.error')?.remove();
      const div = document.createElement('div');
      div.className = 'error';
      div.textContent = step === 7 ? 'Escribe un correo electrónico válido para continuar.' : 'Completa esta información para continuar.';
      question.appendChild(div);
    }

    function render() {
      question.innerHTML = steps[step]();
      bindOptions();
      const pct = Math.round(((step + 1) / steps.length) * 100);
      stepLabel.textContent = step === 7 ? 'Paso final' : `Paso ${step + 1} de ${steps.length}`;
      pctLabel.textContent = `${pct}% completado`;
      bar.style.width = `${pct}%`;
      backBtn.disabled = step === 0;
      nextBtn.textContent = step === 7 ? 'Revisar mi pedido →' : 'Siguiente →';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtn.addEventListener('click', () => {
      if (!isValid()) return showError();
      if (step < steps.length - 1) { step += 1; render(); }
      else location.href = 'order.html';
    });
    backBtn.addEventListener('click', () => {
      collectInputs();
      if (step > 0) { step -= 1; render(); }
    });

    render();
    setupExitIntent();
  }

  if (page === 'order') {
    const data = load();
    const briefRows = document.getElementById('briefRows');
    const rows = [
      ['Para', `${data.nombre || 'Sin nombre'} (${data.paraQuien || 'Sin especificar'})`],
      ['Ocasión', data.ocasion || 'Sin especificar'],
      ['Estilo', data.genero || 'Sin especificar'],
      ['Voz', data.voz || 'Sin especificar'],
      ['Idioma', data.idioma || 'Español'],
      ['Correo', data.email || 'Sin especificar']
    ];
    briefRows.innerHTML = rows.map(([label, value]) => `<div class="brief-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('');

    function escapeHtml(value='') {
      return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    }

    const totalEl = document.getElementById('total');
    const basePriceEl = document.getElementById('basePrice');
    const baseComparePriceEl = document.getElementById('baseComparePrice');
    const baseSavingsEl = document.getElementById('baseSavings');
    const currencyLabel = document.getElementById('orderCurrencyLabel');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addons = [...document.querySelectorAll('.addon')];

    const updateTotal = () => {
      const base = PRICING.song[currentCurrency];
      let total = base;
      if (basePriceEl) basePriceEl.textContent = formatMoney(base);
      if (baseComparePriceEl) baseComparePriceEl.textContent = formatMoney(LIST_PRICING.song[currentCurrency]);
      if (baseSavingsEl) baseSavingsEl.textContent = `−${formatMoney(LIST_PRICING.song[currentCurrency] - base)}`;
      addons.forEach(addon => {
        const key = addon.dataset.key;
        const price = PRICING[key][currentCurrency];
        const label = addon.closest('.upsell')?.querySelector('.addon-price');
        if (label) label.textContent = `+${formatMoney(price)}`;
        if (addon.checked) total += price;
      });
      if (totalEl) totalEl.textContent = formatMoney(total);
      if (currencyLabel) currencyLabel.textContent = currentCurrency;
      if (checkoutBtn) checkoutBtn.textContent = `Continuar al pago seguro · ${formatMoney(total)} →`;
    };

    addons.forEach(a => a.addEventListener('change', updateTotal));
    window.addEventListener('sonalza:currencychange', updateTotal);
    checkoutBtn?.addEventListener('click', () => {
      alert(`El checkout seguro será la siguiente integración. La orden está configurada en ${currentCurrency}; esta versión de prueba no realizará ningún cargo.`);
    });
    updateTotal();
    setupExitIntent();
  }

  setupCurrencySwitch();
})();

// V6: quiet mobile conversion bar — appears only after the visitor has engaged.
(function(){
  const cta=document.getElementById('mobileCta');
  if(!cta) return;
  const update=()=>{
    const shouldShow=window.innerWidth<=680 && window.scrollY>520;
    cta.classList.toggle('visible',shouldShow);
  };
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  update();
})();
