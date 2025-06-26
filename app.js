// Market Analysis Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initMobileMenu();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('.section[id]');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                updateActiveNavLink(this);
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Scroll-based navigation highlighting
function initScrollEffects() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('.section[id]');
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Find corresponding nav link
                const activeNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeNavLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    activeNavLink.classList.add('active');
                }
            }
        });
    }
    
    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveSection, 10);
    });
    
    // Initial check
    updateActiveSection();
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav__list');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navList.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Change toggle icon
            navToggle.innerHTML = isExpanded ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }
}

// Close mobile menu
function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav__list');
    
    if (navList && navList.classList.contains('active')) {
        navList.classList.remove('active');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.innerHTML = '☰';
        }
    }
}

// Enhanced smooth scrolling for browsers that don't support CSS scroll-behavior
function initSmoothScrolling() {
    // Check if browser supports smooth scrolling
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Polyfill for smooth scrolling
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    smoothScrollTo(targetElement.offsetTop - 80); // Account for header
                }
            });
        });
    }
}

// Smooth scroll polyfill
function smoothScrollTo(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const animatedElements = document.querySelectorAll('.summary-card, .phase-card, .demo-card, .scenario-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Add fade-in styles dynamically
function addFadeInStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .summary-card,
        .phase-card,
        .demo-card,
        .scenario-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations if IntersectionObserver is supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', function() {
        addFadeInStyles();
        initScrollAnimations();
    });
}

// Performance optimization: Debounce resize events
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

// Handle window resize
const handleResize = debounce(function() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}, 250);

window.addEventListener('resize', handleResize);

// Print functionality
function initPrintFeatures() {
    // Add print button if needed
    const printButton = document.createElement('button');
    printButton.innerHTML = '🖨️ Print Report';
    printButton.className = 'btn btn--outline';
    printButton.style.position = 'fixed';
    printButton.style.bottom = '20px';
    printButton.style.right = '20px';
    printButton.style.zIndex = '999';
    printButton.style.display = 'none';
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Show print button on larger screens
    function togglePrintButton() {
        if (window.innerWidth > 768) {
            printButton.style.display = 'block';
        } else {
            printButton.style.display = 'none';
        }
    }
    
    togglePrintButton();
    window.addEventListener('resize', debounce(togglePrintButton, 250));
    
    document.body.appendChild(printButton);
}

// Initialize print features
document.addEventListener('DOMContentLoaded', initPrintFeatures);

// Accessibility enhancements
function initAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#overview';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'fixed';
    skipLink.style.top = '10px';
    skipLink.style.left = '10px';
    skipLink.style.zIndex = '9999';
    skipLink.style.background = 'var(--color-primary)';
    skipLink.style.color = 'var(--color-btn-primary-text)';
    skipLink.style.padding = '8px 16px';
    skipLink.style.borderRadius = '4px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.transform = 'translateY(-100%)';
    skipLink.style.transition = 'transform 0.3s';
    
    skipLink.addEventListener('focus', function() {
        this.style.transform = 'translateY(0)';
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.transform = 'translateY(-100%)';
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Improve focus management
    const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.setAttribute('data-focus', 'true');
        });
        
        element.addEventListener('blur', function() {
            this.removeAttribute('data-focus');
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// Error handling for missing elements
function handleMissingElements() {
    const requiredElements = [
        '.nav__link',
        '.section[id]',
        '.nav-toggle',
        '.nav__list'
    ];
    
    requiredElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`Missing required elements: ${selector}`);
        }
    });
}

// Run error handling
document.addEventListener('DOMContentLoaded', handleMissingElements);

// Export functions for potential external use
window.MarketAnalysisDashboard = {
    updateActiveNavLink,
    closeMobileMenu,
    smoothScrollTo
};