/* ============================================================
   Wiggle House — app.js
   Товары, корзина, модальные окна и оплата BXB
   ============================================================ */

// ---------- Палитра цветов PLA ----------
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
function findColor(name){ return PALETTE.find(c => c.name === name) || {name, hex:"#ccc"}; }

// ---------- Товары с вашего сайта-конструктора ----------
const PRODUCTS = [
  {
    id: 1,
    name: "The Shroom Lamp — Red Pleated Mushroom Light",
    price: 112,
    desc: "Meet your new mood booster. This red pleated mushroom lamp brings instant retro vibes and warm, cozy light to any corner. Compact, bold, and impossible to ignore — it's the statement piece your space has been missing.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/aa802083-2131-4761-a7ab-4dea35c5397b.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/e87511a8-8882-4d66-a6e4-2b34d224d95b.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/7c0f9b99-e8ca-42f8-aa2a-8ddde06af1e4.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/fc5eb094-a81e-4420-9efc-c834d1e6148c.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/d6b37caa-e61e-4b1a-9ea3-e1c8dec568f7.webp"
    ],
    colorField: "Color",
    colors: ["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"]
  },
  {
    id: 2,
    name: "Pleat One",
    price: 112,
    desc: "A sculptural table lamp with a pleated conical shade and a ribbed bell base. Bold blue and crisp white. 35 cm tall, 20 cm wide. Designed to be seen — on or off.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/1ebd62ca-3073-4285-a0ec-7a3ad452ac33.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/14b73704-166c-47f2-b9ab-fc8cdbec861e.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/bc0f504d-6cc9-44f5-a862-29d01224d5f9.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/e8b19eb2-4c4c-4979-aafd-e599d5a5ae84.webp"
    ],
    colorField: "Lamp base color",
    colors: ["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"]
  },
  {
    id: 3,
    name: "The Bud — Twisted Ribbed Lamp",
    price: 100,
    desc: "A compact statement lamp with twisted ribs and a soft pink glow. Instant dopamine decor for any corner.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/69f60858-5785-4c2c-a325-994c41602202.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/c45a9f71-9168-49cf-b3a2-b0acbc329bed.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/db34455d-6b76-41ec-ab03-40d583838dc4.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/fb8f0e5f-ff4a-4704-aace-08d19c2dd5f5.webp"
    ],
    colorField: "Color",
    colors: ["Pink","Red","Purple","Yellow","Orange","Sky Blue","Violet","White","Black"]
  },
  {
    id: 4,
    name: "Cloud Lamp",
    price: 75,
    desc: "A wavy, cloud-shaped shade on slim tripod legs. Soft, warm glow that works on a side table, nightstand, or shelf.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/8b23544d-47cd-4009-83d2-683e0cd7b7dc.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/d8ab496e-6591-44ad-9f9f-11d415e6eaf2.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/fa8e3b65-9a24-4785-825e-022924183c6f.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/a340d995-a972-47a5-be55-400c2c9133f1.webp"
    ],
    colorField: "Color",
    colors: ["Pink","Orange","Yellow","Sky Blue","White","Black"]
  },
  {
    id: 5,
    name: "Clover Lamp",
    price: 75,
    desc: "A four-lobed, clover-shaped silhouette with a warm glow radiating from every curve. Frosted acrylic diffuses the light into a soft, colorful halo — the kind of lamp that works just as well as a nightlight as it does as the centerpiece on a nightstand.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/ee354b12-b85e-47d7-be30-ac3d010aa124.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/d9fbccf1-cf19-4957-b6c2-fcd10e0576d1.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/5c43d7a6-1ce9-4d00-8bb0-723cf14a9374.webp"
    ],
    colorField: "Color",
    colors: ["Pink","Sky Blue","Yellow","Violet","White","Black"]
  },
  {
    id: 6,
    name: "Wave Magazine Rack",
    price: 128,
    desc: "An S-curved desktop rack that holds magazines and books upright, with room for a stack flat underneath.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/5af2db6a-a868-4e37-8083-3a1edfb19762.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/6866f577-2833-43a9-ba26-139520a44ca1.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/b68c6f21-90cf-4567-9516-241649405874.webp"
    ],
    colorField: "Color",
    colors: ["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"]
  },
  {
    id: 7,
    name: "Wave Shelf",
    price: 73,
    desc: "An S-curved wall shelf on two mounting brackets — room for the things you actually reach for every day.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/463b8074-e70c-478f-9214-91be5d2e8e6b.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/48f0ecf6-bfdc-47a8-908f-51242a051e77.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/33727762-d55d-487c-8304-3ab140d2330a.webp"
    ],
    colorField: "Color",
    colors: ["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"]
  },
  {
    id: 8,
    name: "Stack Nightstand — 2 Tier",
    price: 160,
    desc: "A compact two-tier version of our stacking nightstand — open cubby storage, same wave-edge detail.",
    images: [
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/7b7872f8-4e96-410a-9272-20173ffcf8c3.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/030c9a1f-331c-4281-bb93-2ef5b8208ecb.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/1e4448bb-1880-4cf3-8094-f41e9365039c.webp",
      "https://pub-bed0b67ad5704b5198219c1fb1924834.r2.dev/products/0f59acd4-2966-4830-9b3f-125e0399bbe1.webp"
    ],
    colorMode: "parts",
    parts: [
      { label: "Top", colors: ["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] },
      { label: "Bottom", colors: ["Red","Pink","Purple","Yellow","Orange","Lime","Violet","Sky Blue","Blue","Beige","White","Black"] }
    ]
  }
];

// ---------- КОНФИГ ----------
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqpzdznb";
const BXB_WORKER_ENDPOINT = "https://wiggle-house.vercel.app/api/payment";
const BXB_TEST_MODE = false;
const BXB_WIDGET_JS = BXB_TEST_MODE
  ? "https://pgate-dev.bxb.delivery/js/bxbpay-widget.js"
  : "https://pgate.bxb.delivery/js/bxbpay-widget.js";

// ---------- Состояние ----------
let CART = []; // { id, name, price, qty, color }
let lastOrderInfo = null;

// ---------- Утилиты ----------
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
function money(n){ return '$' + Number(n).toFixed(0); }
function cartCount(){ return CART.reduce((n,i) => n + i.qty, 0); }
function updateCartBadge(){ const el = $('#cartCount'); if (el) el.textContent = cartCount(); }

function addToCart(product, color){
  const key = product.id + '::' + (color || '');
  const existing = CART.find(i => i.key === key);
  if (existing) existing.qty += 1;
  else CART.push({
    key,
    id: product.id,
    name: product.name,
    price: product.price,
    color: color || '',
    qty: 1
  });
  updateCartBadge();
}

// ---------- HERO color dial ----------
function initHeroDial(){
  const dial = $('#colorDial');
  const demoImg = $('#demoImg');
  const demoLabel = $('#demoLabel');
  if (!dial) return;
  const heroColors = ["Pink","Orange","Yellow","Sky Blue","Violet","White"];
  heroColors.forEach((name, idx) => {
    const c = findColor(name);
    const d = document.createElement('div');
    d.className = 'swatch' + (idx === 0 ? ' active' : '');
    d.style.background = c.hex;
    d.title = name;
    d.addEventListener('click', () => {
      $$('.swatch', dial).forEach(s => s.classList.remove('active'));
      d.classList.add('active');
      if (demoLabel) demoLabel.textContent = 'Cloud Lamp — ' + name;
    });
    dial.appendChild(d);
  });
}

// ---------- Отрисовка товаров ----------
function renderProducts(){
  const grid = $('#productGrid');
  if (!grid) return;
  grid.innerHTML = '';

  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    // выбранный цвет по умолчанию
    const defaultColor = p.colorMode === 'parts'
      ? (p.parts[0]?.colors[0] || '')
      : (p.colors?.[0] || '');
    p._selectedColor = defaultColor;

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
        <img src="${p.images[0]}" alt="${p.name}">
      </div>
      ${p.images.length > 1 ? `<div class="thumbs">${p.images.map((img,i)=>`<div class="thumb ${i===0?'active':''}" data-src="${img}"><img src="${img}" alt=""></div>`).join('')}</div>` : ''}
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

    // галерея миниатюр
    const mainImg = $('.card-media img', card);
    $$('.thumb', card).forEach(t => {
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        mainImg.src = t.dataset.src;
        $$('.thumb', card).forEach(o => o.classList.remove('active'));
        t.classList.add('active');
      });
    });

    // выбор цвета
    if (p.colorMode === 'parts'){
      $$('.swatch-picker', card).forEach(picker => {
        const partIdx = picker.dataset.part;
        const nameEl = picker.parentElement.querySelector('.color-name');
        $$('.sw', picker).forEach(sw => {
          sw.addEventListener('click', (e) => {
            e.stopPropagation();
            $$('.sw', picker).forEach(o => o.classList.remove('active'));
            sw.classList.add('active');
            if (nameEl) nameEl.textContent = sw.dataset.color;
            p._selectedColors = p._selectedColors || {};
            p._selectedColors[partIdx] = sw.dataset.color;
          });
        });
      });
    } else {
      const picker = $('.swatch-picker', card);
      const nameEl = $('.color-name', card);
      $$('.sw', picker).forEach(sw => {
        sw.addEventListener('click', (e) => {
          e.stopPropagation();
          $$('.sw', picker).forEach(o => o.classList.remove('active'));
          sw.classList.add('active');
          if (nameEl) nameEl.textContent = sw.dataset.color;
          p._selectedColor = sw.dataset.color;
        });
      });
    }

    // добавить в корзину
    const addBtn = $('.add-btn', card);
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const color = p.colorMode === 'parts'
        ? Object.values(p._selectedColors || {}).join(' / ') || p._selectedColor
        : p._selectedColor;
      addToCart(p, color);
      addBtn.classList.add('added');
      addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7"/></svg>`;
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>`;
      }, 900);
    });

    // купить сейчас
    $('.buy-now-btn', card).addEventListener('click', (e) => {
      e.stopPropagation();
      const color = p.colorMode === 'parts'
        ? Object.values(p._selectedColors || {}).join(' / ') || p._selectedColor
        : p._selectedColor;
      addToCart(p, color);
      openOrderModal();
    });

    // клик по карточке — открыть детали
    card.addEventListener('click', () => openProductModal(p));

    grid.appendChild(card);
  });
}

// ---------- Детали товара ----------
function openProductModal(p){
  const overlay = $('#productOverlay');
  const content = $('#productContent');
  if (!overlay || !content) return;

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
      </div>
    `;

  content.innerHTML = `
    <div class="pm-grid">
      <div>
        <div class="pm-media"><img id="pmMainImg" src="${p.images[0]}" alt="${p.name}"></div>
        ${p.images.length > 1 ? `<div class="pm-thumbs">${p.images.map((img,i)=>`<div class="thumb ${i===0?'active':''}" data-src="${img}"><img src="${img}" alt=""></div>`).join('')}</div>` : ''}
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

  // выбор цвета
  let selected = {};
  if (p.colorMode === 'parts'){
    $$('.swatch-picker', content).forEach(picker => {
      const partIdx = picker.dataset.part;
      const first = $('.sw', picker);
      selected[partIdx] = first?.dataset.color;
      $$('.sw', picker).forEach(sw => {
        sw.addEventListener('click', () => {
          $$('.sw', picker).forEach(o => o.classList.remove('active'));
          sw.classList.add('active');
          selected[partIdx] = sw.dataset.color;
        });
      });
    });
  } else {
    const picker = $('.swatch-picker', content);
    selected[0] = $('.sw', picker)?.dataset.color;
    $$('.sw', picker).forEach(sw => {
      sw.addEventListener('click', () => {
        $$('.sw', picker).forEach(o => o.classList.remove('active'));
        sw.classList.add('active');
        selected[0] = sw.dataset.color;
      });
    });
  }
  const colorForCart = () => Object.values(selected).filter(Boolean).join(' / ');

  $('#pmAddBtn', content).addEventListener('click', () => {
    addToCart(p, colorForCart());
    const b = $('#pmAddBtn', content);
    const o = b.textContent;
    b.textContent = 'Added ✓';
    setTimeout(() => b.textContent = o, 1000);
  });

  $('#pmBuyBtn', content).addEventListener('click', () => {
    addToCart(p, colorForCart());
    overlay.classList.remove('open');
    openOrderModal();
  });

  overlay.classList.add('open');
}

// ---------- Отзывы ----------
const TESTIMONIALS = [
  { name:"J. MARTINEZ — AUSTIN, TX", text:"The Cloud Lamp is the first thing people ask about when they walk into my living room. Packaging alone felt like a gift." },
  { name:"S. OKAFOR — BROOKLYN, NY", text:"Ordered the Wave Shelf in red — genuinely did not expect a 3D-printed piece to feel this premium." },
  { name:"R. CHEN — PORTLAND, OR", text:"Customer support answered every question I had before I even ordered. Shipping was fast and free." },
  { name:"A. THOMPSON — DENVER, CO", text:"Mixed and matched colors on the Wave Magazine Rack — exactly the mismatched-on-purpose look I wanted." },
  { name:"L. NGUYEN — MIAMI, FL", text:"The Stack Nightstand looks like it belongs in a design magazine, not something that came out of a 3D printer." },
  { name:"D. FOSTER — CHICAGO, IL", text:"Every single piece was wrapped like a birthday present." }
];

function renderTestimonials(){
  const track = $('#testiTrack');
  if (!track) return;
  const build = (t) => `
    <div class="testi-card">
      <div class="stars">★★★★★</div>
      <p>"${t.text}"</p>
      <div class="testi-name">${t.name}</div>
    </div>`;
  track.innerHTML = [...TESTIMONIALS, ...TESTIMONIALS].map(build).join('');
}

// ---------- Корзина / модальное окно ----------
const orderOverlay = () => $('#orderOverlay');
const orderContent = () => $('#orderContent');

function openOrderModal(){
  const oc = orderContent();
  const ov = orderOverlay();
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
        <div class="field"><input type="text" name="state" placeholder="State (2-letter, e.g. NY)" maxlength="2" style="text-transform:uppercase" required></div>
      </div>
      <div class="field-row">
        <div class="field"><input type="text" name="zip" placeholder="ZIP code" required></div>
        <div class="field"><input type="text" name="country" placeholder="Country" value="United States" readonly></div>
      </div>
      <div class="field"><textarea name="notes" rows="2" placeholder="Colors, sizes, or anything else we should know"></textarea></div>
      <button type="submit" class="btn btn-solid" id="orderSubmitBtn">Send order</button>
      <p class="form-note">No payment is collected here — this just sends us your order. We'll email you a payment link.</p>
    </form>
  `;

  wireOrderForm();
  renderCart();
  ov.classList.add('open');
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
  const form = $('#orderForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (CART.length === 0) return;
    const btn = $('#orderSubmitBtn');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const fd = new FormData(form);
    const orderSummary = CART.map(i => `${i.name}${i.color ? ' ['+i.color+']' : ''} x${i.qty} (${money(i.price*i.qty)})`).join(', ');
    const total = CART.reduce((s,i) => s + i.price*i.qty, 0);
    fd.append('order_summary', orderSummary);
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
      itemsSummary: orderSummary
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) showOrderSuccess();
      else {
        btn.textContent = original;
        btn.disabled = false;
        alert("Something went wrong sending your order — please email us directly instead.");
      }
    } catch {
      btn.textContent = original;
      btn.disabled = false;
      alert("Couldn't reach the order form — please check your connection, or email us directly.");
    }
  });
}

