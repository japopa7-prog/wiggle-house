// ---------- Wiggle House app ----------

// Formspree endpoint for the contact form
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqpzdznb";

// BXB payment backend — Render
const BXB_WORKER_ENDPOINT = "https://wiggle-house-shop.onrender.com/api/payment";

// BXB test mode
const BXB_TEST_MODE = true;

const BXB_WIDGET_JS = BXB_TEST_MODE
  ? "https://pgate-dev.bxb.delivery/js/bxbpay-widget.js"
  : "https://pgate.bxb.delivery/js/bxbpay-widget.js";


// ---------- Color palette ----------

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

function findColor(name){
  return PALETTE.find(c => c.name === name) || {name, hex:"#ccc"};
}


// ---------- Products ----------

const PRODUCTS = [
  {
    id:1,
    name:"Cone Table",
    cat:"tables",
    price:168,
    desc:"A cake-stand top, cylinder waist and cone base — doubles as a side table or a pedestal for your favorite plant.",
    images:[
      "assets/img2.jpg",
      "assets/img3.jpg",
      "assets/img4.jpg",
      "assets/img5.jpg"
    ],
    colorMode:"fixed",
    colorNote:"Blush Pink, Marigold & Sky Blue — signature colorway"
  },

  {
    id:2,
    name:"Bubble Bloom Table",
    cat:"tables",
    price:148,
    badge:"New",
    desc:"Three stacked ribbed spheres topped with a daisy-shaped surface. Sturdy enough for a lamp, light enough to move around.",
    images:[
      "assets/img6.jpg"
    ],
    colorMode:"fixed",
    colorNote:"Bubblegum Pink & Marigold — signature colorway"
  },

  {
    id:3,
    name:"Pedestal Table",
    cat:"tables",
    price:128,
    desc:"A rounded, sculptural side table with a wide top and a totem-like base. One solid color, top to bottom.",
    images:[
      "assets/img7.jpg"
    ],
    colorMode:"choice",
    colorChoices:[
      "Red",
      "Pink",
      "Purple",
      "Yellow",
      "Lime"
    ]
  },

  {
    id:4,
    name:"Wave Shelf",
    cat:"storage",
    price:58,
    desc:"An S-curved wall shelf on two mounting brackets — room for the things you actually reach for every day.",
    images:[
      "assets/img8.jpg",
      "assets/img9.jpg",
      "assets/img10.jpg",
      "assets/img11.jpg"
    ],
    colorMode:"parts",
    parts:[
      {label:"Shelf",full:true},
      {label:"Brackets",full:true}
    ]
  },

  {
    id:5,
    name:"Stack Nightstand — 3 Tier",
    cat:"storage",
    price:178,
    desc:"Three stacked wave-edge cubbies, each deep enough for books, a tablet, or a lamp up top.",
    images:[
      "assets/img12.jpg",
      "assets/img13.jpg",
      "assets/img14.jpg",
      "assets/img15.jpg"
    ],
    colorMode:"parts",
    parts:[
      {label:"Top",full:true},
      {label:"Middle",full:true},
      {label:"Bottom",full:true}
    ]
  },

  {
    id:6,
    name:"Stack Nightstand — 2 Tier",
    cat:"storage",
    price:138,
    desc:"A compact two-tier version of our stacking nightstand — open cubby storage, same wave-edge detail.",
    images:[
      "assets/img16.jpg",
      "assets/img17.jpg",
      "assets/img18.jpg",
      "assets/img19.jpg"
    ],
    colorMode:"parts",
    parts:[
      {label:"Top",full:true},
      {label:"Bottom",full:true}
    ]
  },

  {
    id:7,
    name:"Cloud Lamp",
    cat:"lighting",
    price:54,
    badge:"New",
    desc:"A wavy, cloud-shaped shade on slim tripod legs. Soft, warm glow that works on a side table, nightstand, or shelf.",
    images:[
      "assets/img20.jpg",
      "assets/img21.jpg",
      "assets/img22.jpg"
    ],
    colorMode:"choice",
    colorChoices:[
      "Orange",
      "Pink"
    ]
  },

  {
    id:8,
    name:"Wave Magazine Rack",
    cat:"storage",
    price:38,
    badge:"New",
    desc:"An S-curved desktop rack that holds magazines and books upright, with room for a stack flat underneath.",
    images:[
      "assets/img23.jpg",
      "assets/img24.jpg",
      "assets/img25.jpg"
    ],
    colorMode:"choice",
    colorChoices:[
      "Red",
      "Pink",
      "Purple",
      "Yellow",
      "Lime",
      "Sky Blue",
      "Black",
      "White"
    ]
  }
];


