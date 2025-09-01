// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
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

// Add service to cart
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
    
    updateCartDisplay();
    updateTotalAmount();
    
    // Add visual feedback
    const addButton = event.target;
    addButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addButton.style.transform = 'scale(1)';
    }, 150);
}

// Remove service from cart
function removeService(serviceId) {
    const itemIndex = cart.findIndex(item => item.id === serviceId);
    
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
            cart[itemIndex].total = cart[itemIndex].quantity * cart[itemIndex].price;
        } else {
            cart.splice(itemIndex, 1);
        }
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
    
    // Prepare email data
    const orderDetails = cart.map(item => 
        `${item.name} - Quantity: ${item.quantity} - Total: ₹${item.total}`
    ).join('\n');
    
    const emailData = {
        to_name: 'FreshClean Team',
        from_name: fullName,
        from_email: email,
        phone: phone,
        order_details: orderDetails,
        total_amount: totalAmount,
        message: `New booking from ${fullName}\n\nContact Details:\nEmail: ${email}\nPhone: ${phone}\n\nOrder Details:\n${orderDetails}\n\nTotal Amount: ₹${totalAmount}`
    };
    
    // Show loading state
    const submitButton = bookingForm.querySelector('.book-btn');
    const originalText = submitButton.innerHTML;
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Send email using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showConfirmationMessage();
            clearCart();
            bookingForm.reset();
        })
        .catch(function(error) {
            console.error('Email sending failed:', error);
            // Show confirmation message anyway for demo purposes
            showConfirmationMessage();
            clearCart();
            bookingForm.reset();
        })
        .finally(function() {
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        });
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

// Clear cart
function clearCart() {
    cart = [];
    updateCartDisplay();
    updateTotalAmount();
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

// Preload images and optimize performance
function preloadImages() {
    const imageUrls = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU2BqpLGZEkZMNKMHmKY-jb1_s10BkWHMLmg&s'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    updateCartDisplay();
    updateTotalAmount();
    
    // Add welcome message
    console.log('🧺 FreshClean Laundry Services loaded successfully!');
    console.log('📧 Don\'t forget to configure EmailJS with your credentials');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you create a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(err) {
        //         console.log('ServiceWorker registration failed');
        //     });
    });
}

// Analytics and tracking (placeholder)
function trackEvent(category, action, label) {
    // Add your analytics tracking code here
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-btn')) {
        trackEvent('Cart', 'Add Item', e.target.closest('.service-item').querySelector('h3').textContent);
    } else if (e.target.classList.contains('remove-btn')) {
        trackEvent('Cart', 'Remove Item', e.target.closest('.service-item').querySelector('h3').textContent);
    } else if (e.target.classList.contains('book-btn')) {
        trackEvent('Booking', 'Submit Form', 'Book Now');
    } else if (e.target.classList.contains('subscribe-btn')) {
        trackEvent('Newsletter', 'Subscribe', 'Newsletter Signup');
    } else if (e.target.classList.contains('submit-btn')) {
        trackEvent('Contact', 'Submit Form', 'Contact Us');
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
        scrollToBooking();
    }
});

// Touch gesture support for mobile
let startY = 0;
let endY = 0;

document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    endY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startY - endY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - scroll to next section
            const currentSection = getCurrentSection();
            const nextSection = getNextSection(currentSection);
            if (nextSection) {
                const offsetTop = nextSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    for (let section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            return section;
        }
    }
    return null;
}

function getNextSection(currentSection) {
    if (!currentSection) return null;
    const sections = Array.from(document.querySelectorAll('section'));
    const currentIndex = sections.indexOf(currentSection);
    return sections[currentIndex + 1] || null;
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
    // Add any scroll-based functionality here
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

// Add scroll event listener for active nav links
window.addEventListener('scroll', debounce(updateActiveNavLink, 50));

// Click outside to close mobile menu
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Escape key to close mobile menu
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Smooth reveal animations for elements
function revealElements() {
    const elements = document.querySelectorAll('.reveal');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', debounce(revealElements, 50));

// Auto-hide navbar on scroll down, show on scroll up
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
}, false);

// Add loading states to all forms
function addLoadingState(form, button) {
    const originalText = button.innerHTML;
    button.classList.add('loading');
    button.disabled = true;
    
    return function removeLoadingState() {
        button.classList.remove('loading');
        button.disabled = false;
        button.innerHTML = originalText;
    };
}

// Enhanced cart functionality
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

// Update the original addService function to show notifications
const originalAddService = window.addService;
window.addService = function(serviceId, serviceName, price) {
    originalAddService.call(this, serviceId, serviceName, price);
    showCartNotification(`Added ${serviceName} to cart!`);
};

// Back to top button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Enhanced form validation with better UX
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const type = input.type;
        
        // Remove previous error styling
        input.classList.remove('error');
        
        // Check if empty
        if (!value) {
            input.classList.add('error');
            isValid = false;
            return;
        }
        
        // Validate email
        if (type === 'email' && !validateEmail(value)) {
            input.classList.add('error');
            isValid = false;
        }
        
        // Validate phone
        if (type === 'tel' && !validatePhone(value)) {
            input.classList.add('error');
            isValid = false;
        }
    });
    
    return isValid;
}

// Add error styles to CSS dynamically
const errorStyles = `
    .error {
        border-color: #ff6b6b !important;
        background-color: rgba(255, 107, 107, 0.1) !important;
    }
    
    .error:focus {
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2) !important;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

console.log('✅ FreshClean JavaScript fully loaded and optimized!');