function showOrderSuccess(){
  const oc = orderContent();
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

// ---------- BXB оплата ----------
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
    try { data = JSON.parse(rawText); } catch { throw new Error(`Worker returned non-JSON: ${rawText.slice(0,300)}`); }
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
        firstName: lastOrderInfo.firstName || "John",
        lastName: lastOrderInfo.lastName || "Doe",
        address: lastOrderInfo.address1 || "123 Main St",
        city: lastOrderInfo.city || "New York",
        state: lastOrderInfo.state || "NY",
        zip: lastOrderInfo.zip || "10001",
        countryCode: 840
      },
      shipping: {
        goodsCost: amountNum,
        deliveryCost: 0,
        deliveryService: 'BXB'
      }
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

// ---------- Инициализация ----------
document.addEventListener('DOMContentLoaded', () => {
  initHeroDial();
  renderProducts();
  renderTestimonials();

  // корзина
  const cartBtn = $('#cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', openOrderModal);

  // закрытие модалок
  const orderClose = $('#orderClose');
  const orderOv = $('#orderOverlay');
  if (orderClose && orderOv){
    orderClose.addEventListener('click', () => orderOv.classList.remove('open'));
    orderOv.addEventListener('click', (e) => { if (e.target === orderOv) orderOv.classList.remove('open'); });
  }

  const productClose = $('#productClose');
  const productOv = $('#productOverlay');
  if (productClose && productOv){
    productClose.addEventListener('click', () => productOv.classList.remove('open'));
    productOv.addEventListener('click', (e) => { if (e.target === productOv) productOv.classList.remove('open'); });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      orderOv?.classList.remove('open');
      productOv?.classList.remove('open');
    }
  });

  // мобильное меню
  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');
  if (burger && mobileMenu){
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  // lead form
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