// ---------- Cart ----------

let cart = [];
let lastOrderInfo = null;

function formatPrice(value){
  return "$" + Number(value).toFixed(2);
}

function cartTotal(){
  return cart.reduce((sum,item) => sum + item.price * item.qty, 0);
}

function cartCount(){
  return cart.reduce((sum,item) => sum + item.qty, 0);
}

function updateCartCount(){
  const el = document.getElementById("cartCount");
  if(el) el.textContent = cartCount();
}

function addToCart(product){
  const existing = cart.find(item => item.id === product.id);

  if(existing){
    existing.qty += 1;
  }else{
    cart.push({
      ...product,
      qty:1
    });
  }

  updateCartCount();
}

function removeFromCart(id){
  cart = cart.filter(item => item.id !== id);
  updateCartCount();
  renderCart();
}

function changeQty(id, delta){
  const item = cart.find(i => i.id === id);

  if(!item) return;

  item.qty += delta;

  if(item.qty <= 0){
    cart = cart.filter(i => i.id !== id);
  }

  updateCartCount();
  renderCart();
}


// ---------- Product rendering ----------

function productImage(product){
  return product.images && product.images.length
    ? product.images[0]
    : "assets/img1.jpg";
}

function categoryName(cat){
  if(cat === "lighting") return "Lighting";
  if(cat === "tables") return "Tables";
  if(cat === "storage") return "Storage";
  return "";
}

function renderProducts(filter = "all"){

  const grid = document.getElementById("productGrid");

  if(!grid) return;

  grid.innerHTML = "";

  const list = filter === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === filter);

  list.forEach(p => {

    const card = document.createElement("article");
    card.className = "card";

    const img = productImage(p);

    card.innerHTML = `
      <div class="card-img">
        <img src="${img}" alt="${p.name}" loading="lazy">

        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}

        <button class="quick-add add-btn" aria-label="Add ${p.name} to cart">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.4">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span class="cat">${categoryName(p.cat)}</span>
          <span class="price">${formatPrice(p.price)}</span>
        </div>

        <h3>${p.name}</h3>

        <p>${p.desc}</p>

        <div class="card-actions">
          <button class="btn btn-ghost buy-now-btn">
            Buy now
          </button>

          <button class="btn btn-solid add-btn-2">
            Add to cart
          </button>
        </div>
      </div>
    `;

    const addButtons = [
      card.querySelector(".add-btn"),
      card.querySelector(".add-btn-2")
    ];

    addButtons.forEach(btn => {
      if(!btn) return;

      btn.addEventListener("click", e => {
        e.stopPropagation();

        addToCart(p);

        if(btn.classList.contains("add-btn")){
          btn.classList.add("added");

          btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.6">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          `;

          setTimeout(() => {
            btn.classList.remove("added");

            btn.innerHTML = `
              <svg width="17" height="17" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2.4">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            `;
          },900);
        }
      });
    });

    const buyNow = card.querySelector(".buy-now-btn");

    if(buyNow){
      buyNow.addEventListener("click", e => {
        e.stopPropagation();

        addToCart(p);
        openOrderModal();
      });
    }

    card.addEventListener("click", () => {
      openProductModal(p);
    });

    grid.appendChild(card);
  });
}

renderProducts("all");


// ---------- Filters ----------

document.querySelectorAll(".chip").forEach(chip => {

  chip.addEventListener("click", () => {

    document.querySelectorAll(".chip")
      .forEach(c => c.classList.remove("active"));

    chip.classList.add("active");

    renderProducts(chip.dataset.filter);
  });

});


// ---------- Product modal ----------

const productOverlay = document.getElementById("productOverlay");
const productContent = document.getElementById("productContent");

