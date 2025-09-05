// Initialize EmailJS
(function() {
    // Replace with your EmailJS public key when you set it up
    // emailjs.init("YOUR_PUBLIC_KEY"); 
})();

// Shopping cart functionality
let cart = [];
let totalAmount = 0;

// DOM elements
const cartItemsContainer = document.getElementById('cartItems');
const totalAmountElement = document.getElementById('totalAmount');
const bookingForm = document.getElementById('bookingForm');
const confirmationMessage = document.getElementById('confirmationMessage');
const newsletterForm = document.getElementById('newsletterForm');

// Scroll to booking section
function scrollToBooking() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
}

// Add service to cart - Fixed to only show/hide buttons correctly
function addService(serviceId, serviceName, price) {
    const existingItem = cart.find(item => item.id === serviceId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            id: serviceId,
            name: serviceName,
            price: price,
            quantity: 1,
            total: price
        });
    }
    
    // Hide Add button and show Remove button
    const serviceItem = document.querySelector(`[data-service="${serviceId}"]`);
    const addBtn = serviceItem.querySelector('.add-btn');
    const removeBtn = serviceItem.querySelector('.remove-btn');
    
    addBtn.style.display = 'none';
    removeBtn.style.display = 'inline-block';
    
    updateCartDisplay();
    updateTotalAmount();
    
    // Add visual feedback
    const addButton = event.target;
    addButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addButton.style.transform = 'scale(1)';
    }, 150);
    
    // Show notification
    showCartNotification(`Added ${serviceName} to cart!`);
}

// Remove service from cart - Fixed to handle complete removal
function removeService(serviceId) {
    const itemIndex = cart.findIndex(item => item.id === serviceId);
    
    if (itemIndex !== -1) {
        // Always remove the entire item (not just decrease quantity)
        cart.splice(itemIndex, 1);
        
        // Hide Remove button and show Add button
        const serviceItem = document.querySelector(`[data-service="${serviceId}"]`);
        const addBtn = serviceItem.querySelector('.add-btn');
        const removeBtn = serviceItem.querySelector('.remove-btn');
        
        removeBtn.style.display = 'none';
        addBtn.style.display = 'inline-block';
    }
    
    updateCartDisplay();
    updateTotalAmount();
    
    // Add visual feedback
    const removeButton = event.target;
    removeButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        removeButton.style.transform = 'scale(1)';
    }, 150);
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">No items added yet</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
            </div>
            <div>
                <strong>₹${item.total}</strong>
            </div>
        </div>
    `).join('');
}

// Update total amount
function updateTotalAmount() {
    totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    totalAmountElement.textContent = totalAmount;
}

// Handle booking form submission
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (cart.length === 0) {
        alert('Please add at least one service to your cart before booking.');
        return;
    }
    
    // Show loading state
    const submitButton = bookingForm.querySelector('.book-btn');
    const originalText = submitButton.innerHTML;
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate booking process (replace with actual EmailJS code when configured)
    setTimeout(() => {
        showConfirmationMessage();
        clearCart();
        bookingForm.reset();
        
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }, 2000);
});

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('contactPhone').value;
        const message = document.getElementById('contactMessage').value;
        
        // Show loading state
        const submitButton = contactForm.querySelector('.submit-btn');
        const originalText = submitButton.innerHTML;
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate API call for demo
        setTimeout(() => {
            alert(`Thank you ${name}! Your message has been sent successfully. We will get back to you soon.`);
            contactForm.reset();
            
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }, 1500);
    });
}

// Show confirmation message
function showConfirmationMessage() {
    confirmationMessage.style.display = 'block';
    confirmationMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 5000);
}

// Clear cart and reset all buttons to default state
function clearCart() {
    cart = [];
    updateCartDisplay();
    updateTotalAmount();
    
    // Reset all service buttons to show Add button only
    const allServiceItems = document.querySelectorAll('.service-item');
    allServiceItems.forEach(item => {
        const addBtn = item.querySelector('.add-btn');
        const removeBtn = item.querySelector('.remove-btn');
        
        addBtn.style.display = 'inline-block';
        removeBtn.style.display = 'none';
    });
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Handle newsletter subscription
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('newsletterName').value;
    const email = document.getElementById('newsletterEmail').value;
    
    // Show loading state
    const submitButton = newsletterForm.querySelector('.subscribe-btn');
    const originalText = submitButton.innerHTML;
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert(`Thank you ${name}! You have been successfully subscribed to our newsletter.`);
        newsletterForm.reset();
        
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }, 1500);
});

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(75, 185, 154, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #4bb99a 0%, #38a391 50%, #398b8e 100%)';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.achievement-card, .service-item, .quality-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
}

// Real-time form validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('input', function() {
        const email = this.value;
        if (email && !validateEmail(email)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#4bb99a';
        }
    });
}

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        const phone = this.value;
        if (phone && !validatePhone(phone)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#4bb99a';
        }
    });
}

// Newsletter email validation
const newsletterEmailInput = document.getElementById('newsletterEmail');
if (newsletterEmailInput) {
    newsletterEmailInput.addEventListener('input', function() {
        const email = this.value;
        if (email && !validateEmail(email)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#4bb99a';
        }
    });
}

// Contact form validation
const contactEmailInput = document.getElementById('contactEmail');
if (contactEmailInput) {
    contactEmailInput.addEventListener('input', function() {
        const email = this.value;
        if (email && !validateEmail(email)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#4bb99a';
        }
    });
}

const contactPhoneInput = document.getElementById('contactPhone');
if (contactPhoneInput) {
    contactPhoneInput.addEventListener('input', function() {
        const phone = this.value;
        if (phone && !validatePhone(phone)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#4bb99a';
        }
    });
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Click outside to close mobile menu
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-container') && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Escape key to close mobile menu
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Back to top button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);
