/**
 * TraxDinosaur's Wizarding World - Visual Effects
 * Handles advanced visual effects and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all visual effects
    // Slight delay to avoid initial performance hit
    setTimeout(() => {
        initializeParticleEffects();
        initializeCardEffects();
        initializeTextAnimations();
    }, 200);
});

/**
 * Creates and manages floating particle effects
 */
function initializeParticleEffects() {
    // Create floating particles container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    document.body.appendChild(particleContainer);
    
    // Create particles
    const particleCount = window.innerWidth < 768 ? 15 : 30; // Fewer particles on mobile
    
    for (let i = 0; i < particleCount; i++) {
        createFloatingParticle(particleContainer);
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Clear existing particles
            particleContainer.innerHTML = '';
            
            // Create new particles based on new window size
            const newParticleCount = window.innerWidth < 768 ? 15 : 30;
            for (let i = 0; i < newParticleCount; i++) {
                createFloatingParticle(particleContainer);
            }
        }, 200);
    });
}

/**
 * Creates a single floating magical particle
 */
function createFloatingParticle(container) {
    const particle = document.createElement('div');
    
    // Random size (tiny)
    const size = Math.random() * 5 + 2;
    
    // Random starting position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random opacity and color
    const opacity = Math.random() * 0.5 + 0.1;
    const hue = Math.random() > 0.5 ? '260' : '45'; // Purple or gold
    
    // Random animation duration and delay
    const animDuration = Math.random() * 20 + 10;
    const animDelay = Math.random() * 10;
    
    particle.style.cssText = `
        position: absolute;
        left: ${posX}%;
        top: ${posY}%;
        width: ${size}px;
        height: ${size}px;
        background-color: hsla(${hue}, 100%, 70%, ${opacity});
        border-radius: 50%;
        filter: blur(1px);
        box-shadow: 0 0 ${size}px hsla(${hue}, 100%, 70%, ${opacity});
        animation: float-particle ${animDuration}s infinite ${animDelay}s ease-in-out;
    `;
    
    container.appendChild(particle);
}

/**
 * Initializes 3D effect for cards
 */
function initializeCardEffects() {
    // Add 3D tilt effect to website cards
    const websiteCards = document.querySelectorAll('.website-card');
    
    websiteCards.forEach(card => {
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
    
    // Add magic effect to social cards
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('mouseover', magicIconEffect);
    });
}

/**
 * Handles the 3D tilt effect based on mouse position
 */
function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Get mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 10; // max 10 degrees
    const rotateX = -((y - centerY) / centerY) * 10; // max 10 degrees
    
    // Apply the transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    
    // Add highlight effect
    const mouseXPercent = Math.round((x / rect.width) * 100);
    const mouseYPercent = Math.round((y / rect.height) * 100);
    
    card.style.background = `radial-gradient(circle at ${mouseXPercent}% ${mouseYPercent}%, rgba(58, 50, 118, 0.4), rgba(12, 10, 32, 0.8))`;
}

/**
 * Resets card tilt when mouse leaves
 */
function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.background = 'linear-gradient(145deg, rgba(58, 50, 118, 0.2), rgba(12, 10, 32, 0.6))';
}

/**
 * Creates a magical effect for social card icons
 */
function magicIconEffect(e) {
    const icon = e.currentTarget.querySelector('i');
    
    // Temporarily add the custom magic class
    icon.classList.add('icon-magic');
    
    // Add the CSS animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        .icon-magic {
            animation: icon-pulse 0.6s ease-out;
        }
        
        @keyframes icon-pulse {
            0% {
                transform: scale(1);
                filter: brightness(1);
            }
            50% {
                transform: scale(1.4);
                filter: brightness(1.5) drop-shadow(0 0 8px currentColor);
            }
            100% {
                transform: scale(1);
                filter: brightness(1);
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Remove the class after animation completes
    setTimeout(() => {
        icon.classList.remove('icon-magic');
    }, 600);
}

/**
 * Initializes text animation effects
 */
function initializeTextAnimations() {
    // Create magical text reveal effect
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    
    sectionHeaders.forEach(header => {
        // Split text into spans for letter-by-letter animation
        const text = header.textContent;
        let newHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                newHTML += ' ';
            } else {
                newHTML += `<span style="animation-delay: ${i * 0.1}s">${text[i]}</span>`;
            }
        }
        
        header.innerHTML = newHTML;
        
        // Apply animation when in viewport
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.animation = 'text-reveal 0.5s forwards';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(header);
    });
    
    // Add magical hover effect to footer
    const footer = document.querySelector('footer');
    
    footer.addEventListener('mouseenter', () => {
        const heart = footer.querySelector('.magic-heart');
        heart.style.animation = 'float 1s infinite alternate';
        
        // Create sparkling effect around the heart
        const interval = setInterval(() => {
            const heartRect = heart.getBoundingClientRect();
            
            // Random position around the heart
            const x = heartRect.left + heartRect.width / 2 + (Math.random() - 0.5) * 30;
            const y = heartRect.top + heartRect.height / 2 + (Math.random() - 0.5) * 30;
            
            createSparkleAt(x, y);
        }, 300);
        
        // Store the interval ID
        footer.dataset.sparkleInterval = interval;
    });
    
    footer.addEventListener('mouseleave', () => {
        const heart = footer.querySelector('.magic-heart');
        heart.style.animation = 'pulse 1.5s infinite';
        
        // Clear the sparkling interval
        clearInterval(parseInt(footer.dataset.sparkleInterval));
    });
    
    // Add CSS for the text reveal
    const style = document.createElement('style');
    style.textContent = `
        .section-header h2 span {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
        }
        
        @keyframes text-reveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes float-particle {
            0%, 100% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Creates a sparkle at a specific position
 */
function createSparkleAt(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkling-effect';
    
    // Random size
    const size = Math.random() * 8 + 4;
    
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Random animation duration
    sparkle.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
    
    document.body.appendChild(sparkle);
    
    // Remove the element after animation completes
    setTimeout(() => {
        if (document.body.contains(sparkle)) {
            document.body.removeChild(sparkle);
        }
    }, 1000);
}

// Add event listener for page visibility changes to pause animations when tab is inactive
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause intensive animations when page is not visible
        document.body.classList.add('animations-paused');
    } else {
        // Resume animations when page becomes visible again
        document.body.classList.remove('animations-paused');
    }
});

// Add the CSS for pausing animations
const pauseStyle = document.createElement('style');
pauseStyle.textContent = `
    .animations-paused * {
        animation-play-state: paused !important;
        transition: none !important;
    }
`;
document.head.appendChild(pauseStyle);