function openProductModal(product){

  if(!productOverlay || !productContent) return;

  const mainImage = productImage(product);

  let swatches = "";

  if(product.colorMode === "choice"){

    swatches = `
      <div class="product-colors">
        <strong>Available colors</strong>
        <div class="swatches">
          ${(product.colorChoices || []).map(name => {
            const c = findColor(name);

            return `
              <span
                class="swatch"
                title="${c.name}"
                style="background:${c.hex}">
              </span>
            `;
          }).join("")}
        </div>
      </div>
    `;

  }else if(product.colorMode === "fixed"){

    swatches = `
      <div class="product-colors">
        <strong>Signature colorway</strong>
        <p>${product.colorNote || ""}</p>
      </div>
    `;

  }else if(product.colorMode === "parts"){

    swatches = `
      <div class="product-colors">
        <strong>Custom colors</strong>
        <p>Choose the colors for each part when ordering.</p>
      </div>
    `;
  }

  productContent.innerHTML = `
    <div class="product-detail">

      <div class="product-detail-image">
        <img src="${mainImage}" alt="${product.name}">
      </div>

      <div class="product-detail-info">

        <span class="eyebrow">
          ${categoryName(product.cat)}
        </span>

        <h3>${product.name}</h3>

        <div class="product-detail-price">
          ${formatPrice(product.price)}
        </div>

        <p class="product-detail-desc">
          ${product.desc}
        </p>

        ${swatches}

        <button class="btn btn-solid product-modal-add">
          Add to cart
        </button>

        <button class="btn btn-ghost product-modal-buy">
          Buy now
        </button>

      </div>

    </div>
  `;

  productOverlay.classList.add("open");

  const addBtn = productContent.querySelector(".product-modal-add");

  addBtn.addEventListener("click", () => {
    addToCart(product);
    addBtn.textContent = "Added ✓";

    setTimeout(() => {
      addBtn.textContent = "Add to cart";
    },1200);
  });

  const buyBtn = productContent.querySelector(".product-modal-buy");

  buyBtn.addEventListener("click", () => {
    addToCart(product);
    closeProductModal();
    openOrderModal();
  });
}

function closeProductModal(){

  if(productOverlay){
    productOverlay.classList.remove("open");
  }
}

if(document.getElementById("productClose")){
  document.getElementById("productClose")
    .addEventListener("click",closeProductModal);
}

if(productOverlay){
  productOverlay.addEventListener("click",e => {
    if(e.target === productOverlay){
      closeProductModal();
    }
  });
}


// ---------- Cart rendering ----------

function renderCart(){

  const lines = document.getElementById("cartLines");
  const total = document.getElementById("cartTotal");

  if(!lines || !total) return;

  if(cart.length === 0){

    lines.innerHTML = `
      <div class="empty-cart">
        Your cart is empty.
      </div>
    `;

    total.textContent = "$0.00";
    return;
  }

  lines.innerHTML = cart.map(item => `
    <div class="cart-line">

      <img src="${productImage(item)}" alt="${item.name}">

      <div class="cart-line-info">
        <strong>${item.name}</strong>

        <span>
          ${formatPrice(item.price)}
        </span>

        <div class="qty">
          <button data-id="${item.id}" data-delta="-1">−</button>
          <span>${item.qty}</span>
          <button data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>

      <button
        class="cart-remove"
        data-remove="${item.id}"
        aria-label="Remove">
        ×
      </button>

    </div>
  `).join("");

  total.textContent = formatPrice(cartTotal());

  lines.querySelectorAll("[data-id]").forEach(btn => {

    btn.addEventListener("click", () => {

      changeQty(
        Number(btn.dataset.id),
        Number(btn.dataset.delta)
      );

    });

  });

  lines.querySelectorAll("[data-remove]").forEach(btn => {

    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.dataset.remove));
    });

  });
}


// ---------- Order modal ----------

const orderOverlay = document.getElementById("orderOverlay");
const orderContent = document.getElementById("orderContent");

function openOrderModal(){

  if(!orderOverlay) return;

  if(cart.length === 0){
    return;
  }

  orderOverlay.classList.add("open");

  renderOrderForm();
}

function closeOrderModal(){

  if(orderOverlay){
    orderOverlay.classList.remove("open");
  }
}

