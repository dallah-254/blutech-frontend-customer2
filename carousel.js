// unified-script.js

// Universal Carousel Class
class UniversalCarousel {
    constructor(container, options = {}) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.dots = container.querySelectorAll('.carousel-dot');
        this.prevBtn = container.querySelector('.carousel-nav.prev');
        this.nextBtn = container.querySelector('.carousel-nav.next');
        
        // Options with defaults
        this.options = {
            autoplay: options.autoplay || true,
            interval: options.interval || 5000,
            loop: options.loop !== undefined ? options.loop : true,
            ...options
        };
        
        this.currentIndex = 0;
        this.timer = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Set up event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Dot navigation
        if (this.dots.length) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goTo(index));
            });
        }
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Swipe support for touch devices
        this.setupSwipe();
        
        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Pause autoplay when hovering over carousel
        this.container.addEventListener('mouseenter', () => {
            if (this.options.autoplay) {
                this.stopAutoplay();
            }
        });
        
        this.container.addEventListener('mouseleave', () => {
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        });
        
        // Make carousel focusable for keyboard navigation
        this.container.setAttribute('tabindex', '0');
        
        // Initialize first slide
        this.update();
    }
    
    setupSwipe() {
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', () => {
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }
    
    startAutoplay() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.next();
        }, this.options.interval);
    }
    
    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    next() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        if (this.currentIndex >= this.slides.length - 1 && this.options.loop) {
            this.currentIndex = 0;
        } else if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
        }
        
        this.update();
        
        // Reset transitioning flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    prev() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        if (this.currentIndex <= 0 && this.options.loop) {
            this.currentIndex = this.slides.length - 1;
        } else if (this.currentIndex > 0) {
            this.currentIndex--;
        }
        
        this.update();
        
        // Reset transitioning flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    goTo(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        this.update();
        
        // Reset transitioning flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    update() {
        // Update track position
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update dots
        if (this.dots.length) {
            this.dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('carouselChange', {
            detail: { currentIndex: this.currentIndex }
        }));
    }
    
    destroy() {
        this.stopAutoplay();
        
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', () => this.next());
        }
        
        if (this.dots.length) {
            this.dots.forEach((dot, index) => {
                dot.removeEventListener('click', () => this.goTo(index));
            });
        }
    }
}

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');
const buyButtons = document.querySelectorAll('.buy-now');
const bookButtons = document.querySelectorAll('.book-now');
const productModal = document.getElementById('productModal');
const serviceModal = document.getElementById('serviceModal');
const simpleServiceModal = document.getElementById('simple-service-modal');
const closeModals = document.querySelectorAll('.close-modal, .close-simple-service-modal, .close-product-modal');
const showMoreBtn = document.querySelector('.show-more-btn');
const reviewCards = document.querySelectorAll('.review-card');
const modalBuyBtn = document.getElementById('modalBuyBtn');
const modalBookBtn = document.getElementById('modalBookBtn');
const cartCount = document.querySelector('.cart-count');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const cartButton = document.getElementById('cartButton');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const categoryTabs = document.querySelectorAll('.category-tab');
const categoryContents = document.querySelectorAll('.category-content');
const serviceListItems = document.querySelectorAll('.service-list-item');

// Cart items array
let cart = [];

// Service data
const serviceData = {
    'screen-replacement': {
        title: 'Screen Replacement',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        price: 'KSh 2,999 - 14,999',
        description: 'We replace cracked or damaged screens with high-quality OEM or aftermarket parts. Our technicians are trained to handle all major brands including Apple, Samsung, Google, and more. We offer a lifetime warranty on all our screen replacements.',
        features: [
            'High-quality screen replacement',
            'Professional installation',
            'Device testing and calibration',
            'Lifetime warranty on parts and labor',
            'Free diagnostic check'
        ]
    },
    // ... (all other service data objects from services.html)
};

// Initialize all carousels on page load
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach((carousel) => {
        // Get data attributes for options
        const autoplay = carousel.dataset.autoplay !== 'false';
        const interval = carousel.dataset.interval ? parseInt(carousel.dataset.interval) : 5000;
        const loop = carousel.dataset.loop !== 'false';
        
        new UniversalCarousel(carousel, {
            autoplay,
            interval,
            loop
        });
    });
}

