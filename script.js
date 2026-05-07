// ============================================
// PORTFOLIO ENHANCEMENT SCRIPT
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    setupNavigation();
    setupScrollAnimations();
    setupThemeToggle();
    setupMobileMenu();
    setupFormValidation();
    setupScrollToTop();
    loadUserData();
}

// ============================================
// 1. NAVIGATION & ACTIVE LINK HIGHLIGHTING
// ============================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // Add click event for smooth navigation
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ============================================
// 2. SCROLL ANIMATION EFFECTS
// ============================================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add initial styles and observe elements
    document.querySelectorAll('main, .profile-info, .profile-picture').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ============================================
// 3. DARK MODE THEME TOGGLE
// ============================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
}

// ============================================
// 4. MOBILE MENU TOGGLE
// ============================================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('header nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when link is clicked
        document.querySelectorAll('header nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// ============================================
// 5. FORM VALIDATION & ENHANCED LOCALSTORAGE
// ============================================
function setupFormValidation() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('focus', () => clearInputError(input));
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const inputType = input.type;
    
    if (value === '') {
        showInputError(input, 'This field is required');
        return false;
    }
    
    if (inputType === 'email' && !isValidEmail(value)) {
        showInputError(input, 'Please enter a valid email');
        return false;
    }
    
    clearInputError(input);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showInputError(input, message) {
    clearInputError(input);
    input.classList.add('error');
    
    const errorMsg = document.createElement('small');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    input.parentNode.insertBefore(errorMsg, input.nextSibling);
}

function clearInputError(input) {
    input.classList.remove('error');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

// ============================================
// 6. ENHANCED LOCALSTORAGE FUNCTIONS
// ============================================
function saveData() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    if (!nameInput || !emailInput) {
        console.error('Form inputs not found');
        return;
    }
    
    // Validate inputs
    if (!validateInput(nameInput) || !validateInput(emailInput)) {
        showNotification('Please fix the errors before saving', 'error');
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Save to localStorage with timestamp
    const userData = {
        name: name,
        email: email,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    showNotification('Data saved successfully!', 'success');
    
    // Clear form
    nameInput.value = '';
    emailInput.value = '';
}

function getData() {
    const outputDiv = document.getElementById('output');
    if (!outputDiv) return;
    
    const userDataStr = localStorage.getItem('userData');
    
    if (!userDataStr) {
        outputDiv.innerHTML = '<p class="info-message">No data found. Please save your information first.</p>';
        showNotification('No saved data found', 'info');
        return;
    }
    
    try {
        const userData = JSON.parse(userDataStr);
        const savedTime = new Date(userData.savedAt).toLocaleString();
        
        outputDiv.innerHTML = `
            <div class="user-data-display">
                <p><strong>Name:</strong> ${escapeHtml(userData.name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(userData.email)}</p>
                <p class="saved-time"><small>Last saved: ${savedTime}</small></p>
            </div>
        `;
        showNotification('Data retrieved successfully!', 'success');
    } catch (error) {
        outputDiv.innerHTML = '<p class="error-message">Error retrieving data</p>';
        console.error('Error parsing user data:', error);
    }
}

function clearData() {
    if (confirm('Are you sure you want to delete all saved data?')) {
        localStorage.removeItem('userData');
        const outputDiv = document.getElementById('output');
        if (outputDiv) outputDiv.innerHTML = '';
        showNotification('All data cleared successfully!', 'success');
    }
}

function loadUserData() {
    // Auto-load data on page load if it exists
    const outputDiv = document.getElementById('output');
    if (outputDiv && localStorage.getItem('userData')) {
        getData();
    }
}

// ============================================
// 7. NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// 8. SCROLL TO TOP BUTTON
// ============================================
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 9. UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// 10. SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// 11. KEYBOARD ACCESSIBILITY
// ============================================
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('header nav ul');
        const menuToggle = document.getElementById('menu-toggle');
        if (navMenu) navMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    }
});

// ============================================
// 12. PERFORMANCE: DEBOUNCE FUNCTION
// ============================================
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

// Apply debounce to scroll events
window.addEventListener('resize', debounce(() => {
    console.log('Window resized');
}, 250));

console.log('Portfolio script loaded successfully! ✨');