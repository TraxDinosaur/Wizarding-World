/**
 * TraxDinosaur's Wizarding World - Magical Portals
 * Handles the interactive portal animations and effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize portal effects
    initializePortals();
    setupPortalInteractions();
});

/**
 * Initializes portal animations and effects
 */
function initializePortals() {
    // Get the portal elements
    const portals = document.querySelectorAll('.portal');
    
    // Apply initial staggered animation
    portals.forEach((portal, index) => {
        // Set a staggered delay for initial appearance
        const delay = index * 0.3;
        portal.style.animationDelay = `${delay}s`;
        
        // Create magical energy flow around portals
        createPortalEnergyFlow(portal);
    });
}

/**
 * Creates magical energy flow around portals
 */
function createPortalEnergyFlow(portal) {
    // Create multiple particle emitters around the portal
    const portalRect = portal.getBoundingClientRect();
    const centerX = portalRect.left + portalRect.width / 2;
    const centerY = portalRect.top + portalRect.height / 2;
    const radius = portalRect.width / 2;
    
    // Create energy particles container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'portal-particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
    `;
    portal.appendChild(particleContainer);
    
    // Add event listener for portal hover
    portal.addEventListener('mouseenter', () => {
        // Start emitting particles
        const emitterInterval = setInterval(() => {
            for (let i = 0; i < 2; i++) { // Create 2 particles at a time
                createEnergyParticle(particleContainer, centerX, centerY, radius);
            }
        }, 100);
        
        // Store the interval ID for cleanup
        portal.dataset.emitterInterval = emitterInterval;
    });
    
    portal.addEventListener('mouseleave', () => {
        // Stop emitting particles
        clearInterval(parseInt(portal.dataset.emitterInterval));
    });
}

/**
 * Creates a single energy particle for the portal effect
 */
function createEnergyParticle(container, centerX, centerY, radius) {
    const particle = document.createElement('div');
    
    // Random angle around the portal
    const angle = Math.random() * Math.PI * 2;
    
    // Random distance from center (within portal radius)
    const distance = radius * 0.7 + Math.random() * radius * 0.3;
    
    // Calculate position
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // Random size (small)
    const size = Math.random() * 4 + 2;
    
    // Color based on which portal
    let color;
    if (container.closest('#hosting-portal')) {
        color = `hsl(${220 + Math.random() * 40}, 100%, 70%)`; // Blue hues
    } else {
        color = `hsl(${45 + Math.random() * 30}, 100%, 70%)`; // Gold hues
    }
    
    particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        filter: blur(1px);
        opacity: 0.8;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1;
        animation: portal-particle 1.5s forwards ease-out;
    `;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        if (document.body.contains(particle)) {
            document.body.removeChild(particle);
        }
    }, 1500);
}

/**
 * Sets up interactive effects for the portals
 */