if(document.getElementById("orderClose")){
  document.getElementById("orderClose")
    .addEventListener("click",closeOrderModal);
}

if(orderOverlay){
  orderOverlay.addEventListener("click",e => {

    if(e.target === orderOverlay){
      closeOrderModal();
    }

  });
}


// ---------- Render order form ----------

function renderOrderForm(){

  if(!orderContent) return;

  orderContent.innerHTML = `
    <h3>Your order</h3>

    <p class="modal-sub">
      Enter your shipping information and continue to secure payment.
    </p>

    <div class="cart-lines" id="cartLines"></div>

    <div class="cart-total" id="cartTotal"></div>

    <form id="orderForm">

      <div class="field-row">

        <div class="field">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            required>
        </div>

        <div class="field">
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            required>
        </div>

      </div>

      <div class="field">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required>
      </div>

      <div class="field">
        <input
          type="text"
          name="address1"
          placeholder="Street address"
          required>
      </div>

      <div class="field-row">

        <div class="field">
          <input
            type="text"
            name="city"
            placeholder="City"
            required>
        </div>

        <div class="field">
          <input
            type="text"
            name="state"
            placeholder="State (2-letter, e.g. NY)"
            maxlength="2"
            style="text-transform:uppercase"
            required>
        </div>

      </div>

      <div class="field-row">

        <div class="field">
          <input
            type="text"
            name="zip"
            placeholder="ZIP code"
            required>
        </div>

        <div class="field">
          <input
            type="text"
            name="country"
            placeholder="Country"
            value="United States"
            readonly>
        </div>

      </div>

      <div class="field">
        <textarea
          name="notes"
          rows="2"
          placeholder="Colors, sizes, or anything else we should know"></textarea>
      </div>

      <button
        type="submit"
        class="btn btn-solid"
        id="orderSubmitBtn">
        Continue to payment
      </button>

      <p class="form-note">
        Secure card payment powered by BXB.
      </p>

    </form>
  `;

  renderCart();

  document
    .getElementById("orderForm")
    .addEventListener("submit",submitOrder);
}


// ---------- Submit order ----------

async function submitOrder(e){

  e.preventDefault();

  if(cart.length === 0){
    return;
  }

  const form = e.currentTarget;

  const fd = new FormData(form);

  const submitBtn =
    document.getElementById("orderSubmitBtn");

  if(submitBtn){
    submitBtn.disabled = true;
    submitBtn.textContent = "Preparing payment…";
  }

  const total = cartTotal();

  const invoiceNumber =
    "WH-" +
    Date.now().toString().slice(-10);

  lastOrderInfo = {

    firstName: fd.get("firstName") || "",

    lastName: fd.get("lastName") || "",

    email: fd.get("email") || "",

    address1: fd.get("address1") || "",

    city: fd.get("city") || "",

    state: fd.get("state") || "",

    zip: fd.get("zip") || "",

    country: fd.get("country") || "United States",

    notes: fd.get("notes") || "",

    total,

    invoiceNumber

  };

  try{

    if(BXB_WORKER_ENDPOINT){

      await prepareBXBPayment();

    }else{

      await submitOrderFallback();

    }

  }catch(err){

    console.error(err);

    if(submitBtn){
      submitBtn.disabled = false;
      submitBtn.textContent = "Continue to payment";
    }

    alert(
      "Could not start payment form.\n\n" +
      (err?.message || "Please try again.")
    );

  }
}


// ---------- BXB widget ----------

function loadBXBWidget(){

  return new Promise((resolve,reject) => {

    if(window.BXBPay){
      resolve();
      return;
    }

    const existing =
      document.querySelector(
        `script[src="${BXB_WIDGET_JS}"]`
      );

    if(existing){

      existing.addEventListener("load",resolve);
      existing.addEventListener("error",reject);

      return;
    }

    const s = document.createElement("script");

    s.src = BXB_WIDGET_JS;

    s.onload = () => resolve();

    s.onerror = () =>
      reject(
        new Error("Could not load BXB payment widget.")
      );

    document.head.appendChild(s);

  });

}


// ---------- Start BXB payment ----------

