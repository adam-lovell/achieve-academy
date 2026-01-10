/* ========================================
   ACHIEVE ACADEMY - JAVASCRIPT
   Professional Mathematics Platform
   ======================================== */

// ========================================
// SCROLL ANIMATION SYSTEM
// ========================================

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Achieve Academy loaded successfully!");
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.scenario-title-animated, .scenario-subtitle-animated, .cost-highlight-animated'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // ========================================
    // NAVIGATION FUNCTIONALITY
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    // Toggle mobile navigation
    if (hamburger && navMenu && navOverlay) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            navOverlay.classList.toggle('active');
        });

        // Close nav when clicking overlay
        navOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && !navOverlay.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
            }
        });
    }

    // ========================================
    // SMOOTH SCROLLING FOR INTERNAL LINKS
    // ========================================
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                // Close mobile nav if open
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                navOverlay?.classList.remove('active');
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // PDF DOWNLOAD FUNCTIONALITY
    // ========================================
    const downloadButton = document.getElementById('download-free-pdf');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add visual feedback
            const originalHTML = this.innerHTML;
            this.innerHTML = '<span class="cta-main">Preparing Download...</span><span class="cta-sub">Please wait</span>';
            this.style.pointerEvents = 'none';
            
            // Simulate download preparation
            setTimeout(() => {
                // Here you would integrate with your actual PDF generation/download system
                // For now, we'll show a success message
                this.innerHTML = '<span class="cta-main">✓ Download Ready</span><span class="cta-sub">Check your downloads folder</span>';
                
                // Reset after 3 seconds
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.pointerEvents = 'auto';
                }, 3000);
            }, 1500);
        });
    }

    // ========================================
    // PURCHASE BUTTON FUNCTIONALITY
    // ========================================
    const purchaseButtons = document.querySelectorAll('[id^="purchase-"]');
    
    purchaseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info from data attributes
            const productId = this.dataset.product;
            
            // Add visual feedback
            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.disabled = true;
            
            // Here you would integrate with Stripe or your payment processor
            console.log('Initiating purchase for:', productId);
            
            // For demo purposes, show success after delay
            setTimeout(() => {
                this.textContent = '✓ Redirecting to Checkout';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            }, 1000);
        });
    });

    // ========================================
    // NAVBAR SCROLL BEHAVIOR
    // ========================================
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add background blur effect when scrolled
            if (scrollTop > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
});

// ========================================
// STRIPE CONFIGURATION (For Future Use)
// ========================================
// const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLIC_KEY'); // Replace with actual key

// Product Configuration
const products = {
    'statistics-pdf': {
        priceId: 'price_statistics_999', // Replace with actual Stripe price ID
        name: 'Foundational Statistics for Data Analysis PDF',
        price: 9.99
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance optimization
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add loading state to buttons
function addLoadingState(button, loadingText = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add('loading');
    
    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    };
}
function showEmailModal(buttonType = 'free') {
    if (emailModal) {
        emailModal.classList.add('active');
        emailInput.focus();
        
        // Store the button type for analytics
        emailModal.dataset.source = buttonType;
    }
}

function hideEmailModal() {
    if (emailModal) {
        emailModal.classList.remove('active');
        emailForm.reset();
    }
}

// Add event listeners to all email capture buttons
emailCaptureButtons.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const isPremium = buttonId.includes('Premium') || buttonId.includes('upgrade');
            showEmailModal(isPremium ? 'premium' : 'free');
        });
    }
});

// Close modal events
if (closeModal) {
    closeModal.addEventListener('click', hideEmailModal);
}

if (emailModal) {
    emailModal.addEventListener('click', (e) => {
        if (e.target === emailModal) {
            hideEmailModal();
        }
    });
}

// Handle email form submission
if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const source = emailModal.dataset.source || 'free';
        
        if (!email) {
            alert('Please enter a valid email address');
            return;
        }

        // Disable form while processing
        const submitButton = emailForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Here you would integrate with your email service
            // For now, we'll simulate the process
            await simulateEmailCapture(email, source);
            
            // Show success message
            alert(`Success! Check your email for your ${source === 'premium' ? 'premium guide' : 'free PDF'} download link.`);
            hideEmailModal();
            
            // Track the conversion
            console.log(`Email captured: ${email} for ${source} content`);
            
        } catch (error) {
            console.error('Email capture failed:', error);
            alert('Sorry, something went wrong. Please try again.');
        } finally {
            // Re-enable form
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Simulate email capture process
async function simulateEmailCapture(email, source) {
    // Simulate API call delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Would send ${source} PDF to: ${email}`);
            resolve();
        }, 1500);
    });
}

// Handle Stripe Payments
async function handlePurchase(productId) {
    const product = products[productId];
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    try {
        // Create checkout session
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: product.priceId,
                mode: 'payment',
                successUrl: window.location.origin + '/success.html?product=' + productId,
                cancelUrl: window.location.href
            })
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Payment system temporarily unavailable. Please try again later.');
    }
}

// Handle Free PDF Download
function handleFreeDownload() {
    // Track download event
    if (window.gtag) {
        gtag('event', 'download', {
            event_category: 'Free Resource',
            event_label: 'Statistical Foundations Preview PDF'
        });
    }
    
    // Trigger download (replace with actual PDF URL when available)
    const link = document.createElement('a');
    link.href = '/assets/free-statistical-foundations-preview.pdf'; // Replace with actual file
    link.download = 'Statistical-Foundations-Preview.pdf';
    link.click();
    
    // Redirect to high-converting thank you page
    setTimeout(() => {
        window.location.href = 'thank-you.html';
    }, 1000); // Small delay to ensure download starts
}

// Smooth scrolling for anchor links
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
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (navbar) {
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    lastScroll = currentScroll;
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Achieve Academy page initialized');
    
    // Purchase Button Handler
    const purchaseBtn = document.getElementById('purchase-statistics-pdf');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', function() {
            handlePurchase('statistics-pdf');
        });
    }
    
    // Free PDF Download - Updated for new lead magnet button
    const freeDownloadBtn = document.getElementById('download-free-pdf');
    if (freeDownloadBtn) {
        freeDownloadBtn.addEventListener('click', function() {
            handleFreeDownload();
        });
    }
    
    // Add any initialization code here
    // For example, checking if user came from a specific source
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    
    if (source) {
        console.log(`User came from: ${source}`);
        // You could show different content based on source
    }
});

// Export functions for testing or external use
window.AchieveAcademy = {
    showEmailModal,
    hideEmailModal,
    simulateEmailCapture,
    handlePurchase,
    handleFreeDownload
};