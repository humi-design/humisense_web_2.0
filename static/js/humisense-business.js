/**
 * Humisense Business Website JavaScript
 * Premium Business Consulting Experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize Business Performance Scan
    initBusinessScan();
    
    // Initialize floating CTA visibility
    initFloatingCTA();
});

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Business Performance Scan
 */
function initBusinessScan() {
    const form = document.getElementById('scanForm');
    const progressFill = document.getElementById('scanProgress');
    const currentStepEl = document.getElementById('currentStep');
    const backBtn = document.getElementById('scanBack');
    const nextBtn = document.getElementById('scanNext');
    const resultsContainer = document.getElementById('scanResults');
    const scanContainer = document.querySelector('.scan-container');
    
    if (!form) return;
    
    let currentStep = 1;
    const totalSteps = 5;
    const formData = {};
    
    // Update UI
    function updateUI() {
        // Update progress
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
        currentStepEl.textContent = currentStep;
        
        // Show/hide steps
        document.querySelectorAll('.scan-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        
        // Show/hide back button
        backBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
        
        // Update next button text
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = 'Get My Report <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        } else {
            nextBtn.innerHTML = 'Continue <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>';
        }
    }
    
    // Validate current step
    function validateStep() {
        const currentStepEl = document.querySelector(`.scan-step[data-step="${currentStep}"]`);
        const requiredField = currentStepEl.querySelector('[required]');
        
        if (requiredField) {
            if (requiredField.type === 'radio') {
                const checked = currentStepEl.querySelector('input[name="' + requiredField.name + '"]:checked');
                return !!checked;
            } else {
                return requiredField.value.trim() !== '';
            }
        }
        return true;
    }
    
    // Handle next
    nextBtn.addEventListener('click', function() {
        if (!validateStep()) {
            // Highlight the required field
            const currentStepEl = document.querySelector(`.scan-step[data-step="${currentStep}"]`);
            const requiredField = currentStepEl.querySelector('[required]');
            if (requiredField) {
                requiredField.focus();
                requiredField.parentElement.style.borderColor = '#ef4444';
                setTimeout(() => {
                    requiredField.parentElement.style.borderColor = '';
                }, 1500);
            }
            return;
        }
        
        // Save current step data
        const currentStepEl = document.querySelector(`.scan-step[data-step="${currentStep}"]`);
        if (currentStep === 5) {
            // Final step - collect all form data
            const inputs = currentStepEl.querySelectorAll('input');
            inputs.forEach(input => {
                formData[input.name] = input.value;
            });
            showResults();
        } else {
            // Save radio selection
            const checkedRadio = currentStepEl.querySelector('input:checked');
            if (checkedRadio) {
                formData[checkedRadio.name] = checkedRadio.value;
            }
            
            currentStep++;
            updateUI();
        }
    });
    
    // Handle back
    backBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });
    
    // Show results
    function showResults() {
        // Hide form, show results
        scanContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        // In a real implementation, this would send data to backend
        // and receive personalized results. For now, we show sample results.
        console.log('Form submitted:', formData);
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Handle radio button selection auto-advance
    document.querySelectorAll('.step-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Small delay to show selection before advancing
            setTimeout(() => {
                if (currentStep < totalSteps) {
                    nextBtn.click();
                }
            }, 300);
        });
    });
    
    // Initialize
    updateUI();
}

/**
 * Floating CTA Visibility
 */
function initFloatingCTA() {
    const floatingCTA = document.getElementById('floatingCTA');
    const mobileCTA = document.getElementById('mobileStickyCTA');
    
    if (!floatingCTA || !mobileCTA) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Show floating CTA after scrolling past hero
        if (currentScroll > window.innerHeight * 0.5) {
            floatingCTA.style.opacity = '1';
            floatingCTA.style.transform = 'translateY(0)';
        } else {
            floatingCTA.style.opacity = '0';
            floatingCTA.style.transform = 'translateY(20px)';
        }
        
        // On mobile, hide floating CTA and show sticky
        if (window.innerWidth <= 768) {
            floatingCTA.style.display = 'none';
            mobileCTA.style.display = 'block';
        } else {
            floatingCTA.style.display = 'flex';
            mobileCTA.style.display = 'none';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Initial check
    if (window.innerWidth <= 768) {
        floatingCTA.style.display = 'none';
        mobileCTA.style.display = 'block';
    }
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Form validation styling
 */
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ef4444';
        this.classList.add('shake');
        
        setTimeout(() => {
            this.style.borderColor = '';
            this.classList.remove('shake');
        }, 1500);
    });
    
    input.addEventListener('input', function() {
        this.style.borderColor = '';
    });
});

/**
 * Stats counter animation (for trust section)
 */
function animateCounters() {
    const counters = document.querySelectorAll('.trust-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isNumber = /^[\$0-9,\.]+/.test(target);
        
        if (!isNumber) return;
        
        const hasPlus = target.includes('+');
        const hasDollar = target.includes('$');
        
        let numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
        const originalText = target.replace(/[0-9,.\$]/g, '');
        
        let current = 0;
        const increment = numericValue / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < numericValue) {
                let displayValue = Math.floor(current);
                if (hasDollar) displayValue = '$' + displayValue.toLocaleString();
                else displayValue = displayValue.toLocaleString();
                if (hasPlus) displayValue += '+';
                counter.textContent = displayValue;
                setTimeout(updateCounter, stepTime);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when trust section is visible
const trustObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            trustObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const trustSection = document.querySelector('.trust-section');
if (trustSection) {
    trustObserver.observe(trustSection);
}