async function prepareBXBPayment(){

  if(!lastOrderInfo || !BXB_WORKER_ENDPOINT){
    return;
  }

  const amountStr =
    lastOrderInfo.total.toFixed(2);

  const payload = {

    invoiceNumber:
      lastOrderInfo.invoiceNumber,

    amount:
      amountStr,

    currency:"USD",

    email:
      lastOrderInfo.email

  };

  const res = await fetch(
    BXB_WORKER_ENDPOINT,
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(payload)
    }
  );

  const rawText = await res.text();

  let data;

  try {
    data = JSON.parse(rawText);
  } catch {
    data = {
      result:false,
      message:rawText
    };
  }

  if(!res.ok || data.result === false){

    throw new Error(
      data.message ||
      data.error ||
      `Payment server returned ${res.status}`
    );

  }

  if(!data.token){

    throw new Error(
      "BXB did not return a payment token."
    );

  }

  await loadBXBWidget();

  openBXBWidget(data.token);
}


// ---------- Open BXB widget ----------

function openBXBWidget(token){

  const container =
    document.getElementById("bxbpay-widget");

  if(!container){
    throw new Error(
      "Payment widget container not found."
    );
  }

  container.style.display = "block";

  const orderContent =
    document.getElementById("orderContent");

  if(orderContent){
    orderContent.style.display = "none";
  }

  // Try the common BXB widget initialization forms.
  if(window.BXBPay){

    if(typeof window.BXBPay.open === "function"){

      window.BXBPay.open({
        token:token,
        container:"#bxbpay-widget"
      });

      return;
    }

    if(typeof window.BXBPay.init === "function"){

      window.BXBPay.init({
        token:token,
        container:"#bxbpay-widget"
      });

      return;
    }

    if(typeof window.BXBPay === "function"){

      new window.BXBPay({
        token:token,
        container:"#bxbpay-widget"
      });

      return;
    }
  }

  // Some BXB versions expose a global widget object.
  if(window.bxbpay){

    if(typeof window.bxbpay.open === "function"){

      window.bxbpay.open({
        token:token,
        container:"#bxbpay-widget"
      });

      return;
    }

    if(typeof window.bxbpay.init === "function"){

      window.bxbpay.init({
        token:token,
        container:"#bxbpay-widget"
      });

      return;
    }
  }

  throw new Error(
    "BXB payment widget loaded, but its initialization method was not found."
  );
}


// ---------- Fallback order submission ----------

async function submitOrderFallback(){

  const form =
    document.getElementById("orderForm");

  if(!form) return;

  const fd =
    new FormData(form);

  const data = {

    firstName:
      fd.get("firstName") || "",

    lastName:
      fd.get("lastName") || "",

    email:
      fd.get("email") || "",

    address1:
      fd.get("address1") || "",

    city:
      fd.get("city") || "",

    state:
      fd.get("state") || "",

    zip:
      fd.get("zip") || "",

    country:
      fd.get("country") || "United States",

    notes:
      fd.get("notes") || "",

    total:
      cartTotal(),

    items:
      cart.map(item => ({
        name:item.name,
        price:item.price,
        qty:item.qty
      }))

  };

  try{

    await fetch(
      FORMSPREE_ENDPOINT,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body:JSON.stringify(data)
      }
    );

  }catch(err){

    console.warn(
      "Fallback order submission failed:",
      err
    );

  }

  if(orderContent){

    orderContent.innerHTML = `
      <div class="order-success">

        <div class="success-icon">✓</div>

        <h3>Order received!</h3>

        <p>
          Thanks! We've received your order details
          and will contact you by email.
        </p>

        <button
          class="btn btn-solid"
          id="successClose">
          Done
        </button>

      </div>
    `;

    const close =
      document.getElementById("successClose");

    if(close){
      close.addEventListener(
        "click",
        closeOrderModal
      );
    }

  }

  cart = [];

  updateCartCount();
}


// ---------- Cart button ----------

const cartBtn =
  document.getElementById("cartBtn");

if(cartBtn){

  cartBtn.addEventListener(
    "click",
    () => {

      if(cart.length === 0){

        openOrderModal();

        return;
      }

      openOrderModal();

    }
  );

}


// ---------- Lead form ----------

const leadForm =
  document.getElementById("leadForm");