// Mobile Menu Toggle
function setupMobileMenu() {
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            if (navLinks) navLinks.classList.toggle('active');
        });
    }
}

// Header Scroll Effect
function setupHeaderScroll() {
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Show/Hide Reviews
function setupReviews() {
    let showingAllReviews = false;
    if (showMoreBtn && reviewCards.length > 0) {
        // Initially hide extra reviews
        for (let i = 2; i < reviewCards.length; i++) {
            reviewCards[i].style.display = 'none';
        }
        
        showMoreBtn.addEventListener('click', () => {
            if (showingAllReviews) {
                // Hide extra reviews
                for (let i = 2; i < reviewCards.length; i++) {
                    reviewCards[i].style.display = 'none';
                }
                showMoreBtn.textContent = 'Show More Reviews';
                showingAllReviews = false;
            } else {
                // Show all reviews
                for (let i = 2; i < reviewCards.length; i++) {
                    reviewCards[i].style.display = 'block';
                }
                showMoreBtn.textContent = 'Show Less Reviews';
                showingAllReviews = true;
            }
        });
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Product Modal functionality
function setupProductModals() {
    if (buyButtons.length > 0) {
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = button.getAttribute('data-price');
                const image = button.getAttribute('data-image');
                
                // Set modal content based on product
                document.getElementById('modalProductTitle').textContent = name;
                document.getElementById('modalProductPrice').textContent = `KSh ${parseInt(price).toLocaleString()}`;
                
                // Only show discount if it's more than 0%
                const discountEl = document.getElementById('modalProductDiscount');
                const discountBadge = button.closest('.product-card')?.querySelector('.discount-badge');
                if (discountBadge && discountEl) {
                    discountEl.textContent = discountBadge.textContent;
                    discountEl.style.display = 'block';
                } else if (discountEl) {
                    discountEl.style.display = 'none';
                }
                
                const descriptionEl = button.closest('.product-info')?.querySelector('.product-description');
                if (descriptionEl) {
                    document.getElementById('modalProductDescription').textContent = descriptionEl.textContent;
                }
                
                document.getElementById('modalProductImage').src = image;
                document.getElementById('modalBuyBtn').setAttribute('data-id', id);
                
                if (productModal) {
                    productModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
}

// Service Modal functionality
function setupServiceModals() {
    if (bookButtons.length > 0) {
        bookButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = button.getAttribute('data-price');
                const image = button.getAttribute('data-image');
                
                // Set modal content based on service
                document.getElementById('modalServiceTitle').textContent = name;
                document.getElementById('modalServicePrice').textContent = `KSh ${parseInt(price).toLocaleString()}`;
                
                const descriptionEl = button.closest('.service-info')?.querySelector('.service-description');
                if (descriptionEl) {
                    document.getElementById('modalServiceDescription').textContent = descriptionEl.textContent;
                }
                
                document.getElementById('modalServiceImage').src = image;
                document.getElementById('modalBookBtn').setAttribute('data-id', id);
                
                if (serviceModal) {
                    serviceModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
}

// Simple Service Modal functionality
function setupSimpleServiceModals() {
    if (serviceListItems.length > 0) {
        serviceListItems.forEach(item => {
            item.addEventListener('click', () => {
                const serviceId = item.getAttribute('data-service');
                const service = serviceData[serviceId] || serviceData['screen-replacement'];
                
                // Update modal content
                document.getElementById('simple-modal-service-title').textContent = service.title;
                document.getElementById('simple-modal-service-price').textContent = service.price;
                document.getElementById('simple-modal-service-description').textContent = service.description;
                
                // Update features list
                const featuresList = document.getElementById('simple-modal-service-features');
                if (featuresList) {
                    featuresList.innerHTML = '';
                    service.features.forEach(feature => {
                        featuresList.innerHTML += `<li><i class="fas fa-check-circle"></i> ${feature}</li>`;
                    });
                }
                
                // Show modal
                if (simpleServiceModal) {
                    simpleServiceModal.classList.add('active');
                }
            });
        });
    }
}

// Close modals
function setupModalClosures() {
    if (closeModals.length > 0) {
        closeModals.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal-content, .simple-service-modal-container, .product-modal-content')?.parentElement;
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal, .simple-service-modal, .product-modal');
    if (modals.length > 0) {
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
}

// Variation selection
function setupVariationSelection() {
    const variationOptions = document.querySelectorAll('.variation-option');
    if (variationOptions.length > 0) {
        variationOptions.forEach(option => {
            option.addEventListener('click', () => {
                const parentOptions = option.closest('.variation-options');
                parentOptions.querySelectorAll('.variation-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
}

// Add to cart functionality
function setupCartFunctionality() {
    if (modalBuyBtn) {
        modalBuyBtn.addEventListener('click', () => {
            const productId = modalBuyBtn.getAttribute('data-id');
            
            try {
                // Check if cart page exists
                fetch('cart.html')
                    .then(response => {
                        if (response.ok) {
                            // Cart page exists, redirect
                            window.location.href = 'cart.html';
                        } else {
                            // Cart page doesn't exist, show error
                            showToast('Shopping cart is currently unavailable. Please try again later.', 'error');
                        }
                    })
                    .catch(error => {
                        showToast('Shopping cart is currently unavailable. Please try again later.', 'error');
                    });
                
                // Close modal
                if (productModal) {
                    productModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            } catch (error) {
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }
}

// Book service functionality
function setupBookingFunctionality() {
    if (modalBookBtn) {
        modalBookBtn.addEventListener('click', () => {
            const serviceId = modalBookBtn.getAttribute('data-id');
            
            try {
                // Check if bookings page exists
                fetch('bookings.html')
                    .then(response => {
                        if (response.ok) {
                            // Bookings page exists, redirect
                            window.location.href = 'bookings.html';
                        } else {
                            // Bookings page doesn't exist, show error
                            showToast('Booking system is currently unavailable. Please try again later.', 'error');
                        }
                    })
                    .catch(error => {
                        showToast('Booking system is currently unavailable. Please try again later.', 'error');
                    });
                
                // Close modal
                if (serviceModal) {
                    serviceModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            } catch (error) {
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }
}

// Review form submission
function setupReviewForm() {
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for your review! It will be published after moderation.', 'success');
            reviewForm.reset();
        });
    }
}

// Category Navigation (Products and Services pages)
function setupCategoryNavigation() {
    if (categoryTabs.length > 0 && categoryContents.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                categoryTabs.forEach(t => t.classList.remove('active'));
                categoryContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const categoryId = tab.getAttribute('data-category');
                document.getElementById(categoryId)?.classList.add('active');
            });
        });
    }
}

// Cart functionality (Products page)
function setupCart() {
    // Toggle cart sidebar
    if (cartButton && cartSidebar) {
        cartButton.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }

    // Close cart sidebar
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }

    // Update cart UI
    function updateCartUI() {
        if (!cartItems || !cartTotal || !cartCount) return;
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotal.textContent = 'KSh 0.00';
        } else {
            cartItems.innerHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const price = parseInt(item.price.replace(/[^\d]/g, ''));
                const itemTotal = price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = `KSh ${total.toLocaleString()}`;
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.increase').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    item.quantity += 1;
                    updateCartUI();
                });
            });
            
            document.querySelectorAll('.decrease').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(item => item.id !== id);
                    }
                    updateCartUI();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    updateCartUI();
                    showToast('Product removed from cart', 'success');
                });
            });
        }
    }

    // Initialize cart
    updateCartUI();
}

// Page-specific initialization
function initPageSpecificFeatures() {
    // Products page features
    if (document.querySelector('.products-page')) {
        setupCategoryNavigation();
        setupCart();
    }
    
    // Services page features
    if (document.querySelector('.services-page')) {
        setupCategoryNavigation();
        setupSimpleServiceModals();
    }
    
    // Homepage features
    if (document.querySelector('.homepage')) {
        setupReviews();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    setupMobileMenu();
    setupHeaderScroll();
    initCarousels();
    setupProductModals();
    setupServiceModals();
    setupModalClosures();
    setupVariationSelection();
    setupCartFunctionality();
    setupBookingFunctionality();
    setupReviewForm();
    
    // Page-specific functionality
    initPageSpecificFeatures();
});

// Make functions available globally for any inline event handlers
window.showToast = showToast;