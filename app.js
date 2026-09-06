(() => {
  const STORAGE_KEY = 'sonalzaSongDraftV2';
  const FEEDBACK_KEY = 'sonalzaExitFeedbackV2';
  const page = document.body.dataset.page;
  const CURRENCY_KEY = 'sonalzaCurrencyV3';
  const PRICING = {
    song: { USD: 39, MXN: 659 },
    corrido: { USD: 199, MXN: 3359 },
    premium: { USD: 29, MXN: 549 },
    rush: { USD: 19, MXN: 349 },
    video: { USD: 29, MXN: 549 },
    second: { USD: 25, MXN: 449 }
  };
  const LIST_PRICING = {
    song: { USD: 59, MXN: 999 },
    corrido: { USD: 249, MXN: 4199 }
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
    product: 'song',
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
        fetch('/api/feedback', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...payload, currency:currentCurrency})}).catch(()=>{});
        hide();
      });
    });
  }

  if (page === 'home') {
    const sticky = document.getElementById('mobileCta');
    if (sticky) {
      const syncSticky = () => sticky.classList.toggle('visible', window.innerWidth <= 680 && window.scrollY > 520);
      window.addEventListener('scroll', syncSticky, { passive: true });
      window.addEventListener('resize', syncSticky);
      syncSticky();
    }
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (menuToggle && mobileNav) {
      const closeMenu = () => {
        menuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded','false');
        mobileNav.setAttribute('aria-hidden','true');
      };
      menuToggle.addEventListener('click', () => {
        const open = !mobileNav.classList.contains('open');
        mobileNav.classList.toggle('open', open);
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      });
      mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
    }
  }

  if (page === 'create') {
    const data = load();
    const params = new URLSearchParams(location.search);
    const productParam = params.get('product');
    const genreParam = params.get('genre');
    const occasionParam = params.get('occasion');
    const relationParam = params.get('relation');
    if (productParam === 'corrido') { data.product = 'corrido'; data.genero = 'Corrido'; }
    else if (productParam === 'song') data.product = 'song';
    if (genreParam) data.genero = genreParam.slice(0,80);
    if (occasionParam) data.ocasion = occasionParam.slice(0,80);
    if (relationParam) data.paraQuien = relationParam.slice(0,80);
    save(data);
    let step = 0;
    const question = document.getElementById('question');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const stepLabel = document.getElementById('stepLabel');
    const pctLabel = document.getElementById('pctLabel');
    const bar = document.getElementById('bar');
    const railTipTitle = document.getElementById('railTipTitle');
    const railTipText = document.getElementById('railTipText');

    const optionButtons = (items, selected, key) => `
      <div class="option-grid">
        ${items.map(item => `<button type="button" class="option ${selected === item ? 'selected' : ''}" data-key="${key}" data-value="${item}">${item}</button>`).join('')}
      </div>`;

    const steps = [
      () => `
        <div class="smallcaps">Paso 1</div>
        <h1>¿Para quién es esta canción?</h1>
        <p class="sub">Elige la relación más cercana. Si no aparece exactamente, selecciona “Otro”.</p>
        <div class="why-box"><strong>¿Por qué te lo preguntamos?</strong><span>La relación cambia el tono de la letra y la forma de contar la historia.</span></div>
        ${optionButtons(['Esposo','Esposa','Pareja','Novio','Novia','Papá','Mamá','Hijo','Hija','Abuelo/a','Hermano/a','Amigo/a','Para mí','Otro'], data.paraQuien, 'paraQuien')}`,
      () => `
        <div class="smallcaps">Paso 2</div>
        <h1>¿Cómo se llama?</h1>
        <p class="sub">Escribe el nombre tal como quieres que aparezca o se cante.</p>
        <div class="why-box"><strong>Ejemplo</strong><span>“José”, “Mamá Lupita”, “Mi viejo”, “César”. Usa la forma que realmente le dices.</span></div>
        <div class="form-box"><label for="nombre">Nombre</label><input id="nombre" maxlength="60" placeholder="Ejemplo: Julián" value="${escapeHtml(data.nombre)}"><div class="field-meta"><span>Así lo usaremos dentro del brief.</span><span id="nombreCount">${data.nombre.length}/60</span></div></div>`,
      () => `
        <div class="smallcaps">Paso 3</div>
        <h1>¿Cuál es la ocasión?</h1>
        <p class="sub">Elige la ocasión que mejor explica por qué estás creando esta canción.</p>
        <div class="why-box"><strong>No tiene que ser una fecha especial.</strong><span>“Porque sí”, “Te amo” o “Gracias” también pueden producir canciones muy fuertes.</span></div>
        ${optionButtons(['Porque sí','Te amo','Cumpleaños','Aniversario','Te extraño','Gracias','Perdón','Boda','Amistad','En memoria','Logro especial','Propuesta','Jubilación','Graduación','Otra ocasión'], data.ocasion, 'ocasion')}`,
      () => `
        <div class="smallcaps">Paso 4</div>
        <h1>Elige el estilo de la canción</h1>
        <p class="sub">Elige la dirección musical. Si no estás seguro, “Sorpréndeme” nos deja proponerla.</p>
        <div class="why-box"><strong>Piensa en la persona que la recibirá.</strong><span>No elijas solo tu género favorito: elige el que más conectaría con esa historia.</span></div>
        ${optionButtons(['Corrido','Banda','Norteño','Cumbia','Mariachi','Duranguense','Huapango','Sierreño','Pop Latino','Reguetón','Balada','Sorpréndeme'], data.genero, 'genero')}
        <div class="dual-grid">
          <div><div class="helper" style="text-align:center;margin-bottom:10px">Voz</div>${optionButtons(['Masculina','Femenina','Sorpréndeme'], data.voz, 'voz')}</div>
          <div><div class="helper" style="text-align:center;margin-bottom:10px">Idioma de la canción</div>${optionButtons(['Español','Inglés','Bilingüe'], data.idioma, 'idioma')}</div>
        </div>`,
      () => `
        <div class="smallcaps">Paso 5</div>
        <h1>¿Qué hace especial a ${escapeHtml(data.nombre) || 'esta persona'}?</h1>
        <p class="sub">Descríbela con tus propias palabras. Una o dos frases claras suelen dar mejores resultados.</p>
        <div class="prompt-chips"><span>Cómo es</span><span>Qué admiras</span><span>Qué hace por ustedes</span></div>
        <div class="form-box"><label for="cualidades">Sus mejores cualidades</label><textarea id="cualidades" maxlength="700" placeholder="Ejemplo: Siempre ha cuidado de nuestra familia, tiene un gran sentido del humor y nunca deja que nadie se rinda.">${escapeHtml(data.cualidades)}</textarea><div class="field-meta"><span>Escribe natural. No necesitas rimar.</span><span id="cualidadesCount">${data.cualidades.length}/700</span></div></div>`,
      () => `
        <div class="smallcaps">Paso 6</div>
        <h1>Comparte un recuerdo inolvidable</h1>
        <p class="sub">Los detalles específicos hacen que la canción se sienta verdaderamente personal.</p>
        <div class="prompt-chips"><span>Un lugar</span><span>Una anécdota</span><span>Una frase</span><span>Un momento</span></div>
        <div class="form-box"><label for="recuerdo">Momento especial</label><textarea id="recuerdo" maxlength="900" placeholder="Ejemplo: Nos conocimos trabajando en Anaheim. Siempre dice ‘primero la familia’. El viaje a Chihuahua en 2018 fue cuando…">${escapeHtml(data.recuerdo)}</textarea><div class="field-meta"><span>Entre más específico, menos genérica se sentirá la canción.</span><span id="recuerdoCount">${data.recuerdo.length}/900</span></div></div>`,
      () => `
        <div class="smallcaps">Paso 7</div>
        <h1>¿Qué quieres que sienta al escucharla?</h1>
        <p class="sub">Dinos el mensaje que debe quedar en el corazón de quien la reciba.</p>
        <div class="dual-grid">
          <div class="form-box"><label for="frase">Frase que te gustaría escuchar <span class="helper">(opcional)</span></label><textarea id="frase" maxlength="300" placeholder="Ejemplo: Gracias por cruzar fronteras por nosotros.">${escapeHtml(data.frase)}</textarea><div class="field-meta"><span>Puede ser una frase familiar o algo que tú quieres decirle.</span><span id="fraseCount">${data.frase.length}/300</span></div></div>
          <div class="form-box"><label for="emocion">Mensaje principal</label><textarea id="emocion" maxlength="700" placeholder="Ejemplo: Quiero que entienda que todo su esfuerzo valió la pena y que estamos orgullosos de él.">${escapeHtml(data.emocion)}</textarea><div class="field-meta"><span>Piensa en cómo quieres que se sienta al terminar.</span><span id="emocionCount">${data.emocion.length}/700</span></div></div>
        </div>`,
      () => `
        <div class="smallcaps">Paso final</div>
        <h1>¿A dónde enviamos tu canción?</h1>
        <p class="sub">Usaremos estos datos para identificar tu pedido y comunicarnos contigo sobre la entrega.</p>
        <div class="privacy-note"><span>🔒</span><div><strong>Tu historia es privada.</strong><p>No necesitas publicar nada para crear tu canción.</p></div></div>
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
          question.querySelectorAll(`.option[data-key="${key}"]`).forEach(option => option.classList.remove('selected'));
          btn.classList.add('selected');
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

    const stepTips = [
      ['Empieza simple.','La relación nos ayuda a definir cercanía, lenguaje y tono emocional.'],
      ['Usa el nombre real.','Escribe cómo le dices de verdad. Ese detalle puede hacer que la canción se sienta mucho más personal.'],
      ['Define el motivo.','La ocasión nos ayuda a decidir qué debe quedar al frente: celebración, amor, gratitud, homenaje o memoria.'],
      ['El sonido también cuenta la historia.','Un corrido narra distinto a una cumbia. Elige pensando en quién recibirá la canción.'],
      ['No busques palabras perfectas.','Escribe como hablas. Nosotros nos encargamos de convertir esas ideas en una letra musical.'],
      ['Los detalles pequeños son oro.','Lugares, apodos, frases y momentos concretos son lo que evita que la canción se sienta genérica.'],
      ['Piensa en la última sensación.','¿Quieres que sonría, llore, se sienta orgulloso o quiera bailar? Dínoslo tal cual.'],
      ['Ya casi está.','Tu correo identifica el pedido y será el canal principal para la entrega y cualquier aclaración.']
    ];

    function bindCounters(){
      const fields = [['nombre',60],['cualidades',700],['recuerdo',900],['frase',300],['emocion',700]];
      fields.forEach(([id,max])=>{
        const el=document.getElementById(id); const count=document.getElementById(id+'Count');
        if(!el||!count) return;
        const update=()=>{ count.textContent=`${el.value.length}/${max}`; };
        el.addEventListener('input',update); update();
      });
    }

    function render() {
      question.innerHTML = steps[step]();
      bindOptions();
      bindCounters();
      if (railTipTitle && railTipText) {
        railTipTitle.textContent = stepTips[step][0];
        railTipText.textContent = stepTips[step][1];
      }
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

  if (page === 'business') {
    const form = document.getElementById('businessForm');
    const status = document.getElementById('businessStatus');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=\"submit\"]');
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      payload.currency = currentCurrency;
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      if (status) { status.textContent=''; status.className='submit-status'; }
      try {
        const r = await fetch('/api/submit-lead', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const result = await r.json().catch(()=>({}));
        if (!r.ok || !result.ok) throw new Error(result.error || 'No pudimos enviar la solicitud.');
        form.innerHTML = `<div class=\"business-success\"><div class=\"eyebrow\">SOLICITUD RECIBIDA</div><h2>Ya llegó a SONALZA.</h2><p>Referencia <strong>${result.leadId}</strong>. Te responderemos usando el correo que nos compartiste.</p><a href=\"index.html\" class=\"btn btn-primary\">Volver al inicio →</a></div>`;
      } catch(err) {
        if (status) { status.textContent=err.message; status.className='submit-status error-status'; }
        btn.disabled=false; btn.textContent=original;
      }
    });
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
      const productKey = data.product === 'corrido' ? 'corrido' : 'song';
      const base = PRICING[productKey][currentCurrency];
      let total = base;
      const productLabel = document.getElementById('orderProductLabel');
      if (productLabel) productLabel.textContent = productKey === 'corrido' ? 'Corrido de Tu Vida' : 'Canción personalizada';
      if (basePriceEl) basePriceEl.textContent = formatMoney(base);
      if (baseComparePriceEl) baseComparePriceEl.textContent = formatMoney(LIST_PRICING[productKey][currentCurrency]);
      if (baseSavingsEl) baseSavingsEl.textContent = `−${formatMoney(LIST_PRICING[productKey][currentCurrency] - base)}`;
      addons.forEach(addon => {
        const key = addon.dataset.key;
        const price = PRICING[key][currentCurrency];
        const label = addon.closest('.upsell')?.querySelector('.addon-price');
        if (label) label.textContent = `+${formatMoney(price)}`;
        if (addon.checked) total += price;
      });
      if (totalEl) totalEl.textContent = formatMoney(total);
      if (currencyLabel) currencyLabel.textContent = currentCurrency;
      if (checkoutBtn) checkoutBtn.textContent = `Enviar pedido · ${formatMoney(total)} →`;
    };

    addons.forEach(a => a.addEventListener('change', updateTotal));
    window.addEventListener('sonalza:currencychange', updateTotal);
    checkoutBtn?.addEventListener('click', async () => {
      const original = checkoutBtn.textContent;
      const statusEl = document.getElementById('submitStatus');
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Registrando tu pedido…';
      if (statusEl) { statusEl.textContent = ''; statusEl.className = 'submit-status'; }
      try {
        const chosenAddons = addons.filter(a=>a.checked).map(a=>a.dataset.key);
        const utmParams = new URLSearchParams(location.search);
        const utm = {};
        ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{ if(utmParams.get(k)) utm[k]=utmParams.get(k); });
        const response = await fetch('/api/submit-order', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({draft:data,currency:currentCurrency,addons:chosenAddons,page:location.href,referrer:document.referrer,utm})
        });
        const result = await response.json().catch(()=>({}));
        if (!response.ok || !result.ok) throw new Error(result.error || 'No pudimos registrar el pedido.');
        sessionStorage.setItem('sonalzaLastOrder', JSON.stringify(result));
        location.href = `thanks.html?order=${encodeURIComponent(result.orderId)}`;
      } catch (err) {
        if (statusEl) { statusEl.textContent = err.message; statusEl.className = 'submit-status error-status'; }
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = original;
      }
    });
    updateTotal();
    setupExitIntent();
  }

  setupCurrencySwitch();
})();
