// Product Data
const products = [
    {
        id: 1,
        name: "SMOKOLAB 1.83 inch HD Smartwatch",
        specs: "BT Calling & Check Weather • 1 Count Battery",
        fullDescription: "Experience the ultimate smartwatch with a vibrant 1.83-inch HD display. Features Bluetooth calling, weather updates, heart rate monitoring, and sleep tracking. Compatible with iOS and Android.",
        price: 11.47,
        interest: "2.80% interest-free",
        emoji: "⌚",
        category: "full-hd"
    },
    {
        id: 2,
        name: "Four Flat Polycarbonate Rotatable Enclosure",
        specs: "Four Dual-Sided Screen • Cable-Free",
        fullDescription: "Premium polycarbonate rotatable enclosure with four dual-sided screens. Perfect for retail displays, exhibitions, and trade shows. Cable-free design for clean setup.",
        price: 11.39,
        interest: "0.38% interest-free",
        emoji: "📱",
        category: "hd-ready"
    },
    {
        id: 3,
        name: "Smartphone Stand For Flat Polycarbonate",
        specs: "Rotatable Enclosure • Dual-Sided Screen",
        fullDescription: "Sturdy smartphone stand designed for flat polycarbonate surfaces. Features 360-degree rotation and dual-sided screen compatibility. Ideal for hands-free video calls and content viewing.",
        price: 89.99,
        interest: "2.04% interest-free",
        emoji: "📲",
        category: "4k-uhd"
    },
    {
        id: 4,
        name: "Wireless Bluetooth Earbuds Pro",
        specs: "Noise Cancelling • 40hr Battery Life",
        fullDescription: "Premium wireless earbuds with active noise cancellation. Enjoy 40 hours of battery life with the charging case. IPX5 water resistance and touch controls included.",
        price: 24.99,
        interest: "0% interest-free",
        emoji: "🎧",
        category: "full-hd"
    },
    {
        id: 5,
        name: "4K Action Camera Waterproof",
        specs: "4K 60fps • WiFi • 170° Wide Angle",
        fullDescription: "Capture stunning 4K video at 60fps with this waterproof action camera. Features built-in WiFi, 170° wide-angle lens, and includes mounting accessories.",
        price: 59.99,
        interest: "1.5% interest-free",
        emoji: "📷",
        category: "4k-uhd"
    },
    {
        id: 6,
        name: "Portable Power Bank 20000mAh",
        specs: "Fast Charging • Dual USB • LED Display",
        fullDescription: "High-capacity 20000mAh power bank with fast charging technology. Features dual USB ports and digital LED display showing remaining power.",
        price: 19.99,
        interest: "0% interest-free",
        emoji: "🔋",
        category: "hd-ready"
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('zippcart')) || [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartIcon = document.getElementById('cartIcon');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const currentTimeEl = document.getElementById('currentTime');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

// Currency Formatter (Ghana Cedis)
const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
});

// Update Time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (currentTimeEl) {
        currentTimeEl.textContent = `${hours}:${minutes}`;
    }
}
updateTime();
setInterval(updateTime, 1000);

// Filter Products
function getFilteredProducts() {
    return products.filter(product => {
        const matchesFilter = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.specs.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });
}

// Render Products
function renderProducts() {
    const filteredProducts = getFilteredProducts();
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-results">No products found matching your search.</div>';
        return;
    }
    
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-specs">${product.specs}</p>
                <div class="price-section">
                    <span class="price">${formatter.format(product.price)}</span>
                    <span class="interest-badge">${product.interest}</span>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Open Product Modal
window.openProductModal = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    modalContent.innerHTML = `
        <div class="modal-image">${product.emoji}</div>
        <div class="modal-details">
            <h2>${product.name}</h2>
            <p class="modal-specs">${product.fullDescription}</p>
            <div class="modal-price">${formatter.format(product.price)}</div>
            <div class="modal-interest">
                <span class="interest-badge">${product.interest}</span>
            </div>
            <div class="quantity-selector">
                <button class="quantity-btn" onclick="window.modalQuantity = Math.max(1, (window.modalQuantity || 1) - 1); document.getElementById('modalQty').value = window.modalQuantity;">-</button>
                <input type="number" id="modalQty" class="quantity-input" value="1" min="1" onchange="window.modalQuantity = parseInt(this.value)">
                <button class="quantity-btn" onclick="window.modalQuantity = (window.modalQuantity || 1) + 1; document.getElementById('modalQty').value = window.modalQuantity;">+</button>
            </div>
            <button class="modal-add-btn" onclick="addToCart(${product.id}, window.modalQuantity || 1); closeModal()">
                Add to Cart - ${formatter.format(product.price)}
            </button>
        </div>
    `;
    
    window.modalQuantity = 1;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Close Modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Add to Cart
window.addToCart = function(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Animation feedback
    const button = event?.target;
    if (button) {
        button.textContent = 'Added! ✓';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
        }, 1000);
    }
};

// Remove from Cart
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

// Update Quantity
window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
};

// Save Cart
function saveCart() {
    localStorage.setItem('zippcart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        if (cartTotal) cartTotal.textContent = formatter.format(0);
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">${formatter.format(item.price)}</span>
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">+</button>
                </div>
            </div>
            <span class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = formatter.format(total);
}

// Open/Close Cart
function openCart() {
    if (cartOverlay) cartOverlay.classList.add('active');
    if (cartSidebar) cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartFunc() {
    if (cartOverlay) cartOverlay.classList.remove('active');
    if (cartSidebar) cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners
if (cartIcon) cartIcon.addEventListener('click', openCart);
if (closeCart) closeCart.addEventListener('click', closeCartFunc);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartFunc);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html';
    });
}

// Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });
}

// Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.textContent.toLowerCase();
        if (filter.includes('all')) currentFilter = 'all';
        else if (filter.includes('full hd')) currentFilter = 'full-hd';
        else if (filter.includes('hd ready')) currentFilter = 'hd-ready';
        else if (filter.includes('4k')) currentFilter = '4k-uhd';
        
        renderProducts();
    });
});

// Initialize
renderProducts();
updateCartUI();