function setupPortalInteractions() {
    const hostingPortal = document.getElementById('hosting-portal');
    const telegramPortal = document.getElementById('telegram-portal');
    
    // Add custom effects for each portal type
    if (hostingPortal) {
        setupHostingPortal(hostingPortal);
    }
    
    if (telegramPortal) {
        setupTelegramPortal(telegramPortal);
    }
    
    // Add CSS for portal particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes portal-particle {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
            20% {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 0.8;
            }
            100% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Sets up special effects for the hosting portal
 */
function setupHostingPortal(portal) {
    const portalRing = portal.querySelector('.portal-ring');
    
    // Add server rack visualization inside the portal
    const serverIcon = portal.querySelector('.portal-icon i');
    serverIcon.style.textShadow = '0 0 10px var(--accent-blue)';
    
    // Add data streams visual effect
    for (let i = 0; i < 3; i++) {
        const dataStream = document.createElement('div');
        dataStream.className = 'data-stream';
        dataStream.style.cssText = `
            position: absolute;
            width: 2px;
            height: ${10 + i * 5}px;
            background-color: var(--accent-blue);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(${i * 120}deg) translateY(-30px);
            opacity: 0.7;
            filter: blur(1px);
            box-shadow: 0 0 5px var(--accent-blue);
            animation: data-stream 1.5s infinite ${i * 0.5}s;
        `;
        portal.appendChild(dataStream);
    }
    
    // Add animation for data streams
    const dataStreamStyle = document.createElement('style');
    dataStreamStyle.textContent = `
        @keyframes data-stream {
            0%, 100% {
                height: 10px;
                opacity: 0.5;
            }
            50% {
                height: 25px;
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(dataStreamStyle);
    
    // Add click effect for portal
    portal.addEventListener('click', (e) => {
        // Pulse effect on click before navigation
        portalRing.style.animation = 'none';
        portalRing.offsetHeight; // Trigger reflow
        portalRing.style.animation = 'spin 8s linear infinite, pulse 0.5s forwards';
        
        // Create expanding circle effect
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background-color: var(--accent-blue);
            border-radius: 50%;
            z-index: 5;
            opacity: 0.8;
            animation: circle-expand 0.5s forwards;
        `;
        portal.appendChild(circle);
        
        // Circle expand animation
        const circleStyle = document.createElement('style');
        circleStyle.textContent = `
            @keyframes circle-expand {
                to {
                    width: 250px;
                    height: 250px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(circleStyle);
        
        // Clean up after navigation
        setTimeout(() => {
            if (portal.contains(circle)) {
                portal.removeChild(circle);
            }
        }, 500);
    });
}

/**
 * Sets up special effects for the Telegram portal
 */
function setupTelegramPortal(portal) {
    const portalRing = portal.querySelector('.portal-ring');
    
    // Add Telegram-specific effects
    const telegramIcon = portal.querySelector('.portal-icon i');
    telegramIcon.style.textShadow = '0 0 10px var(--accent-gold)';
    
    // Add floating message bubbles
    for (let i = 0; i < 4; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        // Alternate between circle and square bubbles
        const isCircle = i % 2 === 0;
        const size = 6 + i * 2;
        
        bubble.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: var(--accent-gold);
            ${isCircle ? 'border-radius: 50%;' : 'border-radius: 2px;'}
            left: ${50 + (i * 10) * (i % 2 === 0 ? 1 : -1)}%;
            top: ${50 + (i * 5) * (i % 3 === 0 ? 1 : -1)}%;
            opacity: 0.6;
            filter: blur(1px);
            box-shadow: 0 0 3px var(--accent-gold);
            animation: float-message ${1.5 + i * 0.5}s infinite ${i * 0.3}s ease-in-out;
            z-index: 1;
        `;
        portal.appendChild(bubble);
    }
    
    // Add animation for message bubbles
    const bubbleStyle = document.createElement('style');
    bubbleStyle.textContent = `
        @keyframes float-message {
            0%, 100% {
                transform: translateY(0) scale(1);
            }
            50% {
                transform: translateY(-${Math.random() * 15 + 5}px) scale(1.1);
            }
        }
    `;
    document.head.appendChild(bubbleStyle);
    
    // Add click effect for portal
    portal.addEventListener('click', (e) => {
        // Pulse effect on click before navigation
        portalRing.style.animation = 'none';
        portalRing.offsetHeight; // Trigger reflow
        portalRing.style.animation = 'spin 8s linear infinite, pulse 0.5s forwards';
        
        // Create expanding paper airplane effect
        const airplane = document.createElement('div');
        airplane.innerHTML = `<i class="fas fa-paper-plane"></i>`;
        airplane.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--accent-gold);
            font-size: 20px;
            z-index: 5;
            animation: airplane-expand 0.5s forwards;
        `;
        portal.appendChild(airplane);
        
        // Airplane animation
        const airplaneStyle = document.createElement('style');
        airplaneStyle.textContent = `
            @keyframes airplane-expand {
                0% {
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(3) rotate(45deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(airplaneStyle);
        
        // Clean up after navigation
        setTimeout(() => {
            if (portal.contains(airplane)) {
                portal.removeChild(airplane);
            }
        }, 500);
    });
}

// Handle portal positioning on window resize
window.addEventListener('resize', () => {
    // Get portals again in case the DOM has changed
    const portals = document.querySelectorAll('.portal');
    
    // Clear existing energy particles
    document.querySelectorAll('.portal-particles').forEach(container => {
        container.innerHTML = '';
    });
    
    // Reinitialize portal effects after a short delay
    setTimeout(() => {
        portals.forEach(portal => {
            // Clear any existing intervals
            if (portal.dataset.emitterInterval) {
                clearInterval(parseInt(portal.dataset.emitterInterval));
            }
            
            // Create new energy flow
            createPortalEnergyFlow(portal);
        });
    }, 300);
});

// Add parallax effect to portals on mouse move
let parallaxTimeout;
document.addEventListener('mousemove', (e) => {
    clearTimeout(parallaxTimeout);
    
    parallaxTimeout = setTimeout(() => {
        const portalsSection = document.querySelector('.portals-section');
        if (!portalsSection) return;
        
        const rect = portalsSection.getBoundingClientRect();
        
        // Check if mouse is over the portals section
        if (
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom && 
            e.clientX >= rect.left && 
            e.clientX <= rect.right
        ) {
            // Calculate mouse position relative to the section center
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / rect.width;
            const deltaY = (e.clientY - centerY) / rect.height;
            
            // Apply subtle parallax to portals
            const portals = document.querySelectorAll('.portal');
            portals.forEach((portal, index) => {
                const multiplier = index % 2 === 0 ? 1 : -1;
                const offsetX = deltaX * 10 * multiplier;
                const offsetY = deltaY * 10 * multiplier;
                
                portal.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        }
    }, 10); // Small debounce for performance
});
