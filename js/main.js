/**
 * TraxDinosaur's Wizarding World - Main JavaScript
 * Controls core functionality, cursor effects, and audio system
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up custom cursor right away for best performance
    setupCustomCursor();

    // Initialize other effects and audio after a slight delay to prioritize cursor
    setTimeout(() => {
        // Initialize audio context when user interacts with the page
        let audioInitialized = false;
        const initAudio = async () => {
            if (audioInitialized) return;
            
            try {
                await Tone.start();
                setupAudioEffects();
                audioInitialized = true;
                
                // Remove the initialization events once audio is started
                document.removeEventListener('click', initAudio);
                document.removeEventListener('touchstart', initAudio);
            } catch (error) {
                console.error('Error initializing audio:', error);
            }
        };
        
        document.addEventListener('click', initAudio);
        document.addEventListener('touchstart', initAudio);
        
        // Initialize other effects
        setupScrollEffects();
        createStarryBackground();
        
        // Add magic to elements
        addMagicToElements();
        
        // Performance optimization
        optimizePerformance();
    }, 100);
});

/**
 * Sets up custom cursor effects
 */
// Using simplified cursor system in simplecursor.js instead
function setupCustomCursor() {
    // Skip cursor setup since it's handled in the simplified version
    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
    
    // Add cursor-hide class to html element to ensure all elements use the custom cursor
    document.documentElement.classList.add('cursor-hide');
    
    // Add global style for cursor hiding
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .cursor-hide, .cursor-hide * {
            cursor: none !important;
        }
    `;
    document.head.appendChild(cursorStyle);
    
    // Direct cursor positioning without delay
    function updateCursorPosition(e) {
        // Update cursor directly for immediate response
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Update trail with slight delay for effect
        setTimeout(() => {
            cursorTrail.style.left = `${e.clientX}px`;
            cursorTrail.style.top = `${e.clientY}px`;
        }, 50);
    }
    
    // Set initial visibility
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '0.6';
    
    // Use direct positioning for immediate response
    window.addEventListener('mousemove', updateCursorPosition, { passive: true });
    
    // Fix for cursor disappearing in some elements
    const sections = document.querySelectorAll('section, header, footer, .container, main');
    sections.forEach(section => {
        section.addEventListener('mousemove', updateCursorPosition, { passive: true });
        section.addEventListener('mouseenter', updateCursorPosition, { passive: true });
    });
    
    // Change cursor appearance on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    
    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', (e) => {
            updateCursorPosition(e);
            cursor.classList.add('hover');
            cursorTrail.style.backgroundColor = 'var(--accent-gold)';
            cursorTrail.style.opacity = '0.8';
        });
        
        elem.addEventListener('mouseleave', (e) => {
            updateCursorPosition(e);
            cursor.classList.remove('hover');
            cursorTrail.style.backgroundColor = 'var(--accent-purple)';
            cursorTrail.style.opacity = '0.6';
        });
    });
    
    // Add click effect
    document.addEventListener('mousedown', (e) => {
        updateCursorPosition(e);
        cursor.classList.add('active');
    });
    
    document.addEventListener('mouseup', (e) => {
        updateCursorPosition(e);
        cursor.classList.remove('active');
    });
    
    // Fix for cursor sometimes disappearing at page boundaries
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorTrail.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', (e) => {
        updateCursorPosition(e);
        cursor.style.opacity = '1';
        cursorTrail.style.opacity = '0.6';
    });
    
    // Make sure cursor stays visible during scroll
    window.addEventListener('scroll', () => {
        // Get the last known mouse position from trail
        const lastX = parseInt(cursorTrail.style.left || '0');
        const lastY = parseInt(cursorTrail.style.top || '0');
        
        // Keep cursor visible during scrolling
        cursor.style.left = `${lastX}px`;
        cursor.style.top = `${lastY}px`;
        cursorTrail.style.left = `${lastX}px`;
        cursorTrail.style.top = `${lastY}px`;
    }, { passive: true });
    
    // Keep cursor visible during rapid movements
    setInterval(() => {
        if (parseInt(cursor.style.opacity || '0') === 0 && 
            document.hasFocus() && 
            document.querySelector(':hover')) {
            cursor.style.opacity = '1';
            cursorTrail.style.opacity = '0.6';
        }
    }, 100);
}

/**
 * Sets up audio effects system using Tone.js
 */
function setupAudioEffects() {
    // Create synth for magical sounds
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.volume.value = -15; // Lower volume for better user experience
    
    // Effects for sound processing
    const reverb = new Tone.Reverb({
        decay: 2,
        wet: 0.5
    }).toDestination();
    
    const feedbackDelay = new Tone.FeedbackDelay({
        delayTime: 0.25,
        feedback: 0.3,
        wet: 0.2
    }).connect(reverb);
    
    synth.connect(feedbackDelay);
    
    // Magic sound on hover for special elements
    const magicElements = document.querySelectorAll('.social-card, .portal, .website-card');
    
    magicElements.forEach((elem, index) => {
        // Create unique but harmonically related notes for each element
        const notes = [
            'C5', 'E5', 'G5', 'B5',  // C major 7th
            'D5', 'F#5', 'A5', 'C6', // D major 7th
            'E5', 'G#5', 'B5', 'D6'  // E major 7th
        ];
        
        elem.addEventListener('mouseenter', () => {
            // Choose a note based on element index
            const note = notes[index % notes.length];
            
            // Play a short glissando (note slide)
            synth.triggerAttackRelease(note, '0.1');
            setTimeout(() => {
                synth.triggerAttackRelease(Tone.Frequency(note).transpose(4), '0.1');
            }, 100);
        });
        
        elem.addEventListener('click', () => {
            // Play a magic chord on click
            const noteIndex = index % notes.length;
            const baseNote = notes[noteIndex];
            const freq = Tone.Frequency(baseNote);
            
            synth.triggerAttackRelease(baseNote, '0.15');
            setTimeout(() => {
                synth.triggerAttackRelease(freq.transpose(4), '0.15');
            }, 100);
            setTimeout(() => {
                synth.triggerAttackRelease(freq.transpose(7), '0.15');
            }, 200);
        });
    });
    
    // Magical ambient background sound (very subtle)
    const createAmbience = () => {
        const noise = new Tone.Noise('pink').start();
        const filter = new Tone.Filter({
            type: 'bandpass',
            frequency: 300,
            Q: 0.6
        });
        
        const volumeNode = new Tone.Volume(-40); // Very quiet
        noise.connect(filter);
        filter.connect(volumeNode);
        volumeNode.connect(reverb);
        
        // Slowly modulate filter for magical atmosphere
        const filterLfo = new Tone.LFO({
            frequency: 0.05,
            min: 200,
            max: 1000
        }).connect(filter.frequency).start();
    };
    
    // Only create ambience on user request to save resources
    const audioToggle = document.createElement('div');
    audioToggle.className = 'audio-toggle';
    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    audioToggle.style.position = 'fixed';
    audioToggle.style.bottom = '20px';
    audioToggle.style.right = '20px';
    audioToggle.style.zIndex = '1000';
    audioToggle.style.padding = '10px';
    audioToggle.style.borderRadius = '50%';
    audioToggle.style.backgroundColor = 'var(--primary-light)';
    audioToggle.style.cursor = 'pointer';
    audioToggle.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    
    let ambienceActive = false;
    audioToggle.addEventListener('click', () => {
        if (!ambienceActive) {
            createAmbience();
            audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            ambienceActive = true;
        } else {
            // Note: Tone.js doesn't easily allow stopping of created sources
            // This would be a feature enhancement
            audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            ambienceActive = false;
        }
    });
    
    document.body.appendChild(audioToggle);
}

/**
 * Creates a starry effect in the background
 */
function createStarryBackground() {
    const twinkling = document.querySelector('.twinkling');
    
    // Create extra stars that twinkle on their own cycle
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'extra-star';
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size (small)
        const size = Math.random() * 3 + 1;
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        star.style.cssText = `
            position: absolute;
            left: ${left}%;
            top: ${top}%;
            width: ${size}px;
            height: ${size}px;
            background-color: white;
            border-radius: 50%;
            animation: twinkle ${3 + Math.random() * 3}s infinite ${delay}s alternate;
        `;
        
        twinkling.appendChild(star);
    }
}

/**
 * Adds subtle scroll effects to elements
 */
function setupScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    // Simple on-scroll animation
    const fadeInElements = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Setup intersection observer
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(fadeInElements, options);
    
    // Apply fade-in class and observe sections
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Add CSS for the fade-in effect
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Adds magical effects to various elements
 */
function addMagicToElements() {
    // Add sparkle effect on click
    document.addEventListener('click', createSparkleEffect);
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.social-card, .website-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            createMagicDust(card, 10);
        });
    });
    
    // Add special effect to portal links
    const portals = document.querySelectorAll('.portal');
    portals.forEach(portal => {
        // Initial setup for portal animation
        portal.style.opacity = '0';
        portal.style.transform = 'scale(0)';
        
        // Animate portal when in viewport
        const animatePortal = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'portal-open 1.5s forwards ease-out';
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const portalObserver = new IntersectionObserver(animatePortal, {
            threshold: 0.1
        });
        
        portalObserver.observe(portal);
        
        // Custom effect for portal hover
        portal.addEventListener('mouseenter', () => {
            const portalRing = portal.querySelector('.portal-ring');
            portalRing.style.borderWidth = '4px';
            portalRing.style.filter = 'brightness(1.5) blur(2px)';
            
            createMagicDust(portal, 15);
        });
        
        portal.addEventListener('mouseleave', () => {
            const portalRing = portal.querySelector('.portal-ring');
            portalRing.style.borderWidth = '3px';
            portalRing.style.filter = 'none';
        });
    });
}

/**
 * Creates sparkle effect at mouse position
 */
function createSparkleEffect(e) {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkling-effect';
        
        // Random position around the click
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        
        // Random size
        const size = Math.random() * 10 + 5;
        
        sparkle.style.left = `${e.clientX + offsetX}px`;
        sparkle.style.top = `${e.clientY + offsetY}px`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        // Random animation duration
        sparkle.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        
        document.body.appendChild(sparkle);
        
        // Remove the element after animation completes
        setTimeout(() => {
            document.body.removeChild(sparkle);
        }, 1500);
    }
}

/**
 * Creates magic dust particles around an element
 */
function createMagicDust(element, count) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < count; i++) {
        const dust = document.createElement('div');
        dust.className = 'magic-dust';
        
        // Random position around the element
        const leftPos = rect.left + Math.random() * rect.width;
        const topPos = rect.top + rect.height - 10 + Math.random() * 20;
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random color (gold or purple)
        const colors = ['var(--accent-gold)', 'var(--accent-purple)', 'var(--accent-blue)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        dust.style.left = `${leftPos}px`;
        dust.style.top = `${topPos}px`;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        dust.style.backgroundColor = color;
        
        // Random animation duration
        dust.style.animationDuration = `${Math.random() * 1.5 + 0.5}s`;
        
        document.body.appendChild(dust);
        
        // Remove the element after animation completes
        setTimeout(() => {
            if (document.body.contains(dust)) {
                document.body.removeChild(dust);
            }
        }, 2000);
    }
}

/**
 * Optimizes performance for high FPS
 */
function optimizePerformance() {
    // Use lightweight animation methods
    const animatedElements = document.querySelectorAll('.social-card, .website-card, .portal');
    
    // Apply will-change sparingly and only to elements that need it
    animatedElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            elem.style.willChange = 'transform, opacity';
        });
        
        elem.addEventListener('mouseleave', () => {
            // Remove will-change after animations complete
            setTimeout(() => {
                elem.style.willChange = 'auto';
            }, 500);
        });
    });
    
    // Add a favicon to prevent 404 errors
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = './assets/wizard-hat.svg';
    document.head.appendChild(favicon);
    
    // Throttle scroll event handlers
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                // Any scroll-based effects would go here
            }, 10); // 100 fps throttle rate
        }
    }, { passive: true });
    
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                resizeTimeout = null;
                // Any resize-based adjustments would go here
            }, 100);
        }
    }, { passive: true });
    
    // Use requestIdleCallback for non-critical operations
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Preload images that might be needed later
            const imagesToPreload = ['assets/sparkle.svg', 'assets/portal-bg.svg'];
            imagesToPreload.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }, { timeout: 2000 });
    }
    
    // Prevent excessive DOM reflows
    document.body.style.contain = 'paint';
    
    // Add high-performance CSS properties
    const performanceStyles = document.createElement('style');
    performanceStyles.textContent = `
        .social-card, .website-card, .portal, .custom-cursor, .cursor-trail {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
        }
        
        @supports (transform-style: preserve-3d) {
            .card-inner {
                transform-style: preserve-3d;
            }
        }
        
        @media screen and (min-width: 1200px) {
            html {
                scroll-behavior: smooth;
            }
        }
    `;
    document.head.appendChild(performanceStyles);
}
