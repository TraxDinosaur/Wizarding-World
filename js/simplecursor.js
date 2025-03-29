/**
 * TraxDinosaur's Wizarding World - Simple Cursor
 * A lightweight, responsive cursor implementation
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create the cursor
    const cursor = document.getElementById('custom-cursor');
    
    // Hide the system cursor
    document.body.style.cursor = 'none';
    const elements = document.querySelectorAll('a, button, input, select, textarea, .social-card, .website-card, .portal');
    elements.forEach(el => el.style.cursor = 'none');
    
    // Create a style element for the hover cursor
    const style = document.createElement('style');
    style.textContent = `
        a:hover, button:hover, .social-card:hover, .website-card:hover, .portal:hover {
            cursor: none !important;
        }
        
        #custom-cursor {
            transform: translate(-50%, -50%) rotate(-15deg);
            transition: transform 0.1s ease;
        }
        
        a:hover ~ #custom-cursor, 
        button:hover ~ #custom-cursor,
        .social-card:hover ~ #custom-cursor,
        .website-card:hover ~ #custom-cursor,
        .portal:hover ~ #custom-cursor {
            transform: translate(-50%, -50%) rotate(0deg) scale(1.2);
            filter: drop-shadow(0 0 10px rgba(230, 194, 0, 0.7));
        }
    `;
    document.head.appendChild(style);
    
    // Set cursor position on mousemove with direct DOM manipulation
    // for highest performance
    document.addEventListener('mousemove', e => {
        // Using a more direct DOM method for better performance
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }, { passive: true });
    
    // Make sure all layers below can receive the cursor
    document.addEventListener('pointermove', e => {
        // Using a more direct DOM method for better performance
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }, { passive: true });
    
    // Add click animation
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) rotate(-30deg) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) rotate(-15deg) scale(1)';
    });
    
    // Handle page visibility and focus for better UX
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cursor.style.opacity = '0';
        } else {
            cursor.style.opacity = '1';
        }
    });
    
    // Make sure cursor works even on dynamic elements by listening at the document level
    document.addEventListener('mouseover', function(e) {
        if (e.target.tagName === 'A' || 
            e.target.tagName === 'BUTTON' || 
            e.target.classList.contains('social-card') ||
            e.target.classList.contains('website-card') ||
            e.target.classList.contains('portal')) {
            cursor.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1.2)';
            cursor.style.filter = 'drop-shadow(0 0 10px rgba(230, 194, 0, 0.7))';
        } else {
            cursor.style.transform = 'translate(-50%, -50%) rotate(-15deg)';
            cursor.style.filter = 'drop-shadow(0 0 5px rgba(140, 82, 255, 0.5))';
        }
    });
});