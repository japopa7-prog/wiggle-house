/* ============================================================
   Wiggle House — app.js
   ============================================================ */

const PALETTE = [
  { name:"Red", hex:"#E5433B" },
  { name:"Purple", hex:"#93279F" },
  { name:"Fuchsia", hex:"#E91E8C" },
  { name:"Pink", hex:"#FF6FA0" },
  { name:"Yellow", hex:"#FFC93C" },
  { name:"Orange", hex:"#FF8A3D" },
  { name:"Lime", hex:"#A8D93B" },
  { name:"Khaki", hex:"#B7B36A" },
  { name:"Violet", hex:"#7C5CFC" },
  { name:"Sky Blue", hex:"#5BC8E8" },
  { name:"Blue", hex:"#2F5FE0" },
  { name:"Beige", hex:"#E8D9C0" },
  { name:"Brown", hex:"#8B5E3C" },
  { name:"White", hex:"#F7F5F0" },
  { name:"Black", hex:"#2A2630" }
];
const findColor = n => PALETTE.find(c => c.name === n) || {name:n, hex:"#ccc"};

const PRODUCTS = [
  { id:1, name:"The Shroom Lamp — Red Pleated Mushroom Light", price:112,
    desc:"Meet your new mood booster. This red pleated mushroom lamp brings instant retro vibes and warm, cozy light to any corner. Compact, bold, and impossible to ignore — it's the statement piece your space has been missing.",
    images:[
      "assets/shroom-1.webp","assets/shroom-2.webp","assets/shroom-3.webp",
      "assets/shroom-4.webp","assets/shroom-5.webp"
    ],
    colorField:"Color", colors:["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] },
  { id:2, name:"Pleat One", price:112,
    desc:"A sculptural table lamp with a pleated conical shade and a ribbed bell base. Bold blue and crisp white. 35 cm tall, 20 cm wide. Designed to be seen — on or off.",
    images:[
      "assets/pleat-1.webp","assets/pleat-2.webp","assets/pleat-3.webp","assets/pleat-4.webp"
    ],
    colorField:"Lamp base color", colors:["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] },
  { id:3, name:"The Bud — Twisted Ribbed Lamp", price:100,
    desc:"A compact statement lamp with twisted ribs and a soft pink glow. Instant dopamine decor for any corner.",
    images:[
      "assets/bud-1.webp","assets/bud-2.webp","assets/bud-3.webp","assets/bud-4.webp"
    ],
    colorField:"Color", colors:["Pink","Red","Purple","Yellow","Orange","Sky Blue","Violet","White","Black"] },
  { id:4, name:"Cloud Lamp", price:75,
    desc:"A wavy, cloud-shaped shade on slim tripod legs. Soft, warm glow that works on a side table, nightstand, or shelf.",
    images:[
      "assets/cloud-1.webp","assets/cloud-2.webp","assets/cloud-3.webp","assets/cloud-4.webp"
    ],
    colorField:"Color", colors:["Pink","Orange","Yellow","Sky Blue","White","Black"] },
  { id:5, name:"Clover Lamp", price:75,
    desc:"A four-lobed, clover-shaped silhouette with a warm glow radiating from every curve. Frosted acrylic diffuses the light into a soft, colorful halo — the kind of lamp that works just as well as a nightlight as it does as the centerpiece on a nightstand.",
    images:[
      "assets/clover-1.webp","assets/clover-2.webp","assets/clover-3.webp"
    ],
    colorField:"Color", colors:["Pink","Sky Blue","Yellow","Violet","White","Black"] },
  { id:6, name:"Wave Magazine Rack", price:128,
    desc:"An S-curved desktop rack that holds magazines and books upright, with room for a stack flat underneath.",
    images:[
      "assets/wave-mag-1.webp","assets/wave-mag-2.webp","assets/wave-mag-3.webp"
    ],
    colorField:"Color", colors:["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] },
  { id:7, name:"Wave Shelf", price:73,
    desc:"An S-curved wall shelf on two mounting brackets — room for the things you actually reach for every day.",
    images:[
      "assets/wave-shelf-1.webp","assets/wave-shelf-2.webp","assets/wave-shelf-3.webp"
    ],
    colorField:"Color", colors:["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] },
  { id:8, name:"Stack Nightstand — 2 Tier", price:160,
    desc:"A compact two-tier version of our stacking nightstand — open cubby storage, same wave-edge detail.",
    images:[
      "assets/stack-1.webp","assets/stack-2.webp","assets/stack-3.webp","assets/stack-4.webp"
    ],
    colorMode:"parts",
    parts:[
      { label:"Top", colors:["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] },
      { label:"Bottom", colors:["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] }
    ] }
];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqpzdznb";
const BXB_WORKER_ENDPOINT = "https://wiggle-house.vercel.app/api/payment";
const BXB_TEST_MODE = false;
const BXB_WIDGET_JS = BXB_TEST_MODE
  ? "https://pgate-dev.bxb.delivery/js/bxbpay-widget.js"
  : "https://pgate.bxb.delivery/js/bxbpay-widget.js";

let CART = [];
let lastOrderInfo = null;

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const money = n => '$' + Number(n).toFixed(0);
const cartCount = () => CART.reduce((n,i) => n + i.qty, 0);
const updateCartBadge = () => { const el = $('#cartCount'); if (el) el.textContent = cartCount(); };

/* ---------- Блокировка скролла фона при открытой модалке ---------- */
function lockScroll(){ document.body.classList.add('modal-open'); }
function unlockScroll(){
  // разблокируем только если нет других открытых модалок
  if (!document.querySelector('.modal-overlay.open')) {
    document.body.classList.remove('modal-open');
  }
}

function openOverlay(el){
  if (!el) return;
  el.classList.add('open');
  lockScroll();
}
function closeOverlay(el){
  if (!el) return;
  el.classList.remove('open');
  unlockScroll();
}
function closeAllOverlays(){
  document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
  document.body.classList.remove('modal-open');
}

/* ---------- Корзина ---------- */
function addToCart(product, color){
  const key = product.id + '::' + (color || '');
  const ex = CART.find(i => i.key === key);
  if (ex) ex.qty += 1;
  else CART.push({ key, id: product.id, name: product.name, price: product.price, color: color || '', qty: 1 });
  updateCartBadge();
}

/* ---------- HERO ---------- */
function initHeroDial(){
  const dial = $('#colorDial'); if (!dial) return;
  const demoLabel = $('#demoLabel');
  ["Pink","Orange","Yellow","Sky Blue","Violet","White"].forEach((name, i) => {
    const c = findColor(name);
    const d = document.createElement('div');
    d.className = 'swatch' + (i === 0 ? ' active' : '');
    d.style.background = c.hex; d.title = name;
    d.addEventListener('click', () => {
      $$('.swatch', dial).forEach(s => s.classList.remove('active'));
      d.classList.add('active');
      if (demoLabel) demoLabel.textContent = 'Cloud Lamp — ' + name;
    });
    dial.appendChild(d);
  });
}

/* ---------- Отрисовка товаров ---------- */
function renderProducts(){
  const grid = $('#productGrid'); if (!grid) return;
  grid.innerHTML = '';

  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const defaultColor = p.colorMode === 'parts'
      ? p.parts.map(part => part.colors[0]).join(' / ')
      : p.colors[0];
    p._selectedColor = defaultColor;
    p._selectedParts = p.colorMode === 'parts' ? p.parts.map(part => part.colors[0]) : null;

    const colorBlock = p.colorMode === 'parts'
      ? p.parts.map((part, i) => `
          <div class="color-info" data-part="${i}">
            <div class="row"><span class="lbl">${part.label}</span></div>
            <div class="swatch-picker" data-part="${i}">
              ${part.colors.map((cName, ci) => {
                const c = findColor(cName);
                return `<div class="sw ${ci===0?'active':''}" data-color="${cName}" style="background:${c.hex}" title="${cName}"></div>`;
              }).join('')}
            </div>
            <div class="color-name">${part.colors[0]}</div>
          </div>
        `).join('')
      : `
        <div class="color-info">
          <div class="row"><span class="lbl">${p.colorField || 'Color'}</span></div>
          <div class="swatch-picker">
            ${p.colors.map((cName, ci) => {
              const c = findColor(cName);
              return `<div class="sw ${ci===0?'active':''}" data-color="${cName}" style="background:${c.hex}" title="${cName}"></div>`;
            }).join('')}
          </div>
          <div class="color-name">${p.colors[0]}</div>
        </div>
      `;

    card.innerHTML = `
      <div class="card-media">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x500/F4E9DC/6b6376?text=+'">
      </div>
      ${p.images.length > 1 ? `<div class="thumbs">${p.images.map((img,i)=>`<div class="thumb ${i===0?'active':''}" data-src="${img}"><img src="${img}" alt="" loading="lazy"></div>`).join('')}</div>` : ''}
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      ${colorBlock}
      <div class="card-foot">
        <div class="price-row"><span class="price">${money(p.price)}</span></div>
        <div style="display:flex; align-items:center; gap:12px;">
          <button type="button" class="buy-now-btn">Buy now</button>
          <div class="add-btn" aria-label="Add to cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>
          </div>
        </div>
      </div>
    `;

    const mainImg = $('.card-media img', card);
    $$('.thumb', card).forEach(t => {
      t.addEventListener('click', e => {
        e.stopPropagation();
        mainImg.src = t.dataset.src;
        $$('.thumb', card).forEach(o => o.classList.remove('active'));
        t.classList.add('active');
      });
    });

    if (p.colorMode === 'parts'){
      $$('.swatch-picker', card).forEach(picker => {
        const partIdx = Number(picker.dataset.part);
        const nameEl = picker.parentElement.querySelector('.color-name');
        $$('.sw', picker).forEach(sw => {
          sw.addEventListener('click', e => {
            e.stopPropagation();
            $$('.sw', picker).forEach(o => o.classList.remove('active'));
            sw.classList.add('active');
            if (nameEl) nameEl.textContent = sw.dataset.color;
            p._selectedParts[partIdx] = sw.dataset.color;
            p._selectedColor = p._selectedParts.join(' / ');
          });
        });
      });
    } else {
      const picker = $('.swatch-picker', card);
      const nameEl = $('.color-name', card);
      $$('.sw', picker).forEach(sw => {
        sw.addEventListener('click', e => {
          e.stopPropagation();
          $$('.sw', picker).forEach(o => o.classList.remove('active'));
          sw.classList.add('active');
          if (nameEl) nameEl.textContent = sw.dataset.color;
          p._selectedColor = sw.dataset.color;
        });
      });
    }

    const addBtn = $('.add-btn', card);
    addBtn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(p, p._selectedColor);
      addBtn.classList.add('added');
      addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7"/></svg>`;
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>`;
      }, 900);
    });

    $('.buy-now-btn', card).addEventListener('click', e => {
      e.stopPropagation();
      addToCart(p, p._selectedColor);
      openOrderModal();
    });

    card.addEventListener('click', () => openProductModal(p));
    grid.appendChild(card);
  });
}

/* ---------- Модалка товара ---------- */
function openProductModal(p){
  const overlay = $('#productOverlay');
  const content = $('#productContent');
  if (!overlay || !content) return;

  const colorBlock = p.colorMode === 'parts'
    ? p.parts.map((part, i) => `
        <div class="color-info">
          <div class="row"><span class="lbl">${part.label}</span></div>
          <div class="swatch-picker" data-part="${i}">
            ${part.colors.map((cName, ci) => {
              const c = findColor(cName);
              const active = (p._selectedParts && p._selectedParts[i] === cName) ? ' active' : (ci === 0 && !p._selectedParts ? ' active' : '');
              return `<div class="sw ${active}" data-color="${cName}" style="background:${c.hex}" title="${cName}"></div>`;
            }).join('')}
          </div>
        </div>
      `).join('')
    : `
      <div class="color-info">
        <div class="row"><span class="lbl">${p.colorField || 'Color'}</span></div>
        <div class="swatch-picker">
          ${p.colors.map(cName => {
            const c = findColor(cName);
            const active = (p._selectedColor === cName) ? ' active' : '';
            return `<div class="sw ${active}" data-color="${cName}" style="background:${c.hex}" title="${cName}"></div>`;
          }).join('')}
        </div>
      </div>
    `;

  content.innerHTML = `
    <div class="pm-grid">
      <div>
        <div class="pm-media"><img id="pmMainImg" src="${p.images[0]}" alt="${p.name}" loading="lazy"></div>
        ${p.images.length > 1 ? `<div class="pm-thumbs">${p.images.map((img,i)=>`<div class="thumb ${i===0?'active':''}" data-src="${img}"><img src="${img}" alt="" loading="lazy"></div>`).join('')}</div>` : ''}
      </div>
      <div class="pm-info">
        <h2>${p.name}</h2>
        <div class="pm-price">${money(p.price)}</div>
        <p class="pm-desc">${p.desc}</p>
        ${colorBlock}
        <div class="pm-actions">
          <button type="button" class="btn btn-ghost" id="pmAddBtn">Add to cart</button>
          <button type="button" class="btn btn-solid" id="pmBuyBtn">Buy now</button>
        </div>
      </div>
    </div>
  `;

  const pmMain = $('#pmMainImg', content);
  $$('.pm-thumbs .thumb', content).forEach(t => {
    t.addEventListener('click', () => {
      pmMain.src = t.dataset.src;
      $$('.pm-thumbs .thumb', content).forEach(o => o.classList.remove('active'));
      t.classList.add('active');
    });
  });

  if (p.colorMode === 'parts'){
    $$('.swatch-picker', content).forEach(picker => {
      const partIdx = Number(picker.dataset.part);
      $$('.sw', picker).forEach(sw => {
        sw.addEventListener('click', () => {
          $$('.sw', picker).forEach(o => o.classList.remove('active'));
          sw.classList.add('active');
          if (!p._selectedParts) p._selectedParts = [];
          p._selectedParts[partIdx] = sw.dataset.color;
          p._selectedColor = p._selectedParts.join(' / ');
        });
      });
    });
  } else {
    const picker = $('.swatch-picker', content);
    $$('.sw', picker).forEach(sw => {
      sw.addEventListener('click', () => {
        $$('.sw', picker).forEach(o => o.classList.remove('active'));
        sw.classList.add('active');
        p._selectedColor = sw.dataset.color;
      });
    });
  }

  $('#pmAddBtn', content).addEventListener('click', () => {
    addToCart(p, p._selectedColor);
    const b = $('#pmAddBtn', content);
    const o = b.textContent;
    b.textContent = 'Added ✓';
    setTimeout(() => b.textContent = o, 1000);
  });

  $('#pmBuyBtn', content).addEventListener('click', () => {
    addToCart(p, p._selectedColor);
    closeOverlay(overlay);
    openOrderModal();
  });

  openOverlay(overlay);
}

/* ---------- Отзывы ---------- */
const TESTIMONIALS = [
  { name:"J. MARTINEZ — AUSTIN, TX", text:"The Cloud Lamp is the first thing people ask about when they walk into my living room. Packaging alone felt like a gift." },
  { name:"S. OKAFOR — BROOKLYN, NY", text:"Ordered the Wave Shelf in red — genuinely did not expect a 3D-printed piece to feel this premium." },
  { name:"R. CHEN — PORTLAND, OR", text:"Customer support answered every question I had before I even ordered. Shipping was fast and free." },
  { name:"A. THOMPSON — DENVER, CO", text:"Mixed and matched colors on the Wave Magazine Rack — exactly the mismatched-on-purpose look I wanted." },
  { name:"L. NGUYEN — MIAMI, FL", text:"The Stack Nightstand looks like it belongs in a design magazine, not something that came out of a 3D printer." },
  { name:"D. FOSTER — CHICAGO, IL", text:"Every single piece was wrapped like a birthday present." }
];
function renderTestimonials(){
  const track = $('#testiTrack'); if (!track) return;
  const build = t => `<div class="testi-card"><div class="stars">★★★★★</div><p>"${t.text}"</p><div class="testi-name">${t.name}</div></div>`;
  track.innerHTML = [...TESTIMONIALS, ...TESTIMONIALS].map(build).join('');
}

/* ---------- Корзина / окно заказа ---------- */
function openOrderModal(){
  const oc = $('#orderContent');
  const ov = $('#orderOverlay');
  if (!oc || !ov) return;

  oc.innerHTML = `
    <h3>Your order</h3>
    <p class="modal-sub">Send us your order and shipping address — we'll follow up by email with a secure payment link.</p>
    <div class="cart-lines" id="cartLines"></div>
    <div class="cart-total" id="cartTotal"></div>
    <form id="orderForm">
      <div class="field-row">
        <div class="field"><input type="text" name="firstName" placeholder="First name" required></div>
        <div class="field"><input type="text" name="lastName" placeholder="Last name" required></div>
      </div>
      <div class="field"><input type="email" name="email" placeholder="Email" required></div>
      <div class="field"><input type="text" name="address1" placeholder="Street address" required></div>
      <div class="field-row">
        <div class="field"><input type="text" name="city" placeholder="City" required></div>
        <div class="field"><input type="text" name="state" placeholder="State (2-letter)" maxlength="2" style="text-transform:uppercase" required></div>
      </div>
      <div class="field-row">
        <div class="field"><input type="text" name="zip" placeholder="ZIP" required></div>
        <div class="field"><input type="text" name="country" value="United States" readonly></div>
      </div>
      <div class="field"><textarea name="notes" rows="2" placeholder="Colors, sizes, anything else"></textarea></div>
      <button type="submit" class="btn btn-solid" id="orderSubmitBtn">Send order</button>
      <p class="form-note">No payment is collected here — this just sends us your order. We'll email you a payment link.</p>
    </form>
  `;

  wireOrderForm();
  renderCart();
  openOverlay(ov);
}

function renderCart(){
  const linesEl = $('#cartLines');
  const totalEl = $('#cartTotal');
  if (!linesEl || !totalEl) return;

  if (CART.length === 0){
    linesEl.innerHTML = `<div class="cart-empty">Your cart is empty — add something from the shop first.</div>`;
    totalEl.textContent = '';
    const btn = $('#orderSubmitBtn'); if (btn) btn.disabled = true;
    return;
  }
  const btn = $('#orderSubmitBtn'); if (btn) btn.disabled = false;

  linesEl.innerHTML = CART.map(item => `
    <div class="cart-line" data-key="${item.key}">
      <span>${item.name}${item.color ? ' — ' + item.color : ''}</span>
      <div class="qty-controls">
        <button type="button" class="qty-minus">–</button>
        <span>${item.qty}</span>
        <button type="button" class="qty-plus">+</button>
        <span class="mono">${money(item.price * item.qty)}</span>
      </div>
    </div>
  `).join('');

  const total = CART.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.innerHTML = `<span>Total</span><span>${money(total)}</span>`;

  $$('.cart-line', linesEl).forEach(line => {
    const key = line.dataset.key;
    $('.qty-plus', line).addEventListener('click', () => {
      CART.find(i => i.key === key).qty += 1;
      updateCartBadge(); renderCart();
    });
    $('.qty-minus', line).addEventListener('click', () => {
      const item = CART.find(i => i.key === key);
      item.qty -= 1;
      if (item.qty <= 0) CART = CART.filter(i => i.key !== key);
      updateCartBadge(); renderCart();
    });
  });
}

function wireOrderForm(){
  const form = $('#orderForm'); if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (CART.length === 0) return;
    const btn = $('#orderSubmitBtn');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const fd = new FormData(form);
    const summary = CART.map(i => `${i.name}${i.color ? ' ['+i.color+']' : ''} x${i.qty} (${money(i.price*i.qty)})`).join(', ');
    const total = CART.reduce((s,i) => s + i.price*i.qty, 0);
    fd.append('order_summary', summary);
    fd.append('order_total', money(total));

    lastOrderInfo = {
      firstName: fd.get('firstName') || '',
      lastName: fd.get('lastName') || '',
      email: fd.get('email') || '',
      address1: fd.get('address1') || '',
      city: fd.get('city') || '',
      state: (fd.get('state') || '').toUpperCase(),
      zip: fd.get('zip') || '',
      total,
      itemsSummary: summary
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, { method:'POST', body: fd, headers:{'Accept':'application/json'} });
      if (res.ok) showOrderSuccess();
      else {
        btn.textContent = original; btn.disabled = false;
        alert("Something went wrong sending your order — please email us directly instead.");
      }
    } catch {
      btn.textContent = original; btn.disabled = false;
      alert("Couldn't reach the order form — please check your connection.");
    }
  });
}

function showOrderSuccess(){
  const oc = $('#orderContent');
  oc.innerHTML = `
    <div class="order-success">
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
      <h3>Order sent!</h3>
      <p class="modal-sub">Thanks — we've got your order and address. We'll email you a payment link within a day to finish checkout.</p>
      <button type="button" class="btn btn-solid" id="bxbPayBtn" style="margin-top:10px;">Pay now with card</button>
    </div>
    <div id="bxbpay-widget" style="display:none;"></div>
  `;
  $('#bxbPayBtn').addEventListener('click', payWithBXB);
  CART = [];
  updateCartBadge();
}

/* ---------- BXB ---------- */
function loadBxbScript(){
  return new Promise((resolve, reject) => {
    if (window.bxbPayWidget) return resolve();
    const s = document.createElement('script');
    s.src = BXB_WIDGET_JS;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load the payment widget script'));
    document.head.appendChild(s);
  });
}

async function payWithBXB(){
  if (!lastOrderInfo || !BXB_WORKER_ENDPOINT) return;
  const btn = $('#bxbPayBtn');
  const original = btn.textContent;
  btn.textContent = 'Loading payment form…';
  btn.disabled = true;

  const amountStr = lastOrderInfo.total.toFixed(2);
  const amountNum = parseFloat(amountStr);
  const invoiceNumber = 'WH-' + Date.now().toString().slice(-10);

  try {
    const res = await fetch(BXB_WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceNumber, amount: amountNum, currency: 'USD' })
    });
    const rawText = await res.text();
    let data;
    try || { data = JSON.parse(rawText); } catch { throw new Error(`Worker returned non-JSON: ${rawText.slice(0,300)}`); }
    if (!data.result || !data.token) throw new Error(`Worker error: ${JSON.stringify(data).slice(0,300)}`);

    await loadBxbScript();
    const widgetEl = $('#bxbpay-widget');
    widgetEl.style.display = 'block';
    btn.style.display = 'none';

    const widgetOrder = {
      invoiceNumber,
      description: (lastOrderInfo.itemsSummary || 'Wiggle House order').slice(0, 250),
      amount: amountNum,
      currency: 'USD',
      email: lastOrderInfo.email || "customer@example.com",
      customer_id: lastOrderInfo.email || "customer_" + Date.now(),
      billTo: {
        firstName: lastOrderInfo.firstName "John",
        lastName: lastOrderInfo.lastName || "Doe",
        address: lastOrderInfo.address1 || "123 Main St",
        city: lastOrderInfo.city || "New York",
        state: lastOrderInfo.state || "NY",
        zip: lastOrderInfo.zip || "10001",
        countryCode: 840
      },
      shipping: { goodsCost: amountNum, deliveryCost: 0, deliveryService: 'BXB' }
    };

    window.bxbPayWidget.open({
      element: '#bxbpay-widget',
      width: '100%',
      height: '640px',
      lang: 'en',
      payment_token: data.token,
      order: widgetOrder
    }, function (response){
      if (response && response.result_code === 2){
        widgetEl.innerHTML = `<p style="text-align:center; padding:24px 0; font-family:'Fredoka',sans-serif; font-size:16px;">Payment approved — thank you! 🎉</p>`;
      } else if (response && response.result_code === 3){
        alert('The payment was declined. Please try another card, or contact us to arrange another way to pay.');
      }
    });
  } catch (err){
    btn.style.display = '';
    btn.textContent = original;
    btn.disabled = false;
    alert("Couldn't start the payment form.\n\n" + (err && err.message ? err.message : err));
  }
}

/* ---------- Инициализация ---------- */
function bindClose(overlaySel, closeSel){
  const ov = document.querySelector(overlaySel);
  const btn = document.querySelector(closeSel);
  if (!ov) return;
  if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeOverlay(ov); });
  ov.addEventListener('click', e => { if (e.target === ov) closeOverlay(ov); });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroDial();
  renderProducts();
  renderTestimonials();

  const cartBtn = $('#cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', openOrderModal);

  bindClose('#orderOverlay', '#orderClose');
  bindClose('#productOverlay', '#productClose');

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllOverlays();
  });

  const burger = $('#burger'), menu = $('#mobileMenu');
  if (burger && menu){
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    $$('a', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  const lead = $('#leadForm');
  if (lead){
    lead.addEventListener('submit', function(e){
      e.preventDefault();
      const btn = this.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = 'Thanks — you\'re on the list!';
      setTimeout(() => { btn.textContent = orig; this.reset(); }, 2200);
    });
  }
});
