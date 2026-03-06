console.log("Contact form script loaded");

// Language Toggle
let currentLang = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        const key = element.getAttribute(`data-${lang}`);
        if (key) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = key;
            } else {
                element.textContent = key;
            }
        }
    });
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('34URs5dOzvuYY61ZW');
        console.log("EmailJS initialized");
    } else {
        console.error("EmailJS library not loaded");
    }
    
    // Initialize language
    setLanguage(currentLang);
    
    // Language toggle button
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            setLanguage(newLang);
        });
    }
    
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Contact Form Setup
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    
    console.log("Form found:", contactForm);
    console.log("Submit button found:", contactSubmitBtn);
    
    if (contactForm && contactSubmitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Submitting...");
            
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            if (!nameField || !emailField || !messageField) {
                console.error("Form fields not found");
                alert('Form error. Please refresh the page.');
                return;
            }
            
            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const message = messageField.value.trim();
            
            // Validation
            if (!name || !email || !message) {
                alert(currentLang === 'en' ? 'Please fill in all fields.' : 'يرجى ملء جميع الحقول.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert(currentLang === 'en' ? 'Please enter a valid email address.' : 'يرجى إدخال عنوان بريد إلكتروني صالح.');
                return;
            }
            
            // Disable button and show sending state
            const originalText = contactSubmitBtn.textContent;
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = currentLang === 'en' ? 'Sending...' : 'جاري الإرسال...';
            
            // Prepare template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message
            };
            
            console.log("Sending email with params:", templateParams);
            
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                console.error("EmailJS is not loaded");
                alert(currentLang === 'en' 
                    ? 'Email service is not available. Please contact me directly at mariam.gadelrab2003@gmail.com' 
                    : 'خدمة البريد الإلكتروني غير متاحة. يرجى الاتصال بي مباشرة على mariam.gadelrab2003@gmail.com');
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = originalText;
                return;
            }
            
            // Send email using EmailJS with sendForm method (more reliable)
            emailjs.sendForm('service_i9j763f', 'template_p35vhbv', contactForm)
                .then((response) => {
                    console.log("Email sent successfully", response);
                    // Success
                    alert(currentLang === 'en' 
                        ? 'Thank you for your message! I will get back to you soon.' 
                        : 'شكرا لرسالتك! سأعود إليك قريبا.');
                    
                    // Reset form
                    contactForm.reset();
                })
                .catch((error) => {
                    // Error with detailed logging
                    console.error('EmailJS Error Details:', {
                        status: error.status,
                        text: error.text,
                        error: error
                    });
                    
                    // More specific error messages
                    let errorMessage = currentLang === 'en' 
                        ? 'Sorry, something went wrong. Please contact me directly at mariam.gadelrab2003@gmail.com' 
                        : 'عذرًا، حدث خطأ ما. يرجى الاتصال بي مباشرة على mariam.gadelrab2003@gmail.com';
                    
                    if (error.status === 412) {
                        errorMessage = currentLang === 'en'
                            ? 'Email service configuration error. Please contact me at mariam.gadelrab2003@gmail.com'
                            : 'خطأ في تكوين خدمة البريد الإلكتروني. يرجى الاتصال بي على mariam.gadelrab2003@gmail.com';
                    }
                    
                    alert(errorMessage);
                })
                .finally(() => {
                    // Re-enable button
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.textContent = originalText;
                });
        });
    } else {
        console.error("Contact form or submit button not found in DOM");
    }
    
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add reveal class to elements
    const revealElements = document.querySelectorAll('.education-card, .skill-card, .project-card, .cert-card, .service-card, .overview-card');
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });
});

// Sticky Navigation
window.addEventListener('load', () => {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
});

// Smooth Scrolling
document.addEventListener('DOMContentLoaded', () => {
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
});

// Scroll Reveal Animation
window.addEventListener('load', () => {
    const revealElements = document.querySelectorAll('.education-card, .skill-card, .project-card, .cert-card, .service-card, .overview-card');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('reveal', 'active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
});

// Back to Top Button
window.addEventListener('load', () => {
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
