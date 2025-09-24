// Initialize EmailJS
(function() {
    // Replace 'YOUR_USER_ID' with your actual EmailJS user ID
    emailjs.init('PS6MRaSHCQZ-2np1w'); // You need to get this from emailjs.com
})();

// Cart functionality
let cart = [];
let totalAmount = 0;

// Service data
const services = {
    'wash-fold': { name: 'Wash & Fold', price: 15 },
    'dry-clean': { name: 'Dry Cleaning', price: 25 },
    'ironing': { name: 'Ironing Service', price: 10 },
    'express': { name: 'Express Service', price: 30 },
    'bedding': { name: 'Bedding & Linens', price: 20 },
    'shoes': { name: 'Shoe Cleaning', price: 18 }
};

// DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountElement = document.getElementById('total-amount');
const bookingForm = document.getElementById('booking-form');
const bookingMessage = document.getElementById('booking-message');

// Mobile navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Smooth scroll to booking section
function scrollToBooking() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
}

// Toggle service in cart (Add/Remove functionality)
function toggleService(serviceId) {
    const service = services[serviceId];
    const existingIndex = cart.findIndex(item => item.id === serviceId);
    const button = document.querySelector(`[data-service="${serviceId}"] .toggle-btn`);
    
    if (existingIndex > -1) {
        // Remove from cart
        cart.splice(existingIndex, 1);
        button.textContent = 'Add Item';
        button.classList.remove('added');
    } else {
        // Add to cart
        cart.push({
            id: serviceId,
            name: service.name,
            price: service.price,
            quantity: 1
        });
        button.textContent = 'Remove';
        button.classList.add('added');
    }
    
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">No items added yet</p>';
        totalAmount = 0;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `).join('');
        
        totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    }
    
    totalAmountElement.textContent = totalAmount.toFixed(2);
}

// Handle booking form submission
bookingForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (cart.length === 0) {
        showMessage('Please add at least one service to your cart before booking.', 'error');
        return;
    }
    
    const bookBtn = document.querySelector('.book-btn');
    bookBtn.disabled = true;
    bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    
    // Prepare email data
    const cartDetails = cart.map(item => `${item.name}: $${item.price.toFixed(2)}`).join('\n');
    
    const emailData = {
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        services: cartDetails,
        total_amount: totalAmount.toFixed(2),
        booking_date: new Date().toLocaleDateString(),
        booking_time: new Date().toLocaleTimeString()
    };
    
    try {
        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs from EmailJS
        const response = await emailjs.send('service_7mylv1q', 'template_uqn7izr', emailData);
        
        if (response.status === 200) {
            showMessage('Thank you for booking the service! We will get back to you soon!', 'success');
            
            // Reset form and cart
            bookingForm.reset();
            cart = [];
            updateCartDisplay();
            
            // Reset all toggle buttons
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.textContent = 'Add Item';
                btn.classList.remove('added');
            });
        } else {
            throw new Error('Email sending failed');
        }
    } catch (error) {
        console.error('Email sending failed:', error);
        showMessage('Booking submitted successfully, but email confirmation failed. We will contact you shortly.', 'error');
    }
    
    bookBtn.disabled = false;
    bookBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Book Now';
});

// Show message function
function showMessage(message, type) {
    bookingMessage.textContent = message;
    bookingMessage.className = `booking-message ${type}`;
    bookingMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        bookingMessage.style.display = 'none';
    }, 5000);
}

// Handle contact form submission
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

contactForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const contactBtn = document.querySelector('.contact-btn');
    
    contactBtn.disabled = true;
    contactBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Prepare contact email data
    const contactEmailData = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        to_email: 'alokguptatute23@gmail.com' // Your business email
    };
    
    try {
        // Send contact email using EmailJS
        const response = await emailjs.send('service_7mylv1q', 'template_uqn7izr', contactEmailData);
        
        if (response.status === 200) {
            contactMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            contactMessage.className = 'contact-message success';
            contactMessage.style.display = 'block';
            contactForm.reset();
        } else {
            throw new Error('Email sending failed');
        }
    } catch (error) {
        console.error('Contact email sending failed:', error);
        contactMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
        contactMessage.className = 'contact-message error';
        contactMessage.style.display = 'block';
    }
    
    contactBtn.disabled = false;
    contactBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        contactMessage.style.display = 'none';
    }, 5000);
});

// Handle newsletter subscription
const newsletterForm = document.getElementById('newsletter-form');

newsletterForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(newsletterForm);
    const subscribeBtn = newsletterForm.querySelector('button');
    const originalText = subscribeBtn.innerHTML;
    
    subscribeBtn.disabled = true;
    subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    
    // Prepare newsletter email data
    const newsletterEmailData = {
        subscriber_name: formData.get('name'),
        subscriber_email: formData.get('email'),
        to_email: 'info@freshclean.com' // Your business email
    };
    
    try {
        // Send newsletter subscription email using EmailJS
        const response = await emailjs.send('service_7mylv1q', 'template_uqn7izr', newsletterEmailData);
        
        if (response.status === 200) {
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        } else {
            throw new Error('Newsletter subscription failed');
        }
    } catch (error) {
        console.error('Newsletter subscription failed:', error);
        alert('Sorry, there was an error with your subscription. Please try again.');
    }
    
    subscribeBtn.disabled = false;
    subscribeBtn.innerHTML = originalText;
});

// Initialize toggle buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up service toggle buttons
    document.querySelectorAll('.service-card').forEach(card => {
        const serviceId = card.getAttribute('data-service');
        const buttonsContainer = card.querySelector('.service-buttons');
        
        // Replace the existing buttons with a single toggle button
        buttonsContainer.innerHTML = `
            <button class="toggle-btn" onclick="toggleService('${serviceId}')">Add Item</button>
        `;
    });
    
    // Initialize cart display
    updateCartDisplay();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Add animation on scroll for quality items
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
    
    // Observe quality items and other elements for animation
    document.querySelectorAll('.quality-item, .service-card, .stat-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// Utility function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function to validate phone number
function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Add form validation
function validateBookingForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (fullName.length < 2) {
        showMessage('Please enter a valid full name.', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!validatePhone(phone)) {
        showMessage('Please enter a valid phone number.', 'error');
        return false;
    }
    
    return true;
}

// Update the booking form submission to include validation
const originalBookingHandler = bookingForm?.addEventListener;
if (bookingForm) {
    bookingForm.removeEventListener('submit', originalBookingHandler);
    
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateBookingForm()) {
            return;
        }
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        if (cart.length === 0) {
            showMessage('Please add at least one service to your cart before booking.', 'error');
            return;
        }
        
        const bookBtn = document.querySelector('.book-btn');
        bookBtn.disabled = true;
        bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        
        // Prepare email data
        const cartDetails = cart.map(item => `${item.name}: ${item.price.toFixed(2)}`).join('\n');
        
        const emailData = {
            to_email: email,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            services: cartDetails,
            total_amount: totalAmount.toFixed(2),
            booking_date: new Date().toLocaleDateString(),
            booking_time: new Date().toLocaleTimeString()
        };
        
        try {
            // For demonstration purposes, we'll simulate email sending
            // Replace this with actual EmailJS implementation
            await simulateEmailSending(emailData);
            
            showMessage('Thank you for booking the service! We will get back to you soon!', 'success');
            
            // Reset form and cart
            bookingForm.reset();
            cart = [];
            updateCartDisplay();
            
            // Reset all toggle buttons
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.textContent = 'Add Item';
                btn.classList.remove('added');
            });
            
        } catch (error) {
            console.error('Booking failed:', error);
            showMessage('Booking submitted successfully, but email confirmation failed. We will contact you shortly.', 'error');
        }
        
        bookBtn.disabled = false;
        bookBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Book Now';
    });
}

// Simulate email sending for demonstration
function simulateEmailSending(emailData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Email would be sent with data:', emailData);
            resolve({ status: 200 });
        }, 2000);
    });
}