if(leadForm){

  leadForm.addEventListener(
    "submit",
    async function(e){

      e.preventDefault();

      const btn =
        this.querySelector("button");

      const original =
        btn ? btn.textContent : "";

      if(btn){
        btn.disabled = true;
        btn.textContent = "Sending…";
      }

      try{

        const fields =
          this.querySelectorAll("input");

        const data = {};

        fields.forEach(field => {
          data[field.placeholder] =
            field.value;
        });

        if(FORMSPREE_ENDPOINT){

          await fetch(
            FORMSPREE_ENDPOINT,
            {
              method:"POST",
              headers:{
                "Content-Type":
                  "application/json",
                "Accept":
                  "application/json"
              },
              body:JSON.stringify(data)
            }
          );

        }

        if(btn){
          btn.textContent =
            "Thanks — you're on the list!";
        }

        setTimeout(() => {

          this.reset();

          if(btn){
            btn.disabled = false;
            btn.textContent = original;
          }

        },2200);

      }catch(err){

        console.error(err);

        if(btn){
          btn.disabled = false;
          btn.textContent = original;
        }

        alert(
          "Something went wrong. Please try again."
        );

      }

    }
  );

}


// ---------- Mobile menu ----------

const burger =
  document.getElementById("burger");

const mobileMenu =
  document.getElementById("mobileMenu");

if(burger && mobileMenu){

  burger.addEventListener(
    "click",
    () => {
      mobileMenu.classList.toggle("open");
    }
  );

  mobileMenu
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {
          mobileMenu.classList.remove("open");
        }
      );

    });

}


// ---------- Hero color dial ----------

const colorDial =
  document.getElementById("colorDial");

const demoImg =
  document.getElementById("demoImg");

const demoLabel =
  document.getElementById("demoLabel");

const dialCaption =
  document.getElementById("dialCaption");

if(colorDial){

  PALETTE.forEach((color,index) => {

    const dot =
      document.createElement("button");

    dot.className = "dial-dot";

    dot.title = color.name;

    dot.style.background =
      color.hex;

    dot.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".dial-dot")
          .forEach(d =>
            d.classList.remove("active")
          );

        dot.classList.add("active");

        if(demoLabel){
          demoLabel.textContent =
            color.name;
        }

        if(dialCaption){
          dialCaption.innerHTML =
            `${color.name} · <a href="#shop">see all products</a>`;
        }

      }
    );

    if(index === 0){
      dot.classList.add("active");
    }

    colorDial.appendChild(dot);

  });

}


// ---------- Testimonials ----------

const TESTIMONIALS = [

  {
    name:"J. MARTINEZ — AUSTIN, TX",
    text:"The Cone Table is the first thing people ask about when they walk into my living room. Packaging alone felt like a gift."
  },

  {
    name:"S. OKAFOR — BROOKLYN, NY",
    text:"Ordered the Pedestal Table in red — genuinely did not expect a 3D-printed piece to feel this premium."
  },

  {
    name:"R. CHEN — PORTLAND, OR",
    text:"Customer support answered every question I had before I even ordered. Shipping was fast and free, exactly as promised."
  },

  {
    name:"A. THOMPSON — DENVER, CO",
    text:"Mixed and matched colors on the Wave Shelf for our kitchen corner — it's exactly the mismatched-on-purpose look I wanted."
  },

  {
    name:"L. NGUYEN — MIAMI, FL",
    text:"The 3-Tier Nightstand looks like it belongs in a design magazine, not something that came out of a 3D printer."
  },

  {
    name:"D. FOSTER — CHICAGO, IL",
    text:"Ordered three pieces for the 10% discount — every single one was wrapped like a birthday present."
  }

];

const track =
  document.getElementById("testiTrack");

function starRow(){
  return "★★★★★";
}

function buildTestiCard(t){

  const el =
    document.createElement("div");

  el.className =
    "testi-card";

  el.innerHTML = `
    <div class="stars">
      ${starRow()}
    </div>

    <p>
      "${t.text}"
    </p>

    <div class="testi-name">
      ${t.name}
    </div>
  `;

  return el;
}

if(track){

  [
    ...TESTIMONIALS,
    ...TESTIMONIALS
  ].forEach(t => {

    track.appendChild(
      buildTestiCard(t)
    );

  });

}


// ---------- Initial state ----------

updateCartCount();