// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const theme = localStorage.getItem('theme') || 'light';

if (theme === 'dark') {
    document.documentElement.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Load Testimonials from Firebase
function loadTestimonials() {
    const testimonialsRef = database.ref('testimonials');
    testimonialsRef.orderByChild('timestamp').limitToLast(3).on('value', (snapshot) => {
        const testimonials = snapshot.val();
        const container = document.getElementById('testimonials-container');
        container.innerHTML = '';
        
        if (testimonials) {
            Object.values(testimonials).forEach(testimonial => {
                const stars = '⭐'.repeat(testimonial.rating);
                const testimonialHTML = `
                    <div class="bg-white dark:bg-dark-700 rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold mr-4">
                                ${testimonial.name.charAt(0)}
                            </div>
                            <div>
                                <h4 class="font-bold">${testimonial.name}</h4>
                                <div class="text-yellow-500">${stars}</div>
                            </div>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400">"${testimonial.review}"</p>
                    </div>
                `;
                container.innerHTML += testimonialHTML;
            });
        }
    });
}

// Load Partners from Firebase
function loadPartners() {
    const partnersRef = database.ref('partners');
    partnersRef.on('value', (snapshot) => {
        const partners = snapshot.val();
        const container = document.getElementById('partners-container');
        container.innerHTML = '';
        
        if (partners) {
            Object.values(partners).forEach(partner => {
                const partnerHTML = `
                    <div class="bg-white dark:bg-dark-700 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl">
                            ${partner.name.charAt(0)}
                        </div>
                        <h4 class="font-bold mb-2">${partner.name}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${partner.service}</p>
                        <a href="tel:${partner.phone}" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            <i class="fas fa-phone mr-1"></i> ${partner.phone}
                        </a>
                    </div>
                `;
                container.innerHTML += partnerHTML;
            });
        }
    });
}

// Visitor Counter
function loadVisitorCount() {
    const counterRef = database.ref('analytics/visitors');
    counterRef.transaction((current) => {
        return (current || 0) + 1;
    });
}

// UPI Payment QR
function showUPIQRCodes() {
    // Implement UPI QR code display
    const upiIDs = ['powerpro@upi', 'electrician@paytm'];
    // Generate and show QR codes
}

// Language Toggle (Hindi/English)
function toggleLanguage() {
    const elements = document.querySelectorAll('[data-hindi]');
    elements.forEach(el => {
        if (el.textContent === el.dataset.english) {
            el.textContent = el.dataset.hindi;
        } else {
            el.textContent = el.dataset.english;
        }
    });
}

// Contact Form Submission
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value,
        service: form.service.value,
        message: form.message.value,
        timestamp: Date.now(),
        status: 'new'
    };
    
    // Save to Firebase
    const contactsRef = database.ref('contacts');
    contactsRef.push(formData)
        .then(() => {
            alert('Thank you! We will contact you within 30 minutes.');
            form.reset();
            
            // Send WhatsApp notification
            const whatsappMsg = `New Contact: ${formData.name}\nPhone: ${formData.phone}\nService: ${formData.service}`;
            window.open(`https://wa.me/919876543210?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting form. Please call directly.');
        });
}

// Service Booking
function bookService(serviceName, price) {
    const phone = '+919876543210';
    const message = `I want to book ${serviceName} service (${price})`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Initialize Service Worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
                                         }
