/* ═══════════════════════════════════════════════════════════════
   KUDEX — Premium Fitness Apparel | script.js
   Features: Cart System, Navbar Scroll, Mobile Menu, Toast
═══════════════════════════════════════════════════════════════ */

/* ── PRODUCT DATA ───────────────────────────────────────────── */
const PRODUCTS = {
  1: {
    id: 1,
    name: 'KUDEX Core Tee',
    price: 399,
    category: 'T-Shirt',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'
  },
  2: {
    id: 2,
    name: 'KUDEX Flex Joggers',
    price: 549,
    category: 'Lowers',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80'
  },
  3: {
    id: 3,
    name: 'KUDEX Elite Blazer',
    price: 599,
    category: 'Formal Wear',
    img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=200&q=80'
  },
  4: {
    id: 4,
    name: 'KUDEX Muscle Tank',
    price: 299,
    category: 'T-Shirt',
    img: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=200&q=80'
  },
  5: {
    id: 5,
    name: 'KUDEX Training Shorts',
    price: 449,
    category: 'Lowers',
    img: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&q=80'
  },
  6: {
    id: 6,
    name: 'KUDEX Slim Trousers',
    price: 499,
    category: 'Formal Wear',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80'
  }
};

/* ── CART STATE ─────────────────────────────────────────────── */
let cart = {}; // { productId: quantity }

/* ── DOM ELEMENTS ───────────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const cartBtn      = document.getElementById('cartBtn');
const cartCount    = document.getElementById('cartCount');
const cartSidebar  = document.getElementById('cartSidebar');
const cartOverlay  = document.getElementById('cartOverlay');
const cartItems    = document.getElementById('cartItems');
const cartFooter   = document.getElementById('cartFooter');
const cartTotal    = document.getElementById('cartTotal');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const toast        = document.getElementById('toast');

/* ══════════════════════════════════════════════════════════════
   NAVBAR — Scroll Effect
══════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ══════════════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════════════ */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ══════════════════════════════════════════════════════════════
   CART — Core Functions
══════════════════════════════════════════════════════════════ */

/** Add product to cart */
function addToCart(productId) {
  const id = String(productId);
  if (cart[id]) {
    cart[id]++;
  } else {
    cart[id] = 1;
  }
  updateCartUI();
  showToast(`✦ ${PRODUCTS[productId].name} added to cart!`);
  animateCartBtn();
  highlightAddButton(productId);
}

/** Remove product from cart entirely */
function removeFromCart(productId) {
  const id = String(productId);
  delete cart[id];
  updateCartUI();
}

/** Change quantity of a cart item */
function changeQty(productId, delta) {
  const id = String(productId);
  if (!cart[id]) return;
  cart[id] = Math.max(1, cart[id] + delta);
  if (cart[id] === 0) {
    delete cart[id];
  }
  updateCartUI();
}

/** Clear entire cart */
function clearCart() {
  cart = {};
  updateCartUI();
  showToast('Cart cleared.');
}

/* ══════════════════════════════════════════════════════════════
   CART — UI Rendering
══════════════════════════════════════════════════════════════ */

function updateCartUI() {
  renderCartItems();
  updateCartCount();
  updateCartTotal();
}

function renderCartItems() {
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <p>Your cart is empty.</p>
        <a href="#products" onclick="closeCart()" class="btn-primary" style="margin-top:16px;display:inline-block;">Start Shopping</a>
      </div>
    `;
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'flex';

  cartItems.innerHTML = ids.map(id => {
    const product = PRODUCTS[id];
    const qty     = cart[id];
    return `
      <div class="cart-item" id="cart-item-${id}">
        <div class="cart-item-img">
          <img src="${product.img}" alt="${product.name}" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${id})" title="Remove">✕</button>
      </div>
    `;
  }).join('');
}

function updateCartCount() {
  const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  cartCount.textContent = total;

  if (total > 0) {
    cartCount.classList.add('has-items');
  } else {
    cartCount.classList.remove('has-items');
  }
}

function updateCartTotal() {
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    return sum + (PRODUCTS[id].price * qty);
  }, 0);
  cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

/* ══════════════════════════════════════════════════════════════
   CART — Sidebar Open / Close
══════════════════════════════════════════════════════════════ */

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', () => {
  if (cartSidebar.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
});

/* Close cart on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
    closeCart();
  }
});

/* ══════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════════════════════ */

let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ══════════════════════════════════════════════════════════════
   MICRO-INTERACTIONS
══════════════════════════════════════════════════════════════ */

/** Cart button bounce animation */
function animateCartBtn() {
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => { cartBtn.style.transform = ''; }, 200);
}

/** Briefly highlight "Add to Cart" button after click */
function highlightAddButton(productId) {
  const card = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (!card) return;
  const btn = card.querySelector('.add-cart-btn');
  if (!btn) return;

  btn.classList.add('added');
  btn.textContent = '✓ Added!';

  setTimeout(() => {
    btn.classList.remove('added');
    btn.textContent = 'Add to Cart';
  }, 1500);
}

/* ══════════════════════════════════════════════════════════════
   SMOOTH SCROLL HELPER
══════════════════════════════════════════════════════════════ */
function scrollToProducts() {
  const el = document.getElementById('products');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL — Animate cards on scroll
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.product-card, .cat-card, .stat-item, .pillar, .about-title, .about-desc'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${(i % 4) * 0.1}s, transform 0.6s ease ${(i % 4) * 0.1}s`;
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateCartUI(); // Ensure cart is clean on load
  console.log('%cKUDEX ✦ Premium Fitness Apparel', 'color:#C9A84C;font-size:18px;font-weight:bold;');
  console.log('%cWear the difference.', 'color:#888;font-size:12px;');
});
