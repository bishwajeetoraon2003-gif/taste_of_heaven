/* ==========================================================================
   TASTE OF HEAVEN - MAIN JAVASCRIPT APPLICATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. MENU DATABASE
     -------------------------------------------------------------------------- */
  const MENU_DATA = [
    {
      id: 1,
      title: "A5 Miyazaki Wagyu Tenderloin",
      category: "specials",
      price: 185.00,
      rating: 4.9,
      veg: false,
      popular: true,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      description: "Pan-seared A5 Wagyu with black truffle reduction, smoked bone marrow emulsion, and seasonal wild mushrooms.",
      allergens: "Dairy, Mushrooms"
    },
    {
      id: 2,
      title: "Butter-Poached Maine Lobster",
      category: "mains",
      price: 145.00,
      rating: 4.8,
      veg: false,
      popular: true,
      image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=80",
      description: "Sous-vide Maine lobster tail served over saffron risotto, sea asparagus, and Meyer lemon foam.",
      allergens: "Shellfish, Dairy"
    },
    {
      id: 3,
      title: "Wild Organic Truffle Carpaccio",
      category: "starters",
      price: 68.00,
      rating: 4.9,
      veg: true,
      popular: true,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      description: "Paper-thin black truffle slices, 36-month aged Parmigiano Reggiano crisp, organic microgreens, and cold-pressed extra virgin olive oil.",
      allergens: "Dairy"
    },
    {
      id: 4,
      title: "Pan-Seared Chilean Sea Bass",
      category: "mains",
      price: 120.00,
      rating: 4.7,
      veg: false,
      popular: false,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      description: "Wild-caught Chilean Sea Bass with dashi dashi broth, baby bok choy, and ginger oil infusion.",
      allergens: "Fish, Soy"
    },
    {
      id: 5,
      title: "Gold Leaf Chocolate Sphere",
      category: "desserts",
      price: 45.00,
      rating: 5.0,
      veg: true,
      popular: true,
      image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80",
      description: "24-Karat edible gold encasing Valrhona dark chocolate mousse, hot raspberry coulis poured tableside.",
      allergens: "Dairy, Gluten, Soy"
    },
    {
      id: 6,
      title: "Celestial Smoked Old Fashioned",
      category: "cocktails",
      price: 32.00,
      rating: 4.9,
      veg: true,
      popular: true,
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
      description: "Rare Macallan 18yr scotch, organic smoked applewood bitters, hand-carved ice sphere, and orange twist flame.",
      allergens: "Alcohol"
    },
    {
      id: 7,
      title: "Heirloom Burrata & Peach Caviar",
      category: "starters",
      price: 55.00,
      rating: 4.8,
      veg: true,
      popular: false,
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80",
      description: "Handmade Pugliese burrata, heirloom tomatoes, balsamic spherification caviar, and fresh basil blossom oil.",
      allergens: "Dairy"
    },
    {
      id: 8,
      title: "Deconstructed Golden Mille-Feuille",
      category: "desserts",
      price: 40.00,
      rating: 4.9,
      veg: true,
      popular: false,
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
      description: "Caramelized puff pastry, Tahitian vanilla bean diplomat cream, praline crunch, and gold leaf.",
      allergens: "Gluten, Dairy"
    }
  ];

  let cart = JSON.parse(localStorage.getItem('taste_cart')) || [];

  /* --------------------------------------------------------------------------
     2. PRELOADER & INITIALIZATION
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloader-fill');
  const preloaderText = document.getElementById('preloader-text');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;

    preloaderFill.style.width = `${progress}%`;
    preloaderText.textContent = `PREPARING CELESTIAL EXPERIENCE ${progress}%`;

    if (progress === 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
        }, 800);
        initAnimations();
      }, 400);
    }
  }, 60);

  /* --------------------------------------------------------------------------
     3. CANVAS PARTICLE SYSTEM (GOLD DUST)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 20) + 1;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.speedY = Math.random() * 0.5 + 0.1;
    }

    draw() {
      ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      this.y -= this.speedY;
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }

      // Parallax mouse interaction
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* --------------------------------------------------------------------------
     4. CUSTOM CURSOR
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  });

  function renderCursor() {
    ringX += (cursorX - ringX) * 0.15;
    ringY += (cursorY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover target scale
  const interactiveSelector = 'a, button, .food-card, .gallery-item, .table-option-btn, input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('hover-target');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('hover-target');
    }
  });

  /* --------------------------------------------------------------------------
     5. STICKY NAVBAR & SCROLL SPY
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. LIVE RESTAURANT STATUS CLOCK
     -------------------------------------------------------------------------- */
  function updateLiveClock() {
    const liveClockEl = document.getElementById('live-clock');
    if (!liveClockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const isOpen = now.getHours() >= 17 && now.getHours() < 24;
    const statusText = isOpen ? 'OPEN NOW' : 'ACCEPTING RESERVATIONS';
    liveClockEl.textContent = `${statusText} • ${hours}:${minutes} NY`;
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  /* --------------------------------------------------------------------------
     7. WEB AUDIO LOUNGE SYNTHESIZER
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isPlayingAudio = false;
  let synthInterval = null;

  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  btnAudioToggle.addEventListener('click', () => {
    if (!isPlayingAudio) {
      startLoungeSynth();
      isPlayingAudio = true;
      btnAudioToggle.style.color = 'var(--accent-gold-bright)';
      showToast('Ambient Lounge Chords Enabled 🎵', 'gold');
    } else {
      stopLoungeSynth();
      isPlayingAudio = false;
      btnAudioToggle.style.color = 'var(--text-primary)';
      showToast('Ambient Sound Muted', 'info');
    }
  });

  function startLoungeSynth() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const chords = [
      [220, 277.18, 329.63, 415.30], // A Major 7
      [174.61, 220.00, 261.63, 329.63], // F Major 7
      [196.00, 246.94, 293.66, 392.00], // G Major
      [146.83, 220.00, 261.63, 329.63]  // D Minor 7
    ];
    let currentChord = 0;

    function playChord() {
      if (!isPlayingAudio) return;
      const now = audioCtx.currentTime;
      const chord = chords[currentChord];

      chord.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 4.6);
      });

      currentChord = (currentChord + 1) % chords.length;
    }

    playChord();
    synthInterval = setInterval(playChord, 5000);
  }

  function stopLoungeSynth() {
    if (synthInterval) clearInterval(synthInterval);
  }

  /* --------------------------------------------------------------------------
     8. THEME TOGGLE (DARK / LIGHT LUXURY)
     -------------------------------------------------------------------------- */
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const currentTheme = localStorage.getItem('taste_theme') || 'dark';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  btnThemeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('taste_theme', 'light');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      showToast('Switched to Golden Ivory Light Mode', 'gold');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('taste_theme', 'dark');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      showToast('Switched to Dark Obsidian Luxury Mode', 'gold');
    }
  });

  /* --------------------------------------------------------------------------
     9. MOBILE NAVIGATION MENU
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  /* --------------------------------------------------------------------------
     10. MENU FILTERING, SEARCH, & 3D TILT CARDS
     -------------------------------------------------------------------------- */
  const menuGrid = document.getElementById('menu-grid');
  const menuFilterBtns = document.querySelectorAll('#filter-tabs .filter-btn');
  const searchInput = document.getElementById('menu-search');
  const filterVeg = document.getElementById('filter-veg');
  const filterPopular = document.getElementById('filter-popular');

  let activeCategory = 'all';
  let currentLoadedMenu = MENU_DATA;

  async function renderMenu() {
    if (!menuGrid) return;
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const isVegOnly = filterVeg ? filterVeg.checked : false;
    const isPopularOnly = filterPopular ? filterPopular.checked : false;

    let dataSource = MENU_DATA;

    if (window.TasteAPI) {
      const apiMenu = await window.TasteAPI.getMenu(activeCategory, searchVal);
      if (apiMenu && apiMenu.length > 0) {
        dataSource = apiMenu.map(m => ({
          id: m.id,
          title: m.title,
          category: m.category,
          price: parseFloat(m.price),
          rating: parseFloat(m.rating || 4.9),
          veg: Boolean(m.veg),
          popular: Boolean(m.popular),
          image: m.image_url || m.image || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
          description: m.description
        }));
      }
    }

    currentLoadedMenu = dataSource;

    const filtered = dataSource.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = !searchVal || item.title.toLowerCase().includes(searchVal) || item.description.toLowerCase().includes(searchVal);
      const matchVeg = !isVegOnly || item.veg;
      const matchPopular = !isPopularOnly || item.popular;
      return matchCat && matchSearch && matchVeg && matchPopular;
    });

    if (filtered.length === 0) {
      menuGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <i class="fa-solid fa-utensils" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem;"></i>
          <h3 style="font-family: var(--font-heading); color: var(--text-primary); margin-bottom: 0.5rem;">No Dishes Match Your Search</h3>
          <p style="font-size: 0.9rem;">Try adjusting your filters or search terms.</p>
        </div>
      `;
      return;
    }

    menuGrid.innerHTML = filtered.map(item => `
      <div class="glass-card food-card" data-id="${item.id}">
        <div class="food-card-img-wrapper">
          <img src="${item.image}" alt="${item.title}" class="food-card-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';">
          <div class="food-badges">
            ${item.veg ? '<span class="badge badge-veg"><i class="fa-solid fa-leaf"></i> VEG</span>' : '<span class="badge badge-nonveg"><i class="fa-solid fa-drumstick-bite"></i> NON-VEG</span>'}
            ${item.popular ? '<span class="badge badge-gold"><i class="fa-solid fa-fire"></i> POPULAR</span>' : ''}
          </div>
        </div>
        <div class="food-card-body">
          <div class="food-card-header">
            <h3 class="food-title">${item.title}</h3>
            <div class="food-price">$${item.price.toFixed(2)}</div>
          </div>
          <p class="food-desc">${item.description}</p>
          <div class="food-card-footer">
            <div class="food-rating">
              <i class="fa-solid fa-star"></i> ${item.rating.toFixed(1)}
            </div>
            <button class="btn btn-gold btn-add-cart" data-id="${item.id}">
              <i class="fa-solid fa-plus"></i> Add to Order
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Re-attach 3D Tilt handlers & Add to cart handlers
    attachCardEvents();
  }

  menuFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderMenu();
    });
  });

  searchInput?.addEventListener('input', renderMenu);
  filterVeg?.addEventListener('change', renderMenu);
  filterPopular?.addEventListener('change', renderMenu);

  function attachCardEvents() {
    // 3D Card Hover Tilt
    const foodCards = document.querySelectorAll('.food-card');
    foodCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (centerY - y) / 15;
        const rotateY = (x - centerX) / 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });

    // Add to cart buttons
    const addBtns = document.querySelectorAll('.btn-add-cart');
    addBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        addToCart(id);
      });
    });
  }

  renderMenu();

  /* --------------------------------------------------------------------------
     11. ONLINE ORDERING CART & DRAWER
     -------------------------------------------------------------------------- */
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const btnCartOpen = document.getElementById('btn-cart-open');
  const btnCartClose = document.getElementById('btn-cart-close');
  const heroOrderBtn = document.getElementById('hero-order-btn');

  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    updateCartUI();
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  btnCartOpen?.addEventListener('click', openCart);
  btnCartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  heroOrderBtn?.addEventListener('click', openCart);

  function addToCart(id) {
    const dish = (currentLoadedMenu && currentLoadedMenu.find(item => item.id === id)) || MENU_DATA.find(item => item.id === id);
    if (!dish) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...dish, qty: 1 });
    }

    localStorage.setItem('taste_cart', JSON.stringify(cart));
    updateCartUI();
    showToast(`Added "${dish.title}" to order cart! 🍷`, 'gold');
  }

  function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCountEl.textContent = totalQty;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem;"></i>
          <h4 style="font-family: var(--font-heading); color: var(--text-primary); margin-bottom: 0.5rem;">Your Cart is Empty</h4>
          <p style="font-size: 0.85rem;">Explore our gourmet menu to add dishes.</p>
        </div>
      `;
      cartSubtotalEl.textContent = '$0.00';
      cartTaxEl.textContent = '$0.00';
      cartTotalEl.textContent = '$0.00';
      return;
    }

    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="qty-btn" style="background: transparent; color: #EF4444;" onclick="removeItem(${item.id})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartTaxEl.textContent = `$${tax.toFixed(2)}`;
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  window.changeQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    localStorage.setItem('taste_cart', JSON.stringify(cart));
    updateCartUI();
  };

  window.removeItem = function(id) {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('taste_cart', JSON.stringify(cart));
    updateCartUI();
    showToast('Item removed from cart', 'info');
  };

  // Payment Method Option Selector Handler
  const optCod = document.getElementById('opt-cod');
  const optOnline = document.getElementById('opt-online');
  const onlineDetails = document.getElementById('online-payment-details');

  optCod?.addEventListener('click', () => {
    optCod.classList.add('selected');
    optOnline.classList.remove('selected');
    optCod.querySelector('input').checked = true;
    if (onlineDetails) onlineDetails.style.display = 'none';
  });

  optOnline?.addEventListener('click', () => {
    optOnline.classList.add('selected');
    optCod.classList.remove('selected');
    optOnline.querySelector('input').checked = true;
    if (onlineDetails) onlineDetails.style.display = 'block';
  });

  // Checkout simulation
  const btnCheckout = document.getElementById('btn-checkout');
  btnCheckout?.addEventListener('click', async () => {
    if (cart.length === 0) {
      showToast('Your order cart is empty!', 'error');
      return;
    }

    const isOnline = optOnline?.classList.contains('selected');
    let payMethod = 'Cash on Delivery (COD)';
    if (isOnline) {
      const paySub = document.getElementById('online-pay-type')?.value || 'Online Payment';
      payMethod = `Pay Online - ${paySub}`;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal * 1.10;
    const orderRef = `#ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderPayload = {
      customerName: 'Valued Guest',
      customerEmail: 'guest@tasteofheaven.com',
      customerPhone: '+1 555 000 8888',
      orderType: 'delivery',
      paymentMethod: payMethod,
      items: cart
    };

    if (window.TasteAPI) {
      await window.TasteAPI.createOrder(orderPayload);
    }

    // Save to local storage for Admin Panel sync
    let localOrders = JSON.parse(localStorage.getItem('taste_orders')) || [];
    localOrders.unshift({
      referenceCode: orderRef,
      customerName: 'Valued Guest',
      customerEmail: 'guest@tasteofheaven.com',
      items: cart.map(i => `${i.qty}x ${i.title}`).join(', '),
      total: total.toFixed(2),
      paymentMethod: payMethod,
      status: 'received',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('taste_orders', JSON.stringify(localOrders));

    cart = [];
    localStorage.removeItem('taste_cart');
    updateCartUI();
    closeCart();
    showToast(`Order Placed (${payMethod})! Your Chef is preparing your gourmet order 🍾`, 'gold');
  });

  /* --------------------------------------------------------------------------
     12. MASONRY GALLERY & LIGHTBOX
     -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  let activeGalleryItems = Array.from(galleryItems);

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.gallery-filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      activeGalleryItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
    });
  });

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentGalleryIndex = activeGalleryItems.indexOf(item);
      openLightbox();
    });
  });

  function openLightbox() {
    const item = activeGalleryItems[currentGalleryIndex];
    if (!item) return;
    const src = item.getAttribute('data-src');
    const title = item.querySelector('.gallery-title')?.textContent || '';
    lightboxImg.src = src;
    lightboxCaption.textContent = title;
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    openLightbox();
  });
  lightboxNext?.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryItems.length;
    openLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* --------------------------------------------------------------------------
     13. TESTIMONIAL SLIDER
     -------------------------------------------------------------------------- */
  const testimonialTrack = document.getElementById('testimonial-track');
  const sliderDots = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  let slideInterval = null;

  function goToSlide(index) {
    currentSlide = index;
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    sliderDots.forEach(dot => dot.classList.remove('active'));
    sliderDots[currentSlide]?.classList.add('active');
  }

  sliderDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slide = parseInt(dot.getAttribute('data-slide'));
      goToSlide(slide);
      resetSlideTimer();
    });
  });

  function startSlideTimer() {
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % 3;
      goToSlide(currentSlide);
    }, 5000);
  }
  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }
  startSlideTimer();

  /* --------------------------------------------------------------------------
     14. RESERVATION FORM & FLOORPLAN PICKER
     -------------------------------------------------------------------------- */
  const tableOptionBtns = document.querySelectorAll('.table-option-btn');
  const selectedTableIdInput = document.getElementById('selected-table-id');
  const reservationForm = document.getElementById('reservation-form');
  const resSuccessModal = document.getElementById('res-success-modal');
  const btnCloseResModal = document.getElementById('btn-close-res-modal');

  tableOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tableOptionBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const tableId = btn.getAttribute('data-table');
      selectedTableIdInput.value = tableId;
    });
  });

  reservationForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name').value;
    const email = document.getElementById('res-email').value;
    const phone = document.getElementById('res-phone').value;
    const guests = document.getElementById('res-guests').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const notes = document.getElementById('res-notes')?.value || '';
    const tableBtn = document.querySelector('.table-option-btn.selected .table-name')?.textContent || 'Skyline View';

    const resPayload = {
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
      guestsCount: guests,
      reservationDate: date,
      reservationTime: time,
      tableAtmosphere: tableBtn,
      specialNotes: notes
    };

    let refCode = `#TH-${Math.floor(10000 + Math.random() * 90000)}`;

    if (window.TasteAPI) {
      const apiRes = await window.TasteAPI.createReservation(resPayload);
      if (apiRes && apiRes.data && apiRes.data.reservation) {
        refCode = apiRes.data.reservation.referenceCode || apiRes.data.reservation.reference_code || refCode;
      }
    }

    // Save to local storage for Admin Panel sync
    let localRes = JSON.parse(localStorage.getItem('taste_reservations')) || [];
    localRes.unshift({
      referenceCode: refCode,
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
      guestsCount: guests,
      reservationDate: date,
      reservationTime: time,
      tableAtmosphere: tableBtn,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('taste_reservations', JSON.stringify(localRes));

    document.getElementById('conf-ref').textContent = refCode;
    document.getElementById('conf-name').textContent = name;
    document.getElementById('conf-guests').textContent = `${guests} Guest(s)`;
    document.getElementById('conf-datetime').textContent = `${date} at ${time}`;
    document.getElementById('conf-table').textContent = tableBtn;

    resSuccessModal.classList.add('active');
    reservationForm.reset();
  });

  btnCloseResModal?.addEventListener('click', () => {
    resSuccessModal.classList.remove('active');
  });

  /* --------------------------------------------------------------------------
     15. FAQ ACCORDION
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Open default active FAQ
  const defaultFaq = document.querySelector('.faq-item.active .faq-content');
  if (defaultFaq) defaultFaq.style.maxHeight = defaultFaq.scrollHeight + 'px';

  /* --------------------------------------------------------------------------
     16. ANIMATED STATS COUNTER
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '+';
          let count = 0;
          const step = Math.ceil(target / 40);
          const counterInterval = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(counterInterval);
            }
            stat.textContent = `${count}${suffix}`;
          }, 30);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) statsObserver.observe(statsSection);

  /* --------------------------------------------------------------------------
     17. BACK TO TOP & SCROLL PROGRESS RING
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.getElementById('progress-circle');
  const circleLength = 144; // 2 * pi * r (r=23)

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    if (scrollTop > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    if (progressCircle) {
      const offset = circleLength - (scrollPercent * circleLength);
      progressCircle.style.strokeDashoffset = offset;
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --------------------------------------------------------------------------
     18. TOAST NOTIFICATION SYSTEM
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'gold') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid fa-sparkles text-gold"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     19. NEWSLETTER FORM HANDLER
     -------------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    if (emailInput && emailInput.value) {
      if (window.TasteAPI) {
        window.TasteAPI.submitContact({ name: 'Newsletter Subscriber', email: emailInput.value, message: 'Newsletter Subscription' });
      }
      showToast('Thank you for subscribing to our luxury newsletter! 🥂', 'gold');
      emailInput.value = '';
    }
  });

  function initAnimations() {
    updateCartUI();
  }
});
